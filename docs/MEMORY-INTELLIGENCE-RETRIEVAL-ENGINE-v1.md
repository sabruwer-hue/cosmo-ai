# Cosmo AI — Memory Intelligence & Retrieval Engine v1.0

**Document ID:** COSMO-KNOW-RETRIEVAL-001  
**Status:** Session-only front-end prototype implemented; production retrieval is not deployed.

## 1. Purpose and boundary
Retrieve relevant memory, source, claim and relationship records while preserving provenance and the distinction between summaries and original evidence. Retrieval ranks candidates; it does not establish truth, approve decisions or replace source review.

## 2. Prototype scope
The current browser interface searches:
- Main Memories Vault records and their current summaries;
- Master History Vault source notes;
- Knowledge Engine claim/observation/hypothesis/prediction/decision drafts;
- Memory Relationship Engine edges.

It supports record-type and memory-category filters, multi-term keyword matching, deterministic relevance ordering, a result trace, per-result provenance/context details and JSON trace export.

The prototype searches only data currently held in the same page session. It cannot recover old conversations or files that have not been entered into this page.

## 3. Retrieval method
1. Preserve the user's original query.
2. Normalize case and split into unique terms.
3. Apply the selected record-type and category filters.
4. Require all query terms to appear in the indexed text.
5. Rank exact code, exact title and title/phrase matches above general occurrences; use deterministic tie-breaking.
6. Return the record type, temporary code, title, excerpt/summary, relevance score and record metadata.
7. Allow inspection of source links, relationship context and version history where present.
8. Export the query, method, filters, scan/match counts and selected result metadata as a JSON trace.

The score is a local heuristic, not a probability, confidence score, semantic similarity score or truth rating.

## 4. Provenance and trace requirements
- Memory results show their category, access classification, creation time, version count, linked original history records and relationship edges.
- Source results show source type, captured time, original note and linked memory when present.
- Knowledge drafts show provenance class, assessment state, evidence note and recorded source URL when valid.
- Relationship results show edge type, endpoints, review status and rationale.
- Missing source links are explicitly reported; a summary is not silently represented as an original source.
- Model-generated, inferred, hypothetical and speculative records remain distinguishable from user-provided or external-source records.

## 5. Important exclusions
This v1 prototype does not implement:
- semantic/vector/embedding search;
- AI query interpretation, entity resolution or generated synthesis;
- persistent full-text indexing or cross-session recall;
- external source ingestion, file parsing or OCR;
- workspace permission enforcement or multi-user isolation;
- temporal validity reasoning, duplicate-source independence analysis or contradiction inference;
- ranking calibrated against user relevance feedback.

The interface must not claim these capabilities are live.

## 6. Production retrieval pipeline
1. Parse query intent, subject, requested timeframe and output format.
2. Resolve workspace and permissions before candidate retrieval.
3. Search exact IDs, metadata, full text and semantic indexes in parallel where appropriate.
4. Traverse permitted relationship edges with bounded depth and cycle controls.
5. Deduplicate by canonical source identity so copies do not masquerade as independent evidence.
6. Rank by relevance, directness, source quality, freshness when appropriate, scope fit and source diversity.
7. Fetch exact source locators and counter-evidence for material claims.
8. Return evidence packets with record/version IDs, source locators, provenance, assessments, contradictory evidence and permission-safe links.
9. Store a trace of query, retrieval version, candidates, inclusion/exclusion reasons, policy outcome and cited evidence.
10. Ask for clarification when ambiguity changes the result materially; otherwise state gaps and uncertainty.

## 7. Security, privacy and integrity
- Enforce row/workspace/record permissions before content reaches the model.
- Graph traversal must check access at every hop; counts and snippets must not leak restricted records.
- Apply classification, retention and deletion rules to source records, indexes, embeddings, caches and exports.
- Indexing must be idempotent, retryable and observable; partial ingestion is never labelled complete.
- Preserve source content hashes and exact locators. A hash detects change; it does not prove truth.
- Never expose secrets or unnecessary personal data in search traces.

## 8. Acceptance tests
- Exact permanent code retrieves the matching record without cross-workspace leakage.
- All query terms and filters behave deterministically.
- Exact title/code matches rank above weaker body matches.
- Each memory result can navigate to its original source records when linked.
- A memory with no source link explicitly reports that gap.
- Relationship context includes direction, type, rationale and review state.
- A hypothesis or model output is not displayed as verified fact.
- Duplicate copies of one source do not count as independent corroboration.
- Restricted records do not leak through results, snippets, counts, exports or graph traversal.
- Query trace reproduces filters, retrieval version, candidates and selected records.
- Deletion/retention updates remove or restrict indexed derivatives as required.
- Failed indexing or retrieval is visible and never reported as successful.

## 9. Next stages
- KN-1: persistent source registry, exact-source retrieval, permanent IDs and access filters.
- KN-2: persistent memory/version/source relationships and full-text search.
- KN-3: evidence and counter-evidence research workflow with reviewable assessments.
- KN-4: semantic retrieval, contradiction candidate detection, bounded graph traversal and temporal retrieval.
- KN-5: relevance evaluation, user feedback, prediction outcomes and retrieval quality monitoring.

**Production gate:** select and approve the backend, authentication provider, workspace model, storage strategy and retention/deletion rules before creating migrations or claiming secure persistent retrieval.
