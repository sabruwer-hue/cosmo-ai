import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const plain = (s:string,status=200) => new Response(s,{status,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});
function safeEqual(a:string,b:string) {
  const x=new TextEncoder().encode(a), y=new TextEncoder().encode(b);
  if(x.length!==y.length)return false;
  let diff=0; for(let i=0;i<x.length;i++) diff|=x[i]^y[i];
  return diff===0;
}
function b64(bytes:Uint8Array){let s="";for(const b of bytes)s+=String.fromCharCode(b);return btoa(s);}
async function validSignature(secret:string,id:string,timestamp:string,raw:string,header:string) {
  if(!secret.startsWith("whsec_"))return false;
  let keyBytes:Uint8Array;
  try { const binary=atob(secret.slice(6)); keyBytes=Uint8Array.from(binary,c=>c.charCodeAt(0)); } catch { return false; }
  const keyData = new Uint8Array(keyBytes).buffer as ArrayBuffer;
  const key=await crypto.subtle.importKey("raw",keyData,{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const signed=id+"."+timestamp+"."+raw;
  const messageData = new TextEncoder().encode(signed).buffer as ArrayBuffer;
  const sig=b64(new Uint8Array(await crypto.subtle.sign("HMAC",key,messageData)));
  return header.split(" ").some(part=>{const [version,value]=part.split(",",2);return version==="v1" && !!value && safeEqual(sig,value);});
}

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return plain("Method not allowed",405);
  const secret=Deno.env.get("COSMO_YOCO_WEBHOOK_SECRET")||"";
  const url=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!secret||!url||!service)return plain("Webhook not configured",503);
  const id=req.headers.get("webhook-id")||"";
  const timestamp=req.headers.get("webhook-timestamp")||"";
  const signature=req.headers.get("webhook-signature")||"";
  if(!id||!timestamp||!signature)return plain("Missing signature headers",400);
  const ts=Number(timestamp);
  if(!Number.isFinite(ts)||Math.abs(Date.now()/1000-ts)>180)return plain("Webhook timestamp outside accepted window",400);
  const raw=await req.text();
  if(!await validSignature(secret,id,timestamp,raw,signature))return plain("Invalid webhook signature",403);
  let event:any;try{event=JSON.parse(raw)}catch{return plain("Invalid JSON",400);}
  if(event.type!=="payment.succeeded")return plain("Event received",200);
  const payload=event.payload||{};
  const metadata=payload.metadata||{};
  const checkoutId=typeof metadata.checkoutId==="string" ? metadata.checkoutId : "";
  const invoiceId=typeof metadata.invoiceId==="string" ? metadata.invoiceId : "";
  const amount=Number(payload.amount);
  const currency=payload.currency;
  if((!checkoutId&&!invoiceId)||!Number.isInteger(amount)||!currency)return plain("Missing payment details",400);

  const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  // The checkout-creation request stores invoiceId in metadata, but cannot know
  // Yoco's checkoutId until the response arrives. Prefer a supplied checkoutId
  // when present; otherwise resolve the persisted checkout by our invoiceId.
  let lookup=db.from("cosmo_yoco_checkouts").select("*");
  if(checkoutId) lookup=lookup.eq("checkout_id",checkoutId);
  else lookup=lookup.eq("invoice_id",invoiceId).order("created_at",{ascending:false}).limit(1);
  const {data:checkout,error:lookupError}=await lookup.maybeSingle();
  if(lookupError)return plain("Checkout lookup failed",500);
  if(!checkout)return plain("Checkout not found",404);
  const resolvedCheckoutId=checkoutId || checkout.checkout_id;
  if(metadata.ownerId && metadata.ownerId!==checkout.owner_id)return plain("Payment owner mismatch",400);
  if(metadata.invoiceId && metadata.invoiceId!==checkout.invoice_id)return plain("Payment invoice mismatch",400);
  if(checkout.status==="paid")return plain("Already processed",200);
  if(amount!==checkout.amount_cents||currency!==checkout.currency)return plain("Payment amount or currency mismatch",400);
  if(payload.status!=="succeeded")return plain("Payment not successful",200);

  const eventId=String(event.id||id);
  const {error:eventError}=await db.from("cosmo_payment_events").insert({
    provider:"yoco",provider_event_id:eventId,payment_reference:resolvedCheckoutId,event_type:"payment.succeeded",
    amount_cents:amount,currency,signature_valid:true,payload:event
  });
  if(eventError && eventError.code!=="23505")return plain("Could not record payment event",500);
  if(eventError?.code==="23505") {
    const {data:prior}=await db.from("cosmo_payment_events").select("processed_at").eq("provider","yoco").eq("provider_event_id",eventId).maybeSingle();
    if(prior?.processed_at)return plain("Already processed",200);
  }

  const entitlementCode="COSMO-LIC-"+crypto.randomUUID().replaceAll("-","").slice(0,16).toUpperCase();
  const {data:entitlement,error:grantError}=await db.from("cosmo_package_entitlements").upsert({
    owner_id:checkout.owner_id,product_id:checkout.product_id,source_invoice_id:checkout.invoice_id,
    entitlement_code:entitlementCode,status:"active",metadata:{provider:"yoco",checkout_id:resolvedCheckoutId}
  },{onConflict:"owner_id,product_id",ignoreDuplicates:true}).select("id").maybeSingle();
  if(grantError)return plain("Package entitlement grant failed",500);

  if(Array.isArray(checkout.tool_ids)&&checkout.tool_ids.length) {
    const rows=checkout.tool_ids.map((tool_id:string)=>({
      owner_id:checkout.owner_id,tool_id,source_invoice_id:checkout.invoice_id,
      package_entitlement_id:entitlement?.id||null,status:"active",metadata:{provider:"yoco",checkout_id:checkoutId}
    }));
    const {error:toolError}=await db.from("cosmo_tool_entitlements").insert(rows);
    if(toolError && toolError.code!=="23505")return plain("Tool entitlement grant failed",500);
  }

  const now=new Date().toISOString();
  const {error:checkoutUpdateError}=await db.from("cosmo_yoco_checkouts").update({status:"paid",provider_event_id:eventId,paid_at:now}).eq("id",checkout.id).eq("status","pending");
  if(checkoutUpdateError)return plain("Checkout update failed",500);
  const {error:invoiceError}=await db.from("cosmo_invoices").update({status:"paid",paid_at:now,provider_reference:checkoutId}).eq("id",checkout.invoice_id).eq("owner_id",checkout.owner_id);
  if(invoiceError)return plain("Invoice update failed",500);
  await db.from("cosmo_payment_events").update({processed_at:now}).eq("provider","yoco").eq("provider_event_id",eventId);
  return plain("OK",200);
});