# Cosmo AI — Prototype

A public-safe interface prototype for the Cosmo AI project.

> **Current status (12 November 2026):** the live `cosmo-core` Supabase project is active in São Paulo and has 47 public-schema tables, all with Row Level Security enabled, 14 recorded migrations and nine active Edge Functions. It includes persistent conversations/messages, missions, knowledge and memory links, training, task workflows, package/entitlement foundations, Yoco checkout foundations, QR Retail data and a strategy/courseware foundation. The latter currently contains ten libraries, 26 strategies, two courses, ten modules and 20 lessons; all starter strategies are unverified in Cosmo. The chat gateway is deployed with JWT verification and a server-side owner-email check. End-to-end model calls, owner sign-in, browser workflows, payment flows, backups and production deployment still require verification. The Strategy Academy interface is on the current review branch and is not live until merged and deployed.

## Run locally
Open `index.html` in a modern browser, or serve this folder with any static web server. The private authentication and chat gateway require the deployed Supabase project and an authorised owner account; local file preview alone will not connect to the production service.

## Current private backend
- Supabase project: `cosmo-core` (São Paulo region, `sa-east-1`).
- Database: 47 tables with RLS enabled; 14 recorded migrations. Persistent domains include profiles, missions, knowledge, memory links, conversations/messages, training, audit events, tasks/steps/events/approvals, packages/releases, subscription catalogue, billing, entitlements, invoices, usage, Yoco checkout and QR Retail.
- Strategy/courseware: ten libraries, 26 strategies, 26 immutable version-1 snapshots, two strategy relationships, two courses, ten modules and 20 lessons. Seed strategies are marked unverified in Cosmo. Strategy run/evaluation and learner progress records start empty.
- Active Edge Functions: `cosmo-chat`, `cosmo-admin-gate`, `cosmo-product-hub`, `cosmo-start-plan`, `cosmo-access-gate`, `cosmo-payfast-checkout`, `cosmo-payfast-itn`, `cosmo-yoco-checkout`, and `cosmo-yoco-webhook`.
- `cosmo-chat` has JWT verification, a server-side owner-email check and a small allowlist for task, knowledge, mission and approval-record operations. These internal tools do not execute external actions. Successful live model inference still needs an end-to-end test.
- `work.html` supports database-backed tasks, ordered steps, task events, approvals and package/release records. `admin.html` supports owner-verified mission management, knowledge capture and training lessons. The Strategy Academy page is being added on a review branch.
- Anonymous Data API grants are limited to SELECT on the three public subscription catalogue tables. Private billing, entitlement, checkout and retail tables have no anonymous table grants. The current security advisor returns no findings; the performance advisor has only informational unused-index notices.
- Required server-side secrets include `COSMO_OWNER_EMAIL`, `COSMO_MODEL_API_KEY`, and payment-specific keys/secrets when those features are activated. Their presence must be checked in Supabase; never put secret values in browser code or Git.
- Sign-in uses Supabase email magic links. The owner account and deployed origins must be configured in Supabase Auth. Successful owner sign-in and redirect behaviour have not yet been verified.


## Deployment gate
The last recorded GitHub Pages workflow failed at the Configure Pages step. Re-check **Settings → Pages → Build and deployment → Source**, select **GitHub Actions** if it is not already selected, and rerun the workflow. Deployment has not been re-verified in this audit; do not treat DNS or a configured domain as proof that the site is live. The current repository is public; keep all creator history, private training content and secrets in the private Supabase project, never in this repository.

## Project boundaries
- This public repository contains only non-sensitive presentation-layer prototype code.
- Private Genesis history, proprietary architecture, credentials, personal records, and operational policies must be kept in a separate private repository or secured backend.
- Never place API keys, passwords, access tokens, personal data, or production secrets in browser code or Git history.

## Next engineering stages
1. Resolve repository privacy and keep private Genesis history and creator-only training material out of the public repository.
2. Finish owner account, server secrets, Auth redirect and GitHub Pages deployment.
3. Connect and verify `cosmo-ai.co.za`, then add `app.cosmo-ai.co.za` and `admin.cosmo-ai.co.za` routing if desired.
4. Test Work, Admin, chat, database persistence, approvals and package registry with the real owner session.
5. Build signed Android Trusted Web Activity APKs for the user app and Admin Portal after the final HTTPS domain is live; signing and Android release configuration still require a manual owner-side step.
6. Connect the remaining knowledge, memory, retrieval, training evaluation and agent-orchestration modules to persistent services.

## Domain
The intended primary domain is `cosmo-ai.co.za`. The preferred app routes are `app.cosmo-ai.co.za` and `admin.cosmo-ai.co.za`. DNS and HTTPS must be configured after a successful GitHub Pages deployment is confirmed. The APKs cannot be finalized until the verified HTTPS origin and Android signing configuration are ready.

## Engineering documents

These are design and audit documents, not evidence that the described services have been deployed.

- [Master Audit & Build Status — 12 November 2026](docs/COSMO-MASTER-AUDIT-AND-BUILD-STATUS-2026-11-12.md) — verified backend inventory, implemented work, remaining gaps and build order.
- [Core Blueprint v1.0](docs/COSMO-CORE-BLUEPRINT-v1.md) — system boundaries, safety principles and phased build plan.
- [Prototype Audit — 2026-11-11](docs/PROTOTYPE-AUDIT-2026-11-11.md) — inspected prototype capabilities, deployment finding and owner-side checklist.
- [Memory & Research Data Model v1.0](docs/MEMORY-RESEARCH-DATA-MODEL-v1.md) — proposed entities, provenance, versioning, privacy and acceptance tests.
- [Orchestration API Contract v1.0](docs/ORCHESTRATION-API-CONTRACT-v1.md) — proposed routes, task lifecycle, approvals and server-side model boundary.
- [Knowledge Engine Specification v1.0](docs/KNOWLEDGE-ENGINE-SPEC-v1.md) — source-grounded retrieval, claims, contradictions, research, prediction evaluation and traceability.
- [Memory Relationship Engine Specification v1.0](docs/MEMORY-RELATIONSHIP-ENGINE-SPEC-v1.md) — explicit relationship types, contradiction preservation, integrity rules, audit requirements and production acceptance tests.
- [Memory Versioning & Contradiction Review v1.0](docs/MEMORY-VERSIONING-CONTRADICTION-REVIEW-v1.md) — immutable version snapshots, review outcomes, evidence discipline and production acceptance tests.
- [Memory Intelligence & Retrieval Engine v1.0](docs/MEMORY-INTELLIGENCE-RETRIEVAL-ENGINE-v1.md) — retrieval pipeline, traceability, provenance, ranking and production acceptance tests.
- [Adaptive Learning & Preference Engine v1.0](docs/ADAPTIVE-LEARNING-PREFERENCE-ENGINE-v1.md) — preference model, learning techniques, feedback lifecycle, agent isolation, safety boundaries and acceptance tests.
- [Strategy Libraries & Software Engineering Academy v1.0](docs/COSMO-STRATEGY-LIBRARIES-AND-ENGINEERING-ACADEMY-v1.md) — deployed strategy/courseware schema, seeded learning methods, coding curriculum, validation rules and next implementation stages.
- [Persistent Learning & Preference Data Architecture v1.0](docs/PERSISTENT-LEARNING-PREFERENCE-DATA-ARCHITECTURE-v1.md) — persistent logical records, API contracts, approval lifecycle, security, retention, recovery and production acceptance tests.
- [Continuous Improvement & Meta-Learning Orchestration Engine v1.0](docs/CONTINUOUS-IMPROVEMENT-META-LEARNING-ENGINE-v1.md) — cross-system review loops, decision checks, method portfolio, safe experiments, background monitoring, relationship quality and controlled improvement.
- [Persistent Accuracy & Outcome Learning Engine v1.0](docs/PERSISTENT-ACCURACY-OUTCOME-LEARNING-ENGINE-v1.md) — verified outcomes, recurring error taxonomy, method evaluation, calibration, abstention, drift and regression protection.
- [Prototype Factory, Verification & Release Lifecycle v1.0](docs/PROTOTYPE-FACTORY-VERIFICATION-RELEASE-v1.md) — candidate build/test/revision cycles, independent evaluation, release gates, staged rollout and rollback.
- [Repository Review & Improvement Update](docs/REPOSITORY-REVIEW-IMPROVEMENT-UPDATE-2026-11-11.md) — source-level findings, current gaps, readiness and recommended build order.
- [Historical Intelligence, Scenario Analysis & Decision Engine v1.0](docs/HISTORICAL-INTELLIGENCE-SCENARIO-DECISION-ENGINE-v1.md) — 5–50 year historical research, source reliability assessment, private/public evidence reconciliation, time-aware comparisons, scenario outcome maps, real-data simulation and decision briefs.
- [Technological Intelligence & Discovery Map v1.0](docs/TECHNOLOGICAL-INTELLIGENCE-DISCOVERY-MAP-v1.md) — technology graph, science and component discovery, maturity/evidence, invention hypotheses, multi-branch technology pathways and technical solution packs.
- [Cosmo Subscription Product Portfolio v1.0](docs/COSMO-SUBSCRIPTION-PRODUCT-PORTFOLIO-v1.md) — standalone products, bundles, Ad Studio, Team Up AI, Creator Studio, Cosmo Office and the continuous analytical build framework.
- [Business, Social, Advertising & Trading Intelligence Extensions v1.0](docs/COSMO-BUSINESS-SOCIAL-ADS-TRADING-INTELLIGENCE-v1.md) — AccountIT AI, Social Hub, Ad Page and staged trading research/controls.

- [Lifetime Package Licence & Tool Membership Model](docs/COSMO-LIFETIME-PACKAGE-LICENCE-AND-TOOL-MEMBERSHIPS-v1.md) — one-off package ownership, restorable entitlements, optional tool memberships, usage billing and payment controls.
- [QR Retail Intelligence](docs/COSMO-QR-RETAIL-INTELLIGENCE-v1.md) — product information hubs, QR shelf labels, expiry batches, low-stock and replenishment workflows.

## Strategy Academy

- [Open the Strategy Library & Academy](academy.html) — authenticated workspace for reusable strategies, engineering methods, course modules, lessons and personal progress. This page is on the current review branch and is not live until the branch is merged and GitHub Pages is deployed.

## Subscription portfolio demo

- [Open the interactive subscription portfolio prototype](prototypes/cosmo-subscription-portfolio-demo.html) — demo-only product catalogue and bundle shortlist. It does not process subscriptions or payments.

## Current prototype modules

- **Knowledge Engine capture panel:** front-end draft capture for claims, observations, hypotheses, predictions and decisions; provenance labels; optional evidence notes/source URLs; and JSON export. Drafts remain in browser memory for the current page session only. They are not permanent records, are not verified, and are not sent to a database.

- **Memory Vault interface:** separate Main Memories index and Master History source archive, session-only draft capture, optional memory-to-source linking, text search and JSON export. Temporary draft codes are not permanent identifiers and no sensitive information should be entered.
- **Memory Relationship Engine:** explicit session-only links between memory drafts (supports, contradicts, refines, supersedes, possible duplicate, depends on, related to, derived from), endpoint validation, duplicate-link checks, broken-reference audit and relationship JSON export. Links are assertions, not proof; contradictions are preserved and not automatically resolved.
- **Memory Versioning & Contradiction Review:** creates immutable-in-session memory snapshots with change reasons and basis, displays version timelines, and records a reasoned review outcome for contradiction links without deleting either side. All data remains session-only.
- **Memory Intelligence & Retrieval Engine:** searches session-only memory, history, knowledge and relationship drafts using transparent keyword matching; supports filters, relevance ordering, provenance/relationship/version inspection and JSON retrieval-trace export. This is not semantic AI search and cannot retrieve records absent from the current page session.
- **Adaptive Learning & Preference Engine:** separate agent preference profiles, feedback/outcome capture, learning-method catalogue, scoped learning candidates and JSON export. Session-only; no model training or persistent adaptation.
- **Persistent Learning & Preference Data Architecture:** provider-neutral design for durable user/workspace/agent profiles, immutable preference versions, feedback/outcome ledgers, approval-bound learning proposals, evaluation, rollback, permission isolation, export, deletion and recovery. Strategy/courseware records are now deployed, but preference profiles and the complete adaptive-learning lifecycle remain unimplemented.
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

## Search visibility and payments

- [SEO and Google indexing checklist](docs/COSMO-SEO-AND-GOOGLE-INDEXING-v1.md)
- [Yoco checkout and lifetime entitlements](docs/COSMO-YOCO-PAYMENTS-v1.md)
