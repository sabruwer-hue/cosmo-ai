import { createClient } from "npm:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"https://cosmo-ai.co.za","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const auth=req.headers.get("Authorization")||"";
 if(!url||!anon||!service||!auth.startsWith("Bearer "))return json({error:"Authentication required"},401);
 const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
 const {data:{user},error:userError}=await userClient.auth.getUser();
 if(userError||!user)return json({error:"Invalid session"},401);
 let body:any;try{body=await req.json()}catch{return json({error:"Invalid request body"},400)}
 const productCode=typeof body.product_code==="string"?body.product_code.trim():"";
 if(!/^[A-Z0-9-]{3,50}$/.test(productCode))return json({error:"A valid product code is required"},400);
 const ownerEmail=(Deno.env.get("COSMO_OWNER_EMAIL")||"").trim().toLowerCase();
 if(ownerEmail&&user.email?.toLowerCase()===ownerEmail)return json({allowed:true,owner:true,product_code:productCode,reason:"Creator owner access"});
 const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:product,error:productError}=await db.from("cosmo_subscription_products").select("id,product_code,name,base_price_cents,currency,trial_days,free_tier_limits").eq("product_code",productCode).eq("active",true).eq("public_enabled",true).maybeSingle();
 if(productError||!product)return json({allowed:false,error:"Package not found or unavailable"},404);
 const {data:subs,error:subError}=await db.from("cosmo_subscriptions").select("id,status,trial_ends_at,current_period_end,current_period_start,base_amount_cents,metadata").eq("owner_id",user.id).eq("product_id",product.id).in("status",["trialing","active","free"]).order("created_at",{ascending:false}).limit(1);
 if(subError)return json({allowed:false,error:"Subscription status could not be checked"},500);
 const sub=subs?.[0]||null;
 let trialAvailable=false;
 const {data:claim}=await db.from("cosmo_trial_claims").select("product_id").eq("owner_id",user.id).eq("product_id",product.id).maybeSingle();
 trialAvailable=!claim&&Number(product.trial_days)>0;
 if(!sub)return json({allowed:false,owner:false,product:{code:product.product_code,name:product.name,base_price_cents:product.base_price_cents,currency:product.currency,trial_days:product.trial_days,free_tier_limits:product.free_tier_limits},trial_available:trialAvailable,free_available:true,reason:"No active package entitlement"});
 if(sub.status==="trialing"&&sub.trial_ends_at&&new Date(sub.trial_ends_at).getTime()<=Date.now()){
   await db.from("cosmo_subscriptions").update({status:"expired"}).eq("id",sub.id).eq("owner_id",user.id);
   return json({allowed:false,owner:false,product_code:productCode,trial_available:false,free_available:true,reason:"Trial period has ended"});
 }
 if(sub.current_period_end&&new Date(sub.current_period_end).getTime()<=Date.now()&&sub.status!=="free"){
   await db.from("cosmo_subscriptions").update({status:"expired"}).eq("id",sub.id).eq("owner_id",user.id);
   return json({allowed:false,owner:false,product_code:productCode,trial_available:false,free_available:true,reason:"Subscription period has ended"});
 }
 const {data:toolItems}=await db.from("cosmo_subscription_tool_items").select("status,monthly_amount_cents,cosmo_subscription_tools(tool_code,slug,name)").eq("owner_id",user.id).eq("subscription_id",sub.id).eq("status","active");
 return json({allowed:true,owner:false,product_code:productCode,subscription:{id:sub.id,status:sub.status,trial_ends_at:sub.trial_ends_at,current_period_end:sub.current_period_end},free_tier_limits:product.free_tier_limits,tools:(toolItems||[]).map((x:any)=>x.cosmo_subscription_tools).filter(Boolean)});
});