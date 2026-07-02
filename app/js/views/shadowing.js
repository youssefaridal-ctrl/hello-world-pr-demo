import { getCategoryById } from "../data/vocabulary.js";
import { speakFrench, sttSupported, listenOnce, similarityScore } from "../speech.js";
import { addXp, recordWordResult, recordLastPosition } from "../progress.js";
import { shuffle, showToast, fireConfetti } from "../utils.js";

// Shadowing : on écoute puis on répète IMMÉDIATEMENT, sans revoir le texte au moment de parler,
// pour habituer l'oreille et la bouche au rythme naturel du français (lutte contre le bafouillage).
const PHRASES_PER_ROUND = 6;

export function renderShadowing(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Thème introuvable</p></div>`;
    return;
  }
  recordLastPosition({ hash: `#/category/${cat.id}/shadowing`, label: `Répétition immédiate · ${cat.title}`, icon: cat.icon });

  const words = shuffle(cat.words).slice(0, Math.min(PHRASES_PER_ROUND, cat.words.length));
  let index = 0;
  let totalScore = 0;
  let phase = "ready"; // ready -> listening-model -> repeating -> result
  let listening = false;

  function renderStep() {
    if (index >= words.length) {
      renderResult();
      return;
    }
    const word = words[index];
    container.innerHTML = `
      <a href="#/category/${cat.id}" class="back-link">← Retour</a>
      <div class="page-title">${cat.title} · Répétition immédiate</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(index / words.length) * 100}%"></div></div>
      <p class="speaking-hint" style="text-align:center;">Écoutez le modèle deux fois, puis répétez sans attendre, avec le même rythme.</p>

      <div class="speaking-target" id="target-area" style="visibility:hidden;">
        <div class="speaking-target__fr">${word.fr}</div>
        <div class="speaking-target__translit">[${word.phonetic}]</div>
      </div>

      <div class="speaking-controls">
        <button class="btn btn--primary btn--lg" id="start-btn">▶ Écouter le modèle</button>
      </div>
      <div id="result-area"></div>
    `;

    container.querySelector("#start-btn").addEventListener("click", () => playModelThenListen(word));
  }

  function playModelThenListen(word) {
    const startBtn = container.querySelector("#start-btn");
    startBtn.disabled = true;
    startBtn.textContent = "🔊 Écoutez...";
    speakFrench(word.fr, { rate: 0.85, onEnd: () => {
      setTimeout(() => {
        speakFrench(word.fr, { rate: 1.0, onEnd: () => {
          container.querySelector("#target-area").style.visibility = "visible";
          startShadowListening(word);
        }});
      }, 350);
    }});
  }

  async function startShadowListening(word) {
    if (!sttSupported) {
      const area = container.querySelector("#result-area");
      area.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🎙️</div><p>Reconnaissance vocale non disponible sur ce navigateur.</p></div>
        <button class="btn btn--primary btn--block" id="next-btn">Suivant →</button>`;
      area.querySelector("#next-btn").addEventListener("click", () => { index += 1; renderStep(); });
      return;
    }
    const startBtn = container.querySelector("#start-btn");
    startBtn.textContent = "🎙️ Répétez maintenant !";
    startBtn.classList.add("listening");
    if (listening) return;
    listening = true;
    try {
      const { transcript } = await listenOnce({ timeoutMs: 6000 });
      const score = similarityScore(word.fr, transcript);
      showResult(word, transcript, score);
    } catch {
      showToast("Rien entendu — on réessaie sur la suivante", { type: "error" });
      index += 1;
      renderStep();
    } finally {
      listening = false;
    }
  }

  function showResult(word, transcript, score) {
    totalScore += score;
    recordWordResult(cat.id, word.fr, score >= 55);
    const level = score >= 80 ? "great" : score >= 50 ? "ok" : "retry";
    const message = score >= 80 ? "Rythme naturel, bravo ! 🌟" : score >= 50 ? "Pas mal, gardez ce rythme 👍" : "Trop hésitant, réécoutez et réessayez 🔁";
    const area = container.querySelector("#result-area");
    area.innerHTML = `
      <div class="speaking-result speaking-result--${level}">
        <div class="score-circle" style="--score:${score}"><span>${score}%</span></div>
        <div style="font-weight:700;">${message}</div>
        <div class="transcript-box">J'ai entendu : "${transcript}"</div>
        <button class="btn btn--primary btn--block" id="next-btn" style="margin-top:14px;">Suivant →</button>
      </div>
    `;
    area.querySelector("#next-btn").addEventListener("click", () => { index += 1; renderStep(); });
  }

  function renderResult() {
    const avgScore = words.length ? Math.round(totalScore / words.length) : 0;
    const { newBadges } = addXp(Math.max(Math.round(avgScore / 4), 6));
    window.__refreshTopbar && window.__refreshTopbar();
    if (avgScore >= 75) fireConfetti();

    container.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size:2.4rem;">🪞</div>
        <div class="quiz-result__score">${avgScore}%</div>
        <p class="page-subtitle">Fluidité moyenne de cette session de répétition</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">
          <button class="btn btn--secondary" id="retry-btn">Recommencer</button>
          <button class="btn btn--primary" id="done-btn">Continuer</button>
        </div>
      </div>
    `;
    newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));
    container.querySelector("#retry-btn").addEventListener("click", () => renderShadowing(container, categoryId));
    container.querySelector("#done-btn").addEventListener("click", () => {
      window.location.hash = `#/category/${cat.id}`;
    });
  }

  renderStep();
}
