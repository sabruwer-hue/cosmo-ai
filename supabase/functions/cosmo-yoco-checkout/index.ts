import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "https://cosmo-ai.co.za",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), {status, headers:cors});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", {headers:cors});
  if (req.method !== "POST") return json({error:"Method not allowed"},405);
  const auth = req.headers.get("Authorization") || "";
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const yocoKey = Deno.env.get("COSMO_YOCO_SECRET_KEY");
  if (!url || !anon || !service || !auth.startsWith("Bearer ")) return json({error:"Sign in is required"},401);
  if (!yocoKey) return json({error:"Yoco checkout is not configured yet. Add the server-side Yoco secret key after verifying the Cosmo domain in Yoco."},503);

  const userClient = createClient(url, anon, {global:{headers:{Authorization:auth}}});
  const {data:{user},error:userError} = await userClient.auth.getUser();
  if (userError || !user) return json({error:"Invalid sign-in session"},401);

  let body:any;
  try { body = await req.json(); } catch { return json({error:"Invalid checkout request"},400); }
  const productCode = typeof body.product_code === "string" ? body.product_code.trim() : "";
  const toolCodes = Array.isArray(body.tool_codes) ? [...new Set(body.tool_codes.filter((x:any)=>typeof x==="string").map((x:string)=>x.trim()).filter(Boolean))] : [];
  if (!/^[A-Z0-9-]{3,50}$/.test(productCode) || toolCodes.length > 12) return json({error:"Invalid package or tool selection"},400);

  const db = createClient(url, service, {auth:{persistSession:false,autoRefreshToken:false}});
  const {data:product,error:productError} = await db.from("cosmo_subscription_products")
    .select("id,product_code,name,description,lifetime_price_cents,lifetime_pricing_approved,currency,active,public_enabled")
    .eq("product_code",productCode).eq("active",true).eq("public_enabled",true).single();
  if (productError || !product) return json({error:"Package not found"},404);
  if (product.currency !== "ZAR") return json({error:"Yoco checkout currently supports ZAR only"},400);
  if (!product.lifetime_pricing_approved || !Number.isInteger(product.lifetime_price_cents) || product.lifetime_price_cents < 200)
    return json({error:"The lifetime price for this package has not yet been approved and published. No payment has been taken."},409);

  const {data:owned} = await db.from("cosmo_package_entitlements").select("id,status")
    .eq("owner_id",user.id).eq("product_id",product.id).eq("status","active").maybeSingle();
  if (owned) return json({error:"This account already owns this lifetime package. Restore it from Purchased Packages instead of buying it again."},409);

  const recentCutoff = new Date(Date.now()-30*60*1000).toISOString();
  const {data:pendingCheckout} = await db.from("cosmo_yoco_checkouts")
    .select("checkout_id,redirect_url,amount_cents")
    .eq("owner_id",user.id).eq("product_id",product.id).eq("status","pending")
    .gte("created_at",recentCutoff).order("created_at",{ascending:false}).limit(1).maybeSingle();
  if (pendingCheckout?.redirect_url) return json({ok:true,redirect_url:pendingCheckout.redirect_url,amount_cents:pendingCheckout.amount_cents,currency:"ZAR",resumed:true});

  const {data:links,error:linksError} = await db.from("cosmo_subscription_product_tools")
    .select("tool_id,cosmo_subscription_tools!inner(id,tool_code,name,lifetime_price_cents,lifetime_pricing_approved,active)")
    .eq("product_id",product.id).eq("optional_addon",true).eq("cosmo_subscription_tools.active",true);
  if (linksError) return json({error:"Could not load package tools"},503);
  const available = links || [];
  const selected = available.filter((x:any)=>toolCodes.includes(x.cosmo_subscription_tools.tool_code));
  if (selected.length !== toolCodes.length) return json({error:"One or more selected tools are not available for this package"},400);
  for (const item of selected) {
    const tool = item.cosmo_subscription_tools;
    if (!tool.lifetime_pricing_approved || !Number.isInteger(tool.lifetime_price_cents) || tool.lifetime_price_cents < 0)
      return json({error:"The lifetime unlock price for " + tool.name + " has not been approved yet. Remove it from the checkout or try again later."},409);
  }

  const totalCents = Number(product.lifetime_price_cents) + selected.reduce((n:number,x:any)=>n+Number(x.cosmo_subscription_tools.lifetime_price_cents),0);
  if (!Number.isInteger(totalCents) || totalCents < 200) return json({error:"The checkout amount must be at least R2.00"},400);

  const invoiceCode = "COSMO-INV-" + crypto.randomUUID().replaceAll("-","").slice(0,12).toUpperCase();
  const lineItems = [{description:product.name + " lifetime package licence",amount_cents:product.lifetime_price_cents},
    ...selected.map((x:any)=>({description:x.cosmo_subscription_tools.name + " lifetime unlock",amount_cents:x.cosmo_subscription_tools.lifetime_price_cents}))];
  const {data:invoice,error:invoiceError} = await db.from("cosmo_invoices").insert({
    owner_id:user.id,invoice_code:invoiceCode,currency:"ZAR",subtotal_cents:totalCents,tax_cents:0,total_cents:totalCents,status:"open",line_items:lineItems
  }).select("id").single();
  if (invoiceError || !invoice) return json({error:"Could not create the purchase invoice"},500);

  const idempotencyKey = crypto.randomUUID();
  const response = await fetch("https://payments.yoco.com/api/checkouts", {
    method:"POST",
    headers:{"Authorization":"Bearer " + yocoKey,"Content-Type":"application/json","Idempotency-Key":idempotencyKey},
    body:JSON.stringify({
      amount:totalCents,currency:"ZAR",
      successUrl:"https://cosmo-ai.co.za/subscribe.html?payment=return",
      cancelUrl:"https://cosmo-ai.co.za/subscribe.html?payment=cancelled",
      failureUrl:"https://cosmo-ai.co.za/subscribe.html?payment=failed",
      clientReferenceId:invoiceCode,externalId:invoiceCode,
      metadata:{invoiceId:invoice.id,ownerId:user.id,productCode:product.product_code}
    })
  });
  const checkout = await response.json().catch(()=>({}));
  if (!response.ok || !checkout.id || !checkout.redirectUrl) {
    await db.from("cosmo_invoices").update({status:"void"}).eq("id",invoice.id).eq("owner_id",user.id);
    return json({error:"Yoco could not create the checkout session. Please try again later."},502);
  }

  const {error:saveError} = await db.from("cosmo_yoco_checkouts").insert({
    checkout_id:checkout.id,owner_id:user.id,product_id:product.id,invoice_id:invoice.id,
    tool_ids:selected.map((x:any)=>x.tool_id),amount_cents:totalCents,currency:"ZAR",status:"pending",redirect_url:checkout.redirectUrl,
    metadata:{invoice_code:invoiceCode,idempotency_key:idempotencyKey}
  });
  if (saveError) return json({error:"Checkout was created but could not be linked to the account. Contact support before retrying."},500);
  return json({ok:true,redirect_url:checkout.redirectUrl,amount_cents:totalCents,currency:"ZAR",invoice_code:invoiceCode});
});