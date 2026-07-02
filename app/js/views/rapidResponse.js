import { getCategoryById } from "../data/vocabulary.js";
import { speakFrench, sttSupported, listenOnce, similarityScore } from "../speech.js";
import { addXp, recordWordResult, recordLastPosition } from "../progress.js";
import { shuffle, showToast, fireConfetti } from "../utils.js";

// Réponse rapide : seule la définition/situation est affichée (jamais l'expression),
// avec un compte à rebours, pour forcer la production spontanée sans passer par la traduction.
const ROUND_SIZE = 6;
const COUNTDOWN_SECONDS = 3;

export function renderRapidResponse(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Thème introuvable</p></div>`;
    return;
  }
  recordLastPosition({ hash: `#/category/${cat.id}/rapid`, label: `Réponse rapide · ${cat.title}`, icon: cat.icon });

  const words = shuffle(cat.words).slice(0, Math.min(ROUND_SIZE, cat.words.length));
  let index = 0;
  let totalScore = 0;
  let timer = null;

  function renderPrompt() {
    if (index >= words.length) {
      renderResult();
      return;
    }
    const word = words[index];
    container.innerHTML = `
      <a href="#/category/${cat.id}" class="back-link">← Retour</a>
      <div class="page-title">${cat.title} · Réponse rapide</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(index / words.length) * 100}%"></div></div>

      <div class="card" style="margin:18px 0; text-align:center;">
        <div class="speaking-hint" style="margin-bottom:8px;">Comment dites-vous, spontanément :</div>
        <div style="font-weight:700; font-size:1.15rem;">${word.definition}</div>
        <div style="color:var(--text-muted); font-size:0.85rem; margin-top:6px; font-style:italic;">Contexte : « ${word.example.replace(new RegExp(word.fr, "i"), "____")} »</div>
      </div>

      ${sttSupported
        ? `<div class="speaking-controls"><button class="btn btn--primary btn--lg" id="ready-btn">Je suis prêt(e)</button></div>`
        : `<div class="empty-state"><div class="empty-state__icon">🎙️</div><p>Reconnaissance vocale non disponible sur ce navigateur.</p><button class="btn btn--primary" id="reveal-btn">Voir la réponse</button></div>`
      }
      <div id="result-area"></div>
    `;

    const readyBtn = container.querySelector("#ready-btn");
    if (readyBtn) readyBtn.addEventListener("click", () => startCountdown(word));
    const revealBtn = container.querySelector("#reveal-btn");
    if (revealBtn) revealBtn.addEventListener("click", () => revealAnswer(word));
  }

  function startCountdown(word) {
    const readyBtn = container.querySelector("#ready-btn");
    let count = COUNTDOWN_SECONDS;
    readyBtn.disabled = true;
    readyBtn.textContent = `${count}...`;
    timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        readyBtn.textContent = `${count}...`;
      } else {
        clearInterval(timer);
        readyBtn.textContent = "🎙️ Parlez !";
        readyBtn.classList.add("listening");
        listen(word);
      }
    }, 700);
  }

  async function listen(word) {
    try {
      const { transcript } = await listenOnce({ timeoutMs: 6000 });
      const score = similarityScore(word.fr, transcript);
      showResult(word, transcript, score);
    } catch {
      showResult(word, "(silence)", 0);
    }
  }

  function revealAnswer(word) {
    speakFrench(word.fr);
    const area = container.querySelector("#result-area");
    area.innerHTML = `
      <div class="speaking-result speaking-result--ok">
        <div style="font-weight:700;">${word.fr}</div>
        <button class="btn btn--primary btn--block" id="next-btn" style="margin-top:14px;">Suivant →</button>
      </div>`;
    area.querySelector("#next-btn").addEventListener("click", () => { index += 1; renderPrompt(); });
  }

  function showResult(word, transcript, score) {
    totalScore += score;
    recordWordResult(cat.id, word.fr, score >= 50);
    const level = score >= 75 ? "great" : score >= 45 ? "ok" : "retry";
    const message = score >= 75 ? "Réflexe parfait ! 🌟" : score >= 45 ? "Bien, la bonne idée y était 👍" : "Pas trouvé — écoutez la réponse";
    const area = container.querySelector("#result-area");
    area.innerHTML = `
      <div class="speaking-result speaking-result--${level}">
        <div class="score-circle" style="--score:${score}"><span>${score}%</span></div>
        <div style="font-weight:700;">${message}</div>
        <div class="transcript-box">Attendu : "${word.fr}"<br/>Vous avez dit : "${transcript}"</div>
        <button class="btn btn--primary btn--block" id="next-btn" style="margin-top:14px;">Suivant →</button>
      </div>
    `;
    area.querySelector("#next-btn").addEventListener("click", () => { index += 1; renderPrompt(); });
  }

  function renderResult() {
    const avgScore = words.length ? Math.round(totalScore / words.length) : 0;
    const { newBadges } = addXp(Math.max(Math.round(avgScore / 4), 6));
    window.__refreshTopbar && window.__refreshTopbar();
    if (avgScore >= 70) fireConfetti();

    container.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size:2.4rem;">⏱️</div>
        <div class="quiz-result__score">${avgScore}%</div>
        <p class="page-subtitle">Vitesse de réaction moyenne pour cette session</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">
          <button class="btn btn--secondary" id="retry-btn">Recommencer</button>
          <button class="btn btn--primary" id="done-btn">Continuer</button>
        </div>
      </div>
    `;
    newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));
    container.querySelector("#retry-btn").addEventListener("click", () => renderRapidResponse(container, categoryId));
    container.querySelector("#done-btn").addEventListener("click", () => {
      window.location.hash = `#/category/${cat.id}`;
    });
  }

  renderPrompt();
}
