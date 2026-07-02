import { vocabulary } from "../data/vocabulary.js";
import { conversations } from "../data/conversations.js";
import { getState, getLevel, getXpIntoLevel, countMasteredWords, getEarnedBadges } from "../progress.js";

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

export function renderHome(container) {
  const state = getState();
  const level = getLevel();
  const xpIntoLevel = getXpIntoLevel();
  const mastered = countMasteredWords();
  const totalWords = vocabulary.reduce((sum, c) => sum + c.words.length, 0);
  const badges = getEarnedBadges();

  const hasProgress = Object.keys(state.wordMastery).length > 0;
  const nextCategory = hasProgress
    ? vocabulary.find((c) => categoryProgressPercent(c.id) < 100) || vocabulary[0]
    : vocabulary[0];

  const greeting = level >= 10 ? "Vous parlez avec une vraie aisance ! 🎉" : level >= 5 ? "Belle progression, continuez ainsi !" : "Prêt à parler français sans hésiter ?";

  container.innerHTML = `
    <div class="hero-card">
      <h1>${greeting}</h1>
      <p>Niveau ${level} · ${xpIntoLevel}/100 points avant le niveau suivant</p>
      <div class="level-progress"><div class="level-progress__bar" style="width:${xpIntoLevel}%"></div></div>
    </div>

    <div class="stats-grid">
      <div class="mini-stat"><div class="mini-stat__value">${state.streak}🔥</div><div class="mini-stat__label">jours de suite</div></div>
      <div class="mini-stat"><div class="mini-stat__value">${mastered}</div><div class="mini-stat__label">expressions maîtrisées</div></div>
      <div class="mini-stat"><div class="mini-stat__value">${totalWords}</div><div class="mini-stat__label">au total</div></div>
    </div>

    <div class="card" id="continue-card" style="cursor:pointer;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div class="hub-header__icon" style="background:${nextCategory.color}">${nextCategory.icon}</div>
        <div style="flex:1;">
          <div style="font-weight:700;">${hasProgress ? "Continuer" : "Commencer"} : ${nextCategory.title}</div>
          <div class="progress-track" style="margin-top:8px;"><div class="progress-track__bar" style="width:${categoryProgressPercent(nextCategory.id)}%"></div></div>
        </div>
        <div style="font-size:1.4rem;">→</div>
      </div>
    </div>

    <div class="section-heading">
      <h2>S'entraîner à l'oral</h2>
      <a href="#/conversations">Tout voir</a>
    </div>
    <div class="category-grid">
      ${conversations.slice(0, 2).map((c) => `
        <a href="#/conversation/${c.id}" class="category-card" style="background:linear-gradient(135deg,#6C5CE7,#9B6BFF)">
          <div class="category-card__icon">${c.icon}</div>
          <div>
            <div class="category-card__title">${c.title}</div>
            <div class="category-card__meta">${c.level}</div>
          </div>
        </a>
      `).join("")}
    </div>

    <div class="section-heading">
      <h2>Expressions à travailler</h2>
      <a href="#/lessons">Tout voir</a>
    </div>
    <div class="category-grid">
      ${vocabulary.slice(0, 4).map((cat) => `
        <a href="#/category/${cat.id}" class="category-card" style="background:${cat.color}">
          <div class="category-card__icon">${cat.icon}</div>
          <div>
            <div class="category-card__title">${cat.title}</div>
            <div class="category-card__meta">${cat.words.length} expressions</div>
          </div>
          <div class="category-card__progress"><div style="width:${categoryProgressPercent(cat.id)}%"></div></div>
        </a>
      `).join("")}
    </div>

    ${badges.length ? `
      <div class="section-heading"><h2>Vos badges</h2><a href="#/profile">Tout voir</a></div>
      <div class="badge-grid">
        ${badges.slice(0, 3).map((b) => `
          <div class="badge-item earned"><div class="badge-item__icon">${b.icon}</div><div class="badge-item__label">${b.label}</div></div>
        `).join("")}
      </div>
    ` : ""}
  `;

  container.querySelector("#continue-card").addEventListener("click", () => {
    window.location.hash = `#/category/${nextCategory.id}`;
  });
}
