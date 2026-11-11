# Cosmo Subscription Product Portfolio & Analytical Build Framework v1.0

**Document ID:** COSMO-PRODUCT-PORTFOLIO-001  
**Status:** Product architecture proposal for validation — not a live subscription catalogue  
**Currency baseline:** ZAR for initial South African market modelling; prices are not approved.

## 1. Product strategy

Cosmo is the shared intelligence, identity, orchestration, security, billing and knowledge platform. Customers may subscribe to individual products independently, then optionally combine them through clearly defined Cosmo packages.

The platform must not become a collection of disconnected mini-apps. Products share a governed core but retain distinct customer value, permissions, product roadmaps, usage accounting, support obligations and unit economics.

**Core principle:** one Cosmo account and platform; multiple independently valuable subscription products; optional bundles; one transparent billing and entitlement system.

A subscription grants access to a defined product capability. It does not automatically include unlimited model usage, storage, media generation, external distribution fees, payment processing or third-party services. Those costs must be disclosed and controlled.

## 2. Proposed standalone subscriptions

| Product | Primary customer | Main job | Standalone value |
|---|---|---|---|
| **Cosmo Core** | Individuals and professionals | Personal AI workspace, memory, research, planning and task orchestration | A governed AI assistant and personal workbench |
| **Ad Studio** | Businesses, sellers and advertisers | Create, distribute, manage and measure advertisements and commercial campaigns | An advertising and customer-acquisition workspace |
| **Team Up AI** | Small teams, agencies and organisations | Coordinate people and AI agents around shared work | A team operating workspace with shared context and controlled AI assistance |
| **Creator Studio** | Independent creators and creative teams | Plan, create, edit, repurpose and organise original content | An end-to-end creative production workspace |
| **Cosmo Office** | Individuals, students, professionals and organisations | Create and edit documents, spreadsheets, presentations and related work files with AI assistance | An AI-native productivity and office suite |

Every product must be useful without requiring customers to buy another product. Cross-product handoffs should be smooth but optional.

### 2.1 Cosmo Core

The shared platform subscription and entry point:
- Conversational assistant and personal workspace.
- User-controlled memory, projects, research and task organisation.
- Evidence-aware answers, citations/provenance and uncertainty.
- Personal workflow orchestration with explicit approval for consequential actions.
- Secure access to separately entitled Cosmo products.
- Usage, privacy, integrations and account controls.

Cosmo Core is not a substitute for specialist product interfaces where deep workflows are required.

### 2.2 Ad Studio

Carry forward the existing Ad Studio prototype and its business-first direction.

Core product areas:
- Business/advertiser profiles and onboarding.
- Ad creation, editable previews, drafts and campaign submission.
- Campaign management, scheduling, placements and performance analytics.
- Audience, opt-in followers and customer engagement.
- Business trust profile, verification status, verified-transaction reviews, moderation, complaints and appeals.
- Product/service catalogue and campaign-to-commerce links.
- Ad Rooms: themed or contextual spaces where advertisers, creators and audiences discover relevant campaigns and offers.
- AdFind: discovery/search for advertisements, offers, products, services and participating businesses, with relevance and clear sponsored labels.
- Video Ad Studio: AI-assisted video ad creation/editing, multiple formats, captions, voice/audio, variants and calls to action such as Buy, Enquire, Book, Quote or View Catalogue.
- Campaign attribution, conversion measurement, budget controls, fraud detection and advertiser reporting.
- Team permissions and agency/client workspaces in higher tiers.

**Product boundary:** Ad Studio owns campaign distribution, advertiser workflows, audience discovery, ad placements, campaign measurement and commercial ad operations. It may offer basic ad-asset editing, but advanced multi-format creative production belongs in Creator Studio.

**Commerce and monetisation:** keep subscription fees, paid placements, credits, transaction fees and commissions as separate ledger items. The earlier 8% commission was a proposal for validation, not an approved universal fee. Do not activate rewards until their funding source, eligibility, abuse controls, accounting and margin impact are proven.

**Trust requirements:** identity checks must minimise exposure of sensitive documents; reviews must be tied to eligible genuine transactions; moderation needs reasons, human escalation and appeals; no paid or fabricated ratings; sponsored placements must be clearly labelled.

### 2.3 Team Up AI

An independently saleable AI-powered team workspace. **Historical continuity:** earlier Cosmo prototypes called a related concept **Team Hub AI** and described multi-agent/multi-provider collaboration, parallel work, specialist roles, task ratings and confidence. Team Up AI is the current proposed product name; preserve Team Hub AI as a historical alias until the original concept's full scope is reconciled. The related **DiscussIt** concept—multi-provider debate, devil's-advocate/optimist/auditor/historian roles, prediction/outcome tracking and simulation—should be evaluated as a decision-review capability within Team Up AI or Cosmo Research, not automatically launched as another subscription.
- Organisations, workspaces, teams, projects and shared workspaces.
- Human members, roles, permissions, invitations and offboarding.
- Shared project context and knowledge spaces with source/provenance.
- Team chat and task collaboration, with AI summaries and action extraction.
- Specialist AI teammates/agents assigned to bounded roles (research, writing, planning, analysis, operations, support).
- Task delegation, handoffs, dependencies, approvals and activity history.
- Shared templates, playbooks, meeting notes, decisions and searchable project history.
- Human review, escalation and conflict resolution for agent outputs.
- Admin controls, audit logs, retention, export and access reviews.

**Differentiator:** agents work with the team under scoped permissions and traceable task ownership; they do not silently impersonate people, approve their own consequential work or gain broad access to all team data.

Potential integrations (calendar, email, file storage, chat and project tools) are gated by customer connection and explicit scopes. Do not assume integrations are available until built and tested.

### 2.4 Creator Studio

An independently saleable creative production environment for individuals and teams:
- Creator identity, brand kit, content goals and reusable assets.
- AI-assisted ideation, research, scripts, outlines, captions, copy and storyboards.
- Image, graphic, audio, voice and video creation/editing through approved providers.
- Long-to-short repurposing, aspect-ratio variants, subtitles, translations and accessibility checks.
- Content calendar, draft/review/approval workflow and asset library.
- Campaign/series planning, collaboration and version history.
- Rights, licences, releases, source attribution and consent records.
- Export packages and optional publishing integrations, subject to platform permissions.
- Performance insights where a supported platform provides reliable data.

**Relationship to Ad Creator:** preserve the earlier Ad Creator concept as the advertising-focused creation capability inside Creator Studio for the initial product architecture. It can generate ad-ready assets and hand them to Ad Studio. Do not create two overlapping subscriptions until customer research demonstrates distinct willingness to pay.

**Product boundary:** Creator Studio makes and manages creative assets and content workflows. Ad Studio manages paid distribution, advertising campaigns, advertiser/audience relationships and campaign outcomes.

### 2.5 Cosmo Office

An AI-native productivity suite, not merely a chatbot that generates text:
- **Documents:** create, edit, format, rewrite, compare, comment, summarise and collaboratively review text documents.
- **Spreadsheets:** create and edit tables, formulas, charts, data validation, pivots/analysis and explainable transformations.
- **Presentations:** generate slide decks from briefs, documents or data; revise layouts and speaker notes.
- **PDF and file workflows:** read, summarise, compare, extract, annotate and convert supported files while preserving source links and versions.
- **Cross-file intelligence:** answer questions across authorised documents, spreadsheets and presentations with citations to source locations.
- **AI editing:** propose changes, show diffs, explain formula changes and allow accept/reject/undo.
- **Templates and reusable workspaces:** personal, team and organisation templates.
- **Collaboration:** comments, version history, access control and export in interoperable formats.

**Critical correctness controls:** spreadsheet formulas and transformations must be inspectable and testable; never silently overwrite source files; maintain version history and undo; preserve formatting where supported; clearly label unsupported file features; protect confidential files; validate exports by reopening them. AI-generated financial, legal or technical calculations must show assumptions and require suitable review.

## 3. Cosmo packages and bundle model

Products remain independently purchasable. Bundles provide convenience and value, not artificial lock-in.

Initial bundle concepts (names and entitlements require validation):
- **Cosmo Personal:** Cosmo Core + a limited Cosmo Office capability.
- **Cosmo Professional:** Cosmo Core + Cosmo Office + selected Creator Studio tools.
- **Cosmo Business:** Cosmo Core + Team Up AI + Cosmo Office + Ad Studio essentials.
- **Cosmo Creator:** Cosmo Core + Creator Studio + optional Ad Studio handoff/discount.
- **Cosmo Agency:** Team Up AI + Creator Studio + Ad Studio with multi-client workspaces and approval controls.
- **Cosmo Enterprise:** negotiated organisation-level combination with SSO/identity options, policy controls, audit/export, support and contractual data terms when actually implemented.

Do not finalise package names, prices, limits or included credits until cost and willingness-to-pay research is complete. Every bundle must show which product entitlements, user seats, usage allowances, storage limits, integrations and support levels are included.

## 4. Additional product opportunities — candidates, not commitments

The following gaps may justify future standalone products, but must pass discovery and economics tests before being added to the subscription catalogue.

| Candidate | What it would do | Recommendation |
|---|---|---|
| **Cosmo Research & Intelligence** | Structured research, evidence libraries, historical comparisons, scenario maps, technology discovery and decision briefs | High strategic fit; initially make advanced capabilities a Cosmo Core/Pro capability, then test standalone demand |
| **Cosmo Data & Analytics** | Connect permitted business data, dashboards, forecasting, cohort analysis, inventory/pricing/sales insights and explainable recommendations | High business value; validate after secure connectors and reliable data pipelines exist |
| **Cosmo Automation Studio** | Visual workflow builder, triggers, approvals, integrations, scheduled jobs and monitored automations | Strong future candidate; build only after orchestration, permissions, retries and audit are reliable |
| **Cosmo Developer Studio** | Code workspace, repository assistance, tests, debugging, deployment workflows and controlled agents | Potentially valuable; likely a later professional product with strong sandbox/security requirements |
| **Cosmo Learning Studio** | Personal/team learning plans, tutoring, practice, progress and course/content creation | Possible market; do customer discovery before allocating engineering capacity |
| **Cosmo Customer Service** | Shared inbox, AI-assisted support, knowledge-grounded responses, routing and escalation | Could be a Team Up AI module first; separate only if demand and economics justify it |

Do not split every feature into a subscription. A standalone product needs a distinct buyer, repeated use case, differentiated value, support model and viable unit economics.

## 5. Shared platform services required by all subscriptions

Build common capabilities once:
1. Identity, authentication, organisations, tenancy, roles and entitlements.
2. Subscription catalogue, billing lifecycle, invoices, tax handling, trials, cancellations, refunds and payment reconciliation.
3. Metered usage and quotas for model tokens, image/video generation, storage, seats, API calls and external provider costs.
4. Model/provider router with task-based routing, cost/latency limits, fallback and evaluation.
5. File and asset storage, versioning, export and recovery.
6. Project/workflow engine, event bus, task queue and idempotency.
7. Permission-aware knowledge retrieval and audit trail.
8. Integration gateway with least privilege, scoped credentials, revocation and logs.
9. Admin console, support tools, abuse detection and incident response.
10. Observability: cost per task/customer, reliability, latency, error rate, usage, conversion, retention and gross margin.

Prefer a well-structured modular monolith initially. Split services only where scaling, deployment independence or security isolation justifies it.

## 6. Analytical build doctrine — continuous, not a final audit

Every product and feature must pass the same evidence-led cycle:

**Discover → define → research → compare → model → decide → design → prototype → test → measure → revise → approve → release → monitor.**

For every meaningful feature, maintain a decision record with:
- User problem and target segment.
- Evidence: customer interviews, observed workflows, market research and source dates.
- Current alternatives and competitor/substitute analysis.
- Proposed value and measurable success criteria.
- Functional and non-functional requirements.
- Data classification, privacy, security and threat analysis.
- Architecture, dependencies, provider/licence constraints and portability.
- Build/buy/partner comparison.
- Cost model: development, inference, media generation, storage, support, payment fees, refunds, fraud and acquisition.
- Pricing hypotheses and willingness-to-pay evidence.
- Unit economics and break-even assumptions.
- Failure modes, misuse cases, abuse controls and rollback.
- Test plan, sample size, acceptance thresholds and known limitations.
- Decision status: hypothesis, researched, approved, implemented, deployed or verified.

Never mix observed facts with assumptions. Record source, date, confidence, counter-evidence and unresolved questions. Use scenario branches (base/upside/downside and relevant edge cases) for demand, costs, provider changes, adoption, churn and operational load.

### 6.1 Quantitative gates

Before a paid launch, calculate at minimum:
- Gross margin per plan and per high-cost feature.
- Contribution margin after payment fees, refunds, support and variable AI/provider costs.
- Cost per active user and per successful workflow.
- Usage distribution and abuse exposure.
- Conversion, activation, retention and churn.
- Capacity and service-level requirements.
- Break-even customers and sensitivity to key assumptions.

Do not invent precision. Use ranges and label assumptions where evidence is weak.

### 6.2 Feature prioritisation

Score candidate work using:
- Customer pain and frequency.
- Reachable market and willingness to pay.
- Strategic fit and cross-product leverage.
- Evidence strength.
- Revenue or cost-saving potential.
- Build effort and operational burden.
- Security, legal, privacy and safety risk.
- Dependencies and time to validate.

A high-risk feature does not become a priority merely because its potential revenue is high. Prefer small experiments that can disprove a weak idea cheaply.

### 6.3 Definition of done

A feature status must be one of:
- **Proposed:** an idea exists.
- **Researched:** evidence and alternatives assessed.
- **Specified:** requirements and acceptance tests written.
- **Prototyped:** demonstrable workflow exists; may be simulated.
- **Implemented:** code exists.
- **Deployed:** running in target environment.
- **Verified:** acceptance, security and operational tests pass.
- **Production-ready:** monitoring, recovery, support, legal/privacy and release controls are in place.

A prototype dashboard, sample analytics, simulated AI response or displayed price must never be described as a live service.

## 7. Product architecture and data boundaries

Each product has its own domain model and product permissions while using shared identity, billing, storage, model routing and audit services.

- Ad Studio: advertisers, business profiles, creatives, campaigns, placements, audiences, impressions, clicks, conversions, orders, reviews, moderation and billing events.
- Team Up AI: organisations, workspaces, members, teams, projects, agents, tasks, approvals, knowledge spaces and activity events.
- Creator Studio: creator profiles, brand kits, briefs, assets, media jobs, versions, rights, releases, content calendars and publishing jobs.
- Cosmo Office: files, documents, sheets, presentations, revisions, comments, formulas, transformations, exports and collaboration.
- Cosmo Core: user profile, projects, memories, research, tasks, preferences and orchestrated workflows.

Cross-product access must be explicit and scoped. For example, Creator Studio may hand an approved creative asset to Ad Studio, but Ad Studio must not gain unrestricted access to the creator's entire private library. Team workspaces must not expose personal files or memories by default.

## 8. Roadmap recommendation

### Stage 0 — Portfolio validation
- Confirm product names, customer segments and distinct jobs-to-be-done.
- Recover and reconcile existing Ad Studio/Ad Creator work.
- Interview representative businesses, teams, creators and office users.
- Establish a product scorecard, competitor map and unit-economics workbook.
- Freeze unvalidated prices and commission assumptions as hypotheses.

### Stage 1 — Shared Cosmo foundation
- Identity, tenancy, permissions and product entitlements.
- Billing/usage architecture and cost telemetry.
- Secure files/assets, model router, audit, workflow engine and observability.
- Product registry and feature flags.

### Stage 2 — Focused product proofs
- Ad Studio: one end-to-end advertiser journey from approved creative to measurable campaign outcome.
- Team Up AI: one team workspace with shared task, agent delegation, review and audit.
- Creator Studio: one complete content workflow from brief to approved export and Ad Studio handoff.
- Cosmo Office: one reliable document workflow and one spreadsheet workflow with safe edit/undo/versioning.

### Stage 3 — Paid pilots
Run limited pilots with clear support and refund terms. Measure real use, customer value, provider costs, gross margin, retention and failure rates. No fake metrics or simulated payment success.

### Stage 4 — Packages and expansion
Only bundle products after independent product value is demonstrated. Add analytics, automation, research or developer products when customer evidence and operational readiness support them.

## 9. Immediate backlog

| Priority | Work item | Acceptance evidence |
|---|---|---|
| P0 | Product portfolio and terminology register | No duplicate product boundaries; each product has buyer, job and owner |
| P0 | Ad Studio prototype preservation audit | Existing screens/features mapped to retain, revise, defer or remove |
| P0 | Ad Studio end-to-end MVP specification | Accounts, creative handoff, campaign review, distribution, measurement and trust flows specified |
| P0 | Shared entitlement and usage model | Independent subscriptions and bundles can be represented without duplicated accounts |
| P0 | Unit-economics model | Cost ranges and gross-margin sensitivity for each product |
| P1 | Team Up AI workflow prototype | Shared workspace, bounded AI teammate, task handoff, approval and audit demonstrated |
| P1 | Creator Studio workflow prototype | Brief-to-asset workflow, rights metadata, variants and export demonstrated |
| P1 | Cosmo Office proof | Document and spreadsheet editing with diff, undo, versioning and export tests |
| P1 | Customer discovery | Evidence-backed segment and willingness-to-pay findings |
| P2 | Research, Analytics, Automation and Developer product discovery | Ranked opportunity reports; no automatic commitment to build |

## 10. Explicit non-goals and safeguards

- Do not create a sprawling microservice architecture before need is demonstrated.
- Do not set final subscription prices or commissions from brainstorms.
- Do not promise unlimited AI, media generation, storage or integrations without cost controls.
- Do not use private creator/customer/team data to train shared models without explicit informed consent and documented rights.
- Do not allow agents to publish campaigns, spend money, send bulk messages, alter source files or make binding commitments without appropriate permissions and approval.
- Do not make paid placement look like organic recommendation.
- Do not guarantee advertising results, creator income or AI accuracy.
- Do not call any product live or production-ready until it meets the definition-of-done gates.

---

**Document control:** COSMO-PRODUCT-PORTFOLIO-001 · v1.0  
**Review rule:** update this document when customer evidence, architecture, costs or product boundaries change. Preserve prior decisions and reasons rather than silently overwriting them.
