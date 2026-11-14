export type VaultCheckpointRow = {
  checkpoint_payload: Record<string, unknown>;
  checkpoint_sha256: string;
};

export type CheckpointEnvelope = {
  schema: "cosmo-independent-checkpoint-v1";
  delivery_id: string;
  owner_id: string;
  exported_at: string;
  checkpoint_payload: Record<string, unknown>;
  checkpoint_sha256: string;
};

export type CheckpointReceiptExpectation = {
  delivery_id: string;
  owner_id: string;
  checkpoint_sha256: string;
};

export type CheckpointReceipt = {
  schema: "cosmo-checkpoint-receipt-v1";
  delivery_id: string;
  owner_id: string;
  checkpoint_sha256: string;
  stored: true;
  stored_at: string;
};

const encoder = new TextEncoder();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256_RE = /^[0-9a-f]{64}$/;

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function signCheckpointBody(body: string, secret: string): Promise<string> {
  if (secret.length < 32) throw new Error("Checkpoint HMAC secret must be at least 32 characters.");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
}

export async function verifyCheckpointSignature(body: string, signatureHex: string, secret: string): Promise<boolean> {
  if (secret.length < 32 || !SHA256_RE.test(signatureHex)) return false;
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
  );
  const signature = new Uint8Array(signatureHex.match(/.{2}/g)!.map((part) => Number.parseInt(part, 16)));
  return await crypto.subtle.verify("HMAC", key, signature, encoder.encode(body));
}

/**
 * Verify a receiver's signed, body-bound acknowledgement. A bare HTTP 2xx is
 * deliberately insufficient evidence that a checkpoint was durably stored.
 * The receiver must Ed25519-sign the exact response body with its private key
 * and return base64 in X-Cosmo-Receipt-Signature as "ed25519=<base64>".
 * The sender stores only the receiver's public key, never its private key.
 */
export async function verifyCheckpointReceipt(
  receiptBody: string,
  signatureHeader: string | null,
  publicKeyBase64: string,
  expected: CheckpointReceiptExpectation,
): Promise<CheckpointReceipt | null> {
  const match = signatureHeader?.match(/^ed25519=([A-Za-z0-9+/]+={0,2})$/);
  if (!match || !publicKeyBase64) return null;

  let receipt: CheckpointReceipt;
  let signature: Uint8Array;
  let publicKeyBytes: Uint8Array;
  try {
    receipt = JSON.parse(receiptBody) as CheckpointReceipt;
    signature = Uint8Array.from(atob(match[1]), (character) => character.charCodeAt(0));
    publicKeyBytes = Uint8Array.from(atob(publicKeyBase64), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }

  if (
    !receipt || typeof receipt !== "object" ||
    receipt.schema !== "cosmo-checkpoint-receipt-v1" ||
    receipt.stored !== true ||
    receipt.delivery_id !== expected.delivery_id ||
    receipt.owner_id !== expected.owner_id ||
    receipt.checkpoint_sha256 !== expected.checkpoint_sha256 ||
    typeof receipt.stored_at !== "string" ||
    !Number.isFinite(Date.parse(receipt.stored_at)) ||
    signature.length !== 64 ||
    publicKeyBytes.length !== 32
  ) return null;

  try {
    const publicKey = await crypto.subtle.importKey(
      "raw", publicKeyBytes, { name: "Ed25519" }, false, ["verify"],
    );
    const validSignature = await crypto.subtle.verify(
      { name: "Ed25519" }, publicKey, signature, encoder.encode(receiptBody),
    );
    return validSignature ? receipt : null;
  } catch {
    return null;
  }
}
export function createCheckpointEnvelope(
  ownerId: string,
  row: VaultCheckpointRow,
  now = new Date(),
  deliveryId = crypto.randomUUID(),
): CheckpointEnvelope {
  if (!UUID_RE.test(ownerId)) {
    throw new Error("A valid authenticated owner UUID is required.");
  }
  if (!SHA256_RE.test(row.checkpoint_sha256)) {
    throw new Error("Checkpoint digest must be a lowercase SHA-256 hex string.");
  }
  if (!row.checkpoint_payload || typeof row.checkpoint_payload !== "object" || Array.isArray(row.checkpoint_payload)) {
    throw new Error("Checkpoint payload must be a JSON object.");
  }
  if (!UUID_RE.test(deliveryId)) {
    throw new Error("A valid delivery UUID is required.");
  }
  return {
    schema: "cosmo-independent-checkpoint-v1",
    delivery_id: deliveryId,
    owner_id: ownerId,
    exported_at: now.toISOString(),
    checkpoint_payload: row.checkpoint_payload,
    checkpoint_sha256: row.checkpoint_sha256,
  };
}
