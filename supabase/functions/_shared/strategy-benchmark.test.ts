import { assert, assertEquals } from "jsr:@std/assert@1";
import { runStrategyBenchmark, type StrategyBenchmarkCase } from "./strategy-benchmark.ts";
import { type StrategyCandidate } from "./strategy-engine.ts";

const candidate = (overrides: Partial<StrategyCandidate> = {}): StrategyCandidate => ({
  id: "plan-1", strategy_code: "PLAN-PRE-MORTEM", title: "Project Pre-Mortem",
  strategy_type: "planning", objective: "Identify project failure modes before launch.",
  method: ["Imagine failure", "List risks", "Create mitigations"],
  selection_guidance: { best_for: ["complex project launch"], avoid_when: ["trivial routine task"] },
  strengths: ["Surfaces risks"], limitations: [], risk_notes: ["Do not treat imagined failure as evidence."],
  evidence_class: "context_dependent", cosmo_validation_state: "unverified", current_version: 1,
  library_id: "lib-plan", library_domain: "planning", ...overrides,
});

Deno.test("benchmark reports domain and deterministic checks", () => {
  const cases: StrategyBenchmarkCase[] = [{
    case_id: "planning-001", description: "Planning domain should rank first",
    task_domain: "planning", task_summary: "Plan a complex project launch",
    expectations: { top_domain: "planning", deterministic: true },
  }];
  const report = runStrategyBenchmark([candidate()], cases);
  assertEquals(report.case_count, 1);
  assertEquals(report.failed_cases, 0);
  assertEquals(report.pass_rate, 1);
  assert(report.results[0].checks.every((item) => item.passed));
});

Deno.test("benchmark catches a retired strategy in output", () => {
  const cases: StrategyBenchmarkCase[] = [{
    case_id: "retired-001", description: "Retired strategies are prohibited",
    task_domain: "planning", task_summary: "Plan project",
    expectations: { excluded_strategy_codes: ["PLAN-RETIRED"] },
  }];
  const report = runStrategyBenchmark([
    candidate({ id: "retired", strategy_code: "PLAN-RETIRED", cosmo_validation_state: "retired" }),
  ], cases);
  assertEquals(report.failed_cases, 0);
});

Deno.test("benchmark checks avoid-when cautions", () => {
  const cases: StrategyBenchmarkCase[] = [{
    case_id: "avoid-001", description: "A matching avoid condition must be visible",
    task_domain: "planning", task_summary: "Handle a trivial routine task",
    expectations: { required_caution_fragments: ["avoid-when"] },
  }];
  const report = runStrategyBenchmark([candidate()], cases);
  assertEquals(report.failed_cases, 0);
});

Deno.test("benchmark failure is explicit when expectation is false", () => {
  const cases: StrategyBenchmarkCase[] = [{
    case_id: "wrong-domain-001", description: "Intentionally incorrect expectation",
    task_domain: "planning", task_summary: "Plan project",
    expectations: { top_domain: "learning" },
  }];
  const report = runStrategyBenchmark([candidate()], cases);
  assertEquals(report.failed_cases, 1);
  assertEquals(report.checks_failed, 1);
});

Deno.test("empty benchmark suite reports zero pass rate without crashing", () => {
  const report = runStrategyBenchmark([candidate()], []);
  assertEquals(report.case_count, 0);
  assertEquals(report.pass_rate, 0);
});
