# Cosmo Strategy Benchmark Harness v1

## Purpose

Provide a repeatable, deterministic regression harness for Strategy Library selection. The harness checks encoded expectations against a supplied strategy catalogue and reports the exact reasons a case passed or failed. It is a test instrument, not an autonomous judge and not proof of real-world effectiveness.

## Components

- `supabase/functions/_shared/strategy-benchmark.ts`: pure benchmark runner built on the existing strategy ranker. It performs no network calls and writes no data.
- `supabase/functions/_shared/strategy-benchmark.test.ts`: unit tests for domain expectations, retired-strategy exclusion, avoid-when cautions, explicit failed expectations and empty suites.
- `docs/strategy-benchmark-case-format.md`: case-authoring rules and example structure.

## What can be tested

Each case supplies a task domain, task summary, optional constraints and optional evaluation signals. Expectations can assert:
- retired or otherwise prohibited strategy codes never appear;
- expected cautions are surfaced;
- the top-ranked strategy belongs to a specified domain;
- repeated execution returns the same ordered result;
- result count respects the requested limit.

The report contains per-case ranked strategy codes, pass/fail checks, aggregate pass rate and limitations.

## What cannot be concluded

A passing benchmark does not establish that a strategy is safe, effective, lawful, validated or suitable for production. It only establishes that the current deterministic ranker met the test author's encoded expectations for the supplied catalogue and case. Human review of test cases and failures is mandatory. A strategy must never be promoted merely because it passes this harness.

## Safety and data boundary

- No Supabase calls, database writes, migrations, deployment or external actions.
- No strategy run/evaluation records are created.
- The harness does not mutate the catalogue or validation state.
- Historical evaluation signals are supplied by the caller; only the upstream strategy engine's verified-evidence gate may admit learning signals.
- Keep benchmark fixtures versioned. Record benchmark version, candidate catalogue snapshot/version and run timestamp in any future persisted report. Do not compare pass rates across materially different suites without identifying the change.

## Next gates

1. Populate reviewed benchmark cases from the actual strategy catalogue and representative Cosmo tasks.
2. Run the suite against a frozen catalogue snapshot and inspect every failed case.
3. Add independent CC/CC-SIM review for high-risk strategy domains.
4. Establish minimum coverage and regression thresholds with the creator before any release gate is enforced.
5. Keep validation promotion a separate human decision.
