# Memory Relationship Engine — Prototype Specification v1.0

**Status:** Implemented as a static, session-only interface prototype. No backend or permanent graph storage exists.

## Purpose
Represent explicit relationships between canonical Main Memories Vault records while preserving the Master History Vault as the source archive. Relationship edges must not replace, rewrite or merge either endpoint.

## Relationship types
- `supports`: one memory is recorded as supporting another.
- `contradicts`: the two memories are in tension or conflict. Preserve both records and their provenance; do not choose a winner automatically.
- `refines`: adds detail or narrows the meaning of another memory.
- `supersedes`: records that newer guidance replaces older guidance for a defined scope. Keep the older record and its history.
- `duplicate_of`: flags a possible duplicate for human review; never auto-delete or merge.
- `depends_on`: one memory relies on another.
- `related_to`: general association without a stronger claim.
- `derived_from`: records a derivation relationship; production implementation must also point to the original source/evidence record where applicable.

## Edge fields
Each edge requires a unique permanent server-assigned identifier, source memory ID, target memory ID, relation type, creator/actor, created timestamp, provenance/evidence references, rationale, review status, and version/audit history. Prototype IDs use `DRAFT-REL-###` and are not permanent identifiers.

## Integrity and governance rules
1. Endpoints must exist and be accessible to the actor.
2. Self-links are rejected.
3. Exact duplicate directed edges are rejected in the prototype.
4. Contradictions remain visible until explicitly reviewed; no silent overwrite.
5. Superseding a memory does not delete or mutate the superseded record.
6. Duplicate candidates require human approval before any merge; merges must retain redirects and complete provenance.
7. Relationship assertions are not truth assessments. Confidence and evidence quality belong to the linked claims/evidence assessment layer.
8. All edge creation, review, amendment, deactivation and merge decisions require append-only audit events in production.
9. Access controls must be checked for both endpoints and any attached evidence. Restricted records must not leak through graph traversal, counts or search snippets.
10. Deletion/retention policy must account for graph edges and preserve referential integrity without reusing permanent IDs.

## Prototype behaviour
- Select two existing memory drafts and a relationship type.
- Add an optional rationale/evidence note.
- Reject missing endpoints, self-links and exact duplicate directed edges.
- Display the edge register and basic integrity counts.
- Export relationship drafts as JSON.
- All state is in browser memory and is lost when the page session ends.

## Production acceptance tests
- Cannot create an edge to a nonexistent or unauthorized memory.
- Cannot create a self-link.
- Contradiction edges preserve both endpoints, versions, provenance and source records.
- Superseding an item leaves its prior versions retrievable.
- Duplicate detection never merges or deletes without authorized approval.
- Graph traversal enforces permissions at every hop and does not reveal hidden nodes.
- Every edge mutation is auditable and replayable.
- Export/import preserves stable IDs, edge direction, type, provenance and timestamps.
- Broken-reference and cycle checks are available; cycles are not universally invalid, but flagged according to relation semantics.
- Concurrent updates use optimistic locking/version checks.

## Known limitations
This UI is not a persistent graph database, authenticated system, production audit log or secure archive. It uses temporary in-memory records only. Do not enter sensitive information.

## Continuous improvement integration

The Relationship Engine is itself subject to periodic quality review under the [Continuous Improvement & Meta-Learning Orchestration Engine v1.0](CONTINUOUS-IMPROVEMENT-META-LEARNING-ENGINE-v1.md). Automated diagnostics may propose missing, stale, weak or suspicious edges, contradictions, duplicate candidates and integrity issues. They must never silently merge, delete or resolve records. Preserve both endpoints, source provenance, versions and access controls; graph traversal must enforce permissions at every hop.
