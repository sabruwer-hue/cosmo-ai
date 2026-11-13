export type VaultAccess = "private";
export type MemoryRetention = "permanent" | "review_required" | "time_limited";
export type HistoryIntegrity = "unverified" | "verified" | "disputed";

export type MemoryIndexEntry = {
  memory_code: string;
  title: string;
  summary: string;
  source_record_codes: string[];
  project_codes: string[];
  created_at: string;
  updated_at: string;
  version: number;
  retention: MemoryRetention;
  access: VaultAccess;
  status: "active" | "superseded" | "disputed" | "withdrawn";
};

export type HistorySourceRecord = {
  source_code: string;
  source_type: "conversation" | "document" | "voice_note" | "file" | "external_source" | "system_event" | "model_output" | "research_note";
  original_content: string;
  captured_at: string;
  original_timestamp: string | null;
  provenance: string;
  source_hash: string;
  integrity: HistoryIntegrity;
  access: VaultAccess;
  supersedes_source_code?: string;
};

export type VaultFinding = {
  code: string;
  severity: "error" | "warning";
  record_code: string;
  detail: string;
};

export type VaultAuditReport = {
  index_count: number;
  history_count: number;
  findings: VaultFinding[];
  valid: boolean;
  limitations: string[];
};

function validTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

/**
 * Validates the boundary between the searchable memory index and the
 * authoritative history archive. It does not persist records, calculate
 * cryptographic hashes, or provide storage-level immutability.
 */
export function auditMemoryHistoryVault(
  indexEntries: MemoryIndexEntry[],
  historyRecords: HistorySourceRecord[],
): VaultAuditReport {
  const findings: VaultFinding[] = [];
  const historyByCode = new Map<string, HistorySourceRecord>();
  const indexCodes = new Set<string>();

  for (const record of historyRecords) {
    if (historyByCode.has(record.source_code)) {
      findings.push({ code: "duplicate-history-code", severity: "error", record_code: record.source_code, detail: "History source codes must never be reused." });
    } else historyByCode.set(record.source_code, record);
    if (!record.original_content.trim()) findings.push({ code: "empty-original", severity: "error", record_code: record.source_code, detail: "Original source content is required; a summary cannot replace the source." });
    if (!record.source_hash.trim()) findings.push({ code: "missing-integrity-hash", severity: "error", record_code: record.source_code, detail: "A source integrity hash is required, but must be computed by a trusted storage service." });
    if (!record.provenance.trim()) findings.push({ code: "missing-provenance", severity: "error", record_code: record.source_code, detail: "Source provenance is required." });
    if (!validTimestamp(record.captured_at)) findings.push({ code: "invalid-capture-time", severity: "error", record_code: record.source_code, detail: "Captured-at timestamp is invalid." });
    if (record.original_timestamp && !validTimestamp(record.original_timestamp)) findings.push({ code: "invalid-original-time", severity: "warning", record_code: record.source_code, detail: "Original source timestamp is invalid or needs normalization." });
    if (record.supersedes_source_code && !historyRecords.some((item) => item.source_code === record.supersedes_source_code)) {
      findings.push({ code: "broken-supersedes-link", severity: "error", record_code: record.source_code, detail: "Correction references a missing prior source record." });
    }
    if (record.integrity !== "verified") findings.push({ code: "source-not-verified", severity: "warning", record_code: record.source_code, detail: "Source is not independently verified; preserve its original content and uncertainty label." });
  }

  for (const entry of indexEntries) {
    if (indexCodes.has(entry.memory_code)) findings.push({ code: "duplicate-memory-code", severity: "error", record_code: entry.memory_code, detail: "Memory codes must be unique and never reused." });
    indexCodes.add(entry.memory_code);
    if (!entry.title.trim() || !entry.summary.trim()) findings.push({ code: "empty-memory-summary", severity: "error", record_code: entry.memory_code, detail: "Index title and summary are required." });
    if (!validTimestamp(entry.created_at) || !validTimestamp(entry.updated_at)) findings.push({ code: "invalid-memory-time", severity: "error", record_code: entry.memory_code, detail: "Memory timestamps must be valid." });
    if (!Number.isInteger(entry.version) || entry.version < 1) findings.push({ code: "invalid-memory-version", severity: "error", record_code: entry.memory_code, detail: "Memory version must be a positive integer." });
    if (!entry.source_record_codes.length) findings.push({ code: "memory-without-source", severity: "error", record_code: entry.memory_code, detail: "A memory summary must link to at least one original history record." });
    for (const sourceCode of entry.source_record_codes) {
      if (!historyByCode.has(sourceCode)) findings.push({ code: "broken-history-link", severity: "error", record_code: entry.memory_code, detail: "Missing history source record: " + sourceCode });
    }
    if (entry.status === "superseded" && entry.retention !== "permanent") {
      findings.push({ code: "superseded-retention-warning", severity: "warning", record_code: entry.memory_code, detail: "Superseded memory should normally remain retained for historical traceability." });
    }
  }

  return {
    index_count: indexEntries.length,
    history_count: historyRecords.length,
    findings,
    valid: findings.every((item) => item.severity !== "error"),
    limitations: [
      "This is an in-memory contract validator, not a persistent Main Memories Vault or Master History Vault.",
      "The validator checks that a hash is present; it does not compute or cryptographically verify the hash.",
      "Application-level checks cannot guarantee append-only storage, prevent privileged deletion, or prove backups are recoverable.",
      "Access labels are metadata only until enforced by authenticated server-side authorization and database policies.",
      "Contradictory and disputed source records must be retained as separate evidence; summaries must not silently overwrite original history.",
    ],
  };
}
