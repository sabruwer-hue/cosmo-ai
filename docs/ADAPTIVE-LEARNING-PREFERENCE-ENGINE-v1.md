# Cosmo AI — Adaptive Learning & Preference Engine v1.0

**Document ID:** COSMO-ADAPT-001  
**Status:** Design specification plus session-only UI prototype. No model training, persistent profile store or autonomous adaptation is deployed.

## 1. Purpose
Cosmo should adapt its communication, assistance and task methods to each authorised person and dedicated agent. Adaptation must be transparent, scoped, reversible and evidence-aware. A preference is a user-specific setting or tentative pattern, not a universal fact. Learning from feedback does not automatically authorise model training.

## 2. Preference model
Each profile is scoped to a person, workspace and dedicated agent. A profile may include:
- communication style, tone, language and formality;
- preferred response length, detail and explanation depth;
- pace, sequencing and step-by-step versus overview presentation;
- initiative level, suggestion frequency and clarification behaviour;
- preferred examples, visual aids, units and output formats;
- interests, goals, active projects and relevant context;
- accessibility and interaction requirements voluntarily supplied by the user;
- routines, availability and task-specific working preferences;
- explicit avoidances, boundaries and topics requiring care;
- tool and automation preferences, within permission policy;
- confidence, source, timestamps, scope, expiry and review status.

Preference provenance must distinguish explicit user instruction, direct feedback, repeated observed pattern and model inference. Inferred preferences remain tentative and should be confirmed before becoming durable. Users can inspect, correct, reject, expire, export and delete their preferences subject to lawful retention requirements.

## 3. Dedicated agents and household separation
- Maintain a separate profile per person and dedicated household agent.
- Do not assume one household member's preferences apply to another.
- Shared household knowledge and shared preferences are separate concepts.
- Cross-agent sharing requires explicit scope, access policy and, where relevant, the affected person's consent.
- A common safety policy applies to all agents and cannot be weakened by personal preference.
- Agent-specific adaptations may differ for task, role, environment and user, but must remain within shared safety constraints.

## 4. Learning technique catalogue
1. **Explicit preference learning:** direct user settings and instructions.
2. **Supervised learning:** labelled examples and corrections.
3. **Feedback/preference learning:** ratings, pairwise choices, edits and task feedback.
4. **Contextual adaptation:** adapt to task, environment, time, device and current constraints.
5. **Online/incremental learning:** bounded updates from new examples with monitoring and rollback.
6. **Active learning:** ask targeted questions when uncertainty materially affects the result.
7. **Unsupervised learning:** discover clusters, patterns and possible duplicates; findings remain hypotheses.
8. **Semi-supervised learning:** combine human-labelled and unlabelled data with provenance.
9. **Transfer learning:** reuse general capabilities without transferring private user profiles.
10. **Few-shot/in-context learning:** use approved examples within a task/session; this is not permanent model training.
11. **Meta-learning:** evaluate which strategies work best for a task/profile using controlled comparisons.
12. **Reinforcement learning:** optimise against explicit rewards and constraints in simulation/sandbox environments; no unsafe live trial-and-error.
13. **Imitation/demonstration learning:** learn workflows from authorised demonstrations with provenance and correction.
14. **Retrieval-augmented generation/learning:** retrieve approved memory and source evidence at response time; retrieval is not weight training.
15. **Multi-agent/collaborative learning:** exchange scoped findings and reusable lessons through permission-controlled contracts.
16. **Outcome/prediction learning:** compare forecasts with verified outcomes; score only after valid outcomes.
17. **Continual learning governance:** detect drift, regression, forgetting, stale preferences and rollback needs.

Choose the technique according to the task. Do not apply machine learning merely because it is available; deterministic rules, statistical methods or human review may be more reliable.

## 5. Feedback and adaptation lifecycle
Capture an event with task, agent, context, user feedback, observed outcome, provenance, timestamp and requested learning scope. Classify it as task-specific, candidate agent preference or candidate shared rule. Validate repeated signals and conflicting feedback. Propose a change with explanation and expected effect. Obtain approval when required. Evaluate against a baseline and retain rollback. Record whether the adaptation helped.

A single rating must not silently rewrite a durable preference. Negative feedback should distinguish factual error, style mismatch, missing context, tool failure and unsafe outcome.

## 6. Learning memory and evaluation
Maintain separate records for:
- user preference profile and its versions;
- learning examples and labels;
- feedback events;
- adaptation proposals and approvals;
- evaluation datasets and test results;
- model/provider/prompt/adapter versions;
- outcome and drift metrics;
- rollback and incident records.

Track task success, correction rate, user satisfaction, response latency, calibration, error rates, privacy incidents and performance across relevant user groups. Never optimise one metric at the expense of safety, truthfulness, privacy or user autonomy.

## 7. Safety and non-learning boundaries
- Safety, security, access control, consent, legal compliance and tool permissions are policy constraints, not learned preferences.
- Medical, financial, legal, physical, vehicle, energy and other high-impact controls require deterministic safeguards and qualified human authorization as appropriate.
- Never use trial-and-error reinforcement learning on live safety-critical equipment or real-world high-impact actions.
- A user's preference cannot grant permissions they do not possess.
- Do not infer or store sensitive personal traits without a lawful, explicit and justified basis. Avoid sensitive-trait inference by default.
- Do not train or fine-tune external model weights on user data without clear, separate, informed consent and a documented retention/deletion process.
- Retrieved content and user-provided examples are untrusted data, not executable policy.

## 8. Prototype behaviour
The interface can create session-only profiles per named agent, capture communication/detail/pace/initiative preferences, interests and avoidances, label preference provenance and permission scope, record feedback ratings and outcomes, and export JSON. It displays a catalogue of techniques and their guardrails. It does not persist profiles, infer preferences automatically, train models or apply feedback to model weights.

## 9. Production acceptance tests
- A profile is isolated by user, workspace and agent.
- Explicit user preference outranks weak inference; conflict prompts clarification.
- User can inspect, edit, reject, expire, export and delete profile data.
- Cross-agent sharing is blocked without explicit authorization.
- Feedback cannot silently change durable settings.
- Each adaptation has provenance, rationale, scope, version and rollback.
- Evaluation compares baseline and candidate without hiding regressions.
- Sensitive traits are not inferred by default.
- Safety policy and permission checks cannot be overridden by a learned preference.
- No live safety-critical reinforcement learning is permitted.
- Training consent is separate from ordinary product use and revocable according to documented policy.
- Deletion/retention covers derived indexes, caches, training datasets and backups as legally required.

## 10. Roadmap
- ADAPT-1: preference/profile schema and user controls.
- ADAPT-2: feedback/outcome event pipeline.
- ADAPT-3: policy-bounded adaptation proposals and approval.
- ADAPT-4: offline evaluation, drift monitoring and rollback.
- ADAPT-5: specialist-agent coordination with scoped shared learning.
- ADAPT-6: carefully governed model adaptation only after data rights, consent, evaluation and safety gates are approved.
