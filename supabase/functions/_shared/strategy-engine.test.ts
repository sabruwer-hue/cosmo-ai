import { assertEquals, assert } from "jsr:@std/assert@1";
import { rankStrategies, type StrategyCandidate, type StrategyEvaluationSignal } from "./strategy-engine.ts";

const makeStrategy = (overrides: Partial<StrategyCandidate> = {}): StrategyCandidate => ({
  id: "strategy-1",
  strategy_code: "PLAN-PRE-MORTEM",
  title: "Project Pre-Mortem",
  strategy_type: "planning",
  objective: "Identify plausible failure modes before committing to a plan.",
  method: ["Imagine the project failed.", "List plausible causes.", "Create mitigations and early warning signals."],
  selection_guidance: { best_for: ["complex projects", "launch planning"], avoid_when: ["trivial routine tasks"] },
  strengths: ["Surfaces risks early"],
  limitations: ["Can overemphasise unlikely risks"],
  risk_notes: ["Do not confuse imagined failure with evidence."],
  evidence_class: "context_dependent",
  cosmo_validation_state: "unverified",
  current_version: 1,
  library_id: "library-1",
  library_domain: "planning",
  ...overrides,
});

Deno.test("domain match ranks above unrelated candidate", () => {
  const result = rankStrategies([
    makeStrategy(),
    makeStrategy({ id: "strategy-2", strategy_code: "LEARN-RETRIEVAL", title: "Retrieval Practice", library_domain: "learning", strategy_type: "learning" }),
  ], "planning", "Plan a complex project launch", [], [], 2);
  assertEquals(result[0].strategy.id, "strategy-1");
  assert(result[0].reasons.some((reason) => reason.includes("domain matches")));
});

Deno.test("avoid-when overlap creates a caution and reduces rank", () => {
  const avoided = makeStrategy({ selection_guidance: { best_for: [], avoid_when: ["trivial routine tasks"] } });
  const suitable = makeStrategy({ id: "strategy-2", selection_guidance: { best_for: ["complex project launch"], avoid_when: [] } });
  const result = rankStrategies([avoided, suitable], "planning", "Plan a trivial routine task", [], [], 2);
  assert(result.find((item) => item.strategy.id === "strategy-1")!.cautions.some((item) => item.includes("avoid-when")));
});

Deno.test("small evaluation samples do not influence ranking", () => {
  const strategy = makeStrategy();
  const signals: StrategyEvaluationSignal[] = [
    { strategy_id: strategy.id, outcome: "success", measured_score: 95, evaluation_type: "quality" },
  ];
  const without = rankStrategies([strategy], "planning", "Plan project", [], [], 1)[0];
  const withOne = rankStrategies([strategy], "planning", "Plan project", [], signals, 1)[0];
  assertEquals(withOne.score, without.score);
  assert(withOne.cautions.some((item) => item.includes("too little history")));
});

Deno.test("unsafe history is bounded and visible after minimum sample", () => {
  const strategy = makeStrategy({ cosmo_validation_state: "validated_for_scope" });
  const signals: StrategyEvaluationSignal[] = [1,2,3].map(() => ({
    strategy_id: strategy.id, outcome: "unsafe", measured_score: null, evaluation_type: "safety",
  }));
  const result = rankStrategies([strategy], "planning", "Plan project", [], signals, 1)[0];
  assert(result.score < 8.5);
  assertEquals(result.evaluation_history.unsafe, 3);
});

Deno.test("ordering is deterministic for equal scores", () => {
  const result = rankStrategies([
    makeStrategy({ id: "z", strategy_code: "Z-STRATEGY" }),
    makeStrategy({ id: "a", strategy_code: "A-STRATEGY" }),
  ], "unmatched", "no overlapping terms", [], [], 2);
  assertEquals(result.map((item) => item.strategy.strategy_code), ["A-STRATEGY", "Z-STRATEGY"]);
});
