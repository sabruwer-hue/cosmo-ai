# Cosmo Main Memories Vault + Master History Vault Contract v1

## Separation of duties
- **Main Memories Vault:** searchable index of coded memory entries, summaries, project links, retention and access metadata.
- **Master History Vault:** preserved original source records, provenance, original/capture timestamps, integrity metadata, contradictions and correction links.
- Memory summaries are navigation aids. They are never substitutes for original source evidence.

## Implemented in this source-only increment
A pure TypeScript contract validator checks:
- unique memory/history codes;
- non-empty original source content and index summaries;
- source provenance, timestamp and hash-presence requirements;
- index-to-history links and correction/supersedes links;
- uncertainty labels and retention warnings.

## Not implemented yet
- Persistent storage, append-only database constraints, cryptographic hash calculation/verification, signed audit events, key management, backup/restore tests, authenticated access controls, retention automation, search/retrieval UI, ingestion pipeline or full Genesis archive recovery.
- The current access and integrity labels are data contracts, not enforcement mechanisms.

## Rules for future implementation
1. Never overwrite or delete original history during summarisation or correction.
2. Give every memory and source record a unique, never-reused code.
3. Preserve conflicting versions and disputed records; surface disagreement rather than silently resolving it.
4. Link every memory summary to one or more original source records.
5. Keep original timestamps and capture timestamps separately.
6. Enforce private/shared/public access server-side and test RLS.
7. Hash and sign source records in trusted backend code; verify integrity during retrieval and backup restore.
8. Make corrections append-only and link them to the records they supersede.

This validator does not itself make records immutable. Production claims require reviewed schema, database policies, backups and restore tests.
