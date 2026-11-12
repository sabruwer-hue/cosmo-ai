# Cosmo Strategy Libraries & Software Engineering Academy v1.0

**Document ID:** COSMO-STRAT-ACADEMY-001  
**Date:** 12 November 2026  
**Status:** Live database foundation deployed; owner-gated browser interface added in this branch; runtime and owner-session verification pending.

## 1. Purpose

Cosmo should not depend on one method for learning, research, reasoning, planning or engineering. It needs reusable libraries of strategies, with structured selection, evaluation, versioning and courseware. The purpose is to give Cosmo a strong starting foundation while preserving uncertainty and preventing an untested method from becoming an authority.

## 2. Live implementation snapshot

The `cosmo-core` Supabase project currently has 47 public-schema tables, all with Row Level Security enabled, and 14 recorded migrations. Nine Edge Functions are active. The new strategy/courseware layer adds ten tables:

- `cosmo_strategy_libraries`
- `cosmo_strategies`
- `cosmo_strategy_versions`
- `cosmo_strategy_relationships`
- `cosmo_strategy_runs`
- `cosmo_strategy_evaluations`
- `cosmo_courses`
- `cosmo_course_modules`
- `cosmo_course_lessons`
- `cosmo_course_progress`

Seeded content: 10 strategy libraries, 26 strategies, 26 immutable version-1 snapshots, two strategy relationships, two courses, ten modules and 20 lessons.

All seed strategies are marked `cosmo_validation_state=unverified`. General evidence class is not the same as validation in Cosmo. No strategy has been certified through Cosmo's own evaluation lifecycle yet. Strategy runs, evaluations and learner progress start empty.

## 3. Strategy library domains

1. Learning & Adaptive Intelligence
2. Software Engineering & Coding
3. Research & Evidence
4. Reasoning & Problem Solving
5. Prediction & Forecasting
6. Planning & Execution
7. Decision Intelligence
8. Evaluation & Quality Assurance
9. Safety & Risk Management
10. Creative & Design Strategies

The first seed methods include retrieval practice, spaced repetition, interleaving, deliberate practice, threat modeling, secure-by-design, test-driven development, independent code review, static analysis, property-based testing, dependency hygiene, staged release and rollback, systematic evidence review, triangulation, provenance tracking, root-cause analysis, fault-tree analysis, reference-class forecasting, probabilistic forecasting, pre-mortems, multi-criteria decisions, held-out benchmarking, regression testing, fail-safe defaults, defense in depth and divergent/convergent exploration.

## 4. Common strategy record

Every strategy should have:
- permanent strategy code and identity;
- library/domain and purpose;
- method steps and required inputs;
- selection guidance and compatible/alternative methods;
- strengths, limitations and risk notes;
- general evidence class;
- Cosmo-specific validation state;
- immutable version snapshots and change rationale;
- task/run references, evaluation results and trace links.

Strategy relationships preserve alternatives and combinations. A strategy is not globally best merely because it wins one task or one benchmark.

## 5. Strategy selection and learning lifecycle

1. Understand the task, constraints and risk.
2. Retrieve strategies by domain, task context and evidence.
3. Compare suitable alternatives, limitations and combinations.
4. Select a strategy with a recorded rationale.
5. Execute within approved permissions and budgets.
6. Capture a run and evidence.
7. Evaluate quality, accuracy, safety, efficiency and outcome separately.
8. Retain failures and counterexamples.
9. Propose versioned improvements.
10. Test against independent and regression cases.
11. Require human approval before high-risk operational use.
12. Monitor for drift, forgetting and changed task context.

User preference, user satisfaction, correctness and operational outcome are separate signals. Explicit preferences, repeated patterns and inferred preferences must retain distinct provenance.

## 6. Courseware foundation

Two starter courses are seeded:

### Secure & Reliable Software Engineering
Six modules covering engineering foundations, architecture and trust boundaries, secure coding and data integrity, testing and independent verification, delivery and operations, and a mastery project.

### Learning Strategies & Adaptive Intelligence
Four modules covering how learning works, practice and feedback, transfer and understanding, and metacognition/method selection.

Twenty starter lessons cover requirements, trust boundaries, threat modeling, safe defaults, identity/authorization, database integrity, layered testing, adversarial/property testing, code review, CI/dependency security, observability, restore/rollback, retrieval, spacing, deliberate practice, interleaving, worked examples, transfer, preference-versus-accuracy and method portfolios.

Course completion is a learning record, not professional certification or permission to deploy code. Future assessments should measure demonstrated competence using practical tasks, independent marking and held-out scenarios.

## 7. Software Engineering Academy doctrine

Cosmo must learn that code which merely runs is not necessarily safe or reliable. Engineering methods should cover:

- requirements and acceptance criteria;
- modular design and trust boundaries;
- threat modeling and secure defaults;
- input validation and output encoding;
- authentication, authorization and tenant isolation;
- database constraints, migrations and restore tests;
- unit, integration, contract, end-to-end and regression tests;
- fuzz/property/adversarial testing;
- independent code review and dependency/supply-chain checks;
- observability, incident response and root-cause learning;
- staged releases, feature flags and rollback.

A green test suite is evidence, not proof. Independent tests, test-quality review, sample size, limitations and unresolved defects must be reported.

## 8. Security and data boundaries

Shared seed libraries and courseware have `owner_id IS NULL` and are readable by authenticated users. User-created strategies, runs, evaluations and progress are owner-scoped. Version snapshots, relationships and evaluations are append-only for authenticated clients. Anonymous table grants are not used for this layer. RLS remains enabled on every new table.

Do not put secrets, personal Genesis history or private source archives into the public repository. Keep the public repo as the safe presentation shell.

## 9. Current limitations

- The database foundation and seed records are deployed, but live owner sign-in and browser CRUD have not yet been tested.
- The Academy page is source code only until the GitHub Pages deployment is enabled and published.
- Cosmo chat does not yet automatically retrieve strategy records or record strategy runs/evaluations.
- The strategy selection engine is not yet an autonomous runtime.
- The courseware is a starter curriculum, not a complete professional engineering certification.
- Independent benchmark datasets, practical assessment marking, drift/forgetting checks and safe strategy promotion still need implementation.
- CC, CC-SIM and TIVA independence and runtime boundaries remain to be implemented and tested.

## 10. Next implementation sequence

1. Publish the Academy page and verify owner magic-link login.
2. Verify read-only retrieval of shared libraries and courses under authenticated RLS.
3. Verify per-user course progress insert/update and cross-user isolation.
4. Add a strategy retrieval function to Cosmo chat, initially read-only.
5. Add strategy run capture and independent evaluation.
6. Add held-out code-quality/security benchmarks and regression datasets.
7. Add controlled candidate promotion, approval, rollback and monitoring.
8. Only then allow selected strategies to guide live engineering workflows.

## 11. Acceptance tests

- Anonymous users cannot read strategy or courseware tables.
- Authenticated users can read shared seed content.
- User A cannot read or update User B's private runs, evaluations or progress.
- Shared seed strategies cannot be modified by normal authenticated clients.
- Version snapshots, relationships and evaluations cannot be edited or deleted by normal authenticated clients.
- Course progress persists across sessions and remains owner-scoped.
- Strategy evidence class and Cosmo validation state are shown separately.
- A failed or unsafe strategy run remains in history and cannot silently become approved.
