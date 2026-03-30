function setBackgroundBlur(
  targetId,
  scrollDivisor = 300,
  disableBlur = false,
  isMenuBlur = false,
  imageId = null,
  imageUrl = null
) {
  if (!targetId) {
    console.error("data-blur-id is null");
    return;
  }

  const blurElement = document.getElementById(targetId);
  if (!blurElement) return;

  blurElement.setAttribute("role", "presentation");
  blurElement.setAttribute("tabindex", "-1");

  if (disableBlur) {
    blurElement.setAttribute("aria-hidden", "true");
    if (!isMenuBlur) {
      blurElement.style.display = "none";
      blurElement.style.opacity = "0";
    } else {
      blurElement.style.display = "";
    }
    return;
  }

  blurElement.style.display = "";
  blurElement.removeAttribute("aria-hidden");

  // Page background blur: keep it static (no scroll-driven opacity updates).
  if (!isMenuBlur && targetId === "background-blur") {
    const imgEl = imageId ? document.getElementById(imageId) : null;
    const resolvedUrl =
      imageUrl || (imgEl && (imgEl.currentSrc || imgEl.getAttribute("src"))) || "";

    if (resolvedUrl) {
      // Used by CSS (#background-blur::before) to paint a blurred copy of the hero background image.
      blurElement.style.setProperty("--blur-bg-image", `url("${resolvedUrl}")`);
    }

    // Tune this (0..1). This overrides the Tailwind `opacity-0` class on the element.
    blurElement.style.opacity = "0.35";
    return;
  }

  // Everything else: keep old behavior (fade based on scroll), but clamp + throttle to avoid huge opacity values.
  let raf = 0;
  let lastOpacity = -1;
  const updateBlur = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const scroll =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const nextOpacity = Math.max(0, Math.min(1, scroll / scrollDivisor));
      if (Math.abs(nextOpacity - lastOpacity) > 0.01) {
        blurElement.style.opacity = String(nextOpacity);
        lastOpacity = nextOpacity;
      }
    });
  };

  window.addEventListener("scroll", updateBlur, { passive: true });
  updateBlur();
}

document.querySelectorAll("script[data-blur-id]").forEach((script) => {
  const targetId = script.getAttribute("data-blur-id");
  const scrollDivisor = Number(script.getAttribute("data-scroll-divisor") || 300);
  const isMenuBlur = targetId === "menu-blur";
  const imageId = script.getAttribute("data-image-id");
  const imageUrl = script.getAttribute("data-image-url");

  const settings = JSON.parse(localStorage.getItem("a11ySettings") || "{}");
  const disableBlur = settings.disableBlur || false;

  setBackgroundBlur(targetId, scrollDivisor, disableBlur, isMenuBlur, imageId, imageUrl);
});

