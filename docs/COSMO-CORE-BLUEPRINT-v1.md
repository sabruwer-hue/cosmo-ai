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

## 12. Adaptive learning and preference intelligence

Cosmo must adapt to each authorised person and dedicated agent without confusing preference, context, feedback, model output and verified fact.

### 12.1 Separate preference profiles
Maintain scoped profiles by user, workspace and agent. Capture explicit communication and language preferences, response detail, pace, initiative, preferred formats/examples, accessibility requirements voluntarily supplied, interests, active goals, routines, task context and avoidances. Each preference carries provenance (explicit, feedback, observed or inferred), confidence/rationale, scope, timestamp, expiry/review state and consent/permission. Explicit user instructions outrank weak inferred patterns. Inferences remain tentative until confirmed.

### 12.2 Learning methods
Use the method suited to the task, including:
- explicit preference learning and user-configured settings;
- supervised learning from labelled examples and corrections;
- feedback/preference learning from ratings, comparisons and edits;
- contextual adaptation to task, environment, time, device and constraints;
- online/incremental learning with drift checks and rollback;
- active learning and targeted clarification;
- unsupervised pattern discovery and semi-supervised learning;
- transfer learning with strict separation of private profiles;
- few-shot/in-context learning and demonstration/imitation learning;
- meta-learning to evaluate which strategies work for which tasks;
- reinforcement learning only in approved simulations/sandboxes with explicit reward and constraint models;
- retrieval-augmented generation grounded in authorised memories and sources;
- multi-agent collaboration through scoped knowledge contracts;
- prediction/outcome learning and continual-learning governance.

Retrieval, context examples and preference capture are not automatically model-weight training. Dataset creation, fine-tuning or external provider training requires separate informed consent, documented purpose, data rights and retention/deletion controls.

### 12.3 Feedback-to-adaptation lifecycle
Capture task context, agent, feedback, observed outcome, provenance and requested learning scope. Classify feedback as task-specific, candidate agent preference or candidate shared rule. Validate repeated signals and conflicts; propose a change with rationale; obtain required approval; evaluate against a baseline; version the adaptation; monitor for regressions; retain rollback. A single rating must not silently rewrite a durable preference.

### 12.4 Household and agent boundaries
Keep each person's profile and each dedicated household agent separate. Do not assume one member's preferences apply to another. Shared knowledge is distinct from shared preferences. Cross-agent transfer requires explicit authorization and field-level access checks. All agents inherit the same non-overridable safety and security policy.

### 12.5 Non-learning safety boundaries
Safety, consent, security, legal compliance, access control and tool permissions are policy constraints, not learned preferences. Medical, financial, legal, vehicle, energy and physical-control decisions require deterministic safeguards and appropriate human authorization. No live safety-critical trial-and-error reinforcement learning is allowed. User preferences cannot grant permissions the user does not hold.

### 12.6 User control and evaluation
Users must be able to inspect, correct, reject, expire, export and delete profile data subject to lawful retention. Track task success, correction rates, user satisfaction, calibration, latency, error rates, privacy incidents and performance regressions. Preserve model, prompt, adapter, dataset and policy versions with evaluation baselines and rollback records.

## 13. Persistent learning and preference data

The persistent learning design is specified in [Persistent Learning & Preference Data Architecture v1.0](PERSISTENT-LEARNING-PREFERENCE-DATA-ARCHITECTURE-v1.md). It defines user/workspace/agent-scoped profiles, immutable preference versions, feedback and verified outcome ledgers, learning candidates, approval-bound adaptation proposals, evaluation runs, controlled releases, rollback and auditable deletion/export/recovery.

The production sequence begins with identity, tenancy and server-side authorization. No durable profile or learning event may be exposed across household members or agents by default. Background jobs must re-check permission and consent. No adaptation is activated from a rating alone; it must pass proposal, approval and evaluation gates. This is a provider-neutral design, not deployed persistence.

## 14. Continuous improvement and meta-learning

Cosmo's cross-system improvement doctrine and architecture are defined in [Continuous Improvement & Meta-Learning Orchestration Engine v1.0](CONTINUOUS-IMPROVEMENT-META-LEARNING-ENGINE-v1.md). It establishes proportionate pre-decision reviews, post-task learning reviews, system-wide diagnostics, a persistent improvement registry, a context-aware method portfolio, safe experiments, background monitoring controls, relationship-engine self-review, controlled releases and rollback.

The intended behaviour is continuous analysis and improvement proposals, not unchecked self-modification. Background analysis is read-only by default; consequential changes require designated approvals, tests and rollback controls. The method portfolio preserves useful alternatives rather than discarding every method except the current leader. This remains a design specification, not an operating background service.

## 16. Historical intelligence, scenario analysis and decision support

Cosmo's central advisory capability is specified in [Historical Intelligence, Scenario Analysis & Decision Engine v1.0](HISTORICAL-INTELLIGENCE-SCENARIO-DECISION-ENGINE-v1.md). It researches configurable recent and long historical horizons (commonly 5–10 years and up to 50 years where relevant), compares exact periods such as 1994 and 2005, evaluates public and authorised private evidence, tracks claim- and domain-specific source performance, and preserves conflicting accounts for review.

It builds structured scenario comparisons and evidence-linked outcome maps, replays historical cases against real data, tests alternative actions, and creates decision briefs with uncertainty, trade-offs, monitoring triggers and fallback plans. It integrates with both Memory Vaults, research, relationships, verified outcomes, continuous improvement and controlled simulation.

This engine embodies Cosmo's advisory principle: intelligence is not merely producing an answer or claiming certainty; it is identifying the most responsible next action under the circumstances. It must also recognise when to gather more evidence, delay, escalate, preserve options or abstain. It is an architecture specification, not a live research or autonomous decision service.

## 15. Prototype factory and accuracy learning

The build-test-revise-release process is specified in [Prototype Factory, Verification & Release Lifecycle v1.0](PROTOTYPE-FACTORY-VERIFICATION-RELEASE-v1.md). Accuracy based on persistent verified outcomes is specified in [Persistent Accuracy & Outcome Learning Engine v1.0](PERSISTENT-ACCURACY-OUTCOME-LEARNING-ENGINE-v1.md). These engines close the gap between architectural ideas and measurable improvements. They remain design specifications until their runtime, datasets, backend and approval controls are implemented.


## 17. Technological intelligence, discovery and solution engineering

The central intelligence integrates the [Technological Intelligence & Discovery Map](TECHNOLOGICAL-INTELLIGENCE-DISCOVERY-MAP-v1.md). Cosmo must map scientific principles, technologies, components, materials, patents, standards, suppliers, maturity, dependencies, bottlenecks and failure modes. It should discover possible combinations and design hypotheses, then test them through CIPHER, Engineer, Probe Bot, CC-SIM and the controlled Prototype Factory.

For technical problems, Cosmo should produce a traceable solution pack: problem definition, existing solutions, recommended and alternative architectures, components/interfaces, calculations and assumptions, standards, bill of materials, build sequence, test criteria, hazards/safeguards, cost/time ranges, IP/licensing and unresolved questions. A generated design is not a certified engineering design until qualified review and required testing pass.

The technology map must create multiple branches for one problem, including proven solutions, adaptations, combinations, new research, procurement/partnership, low-cost feasibility tests and stop/redesign paths. Each branch records evidence, assumptions, events, multiple possible outcomes and fallback routes.

## 18. Genesis history, creator context and constitutional training

The [Genesis–Cosmo Historical Requirements & Identity Audit](GENESIS-COSMO-HISTORICAL-REQUIREMENTS-IDENTITY-AUDIT-v1.md) is the current recovery baseline, not a declaration that history recovery is complete. Genesis remains the predecessor and origin record; Cosmo is the current public/work identity; Cosmos is retained as a historical alias. Preserve original creator and protocol labels verbatim until reconciled.

Cosmo must maintain three separate governed layers:
1. **Cosmo Constitution:** stable moral and safety principles, policy boundaries and corrigibility.
2. **Creator Context Profile:** user-confirmed identity, preferences, goals, working context and explicit instructions, with provenance, scope, sensitivity and user controls.
3. **Project/Business Knowledge:** isolated, source-linked records with independent access controls.

The creator context must not be confused with Cosmo's identity or constitution. Explicit instructions outrank inferred preferences. Sensitive personal details require appropriate consent and purpose limitation. Private user data must not be used for external model training or disclosed to other agents/providers without explicit permission.

Historical TIVA roles, Genesis/PICC witness formats, IP protection, Tree of Knowledge, GACC, Evaluation Vault, Master Briefing, Portfolio Ratings, Tech Inventory, Business Strategy/Research Board, Decisions Register, Consolidation Log and Approvals Inbox must remain in the recovery ledger. The unresolved Emanuel/Fanus creator-label discrepancy must not be silently overwritten.

The proposed moral constitution is reviewable and must be traceable to source wording. It is not enforced merely by a prompt: consequential actions remain governed by the independent policy core, scoped permissions, human approval, audit and appeal.
