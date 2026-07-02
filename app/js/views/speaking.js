import { getCategoryById } from "../data/vocabulary.js";
import { speakFrench, sttSupported, listenOnce, similarityScore } from "../speech.js";
import { addXp, recordWordResult } from "../progress.js";
import { shuffle, showToast, fireConfetti } from "../utils.js";

const WORDS_PER_ROUND = 8;

export function renderSpeaking(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Thème introuvable</p></div>`;
    return;
  }

  const words = shuffle(cat.words).slice(0, Math.min(WORDS_PER_ROUND, cat.words.length));
  let index = 0;
  let totalScore = 0;
  let listening = false;

  function renderWord() {
    if (index >= words.length) {
      renderResult();
      return;
    }
    const word = words[index];
    container.innerHTML = `
      <a href="#/category/${cat.id}" class="back-link">← Retour</a>
      <div class="page-title">${cat.title} · Prise de parole</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(index / words.length) * 100}%"></div></div>

      <div class="speaking-target">
        <div class="speaking-target__fr">${word.fr}</div>
        <div class="speaking-target__translit">[${word.phonetic}]</div>
        <div class="speaking-target__ar">${word.definition}</div>
      </div>

      <div class="speaking-controls">
        <button class="icon-btn" id="listen-btn" aria-label="Écouter la prononciation" style="width:56px;height:56px;font-size:1.4rem;">🔊</button>
        ${
          sttSupported
            ? `<button class="btn--icon-round" id="mic-btn" aria-label="Appuyez et parlez">🎙️</button>
               <div class="speaking-hint" id="mic-hint">Appuyez sur le micro et prononcez la phrase clairement</div>`
            : `<div class="empty-state"><div class="empty-state__icon">🎙️</div><p>Votre navigateur ne supporte pas la reconnaissance vocale. Essayez Chrome sur ordinateur ou Android.</p></div>`
        }
      </div>
      <div id="result-area"></div>
      ${sttSupported ? `<button class="btn btn--ghost btn--block" id="skip-btn">Passer cette expression</button>` : `<button class="btn btn--primary btn--block" id="skip-btn">Suivant</button>`}
    `;

    container.querySelector("#listen-btn").addEventListener("click", () => speakFrench(word.fr));
    container.querySelector("#skip-btn").addEventListener("click", () => nextWord());

    const micBtn = container.querySelector("#mic-btn");
    if (micBtn) {
      micBtn.addEventListener("click", () => startListening(word, micBtn));
    }

    speakFrench(word.fr);
  }

  async function startListening(word, micBtn) {
    if (listening) return;
    listening = true;
    micBtn.classList.add("listening");
    const hint = container.querySelector("#mic-hint");
    if (hint) hint.textContent = "🎙️ Je vous écoute... parlez maintenant";

    try {
      const { transcript } = await listenOnce({ timeoutMs: 7000 });
      const score = similarityScore(word.fr, transcript);
      showResult(word, transcript, score);
    } catch (err) {
      const message = err.message === "TIMEOUT" || err.message === "NO_SPEECH"
        ? "Je n'ai rien entendu, réessayez en parlant clairement"
        : "Erreur de reconnaissance vocale, réessayez"
      showToast(message, { type: "error" });
    } finally {
      listening = false;
      micBtn.classList.remove("listening");
      if (hint) hint.textContent = "Appuyez sur le micro et prononcez la phrase clairement";
    }
  }

  function showResult(word, transcript, score) {
    totalScore += score;
    recordWordResult(cat.id, word.fr, score >= 60);
    const level = score >= 85 ? "great" : score >= 55 ? "ok" : "retry";
    const message = score >= 85 ? "Excellente prononciation ! 🌟" : score >= 55 ? "Bien, continuez à progresser 👍" : "Réessayez, écoutez bien puis répétez 🔁";
    const area = container.querySelector("#result-area");
    area.innerHTML = `
      <div class="speaking-result speaking-result--${level}" style="--score:${score}">
        <div class="score-circle" style="--score:${score}"><span>${score}%</span></div>
        <div style="font-weight:700;">${message}</div>
        <div class="transcript-box">J'ai entendu : "${transcript}"</div>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:14px;">
          <button class="btn btn--secondary" id="retry-word-btn">Réessayer</button>
          <button class="btn btn--primary" id="next-word-btn">Suivant →</button>
        </div>
      </div>
    `;
    container.querySelector("#retry-word-btn").addEventListener("click", () => renderWord());
    container.querySelector("#next-word-btn").addEventListener("click", () => nextWord());
  }

  function nextWord() {
    index += 1;
    renderWord();
  }

  function renderResult() {
    const avgScore = words.length ? Math.round(totalScore / words.length) : 0;
    const xpEarned = Math.round(avgScore / 5);
    const { newBadges } = addXp(Math.max(xpEarned, 5));
    window.__refreshTopbar && window.__refreshTopbar();
    if (avgScore >= 80) fireConfetti();

    container.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size:2.4rem;">🎙️</div>
        <div class="quiz-result__score">${avgScore}%</div>
        <p class="page-subtitle">Précision moyenne de prononciation pour cette session</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">
          <button class="btn btn--secondary" id="retry-btn">Recommencer</button>
          <button class="btn btn--primary" id="done-btn">Continuer</button>
        </div>
      </div>
    `;
    newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));
    container.querySelector("#retry-btn").addEventListener("click", () => renderSpeaking(container, categoryId));
    container.querySelector("#done-btn").addEventListener("click", () => {
      window.location.hash = `#/category/${cat.id}`;
    });
  }

  renderWord();
}
