# Cosmo Vault Checkpoint Operations v1

## Purpose

The vault checkpoint export creates a per-owner manifest containing:
- every visible history record ID, permanent code, and stored content hash;
- every visible memory record ID, permanent code, version, and stored content hash;
- every visible memory-to-history source link, including its relationship, rationale, and creation time;
- a format identifier, owner identifier, and export timestamp.

The function also returns a SHA-256 digest of the JSONB manifest representation.

## Required external retention

The export function does **not** itself create an independent backup. A trusted operator or future scheduled service must:

1. Call `public.cosmo_export_vault_checkpoint()` while authenticated as the relevant owner.
2. Store both `checkpoint_payload` and `checkpoint_sha256` outside the Cosmo Supabase project.
3. Record an independently trusted timestamp and owner/tenant identifier.
4. Use immutable or object-lock retention, restricted write permissions, encryption at rest, and access logging.
5. Retain multiple dated checkpoints; do not overwrite the previous checkpoint.
6. Periodically compare the latest database export with the retained checkpoint and alert on missing IDs, changed hashes, changed links, or unexpected count reductions.

A checkpoint stored only in the same database or project is not independent evidence against privileged deletion or coordinated alteration.

## What the checkpoint detects

Comparing a later export with a prior external checkpoint can identify:
- records that disappeared;
- records whose stored hash changed;
- new records;
- removed or changed source relationships.

The separate retrieval-time integrity audit recomputes the hash from the live row. Use both controls: the external checkpoint protects the previously observed state, while the retrieval audit checks whether current row contents still match their stored hashes.

## Deletion controls and account erasure

Direct deletes from the three vault tables are rejected by database triggers. Supersedes relationships use `ON DELETE RESTRICT`, so deleting an earlier version cannot cascade-delete later versions.

Nested foreign-key cascades are allowed so that deletion of an auth account can still cascade to that account's vault data. This is intentional privacy-erasure behaviour and means an account-erasure event will remove the corresponding in-database rows. External checkpoint retention must therefore have a documented retention/legal-hold policy and must not be used to defeat a valid erasure request.

The trigger-depth exception is designed for trusted database FK cascades. Review any future trigger or privileged maintenance function that performs nested deletes; do not add such a path without a separate security review and audit event.

## Not yet implemented

- Automated scheduled export and external storage connector.
- External signature or KMS-backed signing of checkpoint manifests.
- Automated checkpoint comparison/alerting and recovery drills.
- A formal owner-requested erasure workflow covering external checkpoints and retention exceptions.
- Live database execution of the migration and pgTAP suite.

## Deployment gate

Apply only to a disposable database first. Run the full migration chain and pgTAP suite, then test:
- direct delete attempts fail for all three tables;
- account deletion still cascades as intended;
- superseding records cannot be deleted out from under later versions;
- two authenticated owners receive only their own manifest;
- changed rows are reported by the integrity audit;
- missing rows and changed links are detected by comparing against a separately retained checkpoint.

Do not deploy to production until these checks pass and the privacy/retention policy is approved.
