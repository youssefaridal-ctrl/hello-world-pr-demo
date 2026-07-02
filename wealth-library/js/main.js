document.querySelectorAll(".cat-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".cat-chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
  });
});

const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.style.display === "flex";
    mainNav.style.display = isOpen ? "none" : "flex";
    mainNav.style.cssText += isOpen ? "" : "position:absolute;top:64px;inset-inline:16px;background:var(--paper-raised);border:1px solid var(--line);border-radius:8px;padding:10px;flex-direction:column;box-shadow:var(--shadow-pop);";
  });
}
