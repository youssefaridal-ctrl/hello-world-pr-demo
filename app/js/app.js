import { getState, getLevel, getXpIntoLevel } from "./progress.js";
import { renderHome } from "./views/home.js";
import { renderLessons } from "./views/lessons.js";
import { renderCategoryHub } from "./views/categoryHub.js";
import { renderFlashcards } from "./views/flashcards.js";
import { renderQuiz } from "./views/quiz.js";
import { renderListening } from "./views/listening.js";
import { renderSpeaking } from "./views/speaking.js";
import { renderGrammarList } from "./views/grammarList.js";
import { renderGrammarDetail } from "./views/grammarDetail.js";
import { renderConversationsList } from "./views/conversationsList.js";
import { renderConversation } from "./views/conversation.js";
import { renderProfile } from "./views/profile.js";

const appEl = document.getElementById("app");
const topbarStatsEl = document.getElementById("topbar-stats");

function updateTopbar() {
  const state = getState();
  topbarStatsEl.innerHTML = `
    <span class="stat-pill stat-pill--streak">🔥 ${state.streak}</span>
    <span class="stat-pill stat-pill--xp">⭐ ${getLevel()}</span>
  `;
}

function updateActiveNav(routeName) {
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.route === routeName);
  });
}

const routes = [
  { pattern: /^\/(home)?$/, name: "home", handler: () => renderHome(appEl) },
  { pattern: /^\/lessons$/, name: "lessons", handler: () => renderLessons(appEl) },
  { pattern: /^\/category\/([^/]+)$/, name: "lessons", handler: (m) => renderCategoryHub(appEl, m[1]) },
  { pattern: /^\/category\/([^/]+)\/flashcards$/, name: "lessons", handler: (m) => renderFlashcards(appEl, m[1]) },
  { pattern: /^\/category\/([^/]+)\/quiz$/, name: "lessons", handler: (m) => renderQuiz(appEl, m[1]) },
  { pattern: /^\/category\/([^/]+)\/listening$/, name: "lessons", handler: (m) => renderListening(appEl, m[1]) },
  { pattern: /^\/category\/([^/]+)\/speaking$/, name: "lessons", handler: (m) => renderSpeaking(appEl, m[1]) },
  { pattern: /^\/grammar$/, name: "grammar", handler: () => renderGrammarList(appEl) },
  { pattern: /^\/grammar\/([^/]+)$/, name: "grammar", handler: (m) => renderGrammarDetail(appEl, m[1]) },
  { pattern: /^\/conversations$/, name: "conversations", handler: () => renderConversationsList(appEl) },
  { pattern: /^\/conversation\/([^/]+)$/, name: "conversations", handler: (m) => renderConversation(appEl, m[1]) },
  { pattern: /^\/profile$/, name: "profile", handler: () => renderProfile(appEl) },
];

export function navigate(path) {
  window.location.hash = `#${path}`;
}

function resolveRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/home";
  for (const route of routes) {
    const match = hash.match(route.pattern);
    if (match) return { route, match };
  }
  return null;
}

function render() {
  const resolved = resolveRoute();
  updateTopbar();
  if (!resolved) {
    appEl.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🤔</div><p>الصفحة غير موجودة</p></div>`;
    updateActiveNav(null);
    return;
  }
  window.scrollTo(0, 0);
  updateActiveNav(resolved.route.name);
  resolved.route.handler(resolved.match);
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);
render();

// إعادة رسم شارة النقاط عند أي تغيير للتقدم (يُستدعى من الواجهات بعد addXp)
window.__refreshTopbar = updateTopbar;
