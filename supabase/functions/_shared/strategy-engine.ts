export type StrategyCandidate = {
  id: string;
  strategy_code: string;
  title: string;
  strategy_type: string;
  objective: string;
  method: unknown;
  selection_guidance: unknown;
  strengths: string[];
  limitations: string[];
  risk_notes: string[];
  evidence_class: string;
  cosmo_validation_state: string;
  current_version: number;
  library_id: string;
  library_domain?: string;
};

export type StrategyEvaluationSignal = {
  strategy_id: string;
  outcome: string;
  measured_score: number | null;
  evaluation_type: string;
};

export type RankedStrategy = {
  strategy: StrategyCandidate;
  score: number;
  reasons: string[];
  cautions: string[];
  evaluation_history: { sample_count: number; successes: number; partial: number; failures: number; unsafe: number };
};

function words(value: unknown): string[] {
  return String(value ?? "").toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function guidanceList(value: unknown, key: string): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const list = (value as Record<string, unknown>)[key];
  return Array.isArray(list) ? list.filter((item): item is string => typeof item === "string") : [];
}

function strategyText(strategy: StrategyCandidate): string {
  const method = Array.isArray(strategy.method) ? strategy.method.join(" ") : "";
  return [
    strategy.title, strategy.strategy_type, strategy.objective, strategy.library_domain,
    method, ...guidanceList(strategy.selection_guidance, "best_for"),
    ...strategy.strengths,
  ].join(" ");
}

/**
 * Deterministic, explainable ranking. It proposes methods; it does not assert
 * that an unverified strategy is safe, effective, or approved.
 */
export function rankStrategies(
  candidates: StrategyCandidate[],
  taskDomain: string,
  taskSummary: string,
  constraints: string[] = [],
  evaluations: StrategyEvaluationSignal[] = [],
  limit = 5,
): RankedStrategy[] {
  const domain = taskDomain.trim().toLowerCase().replace(/[- ]+/g, "_");
  const queryTokens = unique(words([taskSummary, ...constraints].join(" ")));
  const safeLimit = Math.max(1, Math.min(5, Math.floor(limit) || 5));

  const ranked = candidates
    .filter((strategy) => strategy && strategy.id && strategy.status !== "retired")
    .map((strategy) => {
      let score = 0;
      const reasons: string[] = [];
      const cautions: string[] = [];
      const strategyDomain = String(strategy.library_domain ?? "").toLowerCase().replace(/[- ]+/g, "_");
      const strategyType = String(strategy.strategy_type ?? "").toLowerCase().replace(/[- ]+/g, "_");

      if (domain && strategyDomain === domain) {
        score += 8;
        reasons.push("Library domain matches the task domain.");
      } else if (domain && strategyType === domain) {
        score += 5;
        reasons.push("Strategy type matches the task domain.");
      }

      const bestFor = guidanceList(strategy.selection_guidance, "best_for");
      const avoidWhen = guidanceList(strategy.selection_guidance, "avoid_when");
      const searchable = new Set(words(strategyText(strategy)));
      const matched = queryTokens.filter((token) => searchable.has(token));
      if (matched.length) {
        const relevance = Math.min(6, matched.length * 1.25);
        score += relevance;
        reasons.push("Task language overlaps with the strategy objective or method (" + matched.slice(0, 5).join(", ") + ").");
      }
      const bestForTokens = new Set(words(bestFor.join(" ")));
      const bestForMatches = queryTokens.filter((token) => bestForTokens.has(token));
      if (bestForMatches.length) {
        score += Math.min(4, bestForMatches.length * 1.5);
        reasons.push("Selection guidance identifies a matching use case.");
      }
      const avoidTokens = new Set(words(avoidWhen.join(" ")));
      const avoidMatches = queryTokens.filter((token) => avoidTokens.has(token));
      if (avoidMatches.length) {
        score -= Math.min(7, avoidMatches.length * 2);
        cautions.push("The task appears to overlap with an avoid-when condition: " + avoidMatches.slice(0, 4).join(", ") + ".");
      }

      const history = evaluations.filter((item) => item.strategy_id === strategy.id);
      const successes = history.filter((item) => item.outcome === "success").length;
      const partial = history.filter((item) => item.outcome === "partial").length;
      const failures = history.filter((item) => item.outcome === "failure").length;
      const unsafe = history.filter((item) => item.outcome === "unsafe").length;
      // Only three or more recorded evaluations can influence ranking; small
      // samples are shown as history but do not create a false performance signal.
      if (history.length >= 3) {
        const signal = successes + partial * 0.25 - failures * 0.75 - unsafe * 2;
        score += Math.max(-5, Math.min(3, signal / Math.sqrt(history.length)));
        reasons.push("Owner-scoped evaluation history contributed a bounded ranking signal (" + history.length + " records).");
      } else if (history.length) {
        cautions.push("Only " + history.length + " evaluation record(s); too little history to influence ranking.");
      }

      if (strategy.cosmo_validation_state === "approved_for_use") {
        score += 1;
        reasons.push("Marked approved for use within its defined scope.");
      } else if (strategy.cosmo_validation_state === "validated_for_scope") {
        score += 0.5;
        reasons.push("Marked validated for a defined scope.");
      } else if (strategy.cosmo_validation_state === "unverified") {
        cautions.push("Cosmo has not validated this strategy; treat it as a candidate, not proven guidance.");
      } else if (strategy.cosmo_validation_state === "tested_in_sandbox") {
        cautions.push("Sandbox-tested only; production suitability is not established.");
      }

      if (strategy.evidence_class === "experimental" || strategy.evidence_class === "unverified") {
        cautions.push("Evidence class is " + strategy.evidence_class + ".");
      }
      for (const risk of (strategy.risk_notes ?? []).slice(0, 3)) cautions.push(risk);

      return {
        strategy, score: Math.round(score * 100) / 100,
        reasons: reasons.length ? reasons : ["Candidate retained for comparison; no strong domain or keyword match."],
        cautions: unique(cautions),
        evaluation_history: { sample_count: history.length, successes, partial, failures, unsafe },
      };
    });

  return ranked.sort((a, b) =>
    b.score - a.score || a.strategy.strategy_code.localeCompare(b.strategy.strategy_code)
  ).slice(0, safeLimit);
}
