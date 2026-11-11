# Cosmo AI — Orchestration API Contract v1.0

**Document ID:** COSMO-API-ORCH-001  
**Status:** Proposed contract — no live API endpoints are implied  
**Depends on:** COSMO-CORE-ARCH-001 and COSMO-DATA-MEM-001

This contract describes the first server-side interface between the Cosmo client and its future orchestration service. It is provider-neutral and must be adapted to the selected backend before implementation.

## 1. Contract rules

- All protected routes require an authenticated session.
- Every request is authorized against workspace and project scope on the server.
- Use JSON request/response bodies and a versioned prefix such as /api/v1.
- Every request carries or receives a correlation ID.
- Validate request shape, size, content type and allowed values.
- Never accept provider secrets, arbitrary privileged SQL, or unrestricted tool code from the client.
- Treat all model output and tool output as untrusted input.
- Return stable error codes; do not leak stack traces, secrets or private record existence.
- Use idempotency keys for operations that may be retried.
- Long-running jobs return a task/run identifier and are polled or delivered through an authenticated event channel.

## 2. Initial route catalogue

| Method | Route | Purpose |
|---|---|---|
| GET | /api/v1/health | Minimal service health; no secrets or internal topology |
| GET | /api/v1/me | Current authenticated identity and permitted workspace memberships |
| GET | /api/v1/projects | List projects visible to the caller |
| POST | /api/v1/projects | Create a project if caller has permission |
| GET | /api/v1/projects/{project_id} | Read one permitted project |
| POST | /api/v1/tasks | Submit a task/request for orchestration |
| GET | /api/v1/tasks/{task_id} | Read task status and permitted event summary |
| POST | /api/v1/tasks/{task_id}/approve | Approve the exact pending action, subject to policy |
| POST | /api/v1/tasks/{task_id}/cancel | Cancel a cancellable task |
| GET | /api/v1/memories | Search permitted memory index entries |
| POST | /api/v1/memories | Create a memory entry from an authorised source |
| GET | /api/v1/memories/{memory_id} | Retrieve memory plus permitted provenance pointers |
| GET | /api/v1/history/{history_id} | Retrieve a source record if caller has access |
| POST | /api/v1/research/questions | Create a research question |
| GET | /api/v1/research/questions/{question_id} | Retrieve question, claims and assessments |
| POST | /api/v1/research/questions/{question_id}/evidence | Attach a source/evidence item |
| POST | /api/v1/research/claims/{claim_id}/assessments | Add a versioned claim assessment |

This route list is a design proposal. Do not expose routes until their authorization and validation tests exist.

## 3. Task submission shape

Example request fields:
- project_id (optional, but if supplied must be accessible);
- user_request (required, bounded text);
- requested_mode (optional enum such as answer, research, plan, execute);
- context_refs (optional list of record IDs; each independently authorized);
- client_idempotency_key (required for operations with side effects).

The server derives the actor and workspace from the authenticated session. It must not trust client-supplied actor IDs, roles, approval flags, workspace ownership or tool permissions.

Initial response:
- task_id;
- task_code;
- state;
- created_at;
- correlation_id;
- next_action (for example clarify, await approval, or poll status).

## 4. Task lifecycle

Allowed states:
- received
- clarifying
- planned
- awaiting_approval
- executing
- verifying
- completed
- failed
- cancelled

State changes are validated server-side and written as ordered task events. Terminal states are completed, failed and cancelled. A terminal task cannot silently return to executing; create a new task or explicit recovery event with a linked successor.

A task can enter executing only if:
- the caller is authorized;
- the selected tool is registered and enabled;
- the action is within the caller's granted scope;
- all required approvals are valid and bound to the exact action payload;
- rate and budget limits allow execution.

## 5. Approval contract

An approval request must show:
- exact action and target;
- relevant data to be sent or changed;
- expected cost or external impact where known;
- reversibility and rollback approach;
- permission scope and expiry;
- cryptographic digest of the exact action payload.

Approval is single-purpose, time-limited and non-transferable. If the payload changes, approval is invalid and must be requested again. No silent approval from prior unrelated tasks.

## 6. Model router boundary

The orchestration service calls a private model-router interface. The browser never calls a paid model provider directly with a secret key.

Router input includes task category, bounded prompt/context references, output schema, allowed tool list and policy constraints. The router returns provider/model identifiers, structured output, usage metadata when available, latency and error/fallback information.

Model output cannot grant permissions, approve its own action, alter system policy or directly mutate protected records. Validate structured output before using it.

## 7. Error envelope

Return a stable envelope with:
- error.code;
- error.message (safe for the caller);
- error.retryable;
- correlation_id;
- optional field_errors.

Suggested codes: UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, RATE_LIMITED, APPROVAL_REQUIRED, APPROVAL_EXPIRED, CONFLICT, PROVIDER_UNAVAILABLE, EXECUTION_FAILED and INTERNAL_ERROR.

Avoid revealing whether a private record exists when the caller is not authorized to see it.

## 8. Event and status response

Task status should distinguish:
- current state;
- last event timestamp;
- user action required;
- progress summary;
- verification status;
- result references the caller is allowed to access.

Do not return raw secrets, private tool credentials or unrestricted internal chain-of-thought. Return concise decision summaries, evidence, tool outcomes and verification facts instead.

## 9. Minimum contract tests

- Anonymous caller cannot access protected routes.
- Caller cannot submit a forged actor, role or workspace.
- Cross-workspace project, task and memory IDs are denied.
- Repeated idempotency key does not duplicate a side effect.
- Invalid state transitions are rejected and audited.
- Expired or payload-mismatched approval is rejected.
- Disabled or out-of-scope tools cannot execute.
- Provider timeout becomes a visible failed/retryable state, not false success.
- Tool result is independently verified before task completion.
- Error responses contain no secret or stack trace.
- Rate limits and request-size limits are enforced.

## 10. Implementation gate

Before coding this API, confirm the backend runtime, database, authentication provider, hosting target, event-delivery method and initial tool set. Implement health and identity first, then projects/tasks, then memory/research, then model routing. Do not wire the current demo chat to a live provider until the server-side security boundary is in place.
