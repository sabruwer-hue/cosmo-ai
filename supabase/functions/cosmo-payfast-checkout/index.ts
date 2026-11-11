import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash } from "node:crypto";
const cors={"Access-Control-Allow-Origin":"https://cosmo-ai.co.za","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
const enc=(v:unknown)=>encodeURIComponent(String(v??"").trim()).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%20/g,"+");
function sign(fields:Record<string,string>,pass:string){const body=Object.entries(fields).filter(([,v])=>v!=="").map(([k,v])=>k+"="+enc(v)).join("&");return createHash("md5").update(body+"&passphrase="+enc(pass)).digest("hex")}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const auth=req.headers.get("Authorization")||"",url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!anon||!service||!auth.startsWith("Bearer "))return json({error:"Authentication required"},401);
 const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
 const {data:{user},error:userError}=await userClient.auth.getUser();if(userError||!user)return json({error:"Invalid session"},401);
 const merchantId=Deno.env.get("COSMO_PAYFAST_MERCHANT_ID")||"",merchantKey=Deno.env.get("COSMO_PAYFAST_MERCHANT_KEY")||"",passphrase=Deno.env.get("COSMO_PAYFAST_PASSPHRASE")||"";
 if(!merchantId||!merchantKey||!passphrase)return json({error:"PayFast merchant credentials are not configured. Add the three server-side PayFast secrets first."},503);
 let body:any;try{body=await req.json()}catch{return json({error:"Invalid checkout request"},400)}
 const productCode=typeof body.product_code==="string"?body.product_code.trim():"";
 const toolCodes=Array.isArray(body.tool_codes)?[...new Set(body.tool_codes.filter((x:any)=>typeof x==="string").map((x:string)=>x.trim()).filter(Boolean))]:[];
 if(!/^[A-Z0-9-]{3,50}$/.test(productCode)||toolCodes.length>12)return json({error:"Invalid package or tool selection"},400);
 const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:product,error:productError}=await db.from("cosmo_subscription_products").select("id,product_code,name,description,base_price_cents,currency").eq("product_code",productCode).eq("active",true).eq("public_enabled",true).single();
 if(productError||!product)return json({error:"Package not found"},404);
 const {data:mapRows,error:mapError}=await db.from("cosmo_subscription_product_tools").select("tool_id,cosmo_subscription_tools!inner(id,tool_code,name,monthly_price_cents,active)").eq("product_id",product.id).eq("optional_addon",true).eq("cosmo_subscription_tools.active",true);
 if(mapError)return json({error:"Could not load package tools"},503);
 const available=mapRows||[];
 const selected=available.filter((x:any)=>toolCodes.includes(x.cosmo_subscription_tools.tool_code));
 if(selected.length!==toolCodes.length)return json({error:"One or more selected tools are not available for this package"},400);
 const {data:existing}=await db.from("cosmo_subscriptions").select("id,status").eq("owner_id",user.id).eq("product_id",product.id).in("status",["trialing","pending","active","past_due","paused"]).limit(1);
 if(existing?.length)return json({error:"A trial or paid subscription is already active or pending for this package. Wait for it to expire or manage it before starting checkout."},409);
 const totalCents=Number(product.base_price_cents)+selected.reduce((n:number,x:any)=>n+Number(x.cosmo_subscription_tools.monthly_price_cents),0);
 if(totalCents<500)return json({error:"The selected amount is below PayFast's minimum recurring charge."},400);
 const selectedToolCodes=selected.map((x:any)=>x.cosmo_subscription_tools.tool_code);
 const metadata={selected_tool_codes:selectedToolCodes,amount_total_cents:totalCents,checkout_created_at:new Date().toISOString()};
 const {data:sub,error:subError}=await db.from("cosmo_subscriptions").insert({owner_id:user.id,product_id:product.id,provider:"payfast",status:"pending",currency:"ZAR",base_amount_cents:product.base_price_cents,billing_interval:"month",metadata}).select("id").single();
 if(subError||!sub)return json({error:"Could not create pending subscription: "+(subError?.message||"unknown error")},500);
 const invoiceCode="COSMO-INV-"+crypto.randomUUID().replaceAll("-","").slice(0,12).toUpperCase();
 const lineItems=[{description:product.name+" base package",amount_cents:product.base_price_cents},...selected.map((x:any)=>({description:x.cosmo_subscription_tools.name,amount_cents:x.cosmo_subscription_tools.monthly_price_cents}))];
 const {error:invoiceError}=await db.from("cosmo_invoices").insert({owner_id:user.id,subscription_id:sub.id,invoice_code:invoiceCode,currency:"ZAR",subtotal_cents:totalCents,tax_cents:0,total_cents:totalCents,status:"open",line_items:lineItems});
 if(invoiceError){await db.from("cosmo_subscriptions").update({status:"expired"}).eq("id",sub.id);return json({error:"Could not create checkout invoice"},500)}
 const fullName=String(user.user_metadata?.full_name||"Cosmo Customer").trim().split(/\s+/);
 const firstName=fullName[0]||"Cosmo",lastName=fullName.slice(1).join(" ")||"Customer";
 const sandbox=(Deno.env.get("COSMO_PAYFAST_MODE")||"sandbox").toLowerCase()!=="live";
 const base="https://"+(sandbox?"sandbox.payfast.co.za":"www.payfast.co.za")+"/eng/process";
 const fields:Record<string,string>={
  merchant_id:merchantId,merchant_key:merchantKey,
  return_url:"https://cosmo-ai.co.za/subscribe.html?payment=return",
  cancel_url:"https://cosmo-ai.co.za/subscribe.html?payment=cancelled",
  notify_url:url+"/functions/v1/cosmo-payfast-itn",
  name_first:firstName.slice(0,100),name_last:lastName.slice(0,100),
  email_address:String(user.email||"").slice(0,100),
  m_payment_id:sub.id,amount:(totalCents/100).toFixed(2),
  item_name:("Cosmo "+product.name).slice(0,100),
  item_description:("Monthly package plus "+selected.length+" optional tools. Invoice "+invoiceCode).slice(0,255),
  subscription_type:"1",frequency:"3",cycles:"0",recurring_amount:(totalCents/100).toFixed(2),
  subscription_notify_email:"true",subscription_notify_buyer:"true",
  custom_str1:sub.id,custom_str2:product.product_code,custom_str3:invoiceCode
 };
 fields.signature=sign(fields,passphrase);
 return json({ok:true,action_url:base,fields,amount_cents:totalCents,currency:"ZAR",sandbox,invoice_code:invoiceCode});
});