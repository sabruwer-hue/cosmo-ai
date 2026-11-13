export type ReviewRole = "cc" | "cc_sim" | "tiva";
export type EvidenceItem = {
  evidence_id: string;
  provenance: "user_provided" | "external_source" | "inference" | "speculation";
  verification: "verified" | "unverified" | "disputed";
  source_ref?: string;
};
export type ReviewPacket = {
  packet_id: string;
  producer_id: string;
  claim: string;
  evidence: EvidenceItem[];
  safety_flags: string[];
  benchmark_passed: boolean;
  assumptions: string[];
};
export type ReviewerSubmission = {
  role: ReviewRole;
  reviewer_id: string;
  reviewed_packet_id: string;
  assessment: "support" | "challenge" | "inconclusive" | "block";
  findings: string[];
  evidence_gaps: string[];
  assumptions_challenged: string[];
  scenario_ranges?: string[];
};
export type ReviewStatus = "ready_for_human_review" | "needs_revision" | "blocked";
export type ReviewReport = {
  schema_version: 1;
  packet_id: string;
  status: ReviewStatus;
  submissions_valid: boolean;
  required_roles_present: ReviewRole[];
  missing_roles: ReviewRole[];
  reviewer_independence_passed: boolean;
  evidence_integrity_passed: boolean;
  benchmark_gate_passed: boolean;
  blockers: string[];
  disagreements: string[];
  unresolved_questions: string[];
  limitations: string[];
};

const REQUIRED_ROLES: ReviewRole[] = ["cc", "cc_sim", "tiva"];

/**
 * Deterministic review gate for independently supplied CC, CC-SIM and TIVA
 * assessments. This does not call AI models or claim a simulation occurred.
 * It never certifies a claim: its strongest outcome is readiness for human
 * review. Missing, conflicted or unsafe inputs fail closed.
 */
export function evaluateIntelligenceReview(
  packet: ReviewPacket,
  submissions: ReviewerSubmission[],
): ReviewReport {
  const blockers: string[] = [];
  const unresolved: string[] = [];
  const disagreements: string[] = [];
  const roles = new Set(submissions.map((item) => item.role));
  const missing = REQUIRED_ROLES.filter((role) => !roles.has(role));
  if (missing.length) blockers.push("Required independent review role(s) missing: " + missing.join(", ") + ".");

  const packetMatched = submissions.every((item) => item.reviewed_packet_id === packet.packet_id);
  if (!packetMatched) blockers.push("One or more reviews refer to a different packet.");

  const reviewerIds = submissions.map((item) => item.reviewer_id.trim().toLowerCase());
  const uniqueReviewers = new Set(reviewerIds);
  const producer = packet.producer_id.trim().toLowerCase();
  const independent = reviewerIds.every((id) => id.length > 0 && id !== producer) &&
    uniqueReviewers.size === reviewerIds.length && submissions.length === REQUIRED_ROLES.length;
  if (!independent) blockers.push("Reviewer identities are missing, duplicated, or not independent of the producer.");

  const validRoles = submissions.every((item) => REQUIRED_ROLES.includes(item.role));
  const validAssessments = submissions.every((item) =>
    ["support", "challenge", "inconclusive", "block"].includes(item.assessment)
  );
  if (!validRoles || !validAssessments) blockers.push("A reviewer submission contains an unsupported role or assessment.");

  const evidenceIntegrity = packet.evidence.every((item) =>
    item.evidence_id.trim().length > 0 &&
    (item.provenance !== "external_source" || Boolean(item.source_ref?.trim()))
  );
  if (!evidenceIntegrity) blockers.push("Evidence record is incomplete: external sources require a source reference and every item needs an ID.");

  const unverified = packet.evidence.filter((item) => item.verification !== "verified");
  if (unverified.length) unresolved.push(unverified.length + " evidence item(s) remain unverified or disputed.");
  if (packet.evidence.some((item) => item.provenance === "speculation")) {
    unresolved.push("Speculative material is present and must not be presented as established fact.");
  }
  if (!packet.benchmark_passed) blockers.push("Required benchmark gate did not pass.");
  if (packet.safety_flags.length) blockers.push("Safety flags require resolution: " + packet.safety_flags.join("; "));

  for (const item of submissions) {
    if (item.assessment === "block") blockers.push(item.role + " submitted a blocking assessment.");
    if (item.assessment === "inconclusive") unresolved.push(item.role + " review is inconclusive.");
    for (const gap of item.evidence_gaps) unresolved.push(item.role + " evidence gap: " + gap);
    for (const assumption of item.assumptions_challenged) unresolved.push(item.role + " challenged assumption: " + assumption);
  }

  const assessments = new Set(submissions.map((item) => item.assessment));
  if (assessments.has("support") && (assessments.has("challenge") || assessments.has("block"))) {
    disagreements.push("Reviewers disagree: at least one supports the claim while another challenges or blocks it.");
  }
  if (submissions.some((item) => item.role === "cc_sim") &&
      !(submissions.find((item) => item.role === "cc_sim")?.scenario_ranges?.length)) {
    unresolved.push("CC-SIM supplied no scenario ranges; no simulation result can be inferred.");
  }

  const submissionsValid = packetMatched && validRoles && validAssessments;
  const reviewerIndependencePassed = independent;
  const status: ReviewStatus = blockers.length
    ? "blocked"
    : unresolved.length || disagreements.length
    ? "needs_revision"
    : "ready_for_human_review";

  return {
    schema_version: 1,
    packet_id: packet.packet_id,
    status,
    submissions_valid: submissionsValid,
    required_roles_present: REQUIRED_ROLES.filter((role) => roles.has(role)),
    missing_roles: missing,
    reviewer_independence_passed: reviewerIndependencePassed,
    evidence_integrity_passed: evidenceIntegrity,
    benchmark_gate_passed: packet.benchmark_passed,
    blockers: [...new Set(blockers)],
    disagreements: [...new Set(disagreements)],
    unresolved_questions: [...new Set(unresolved)],
    limitations: [
      "This is a deterministic governance gate, not an AI reasoning system or independent factual verification service.",
      "Reviewer independence is based on supplied identity labels and cannot prove organisational or model independence.",
      "CC-SIM scenario ranges are reviewer-provided assumptions, not physical-world simulation results.",
      "A ready_for_human_review result is not approval, truth certification, deployment permission or authority to act.",
      "No review submission, evidence, validation state or strategy ranking is changed or persisted.",
    ],
  };
}
