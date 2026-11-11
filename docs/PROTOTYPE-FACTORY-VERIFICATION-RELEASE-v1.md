# Cosmo AI — Prototype Factory, Verification & Release Lifecycle v1.0

**Document ID:** COSMO-FACTORY-001  
**Status:** Architecture and delivery specification; automated factory not deployed

## 1. Purpose

Cosmo needs a controlled way to turn an idea or improvement proposal into a working prototype, test it, learn from defects, revise it, and repeat until a release candidate meets explicit acceptance criteria. The final product is not the first build or the most polished demo. It is a versioned candidate that has passed independent functional, accuracy, security, privacy, reliability and operational gates for its intended scope.

The factory is a governed engineering pipeline. It may automate bounded build-and-test cycles, but it must not autonomously approve or deploy consequential changes.

## 2. Product lifecycle states

Every change moves through explicit states:

1. **Request captured:** problem, users, intended outcome, constraints and owner recorded.
2. **Requirements baselined:** acceptance criteria, non-goals, risks and testable claims approved.
3. **Architecture reviewed:** design, data flow, dependencies, threat model and migration/rollback plan recorded.
4. **Prototype built:** implementation isolated on a feature branch or disposable environment.
5. **Build verified:** deterministic build, lint, type/static checks and dependency checks pass.
6. **Tests executed:** unit, integration, contract, end-to-end, accessibility, security, privacy and performance tests run as relevant.
7. **Defects classified:** failures are linked to requirements and root-cause candidates.
8. **Revision cycle:** builder proposes a fix; independent tests rerun, including the full regression suite.
9. **Candidate frozen:** exact source commit, dependencies, configuration, datasets, model/prompt versions and test results are recorded.
10. **Independent review:** tester/critic and required human reviewers assess evidence and unresolved risks.
11. **Approved release:** authorised approver signs off on the exact candidate hash and deployment scope.
12. **Staged rollout:** deploy to preview, canary or limited scope before broader release when appropriate.
13. **Post-release monitoring:** compare real outcomes against release baselines and watch for regressions.
14. **Retain or rollback:** keep the release if gates remain satisfied; otherwise pause/revert and open a learning record.

A failed gate returns the candidate to the relevant earlier state. It never silently advances.

## 3. Independent roles

Separate responsibilities so one agent does not grade its own work:

- **Architect:** clarifies the problem, constraints, interfaces, architecture and acceptance criteria.
- **Builder:** implements the approved design and records source changes.
- **Test engineer:** writes and runs tests from requirements, including tests the builder did not author.
- **Red-team/critic:** searches for edge cases, misuse, security weaknesses, misleading assumptions and failure modes.
- **Evidence reviewer:** checks factual claims, sources, data quality and evaluation validity.
- **Release authority:** human owner or explicitly authorised operator who approves the exact release candidate.

A single model may assist multiple roles, but high-risk or production gates need independent evidence and designated human approval. Role labels alone do not create genuine independence; separate test sets, review traces and authority boundaries are required.

## 4. Iterative build-test-improve loop

For each iteration, record:
- iteration ID and parent candidate;
- requirement and defect IDs addressed;
- source commit and build artefact hashes;
- test suite and dataset versions;
- test results, logs and reproducible failure cases;
- changes in quality, latency, cost, accessibility and risk;
- regressions and unresolved defects;
- decision to revise, stop, accept or reject.

The factory should support a configurable iteration budget and stop when:
- all mandatory gates pass and quality targets are met;
- improvement plateaus across a defined number of iterations;
- a safety/security/privacy blocker remains unresolved;
- cost/time budget is exhausted;
- evidence is insufficient;
- human review is required.

Never optimise only for passing the tests the builder already knows. Maintain hidden/held-out tests and periodically add newly discovered failures to the regression set after review.

## 5. Test strategy

Use a risk-based test pyramid:
- **Unit:** deterministic logic, validation, state transitions and calculations.
- **Integration:** database, queues, storage, model router, identity and external service boundaries.
- **Contract:** API schemas, event formats, permissions and version compatibility.
- **End-to-end:** real user journeys and complete workflows.
- **Property/fuzz:** invariants across broad generated inputs and malformed data.
- **Regression:** known defects and previously passing behaviours.
- **Accuracy/benchmark:** task-specific correct-answer and outcome datasets.
- **Adversarial/red-team:** prompt injection, untrusted sources, access boundary bypass, data leakage and misuse.
- **Security/privacy:** authentication, authorization, secrets, retention, deletion, export and audit integrity.
- **Accessibility/usability:** keyboard, screen reader, readability, mobile and user effort.
- **Performance/reliability:** load, latency, failure recovery, queue behaviour, backups and restore.

Tests must be traceable to requirements and risks. A green test suite is not proof of correctness if the tests are weak or unrepresentative.

## 6. Evaluation datasets and leakage prevention

Maintain versioned datasets with provenance, rights, sensitivity classification and scope:
- development examples for iteration;
- validation examples for selecting methods and thresholds;
- held-out test examples for final evaluation;
- regression cases from confirmed incidents;
- adversarial and boundary cases;
- synthetic cases clearly labelled as synthetic.

Keep test answers and hidden cases out of builder prompts where possible. Avoid training or tuning on the held-out test set. Split by source, time, user or scenario where needed to prevent near-duplicate leakage. Review datasets for bias, stale labels and missing contexts.

For every result, record sample size, confidence/uncertainty, evaluation version, exclusions and limitations. Small samples must not be presented as proof of broad reliability.

## 7. Release gates

A candidate is eligible only when:
- every mandatory requirement maps to passing evidence;
- no unresolved critical/high-severity security or privacy defect remains;
- permission and tenant-isolation tests pass;
- data migration, backup and restore plans are verified;
- accuracy and calibration meet predeclared thresholds for the intended scope;
- no unacceptable regression is present;
- costs and latency are within approved limits;
- monitoring, incident response and rollback are ready;
- release approval is bound to the exact candidate hash and scope.

A model or prompt change is a release change. Record provider/model identifiers where available, prompt versions, retrieval configuration, tools, policy versions and evaluation data versions.

## 8. Safe environments and deployment

Use distinct environments:
- local development;
- isolated automated test;
- sandbox with synthetic or approved test data;
- staging/preview with controlled access;
- production with least privilege and monitoring.

Production data must not be copied into development or third-party model environments without approved purpose, consent, safeguards and contractual basis. Sandbox tools must not have production credentials. The factory cannot grant itself secrets or deployment permissions.

## 9. Prototype-to-product traceability

Each release candidate links to:
- originating request and approved requirements;
- architecture and threat model;
- source commit and dependency lock;
- build artefact;
- test and benchmark reports;
- defects, fixes and iteration history;
- approvals and approval hash;
- deployment event;
- monitoring results and rollback event, if any.

Preserve rejected candidates and lessons subject to retention rules. Never confuse a prototype, a passing test build, a staged release and a production-ready product.

## 10. Proposed service boundaries

Provider-neutral API examples:
- POST /factory/projects
- POST /factory/projects/{id}/requirements
- POST /factory/candidates
- POST /factory/candidates/{id}/builds
- POST /factory/candidates/{id}/test-runs
- POST /factory/candidates/{id}/defects
- POST /factory/candidates/{id}/revisions
- POST /factory/candidates/{id}/freeze
- POST /factory/candidates/{id}/reviews
- POST /factory/candidates/{id}/approvals
- POST /factory/releases
- POST /factory/releases/{id}/rollback
- GET /factory/projects/{id}/history

Every state transition is authenticated, authorised, versioned and audited. These routes are proposed contracts, not deployed endpoints.

## 11. Delivery phases

- **F-0:** define release states, approval roles, risk classes and candidate identity.
- **F-1:** add repository CI for syntax, lint, static checks and basic automated tests.
- **F-2:** add repeatable preview builds and artefact hashes.
- **F-3:** create requirement-linked unit, integration and end-to-end test harness.
- **F-4:** add benchmark, regression, adversarial and security test reporting.
- **F-5:** add isolated agent-assisted build/revision loop with iteration budget.
- **F-6:** add approval-bound release, staged rollout, monitoring and rollback.
- **F-7:** integrate lessons and confirmed defects with persistent learning.

Start with CI and testability of the current prototype before building autonomous code-writing loops.

## 12. Current status

This specification does not create a build agent, test runner, deployment pipeline, release manager or autonomous prototype loop. The current repository has a GitHub Pages deployment workflow but no application test workflow or automated test suite identified in the repository tree reviewed on 2026-11-11. The Pages workflow currently fails at Configure Pages, so deployment is not verified.
