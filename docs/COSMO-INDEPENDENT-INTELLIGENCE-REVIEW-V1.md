# Cosmo Independent Intelligence Review v1

## Purpose
Establish the first executable governance gate for the three review roles in the Cosmo blueprint: CC (critical analysis), CC-SIM (scenario challenge), and TIVA (verification and integrity review).

## What exists in v1
- A deterministic, pure review-gate function accepting a claim packet and three separately identified reviewer submissions.
- Required role checks, packet binding, duplicate/self-review identity checks, evidence provenance/source-reference checks, safety flags, benchmark gate, disagreement preservation, and unresolved-question reporting.
- Fail-closed outcomes: `blocked`, `needs_revision`, or `ready_for_human_review`.
- Tests for missing reviewers, duplicate identities, uncertain evidence, safety/benchmark failure, disagreement, and missing source references.

## What it does not do
- It does not call three AI models or prove that reviewers are genuinely independent.
- It does not run a physical, scientific, financial or operational simulation.
- It does not verify external sources against the live web.
- It does not certify truth, approve deployment, change strategy validation, update ranking, or authorize actions.
- It does not persist reports or mutate database records.

## Required future work
1. Bind reviewer identity to authenticated service/model identities, not caller-supplied labels.
2. Add immutable review records and provenance-preserving storage through a reviewed migration.
3. Implement model/provider routing with isolation and conflict-of-interest controls.
4. Add source verification, reproducible simulation runners, scenario calibration and uncertainty bounds.
5. Add human decision capture, signed approvals, audit exports and rollback controls.
6. Red-team prompt injection, collusion, missing evidence, stale evidence and reviewer compromise.

## Release rule
A `ready_for_human_review` result is only a hand-off to a human decision-maker. It is never an approval or authority to act. This v1 is source-only until tests, security review, schema review and deployment approval are complete.
