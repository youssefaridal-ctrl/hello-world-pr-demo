import { placementTest, scoreToLevel } from "../data/placementTest.js";
import { setCecrlLevel, addXp } from "../progress.js";
import { shuffle, showToast, fireConfetti } from "../utils.js";

const LEVEL_INFO = {
  B1: {
    title: "Intermédiaire (B1)",
    desc: "Vous communiquez sur des sujets familiers, mais vous cherchez encore vos mots à l'oral. L'app va d'abord renforcer les automatismes de fluidité de base.",
  },
  B2: {
    title: "Intermédiaire avancé (B2)",
    desc: "Vous vous exprimez avec aisance sur la plupart des sujets. L'app va affiner vos nuances, vos connecteurs et votre spontanéité à l'oral.",
  },
  C1: {
    title: "Avancé (C1)",
    desc: "Vous maîtrisez des structures complexes. L'app va peaufiner votre registre, vos automatismes en situation professionnelle et votre fluidité totale.",
  },
};

export function renderPlacementTest(container) {
  let started = false;
  let index = 0;
  let correctCount = 0;
  const questions = shuffle(placementTest);

  function renderIntro() {
    container.innerHTML = `
      <div class="page-title">Test de positionnement</div>
      <p class="page-subtitle">
        Avant de commencer, répondez à ${questions.length} questions (grammaire, expressions, nuances)
        comme dans un test d'un institut de français. Cela permet de démarrer directement au bon niveau,
        sans repasser par des bases que vous maîtrisez déjà.
      </p>
      <div class="card" style="margin-bottom:16px;">
        <div style="font-weight:700; margin-bottom:6px;">Comment ça marche</div>
        <div style="color:var(--text-muted); font-size:0.9rem; line-height:1.8;">
          Choisissez la meilleure réponse pour chaque question. Ne réfléchissez pas trop longtemps —
          répondez avec ce qui vous vient naturellement, comme à l'oral.
        </div>
      </div>
      <button class="btn btn--primary btn--block btn--lg" id="start-test-btn">Commencer le test</button>
      <button class="btn btn--ghost btn--block" id="skip-test-btn" style="margin-top:10px;">Choisir mon niveau moi-même</button>
    `;
    container.querySelector("#start-test-btn").addEventListener("click", () => {
      started = true;
      renderQuestion();
    });
    container.querySelector("#skip-test-btn").addEventListener("click", renderManualChoice);
  }

  function renderManualChoice() {
    container.innerHTML = `
      <div class="page-title">Choisissez votre niveau</div>
      <p class="page-subtitle">Sélectionnez le palier qui vous correspond le mieux.</p>
      ${Object.entries(LEVEL_INFO).map(([code, info]) => `
        <button class="card manual-level-btn" data-level="${code}" style="display:block; width:100%; text-align:right; margin-bottom:12px; border:2px solid var(--border-soft);">
          <div style="font-weight:700; color:var(--color-primary);">${info.title}</div>
          <div style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">${info.desc}</div>
        </button>
      `).join("")}
      <button class="btn btn--ghost btn--block" id="back-to-test-btn">Repasser par le test</button>
    `;
    container.querySelectorAll(".manual-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => finish(btn.dataset.level));
    });
    container.querySelector("#back-to-test-btn").addEventListener("click", renderIntro);
  }

  function renderQuestion() {
    if (index >= questions.length) {
      const level = scoreToLevel(correctCount, questions.length);
      finish(level);
      return;
    }
    const q = questions[index];
    container.innerHTML = `
      <div class="page-title">Test de positionnement</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(index / questions.length) * 100}%"></div></div>
      <div class="quiz-question fr-text">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option fr-text" data-i="${i}">${opt}</button>`).join("")}
      </div>
    `;
    container.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(btn, q));
    });
  }

  function handleAnswer(btn, q) {
    const chosen = Number(btn.dataset.i);
    if (chosen === q.correctIndex) correctCount += 1;
    container.querySelectorAll(".quiz-option").forEach((b) => {
      b.classList.add("disabled");
      if (b === btn) b.classList.add("correct");
    });
    setTimeout(() => {
      index += 1;
      renderQuestion();
    }, 350);
  }

  function finish(level) {
    setCecrlLevel(level);
    const { newBadges } = addXp(20);
    window.__refreshTopbar && window.__refreshTopbar();
    fireConfetti(40);
    const info = LEVEL_INFO[level];
    container.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size:2.4rem;">🎓</div>
        <div style="font-weight:700; font-size:1.3rem; margin:6px 0; color:var(--color-primary);">${info.title}</div>
        <p class="page-subtitle">${info.desc}</p>
        <button class="btn btn--primary btn--block btn--lg" id="continue-btn" style="margin-top:14px;">Commencer à Aridal Lab</button>
      </div>
    `;
    newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));
    container.querySelector("#continue-btn").addEventListener("click", () => {
      window.location.hash = "#/home";
    });
  }

  renderIntro();
}
