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