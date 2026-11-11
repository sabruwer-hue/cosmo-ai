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

  // Refresh endpoint choices whenever a memory is added.
  const originalUpdateOptions = updateMemoryLinkOptions;
  window.cosmoRefreshRelationshipChoices = fillMemoryChoices;
  fillMemoryChoices();
  renderRelationships();
})();
