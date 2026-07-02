import { conversations } from "../data/conversations.js";
import { getState } from "../progress.js";

export function renderConversationsList(container) {
  const state = getState();
  container.innerHTML = `
    <div class="page-title">محادثات تفاعلية</div>
    <div class="page-subtitle">تدرّب على التحدث في مواقف حقيقية مع "الأستاذة صوفي" الافتراضية.</div>
    ${conversations.map((conv) => `
      <a href="#/conversation/${conv.id}" class="conversation-card" style="background: var(--bg-card);">
        <div class="hub-header__icon" style="background:var(--color-primary);">${conv.icon}</div>
        <div style="flex:1;">
          <div class="conversation-list__title">${conv.title} ${state.conversationsDone[conv.id] ? "✅" : ""}</div>
          <div class="page-subtitle" style="margin:2px 0 6px;">${conv.description}</div>
          <span class="conversation-list__level">${conv.level}</span>
        </div>
      </a>
    `).join("")}
  `;
}
