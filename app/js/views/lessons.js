import { vocabulary } from "../data/vocabulary.js";
import { getState, isLevelUnlocked } from "../progress.js";
import { showToast } from "../utils.js";

function categoryProgressPercent(categoryId) {
  const state = getState();
  const cat = vocabulary.find((c) => c.id === categoryId);
  if (!cat) return 0;
  const mastered = cat.words.filter((w) => {
    const entry = state.wordMastery[`${categoryId}:${w.fr}`];
    return entry && entry.correct >= 3 && entry.correct > entry.wrong;
  }).length;
  return Math.round((mastered / cat.words.length) * 100);
}

export function renderLessons(container) {
  container.innerHTML = `
    <div class="page-title">Expressions par thème</div>
    <div class="page-subtitle">Des outils de communication avancés pour parler avec fluidité, sans traduire dans votre tête.</div>
    <div class="category-grid">
      ${vocabulary.map((cat) => {
        const unlocked = isLevelUnlocked(cat.level);
        return `
        <a href="${unlocked ? `#/category/${cat.id}` : "#"}" class="category-card ${unlocked ? "" : "locked"}" data-locked="${!unlocked}" data-cat="${cat.id}" style="background:${cat.color}">
          <span class="level-badge">${cat.level}${unlocked ? "" : " 🔒"}</span>
          <div class="category-card__icon">${cat.icon}</div>
          <div>
            <div class="category-card__title">${cat.title}</div>
            <div class="category-card__meta">${cat.words.length} expressions</div>
          </div>
          <div class="category-card__progress"><div style="width:${categoryProgressPercent(cat.id)}%"></div></div>
        </a>
      `;
      }).join("")}
    </div>
  `;

  container.querySelectorAll('.category-card[data-locked="true"]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = vocabulary.find((c) => c.id === el.dataset.cat);
      showToast(`Niveau ${cat.level} pas encore débloqué — continuez à pratiquer pour l'ouvrir 🔒`, { type: "info" });
    });
  });
}
