import { getState, getLevel, getXpIntoLevel } from "./progress.js";
import { renderHome } from "./views/home.js";
import { renderLessons } from "./views/lessons.js";
import { renderCategoryHub } from "./views/categoryHub.js";
import { renderFlashcards } from "./views/flashcards.js";
import { renderQuiz } from "./views/quiz.js";
import { renderListening } from "./views/listening.js";
import { renderSpeaking } from "./views/speaking.js";
import { renderShadowing } from "./views/shadowing.js";
import { renderRapidResponse } from "./views/rapidResponse.js";
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
  { pattern: /^\/category\/([^/]+)\/shadowing$/, name: "lessons", handler: (m) => renderShadowing(appEl, m[1]) },
  { pattern: /^\/category\/([^/]+)\/rapid$/, name: "lessons", handler: (m) => renderRapidResponse(appEl, m[1]) },
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
    appEl.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🤔</div><p>Page introuvable</p></div>`;
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

// Redessine la pastille de score après tout changement de progression (appelé depuis les vues après addXp)
window.__refreshTopbar = updateTopbar;

// PWA : enregistre le service worker et prévient l'utilisateur quand une nouvelle version
// (nouvelles leçons, nouveaux exercices, changements de structure) est prête à être installée.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateBanner(registration);
          }
        });
      });
    }).catch(() => {});
  });

  // Ne recharger que si NOUS avons déclenché la mise à jour (clic sur la bannière) —
  // sinon la simple prise de contrôle par le premier service worker installé
  // (self.clients.claim() au tout premier chargement) provoquerait un rechargement inutile.
  let updateRequested = false;
  let reloadingAfterUpdate = false;
  window.__requestSwUpdate = () => { updateRequested = true; };
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!updateRequested || reloadingAfterUpdate) return;
    reloadingAfterUpdate = true;
    window.location.reload();
  });
}

function showUpdateBanner(registration) {
  const banner = document.getElementById("update-banner");
  const btn = document.getElementById("update-banner-btn");
  if (!banner || !btn) return;
  banner.hidden = false;
  btn.addEventListener("click", () => {
    if (registration.waiting) {
      window.__requestSwUpdate && window.__requestSwUpdate();
      registration.waiting.postMessage("SKIP_WAITING");
    }
    banner.hidden = true;
  });
}
