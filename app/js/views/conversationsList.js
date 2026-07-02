import { conversations } from "../data/conversations.js";
import { getState, isLevelUnlocked } from "../progress.js";
import { showToast } from "../utils.js";

export function renderConversationsList(container) {
  const state = getState();
  container.innerHTML = `
    <div class="page-title">Conversations simulées</div>
    <div class="page-subtitle">Entraînez-vous à parler dans des situations réelles avec « Professeure Sophie ».</div>
    ${conversations.map((conv) => {
      const unlocked = isLevelUnlocked(conv.cecrl);
      return `
      <a href="${unlocked ? `#/conversation/${conv.id}` : "#"}" class="conversation-card ${unlocked ? "" : "locked"}" data-locked="${!unlocked}" data-conv="${conv.id}" style="background: var(--bg-card);">
        <div class="hub-header__icon" style="background:var(--color-primary);">${conv.icon}</div>
        <div style="flex:1;">
          <div class="conversation-list__title">${conv.title} ${unlocked ? (state.conversationsDone[conv.id] ? "✅" : "") : "🔒"}</div>
          <div class="page-subtitle" style="margin:2px 0 6px;">${conv.description}</div>
          <span class="level-badge level-badge--${conv.cecrl}">${conv.cecrl}</span>
        </div>
      </a>
    `;
    }).join("")}
  `;

  container.querySelectorAll('.conversation-card[data-locked="true"]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const conv = conversations.find((c) => c.id === el.dataset.conv);
      showToast(`Niveau ${conv.cecrl} pas encore débloqué — continuez à pratiquer pour l'ouvrir 🔒`, { type: "info" });
    });
  });
}
