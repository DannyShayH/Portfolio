(() => {
  "use strict";

  const root = document.querySelector("[data-portfolio-chat]");
  if (!root) return;

  const endpoint = root.dataset.chatEndpoint;
  const sourceMapElement = root.querySelector("[data-chat-source-map]");
  let sourceMap = {};
  try {
    sourceMap = JSON.parse(sourceMapElement?.textContent || "{}");
    if (typeof sourceMap === "string") sourceMap = JSON.parse(sourceMap);
  } catch (_) {
    sourceMap = {};
  }
  const launcher = root.querySelector(".portfolio-chat__launcher");
  const panel = root.querySelector(".portfolio-chat__panel");
  const closeButton = root.querySelector("[data-chat-close]");
  const resetButton = root.querySelector("[data-chat-reset]");
  const form = root.querySelector("[data-chat-form]");
  const input = root.querySelector("[data-chat-input]");
  const sendButton = root.querySelector(".portfolio-chat__send");
  const messages = root.querySelector("[data-chat-messages]");
  let suggestions = root.querySelector("[data-chat-suggestions]");
  const storageKey = "shay-portfolio-chat";
  const conversationKey = `${storageKey}-conversation`;
  const userKey = `${storageKey}-user`;
  let requestController = null;
  let busy = false;
  let pageLocked = false;
  let lockedScrollY = 0;

  const newId = () => window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  const getUserId = () => {
    let id = localStorage.getItem(userKey);
    if (!id) {
      id = newId();
      localStorage.setItem(userKey, id);
    }
    return id;
  };

  const scrollToLatest = () => messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });

  const resizeInput = () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
    sendButton.disabled = busy || input.value.trim().length === 0;
  };

  const createMessage = (role, text = "") => {
    const row = document.createElement("div");
    row.className = `portfolio-chat__message portfolio-chat__message--${role}`;
    if (role === "assistant") {
      const avatar = document.createElement("span");
      avatar.className = "portfolio-chat__avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = "🍑";
      row.append(avatar);
    }
    const bubble = document.createElement("div");
    bubble.className = "portfolio-chat__bubble";
    const copy = document.createElement("p");
    copy.textContent = text;
    bubble.append(copy);
    row.append(bubble);
    messages.append(row);
    scrollToLatest();
    return { row, bubble, copy };
  };

  const safeLink = (value) => {
    try {
      const url = new URL(value, window.location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url : null;
    } catch (_) {
      return null;
    }
  };

  const renderAnswerLinks = (element) => {
    const text = element.textContent || "";
    const pattern = /\[([^\]]+)]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)|(https?:\/\/[^\s<]+)/g;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      fragment.append(document.createTextNode(text.slice(cursor, match.index)));
      const rawHref = match[2] || match[3];
      const trailing = match[3]?.match(/[.,;:!?]+$/)?.[0] || "";
      const href = trailing ? rawHref.slice(0, -trailing.length) : rawHref;
      const url = safeLink(href);
      if (url) {
        const link = document.createElement("a");
        link.href = url.href;
        link.textContent = match[1] || href;
        if (url.origin !== window.location.origin) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        fragment.append(link);
        if (trailing) fragment.append(document.createTextNode(trailing));
      } else {
        fragment.append(document.createTextNode(match[0]));
      }
      cursor = pattern.lastIndex;
    }

    fragment.append(document.createTextNode(text.slice(cursor)));
    element.replaceChildren(fragment);
  };

  const displayAnswerText = (rawText) => {
    let text = rawText || "";
    text = text.replace(/^\s*Answer:\s*/i, "");
    const generatedSources = text.search(/\n\s*\n?(?:sources?|citations?):\s*\n/i);
    if (generatedSources >= 0) text = text.slice(0, generatedSources);
    return text.trim();
  };

  const cleanAnswerText = (assistant) => {
    assistant.copy.textContent = displayAnswerText(assistant.rawText || assistant.copy.textContent);
  };

  const sourceFromDocument = (documentName) => {
    const source = typeof documentName === "string" ? sourceMap[documentName] : null;
    if (!source?.href || !source?.label) return null;
    return {
      href: new URL(source.href, window.location.origin).href,
      label: source.label
    };
  };

  const appendSources = (assistant, resources) => {
    if (!Array.isArray(resources)) return;
    const unique = new Map();
    resources.forEach((resource) => {
      const source = sourceFromDocument(resource?.document_name);
      if (source && !unique.has(source.href)) unique.set(source.href, source);
    });
    if (!unique.size) return;

    const sourceItems = [...unique.values()].slice(0, 4);
    const sources = document.createElement("details");
    sources.className = "portfolio-chat__sources";
    const summary = document.createElement("summary");
    const summaryLabel = document.createElement("span");
    summaryLabel.textContent = "View citations";
    const count = document.createElement("span");
    count.className = "portfolio-chat__sources-count";
    count.textContent = String(sourceItems.length);
    summary.append(summaryLabel, count);
    const list = document.createElement("ol");
    sourceItems.forEach((source, index) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.href;
      link.dataset.chatSourceLink = "";
      const number = document.createElement("span");
      number.className = "portfolio-chat__source-index";
      number.textContent = `[${index + 1}]`;
      const label = document.createElement("span");
      label.textContent = source.label;
      link.append(number, label);
      link.setAttribute("aria-label", `Open source: ${source.label}`);
      item.append(link);
      list.append(item);
    });
    sources.append(summary, list);
    assistant.bubble.append(sources);
  };

  const renderWelcome = () => {
    messages.replaceChildren();
    createMessage("assistant", "Hey — I can help you explore Shay’s work, skills, and course projects.");
    suggestions = document.createElement("div");
    suggestions.className = "portfolio-chat__suggestions";
    suggestions.dataset.chatSuggestions = "";
    suggestions.setAttribute("aria-label", "Suggested questions");
    [
      {
        label: "What has Shay built?",
        query: "Summarize the main software projects Shay has built. Use the portfolio project overview and project pages, explain what each project does, mention its main technologies, and ground the answer in retrieved sources."
      },
      {
        label: "Tell me about the RAG project",
        query: "Explain the RAG portfolio assistant Shay built, including its purpose, architecture, technologies, and lessons learned. Ground the answer in retrieved RAG project pages."
      },
      {
        label: "What technologies does Shay use?",
        query: "Summarize the technologies Shay has used across his portfolio projects. Group them into frontend, backend, data, AI, and deployment where appropriate, and ground the answer in retrieved project pages."
      }
    ].forEach(({ label, query }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.chatQuery = query;
      suggestions.append(button);
    });
    messages.append(suggestions);
  };

  const setBusy = (value) => {
    busy = value;
    input.disabled = value;
    resetButton.disabled = value;
    resizeInput();
  };

  const setPageLocked = (locked) => {
    if (locked && pageLocked) return;
    if (!locked && !pageLocked) {
      document.documentElement.classList.remove("portfolio-chat-open");
      document.body.classList.remove("portfolio-chat-open");
      document.body.style.removeProperty("--portfolio-chat-scroll-offset");
      document.body.style.removeProperty("--portfolio-chat-scrollbar-width");
      return;
    }
    pageLocked = locked;

    if (locked) {
      lockedScrollY = window.scrollY;
      const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      document.documentElement.classList.add("portfolio-chat-open");
      document.body.classList.add("portfolio-chat-open");
      document.body.style.setProperty("--portfolio-chat-scroll-offset", `${-lockedScrollY}px`);
      document.body.style.setProperty("--portfolio-chat-scrollbar-width", `${scrollbarWidth}px`);
      return;
    }

    document.documentElement.classList.remove("portfolio-chat-open");
    document.body.classList.remove("portfolio-chat-open");
    document.body.style.removeProperty("--portfolio-chat-scroll-offset");
    document.body.style.removeProperty("--portfolio-chat-scrollbar-width");
    window.scrollTo(0, lockedScrollY);
  };

  const setOpen = (open, restoreFocus = true) => {
    setPageLocked(open);
    panel.hidden = !open;
    root.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    launcher.setAttribute("aria-label", open ? "Close Ask Shay" : "Open Ask Shay");
    if (open) window.setTimeout(() => input.focus(), 80);
    else if (restoreFocus) launcher.focus();
  };

  const readError = async (response) => {
    try {
      const payload = await response.json();
      return payload.error || payload.message || "The assistant could not respond.";
    } catch (_) {
      return "The assistant could not respond.";
    }
  };

  const processEvent = (event, assistant) => {
    if (!event || event.event === "ping") return;
    if (event.conversation_id) sessionStorage.setItem(conversationKey, event.conversation_id);
    if (event.event === "message" || event.event === "agent_message") {
      assistant.rawText += event.answer || "";
      assistant.copy.textContent = displayAnswerText(assistant.rawText);
      assistant.row.classList.remove("is-thinking");
      scrollToLatest();
    } else if (event.event === "message_replace") {
      assistant.rawText = event.answer || assistant.rawText;
      assistant.copy.textContent = displayAnswerText(assistant.rawText);
      assistant.row.classList.remove("is-thinking");
    } else if (event.event === "message_end") {
      cleanAnswerText(assistant);
      renderAnswerLinks(assistant.copy);
      appendSources(assistant, event.metadata?.retriever_resources);
      scrollToLatest();
    } else if (event.event === "error") {
      throw new Error(event.message || "The assistant could not respond.");
    }
  };

  const consumeStream = async (response, assistant) => {
    if (!response.body) throw new Error("Streaming is unavailable in this browser.");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const consumeBlock = (block) => {
      const data = block.split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (!data || data === "[DONE]") return;
      processEvent(JSON.parse(data), assistant);
    };

    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() || "";
      blocks.forEach(consumeBlock);
      if (done) break;
    }
    if (buffer.trim()) consumeBlock(buffer);
  };

  const sendMessage = async (question, displayQuestion = question) => {
    const query = question.trim();
    if (!query || busy) return;
    suggestions?.remove();
    suggestions = null;
    createMessage("user", displayQuestion.trim() || query);
    const assistant = createMessage("assistant");
    assistant.rawText = "";
    assistant.row.classList.add("is-thinking");
    assistant.copy.setAttribute("aria-label", "Shay’s assistant is thinking");
    input.value = "";
    setBusy(true);
    requestController = new AbortController();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          conversation_id: sessionStorage.getItem(conversationKey) || "",
          user: getUserId()
        }),
        signal: requestController.signal
      });
      if (!response.ok) throw new Error(await readError(response));
      await consumeStream(response, assistant);
      assistant.row.classList.remove("is-thinking");
      assistant.copy.removeAttribute("aria-label");
      if (!assistant.copy.textContent.trim()) {
        assistant.copy.textContent = "I couldn’t find a useful answer to that. Try asking about a specific project or skill.";
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      assistant.row.classList.remove("is-thinking");
      assistant.copy.removeAttribute("aria-label");
      assistant.copy.textContent = error.message || "Something went wrong. Please try again.";
      assistant.row.classList.add("is-error");
    } finally {
      requestController = null;
      setBusy(false);
      input.focus();
      scrollToLatest();
    }
  };

  launcher.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));
  resetButton.addEventListener("click", () => {
    requestController?.abort();
    sessionStorage.removeItem(conversationKey);
    renderWelcome();
    input.value = "";
    setBusy(false);
    input.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });
  input.addEventListener("input", resizeInput);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  messages.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button?.closest("[data-chat-suggestions]")) {
      sendMessage(button.dataset.chatQuery || button.textContent || "", button.textContent || "");
    }
    const sourceLink = event.target.closest("[data-chat-source-link]");
    if (sourceLink) setOpen(false, false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });

  window.addEventListener("pagehide", () => {
    panel.hidden = true;
    root.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Open Ask Shay");
    setPageLocked(false);
  });

  window.addEventListener("pageshow", () => {
    if (panel.hidden) setPageLocked(false);
  });

  resizeInput();
})();
