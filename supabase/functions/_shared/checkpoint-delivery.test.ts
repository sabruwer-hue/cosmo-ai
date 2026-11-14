import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  createCheckpointEnvelope,
  signCheckpointBody,
  verifyCheckpointSignature,
  verifyCheckpointReceipt,
} from "./checkpoint-delivery.ts";

const ownerId = "11111111-1111-4111-8111-111111111111";
const deliveryId = "33333333-3333-4333-8333-333333333333";
const digest = "a".repeat(64);
const secret = "cosmo-test-secret-that-is-longer-than-32-characters";

Deno.test("checkpoint envelope binds the authenticated owner and opaque database digest", () => {
  const envelope = createCheckpointEnvelope(
    ownerId,
    { checkpoint_payload: { format: "cosmo-vault-checkpoint-v1", history_records: [] }, checkpoint_sha256: digest },
    new Date("2026-11-14T10:00:00.000Z"),
    deliveryId,
  );
  assertEquals(envelope.owner_id, ownerId);
  assertEquals(envelope.checkpoint_sha256, digest);
  assertEquals(envelope.delivery_id, deliveryId);
  assertEquals(envelope.exported_at, "2026-11-14T10:00:00.000Z");
});

Deno.test("checkpoint envelope rejects invalid owner IDs, delivery IDs and digests", () => {
  let invalidOwner = false;
  try {
    createCheckpointEnvelope("not-a-uuid", { checkpoint_payload: {}, checkpoint_sha256: digest });
  } catch {
    invalidOwner = true;
  }
  assertEquals(invalidOwner, true);

  let invalidDelivery = false;
  try {
    createCheckpointEnvelope(ownerId, { checkpoint_payload: {}, checkpoint_sha256: digest }, new Date(), "not-a-uuid");
  } catch {
    invalidDelivery = true;
  }
  assertEquals(invalidDelivery, true);

  let invalidHash = false;
  try {
    createCheckpointEnvelope(ownerId, { checkpoint_payload: {}, checkpoint_sha256: "not-a-hash" });
  } catch {
    invalidHash = true;
  }
  assertEquals(invalidHash, true);
});

Deno.test("HMAC signing is deterministic and rejects weak secrets", async () => {
  const body = '{"schema":"cosmo-independent-checkpoint-v1"}';
  const first = await signCheckpointBody(body, secret);
  const second = await signCheckpointBody(body, secret);
  assertEquals(first, second);
  assertEquals(first.length, 64);
  assertEquals(await verifyCheckpointSignature(body, first, secret), true);
  assertEquals(await verifyCheckpointSignature(body + "tampered", first, secret), false);
  await assertRejects(() => signCheckpointBody(body, "short"));
});

Deno.test("receipt verifier accepts only a valid receiver Ed25519 signature bound to this delivery", async () => {
  const pair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKey = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
  const publicKeyBase64 = btoa(String.fromCharCode(...publicKey));
  const receipt = {
    schema: "cosmo-checkpoint-receipt-v1",
    delivery_id: deliveryId,
    owner_id: ownerId,
    checkpoint_sha256: digest,
    stored: true,
    stored_at: "2026-11-14T10:05:00.000Z",
  };
  const body = JSON.stringify(receipt);
  const signatureBytes = new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, pair.privateKey, new TextEncoder().encode(body)));
  const signature = `ed25519=${btoa(String.fromCharCode(...signatureBytes))}`;
  const expected = { delivery_id: deliveryId, owner_id: ownerId, checkpoint_sha256: digest };

  assertEquals(await verifyCheckpointReceipt(body, signature, publicKeyBase64, expected), receipt);
  assertEquals(await verifyCheckpointReceipt(body, null, publicKeyBase64, expected), null);
  assertEquals(await verifyCheckpointReceipt(body, signature, btoa("wrong-key"), expected), null);
  assertEquals(await verifyCheckpointReceipt(body + " ", signature, publicKeyBase64, expected), null);
});

Deno.test("receipt verifier rejects signed receipts for another owner, delivery or digest", async () => {
  const pair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const publicKey = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
  const publicKeyBase64 = btoa(String.fromCharCode(...publicKey));
  const receipt = {
    schema: "cosmo-checkpoint-receipt-v1",
    delivery_id: deliveryId,
    owner_id: ownerId,
    checkpoint_sha256: digest,
    stored: true,
    stored_at: "2026-11-14T10:05:00.000Z",
  };
  const body = JSON.stringify(receipt);
  const signatureBytes = new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, pair.privateKey, new TextEncoder().encode(body)));
  const signature = `ed25519=${btoa(String.fromCharCode(...signatureBytes))}`;

  assertEquals(await verifyCheckpointReceipt(body, signature, publicKeyBase64, {
    delivery_id: deliveryId,
    owner_id: "22222222-2222-4222-8222-222222222222",
    checkpoint_sha256: digest,
  }), null);
  assertEquals(await verifyCheckpointReceipt(body, signature, publicKeyBase64, {
    delivery_id: "44444444-4444-4444-8444-444444444444",
    owner_id: ownerId,
    checkpoint_sha256: digest,
  }), null);
  assertEquals(await verifyCheckpointReceipt(body, signature, publicKeyBase64, {
    delivery_id: deliveryId,
    owner_id: ownerId,
    checkpoint_sha256: "b".repeat(64),
  }), null);
});

Deno.test("receipt verifier rejects malformed and unsigned success bodies", async () => {
  const expected = { delivery_id: deliveryId, owner_id: ownerId, checkpoint_sha256: digest };
  assertEquals(await verifyCheckpointReceipt("not-json", "ed25519=AAAA", "AAAA", expected), null);
  assertEquals(await verifyCheckpointReceipt('{"stored":true}', "ed25519=AAAA", "AAAA", expected), null);
});
