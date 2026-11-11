# Cosmo AI — Memory & Research Data Model v1.0

**Document ID:** COSMO-DATA-MEM-001  
**Status:** Proposed logical model — not a deployed database migration  
**Depends on:** COSMO-CORE-ARCH-001

This document defines the first persistent knowledge domains for Cosmo. It is deliberately database-provider-neutral. PostgreSQL is a suitable implementation target, but the backend/database choice must be confirmed before executable migrations or security policies are committed.

## 1. Non-negotiable data principles

1. **Source before summary.** A memory summary must point to one or more source records. It is never a replacement for the source.
2. **Provenance travels with data.** Every claim, extracted passage and generated summary records where it came from and how it was produced.
3. **History is append-oriented.** Corrections and status changes create new versions/events. They do not silently overwrite the audit trail.
4. **Identifiers are never recycled.** Use collision-resistant internal IDs. Human-readable codes are unique, immutable and never reassigned after archival or deletion.
5. **Access is checked server-side.** Client-side visibility is not a security boundary.
6. **Deletion is governed.** Immutable history does not mean retaining personal data forever. Legal erasure, retention limits and user rights must be supported through controlled redaction, tombstones or cryptographic erasure where appropriate, while preserving only lawful audit metadata.
7. **AI output is not fact by default.** Generated content is marked as model output, inference, hypothesis or speculation until independently supported.

## 2. Logical entities

### Identity and access
- users — account identity and lifecycle status.
- workspaces — security and ownership boundary; the initial owner workspace can be single-user.
- workspace_members — user membership and role.
- roles / permissions — role definitions and allowed operations, or an equivalent policy system.
- sessions / auth identities — preferably delegated to the selected identity provider; do not store raw passwords.

### Projects and work
- projects — name, purpose, status, owner workspace, visibility and timestamps.
- project_members — scoped access for users and service identities.
- tasks — request, plan, state, priority, due date and project relationship.
- task_events — append-only lifecycle events, including approval, execution, verification, failure and cancellation.
- approvals — approver, scope, exact action approved, expiry, decision and evidence. Approval must be bound to a specific action payload/hash, not a vague blanket permission.

### Memory and source history
- memory_entries — searchable index record: immutable memory code, current summary pointer, category, subject, classification, lifecycle and retention rule.
- memory_versions — versioned summary/content, author or generating process, timestamps and provenance links.
- history_records — source archive metadata: source type, origin, captured timestamp, content hash, storage reference, classification and retention state.
- history_versions — immutable source versions or correction/redaction events.
- memory_sources — many-to-many links from memory versions to history records, with relationship type and supporting excerpt/locator.
- memory_relationships — typed links such as related-to, supersedes, contradicts, derived-from, supports and concerns-project.
- record_access_events — access to restricted records where risk classification requires it.

### Research and evidence
- research_questions — question being investigated, scope, status and owner.
- claims — individual testable statements; keep each claim narrow enough to evaluate.
- evidence_sources — source metadata, publisher/author, canonical URL or source locator, retrieval time, publication time if known, and source quality notes.
- evidence_items — exact excerpt or structured observation, locator, content hash, provenance class and relationship to a claim.
- claim_assessments — current assessment, confidence, rationale, reviewer and assessment date. New assessments create new versions.
- counter_evidence_links — evidence that challenges or qualifies a claim.
- predictions — forecast statement, probability, target event, forecast horizon and verification date.
- prediction_outcomes — observed outcome, source, verifier and scoring status. Outcome must be recorded before any forecast score is calculated.

### AI execution and integrations
- tool_registry — tool name, version, description, input/output contract and risk class.
- tool_permissions — scoped grants, allowed operations, expiry and approval requirements.
- execution_runs — task, model/provider metadata, selected tools, start/end time and execution status.
- execution_events — ordered event stream for calls, results, retries, validation and errors.
- integration_connections — provider identity and secret reference only; never store raw secret values in ordinary application tables.
- audit_events — actor, action, target, timestamp, outcome, request correlation ID and tamper-evidence metadata.

## 3. Key relationships

- A workspace owns many projects, memory entries and research questions.
- A project has many tasks and may be linked to many memories and research questions.
- A task has many ordered task events, zero or more approvals and one or more execution runs.
- A memory entry has one or more versions; each version can cite multiple source history records.
- A history record may support multiple memory versions and claims.
- A research question contains multiple claims; a claim can have multiple supporting and counter-evidence items.
- A prediction belongs to a claim or research question and can have at most one accepted final outcome, with corrections represented as outcome events/versions.
- An execution run emits ordered events and references the model and tools used.

## 4. Identifier and code policy

- Internal primary keys: UUIDv7 or another collision-resistant identifier supported by the chosen database.
- Human-readable memory codes: COSMO-MEM-000001; research records: COSMO-RES-000001; history records: COSMO-HIS-000001.
- Enforce uniqueness in the database, not only in application code.
- Allocate codes transactionally from a protected sequence or collision-safe allocator.
- Never recycle a code, even if the record is archived or lawfully erased. Keep a minimal tombstone only where lawful and necessary to prevent reuse.
- Do not expose sequential IDs as authorization tokens.

## 5. Provenance vocabulary

Use controlled values, not free-form labels:
- user_provided
- external_source
- system_observed
- model_generated
- inference
- hypothesis
- speculation

A derived item may have multiple sources. Store provenance per source link and record the transformation method/model/version. Do not collapse mixed provenance into a single misleading label.

## 6. Access and privacy model

Recommended classification levels:
- public
- workspace
- confidential
- restricted

Every row containing user or project data must be scoped to a workspace and checked against membership/role on the server. Restricted records require explicit grants and access logging. Service roles must be narrowly scoped and must not bypass authorization unintentionally.

Before launch, test:
- user A cannot read or mutate user B's workspace records;
- a project member cannot access unrelated projects;
- revoked membership immediately blocks subsequent requests;
- public endpoints cannot enumerate private IDs or records;
- exports include only records the requester may access;
- logs do not leak secrets or unnecessary personal data;
- retention and deletion rules work across source records, summaries, indexes, backups and derived records.

## 7. Versioning and integrity

For source records and memory versions, store:
- content hash using a modern cryptographic hash;
- content or secure object-storage reference;
- created timestamp in UTC and original timezone when known;
- actor or process identity;
- schema/version identifier;
- parent version or correction relationship.

A hash helps detect changes but does not prove that the original source was truthful. Preserve source origin and acquisition context separately.

## 8. Retrieval behaviour

Memory retrieval should return, at minimum:
- memory code and current version;
- concise summary;
- provenance classification;
- source record references;
- confidence/assessment status where relevant;
- classification and permission result;
- last reviewed timestamp.

For consequential answers, Cosmo should be able to open the underlying source records and show contradictions or missing evidence. If no supporting source exists, it must say so.

## 9. Acceptance tests before calling this live

### Memory
- Create a memory and receive a unique permanent code.
- Reload and retrieve it from persistent storage.
- Create a revised summary while retaining the previous version.
- Follow each source link to the original source record.
- Confirm duplicate code allocation is impossible.
- Confirm an unauthorised user cannot retrieve it.
- Confirm export and restore preserve IDs, versions and provenance.

### Research
- Create a research question and a claim.
- Attach supporting and counter-evidence from distinct sources.
- Record assessment rationale and reviewer.
- Create a prediction with probability and verification date.
- Refuse to score it before an outcome exists.
- Record the outcome and calculate the selected score reproducibly.

### Integrity and governance
- Confirm task and approval events are ordered and attributable.
- Confirm high-impact actions cannot execute without a valid, unexpired approval bound to the exact action.
- Confirm correction, retention and deletion workflows are auditable.
- Confirm a failed operation is recorded as failed, not completed.

## 10. Implementation gate

Do not create production migrations until the owner confirms:
1. Backend/database provider and hosting environment.
2. Authentication provider and first-release user roles.
3. Workspace model (single-owner first, or multi-user from day one).
4. Data retention and deletion requirements.
5. Whether original files are stored in database storage or an external object store.

Once confirmed, translate this logical model into reviewed migrations, indexes, constraints, row-level policies and automated tests. This document itself is a design artifact, not evidence of a deployed vault.
