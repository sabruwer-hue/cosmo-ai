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
 const mode=body.mode==="free"?"free":"trial";
 const toolCodes=Array.isArray(body.tool_codes)?[...new Set(body.tool_codes.filter((x:any)=>typeof x==="string").map((x:string)=>x.trim()).filter(Boolean))]:[];
 if(!/^[A-Z0-9-]{3,50}$/.test(productCode)||toolCodes.length>12)return json({error:"Invalid package or tool selection"},400);
 const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await db.rpc("cosmo_activate_plan",{p_owner_id:user.id,p_product_code:productCode,p_tool_codes:toolCodes,p_mode:mode});
 if(error)return json({error:error.message},400);
 return json({ok:true,activation:data});
});