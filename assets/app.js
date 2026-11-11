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
