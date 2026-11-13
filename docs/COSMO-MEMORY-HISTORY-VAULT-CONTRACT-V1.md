# Cosmo Main Memories Vault + Master History Vault v1

## Separation of duties
- **Main Memories Vault** (`cosmo_memory_index`): searchable, versioned memory summaries, project links, retention metadata and access scope.
- **Master History Vault** (`cosmo_history_records`): original source content, provenance, original/capture timestamps, verification status, source reference and a server-generated SHA-256 integrity hash.
- **Memory/source links** (`cosmo_memory_source_links`): explicit owner-scoped links from a summary version to its original evidence records.
- Existing `cosmo_knowledge_records` and `cosmo_memory_links` are retained unchanged as the earlier knowledge layer; this migration adds dedicated vault tables rather than rewriting existing data.

## Persistent database migration staged
File: `supabase/migrations/20261113090000_cosmo_dual_memory_history_v1.sql`

The additive migration defines:
- Database-generated, global, non-cycling source codes and memory codes; append-only memory versions automatically inherit the prior memory code and increment the version.
- Owner-matched composite foreign keys, including supersedes/correction links.
- Server-side SHA-256 hashing on both history records and memory-index versions using the already-installed pgcrypto extension, with timestamps normalized to epoch values in the digest payload.
- External-source records require a source reference; codes and version numbers are validated.
- RLS and FORCE RLS on all three tables, with authenticated owner-only SELECT/INSERT policies.
- No UPDATE or DELETE grants to authenticated users; update triggers reject mutation even if a grant is accidentally added later.
- Account deletion cascades to that account's vault data as the privacy-erasure path.
- Private trigger-function schema, not intended for Data API exposure.
- Explicit authenticated table grants are separate from Data API schema exposure; current Supabase projects may require the public schema/table exposure setting to be checked before REST access is available.

## Important boundaries
- This migration is committed to the development branch only. It has **not** been applied to the live Supabase project.
- Normal authenticated clients cannot update or delete vault records. A privileged database operator/service role remains capable of administrative actions; this is not absolute tamper-proof storage.
- SHA-256 hashes provide per-record integrity checks, not signatures, a chained ledger or proof of source truth. The application still needs a trusted retrieval-time verification path.
- v1 access scope is private only. Shared/public access requires a separate authorization design and review.
- The database migration has not yet been exercised against a disposable Supabase branch or local Postgres test database.

## Rules for future implementation
1. Never overwrite original history during summarisation or correction.
2. Give every memory and source record a unique, never-reused code within its owner scope.
3. Preserve conflicting versions and disputed records as separate evidence.
4. Link every memory summary to one or more original history records.
5. Keep original timestamps and capture timestamps separately.
6. Enforce private/shared/public access server-side; v1 deliberately permits private only.
7. Hash source records in trusted backend code and verify hashes during retrieval and backup restore.
8. Make corrections append-only and link them to the records they supersede.
9. Build explicit retrieval, search, retention, backup and restore tests before production use.

The earlier TypeScript contract validator remains useful for validating proposed records before insertion, but database constraints and RLS are the enforcement layer once this migration is safely tested and applied.
