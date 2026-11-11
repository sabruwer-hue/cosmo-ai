# Cosmo AI — Persistent Learning & Preference Data Architecture v1.0

**Document ID:** COSMO-ADAPT-STORE-001  
**Status:** Provider-neutral production design; not a deployed database or API  
**Depends on:** COSMO-CORE-ARCH-001, COSMO-DATA-MEM-001, COSMO-ADAPT-001, COSMO-API-ORCH-001

## 1. Purpose and boundary

This specification turns the Adaptive Learning & Preference Engine into a persistent, auditable service. It defines records, lifecycle, permissions, API boundaries, retention, recovery and acceptance tests. It does not select or deploy a database, authentication provider, hosting environment, model provider or training pipeline. Browser drafts are not permanent. The browser is an untrusted client; persistence and policy enforcement belong on the server.

## 2. Core principles

1. Separate identity, agent identity, preference, feedback, learning proposal, approval, evaluation and model artifact.
2. Scope every record to an owner/user, workspace and agent where applicable.
3. Preserve source and provenance; never silently turn an inference into an explicit preference.
4. Append events and version mutable profiles. Do not overwrite audit history.
5. Make adaptation a proposal-and-approval lifecycle, not an automatic side effect of feedback.
6. Enforce permissions server-side before reading, searching, exporting, sharing or adapting data.
7. Keep policy constraints separate from learned preferences.
8. Make export, correction, expiry, deletion, backup and restoration first-class operations.
9. Keep provider-specific details behind adapters.
10. Use permanent collision-resistant IDs; human-readable codes are unique and never recycled.

## 3. Logical record catalogue

### 3.1 Identity and scope
- **User:** authenticated human principal.
- **Workspace:** private owner space or explicitly shared collaboration space.
- **Agent:** dedicated Cosmo agent instance/profile, such as a household or specialist agent.
- **Agent membership:** binds a user to an agent with a role and permission set.
- **Consent grant:** purpose-specific permission, scope, version, granted/revoked time, actor and evidence. Training consent is separate from ordinary product operation.

### 3.2 Preference records
- **Preference profile:** stable identity for one user's preferences within one workspace and agent.
- **Preference version:** immutable snapshot of profile fields at a point in time.
- **Preference item:** typed setting such as language, response detail, tone, pace, initiative, output format, accessibility preference, routine or explicit avoidance.
- **Preference evidence:** source feedback, explicit instruction or approved observation supporting a preference.
- **Preference review:** confirmation, correction, rejection, expiry or dispute event.

Every preference item stores an immutable ID and profile ID; field key, typed value and schema version; scope (task, agent, workspace or explicitly shared); provenance (explicit user, direct feedback, repeated observation, inference or imported); confidence only when meaningful plus rationale; status (proposed, confirmed, rejected, expired or superseded); actor and timestamps; effective-from and optional expiry/review date; source references and consent/purpose reference.

### 3.3 Learning and evaluation records
- **Feedback event:** user rating, correction, comparison or written response tied to a task/agent and optional result.
- **Outcome event:** independently observed result, verification source and timestamp; distinct from user satisfaction.
- **Learning candidate:** structured lesson or proposed change linked to feedback/outcome records.
- **Adaptation proposal:** exact proposed profile, prompt, retrieval, routing or workflow change, with rationale, expected effect, scope and risk.
- **Approval decision:** authenticated human decision bound to a proposal version/hash, actor, scope, timestamp and expiry.
- **Evaluation run:** reproducible baseline-versus-candidate test, dataset/version, metrics, evaluator and result.
- **Adaptation release:** approved, evaluated configuration version activated for a specific agent/scope.
- **Rollback event:** reverts an activation to a known prior version, with reason and actor.
- **Drift/incident event:** detected degradation, stale preference, privacy issue or unexpected behaviour.
- **Model/training artifact reference:** metadata and integrity reference only; model binaries and secrets must not be exposed to the client or public repository.

### 3.4 Governance records
- **Audit event:** append-only actor/action/target/scope/result record with correlation ID and timestamp.
- **Retention rule:** category, purpose, duration, legal hold and deletion workflow.
- **Deletion job:** scoped request, approvals, execution state and proof of completion across primary records, indexes, caches, derived datasets and eligible backups.
- **Export job:** authorised export manifest, included record versions, checksums and completion state.
- **Restore event:** restore point, operator, verification results and records replayed.

## 4. Relationship model

One workspace contains users, agents and projects under its permission boundary. A user may have separate preference profiles for separate agents. Each profile has immutable versions and preference items. Feedback events may support learning candidates. A candidate may generate adaptation proposals. A proposal has versioned approval decisions and evaluation runs. Only a valid approved proposal that passes evaluation can create an adaptation release. Every release points to the exact activated configuration and predecessor. Rollback creates a new event; it does not erase historical activation. Derived records retain source-event and consent links.

## 5. State machines

Preference item: proposed → confirmed, rejected, expired or superseded. An explicit user setting may be confirmed immediately when the user has authority and the field is not policy-controlled. Inferred preferences begin as proposed. Conflicting explicit instructions require clarification or scoped resolution; recency alone must not decide.

Learning candidate: captured → triaged → accepted for evaluation, rejected or needs more evidence → evaluated.

Adaptation proposal: draft → awaiting approval → approved, rejected or expired → evaluating → eligible for release or failed evaluation → released → rolled back or superseded.

Transitions require actor, timestamp, rationale and audit event. Model output cannot approve its own proposal. Approval is invalid if proposal payload hash or scope changes.

## 6. Permission and isolation model

- Users access only workspaces they belong to.
- Agent access requires explicit membership and allowed role.
- Preference profiles are private to their owner and designated agent by default.
- Household members do not inherit one another's preferences.
- Cross-agent sharing requires explicit field-level authorization and applicable consent.
- Shared knowledge does not imply shared preference data.
- Support/administrator access is least-privilege, time-limited, justified and audited.
- Exports and deletion requests receive the same scope checks as reads.
- Background jobs re-check authorization and consent at execution time.
- Retrieval, caches, embeddings and analytics preserve source permissions.

Never trust client-supplied owner IDs, workspace IDs, roles, agent IDs or approval state. Derive identity from the authenticated server session and validate all referenced records.

## 7. Suggested service/API contract

Provider-neutral examples under the versioned API prefix /api/v1:

**Profiles and preferences**
- GET /agents/{agent_id}/preference-profile
- POST /agents/{agent_id}/preference-items
- POST /preference-items/{item_id}/confirm
- POST /preference-items/{item_id}/reject
- POST /preference-items/{item_id}/expire
- GET /agents/{agent_id}/preference-profile/versions
- POST /preference-profiles/{profile_id}/corrections

**Feedback and outcomes**
- POST /agents/{agent_id}/feedback-events
- POST /feedback-events/{event_id}/outcomes
- GET /agents/{agent_id}/feedback-events

**Learning proposals and approval**
- POST /learning-candidates
- POST /learning-candidates/{candidate_id}/triage
- POST /adaptation-proposals
- POST /adaptation-proposals/{proposal_id}/approval-decisions
- POST /adaptation-proposals/{proposal_id}/evaluation-runs
- POST /adaptation-proposals/{proposal_id}/release
- POST /adaptation-releases/{release_id}/rollback

**Governance**
- GET /agents/{agent_id}/learning-audit
- POST /preference-profiles/{profile_id}/export-jobs
- POST /preference-profiles/{profile_id}/deletion-jobs
- GET /jobs/{job_id}

All writes validate schema, actor, workspace, agent scope, idempotency key and allowed state transition. Long-running jobs return job IDs and explicit states. Never return secrets or private records to unauthorized callers.

## 8. Persistence and integrity requirements

- Use database-generated or cryptographically strong UUID/ULID-style IDs; browser counters are not permanent identifiers.
- Enforce unique constraints on immutable public codes within their namespace.
- Store profile snapshots as versioned records and item-level change events.
- Use transactions for proposal approval, release activation and rollback.
- Bind approvals to proposal version, payload hash, target agent, scope and expiry.
- Use idempotency keys for retried writes.
- Store timestamps in UTC and retain display timezone separately where needed.
- Store structured preferences as schema-versioned typed data; validate values against allowlists.
- Use optimistic concurrency/version checks to prevent lost updates.
- Use content hashes for export manifests and immutable evidence blobs where applicable.
- Encrypt data in transit and at rest; keep keys in a managed secret/key service.
- Encrypt, access-control and regularly restore-test backups.
- Never store API keys, access tokens or model secrets in preference records, logs, client code or this public repository.

## 9. Learning policy and evaluation gates

Explicit user instruction outranks weak observed/inferred signals within the same valid scope. Feedback about one task remains task-scoped unless the user chooses to propose a broader preference. A single rating cannot silently change a durable profile. Candidate changes are compared with a known baseline using representative test cases. Evaluate task success, correction rate, user satisfaction, calibration, latency, safety regressions, privacy impact and relevant subgroup performance. Define acceptance thresholds before evaluation; do not move thresholds after seeing results without a new version and rationale. Failed evaluation blocks release. Regression or drift may trigger rollback or suspension.

External model fine-tuning/training requires separate informed consent, documented data rights, purpose, provider terms, retention and deletion capability. Retrieval, in-context examples, prompt configuration and profile settings are not model-weight training. Reinforcement learning is limited to approved simulation/sandbox environments; never use live safety-critical trial-and-error.

## 10. Retention, deletion, export and recovery

Retention is configurable by record category and legal purpose; do not invent a universal duration. Preserve audit events only as long as a documented lawful purpose requires. Where deletion is required, retain only the minimum permitted proof.

A deletion workflow must authenticate the requester and verify authority; show scope and affected categories; track request state; stop future processing under revoked purpose/consent; remove or irreversibly de-identify eligible primary data and derived copies; propagate to search indexes, caches, analytics and eligible training datasets; record backup expiry/rotation handling and lawful exceptions; and produce a completion report.

Export preserves codes, versions, provenance, relationships, consent metadata and checksums. Restore tests verify referential integrity, permissions and audit ordering before service resumes.

## 11. Operational monitoring

Monitor failed writes, authorization denials, cross-scope access attempts, stale jobs, queue delay, profile conflicts, preference churn, evaluation failures, regressions, drift, rollback events, deletion propagation and backup/restore outcomes. Logs avoid unnecessary personal content and secrets. Alert on security and integrity failures, not every ordinary preference change.

## 12. Suggested implementation sequence

- **PL-0 — decisions:** select backend/runtime, database, auth, single-owner or multi-user workspace model, storage, retention and first agent roles.
- **PL-1 — identity and tenancy:** authenticated identity, workspaces, agent registry, membership, server-side authorization and audit.
- **PL-2 — durable preferences:** profile/item/version records, user inspection and correction, explicit consent.
- **PL-3 — feedback ledger:** feedback and independently verified outcome events, idempotency and provenance.
- **PL-4 — proposal governance:** learning candidates, approval binding, state machine and policy gates.
- **PL-5 — evaluation and release:** reproducible tests, metrics, controlled activation, monitoring and rollback.
- **PL-6 — export/recovery/deletion:** retention jobs, export manifests, backup and restore verification.
- **PL-7 — optional model adaptation:** only after separate training consent, data rights, provider review and safety approval.

Do not begin production migrations until the implementation gate in the core data model is resolved. No assumption is made that another Cosmo-related or business project already has a compatible backend.

## 13. Production acceptance tests

**Identity and isolation**
- Anonymous access is denied.
- A user cannot forge another owner, role, workspace or agent.
- Household agent profiles remain isolated by default.
- Cross-agent preference access is denied without explicit field-level authorization.
- Background jobs re-check current permission and consent.

**Preference integrity**
- Every durable preference has provenance, scope, owner, version and status.
- Explicit instructions are distinguishable from inference.
- A correction creates a new version and preserves prior history.
- Expired/rejected preferences are not silently applied.
- Conflicting preferences trigger a review path.

**Feedback and adaptation**
- Feedback and verified outcome are separate record types.
- Repeated delivery with the same idempotency key does not duplicate events.
- Feedback cannot directly activate a durable adaptation.
- Approval is bound to exact proposal content and scope.
- Failed evaluation blocks release.
- Rollback restores the previous effective configuration and leaves event history intact.

**Privacy and recovery**
- Export contains only authorized records and preserves provenance/version links.
- Deletion propagates to eligible derived stores and records lawful exceptions.
- Restore preserves IDs, versions, relationships, consent and audit ordering.
- No secrets appear in browser bundles, logs, exports or public Git history.

**Safety**
- Learned preferences cannot override safety policy or permissions.
- No live safety-critical reinforcement learning is possible.
- Training data cannot be sent to an external provider without separate consent and policy approval.

## 14. Implementation gate and current status

This is a design artifact. No database tables, API endpoints, authentication, persistent profile store, background jobs, training pipeline or production release have been deployed by this document.

Before executable migrations are prepared, the owner must confirm backend/database, authentication, tenancy, initial agent roles, object storage and retention/deletion policy. Once confirmed, translate this logical model into reviewed migrations, indexes, constraints, row-level policies and automated tests.

## 15. Continuous improvement integration

The cross-system review, experiment and method-portfolio lifecycle is specified in [Continuous Improvement & Meta-Learning Orchestration Engine v1.0](CONTINUOUS-IMPROVEMENT-META-LEARNING-ENGINE-v1.md). Improvement observations and lessons must link to feedback, outcomes, preference versions, evidence, memory versions and approvals. A successful adaptation is not automatically generalised beyond its tested user, agent, task or workspace scope.
