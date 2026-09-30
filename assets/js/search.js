(function () {
  "use strict";

  var roots = Array.from(document.querySelectorAll("[data-search-root]"));
  var desktopRoot = document.querySelector(".portfolio-search-desktop");
  var mobileOverlay = document.getElementById("search-wrapper");
  var mobileOpenButton = document.getElementById("search-button-mobile");
  var mobileCloseButton = document.getElementById("close-search-button");
  var menuButton = document.getElementById("portfolio-menu-button");
  var mobileMenu = document.getElementById("portfolio-mobile-menu");
  var fuse = null;
  var indexPromise = null;
  var activeFilter = "all";
  var activeQuery = "";
  var lastTrigger = null;

  if (!roots.length) return;

  function getBaseURL() {
    var root = roots.find(function (item) { return item.dataset.url; });
    return (root ? root.dataset.url : "/").replace(/\/?$/, "/");
  }

  function setStatus(root, message) {
    var status = root.querySelector("[data-search-status]");
    if (status) status.textContent = message;
  }

  function loadIndex() {
    if (fuse) return Promise.resolve(fuse);
    if (indexPromise) return indexPromise;

    roots.forEach(function (root) { setStatus(root, "Loading search…"); });
    indexPromise = fetch(getBaseURL() + "index.json", { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) throw new Error("Search index could not be loaded.");
        return response.json();
      })
      .then(function (data) {
        fuse = new Fuse(data, {
          shouldSort: true,
          ignoreLocation: true,
          threshold: 0.25,
          minMatchCharLength: 2,
          keys: [
            { name: "title", weight: 0.9 },
            { name: "tags", weight: 0.65 },
            { name: "summary", weight: 0.55 },
            { name: "content", weight: 0.35 },
            { name: "categories", weight: 0.3 }
          ]
        });
        renderAll();
        return fuse;
      })
      .catch(function () {
        roots.forEach(function (root) { setStatus(root, "Search is unavailable right now."); });
        indexPromise = null;
      });
    return indexPromise;
  }

  function resultLabel(type) {
    return type === "project" ? "Project" : type === "article" ? "Article" : "Tag";
  }

  function makeResult(item) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    var meta = document.createElement("span");
    var title = document.createElement("strong");
    var summary = document.createElement("span");
    var arrow = document.createElement("i");

    link.href = item.externalUrl || item.permalink;
    link.dataset.searchResult = "";
    if (item.externalUrl) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    meta.className = "portfolio-search-result__meta";
    meta.textContent = resultLabel(item.resultType) + (item.date ? " · " + item.date : "");
    title.textContent = item.title;
    summary.className = "portfolio-search-result__summary";
    summary.textContent = item.summary || (item.resultType === "tag" ? "Browse posts tagged " + item.title + "." : "Open this result.");
    arrow.className = "portfolio-search-result__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    link.append(meta, title, summary, arrow);
    li.appendChild(link);
    return li;
  }

  function render(root) {
    var list = root.querySelector("[data-search-results]");
    if (!list) return;
    list.replaceChildren();

    if (!activeQuery.trim()) {
      setStatus(root, "Start typing to explore the portfolio.");
      return;
    }
    if (!fuse) {
      setStatus(root, "Loading search…");
      return;
    }

    var results = fuse.search(activeQuery.trim())
      .map(function (result) { return result.item; })
      .filter(function (item) { return activeFilter === "all" || item.resultType === activeFilter; })
      .slice(0, 10);

    setStatus(root, results.length ? results.length + (results.length === 1 ? " result" : " results") : "No results found. Try another term or filter.");
    results.forEach(function (item) { list.appendChild(makeResult(item)); });
  }

  function renderAll() {
    roots.forEach(render);
  }

  function syncInputs(source) {
    roots.forEach(function (root) {
      var input = root.querySelector("[data-search-input]");
      if (input && input !== source) input.value = activeQuery;
    });
  }

  function setFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll("[data-search-filter]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.searchFilter === filter ? "true" : "false");
    });
    renderAll();
  }

  function openDesktop() {
    if (!desktopRoot || window.innerWidth < 768) return;
    var panel = desktopRoot.querySelector("[data-search-panel]");
    var input = desktopRoot.querySelector("[data-search-input]");
    if (panel) panel.hidden = false;
    if (input) input.setAttribute("aria-expanded", "true");
    loadIndex();
    render(desktopRoot);
  }

  function closeDesktop() {
    if (!desktopRoot) return;
    var panel = desktopRoot.querySelector("[data-search-panel]");
    var input = desktopRoot.querySelector("[data-search-input]");
    if (panel) panel.hidden = true;
    if (input) input.setAttribute("aria-expanded", "false");
  }

  function openMobile(trigger) {
    if (!mobileOverlay) return;
    closeDesktop();
    lastTrigger = trigger || document.activeElement;
    mobileOverlay.hidden = false;
    if (mobileOpenButton) mobileOpenButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("portfolio-no-scroll");
    loadIndex();
    render(mobileOverlay);
    window.requestAnimationFrame(function () {
      var input = mobileOverlay.querySelector("[data-search-input]");
      if (input) input.focus();
    });
  }

  function closeMobile() {
    if (!mobileOverlay || mobileOverlay.hidden) return;
    mobileOverlay.hidden = true;
    if (mobileOpenButton) mobileOpenButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("portfolio-no-scroll");
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  }

  function resultKeyNavigation(event, root) {
    var results = Array.from(root.querySelectorAll("[data-search-result]"));
    if (!results.length) return;
    var current = results.indexOf(document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      results[current < 0 || current === results.length - 1 ? 0 : current + 1].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (current <= 0) root.querySelector("[data-search-input]").focus();
      else results[current - 1].focus();
    } else if (event.key === "Enter" && document.activeElement.matches("[data-search-input]")) {
      event.preventDefault();
      results[0].focus();
    }
  }

  roots.forEach(function (root) {
    var input = root.querySelector("[data-search-input]");
    if (input) {
      input.addEventListener("focus", function () {
        if (root === desktopRoot) openDesktop();
        else loadIndex();
      });
      input.addEventListener("input", function (event) {
        activeQuery = event.target.value;
        syncInputs(event.target);
        renderAll();
      });
    }
    root.addEventListener("click", function (event) {
      var filter = event.target.closest("[data-search-filter]");
      if (filter) setFilter(filter.dataset.searchFilter);
    });
    root.addEventListener("keydown", function (event) { resultKeyNavigation(event, root); });
  });

  if (mobileOpenButton) mobileOpenButton.addEventListener("click", function () { openMobile(mobileOpenButton); });
  if (mobileCloseButton) mobileCloseButton.addEventListener("click", closeMobile);
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", function (event) {
      if (event.target === mobileOverlay) closeMobile();
    });
    mobileOverlay.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var focusable = Array.from(mobileOverlay.querySelectorAll("button, input, a[href]")).filter(function (item) { return !item.hidden; });
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault();
        focusable[0].focus();
      }
    });
  }

  function setMenuOpen(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileMenu.hidden = !open;
    menuButton.querySelector("[data-menu-open-icon]").hidden = open;
    menuButton.querySelector("[data-menu-close-icon]").hidden = !open;
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });
  }

  document.addEventListener("click", function (event) {
    if (desktopRoot && !desktopRoot.contains(event.target)) closeDesktop();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDesktop();
      closeMobile();
      setMenuOpen(false);
    }
    if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
      var active = document.activeElement;
      var isTyping = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
      if (!isTyping) {
        event.preventDefault();
        if (window.innerWidth >= 768 && desktopRoot) {
          var desktopInput = desktopRoot.querySelector("[data-search-input]");
          if (desktopInput) desktopInput.focus();
        } else {
          openMobile(active);
        }
      }
    }
  });
})();
