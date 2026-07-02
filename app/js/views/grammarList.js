import { grammarLessons } from "../data/grammar.js";
import { isLessonComplete } from "../progress.js";

export function renderGrammarList(container) {
  container.innerHTML = `
    <div class="page-title">Grammaire avancée</div>
    <div class="page-subtitle">Les nuances qui rendent votre français plus précis et plus naturel.</div>
    ${grammarLessons.map((lesson) => `
      <a href="#/grammar/${lesson.id}" class="card" style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
        <div class="hub-header__icon" style="background:var(--color-primary);">${lesson.icon}</div>
        <div style="flex:1;">
          <div style="font-weight:700;">${lesson.title}</div>
        </div>
        ${isLessonComplete(`grammar:${lesson.id}`) ? `<span style="color:var(--color-accent-green); font-size:1.3rem;">✅</span>` : `<span style="font-size:1.2rem;">→</span>`}
      </a>
    `).join("")}
  `;
}
