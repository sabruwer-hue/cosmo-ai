# Cosmo AI — Prototype

A public-safe interface prototype for the Cosmo AI project.

> **Prototype status:** This repository currently contains a front-end demonstration only. The assistant responses and dashboard figures are simulated. No live AI model, persistent memory, user accounts, database, integrations, or production security controls are connected.

## Run locally
Open `index.html` in a modern browser, or serve this folder with any static web server.

## Project boundaries
- This public repository contains only non-sensitive presentation-layer prototype code.
- Private Genesis history, proprietary architecture, credentials, personal records, and operational policies must be kept in a separate private repository or secured backend.
- Never place API keys, passwords, access tokens, personal data, or production secrets in browser code or Git history.

## Next engineering stages
1. Confirm repository privacy and establish a protected source-of-truth for private project material.
2. Agree the production architecture, threat model, data classification, and approval boundaries.
3. Add a secure backend and database; keep provider keys server-side.
4. Implement authenticated identity, permission checks, audit trails, and backup/restore.
5. Connect a model provider through a server-side model router.
6. Replace simulated interface actions with tested backend workflows.

## Domain
The intended custom domain is `cosmo-ai.co.za`. DNS and hosting should only be changed after a deployment target is selected and verified.

## Engineering documents

These are design and audit documents, not evidence that the described services have been deployed.

- [Core Blueprint v1.0](docs/COSMO-CORE-BLUEPRINT-v1.md) — system boundaries, safety principles and phased build plan.
- [Prototype Audit — 2026-11-11](docs/PROTOTYPE-AUDIT-2026-11-11.md) — inspected prototype capabilities, deployment finding and owner-side checklist.
- [Memory & Research Data Model v1.0](docs/MEMORY-RESEARCH-DATA-MODEL-v1.md) — proposed entities, provenance, versioning, privacy and acceptance tests.
- [Orchestration API Contract v1.0](docs/ORCHESTRATION-API-CONTRACT-v1.md) — proposed routes, task lifecycle, approvals and server-side model boundary.
- [Knowledge Engine Specification v1.0](docs/KNOWLEDGE-ENGINE-SPEC-v1.md) — source-grounded retrieval, claims, contradictions, research, prediction evaluation and traceability.
- [Memory Relationship Engine Specification v1.0](docs/MEMORY-RELATIONSHIP-ENGINE-SPEC-v1.md) — explicit relationship types, contradiction preservation, integrity rules, audit requirements and production acceptance tests.
- [Memory Versioning & Contradiction Review v1.0](docs/MEMORY-VERSIONING-CONTRADICTION-REVIEW-v1.md) — immutable version snapshots, review outcomes, evidence discipline and production acceptance tests.
- [Memory Intelligence & Retrieval Engine v1.0](docs/MEMORY-INTELLIGENCE-RETRIEVAL-ENGINE-v1.md) — retrieval pipeline, traceability, provenance, ranking and production acceptance tests.
- [Adaptive Learning & Preference Engine v1.0](docs/ADAPTIVE-LEARNING-PREFERENCE-ENGINE-v1.md) — preference model, learning techniques, feedback lifecycle, agent isolation, safety boundaries and acceptance tests.
- [Persistent Learning & Preference Data Architecture v1.0](docs/PERSISTENT-LEARNING-PREFERENCE-DATA-ARCHITECTURE-v1.md) — persistent logical records, API contracts, approval lifecycle, security, retention, recovery and production acceptance tests.
- [Continuous Improvement & Meta-Learning Orchestration Engine v1.0](docs/CONTINUOUS-IMPROVEMENT-META-LEARNING-ENGINE-v1.md) — cross-system review loops, decision checks, method portfolio, safe experiments, background monitoring, relationship quality and controlled improvement.
- [Persistent Accuracy & Outcome Learning Engine v1.0](docs/PERSISTENT-ACCURACY-OUTCOME-LEARNING-ENGINE-v1.md) — verified outcomes, recurring error taxonomy, method evaluation, calibration, abstention, drift and regression protection.
- [Prototype Factory, Verification & Release Lifecycle v1.0](docs/PROTOTYPE-FACTORY-VERIFICATION-RELEASE-v1.md) — candidate build/test/revision cycles, independent evaluation, release gates, staged rollout and rollback.
- [Repository Review & Improvement Update](docs/REPOSITORY-REVIEW-IMPROVEMENT-UPDATE-2026-11-11.md) — source-level findings, current gaps, readiness and recommended build order.
- [Historical Intelligence, Scenario Analysis & Decision Engine v1.0](docs/HISTORICAL-INTELLIGENCE-SCENARIO-DECISION-ENGINE-v1.md) — 5–50 year historical research, source reliability assessment, private/public evidence reconciliation, time-aware comparisons, scenario outcome maps, real-data simulation and decision briefs.
- [Technological Intelligence & Discovery Map v1.0](docs/TECHNOLOGICAL-INTELLIGENCE-DISCOVERY-MAP-v1.md) — technology graph, science and component discovery, maturity/evidence, invention hypotheses, multi-branch technology pathways and technical solution packs.
- [Cosmo Subscription Product Portfolio v1.0](docs/COSMO-SUBSCRIPTION-PRODUCT-PORTFOLIO-v1.md) — standalone products, bundles, Ad Studio, Team Up AI, Creator Studio, Cosmo Office and the continuous analytical build framework.

## Current prototype modules

- **Knowledge Engine capture panel:** front-end draft capture for claims, observations, hypotheses, predictions and decisions; provenance labels; optional evidence notes/source URLs; and JSON export. Drafts remain in browser memory for the current page session only. They are not permanent records, are not verified, and are not sent to a database.

- **Memory Vault interface:** separate Main Memories index and Master History source archive, session-only draft capture, optional memory-to-source linking, text search and JSON export. Temporary draft codes are not permanent identifiers and no sensitive information should be entered.
- **Memory Relationship Engine:** explicit session-only links between memory drafts (supports, contradicts, refines, supersedes, possible duplicate, depends on, related to, derived from), endpoint validation, duplicate-link checks, broken-reference audit and relationship JSON export. Links are assertions, not proof; contradictions are preserved and not automatically resolved.
- **Memory Versioning & Contradiction Review:** creates immutable-in-session memory snapshots with change reasons and basis, displays version timelines, and records a reasoned review outcome for contradiction links without deleting either side. All data remains session-only.
- **Memory Intelligence & Retrieval Engine:** searches session-only memory, history, knowledge and relationship drafts using transparent keyword matching; supports filters, relevance ordering, provenance/relationship/version inspection and JSON retrieval-trace export. This is not semantic AI search and cannot retrieve records absent from the current page session.
- **Adaptive Learning & Preference Engine:** separate agent preference profiles, feedback/outcome capture, learning-method catalogue, scoped learning candidates and JSON export. Session-only; no model training or persistent adaptation.
- **Persistent Learning & Preference Data Architecture:** provider-neutral production design for durable user/workspace/agent profiles, immutable preference versions, feedback/outcome ledgers, approval-bound learning proposals, evaluation, rollback, permission isolation, export, deletion and recovery. Design only; no backend has been deployed.
- **Continuous Improvement & Meta-Learning Orchestration Engine:** provider-neutral design for pre-decision reviews, post-task learning, system-wide diagnostics, a method portfolio, safe experiments, background monitoring, relationship-engine self-review, approval gates and rollback. Design only; no autonomous background service is deployed.
- **Persistent Accuracy & Outcome Learning Engine:** design for verified outcome events, recurring error analysis, context-aware method evaluation, calibration, abstention, drift and regression/forgetting checks. Design only; no persistent outcome service is deployed.
- **Prototype Factory & Release Lifecycle:** design for isolated candidate builds, independent testing, iterative revisions, regression gates, candidate-hash approval, staged rollout and rollback. Design only; no autonomous factory is deployed.

## Status vocabulary

- **Planned:** documented, not built.
- **Implemented:** code exists.
- **Deployed:** running in the target environment.
- **Verified:** acceptance tests passed against that environment.
- **Production-ready:** operational, privacy, security, monitoring and recovery checks passed.

Do not describe a planned or demo-only capability as live.
