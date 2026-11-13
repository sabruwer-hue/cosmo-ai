# Cosmo Strategy Execution & Evaluation Engine v1

## Purpose

Connect the existing shared Strategy Libraries to the authenticated Cosmo chat runtime. This first version provides an explainable shortlist, owner-scoped execution traces and evidence-labelled evaluations. It is intentionally not an autonomous external-action engine.

## Runtime flow

1. **Recommend** — `recommend_strategies` reads active shared strategies, library domains and the authenticated owner's evaluation history. A deterministic ranker scores domain fit, task-language overlap, `best_for` guidance and bounded historical outcomes.
2. **Select** — Cosmo explains why the chosen strategy fits, lists alternatives and surfaces validation state, evidence class, limitations and risk notes.
3. **Begin** — `begin_strategy_run` writes an owner-scoped run with a unique `COSMO-STRAT-...` trace code, task context, strategy version, selection reason and alternatives. It does not perform external actions.
4. **Apply and close** — Cosmo applies the method within the current conversation, then `complete_strategy_run` closes the run with an honest summary and status.
5. **Evaluate** — `evaluate_strategy_run` appends an evidence-labelled evaluation. Evaluation is not the same as validation and never promotes a strategy automatically.

## Ranking safeguards

- Shared strategies must be active; retired strategies are excluded.
- Domain match and keyword relevance are deterministic and explainable.
- `avoid_when` overlap creates an explicit caution and reduces rank.
- Verified owner feedback influences rank only after at least three records, and the signal is bounded. Unverified source claims are excluded.
- An unsafe historical outcome has a strong negative effect.
- `unverified`, `tested_in_sandbox`, experimental and other non-approved states remain visible; a high rank does not make a strategy proven.
- Equal scores are ordered by strategy code for reproducibility.

## Evaluation safeguards

Accepted evidence sources are creator feedback, automated tests, independent review, external outcomes and model self-assessment.

Only explicit creator feedback detected in the current user message is currently treated as verified feedback. Claims of automated tests, independent reviews, external outcomes and model self-assessments are stored as unverified and forced to `inconclusive`, confidence is capped at 0.4 and the measured score is cleared until a separate evidence-ingestion path can verify them. Unverified evaluations are excluded from ranking. Verified creator feedback still does not automatically change strategy validation state. An `unsafe` evaluation moves the related run to `needs_review`. Evaluation records are append-only through the existing RLS policy.

## Access and data boundaries

- All four strategy tools are owner-gated in the chat runtime.
- The chat request uses the authenticated user's Supabase client; row-level security remains active.
- Strategy catalogue rows are shared read-only candidates; runs and evaluations are owner-scoped.
- The run/evaluation records are written to the existing `cosmo_strategy_runs`, `cosmo_strategy_evaluations` and `cosmo_audit_events` tables.
- No production schema change or migration is required for this version.
- No strategy tool can deploy, pay, send, modify production configuration or execute an external action.

## Verification

The branch adds Deno unit tests for domain matching, avoid-when cautions, minimum evidence sample size, unsafe-history penalties and deterministic tie-breaking. GitHub Actions runs these tests as part of quality checks. The chat Edge Function still needs Deno type-check and owner-authenticated sandbox testing before deployment.

## Known limitations / next version

- Ranking is a transparent heuristic, not semantic embedding retrieval or an independent AI judge.
- Evaluation history is owner-scoped and small samples are deliberately ignored.
- Strategy validation promotion remains a separate, human-governed process.
- No calibration, benchmark harness or independent CC/CC-SIM/TIVA evaluation is connected yet.
- Browser UI for strategy runs and evaluation history is not included in this backend integration.
