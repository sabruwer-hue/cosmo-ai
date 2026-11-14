# Cosmo Independent Vault Checkpoint Service v1

## Components

The export path has three trust boundaries:

1. **Authenticated Cosmo Edge Function** — validates the caller's Supabase session and calls `cosmo_export_vault_checkpoint()` with that user's anon-key client and bearer token. It must not use a service-role client for the export.
2. **Signed delivery envelope** — binds the authenticated owner ID, delivery ID, export timestamp, opaque database manifest and database-generated SHA-256 digest. The exact serialized HTTP body is authenticated with HMAC-SHA-256.
3. **Independent checkpoint sink** — a separately operated HTTPS service and storage account. It is not part of the Cosmo Supabase project.

## Edge Function configuration

Deploy `cosmo-checkpoint-export` only after the independent sink is provisioned. Configure these server-side Edge Function secrets:

- `COSMO_CHECKPOINT_SINK_URL`: fixed HTTPS URL of the receiving service. Do not accept a destination URL from a user request.
- `COSMO_CHECKPOINT_HMAC_SECRET`: randomly generated secret with at least 32 characters. Use a unique secret for this integration; never reuse a user password or Supabase key.
- `COSMO_CHECKPOINT_HMAC_KEY_ID`: optional rotation identifier, default `primary`.

The function also uses the platform-provided `SUPABASE_URL` and `SUPABASE_ANON_KEY`. It deliberately does not require or use the service-role key.

## Receiver contract

The receiving endpoint must:

1. Accept HTTPS POST only and enforce a small request-size limit.
2. Read the exact raw request bytes before parsing JSON.
3. Select the HMAC key by `X-Cosmo-Key-Id`, calculate HMAC-SHA-256 over the exact raw body, and compare the supplied `X-Cosmo-Signature: sha256=<hex>` using a constant-time cryptographic verification routine.
4. Reject invalid signatures, unknown key IDs, malformed envelopes, unsupported schema versions and mismatched owner IDs.
5. Treat `Idempotency-Key` as the delivery ID and make retries safe without overwriting earlier checkpoint versions.
6. Persist the original body, owner ID, delivery ID, received-at timestamp, digest and verification outcome to storage outside the Cosmo Supabase project.
7. Use a separate cloud account/project, least-privilege write credentials, encryption at rest, immutable/object-lock retention where legally appropriate, audit logging and backup/recovery testing.
8. Return 2xx only after durable storage and verification have completed. A 2xx response is the sender's archive receipt.

Do not reserialize the JSON body before HMAC verification. Do not treat the included database digest as a substitute for verifying the transport HMAC.

## What is implemented vs. what remains

Implemented in this repository:
- authenticated owner-scoped export invocation;
- signed HMAC-SHA-256 envelope;
- fixed HTTPS sink configuration;
- fail-closed behaviour when the sink is missing, unavailable or rejects a delivery;
- unit tests for envelope validation, HMAC determinism and tamper detection;
- a two-owner SQL integration test for RLS and checkpoint isolation.

Still required outside this repository:
- provision the independent receiver and immutable storage account;
- deploy the Edge Function and set secrets;
- configure key rotation and secret backup;
- run the SQL integration test on disposable Supabase infrastructure;
- execute a real end-to-end delivery and verify the external durable receipt;
- schedule checkpoint exports and compare successive manifests to alert on missing records, changed hashes or altered links.

The code in this PR is therefore a delivery client and security contract, not proof that an external archive is already receiving or retaining data.

## Two-owner integration test

Run only against a disposable Supabase local stack or isolated test project after applying the migrations in order:

```sh
supabase start
supabase db reset
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/cosmo_vault_two_owner_isolation.test.sql
```

The test creates two synthetic auth users, inserts separate history and memory records under each identity, switches JWT claims, and asserts that Owner A cannot read Owner B's records or see Owner B's identifiers in A's checkpoint. It also checks that the integrity audit is scoped to the authenticated owner.

Do not run this fixture against production. The test intentionally inserts synthetic rows into `auth.users` and vault tables inside a transaction and rolls them back.

## Privacy and retention

Independent checkpoints contain identifiers, codes, hashes and relationship metadata, not original conversation bodies. Even metadata can be personal or sensitive. The receiver must enforce tenant separation and a documented retention policy.

A valid account-erasure request must be propagated to the external archive according to the approved legal and privacy policy. Immutable retention must not be used to defeat a lawful erasure request; use documented retention exceptions, legal holds and controlled cryptographic-erasure procedures where appropriate.
