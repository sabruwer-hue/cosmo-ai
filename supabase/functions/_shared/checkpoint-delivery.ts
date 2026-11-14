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

const encoder = new TextEncoder();

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

export function createCheckpointEnvelope(
  ownerId: string,
  row: VaultCheckpointRow,
  now = new Date(),
  deliveryId = crypto.randomUUID(),
): CheckpointEnvelope {
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(ownerId)) {
    throw new Error("A valid authenticated owner UUID is required.");
  }
  if (!/^[0-9a-f]{64}$/.test(row.checkpoint_sha256)) {
    throw new Error("Checkpoint digest must be a lowercase SHA-256 hex string.");
  }
  if (!row.checkpoint_payload || typeof row.checkpoint_payload !== "object" || Array.isArray(row.checkpoint_payload)) {
    throw new Error("Checkpoint payload must be a JSON object.");
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
