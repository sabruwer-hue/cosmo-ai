# Memory Versioning & Contradiction Review — Specification v1.0

**Status:** Static front-end prototype implemented; browser-session only. No persistent backend, authentication or append-only server audit exists.

## 1. Version model
A memory is a stable logical record with one or more immutable versions. Each version contains:
- stable memory ID and monotonically increasing version number;
- full summary/content snapshot;
- change reason and change-basis classification;
- creation timestamp and actor identity (server-assigned in production);
- provenance/evidence references and review status;
- links to prior and next versions.

A new version never edits or deletes the previous snapshot. The current memory summary is a convenience pointer to the latest accepted version, not the historical source of truth.

## 2. Change-basis values
- new_evidence
- correction
- scope_change
- user_update
- other

Production must distinguish a submitted draft from an approved/current version. Version creation and approval may be separate operations depending on workspace policy.

## 3. Contradiction review
Only explicit `contradicts` relationship edges enter the review queue. Review outcomes:
- open
- confirmed_conflict
- resolved_evidence
- not_a_conflict
- needs_more_evidence

Each review requires rationale, reviewer identity, timestamp and references to evidence considered. The review updates the edge's review history; it must not erase either endpoint, its source records, or earlier review outcomes. A resolved conflict remains historically discoverable.

## 4. Evidence discipline
- Newer does not automatically mean truer.
- Confidence scores do not automatically resolve a conflict.
- A model-generated suggestion is not an authorized review.
- Resolution must identify the evidence and scope supporting the outcome.
- When evidence is insufficient, retain the open/needs-more-evidence status.
- Contradictory claims may both be valid under different dates, populations, jurisdictions or contexts; review must test scope before declaring a conflict.

## 5. Prototype behaviour
- Select an existing memory and create a new summary version with a mandatory reason and change-basis.
- Preserve prior snapshots in the current browser session.
- View a selected memory's version timeline.
- Review each explicit contradiction link and record an outcome plus rationale.
- Both conflicting memories remain visible.
- This prototype mutates the current in-memory summary pointer to the newest snapshot but retains earlier snapshots in the same session.
- Refreshing or closing the page loses all prototype data.

## 6. Production requirements
1. Use server-assigned immutable IDs and database transactions for version creation.
2. Enforce authorization and workspace access on every read and write.
3. Use optimistic concurrency/version checks to prevent lost updates.
4. Record append-only audit events for create, approve, supersede, review and access-sensitive actions.
5. Preserve source provenance and exact evidence version references.
6. Support effective dates and scope metadata for time-sensitive or jurisdiction-specific claims.
7. Keep review history append-only; corrections create new review events rather than rewriting old ones.
8. Support export/import with integrity checks and stable identifiers.
9. Provide retention, legal hold, backup and restore policies before production use.
10. Prevent restricted data from leaking via timeline, search, conflict queue, counts or graph traversal.

## 7. Acceptance tests
- Creating version 2 leaves version 1 byte-for-byte retrievable.
- Concurrent version creation cannot silently overwrite another version.
- Missing reason is rejected.
- A contradiction review cannot proceed without rationale.
- Every review outcome preserves both endpoint records and source references.
- A conflict marked resolved remains in history with its previous open state and reviewer rationale.
- Newer version alone does not auto-resolve contradictions.
- Permission checks apply to memory, versions, relationships and evidence.
- Export preserves version order, IDs, provenance, timestamps and complete review history.
- Audit events identify actor, action, target, timestamp and before/after references.

## Known limitations
The current interface uses temporary browser memory only. Version IDs and review events are not permanent, authenticated or backed up. It is not a production record-management system.
