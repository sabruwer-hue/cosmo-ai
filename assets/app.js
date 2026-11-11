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

function renderKnowledgeDrafts() {
  knowledgeList.replaceChildren();
  knowledgeEmpty.hidden = knowledgeDrafts.length > 0;
  knowledgeCount.textContent = knowledgeDrafts.length + (knowledgeDrafts.length === 1 ? " ITEM" : " ITEMS");

  knowledgeDrafts.forEach((draft) => {
    const card = document.createElement("article");
    card.className = "knowledge-record";

    const top = document.createElement("div");
    top.className = "knowledge-record-top";
    const code = document.createElement("strong");
    code.textContent = draft.code;
    const type = document.createElement("span");
    type.className = "tag";
    type.textContent = provenanceLabels[draft.provenance];
    top.append(code, type);

    const claim = document.createElement("p");
    claim.className = "knowledge-claim";
    claim.textContent = draft.claim;

    const evidence = document.createElement("p");
    evidence.className = "knowledge-evidence";
    evidence.textContent = draft.evidence ? "Evidence note: " + draft.evidence : "Evidence: not supplied yet — verification required.";

    const status = document.createElement("small");
    status.textContent = "DRAFT · Not verified · Session only";

    card.append(top, claim, evidence, status);
    knowledgeList.append(card);
  });
}

if (knowledgeForm) {
  knowledgeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const claim = document.querySelector("#knowledge-claim").value.trim();
    const provenance = document.querySelector("#knowledge-source").value;
    const evidence = document.querySelector("#knowledge-evidence").value.trim();
    if (!claim) return;

    // These temporary labels are visual session identifiers, not permanent Cosmo record codes.
    const code = "DRAFT-" + String(knowledgeDrafts.length + 1).padStart(3, "0");
    knowledgeDrafts.unshift({ code, claim, provenance, evidence });
    renderKnowledgeDrafts();
    knowledgeForm.reset();
    document.querySelector("#knowledge-claim").focus();
  });
}
