(() => {
  const SUPABASE_URL = "https://yevkzktlzxjrlvsxtnez.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8TCKfyaRJwbvqY8kdn8nTA_KvlslawM";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  let activeConversationId = null;
  let sending = false;

  const overlay = document.querySelector("#cosmo-auth-overlay");
  const authForm = document.querySelector("#cosmo-auth-form");
  const authEmail = document.querySelector("#cosmo-auth-email");
  const authStatus = document.querySelector("#cosmo-auth-status");
  const signOut = document.querySelector("#cosmo-signout");
  const promptForm = document.querySelector("#prompt-form");
  const promptBox = document.querySelector("#prompt");
  const responseBox = document.querySelector("#response");
  const sendButton = promptForm?.querySelector('button[type="submit"]');

  function showStatus(target, message, isError = false) {
    if (!target) return;
    target.textContent = message;
    target.dataset.state = isError ? "error" : "ok";
  }

  function addResponse(label, content) {
    responseBox.hidden = false;
    const item = document.createElement("div");
    item.className = "cosmo-chat-item";
    const heading = document.createElement("strong");
    heading.textContent = label;
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    item.append(heading, paragraph);
    responseBox.append(item);
  }

  async function setSession(session) {
    const authenticated = Boolean(session?.user);
    overlay.hidden = authenticated;
    document.body.classList.toggle("cosmo-authenticated", authenticated);
    if (signOut) signOut.hidden = !authenticated;
    const pill = document.querySelector(".demo-pill");
    if (pill && authenticated) {
      pill.textContent = "PRIVATE SESSION";
      pill.classList.add("private-pill");
    }
    if (authenticated) {
      const user = session.user;
      await client.from("cosmo_profiles").upsert({
        user_id: user.id,
        display_name: user.user_metadata?.full_name || "Fanus"
      }, { onConflict: "user_id" });
      showStatus(authStatus, "Signed in. Cosmo's private workspace is unlocked.");
    }
  }

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = authEmail.value.trim();
    if (!email) return;
    const submit = authForm.querySelector("button[type='submit']");
    submit.disabled = true;
    showStatus(authStatus, "Sending your secure sign-in link…");
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname, shouldCreateUser: false }
    });
    submit.disabled = false;
    if (error) {
      showStatus(authStatus, error.message, true);
      return;
    }
    showStatus(authStatus, "Check your email for Cosmo's sign-in link. Open it on this device to continue.");
  });

  signOut?.addEventListener("click", async () => {
    await client.auth.signOut();
    activeConversationId = null;
    await setSession(null);
  });

  promptForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (sending) return;
    const message = promptBox.value.trim();
    if (!message) {
      promptBox.focus();
      return;
    }
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) {
      await setSession(null);
      showStatus(authStatus, "Please sign in before speaking with Cosmo.", true);
      return;
    }

    sending = true;
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.textContent = "Thinking…";
    }
    addResponse("YOU", message);
    promptBox.value = "";
    try {
      const { data, error } = await client.functions.invoke("cosmo-chat", {
        body: { message, conversationId: activeConversationId }
      });
      if (error) {
        let detail = error.message || "Cosmo could not complete the request.";
        try {
          const payload = await error.context?.json?.();
          if (payload?.error) detail = payload.error;
        } catch (_) {}
        addResponse("COSMO · CONNECTION NOTICE", detail);
      } else {
        activeConversationId = data.conversationId;
        addResponse("COSMO", data.answer);
      }
    } catch (error) {
      addResponse("COSMO · CONNECTION NOTICE", error.message || "The request could not reach Cosmo's server.");
    } finally {
      sending = false;
      if (sendButton) {
        sendButton.disabled = false;
        sendButton.innerHTML = 'Send <b>↗</b>';
      }
    }
  }, true);

  client.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  client.auth.getSession().then(({ data }) => setSession(data.session));
})();