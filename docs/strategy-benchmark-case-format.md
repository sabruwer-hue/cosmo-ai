# Strategy benchmark case format

A case is a JSON object with:
- `case_id`: stable, unique identifier;
- `description`: human-readable intent;
- `task_domain` and `task_summary`: the simulated request;
- optional `constraints`, `evaluations`, and `limit`;
- optional `expectations`: `excluded_strategy_codes`, `required_caution_fragments`, `top_domain`, and `deterministic`.

Example:

```json
{
  "case_id": "planning-avoid-001",
  "description": "A trivial task should surface the pre-mortem avoid condition.",
  "task_domain": "planning",
  "task_summary": "Handle a trivial routine task.",
  "expectations": {
    "required_caution_fragments": ["avoid-when"],
    "deterministic": true
  }
}
```

Author expectations from reviewed strategy guidance, not from a desired benchmark score. Keep cases narrow enough that a failure explains what needs correction. Give each materially different scenario its own stable case ID. A test that encodes a mistaken expectation is itself a defect.
