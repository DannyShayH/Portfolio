(function () {
  "use strict";

  var script = document.currentScript;
  var projectsURL = script && script.dataset.projectsUrl ? script.dataset.projectsUrl : "/posts/";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.querySelector(".portfolio-home")) document.documentElement.classList.add("portfolio-home-page");

  function initLoader() {
    var loader = document.querySelector("[data-portfolio-loader]");
    if (!loader) return;

    var hasPlayed = false;
    try { hasPlayed = sessionStorage.getItem("portfolioIntroSeen") === "true"; } catch (_) {}

    if (hasPlayed || reducedMotion) {
      loader.remove();
      return;
    }

    document.body.classList.add("portfolio-no-scroll");
    window.setTimeout(function () {
      loader.classList.add("is-leaving");
      document.body.classList.remove("portfolio-no-scroll");
      try { sessionStorage.setItem("portfolioIntroSeen", "true"); } catch (_) {}
      window.setTimeout(function () { loader.remove(); }, 700);
    }, 1250);
  }

  function initParticles() {
    var canvas = document.querySelector("[data-particle-field]");
    if (!canvas) return;
    var context = canvas.getContext("2d");
    if (!context) return;

    var particles = [];
    var frame = null;
    var width = 0;
    var height = 0;

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 0.9,
        alpha: 0.24 + Math.random() * 0.34,
        dx: (Math.random() - 0.5) * 0.11,
        dy: -0.035 - Math.random() * 0.09
      };
    }

    function resize() {
      var bounds = canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      var count = window.innerWidth < 768 ? 28 : 58;
      particles = Array.from({ length: count }, makeParticle);
      draw();
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      particles.forEach(function (particle) {
        context.beginPath();
        context.fillStyle = "rgba(203, 218, 242, " + particle.alpha + ")";
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
    }

    function animate() {
      particles.forEach(function (particle) {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.y < -3) particle.y = height + 3;
        if (particle.x < -3) particle.x = width + 3;
        if (particle.x > width + 3) particle.x = -3;
      });
      draw();
      frame = window.requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (!reducedMotion) animate();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = null;
      } else if (!document.hidden && !reducedMotion && !frame) {
        animate();
      }
    });
  }

  function initReveals() {
    var items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    items.forEach(function (item, index) {
      item.style.setProperty("--reveal-delay", Math.min(index % 4, 3) * 70 + "ms");
      observer.observe(item);
    });
  }

  function initSectionNavigation() {
    var sections = Array.from(document.querySelectorAll("[data-scroll-section]"));
    var links = Array.from(document.querySelectorAll("[data-section-link]"));
    if (!sections.length || !links.length) return;

    function select(id) {
      links.forEach(function (link) {
        var active = link.dataset.sectionLink === id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      var navigation = document.querySelector(".portfolio-section-nav");
      if (navigation) navigation.classList.toggle("is-contact", id === "contact");
    }

    var ticking = false;
    function sync() {
      var targetLine = window.innerHeight * 0.45;
      var current = sections.reduce(function (closest, section) {
        var rect = section.getBoundingClientRect();
        var distance = rect.top <= targetLine && rect.bottom >= targetLine
          ? 0
          : Math.min(Math.abs(rect.top - targetLine), Math.abs(rect.bottom - targetLine));
        return !closest || distance < closest.distance ? { section: section, distance: distance } : closest;
      }, null);
      if (current) select(current.section.dataset.scrollSection);
      ticking = false;
    }
    function requestSync() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync, { passive: true });
    sync();
  }

  function initScrollProgress() {
    var progress = document.querySelector("[data-scroll-progress]");
    if (!progress) return;
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = "scaleX(" + value + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initSectionSnap() {
    var sections = Array.from(document.querySelectorAll(".portfolio-home > [data-scroll-section]"));
    if (!sections.length || reducedMotion || window.innerWidth < 768) return;
    var locked = false;
    var settleTimer = null;
    var fallbackTimer = null;

    function unlock() {
      locked = false;
      if (settleTimer) window.clearTimeout(settleTimer);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      settleTimer = null;
      fallbackTimer = null;
    }

    window.addEventListener("scroll", function () {
      if (!locked) return;
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(unlock, 120);
    }, { passive: true });

    function currentIndex() {
      var current = sections.reduce(function (closest, section, index) {
        var distance = Math.abs(section.getBoundingClientRect().top - 72);
        return !closest || distance < closest.distance ? { index: index, distance: distance } : closest;
      }, null);
      return current ? current.index : 0;
    }

    function move(direction) {
      if (document.documentElement.classList.contains("portfolio-chat-open")) return false;
      if (locked) return false;
      var index = currentIndex();
      var nextIndex = Math.max(0, Math.min(sections.length - 1, index + direction));
      if (nextIndex === index) return false;
      locked = true;
      sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
      fallbackTimer = window.setTimeout(unlock, 900);
      return true;
    }

    window.addEventListener("wheel", function (event) {
      if (document.documentElement.classList.contains("portfolio-chat-open")) return;
      if ((event.target instanceof Element && event.target.closest(".portfolio-search-panel")) || event.ctrlKey) return;
      if (locked) {
        if (locked) event.preventDefault();
        return;
      }
      if (Math.abs(event.deltaY) < 1) return;
      if (move(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
    }, { passive: false });

    window.addEventListener("keydown", function (event) {
      if (document.documentElement.classList.contains("portfolio-chat-open")) return;
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target.matches("input, textarea, select, button, [contenteditable='true']")) return;
      var direction = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown") direction = 1;
      if (event.key === "ArrowUp" || event.key === "PageUp") direction = -1;
      if (!direction) return;
      if (move(direction)) event.preventDefault();
    });
  }

  function initPointerEffects() {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    document.querySelectorAll(".portfolio-button, .portfolio-project-card, .portfolio-header__social").forEach(function (item) {
      item.addEventListener("pointermove", function (event) {
        var rect = item.getBoundingClientRect();
        item.style.setProperty("--pointer-x", event.clientX - rect.left + "px");
        item.style.setProperty("--pointer-y", event.clientY - rect.top + "px");
      });
    });
  }

  function initContactSurface() {
    var contact = document.querySelector(".portfolio-contact");
    if (!contact || reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    var footer = document.querySelector(".portfolio-footer");
    var surfaces = footer ? [contact, footer] : [contact];
    var frame = null;

    function update(event) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(function () {
        surfaces.forEach(function (surface) {
          var rect = surface.getBoundingClientRect();
          surface.style.setProperty("--contact-x", event.clientX - rect.left + "px");
          surface.style.setProperty("--contact-y", event.clientY - rect.top + "px");
        });
        if (footer) footer.style.setProperty("--contact-footer-glow", "0.14");
        frame = null;
      });
    }

    function clear(event) {
      var next = event.relatedTarget;
      if (next instanceof Element && next.closest(".portfolio-contact, .portfolio-footer")) return;
      surfaces.forEach(function (surface) {
        surface.style.removeProperty("--contact-x");
        surface.style.removeProperty("--contact-y");
      });
      if (footer) footer.style.removeProperty("--contact-footer-glow");
    }

    surfaces.forEach(function (surface) {
      surface.addEventListener("pointermove", update);
      surface.addEventListener("pointerleave", clear);
    });
  }

  function initTagRouting() {
    document.addEventListener("click", function (event) {
      var tagLink = event.target.closest('a[href*="/tags/"]');
      if (!tagLink) return;
      var match = tagLink.pathname.match(/\/tags\/([^/]+)/);
      if (!match) return;
      event.preventDefault();
      window.location.href = projectsURL + "?tag=" + encodeURIComponent(match[1]);
    });

    var projectsPath = new URL(projectsURL, window.location.origin).pathname.replace(/\/$/, "");
    if (window.location.pathname.replace(/\/$/, "") !== projectsPath) return;

    var tag = new URLSearchParams(window.location.search).get("tag");
    if (!tag) return;
    tag = tag.toLowerCase();

    var cards = Array.from(document.querySelectorAll("[data-project-card]"));
    if (!cards.length) return;
    var matches = 0;
    cards.forEach(function (card) {
      var tags = (card.dataset.tags || "").toLowerCase().split(",").filter(Boolean);
      var visible = tags.indexOf(tag) !== -1;
      card.hidden = !visible;
      if (visible) matches += 1;
    });

    var grid = cards[0].parentElement;
    var filter = document.createElement("div");
    filter.className = "portfolio-active-filter";
    var label = document.createElement("p");
    label.textContent = matches ? "Showing work related to “" + tag.replace(/-/g, " ") + "”." : "No projects currently use the tag “" + tag.replace(/-/g, " ") + "”.";
    var clear = document.createElement("a");
    clear.href = projectsURL;
    clear.textContent = "Show all work";
    filter.append(label, clear);
    grid.parentElement.insertBefore(filter, grid);
  }

  initLoader();
  initParticles();
  initReveals();
  initSectionNavigation();
  initSectionSnap();
  initScrollProgress();
  initPointerEffects();
  initContactSurface();
  initTagRouting();
})();
