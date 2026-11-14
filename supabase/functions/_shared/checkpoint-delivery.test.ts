import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createCheckpointEnvelope, signCheckpointBody, verifyCheckpointSignature } from "./checkpoint-delivery.ts";

Deno.test("checkpoint envelope binds the authenticated owner and opaque database digest", () => {
  const envelope = createCheckpointEnvelope(
    "11111111-1111-4111-8111-111111111111",
    { checkpoint_payload: { format: "cosmo-vault-checkpoint-v1", history_records: [] }, checkpoint_sha256: "a".repeat(64) },
    new Date("2026-11-14T10:00:00.000Z"),
    "33333333-3333-4333-8333-333333333333",
  );
  assertEquals(envelope.owner_id, "11111111-1111-4111-8111-111111111111");
  assertEquals(envelope.checkpoint_sha256, "a".repeat(64));
  assertEquals(envelope.delivery_id, "33333333-3333-4333-8333-333333333333");
  assertEquals(envelope.exported_at, "2026-11-14T10:00:00.000Z");
});

Deno.test("checkpoint envelope rejects invalid owner IDs and digests", () => {
  const payload = { checkpoint_payload: {}, checkpoint_sha256: "not-a-hash" };
  let invalidOwner = false;
  try {
    createCheckpointEnvelope("not-a-uuid", { checkpoint_payload: {}, checkpoint_sha256: "a".repeat(64) });
  } catch {
    invalidOwner = true;
  }
  assertEquals(invalidOwner, true);
  let invalidHash = false;
  try {
    createCheckpointEnvelope("11111111-1111-4111-8111-111111111111", payload);
  } catch {
    invalidHash = true;
  }
  assertEquals(invalidHash, true);
});

Deno.test("HMAC signing is deterministic and rejects weak secrets", async () => {
  const body = '{"schema":"cosmo-independent-checkpoint-v1"}';
  const secret = "cosmo-test-secret-that-is-longer-than-32-characters";
  const first = await signCheckpointBody(body, secret);
  const second = await signCheckpointBody(body, secret);
  assertEquals(first, second);
  assertEquals(first.length, 64);
  assertEquals(await verifyCheckpointSignature(body, first, secret), true);
  assertEquals(await verifyCheckpointSignature(body + "tampered", first, secret), false);
  await assertRejects(() => signCheckpointBody(body, "short"));
});
