import { grammarLessons } from "../data/grammar.js";
import { isLessonComplete, isLevelUnlocked } from "../progress.js";
import { showToast } from "../utils.js";

export function renderGrammarList(container) {
  container.innerHTML = `
    <div class="page-title">Grammaire avancée</div>
    <div class="page-subtitle">Les nuances qui rendent votre français plus précis et plus naturel.</div>
    ${grammarLessons.map((lesson) => {
      const unlocked = isLevelUnlocked(lesson.level);
      return `
      <a href="${unlocked ? `#/grammar/${lesson.id}` : "#"}" class="card ${unlocked ? "" : "locked"}" data-locked="${!unlocked}" data-lesson="${lesson.id}" style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
        <div class="hub-header__icon" style="background:var(--color-primary);">${lesson.icon}</div>
        <div style="flex:1;">
          <div style="font-weight:700;">${lesson.title}</div>
          <span class="level-badge level-badge--${lesson.level}" style="margin-top:4px;">${lesson.level}</span>
        </div>
        ${!unlocked ? `<span style="font-size:1.2rem;">🔒</span>` : isLessonComplete(`grammar:${lesson.id}`) ? `<span style="color:var(--color-accent-green); font-size:1.3rem;">✅</span>` : `<span style="font-size:1.2rem;">→</span>`}
      </a>
    `;
    }).join("")}
  `;

  container.querySelectorAll('.card[data-locked="true"]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const lesson = grammarLessons.find((l) => l.id === el.dataset.lesson);
      showToast(`Niveau ${lesson.level} pas encore débloqué — continuez à pratiquer pour l'ouvrir 🔒`, { type: "info" });
    });
  });
}
