import { conversations } from "../data/conversations.js";
import { speakFrench, sttSupported, listenOnce, similarityScore } from "../speech.js";
import { addXp, markConversationDone } from "../progress.js";
import { showToast, fireConfetti } from "../utils.js";

const PASS_THRESHOLD = 45;

export function renderConversation(container, convId) {
  const conv = conversations.find((c) => c.id === convId);
  if (!conv) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Conversation introuvable</p></div>`;
    return;
  }

  let cursor = 0;
  let listening = false;
  let totalScore = 0;
  let userTurns = 0;

  function lineHtml(line) {
    const roleClass = line.role === "teacher" ? "dialogue-line--teacher" : "dialogue-line--user";
    const speaker = line.role === "teacher" ? "Professeure Sophie 👩‍🏫" : "Vous 🗣️";
    return `
      <div class="dialogue-line ${roleClass}">
        <div class="dialogue-flow">
          <div class="dialogue-speaker">${speaker}</div>
          <div class="dialogue-bubble replay-audio" data-fr="${encodeURIComponent(line.fr)}">${line.fr}</div>
        </div>
      </div>
    `;
  }

  function render() {
    const revealed = conv.lines.slice(0, cursor);
    const next = conv.lines[cursor];

    container.innerHTML = `
      <a href="#/conversations" class="back-link">← Retour aux conversations</a>
      <div class="page-title" style="margin-bottom:2px;">${conv.icon} ${conv.title}</div>
      <div class="page-subtitle">${conv.description}</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(cursor / conv.lines.length) * 100}%"></div></div>
      <div id="chat-log">${revealed.map(lineHtml).join("")}</div>
      <div class="conversation-stage" id="stage"></div>
    `;

    container.querySelectorAll(".replay-audio").forEach((el) => {
      el.addEventListener("click", () => speakFrench(decodeURIComponent(el.dataset.fr)));
    });

    const stage = container.querySelector("#stage");

    if (!next) {
      renderCompletion(stage);
      return;
    }

    if (next.role === "teacher") {
      stage.innerHTML = `
        <button class="btn btn--primary btn--block" id="continue-btn">▶ Écouter et continuer</button>
      `;
      stage.querySelector("#continue-btn").addEventListener("click", () => {
        speakFrench(next.fr);
        cursor += 1;
        render();
      });
    } else {
      stage.innerHTML = `
        <div class="card" style="margin-bottom:10px;">
          <div class="speaking-hint" style="margin-bottom:8px;">Dites cette phrase :</div>
          <div class="speaking-target__fr" style="text-align:center;">${next.fr}</div>
        </div>
        <div style="display:flex; align-items:center; justify-content:center; gap:14px;">
          <button class="icon-btn" id="hear-btn" style="width:52px;height:52px;font-size:1.3rem;">🔊</button>
          ${
            sttSupported
              ? `<button class="btn--icon-round" id="mic-btn">🎙️</button>`
              : ``
          }
          <button class="icon-btn" id="skip-btn" style="width:52px;height:52px;font-size:1.3rem;">⏭️</button>
        </div>
        <div id="conv-result"></div>
        ${!sttSupported ? `<p class="speaking-hint" style="text-align:center;margin-top:10px;">Reconnaissance vocale indisponible ici — dites la phrase à voix haute, puis appuyez sur ⏭️ pour continuer.</p>` : ""}
      `;
      stage.querySelector("#hear-btn").addEventListener("click", () => speakFrench(next.fr));
      stage.querySelector("#skip-btn").addEventListener("click", () => advanceUserLine(next));
      const micBtn = stage.querySelector("#mic-btn");
      if (micBtn) micBtn.addEventListener("click", () => handleMic(next, micBtn, stage));
    }
  }

  async function handleMic(line, micBtn, stage) {
    if (listening) return;
    listening = true;
    micBtn.classList.add("listening");
    try {
      const { transcript } = await listenOnce({ timeoutMs: 8000 });
      const score = similarityScore(line.fr, transcript);
      totalScore += score;
      userTurns += 1;
      const resultArea = stage.querySelector("#conv-result");
      const level = score >= 80 ? "great" : score >= PASS_THRESHOLD ? "ok" : "retry";
      const msg = score >= 80 ? "Très bonne prononciation ! 🌟" : score >= PASS_THRESHOLD ? "Bien, c'est compréhensible 👍" : "Pas tout à fait, réessayez";
      resultArea.innerHTML = `
        <div class="speaking-result speaking-result--${level}">
          <div class="score-circle" style="--score:${score}"><span>${score}%</span></div>
          <div style="font-weight:700;">${msg}</div>
          <div class="transcript-box">J'ai entendu : "${transcript}"</div>
        </div>
      `;
      if (score >= PASS_THRESHOLD) {
        setTimeout(() => advanceUserLine(line), 900);
      }
    } catch (err) {
      showToast("Rien entendu, réessayez", { type: "error" });
    } finally {
      listening = false;
      micBtn.classList.remove("listening");
    }
  }

  function advanceUserLine() {
    cursor += 1;
    render();
  }

  function renderCompletion(stage) {
    const avgScore = userTurns ? Math.round(totalScore / userTurns) : 100;
    markConversationDone(conv.id);
    const { newBadges } = addXp(25);
    window.__refreshTopbar && window.__refreshTopbar();
    if (avgScore >= 70) fireConfetti();
    newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));

    stage.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size:2.4rem;">🎉</div>
        <div style="font-weight:700; font-size:1.2rem; margin:6px 0;">Bravo, conversation terminée !</div>
        <p class="page-subtitle">+25 points d'expérience${userTurns ? ` · précision moyenne ${avgScore}%` : ""}</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
          <button class="btn btn--secondary" id="retry-conv-btn">Rejouer</button>
          <a href="#/conversations" class="btn btn--primary">Autres conversations</a>
        </div>
      </div>
    `;
    stage.querySelector("#retry-conv-btn").addEventListener("click", () => renderConversation(container, convId));
  }

  render();
}
