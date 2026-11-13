import { rankStrategies, type StrategyCandidate, type StrategyEvaluationSignal } from "./strategy-engine.ts";

export type BenchmarkExpectation = {
  /** Strategy codes that must never appear in the result. */
  excluded_strategy_codes?: string[];
  /** At least one result must expose this caution fragment. */
  required_caution_fragments?: string[];
  /** Require the top result to have this library domain. */
  top_domain?: string;
  /** Require the same ordered codes on repeated execution. */
  deterministic?: boolean;
};

export type StrategyBenchmarkCase = {
  case_id: string;
  description: string;
  task_domain: string;
  task_summary: string;
  constraints?: string[];
  evaluations?: StrategyEvaluationSignal[];
  limit?: number;
  expectations?: BenchmarkExpectation;
};

export type BenchmarkCheck = {
  name: string;
  passed: boolean;
  detail: string;
};

export type BenchmarkCaseResult = {
  case_id: string;
  description: string;
  ranked_codes: string[];
  checks: BenchmarkCheck[];
  passed: boolean;
};

export type StrategyBenchmarkReport = {
  schema_version: 1;
  benchmark_version: string;
  candidate_count: number;
  case_count: number;
  passed_cases: number;
  failed_cases: number;
  pass_rate: number;
  checks_passed: number;
  checks_failed: number;
  results: BenchmarkCaseResult[];
  limitations: string[];
};

function check(name: string, passed: boolean, detail: string): BenchmarkCheck {
  return { name, passed, detail };
}

/**
 * Run deterministic, rule-based benchmark cases against a supplied strategy
 * catalogue. This is a regression harness, not proof of real-world efficacy.
 * It performs no network access and never mutates candidate/evaluation data.
 */
export function runStrategyBenchmark(
  candidates: StrategyCandidate[],
  cases: StrategyBenchmarkCase[],
  benchmarkVersion = "1.0.0",
): StrategyBenchmarkReport {
  const results = cases.map((testCase): BenchmarkCaseResult => {
    const expectations = testCase.expectations ?? {};
    const limit = Math.max(1, Math.min(5, Math.floor(testCase.limit ?? 5) || 5));
    const ranked = rankStrategies(
      candidates,
      testCase.task_domain,
      testCase.task_summary,
      testCase.constraints ?? [],
      testCase.evaluations ?? [],
      limit,
    );
    const codes = ranked.map((item) => item.strategy.strategy_code);
    const checks: BenchmarkCheck[] = [];

    for (const excluded of expectations.excluded_strategy_codes ?? []) {
      checks.push(check(
        "excluded:" + excluded,
        !codes.includes(excluded),
        codes.includes(excluded) ? excluded + " appeared in the ranked results." : excluded + " was correctly excluded.",
      ));
    }

    for (const fragment of expectations.required_caution_fragments ?? []) {
      const matched = ranked.some((item) =>
        item.cautions.some((caution) => caution.toLowerCase().includes(fragment.toLowerCase()))
      );
      checks.push(check(
        "caution:" + fragment,
        matched,
        matched ? "A matching caution was surfaced." : "No result surfaced caution fragment: " + fragment,
      ));
    }

    if (expectations.top_domain) {
      const actual = ranked[0]?.strategy.library_domain ?? "(no result)";
      checks.push(check(
        "top-domain:" + expectations.top_domain,
        actual === expectations.top_domain,
        "Expected top domain " + expectations.top_domain + "; received " + actual + ".",
      ));
    }

    if (expectations.deterministic) {
      const repeated = rankStrategies(
        candidates,
        testCase.task_domain,
        testCase.task_summary,
        testCase.constraints ?? [],
        testCase.evaluations ?? [],
        limit,
      ).map((item) => item.strategy.strategy_code);
      const same = JSON.stringify(codes) === JSON.stringify(repeated);
      checks.push(check(
        "deterministic-order",
        same,
        same ? "Repeated execution returned identical ordered results." : "Repeated execution changed the ordered results.",
      ));
    }

    if (ranked.length > limit) {
      checks.push(check("result-limit", false, "Ranker returned more results than the configured limit."));
    } else {
      checks.push(check("result-limit", true, "Result count respects the configured limit."));
    }

    return {
      case_id: testCase.case_id,
      description: testCase.description,
      ranked_codes: codes,
      checks,
      passed: checks.every((item) => item.passed),
    };
  });

  const checks = results.flatMap((result) => result.checks);
  const passedCases = results.filter((result) => result.passed).length;
  return {
    schema_version: 1,
    benchmark_version: benchmarkVersion,
    candidate_count: candidates.length,
    case_count: results.length,
    passed_cases: passedCases,
    failed_cases: results.length - passedCases,
    pass_rate: results.length ? Math.round((passedCases / results.length) * 10000) / 10000 : 0,
    checks_passed: checks.filter((item) => item.passed).length,
    checks_failed: checks.filter((item) => !item.passed).length,
    results,
    limitations: [
      "This is a deterministic regression benchmark, not a measure of real-world strategy effectiveness.",
      "A passing case proves only that the encoded expectation held for this catalogue and test input.",
      "Expected outcomes require human review; benchmark authors can encode incorrect assumptions.",
      "The harness does not independently verify evidence, safety, legal compliance or external outcomes.",
      "No strategy validation state is changed and no evaluation history is written.",
    ],
  };
}
