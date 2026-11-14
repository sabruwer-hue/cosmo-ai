import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createCheckpointEnvelope, signCheckpointBody } from "../_shared/checkpoint-delivery.ts";

const cors = {
  "Access-Control-Allow-Origin": "https://cosmo-ai.co.za",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const sinkUrl = Deno.env.get("COSMO_CHECKPOINT_SINK_URL");
  const hmacSecret = Deno.env.get("COSMO_CHECKPOINT_HMAC_SECRET");
  const keyId = Deno.env.get("COSMO_CHECKPOINT_HMAC_KEY_ID") || "primary";
  const authorization = req.headers.get("Authorization") || "";

  if (!supabaseUrl || !anonKey || !authorization.startsWith("Bearer ")) {
    return json({ error: "A valid authenticated session is required." }, 401);
  }
  if (!sinkUrl || !hmacSecret) {
    return json({ error: "Independent checkpoint storage is not configured." }, 503);
  }
  if (hmacSecret.length < 32) {
    return json({ error: "Checkpoint signing configuration is invalid." }, 503);
  }

  let parsedSink: URL;
  try {
    parsedSink = new URL(sinkUrl);
  } catch {
    return json({ error: "Checkpoint sink configuration is invalid." }, 503);
  }
  if (parsedSink.protocol !== "https:" || parsedSink.username || parsedSink.password) {
    return json({ error: "Checkpoint sink must be a credential-free HTTPS endpoint." }, 503);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userResult, error: authError } = await userClient.auth.getUser();
  const user = userResult?.user;
  if (authError || !user) return json({ error: "Invalid session." }, 401);

  // Call as the authenticated user. Do not use the service-role key: the RPC must
  // remain subject to that user's RLS visibility.
  const { data, error } = await userClient.rpc("cosmo_export_vault_checkpoint");
  if (error || !data) return json({ error: "Could not export the authenticated user's vault checkpoint." }, 502);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.checkpoint_payload || !row?.checkpoint_sha256) {
    return json({ error: "The vault checkpoint export returned an invalid response." }, 502);
  }

  let envelope: ReturnType<typeof createCheckpointEnvelope>;
  try {
    envelope = createCheckpointEnvelope(user.id, row);
  } catch {
    return json({ error: "The vault checkpoint could not be validated." }, 502);
  }
  const body = JSON.stringify(envelope);
  const signature = await signCheckpointBody(body, hmacSecret);

  let sinkResponse: Response;
  try {
    sinkResponse = await fetch(parsedSink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cosmo-Signature": `sha256=${signature}`,
        "X-Cosmo-Key-Id": keyId,
        "Idempotency-Key": envelope.delivery_id,
      },
      body,
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return json({ error: "Independent checkpoint delivery failed. No successful archive receipt was recorded." }, 502);
  }
  if (!sinkResponse.ok) {
    return json({ error: "Independent checkpoint storage rejected the delivery.", sink_status: sinkResponse.status }, 502);
  }

  return json({
    stored: true,
    delivery_id: envelope.delivery_id,
    exported_at: envelope.exported_at,
    checkpoint_sha256: envelope.checkpoint_sha256,
    owner_id: user.id,
    receipt_status: sinkResponse.status,
  });
});
