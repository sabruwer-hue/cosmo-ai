# Cosmo Master Audit & Build Status — 12 November 2026

**Repository:** `sabruwer-hue/cosmo-ai` (public-safe application shell)  
**Backend:** `cosmo-core` Supabase project, São Paulo (`sa-east-1`)  
**Audit type:** source inspection, live schema/migration/function inventory, Supabase advisor checks and database integrity queries. This is not a browser, penetration, load, payment or production certification.

## Executive conclusion

Cosmo is materially further along than the earlier static prototype audit suggested. There is now a real Supabase backend, persistent task and knowledge foundations, active Edge Functions, package/entitlement/payment foundations, QR Retail schema and a newly deployed strategy/courseware foundation.

The correct next move is **not a rebuild**. Preserve the existing public-safe shell and private backend, finish owner activation and end-to-end testing, then connect the new strategy/courseware records to the live Cosmo chat and controlled engineering lifecycle.

## 1. Verified live backend

At the time of this audit:

- Supabase project `cosmo-core` is `ACTIVE_HEALTHY`, PostgreSQL 17.11, region `sa-east-1`.
- 47 public-schema tables; all 47 have Row Level Security enabled.
- 14 recorded database migrations.
- Nine active Edge Functions:
  - `cosmo-chat` v13
  - `cosmo-admin-gate` v2
  - `cosmo-product-hub` v2
  - `cosmo-start-plan` v1
  - `cosmo-access-gate` v4
  - `cosmo-payfast-checkout` v2
  - `cosmo-payfast-itn` v2
  - `cosmo-yoco-checkout` v3
  - `cosmo-yoco-webhook` v3
- Security advisor returned no lints.
- Anonymous table privileges are now limited to SELECT on the three public subscription catalogue tables. Private billing, account, entitlement, checkout and retail tables have no anonymous table grants.
- The five missing foreign-key indexes and two RLS init-plan warnings found during this audit were corrected. The performance advisor now reports informational unused-index notices only; these should be reviewed after meaningful traffic exists.

### Existing persistent data domains

Profiles, missions, knowledge records, memory links, conversations, messages, training lessons/evaluations, audit events, packages/releases, agent tasks/steps/events/approvals, subscription products/tools, billing profiles, subscriptions, invoices, payment events, usage ledger, entitlements, Yoco checkout, retail stores/products/batches/stock movements/promotions/QR codes/scans/restock orders and items.

The tables are structurally present, but most user/workflow tables currently have zero records. The subscription catalogue has four products and eleven tools. Schema presence is not proof that every workflow has passed a real user journey.

## 2. What was built during this audit

### Database hardening
- Reduced anonymous privileges to the public catalogue's read-only requirements.
- Optimised two owner-read RLS policies.
- Added the five missing foreign-key indexes.
- Re-ran advisors: no security findings; no remaining unindexed-FK or RLS-initplan warnings.

### Strategy libraries and courseware
Deployed ten new tables:
- strategy libraries;
- strategies;
- immutable strategy versions;
- strategy relationships;
- strategy runs;
- strategy evaluations;
- courses;
- course modules;
- course lessons;
- personal course progress.

Seeded and verified:
- 10 strategy libraries;
- 26 strategies;
- 26 version-1 snapshots;
- 2 strategy relationships;
- 2 courses;
- 10 modules;
- 20 lessons.

Course 1: **Secure & Reliable Software Engineering** — six modules and twelve lessons.

Course 2: **Learning Strategies & Adaptive Intelligence** — four modules and eight lessons.

All seed strategies have `cosmo_validation_state=unverified`. They are reference methods, not proof that Cosmo has mastered or validated them. Strategy runs, evaluations and learner progress start empty. Integrity checks found no missing version-1 snapshots, broken strategy links or orphan lessons.

### Application shell
A Strategy Academy page has been added on this review branch. It requires the verified Cosmo owner gate and provides access to shared strategy libraries, strategy details, course modules, lessons and owner-scoped progress. It is linked from the Admin portal and added to the service-worker shell. JavaScript syntax was checked; live browser authentication and Data API behaviour still need testing.

## 3. What exists but must be refined or verified

| Area | Current evidence | Required refinement |
|---|---|---|
| Cosmo chat | Active JWT-protected Edge Function with owner-email check and server-side model request path | Verify owner sign-in, secrets, model response, costs, timeouts and full tool-call traces |
| Work | Database-backed tasks, steps, events, approvals and package registry in source | Test complete journeys, race conditions, error recovery and cross-account isolation |
| Admin | Owner gate, missions, knowledge capture and training lesson approval | Test real owner session, audit behaviour and every RLS boundary |
| Knowledge | Persistent owner-scoped records and relationships | Add durable source/history archive, claim/evidence links, contradictions and tested retrieval |
| Training | Existing private training lesson/evaluation tables plus new shared courseware | Connect assessments, competency records, review scheduling and independent marking |
| Strategy libraries | Persistent seed catalogue, versions and relationships | Connect strategy retrieval, selection rationale, execution runs and evaluations to Cosmo |
| Package/entitlement | Products, tools, invoices, usage and entitlement schema/functions | Verify purchase, restore, refunds, duplicate events and entitlement reconciliation |
| Yoco | Checkout and signed webhook functions deployed | Keep disabled until credentials, approved prices, webhook replay/idempotency and sandbox-to-live tests pass |
| QR Retail | Data model and product-hub function deployed | Test product publishing, QR scan journeys, stock updates, expiry and tenant boundaries |
| SEO | Public home page includes metadata, canonical URL, robots directives and structured data | Verify deployed canonical pages, sitemap/robots, Google Search Console and indexing |

## 4. What is still missing from the ultimate Cosmo

### P0 — activate and verify the real foundation
1. Confirm the creator Auth account exists and the owner-email allowlist is configured.
2. Verify required server-side secrets by checking their presence in Supabase; never copy their values into chat or Git.
3. Add the correct deployed origins to the Supabase Auth redirect allowlist.
4. Enable GitHub Pages for the repository, rerun the deployment workflow and verify the resulting HTTPS site.
5. Test sign-in, chat, Work, Admin, knowledge capture and strategy Academy on a real device.
6. Run owner-vs-other-user isolation tests for every private table.
7. Confirm backups and perform a restore test.

### P1 — turn the foundation into persistent intelligence
1. Main Memories Vault as the canonical memory index.
2. Separate Master History Vault preserving original Genesis/Cosmo records, timestamps, versions, contradictions and source pointers.
3. Durable evidence/provenance and claim graph with source-level traceability.
4. Strategy retrieval and context-aware strategy selection in Cosmo chat.
5. Strategy run capture, outcome verification, evaluation and method comparison.
6. Prediction ledger with probabilities, resolution rules, Brier scoring and calibration.
7. Independent evaluation datasets, regression suite, held-out tests and adversarial tests.
8. Prototype Factory: isolated candidate builds, independent tester, red-team review, exact source hashes, approval, staged release and rollback.
9. Event/workflow engine, agent registry, cost budgets and model/provider routing.
10. Persistent preference learning, accuracy learning, drift detection, forgetting checks and method portfolio.
11. Genuine independent CC, CC-SIM and TIVA workflows; role labels alone are not independence.
12. Controlled research and external-tool connectors. Current chat tools are internal record/task operations; public web research and external action execution are not connected in the app.

### P2 — programme and ecosystem expansion
- EARTRON contributor/station registration, sensor calibration, data provenance and research quality.
- Guardian/BioSignal only after consent, privacy, clinical validation and regulatory review.
- CosmoCity as planning and coordination support only until professional engineering, public authority and legal governance are in place.
- Energy/Home concepts remain research until qualified design, protection and certification.
- Business pilots, business BI and connected ventures should be introduced one at a time.

## 5. Important architecture refinements

- Keep a modular monolith until real scale or isolation needs justify service separation.
- Keep the public GitHub repository as a public-safe shell. Do not put Genesis archives, personal records, private policies or secrets into it.
- Separate general evidence class from Cosmo-specific validation status.
- Separate user preference, satisfaction, factual accuracy, task success and safety outcomes.
- Preserve failed runs, contradictory sources and alternative strategies.
- Make strategy selection context-aware; do not promote a method because it won once.
- No self-modification of policies, permissions, model routing or production code.
- No external action from an AI response alone. Enforce policy in trusted server code and require explicit human approval for consequential actions.
- Use exact release hashes, independent tests, monitoring and rollback.

## 6. Build order from here

1. Owner activation and website deployment.
2. Real-device end-to-end verification.
3. Strategy Academy browser testing and progress verification.
4. Read-only strategy retrieval inside Cosmo chat.
5. Strategy run and evaluation ledger.
6. Main Memories / Master History / evidence source integration.
7. Prediction and outcome learning.
8. CI test harness and Prototype Factory MVP.
9. Independent CC / CC-SIM / TIVA workflows.
10. One low-risk business or research pilot.

## 7. What this audit does not certify

This audit does not certify production readiness, penetration resistance, payment correctness, model accuracy, backup recovery, live Google indexing, or independent agent behaviour. The database security advisor returning no findings is encouraging but does not replace policy tests or penetration testing. The strategy page is not live until the review branch is merged and the Pages deployment succeeds.

**Build principle:** preserve what works, implement the shared intelligence spine, verify every layer and only then expand Cosmo's authority.
