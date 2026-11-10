# Cosmo AI — Architecture and Build Plan

## What exists in this repository
- Responsive public-facing dashboard and assistant interface.
- Clearly labelled demo-only assistant response.
- GitHub Pages deployment workflow.
- Intended custom domain: `cosmo-ai.co.za`.

## What does not exist yet
The repository is not yet a production AI platform. It has no connected model, server-side API, identity provider, database, durable memory vault, project/task service, or operational agent runtime. Demo metrics and activity are illustrative.

## Target architecture

```text
Browser / PWA
    |
    v
Public web frontend
    |
    v
Authenticated API gateway
    |
    +--> Identity and permissions
    +--> Conversation and task service
    +--> Model router (provider-neutral)
    +--> Tool/action gateway (approval-gated)
    +--> Research and evidence service
    +--> Memory index / Knowledge Graph
    +--> Master History Vault (immutable source records)
    |
    +--> PostgreSQL database + object storage
    +--> Audit/event log + monitoring
    +--> Backup and recovery
```

## Core principles
1. **Evidence before certainty:** distinguish user-provided material, external evidence, inference, and speculation.
2. **Traceability:** stable IDs, timestamps, provenance, version history, links between ideas, sources, decisions, and outcomes.
3. **Human control:** consequential external actions require explicit permissions and approvals.
4. **Least privilege:** each agent and integration receives only the permissions it needs.
5. **No secret in the browser:** all provider keys and privileged database credentials stay server-side.
6. **No self-authorised escalation:** an AI agent cannot grant itself permissions or disable its own safety controls.
7. **Recoverability:** test backups, exports, restore, and audit integrity.

## Build sequence
- Stage 1 — public interface and domain deployment.
- Stage 2 — backend service, identity, database, secrets, audit logging.
- Stage 3 — model router and conversational service.
- Stage 4 — memory index and Master History Vault, with import/export and provenance.
- Stage 5 — projects, research, prediction ledger, trace records, and knowledge graph.
- Stage 6 — Cosmo orchestration, Cerebro review, simulation, and controlled tool execution.
- Stage 7 — integrations, business intelligence, EARTRON, Guardian, and CosmoCity modules.

## Production gate
Do not call Cosmo production-ready until authentication, authorization, secret management, rate limits, prompt-injection defenses, data retention, privacy controls, audit logging, backup/restore, and independent security testing are implemented.
