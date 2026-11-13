import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { evaluateIntelligenceReview, type ReviewPacket, type ReviewerSubmission } from "./intelligence-review.ts";

const packet: ReviewPacket = {
  packet_id: "PKT-001", producer_id: "cosmo", claim: "A testable claim",
  evidence: [{ evidence_id: "E-1", provenance: "external_source", verification: "verified", source_ref: "https://example.test/source" }],
  safety_flags: [], benchmark_passed: true, assumptions: [],
};
const submissions: ReviewerSubmission[] = [
  { role: "cc", reviewer_id: "reviewer-cc", reviewed_packet_id: "PKT-001", assessment: "support", findings: [], evidence_gaps: [], assumptions_challenged: [] },
  { role: "cc_sim", reviewer_id: "reviewer-sim", reviewed_packet_id: "PKT-001", assessment: "support", findings: [], evidence_gaps: [], assumptions_challenged: [], scenario_ranges: ["base case: 1-2"] },
  { role: "tiva", reviewer_id: "reviewer-tiva", reviewed_packet_id: "PKT-001", assessment: "support", findings: [], evidence_gaps: [], assumptions_challenged: [] },
];

Deno.test("complete independent review is only ready for human review", () => {
  assertEquals(evaluateIntelligenceReview(packet, submissions).status, "ready_for_human_review");
});
Deno.test("missing reviewer role fails closed", () => {
  const report = evaluateIntelligenceReview(packet, submissions.slice(0, 2));
  assertEquals(report.status, "blocked");
  assertEquals(report.missing_roles, ["tiva"]);
});
Deno.test("duplicate reviewer identity blocks independence", () => {
  const duplicate = submissions.map((item) => ({ ...item, reviewer_id: "same-reviewer" }));
  assertEquals(evaluateIntelligenceReview(packet, duplicate).reviewer_independence_passed, false);
  assertEquals(evaluateIntelligenceReview(packet, duplicate).status, "blocked");
});
Deno.test("unverified evidence requires revision", () => {
  const uncertain = { ...packet, evidence: [{ ...packet.evidence[0], verification: "unverified" as const }] };
  assertEquals(evaluateIntelligenceReview(uncertain, submissions).status, "needs_revision");
});
Deno.test("safety flags and failed benchmark block review", () => {
  const unsafe = { ...packet, safety_flags: ["unsafe action"], benchmark_passed: false };
  assertEquals(evaluateIntelligenceReview(unsafe, submissions).status, "blocked");
});
Deno.test("reviewer disagreement is preserved, not averaged", () => {
  const split = submissions.map((item) => item.role === "cc_sim" ? { ...item, assessment: "challenge" as const } : item);
  const report = evaluateIntelligenceReview(packet, split);
  assertEquals(report.status, "needs_revision");
  assertEquals(report.disagreements.length, 1);
});
Deno.test("external evidence without source reference fails integrity", () => {
  const incomplete = { ...packet, evidence: [{ evidence_id: "E-2", provenance: "external_source" as const, verification: "verified" as const }] };
  assertEquals(evaluateIntelligenceReview(incomplete, submissions).evidence_integrity_passed, false);
  assertEquals(evaluateIntelligenceReview(incomplete, submissions).status, "blocked");
});

Deno.test("empty evidence cannot pass review", () => {
  const empty = { ...packet, evidence: [] };
  const report = evaluateIntelligenceReview(empty, submissions);
  assertEquals(report.status, "blocked");
  assertEquals(report.evidence_integrity_passed, false);
});
Deno.test("unanimous reviewer challenge requires revision", () => {
  const challenged = submissions.map((item) => ({ ...item, assessment: "challenge" as const }));
  assertEquals(evaluateIntelligenceReview(packet, challenged).status, "needs_revision");
});
Deno.test("duplicate evidence IDs fail integrity", () => {
  const duplicated = { ...packet, evidence: [packet.evidence[0], { ...packet.evidence[0] }] };
  assertEquals(evaluateIntelligenceReview(duplicated, submissions).evidence_integrity_passed, false);
});
