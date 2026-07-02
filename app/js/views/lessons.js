import { vocabulary } from "../data/vocabulary.js";
import { getState } from "../progress.js";

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
    <div class="page-title">فئات المفردات</div>
    <div class="page-subtitle">اختر موضوعاً وابدأ التعلم بالبطاقات، الاختبارات، الاستماع، والنطق.</div>
    <div class="category-grid">
      ${vocabulary.map((cat) => `
        <a href="#/category/${cat.id}" class="category-card" style="background:${cat.color}">
          <div class="category-card__icon">${cat.icon}</div>
          <div>
            <div class="category-card__title">${cat.title}</div>
            <div class="category-card__meta">${cat.words.length} كلمة</div>
          </div>
          <div class="category-card__progress"><div style="width:${categoryProgressPercent(cat.id)}%"></div></div>
        </a>
      `).join("")}
    </div>
  `;
}
