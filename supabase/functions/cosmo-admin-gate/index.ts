import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ allowed: false, error: "Authentication required." }), { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const ownerEmail = Deno.env.get("COSMO_OWNER_EMAIL")?.trim().toLowerCase();
  if (!supabaseUrl || !anonKey || !ownerEmail) {
    return new Response(JSON.stringify({ allowed: false, error: "Owner access has not been configured. Add COSMO_OWNER_EMAIL in Edge Function secrets." }), { status: 503, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(authHeader.slice(7));
  if (error || !data.user) {
    return new Response(JSON.stringify({ allowed: false, error: "The sign-in session is invalid or expired." }), { status: 401, headers: corsHeaders });
  }
  if ((data.user.email ?? "").trim().toLowerCase() !== ownerEmail) {
    return new Response(JSON.stringify({ allowed: false, error: "This portal is restricted to the Cosmo owner." }), { status: 403, headers: corsHeaders });
  }

  return new Response(JSON.stringify({
    allowed: true,
    owner: { id: data.user.id, email: data.user.email },
    portal: "cosmo-admin",
    verifiedAt: new Date().toISOString(),
  }), { status: 200, headers: corsHeaders });
});