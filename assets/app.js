const form = document.querySelector("#prompt-form");
const promptBox = document.querySelector("#prompt");
const response = document.querySelector("#response");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = promptBox.value.trim();
  if (!message) {
    promptBox.focus();
    return;
  }
  response.hidden = false;
  response.textContent = "";
  const heading = document.createElement("strong");
  heading.textContent = "Cosmo prototype";
  const copy = document.createElement("p");
  copy.textContent = "Your request has been received by this interface demo: “" + message + "”. A live AI service is not connected yet. The next production step is to route requests through an authenticated server-side API, with clear permissions and an auditable record.";
  response.append(heading, copy);
  promptBox.value = "";
});

// Knowledge Engine front-end prototype.
// Drafts are held in page memory only; they are not persisted or sent to a server.
const knowledgeForm = document.querySelector("#knowledge-form");
const knowledgeList = document.querySelector("#knowledge-list");
const knowledgeEmpty = document.querySelector("#knowledge-empty");
const knowledgeCount = document.querySelector("#knowledge-count");
const knowledgeExport = document.querySelector("#knowledge-export");
const knowledgeDrafts = [];

const provenanceLabels = {
  user_provided: "User provided",
  external_source: "External source",
  system_observed: "System observed",
  model_generated: "Model generated",
  inference: "Inference",
  hypothesis: "Hypothesis",
  speculation: "Speculation"
};
const recordTypeLabels = {
  claim: "Claim",
  observation: "Observation",
  hypothesis: "Hypothesis",
  prediction: "Prediction",
  decision: "Decision"
};

function safeSourceUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function renderKnowledgeDrafts() {
  knowledgeList.replaceChildren();
  knowledgeEmpty.hidden = knowledgeDrafts.length > 0;
  knowledgeCount.textContent = knowledgeDrafts.length + (knowledgeDrafts.length === 1 ? " ITEM" : " ITEMS");
  knowledgeExport.disabled = knowledgeDrafts.length === 0;

  knowledgeDrafts.forEach((draft) => {
    const card = document.createElement("article");
    card.className = "knowledge-record";
    const top = document.createElement("div");
    top.className = "knowledge-record-top";
    const code = document.createElement("strong");
    code.textContent = draft.code;
    const type = document.createElement("span");
    type.className = "tag";
    type.textContent = recordTypeLabels[draft.kind] + " · " + provenanceLabels[draft.provenance];
    top.append(code, type);

    const claim = document.createElement("p");
    claim.className = "knowledge-claim";
    claim.textContent = draft.claim;
    const evidence = document.createElement("p");
    evidence.className = "knowledge-evidence";
    evidence.textContent = draft.evidence ? "Evidence note: " + draft.evidence : "Evidence: not supplied yet — verification required.";

    card.append(top, claim, evidence);
    const sourceUrl = safeSourceUrl(draft.sourceUrl);
    if (sourceUrl) {
      const source = document.createElement("a");
      source.className = "knowledge-source-link";
      source.href = sourceUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Open source reference ↗";
      card.append(source);
    }
    const status = document.createElement("small");
    status.textContent = "DRAFT · UNASSESSED · SESSION ONLY · " + new Date(draft.createdAt).toLocaleString();
    card.append(status);
    knowledgeList.append(card);
  });
}

if (knowledgeForm) {
  knowledgeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const claim = document.querySelector("#knowledge-claim").value.trim();
    const kind = document.querySelector("#knowledge-kind").value;
    const provenance = document.querySelector("#knowledge-source").value;
    const evidence = document.querySelector("#knowledge-evidence").value.trim();
    const sourceUrlRaw = document.querySelector("#knowledge-url").value.trim();
    const sourceUrl = safeSourceUrl(sourceUrlRaw);
    if (!claim) return;
    if (sourceUrlRaw && !sourceUrl) {
      document.querySelector("#knowledge-url").setCustomValidity("Use a valid http or https URL.");
      document.querySelector("#knowledge-url").reportValidity();
      return;
    }
    document.querySelector("#knowledge-url").setCustomValidity("");

    // Temporary visual identifier only; the permanent code is assigned by the future server.
    const code = "DRAFT-" + String(knowledgeDrafts.length + 1).padStart(3, "0");
    knowledgeDrafts.unshift({
      code, kind, claim, provenance, evidence, sourceUrl,
      assessment: "unassessed",
      createdAt: new Date().toISOString()
    });
    renderKnowledgeDrafts();
    knowledgeForm.reset();
    document.querySelector("#knowledge-claim").focus();
  });
}

if (knowledgeExport) {
  knowledgeExport.addEventListener("click", () => {
    if (!knowledgeDrafts.length) return;
    const payload = {
      exportType: "cosmo-knowledge-engine-session-drafts",
      schemaVersion: "1.0",
      exportedAt: new Date().toISOString(),
      warning: "These are unverified session drafts, not permanent Cosmo records.",
      records: knowledgeDrafts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cosmo-knowledge-drafts.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}


// Memory Vault interface prototype. All data remains in this page session only.
const memoryForm = document.querySelector("#memory-form");
const historyForm = document.querySelector("#history-form");
const memoryList = document.querySelector("#memory-list");
const historyList = document.querySelector("#history-list");
const memoryEmpty = document.querySelector("#memory-empty");
const historyEmpty = document.querySelector("#history-empty");
const memoryCount = document.querySelector("#memory-count");
const historyCount = document.querySelector("#history-count");
const historyMemoryLink = document.querySelector("#history-memory-link");
const vaultSearch = document.querySelector("#vault-search");
const vaultExport = document.querySelector("#vault-export");
const memoryDrafts = [];
const historyDrafts = [];

function makeVaultCode(prefix, count) {
  return "DRAFT-" + prefix + "-" + String(count).padStart(3, "0");
}

function addTextElement(parent, tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function updateMemoryLinkOptions() {
  const selected = historyMemoryLink.value;
  historyMemoryLink.replaceChildren();
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "No memory link yet";
  historyMemoryLink.append(none);
  memoryDrafts.forEach((memory) => {
    const option = document.createElement("option");
    option.value = memory.code;
    option.textContent = memory.code + " · " + memory.title;
    historyMemoryLink.append(option);
  });
  if (memoryDrafts.some((memory) => memory.code === selected)) historyMemoryLink.value = selected;
  if (window.cosmoRefreshRelationshipChoices) window.cosmoRefreshRelationshipChoices();
}

function renderVault() {
  const term = (vaultSearch.value || "").trim().toLowerCase();
  memoryList.replaceChildren();
  historyList.replaceChildren();

  const visibleMemories = memoryDrafts.filter((item) =>
    [item.code, item.title, item.summary, item.category, item.classification].join(" ").toLowerCase().includes(term)
  );
  const visibleHistory = historyDrafts.filter((item) =>
    [item.code, item.title, item.content, item.sourceType, item.memoryCode].join(" ").toLowerCase().includes(term)
  );

  memoryEmpty.hidden = visibleMemories.length > 0;
  historyEmpty.hidden = visibleHistory.length > 0;
  memoryCount.textContent = memoryDrafts.length + " DRAFTS";
  historyCount.textContent = historyDrafts.length + " DRAFTS";
  vaultExport.disabled = memoryDrafts.length + historyDrafts.length === 0;

  visibleMemories.forEach((item) => {
    const card = document.createElement("article");
    card.className = "vault-record";
    const head = document.createElement("div");
    head.className = "knowledge-record-top";
    addTextElement(head, "strong", "", item.code);
    addTextElement(head, "span", "tag", item.category + " · " + item.classification);
    card.append(head);
    addTextElement(card, "h4", "vault-record-title", item.title);
    addTextElement(card, "p", "knowledge-evidence", item.summary);
    const linked = historyDrafts.filter((source) => source.memoryCode === item.code);
    addTextElement(card, "small", "", "DRAFT · SESSION ONLY · " + linked.length + " LINKED SOURCE(S)");
    memoryList.append(card);
  });

  visibleHistory.forEach((item) => {
    const card = document.createElement("article");
    card.className = "vault-record";
    const head = document.createElement("div");
    head.className = "knowledge-record-top";
    addTextElement(head, "strong", "", item.code);
    addTextElement(head, "span", "tag", item.sourceType);
    card.append(head);
    addTextElement(card, "h4", "vault-record-title", item.title);
    addTextElement(card, "p", "knowledge-evidence", item.content);
    addTextElement(card, "small", "", "LINKED MEMORY: " + (item.memoryCode || "NONE") + " · SESSION ONLY");
    historyList.append(card);
  });
}

if (memoryForm && historyForm) {
  memoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#memory-title").value.trim();
    const summary = document.querySelector("#memory-summary").value.trim();
    if (!title || !summary) return;
    memoryDrafts.unshift({
      code: makeVaultCode("MEM", memoryDrafts.length + 1),
      title,
      summary,
      category: document.querySelector("#memory-category").value,
      classification: document.querySelector("#memory-classification").value,
      createdAt: new Date().toISOString(),
      version: 1
    });
    updateMemoryLinkOptions();
    renderVault();
    memoryForm.reset();
    document.querySelector("#memory-title").focus();
  });

  historyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#history-title").value.trim();
    const content = document.querySelector("#history-content").value.trim();
    if (!title || !content) return;
    historyDrafts.unshift({
      code: makeVaultCode("HIS", historyDrafts.length + 1),
      title,
      content,
      sourceType: document.querySelector("#history-type").value,
      memoryCode: historyMemoryLink.value,
      createdAt: new Date().toISOString(),
      version: 1
    });
    renderVault();
    historyForm.reset();
  });
}

if (vaultSearch) vaultSearch.addEventListener("input", renderVault);

if (vaultExport) {
  vaultExport.addEventListener("click", () => {
    if (!memoryDrafts.length && !historyDrafts.length) return;
    const bundle = {
      exportType: "cosmo-memory-history-session-drafts",
      schemaVersion: "1.0",
      exportedAt: new Date().toISOString(),
      warning: "Temporary, unverified session drafts only. Not permanent records or a backup.",
      mainMemories: memoryDrafts,
      masterHistory: historyDrafts
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cosmo-memory-history-drafts.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}


// Memory Relationship Engine v1 prototype.
// Relationships are explicit session-only assertions; they never determine truth automatically.
(() => {
  const relationForm = document.querySelector("#relationship-form");
  if (!relationForm) return;
  const fromSelect = document.querySelector("#relationship-from");
  const toSelect = document.querySelector("#relationship-to");
  const typeSelect = document.querySelector("#relationship-type");
  const noteInput = document.querySelector("#relationship-note");
  const relationList = document.querySelector("#relationship-list");
  const relationEmpty = document.querySelector("#relationship-empty");
  const relationCount = document.querySelector("#relationship-count");
  const relationAudit = document.querySelector("#relationship-audit");
  const relationExport = document.querySelector("#relationship-export");
  const relationships = [];

  const labels = {
    supports: "Supports", contradicts: "Contradicts", refines: "Refines / adds detail",
    supersedes: "Supersedes / replaces guidance", duplicate_of: "Possible duplicate of",
    depends_on: "Depends on", related_to: "Related to", derived_from: "Derived from"
  };
  const memoryByCode = (code) => memoryDrafts.find((memory) => memory.code === code);

  function fillMemoryChoices() {
    const priorFrom = fromSelect.value;
    const priorTo = toSelect.value;
    [fromSelect, toSelect].forEach((select, index) => {
      select.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = memoryDrafts.length < 2 ? "Create at least two memories" : "Choose a memory";
      select.append(placeholder);
      memoryDrafts.forEach((memory) => {
        const option = document.createElement("option");
        option.value = memory.code;
        option.textContent = memory.code + " · " + memory.title;
        select.append(option);
      });
      select.value = index === 0 ? priorFrom : priorTo;
    });
    relationForm.querySelector('button[type="submit"]').disabled = memoryDrafts.length < 2;
  }

  function auditRelationships() {
    const broken = relationships.filter((link) => !memoryByCode(link.fromCode) || !memoryByCode(link.toCode));
    const contradictions = relationships.filter((link) => link.type === "contradicts");
    const duplicates = relationships.filter((link) => link.type === "duplicate_of");
    const duplicatePairs = relationships.filter((link, index) =>
      relationships.findIndex((other) => other.fromCode === link.fromCode && other.toCode === link.toCode && other.type === link.type) !== index
    );
    relationAudit.replaceChildren();
    const summary = document.createElement("p");
    summary.textContent = relationships.length + " link(s) · " + contradictions.length + " contradiction(s) · " + duplicates.length + " possible duplicate(s) · " + broken.length + " broken reference(s) · " + duplicatePairs.length + " repeated link(s).";
    relationAudit.append(summary);
    const detail = document.createElement("small");
    detail.textContent = broken.length ? "Integrity warning: one or more links point to missing memory codes." : "Integrity check: every relationship currently points to an existing memory draft. This is a local demo check, not a server audit.";
    relationAudit.append(detail);
  }

  function renderRelationships() {
    relationList.replaceChildren();
    relationCount.textContent = relationships.length + (relationships.length === 1 ? " LINK" : " LINKS");
    relationEmpty.hidden = relationships.length > 0;
    relationExport.disabled = relationships.length === 0;
    relationships.forEach((link) => {
      const from = memoryByCode(link.fromCode);
      const to = memoryByCode(link.toCode);
      const card = document.createElement("article");
      card.className = "relationship-record";
      const head = document.createElement("div");
      head.className = "knowledge-record-top";
      const code = document.createElement("strong");
      code.textContent = link.code;
      const kind = document.createElement("span");
      kind.className = "tag " + (link.type === "contradicts" ? "tag-warning" : "");
      kind.textContent = labels[link.type];
      head.append(code, kind);
      const path = document.createElement("p");
      path.className = "relationship-path";
      path.textContent = (from ? from.title : "MISSING: " + link.fromCode) + "  →  " + (to ? to.title : "MISSING: " + link.toCode);
      const refs = document.createElement("small");
      refs.textContent = link.fromCode + " → " + link.toCode + " · " + new Date(link.createdAt).toLocaleString();
      const note = document.createElement("p");
      note.className = "knowledge-evidence";
      note.textContent = link.note || "No reason/evidence note supplied.";
      card.append(head, path, refs, note);
      relationList.append(card);
    });
    auditRelationships();
  }

  relationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fromCode = fromSelect.value;
    const toCode = toSelect.value;
    if (!memoryByCode(fromCode) || !memoryByCode(toCode)) {
      relationAudit.textContent = "Choose two existing memory drafts before recording a link.";
      return;
    }
    if (fromCode === toCode) {
      relationAudit.textContent = "A memory cannot be linked to itself in this prototype.";
      return;
    }
    const type = typeSelect.value;
    if (relationships.some((link) => link.fromCode === fromCode && link.toCode === toCode && link.type === type)) {
      relationAudit.textContent = "That exact directed relationship already exists. Review the existing link instead of creating a duplicate.";
      return;
    }
    relationships.unshift({
      code: "DRAFT-REL-" + String(relationships.length + 1).padStart(3, "0"),
      fromCode, toCode, type, note: noteInput.value.trim(),
      createdAt: new Date().toISOString(),
      assessment: "unreviewed"
    });
    renderRelationships();
    noteInput.value = "";
  });

  relationExport.addEventListener("click", () => {
    if (!relationships.length) return;
    const payload = {
      exportType: "cosmo-memory-relationships-session-drafts",
      schemaVersion: "1.0",
      exportedAt: new Date().toISOString(),
      warning: "Session-only relationship assertions. Not permanent records, verified truth, or a backup.",
      relationships
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cosmo-memory-relationships-drafts.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  // Memory Versioning & Contradiction Review v1 — session-only governance workflow.
  const versionForm = document.querySelector("#memory-version-form");
  const versionMemory = document.querySelector("#version-memory");
  const timelineMemory = document.querySelector("#version-timeline-memory");
  const timeline = document.querySelector("#version-timeline");
  const versionCount = document.querySelector("#version-count");
  const contradictionQueue = document.querySelector("#contradiction-queue");
  const contradictionCount = document.querySelector("#contradiction-count");

  function ensureVersionHistory(memory) {
    if (!memory.versions) memory.versions = [{
      version: 1, summary: memory.summary, reason: "Initial memory draft",
      basis: "initial_capture", createdAt: memory.createdAt, reviewStatus: "unreviewed"
    }];
  }
  function populateVersionChoices() {
    const selectedEdit = versionMemory.value;
    const selectedTimeline = timelineMemory.value;
    [versionMemory, timelineMemory].forEach((select) => {
      select.replaceChildren();
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = memoryDrafts.length ? "Choose a memory" : "Create a memory first";
      select.append(placeholder);
      memoryDrafts.forEach((memory) => {
        const option = document.createElement("option");
        option.value = memory.code;
        option.textContent = memory.code + " · " + memory.title;
        select.append(option);
      });
    });
    versionMemory.value = memoryDrafts.some((m) => m.code === selectedEdit) ? selectedEdit : "";
    timelineMemory.value = memoryDrafts.some((m) => m.code === selectedTimeline) ? selectedTimeline : "";
    versionForm.querySelector('button[type="submit"]').disabled = memoryDrafts.length === 0;
  }
  function renderTimeline() {
    timeline.replaceChildren();
    const memory = memoryByCode(timelineMemory.value);
    if (!memory) {
      const empty = document.createElement("p"); empty.className = "knowledge-empty";
      empty.textContent = "Choose a memory to inspect its version history."; timeline.append(empty);
      versionCount.textContent = "0 VERSIONS"; return;
    }
    ensureVersionHistory(memory);
    versionCount.textContent = memory.versions.length + (memory.versions.length === 1 ? " VERSION" : " VERSIONS");
    [...memory.versions].reverse().forEach((version) => {
      const card = document.createElement("article"); card.className = "version-item";
      const head = document.createElement("div"); head.className = "knowledge-record-top";
      const label = document.createElement("strong"); label.textContent = "VERSION " + version.version;
      const status = document.createElement("span"); status.className = "tag"; status.textContent = version.reviewStatus.toUpperCase();
      head.append(label, status);
      const summary = document.createElement("p"); summary.className = "knowledge-claim"; summary.textContent = version.summary;
      const reason = document.createElement("p"); reason.className = "knowledge-evidence"; reason.textContent = "Change reason: " + version.reason + " · Basis: " + version.basis.replaceAll("_", " ");
      const date = document.createElement("small"); date.textContent = new Date(version.createdAt).toLocaleString();
      card.append(head, summary, reason, date); timeline.append(card);
    });
  }
  function renderContradictionQueue() {
    contradictionQueue.replaceChildren();
    const conflicts = relationships.filter((link) => link.type === "contradicts");
    const open = conflicts.filter((link) => !link.review || link.review.status === "open");
    contradictionCount.textContent = open.length + " OPEN";
    if (!conflicts.length) {
      const empty = document.createElement("p"); empty.className = "knowledge-empty";
      empty.textContent = "No contradiction links to review yet."; contradictionQueue.append(empty); return;
    }
    conflicts.forEach((link) => {
      const left = memoryByCode(link.fromCode), right = memoryByCode(link.toCode);
      const card = document.createElement("article"); card.className = "contradiction-item";
      const heading = document.createElement("div"); heading.className = "knowledge-record-top";
      const code = document.createElement("strong"); code.textContent = link.code;
      const status = document.createElement("span"); status.className = "tag tag-warning";
      status.textContent = link.review ? link.review.status.replaceAll("_", " ").toUpperCase() : "OPEN";
      heading.append(code, status);
      const pair = document.createElement("div"); pair.className = "conflict-pair";
      [[left, link.fromCode], [right, link.toCode]].forEach(([memory, fallback]) => {
        const side = document.createElement("div");
        const title = document.createElement("strong"); title.textContent = memory ? memory.title : "Missing " + fallback;
        const body = document.createElement("p"); body.textContent = memory ? memory.summary : "Referenced memory is unavailable.";
        side.append(title, body); pair.append(side);
      });
      const note = document.createElement("p"); note.className = "knowledge-evidence";
      note.textContent = "Original link rationale: " + (link.note || "Not supplied.");
      const controls = document.createElement("div"); controls.className = "review-controls";
      const select = document.createElement("select"); select.className = "review-select";
      [["open","Keep open"],["confirmed_conflict","Confirmed conflict"],["resolved_evidence","Resolved by evidence"],["not_a_conflict","Not a contradiction"],["needs_more_evidence","Needs more evidence"]].forEach(([value,label]) => {
        const option = document.createElement("option"); option.value = value; option.textContent = label; select.append(option);
      });
      select.value = link.review ? link.review.status : "open";
      const rationale = document.createElement("textarea"); rationale.rows = 2; rationale.maxLength = 700;
      rationale.placeholder = "Review rationale (required to save an outcome)";
      rationale.value = link.review ? link.review.rationale : "";
      const save = document.createElement("button"); save.type = "button"; save.className = "export-btn"; save.textContent = "Save review";
      save.addEventListener("click", () => {
        const explanation = rationale.value.trim();
        if (!explanation) { rationale.setCustomValidity("Add a review rationale before saving."); rationale.reportValidity(); return; }
        rationale.setCustomValidity("");
        link.review = { status: select.value, rationale: explanation, reviewedAt: new Date().toISOString() };
        renderContradictionQueue(); renderRelationships();
      });
      controls.append(select, rationale, save);
      card.append(heading, pair, note, controls);
      if (link.review) {
        const prior = document.createElement("small");
        prior.textContent = "REVIEWED " + new Date(link.review.reviewedAt).toLocaleString() + " · " + link.review.rationale;
        card.append(prior);
      }
      contradictionQueue.append(card);
    });
  }
  versionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const memory = memoryByCode(versionMemory.value);
    const summary = document.querySelector("#version-summary").value.trim();
    const reason = document.querySelector("#version-reason").value.trim();
    if (!memory || !summary || !reason) return;
    ensureVersionHistory(memory);
    const version = {
      version: memory.versions[memory.versions.length - 1].version + 1,
      summary, reason, basis: document.querySelector("#version-source").value,
      createdAt: new Date().toISOString(), reviewStatus: "unreviewed"
    };
    memory.versions.push(version);
    memory.summary = summary;
    renderVault(); renderTimeline();
    timelineMemory.value = memory.code;
    renderTimeline();
    document.querySelector("#version-summary").value = "";
    document.querySelector("#version-reason").value = "";
    versionForm.reset(); versionMemory.value = memory.code;
  });
  versionMemory.addEventListener("change", () => {
    const memory = memoryByCode(versionMemory.value);
    document.querySelector("#version-summary").value = memory ? memory.summary : "";
  });
  timelineMemory.addEventListener("change", renderTimeline);

  const previousRefresh = window.cosmoRefreshRelationshipChoices;
  window.cosmoRefreshRelationshipChoices = () => {
    if (previousRefresh) previousRefresh();
    populateVersionChoices();
    renderTimeline();
    renderContradictionQueue();
  };
  populateVersionChoices();
  renderTimeline();
  renderContradictionQueue();
  renderRelationships();
  window.cosmoGetRelationshipDrafts = () => relationships;
})();


/* Memory Intelligence & Retrieval Engine v1.
   Transparent keyword retrieval across records currently held in this page session.
   This is not semantic search, persistent indexing, or an AI-generated answer engine. */
(() => {
  const searchForm = document.querySelector("#retrieval-form");
  if (!searchForm) return;
  const queryInput = document.querySelector("#retrieval-query");
  const typeFilter = document.querySelector("#retrieval-type");
  const categoryFilter = document.querySelector("#retrieval-category");
  const summary = document.querySelector("#retrieval-summary");
  const resultsNode = document.querySelector("#retrieval-results");
  const exportButton = document.querySelector("#retrieval-export");
  let lastTrace = null;

  const relationshipsNow = () => typeof window.cosmoGetRelationshipDrafts === "function"
    ? window.cosmoGetRelationshipDrafts() : [];
  const memoryFor = (code) => memoryDrafts.find((item) => item.code === code);
  const text = (value) => String(value == null ? "" : value);
  const normal = (value) => text(value).toLocaleLowerCase();
  const makeResult = (type, code, title, body, meta, searchable, record) => ({
    type, code, title, body, meta, searchable: normal(searchable), record
  });

  function collectRecords() {
    const records = [];
    memoryDrafts.forEach((memory) => {
      const sources = historyDrafts.filter((source) => source.memoryCode === memory.code);
      const links = relationshipsNow().filter((edge) => edge.fromCode === memory.code || edge.toCode === memory.code);
      const versions = memory.versions || [];
      records.push(makeResult(
        "memory", memory.code, memory.title, memory.summary,
        memory.category + " · " + memory.classification + " · CURRENT MEMORY SUMMARY",
        [memory.code,memory.title,memory.summary,memory.category,memory.classification,
          ...versions.map((version) => version.summary),
          ...sources.flatMap((source) => [source.code,source.title,source.content]),
          ...links.map((edge) => [edge.type,edge.note,edge.fromCode,edge.toCode].join(" "))].join(" "),
        { memory, sources, links, versions }
      ));
    });
    historyDrafts.forEach((source) => {
      const linkedMemory = memoryFor(source.memoryCode);
      records.push(makeResult(
        "source", source.code, source.title, source.content,
        source.sourceType + " · ORIGINAL SOURCE DRAFT" + (linkedMemory ? " · LINKED TO " + linkedMemory.code : " · UNLINKED"),
        [source.code,source.title,source.content,source.sourceType,source.memoryCode,
          linkedMemory ? linkedMemory.title + " " + linkedMemory.summary : ""].join(" "),
        { source, linkedMemory }
      ));
    });
    knowledgeDrafts.forEach((claim) => {
      records.push(makeResult(
        "claim", claim.code, recordTypeLabels[claim.kind] + ": " + claim.claim, claim.evidence || "No evidence note supplied.",
        provenanceLabels[claim.provenance] + " · " + claim.assessment.toUpperCase(),
        [claim.code,claim.kind,claim.claim,claim.evidence,claim.provenance,claim.sourceUrl].join(" "),
        { claim }
      ));
    });
    relationshipsNow().forEach((edge) => {
      const from = memoryFor(edge.fromCode), to = memoryFor(edge.toCode);
      records.push(makeResult(
        "relationship", edge.code,
        (from ? from.title : edge.fromCode) + " → " + (to ? to.title : edge.toCode),
        edge.note || "No relationship rationale supplied.",
        edge.type.replaceAll("_", " ") + " · " + (edge.review ? edge.review.status.replaceAll("_", " ") : "unreviewed"),
        [edge.code,edge.type,edge.note,edge.fromCode,edge.toCode,
          from ? from.title + " " + from.summary : "",to ? to.title + " " + to.summary : ""].join(" "),
        { edge, from, to }
      ));
    });
    return records;
  }

  function scoreRecord(record, terms, phrase) {
    const haystack = record.searchable;
    if (!terms.every((term) => haystack.includes(term))) return 0;
    let score = terms.reduce((sum, term) => sum + (haystack.split(term).length - 1), 0);
    if (normal(record.code) === phrase) score += 100;
    if (normal(record.title) === phrase) score += 60;
    if (normal(record.title).includes(phrase)) score += 25;
    if (haystack.includes(phrase)) score += 12;
    if (record.type === "memory") score += 4;
    return score;
  }

  function addDetailLine(parent, label, value) {
    const line = document.createElement("p");
    line.className = "retrieval-detail-line";
    const strong = document.createElement("strong"); strong.textContent = label + ": ";
    line.append(strong, document.createTextNode(text(value) || "Not recorded"));
    parent.append(line);
  }

  function buildTraceDetails(result) {
    const detail = document.createElement("div");
    detail.className = "retrieval-detail";
    if (result.type === "memory") {
      const { memory, sources, links, versions } = result.record;
      addDetailLine(detail, "Memory code", memory.code);
      addDetailLine(detail, "Category / access class", memory.category + " / " + memory.classification);
      addDetailLine(detail, "Created", memory.createdAt);
      addDetailLine(detail, "Version count", versions.length || 1);
      addDetailLine(detail, "Current version", versions.length ? versions[versions.length - 1].version : 1);
      addDetailLine(detail, "Provenance", "Memory draft summary; consult linked original source records before treating as verified.");
      const sourceHeading = document.createElement("strong"); sourceHeading.textContent = "Linked original sources"; detail.append(sourceHeading);
      if (!sources.length) addTextElement(detail, "p", "retrieval-detail-line", "No Master History source is linked to this memory yet.");
      sources.forEach((source) => addTextElement(detail, "p", "retrieval-detail-line", source.code + " · " + source.title + " · " + source.sourceType));
      const linkHeading = document.createElement("strong"); linkHeading.textContent = "Relationship context"; detail.append(linkHeading);
      if (!links.length) addTextElement(detail, "p", "retrieval-detail-line", "No relationship edges recorded.");
      links.forEach((edge) => addTextElement(detail, "p", "retrieval-detail-line", edge.code + " · " + edge.fromCode + " → " + edge.toCode + " · " + edge.type));
      if (versions.length) {
        const versionHeading = document.createElement("strong"); versionHeading.textContent = "Version snapshots"; detail.append(versionHeading);
        versions.forEach((version) => addTextElement(detail, "p", "retrieval-detail-line", "v" + version.version + " · " + version.createdAt + " · " + version.reason));
      }
    } else if (result.type === "source") {
      const { source, linkedMemory } = result.record;
      addDetailLine(detail, "Source code", source.code);
      addDetailLine(detail, "Source type", source.sourceType);
      addDetailLine(detail, "Captured", source.createdAt);
      addDetailLine(detail, "Original content", source.content);
      addDetailLine(detail, "Linked memory", linkedMemory ? linkedMemory.code + " · " + linkedMemory.title : "No memory link");
      addDetailLine(detail, "Provenance", "User-entered source draft; authenticity and completeness are not independently verified.");
    } else if (result.type === "claim") {
      const claim = result.record.claim;
      addDetailLine(detail, "Record type", claim.kind);
      addDetailLine(detail, "Provenance", provenanceLabels[claim.provenance]);
      addDetailLine(detail, "Assessment", claim.assessment);
      addDetailLine(detail, "Captured", claim.createdAt);
      addDetailLine(detail, "Evidence note", claim.evidence || "None supplied");
      if (claim.sourceUrl) {
        const url = safeSourceUrl(claim.sourceUrl);
        if (url) {
          const anchor = document.createElement("a"); anchor.className = "knowledge-source-link";
          anchor.href = url; anchor.target = "_blank"; anchor.rel = "noopener noreferrer";
          anchor.textContent = "Open recorded source URL ↗"; detail.append(anchor);
        }
      }
      addDetailLine(detail, "Verification", "Unassessed draft; source note is not independent verification.");
    } else {
      const edge = result.record.edge;
      addDetailLine(detail, "Relationship", edge.type);
      addDetailLine(detail, "From / to", edge.fromCode + " → " + edge.toCode);
      addDetailLine(detail, "Created", edge.createdAt);
      addDetailLine(detail, "Review status", edge.review ? edge.review.status : "unreviewed");
      addDetailLine(detail, "Review rationale", edge.review ? edge.review.rationale : "No review recorded");
      addDetailLine(detail, "Interpretation", "Relationship is a recorded assertion, not proof that either endpoint is true.");
    }
    return detail;
  }

  function runSearch() {
    const phrase = normal(queryInput.value.trim());
    if (!phrase) return;
    const terms = [...new Set(phrase.split(/\s+/).filter((term) => term.length > 1))];
    const tokens = terms.length ? terms : [phrase];
    const all = collectRecords();
    const selectedType = typeFilter.value;
    const category = categoryFilter.value;
    const eligible = all.filter((record) => {
      if (selectedType !== "all" && record.type !== selectedType) return false;
      if (category !== "all" && (record.type !== "memory" || record.record.memory.category !== category)) return false;
      return true;
    });
    const matches = eligible.map((record) => ({ record, score: scoreRecord(record, tokens, phrase) }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || left.record.code.localeCompare(right.record.code));
    lastTrace = {
      exportType: "cosmo-memory-retrieval-trace",
      schemaVersion: "1.0",
      createdAt: new Date().toISOString(),
      query: queryInput.value.trim(),
      method: "case-insensitive keyword and phrase matching; all query terms required",
      filters: { recordType: selectedType, memoryCategory: category },
      counts: { scanned: eligible.length, matched: matches.length },
      warning: "Session-only retrieval trace. Keyword relevance is not truth, verification, semantic understanding or a complete archive.",
      results: matches.map(({ record, score }) => ({
        code: record.code, type: record.type, title: record.title, score,
        meta: record.meta, body: record.body
      }))
    };
    summary.textContent = "Search trace · " + eligible.length + " eligible record(s) scanned · " + matches.length +
      " match(es) · keyword method · all terms required. " +
      (matches.length ? "Open a trace to inspect sources and relationships." : "No matching records in the current session.");
    resultsNode.replaceChildren();
    if (!matches.length) {
      addTextElement(resultsNode, "div", "knowledge-empty", "No matches found. Try a shorter phrase, a record code, or broaden the record-type filter.");
    }
    matches.forEach(({ record, score }) => {
      const card = document.createElement("article"); card.className = "retrieval-result";
      const head = document.createElement("div"); head.className = "knowledge-record-top";
      addTextElement(head, "strong", "", record.code);
      addTextElement(head, "span", "tag", record.type.toUpperCase() + " · SCORE " + score);
      const title = addTextElement(card, "h4", "retrieval-result-title", record.title);
      const body = addTextElement(card, "p", "knowledge-evidence", record.body);
      const meta = addTextElement(card, "small", "retrieval-meta", record.meta);
      const toggle = document.createElement("button"); toggle.type = "button"; toggle.className = "export-btn";
      toggle.textContent = "Show provenance & trace";
      const detail = buildTraceDetails(record); detail.hidden = true;
      toggle.addEventListener("click", () => {
        detail.hidden = !detail.hidden;
        toggle.textContent = detail.hidden ? "Show provenance & trace" : "Hide provenance & trace";
      });
      card.prepend(head); card.append(title, body, meta, toggle, detail);
      resultsNode.append(card);
    });
    exportButton.disabled = false;
  }

  searchForm.addEventListener("submit", (event) => { event.preventDefault(); runSearch(); });
  typeFilter.addEventListener("change", () => { if (queryInput.value.trim()) runSearch(); });
  categoryFilter.addEventListener("change", () => { if (queryInput.value.trim()) runSearch(); });
  exportButton.addEventListener("click", () => {
    if (!lastTrace) return;
    const blob = new Blob([JSON.stringify(lastTrace, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url;
    link.download = "cosmo-memory-retrieval-trace.json";
    document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  });
})();


// Adaptive Learning & Preference Engine v1 — governed, session-only preference and feedback capture.
(() => {
  const preferenceForm = document.querySelector("#preference-form");
  if (!preferenceForm) return;
  const feedbackForm = document.querySelector("#learning-feedback-form");
  const agentSelect = document.querySelector("#feedback-agent");
  const recordsNode = document.querySelector("#adaptive-records");
  const countNode = document.querySelector("#adaptive-count");
  const exportButton = document.querySelector("#adaptive-export");
  const methodsNode = document.querySelector("#learning-method-list");
  const profiles = [];
  const feedbackEvents = [];
  const methods = [
    ["Explicit preference learning","Use direct user instructions as the strongest preference signal; ask before interpreting ambiguity.","User-approved settings; never override safety policy."],
    ["Supervised learning","Learn from labelled examples and corrections with known target outcomes.","Requires lawful, consented datasets, quality labels and evaluation."],
    ["Feedback / preference learning","Use ratings, comparisons and corrections to propose better responses.","Keep task feedback separate from durable profile changes."],
    ["Contextual adaptation","Adapt to task, time, device, environment, role and current constraints.","Context is temporary unless the user approves saving it."],
    ["Online / incremental learning","Update a bounded preference estimate as new feedback arrives.","Use drift checks, rollback and human review; no silent model updates."],
    ["Active learning","Ask the user the most useful clarifying question when uncertainty matters.","Minimise interruptions; never infer sensitive traits."],
    ["Unsupervised pattern discovery","Find recurring patterns, clusters and possible duplicates in authorised data.","Patterns are hypotheses, not facts or user preferences."],
    ["Semi-supervised learning","Combine limited human labels with larger unlabelled datasets.","Track label origin and uncertainty; validate before use."],
    ["Transfer learning","Reuse general capabilities across tasks without copying private profile data.","Transfer only approved, non-sensitive capability; isolate user memory."],
    ["Few-shot / in-context learning","Use a small set of approved examples within the current task or session.","Context examples are not permanent training."],
    ["Meta-learning","Evaluate which learning strategy works best for a task or user-approved profile.","Requires comparative tests; do not assume a universal best method."],
    ["Reinforcement learning","Optimise actions against explicit reward and constraint models in simulation or safe sandboxes.","Never trial-and-error on live safety-critical, medical, financial or physical controls."],
    ["Imitation / demonstration learning","Learn task patterns from user demonstrations and approved workflows.","Require permission, provenance and a way to correct demonstrations."],
    ["Retrieval-augmented learning","Retrieve approved memories and sources to ground current responses.","Retrieval is not model-weight training; cite source records."],
    ["Multi-agent / collaborative learning","Let specialist agents exchange scoped findings and lessons through shared contracts.","No unrestricted profile sharing; enforce workspace and field-level permissions."],
    ["Outcome and prediction learning","Compare predictions with verified outcomes and evaluate calibration over time.","Score only after outcome verification; preserve the original forecast."],
    ["Continual learning governance","Monitor drift, regressions, stale preferences, forgetting and rollback.","Version datasets, prompts, adapters and policies; retain evaluation baselines."]
  ];
  methods.forEach(([name,description,guard]) => {
    const item = document.createElement("article"); item.className = "learning-method";
    const title = document.createElement("strong"); title.textContent = name;
    const detail = document.createElement("p"); detail.textContent = description;
    const boundary = document.createElement("small"); boundary.textContent = guard;
    item.append(title,detail,boundary); methodsNode.append(item);
  });
  function populateAgents() {
    const selected = agentSelect.value;
    agentSelect.replaceChildren();
    const placeholder = document.createElement("option"); placeholder.value = "";
    placeholder.textContent = profiles.length ? "Choose a profile" : "Create a preference profile first";
    agentSelect.append(placeholder);
    profiles.forEach((profile) => {
      const option = document.createElement("option");
      option.value = profile.code; option.textContent = profile.agent;
      agentSelect.append(option);
    });
    if (profiles.some((profile) => profile.code === selected)) agentSelect.value = selected;
  }
  function render() {
    recordsNode.replaceChildren();
    countNode.textContent = (profiles.length + feedbackEvents.length) + " RECORDS";
    exportButton.disabled = profiles.length + feedbackEvents.length === 0;
    if (!profiles.length && !feedbackEvents.length) {
      const empty = document.createElement("p"); empty.className = "knowledge-empty";
      empty.textContent = "No preference or feedback drafts yet."; recordsNode.append(empty); return;
    }
    profiles.forEach((profile) => {
      const card = document.createElement("article"); card.className = "adaptive-record";
      const head = document.createElement("div"); head.className = "knowledge-record-top";
      addTextElement(head,"strong","","" + profile.code + " · " + profile.agent);
      addTextElement(head,"span","tag",profile.source.replaceAll("_"," ") + " · " + profile.consent.replaceAll("_"," "));
      addTextElement(card,"p","knowledge-evidence","Style: " + profile.communication + " · Detail: " + profile.detail + " · Pace: " + profile.pace + " · Initiative: " + profile.initiative);
      addTextElement(card,"p","knowledge-evidence","Interests/context: " + (profile.interests || "Not supplied"));
      addTextElement(card,"p","knowledge-evidence","Avoid/handle carefully: " + (profile.avoid || "Not supplied"));
      card.append(head); recordsNode.append(card);
    });
    feedbackEvents.forEach((event) => {
      const card = document.createElement("article"); card.className = "adaptive-record";
      const head = document.createElement("div"); head.className = "knowledge-record-top";
      addTextElement(head,"strong","",event.code + " · " + event.agent);
      addTextElement(head,"span","tag","RATING " + event.rating + "/5 · " + event.outcome.replaceAll("_"," "));
      card.append(head);
      addTextElement(card,"p","knowledge-claim",event.task);
      addTextElement(card,"p","knowledge-evidence",event.lesson);
      addTextElement(card,"small","", "Scope: " + event.scope.replaceAll("_"," ") + " · Candidate only · " + event.createdAt);
      recordsNode.append(card);
    });
  }
  preferenceForm.addEventListener("submit",(event) => {
    event.preventDefault();
    const agent = document.querySelector("#preference-agent").value.trim();
    if (!agent) return;
    const profile = {
      code:"DRAFT-PREF-" + String(profiles.length+1).padStart(3,"0"),
      agent, communication:document.querySelector("#preference-communication").value,
      detail:document.querySelector("#preference-detail").value,
      pace:document.querySelector("#preference-pace").value,
      initiative:document.querySelector("#preference-initiative").value,
      interests:document.querySelector("#preference-interests").value.trim(),
      avoid:document.querySelector("#preference-avoid").value.trim(),
      source:document.querySelector("#preference-source").value,
      consent:document.querySelector("#preference-consent").value,
      createdAt:new Date().toISOString()
    };
    profiles.push(profile); populateAgents(); agentSelect.value = profile.code;
    render(); preferenceForm.reset();
  });
  feedbackForm.addEventListener("submit",(event) => {
    event.preventDefault();
    const profile = profiles.find((item) => item.code === agentSelect.value);
    const task = document.querySelector("#feedback-task").value.trim();
    const lesson = document.querySelector("#feedback-note").value.trim();
    if (!profile || !task || !lesson) return;
    feedbackEvents.unshift({
      code:"DRAFT-FEEDBACK-" + String(feedbackEvents.length+1).padStart(3,"0"),
      profileCode:profile.code,agent:profile.agent,task,
      rating:Number(document.querySelector("#feedback-rating").value),
      outcome:document.querySelector("#feedback-outcome").value,
      lesson,scope:document.querySelector("#feedback-consent").value,
      createdAt:new Date().toISOString(),status:"candidate_only"
    });
    render(); feedbackForm.reset(); agentSelect.value = profile.code;
  });
  exportButton.addEventListener("click",() => {
    const payload = {
      exportType:"cosmo-adaptive-learning-session-drafts",schemaVersion:"1.0",
      exportedAt:new Date().toISOString(),
      warning:"Session-only preference and feedback drafts. Not permanent profile data, model training or a backup.",
      profiles,feedbackEvents,learningMethods:methods.map(([name,description,guard])=>({name,description,guard}))
    };
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
    const link=document.createElement("a");link.href=url;link.download="cosmo-adaptive-learning-drafts.json";
    document.body.append(link);link.click();link.remove();URL.revokeObjectURL(url);
  });
})();
