import { vocabulary } from "../data/vocabulary.js";
import { getState, getLevel, getXpIntoLevel, countMasteredWords, getAllBadgesWithStatus, getRecentActivity, getCecrlLevel, getUnlockedLevels, getReminder, setReminder, resetProgress } from "../progress.js";
import { showToast, timeAgo } from "../utils.js";
import { notificationsSupported, requestNotificationPermission } from "../notifications.js";

const LEVEL_LABELS = { B1: "Intermédiaire (B1)", B2: "Intermédiaire avancé (B2)", C1: "Avancé (C1)" };

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
  const cecrlLevel = getCecrlLevel();
  const unlockedLevels = getUnlockedLevels();
  const reminder = getReminder();

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

    <div class="section-heading"><h2>Niveau CECRL</h2></div>
    <div class="card" style="margin-bottom:16px;">
      <div style="font-weight:700; color:var(--color-primary);">${cecrlLevel ? LEVEL_LABELS[cecrlLevel] : "Non évalué"}</div>
      <div style="color:var(--text-muted); font-size:0.85rem; margin:6px 0 12px;">
        Niveaux débloqués : ${unlockedLevels.join(", ") || "—"}
      </div>
      <a href="#/test" class="btn btn--secondary btn--block">Repasser le test de positionnement</a>
    </div>

    <div class="section-heading"><h2>Rappels de pratique</h2></div>
    <div class="card" style="margin-bottom:16px;">
      <label style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px;">
        <span style="font-weight:700;">Me le rappeler chaque jour</span>
        <input type="checkbox" id="reminder-toggle" ${reminder.enabled ? "checked" : ""} style="width:20px; height:20px;" />
      </label>
      <label style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <span>Heure de la séance</span>
        <input type="time" id="reminder-time" value="${reminder.time}" style="border:1px solid var(--border-soft); border-radius:8px; padding:6px 10px; font-family:inherit;" />
      </label>
      <p style="color:var(--text-muted); font-size:0.78rem; margin-top:12px; line-height:1.6;">
        ${notificationsSupported
          ? "Le rappel s'affiche dès que vous ouvrez l'app après l'heure choisie. Pour une fiabilité maximale, gardez l'app installée et ouvrez-la régulièrement — sans serveur dédié, une notification garantie app fermée n'est pas possible sur tous les appareils."
          : "Les notifications ne sont pas supportées par ce navigateur."}
      </p>
    </div>

    <div class="section-heading"><h2>Paramètres</h2></div>
    <div class="card">
      <button class="btn btn--danger btn--block" id="reset-btn">Réinitialiser ma progression</button>
    </div>
  `;

  const reminderToggle = container.querySelector("#reminder-toggle");
  const reminderTime = container.querySelector("#reminder-time");

  async function saveReminder() {
    const enabled = reminderToggle.checked;
    if (enabled && notificationsSupported && Notification.permission !== "granted") {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        showToast("Autorisez les notifications pour activer les rappels", { type: "error" });
        reminderToggle.checked = false;
        return;
      }
    }
    setReminder({ enabled: reminderToggle.checked, time: reminderTime.value });
    showToast(reminderToggle.checked ? "Rappel activé 🔔" : "Rappel désactivé", { type: "info" });
  }

  reminderToggle.addEventListener("change", saveReminder);
  reminderTime.addEventListener("change", saveReminder);

  container.querySelector("#reset-btn").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment réinitialiser toute votre progression ? Cette action est irréversible.")) {
      resetProgress();
      window.__refreshTopbar && window.__refreshTopbar();
      showToast("Progression réinitialisée", { type: "info" });
      window.location.hash = "#/test";
    }
  });
}
