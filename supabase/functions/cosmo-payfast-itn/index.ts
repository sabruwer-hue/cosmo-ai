import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash } from "node:crypto";
const response=(text:string,status=200)=>new Response(text,{status,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});
const enc=(v:unknown)=>encodeURIComponent(String(v??"").trim()).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase()).replace(/%20/g,"+");
function sign(entries:[string,string][],pass:string){const body=entries.filter(([k,v])=>k!=="signature"&&v!=="").map(([k,v])=>k+"="+enc(v)).join("&");return createHash("md5").update(body+(pass?"&passphrase="+enc(pass):"")).digest("hex")}
function ipNum(ip:string){const p=ip.split(".");if(p.length!==4||p.some(x=>!/^\d+$/.test(x)||Number(x)>255))return null;return p.reduce((n,x)=>(n*256+Number(x))>>>0,0)}
function allowedIp(ip:string){const n=ipNum(ip);if(n===null)return false;const cidrs=["197.97.145.144/28","41.74.179.192/27","102.216.36.0/28","102.216.36.128/28","144.126.193.139/32"];return cidrs.some(c=>{const [net,bits]=c.split("/"),v=ipNum(net);if(v===null)return false;const mask=bits==="0"?0:(0xffffffff<<(32-Number(bits)))>>>0;return (n&mask)===(v&mask)})}
Deno.serve(async(req:Request)=>{
 if(req.method!=="POST")return response("Method not allowed",405);
 const merchantId=Deno.env.get("COSMO_PAYFAST_MERCHANT_ID")||"",passphrase=Deno.env.get("COSMO_PAYFAST_PASSPHRASE")||"";
 const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),url=Deno.env.get("SUPABASE_URL");
 if(!merchantId||!passphrase||!service||!url)return response("Payment notification service is not configured",503);
 const forwarded=(req.headers.get("x-forwarded-for")||"").split(",")[0].trim();
 if(!allowedIp(forwarded))return response("Source IP rejected",403);
 const raw=await req.text();const params=new URLSearchParams(raw);const entries:[string,string][]=[...params.entries()];
 const signature=params.get("signature")||"";
 if(!signature||sign(entries,passphrase)!==signature.toLowerCase())return response("Invalid notification signature",400);
 if(params.get("merchant_id")!==merchantId)return response("Merchant ID mismatch",400);
 const sandbox=(Deno.env.get("COSMO_PAYFAST_MODE")||"sandbox").toLowerCase()!=="live";
 const host=sandbox?"sandbox.payfast.co.za":"www.payfast.co.za";
 const validationBody=entries.filter(([k])=>k!=="signature").map(([k,v])=>enc(k)+"="+enc(v)).join("&");
 const validation=await fetch("https://"+host+"/eng/query/validate",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:validationBody});
 const validationText=(await validation.text()).trim();
 if(!validation.ok||validationText!=="VALID")return response("PayFast server validation failed",400);
 if(params.get("payment_status")!=="COMPLETE")return response("Payment is not complete",200);
 const paymentId=params.get("pf_payment_id")||"";
 const paymentRef=params.get("m_payment_id")||params.get("custom_str1")||"";
 const gross=Number(params.get("amount_gross")||"NaN");
 if(!paymentId||!paymentRef||!Number.isFinite(gross))return response("Missing payment identifiers or amount",400);
 const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 let {data:sub}=await db.from("cosmo_subscriptions").select("id,owner_id,product_id,base_amount_cents,metadata,provider_subscription_id").eq("id",paymentRef).eq("provider","payfast").maybeSingle();
 if(!sub&&params.get("token")){const found=await db.from("cosmo_subscriptions").select("id,owner_id,product_id,base_amount_cents,metadata,provider_subscription_id").eq("provider_subscription_id",params.get("token")).eq("provider","payfast").maybeSingle();sub=found.data}
 if(!sub)return response("Subscription reference not found",404);
 const meta=(sub.metadata||{}) as Record<string,any>;
 const expected=Number(meta.amount_total_cents||sub.base_amount_cents);
 if(Math.abs(Math.round(gross*100)-expected)>1)return response("Payment amount mismatch",400);
 const eventPayload=Object.fromEntries(entries);
 const {error:eventError}=await db.from("cosmo_payment_events").insert({provider:"payfast",provider_event_id:paymentId,payment_reference:paymentRef,event_type:"payment_complete",amount_cents:Math.round(gross*100),currency:"ZAR",signature_valid:true,payload:eventPayload});
 if(eventError&&eventError.code!=="23505")return response("Could not record payment event",500);
 if(eventError?.code==="23505"){const existing=await db.from("cosmo_payment_events").select("processed_at").eq("provider","payfast").eq("provider_event_id",paymentId).maybeSingle();if(existing.data?.processed_at)return response("OK",200)}
 const payfastToken=params.get("token")||sub.provider_subscription_id;
 if(!payfastToken)return response("PayFast subscription token missing",400);
 const now=new Date(),periodEnd=new Date(now);periodEnd.setMonth(periodEnd.getMonth()+1);
 const {error:updateError}=await db.from("cosmo_subscriptions").update({status:"active",provider_subscription_id:payfastToken,provider_payment_token:payfastToken,current_period_start:now.toISOString(),current_period_end:periodEnd.toISOString(),trial_started_at:null,trial_ends_at:null}).eq("id",sub.id).eq("owner_id",sub.owner_id);
 if(updateError)return response("Subscription activation failed",500);
 const toolCodes=Array.isArray(meta.selected_tool_codes)?meta.selected_tool_codes:[];
 if(toolCodes.length){const {data:tools}=await db.from("cosmo_subscription_tools").select("id,tool_code,monthly_price_cents").in("tool_code",toolCodes);for(const t of tools||[]){await db.from("cosmo_subscription_tool_items").upsert({owner_id:sub.owner_id,subscription_id:sub.id,tool_id:t.id,monthly_amount_cents:t.monthly_price_cents,status:"active"},{onConflict:"subscription_id,tool_id"})}}
 await db.from("cosmo_invoices").update({status:"paid",paid_at:now.toISOString(),provider_reference:paymentId}).eq("owner_id",sub.owner_id).eq("subscription_id",sub.id).eq("status","open");
 await db.from("cosmo_payment_events").update({processed_at:now.toISOString()}).eq("provider","payfast").eq("provider_event_id",paymentId);
 return response("OK",200);
});