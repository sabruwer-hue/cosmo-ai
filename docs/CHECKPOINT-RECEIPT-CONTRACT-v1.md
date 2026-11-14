# Cosmo Independent Checkpoint Receipt Contract v1

## Purpose

A successful HTTP response is not proof that an independent archive durably stored a checkpoint. The sender reports `stored: true` only after validating a receiver-authenticated receipt bound to the exact delivery, owner and checkpoint digest.

## Request authentication

The sender posts the exact JSON `cosmo-independent-checkpoint-v1` envelope over HTTPS. It includes:

- `delivery_id`: stable UUID used as the idempotency key.
- `owner_id`: authenticated Supabase owner UUID.
- `checkpoint_sha256`: digest supplied by the authenticated database export.
- `checkpoint_payload`: exported checkpoint.

The sender signs the exact request body with HMAC-SHA256 and sends `X-Cosmo-Signature: sha256=<lowercase-hex>`. The receiver must verify this signature using its separately configured request-verification secret before accepting the envelope.

## Durable receiver requirements

Before issuing a receipt, the receiver must:

1. Validate the request signature and envelope schema.
2. Validate that the delivery ID, owner ID and digest are well-formed.
3. Persist the complete envelope in storage independent of the Cosmo/Supabase project.
4. Ensure the write is durable according to the storage system's documented durability guarantees.
5. Enforce idempotency on `delivery_id`. A repeated ID with the same owner and digest returns the original receipt; the same ID with different content must be rejected.
6. Never return a success receipt for a merely queued, in-memory or failed write.

A receiver deployment and its storage backend must be independently verified before anyone describes external checkpoint storage as operational.

## Signed receipt response

After durable persistence, the receiver returns HTTP 2xx with a JSON response body containing exactly these required fields:

```json
{
  "schema": "cosmo-checkpoint-receipt-v1",
  "delivery_id": "the-request-delivery-uuid",
  "owner_id": "the-request-owner-uuid",
  "checkpoint_sha256": "the-request-lowercase-sha256",
  "stored": true,
  "stored_at": "2026-11-14T10:05:00.000Z"
}
```

The receiver signs the exact UTF-8 response body bytes using Ed25519 and returns:

`X-Cosmo-Receipt-Signature: ed25519=<base64-signature>`

The sender is configured with `COSMO_CHECKPOINT_RECEIPT_PUBLIC_KEY`, the base64-encoded 32-byte raw Ed25519 public key. The receiver's private key must never be placed in Cosmo or Supabase sender secrets.

The sender rejects the response unless all of the following hold:

- HTTP status is successful.
- The receipt signature is valid for the exact response body.
- Schema is `cosmo-checkpoint-receipt-v1`.
- `stored` is exactly `true`.
- Delivery ID, owner ID and checkpoint digest exactly match the request.
- `stored_at` is a parseable timestamp.

A missing, malformed, unsigned, incorrectly signed or mismatched receipt is an unverified delivery and must produce an error. A bare 2xx response must never be reported as successful storage.

## Key separation and operations

- Request HMAC secret authenticates Cosmo-to-receiver requests.
- Receiver Ed25519 private key authenticates receiver receipts.
- Cosmo stores only the receiver Ed25519 public key for receipt verification.
- Rotate keys with explicit key identifiers and a documented overlap period before retiring old keys.
- Log delivery IDs, digests, receipt verification outcomes and timestamps without logging secrets or full sensitive checkpoint payloads.
- Test replay, duplicate delivery, altered payload, wrong owner, wrong digest, invalid signature, receiver timeout, and storage failure.

## Current implementation boundary

The PR adds sender-side receipt verification and tests for the contract. It does not create or deploy a receiver, provision independent storage, configure production secrets, or prove durable storage. Until those separate components are implemented and tested, external archival remains unconfigured.
