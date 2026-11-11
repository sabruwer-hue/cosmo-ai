# Cosmo AI — Knowledge Engine Functional Specification v1.0

**Document ID:** COSMO-KNOW-001  
**Status:** Proposed behaviour and acceptance criteria — not implemented  
**Repository scope:** Public-safe technical specification only

## 1. Purpose

The Knowledge Engine turns stored source material into traceable, searchable and revisable knowledge. It must help Cosmo answer questions and support decisions without treating summaries, model output or confidence scores as proof.

The engine is a retrieval, evidence and reasoning-support layer. It is not an independent authority and cannot grant itself permissions or approve consequential actions.

## 2. Core operating loop

1. **Receive:** accept a user request or authorised source.
2. **Classify:** identify subject, record type, sensitivity, workspace and retention requirements.
3. **Preserve:** store or reference the original source with capture metadata and integrity hash.
4. **Extract:** identify candidate facts, claims, entities, dates and relationships.
5. **Link:** connect extracted items to their source locations and relevant existing records.
6. **Compare:** find corroboration, contradiction, duplication, uncertainty and missing evidence.
7. **Assess:** produce a versioned assessment with rationale and provenance.
8. **Respond:** provide a concise answer with traceable supporting records and clear limitations.
9. **Review:** allow authorised users to correct, challenge, supersede or archive the knowledge item without silently erasing its history.

## 3. Separate record types

The system must distinguish:

- **Source:** original user-provided or externally acquired material.
- **Observation:** a directly recorded event or measurement.
- **Claim:** a statement that can be assessed against evidence.
- **Fact assessment:** a current, revisable judgement about a claim.
- **Inference:** a conclusion derived from stated premises.
- **Hypothesis:** a proposed explanation awaiting testing.
- **Prediction:** a time-bound forecast with a probability and verification date.
- **Decision:** an authorised choice, its rationale and the evidence available at the time.
- **Model output:** generated text or structured output, explicitly labelled as such.

A single document may contain several claims with different evidence quality. Do not assign one confidence value to an entire document when its claims differ.

## 4. Retrieval pipeline

### Query understanding
- Parse the user's question into subject, intent, time range and requested output.
- Resolve references only when supported by accessible records.
- Ask a clarification when ambiguity materially changes the answer.
- Preserve the original query for traceability.

### Candidate retrieval
Use a combination of:
- exact identifiers and codes;
- keyword and full-text search;
- metadata filters (workspace, project, date, category, classification);
- semantic retrieval where available;
- relationship traversal through the knowledge graph.

Retrieval must apply authorization filters before content is returned to the model. Do not fetch broad private content and rely on the model to ignore it.

### Ranking and selection
Rank candidates using relevance, source quality, recency where appropriate, directness, and relationship to the question. Preserve source diversity. Avoid allowing many copies of the same original source to masquerade as independent corroboration.

### Evidence assembly
For every material supporting statement, retain the source record and exact locator (page, paragraph, timestamp, field or event ID). Include counter-evidence and uncertainty where material.

## 5. Contradiction and duplication handling

- Detect claims that appear to conflict, but do not automatically delete or merge them.
- Compare dates, scope, definitions, source independence and context before marking a contradiction.
- Distinguish genuine contradiction from changed circumstances, different populations, different measurement methods or different meanings.
- Store the relationship and the reason for the assessment.
- Suggest duplicate candidates; merge only after an authorised review or a tested deterministic rule.
- Preserve original record IDs and redirect references if a merge is approved.

## 6. Confidence and evidence quality

Confidence is an assessment of support for a specific claim, not a measure of truth. Store:
- assessment label or calibrated probability where justified;
- rationale;
- evidence considered;
- contrary evidence;
- assessor (human or model/process);
- method and version;
- timestamp;
- review trigger.

Do not manufacture numeric precision when evidence is qualitative or sparse. A model's self-reported confidence is not calibrated confidence.

## 7. Knowledge graph

Represent relationships as typed, timestamped, provenance-bearing edges. Initial relationship types:
- supports
- contradicts
- derived_from
- supersedes
- duplicates
- related_to
- part_of
- concerns
- caused_by (only when causality is supported)
- measured_by
- decided_in

Edges must have source/justification and permission scope. Avoid turning mere co-occurrence into causation.

## 8. Temporal knowledge

Support:
- when a source was published or created;
- when Cosmo acquired it;
- when a claim was considered valid;
- when an assessment was made;
- when it was superseded or challenged.

Answers to time-sensitive questions should distinguish historical truth from current status. Retain timezone context when supplied; normalize timestamps for storage.

## 9. Research workflow

A research question progresses through:
- drafted
- scoped
- gathering_evidence
- assessing
- awaiting_review
- accepted_with_limits
- inconclusive
- rejected
- archived

A completed research item includes question, scope, claims, source list, supporting and contrary evidence, assessment, unresolved gaps, reviewer and review date. “Inconclusive” is a valid result and must not be converted into a confident answer to satisfy the user.

## 10. Prediction evaluation

- Record prediction text, target event, probability, timestamp, horizon and verification date before the outcome is known.
- Prevent silent edits after the forecast is locked; corrections create a new linked forecast version.
- Record outcome and outcome source separately.
- Calculate the selected scoring method reproducibly only after a verified outcome exists.
- Report calibration over a meaningful collection of forecasts, not as proof that one forecast is reliable.

## 11. Human review and action boundary

The Knowledge Engine may recommend a decision or action. It may not independently:
- approve a payment, purchase, contract or transfer;
- publish or disclose restricted data;
- change access policies;
- execute irreversible operations;
- override safety rules;
- convert a hypothesis into an established fact.

Consequential actions are passed to the orchestration and approval layer with a clear evidence summary and exact action payload.

## 12. Explainability and trace record

Each consequential answer or recommendation should be traceable to:
- user request;
- records retrieved;
- evidence selected and excluded;
- claim assessments used;
- model/provider and prompt-template version where retained;
- tools invoked and their outputs;
- policy checks;
- human approvals;
- final answer or action outcome.

Provide a concise user-facing explanation. Do not expose hidden internal reasoning traces; expose evidence, assumptions, checks, decisions and limitations instead.

## 13. Privacy, security and resilience

- Enforce workspace and record permissions before retrieval.
- Keep secrets out of prompts, logs and indexed content unless explicitly required and protected.
- Respect retention, deletion and correction requirements across indexes, caches, embeddings, exports and backups.
- Make indexing and embedding jobs idempotent and retryable.
- Record failed ingestion and partial processing; never label incomplete ingestion as successful.
- Support re-indexing from authorised source records after schema or model changes.
- Keep model-generated embeddings and summaries linked to their source and model/version metadata.

## 14. Minimum acceptance tests

1. A source can be ingested and retrieved by its permanent code.
2. Every extracted claim links to an exact source locator.
3. A summary can be regenerated without destroying earlier versions.
4. Search respects workspace permissions before returning candidate content.
5. Two copies of one source do not count as independent corroboration.
6. A contradiction is surfaced with both sources and context.
7. An unsupported claim is labelled unsupported or inconclusive.
8. A hypothesis is never returned as a verified fact without evidence and review.
9. A prediction cannot be scored before a verified outcome.
10. A decision trace can reconstruct the evidence and approvals available at decision time.
11. Retention/deletion changes propagate to indexes and derived data.
12. Failed ingestion or retrieval is visible and never reported as success.

## 15. Delivery sequence

**KN-1 — Foundation:** source registry, metadata, permanent codes, access filters and exact-source retrieval.

**KN-2 — Memory:** versioned summaries, memory-source links, categories, relationships and search.

**KN-3 — Research:** claims, evidence, counter-evidence, assessments and review workflow.

**KN-4 — Intelligence:** contradiction detection, semantic retrieval, graph traversal and temporal answers.

**KN-5 — Evaluation:** prediction ledger, outcomes, scoring and quality monitoring.

Each stage must pass its acceptance tests before being described as implemented or verified.
