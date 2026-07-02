import { vocabulary } from "../data/vocabulary.js";
import { getState, getLevel, getXpIntoLevel, countMasteredWords, getAllBadgesWithStatus, getRecentActivity, resetProgress } from "../progress.js";
import { showToast, timeAgo } from "../utils.js";

const WEEKDAYS_FR = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

function lastSevenDays() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function renderProfile(container) {
  const state = getState();
  const level = getLevel();
  const totalWords = vocabulary.reduce((sum, c) => sum + c.words.length, 0);
  const mastered = countMasteredWords();
  const badges = getAllBadgesWithStatus();
  const recentActivity = getRecentActivity();
  const days = lastSevenDays();
  const activeDates = new Set(state.history.map((h) => h.date));

  container.innerHTML = `
    <div class="page-title">Mon profil</div>
    <div class="hero-card">
      <h1>Niveau ${level}</h1>
      <p>${state.xp} points d'expérience au total</p>
      <div class="level-progress"><div class="level-progress__bar" style="width:${getXpIntoLevel()}%"></div></div>
    </div>

    <div class="stats-grid">
      <div class="mini-stat"><div class="mini-stat__value">${state.streak}🔥</div><div class="mini-stat__label">jours de suite</div></div>
      <div class="mini-stat"><div class="mini-stat__value num-ratio">${mastered}/${totalWords}</div><div class="mini-stat__label">expressions maîtrisées</div></div>
      <div class="mini-stat"><div class="mini-stat__value">${Object.keys(state.conversationsDone).length}</div><div class="mini-stat__label">conversations faites</div></div>
    </div>

    ${recentActivity.length ? `
      <div class="section-heading"><h2>Mon parcours d'apprentissage</h2></div>
      <div class="card" style="padding:8px 0;">
        ${recentActivity.map((a, i) => `
          <a href="${a.hash}" class="activity-row" style="${i < recentActivity.length - 1 ? "border-bottom:1px solid var(--border-soft);" : ""}">
            <span class="activity-row__icon">${a.icon}</span>
            <span style="flex:1;">
              <div class="activity-row__label">${a.label}</div>
              <div class="activity-row__time">${timeAgo(a.timestamp)}</div>
            </span>
            <span style="color:var(--text-muted);">→</span>
          </a>
        `).join("")}
      </div>
    ` : ""}

    <div class="section-heading"><h2>Activité de la semaine</h2></div>
    <div class="week-strip">
      ${days.map((d) => {
        const dayIndex = new Date(d).getDay();
        const active = activeDates.has(d);
        return `<div class="week-day ${active ? "active" : ""}">${WEEKDAYS_FR[dayIndex]}</div>`;
      }).join("")}
    </div>

    <div class="section-heading"><h2>Badges</h2></div>
    <div class="badge-grid">
      ${badges.map((b) => `
        <div class="badge-item ${b.earned ? "earned" : ""}">
          <div class="badge-item__icon">${b.icon}</div>
          <div class="badge-item__label">${b.label}</div>
        </div>
      `).join("")}
    </div>

    <div class="section-heading"><h2>Paramètres</h2></div>
    <div class="card">
      <button class="btn btn--danger btn--block" id="reset-btn">Réinitialiser ma progression</button>
    </div>
  `;

  container.querySelector("#reset-btn").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment réinitialiser toute votre progression ? Cette action est irréversible.")) {
      resetProgress();
      window.__refreshTopbar && window.__refreshTopbar();
      showToast("Progression réinitialisée", { type: "info" });
      renderProfile(container);
    }
  });
}
