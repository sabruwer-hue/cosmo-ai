# Cosmo AI — Prototype

A public-safe interface prototype for the Cosmo AI project.

> **Current status (11 November 2026):** The browser workspace now has an email-link authentication client and a Supabase-backed chat gateway. A dedicated private Supabase project is active; its initial private schema has nine tables with Row Level Security, and the `cosmo-chat` Edge Function is deployed with JWT verification and an owner-email allowlist. The system is **not yet operational for the creator**: the owner account, owner-email secret, model-provider API key, Auth redirect allowlist, and successful website deployment still need configuration. The new `work.html` page provides persistent task/step tracking, an approval queue and a package registry; `admin.html` provides an owner-verified mission, knowledge and training studio. The main knowledge/memory/retrieval/adaptive-learning panels remain session-only prototypes until connected and tested.

## Run locally
Open `index.html` in a modern browser, or serve this folder with any static web server. The private authentication and chat gateway require the deployed Supabase project and an authorised owner account; local file preview alone will not connect to the production service.

## Current private backend
- Supabase project: `cosmo-core` (São Paulo region).
- Database foundation: profiles, missions, knowledge records, memory relationships, conversations, messages, training lessons, training evaluations and audit events, plus packages, package releases, agent tasks, task steps, append-only task events and agent approvals.
- Row Level Security is enabled on all nine tables. Knowledge, message, evaluation and audit records are append-only through the normal authenticated client policies.
- Edge Functions: `cosmo-chat` (JWT verification enabled) and `cosmo-admin-gate` (JWT verification plus server-side owner-email verification). Chat retrieves approved training lessons and creator-owned mission/knowledge context, carries forward recent conversation history, and calls an OpenAI-compatible model endpoint server-side.
- Agent tools in `cosmo-chat`: create/list private tasks, search creator-owned knowledge records, create/list missions, and create pending approval requests. These tools are allowlisted, owner-scoped, sequential, and cannot execute external actions. Private database search is implemented; external web research, broad connector integrations and autonomous multi-step external execution are not yet connected. The chat model key is still required before runtime testing.
- Operational workspace: `work.html` supports persistent task creation, task status updates, ordered task steps, append-only task events, an approval queue and package registry. `admin.html` supports owner-verified mission management, permanent knowledge capture and draft/approved training lessons. These interfaces require an authenticated account and the Data API grants/RLS in the deployed project.
- Installable web foundations: separate manifests and icons for Cosmo, Cosmo Work and Cosmo Admin, plus a service worker that caches only the application shell and deliberately bypasses Auth, Data API and Edge Function requests. These are PWA foundations, **not APK files**.
- The function requires the server-side secrets `COSMO_OWNER_EMAIL` and `COSMO_MODEL_API_KEY`. Optional configuration: `COSMO_MODEL_NAME` and `COSMO_MODEL_BASE_URL`. Never put these secrets in browser code or Git.
- The model provider API is separately billed. The current default model is `gpt-6-luna` for lower-cost initial testing; set `COSMO_MODEL_NAME=gpt-6.1-sol` when you want stronger reasoning and accept the higher API cost.
- Sign-in uses Supabase email magic links. The owner must exist in Supabase Auth and the deployed site URL must be added to the Auth redirect allowlist.

## Deployment gate
The GitHub Pages workflow is committed, but GitHub currently rejects the deployment because Pages has not been enabled for this repository. In GitHub, open **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**, then re-run the workflow. Do not configure the custom domain until the Pages deployment URL is confirmed. The current repository is public; keep all creator history, private training content and secrets in the private Supabase project, never in this repository.

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
- [Business, Social, Advertising & Trading Intelligence Extensions v1.0](docs/COSMO-BUSINESS-SOCIAL-ADS-TRADING-INTELLIGENCE-v1.md) — AccountIT AI, Social Hub, Ad Page and staged trading research/controls.

- [Lifetime Package Licence & Tool Membership Model](docs/COSMO-LIFETIME-PACKAGE-LICENCE-AND-TOOL-MEMBERSHIPS-v1.md) — one-off package ownership, restorable entitlements, optional tool memberships, usage billing and payment controls.\n- [QR Retail Intelligence](docs/COSMO-QR-RETAIL-INTELLIGENCE-v1.md) — product information hubs, QR shelf labels, expiry batches, low-stock and replenishment workflows.\n\n## Subscription portfolio demo

- [Open the interactive subscription portfolio prototype](prototypes/cosmo-subscription-portfolio-demo.html) — demo-only product catalogue and bundle shortlist. It does not process subscriptions or payments.

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

## Search visibility and payments

- [SEO and Google indexing checklist](docs/COSMO-SEO-AND-GOOGLE-INDEXING-v1.md)
- [Yoco checkout and lifetime entitlements](docs/COSMO-YOCO-PAYMENTS-v1.md)
