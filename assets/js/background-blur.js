// Hugo will prefer project assets over theme assets, so this file overrides:
// themes/blowfish/assets/js/background-blur.js
//
// Goal: keep #background-blur static (opacity 0.85) and never update it on scroll.

function setBackgroundBlur(targetId, scrollDivisor = 300, disableBlur = false, isMenuBlur = false) {
  if (!targetId) {
    console.error("data-blur-id is null");
    return;
  }

  const blurElement = document.getElementById(targetId);
  if (!blurElement) return;

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

  // Make the page background blur static (no scroll-driven opacity updates).
  if (targetId === "background-blur") {
    blurElement.style.opacity = "0.85";
    blurElement.setAttribute("role", "presentation");
    blurElement.setAttribute("tabindex", "-1");
    return;
  }

  // Preserve existing menu blur behavior.
  const updateBlur = () => {
    const scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    blurElement.style.opacity = scroll / scrollDivisor;
  };

  blurElement.setAttribute("role", "presentation");
  blurElement.setAttribute("tabindex", "-1");
  window.addEventListener("scroll", updateBlur, { passive: true });
  updateBlur();
}

document.querySelectorAll("script[data-blur-id]").forEach((script) => {
  const targetId = script.getAttribute("data-blur-id");
  const scrollDivisor = Number(script.getAttribute("data-scroll-divisor") || 300);
  const isMenuBlur = targetId === "menu-blur";
  const settings = JSON.parse(localStorage.getItem("a11ySettings") || "{}");
  const disableBlur = settings.disableBlur || false;
  setBackgroundBlur(targetId, scrollDivisor, disableBlur, isMenuBlur);
});

