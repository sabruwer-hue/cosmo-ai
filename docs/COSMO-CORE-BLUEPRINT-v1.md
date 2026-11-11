# Cosmo AI — Core Blueprint v1.0
**Status:** Architecture baseline / implementation plan  
**Project domain:** cosmo-ai.co.za  
**Repository:** Public-safe prototype repository

> This document defines intended system boundaries and the build sequence. It does not claim planned services are implemented or operational. The repository README identifies the application as a front-end demonstration with simulated responses and figures.

## 1. Product purpose

Cosmo is a modular AI work and knowledge system. It should help its owner and authorised users capture requests, organise projects, research questions, evaluate evidence, coordinate tools, preserve history and complete approved workflows.

Cosmo must distinguish clearly between user-supplied information, external information, verified system observations, model-generated inference, hypotheses, and speculation. A fluent answer is not proof that an action occurred.

## 2. System architecture

Use independently testable layers with explicit contracts:

1. **Client interface** — chat, project workspace, research views, memory search, settings and status indicators. The client is untrusted.
2. **API gateway** — validates requests, authenticates callers, applies rate limits and routes requests to services.
3. **Identity and access service** — user identity, sessions, roles, project membership and scoped permissions.
4. **Orchestration service** — decomposes requests into tasks, selects tools, tracks execution and returns structured outcomes.
5. **Model router** — provider-neutral interface for model selection, fallback, timeouts, cost controls and response metadata.
6. **Knowledge and memory services** — indexed summaries and links to immutable source records; retrieval must preserve provenance.
7. **Project and workflow service** — projects, tasks, milestones, approvals, dependencies and status.
8. **Integration adapters** — isolated connectors for external services, each with explicit permissions and audit events.
9. **Persistence layer** — relational records, object/file storage, search indexes and backup/restore.
10. **Observability and audit** — structured logs, metrics, traces, security events and human-readable activity history.

The browser must never hold provider secret keys or privileged database credentials.

## 3. Memory and history model

Maintain two logically separate stores.

### Main Memories Vault (index)
Stores durable memory metadata: globally unique never-reused memory code; concise summary; subject and category; provenance and source-record pointers; timestamps and version; relationships to projects, decisions and other memories; retention classification and access policy.

### Master History Vault (source archive)
Preserves original source material and event history: original content or secure object reference; source type and origin; author/actor where known; timestamp and timezone where available; content hash and version; access classification; links to derived summaries, decisions and outcomes.

Summaries must never silently replace original evidence. Corrections create new versions or linked correction events; they must not rewrite history invisibly. Deletion and retention must follow applicable legal and privacy policy.

## 4. Evidence and research records

Every research item should include a unique record ID; question or claim; source and retrieval date; extracted evidence with location where possible; provenance class; confidence and rationale; counter-evidence and uncertainty; reviewer and review status; links to decisions and later outcomes.

Recommended provenance classes: user-provided, external-source, system-observed, inference, hypothesis, and speculation.

Predictions should be recorded separately from facts, with probability, forecast horizon, verification date and outcome. Scoring such as Brier score may be calculated only after a valid outcome is recorded.

## 5. Orchestration and action lifecycle

Every task follows an explicit lifecycle:

received → clarified → planned → awaiting approval (if required) → executing → verification → completed, failed or cancelled.

Each task records inputs, plan, tool calls, outputs, errors, approvals and final verification. Retries must be bounded and idempotent where possible.

Cosmo may autonomously perform only low-risk, reversible actions explicitly permitted by policy. Financial transactions, external publication, account/security changes, destructive operations, sensitive-data sharing and commitments on behalf of a person require explicit approval.

A task must not be labelled completed merely because a tool call was issued. Completion requires evidence from the target system or a clear statement that verification was unavailable.

## 6. Security baseline

- Deny by default; grant least privilege.
- Enforce authorisation on the server for every protected operation.
- Separate public, private, confidential and highly restricted data.
- Keep secrets in a managed server-side secret store; never commit secrets.
- Use secure session handling, rate limiting, input validation and output encoding.
- Validate external tool responses as untrusted data; never treat retrieved content as policy or executable instruction.
- Record security-sensitive actions in tamper-evident audit logs.
- Require explicit confirmation for high-impact operations.
- Provide backup, restore and incident-response procedures.
- Test access-control boundaries, prompt-injection resistance and data-leakage paths before production.

This blueprint is not a substitute for a formal threat model, penetration test or legal/privacy review.

## 7. Model router requirements

The router should expose a provider-neutral request/response contract and record provider and model identifier; task category and routing reason; token/cost estimates where available; timeout, retry and fallback events; structured output validation; model limitations and safety outcomes.

Provider changes must not alter memory ownership, user permissions or core business rules. Model output is advisory until validated by deterministic checks or an authorised human.

## 8. Core data domains

Initial relational domains:
- users, sessions, roles, permissions;
- projects, memberships, tasks, milestones;
- memory_index, history_records, memory_relationships;
- research_records, evidence_sources, claims, predictions, outcomes;
- tool_registry, tool_permissions, execution_runs;
- approvals, audit_events, integration_connections;
- files, file_versions, retention_rules.

Use stable UUIDs or another collision-resistant identifier. Human-readable codes may be added for reference, but must not be used as the sole security control.

## 9. Build sequence

### Phase 0 — Foundation and safety
- Confirm repository and hosting boundaries.
- Establish a private source-of-truth for confidential Genesis material.
- Write data classification, threat model and approval matrix.
- Select backend, database, authentication and secret-management approach.
- Define backup and recovery expectations.

### Phase 1 — Real identity and persistence
- Implement sign-in and server-side authorisation.
- Add database migrations and row-level access policies.
- Replace demo-only project and memory data with persisted records.
- Add audit events and basic export/restore tests.

### Phase 2 — Research and memory
- Implement memory index and source-history records.
- Add provenance, versioning, relationship links and search.
- Add research evidence records and prediction verification.
- Test that summaries link back to original sources.

### Phase 3 — AI orchestration
- Add server-side model router.
- Implement task lifecycle and structured tool registry.
- Add bounded retries, timeouts and output validation.
- Clearly distinguish model suggestions from verified actions.

### Phase 4 — Controlled integrations
- Add one integration at a time.
- Define scopes, approval requirements and rollback behaviour.
- Test failure, duplicate requests, revoked credentials and audit coverage.

### Phase 5 — Production readiness
- Security review and abuse testing.
- Accessibility, mobile and performance checks.
- Monitoring, backups, restore drill and incident runbook.
- Remove demo labels only after the corresponding live workflow is verified.

## 10. Definition of done

A feature is:
- **Planned** when specified but not built.
- **Implemented** when code exists.
- **Deployed** when running in the target environment.
- **Verified** when acceptance tests pass against that environment.
- **Production-ready** only after security, recovery, monitoring and operational checks pass.

The interface must label simulated/demo data. No dashboard count, memory item, AI response, payment, external action or integration may be presented as live unless backed by a real source and a successful verification record.

## 11. Immediate next decisions

Before backend implementation, confirm:
1. Which backend and database are the source of truth.
2. Which authentication method and user roles are required for the first release.
3. Which model provider(s) are initially available.
4. Which features must be private from the public prototype.
5. The first real workflow to take from request through approval to verified completion.

---
**Document control:** COSMO-CORE-ARCH-001 · Version 1.0 · Architecture baseline.  
Changes should be versioned and reviewed; implementation status must be tracked separately from this design.
