import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { auditMemoryHistoryVault, type HistorySourceRecord, type MemoryIndexEntry } from "./memory-vault-contract.ts";

const source: HistorySourceRecord = {
  source_code: "HST-CHAT-000001", source_type: "conversation", original_content: "Original user statement",
  captured_at: "2026-11-13T12:00:00Z", original_timestamp: "2026-11-13T11:59:00Z",
  provenance: "user-provided conversation", source_hash: "a".repeat(64), integrity: "verified", access: "private",
};
const memory: MemoryIndexEntry = {
  memory_code: "MEM-COSMO-000001", title: "Cosmo requirement", summary: "A searchable summary",
  source_record_codes: [source.source_code], project_codes: ["COSMO"], created_at: "2026-11-13T12:00:00Z",
  updated_at: "2026-11-13T12:00:00Z", version: 1, retention: "permanent", access: "private", status: "active",
};

Deno.test("valid index links to preserved source record", () => {
  assertEquals(auditMemoryHistoryVault([memory], [source]).valid, true);
});
Deno.test("broken memory-to-history link fails audit", () => {
  const broken = { ...memory, source_record_codes: ["HST-MISSING-000001"] };
  assertEquals(auditMemoryHistoryVault([broken], [source]).valid, false);
});
Deno.test("empty original source cannot be replaced by summary", () => {
  const empty = { ...source, original_content: "" };
  assertEquals(auditMemoryHistoryVault([memory], [empty]).valid, false);
});
Deno.test("duplicate history codes are rejected", () => {
  assertEquals(auditMemoryHistoryVault([memory], [source, source]).valid, false);
});
Deno.test("unverified source remains visible as a warning", () => {
  const uncertain = { ...source, integrity: "unverified" as const };
  const report = auditMemoryHistoryVault([memory], [uncertain]);
  assertEquals(report.valid, true);
  assertEquals(report.findings.some((item) => item.code === "source-not-verified"), true);
});
Deno.test("correction cannot point to missing history record", () => {
  const correction = { ...source, source_code: "HST-CHAT-000002", supersedes_source_code: "HST-MISSING-000000" };
  assertEquals(auditMemoryHistoryVault([memory], [source, correction]).valid, false);
});
Deno.test("missing source hash fails integrity audit", () => {
  const noHash = { ...source, source_hash: "" };
  assertEquals(auditMemoryHistoryVault([memory], [noHash]).valid, false);
});
