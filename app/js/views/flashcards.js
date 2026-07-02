import { getCategoryById } from "../data/vocabulary.js";
import { speakFrench } from "../speech.js";
import { addXp, recordWordResult } from "../progress.js";
import { showToast } from "../utils.js";

export function renderFlashcards(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Thème introuvable</p></div>`;
    return;
  }
  let index = 0;
  let flipped = false;
  let xpAwarded = false;

  function renderCard() {
    const word = cat.words[index];
    container.innerHTML = `
      <a href="#/category/${cat.id}" class="back-link">← Retour</a>
      <div class="page-title">${cat.title} · Cartes mémo</div>
      <div class="flashcard-wrap">
        <div class="flashcard-counter num-ratio">${index + 1} / ${cat.words.length}</div>
        <div class="flashcard ${flipped ? "flipped" : ""}" id="flashcard">
          <div class="flashcard__inner">
            <div class="flashcard__face flashcard__face--front">
              <div class="flashcard__word fr-text">${word.fr}</div>
              <div class="flashcard__hint">[${word.phonetic}]</div>
              <button class="icon-btn" id="speak-btn" aria-label="Écouter">🔊</button>
            </div>
            <div class="flashcard__face flashcard__face--back">
              <span class="register-tag">${word.register}</span>
              <div class="flashcard__word" style="font-size:1.15rem;">${word.definition}</div>
              <div class="flashcard__example fr-text">« ${word.example} »</div>
            </div>
          </div>
        </div>
        <div class="flashcard-nav">
          <button class="icon-btn" id="prev-btn" ${index === 0 ? "disabled" : ""}>←</button>
          <button class="btn btn--secondary" id="flip-btn">${flipped ? "Voir l'expression" : "Voir le sens"}</button>
          <button class="icon-btn" id="next-btn">→</button>
        </div>
      </div>
    `;

    container.querySelector("#flashcard").addEventListener("click", (e) => {
      if (e.target.closest("#speak-btn")) return;
      toggleFlip();
    });
    container.querySelector("#flip-btn").addEventListener("click", toggleFlip);
    container.querySelector("#speak-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      speakFrench(word.fr);
    });
    container.querySelector("#prev-btn").addEventListener("click", () => {
      if (index > 0) {
        index -= 1;
        flipped = false;
        renderCard();
      }
    });
    container.querySelector("#next-btn").addEventListener("click", () => {
      recordWordResult(cat.id, word.fr, true);
      if (index < cat.words.length - 1) {
        index += 1;
        flipped = false;
        renderCard();
      } else {
        if (!xpAwarded) {
          xpAwarded = true;
          const { newBadges } = addXp(15);
          window.__refreshTopbar && window.__refreshTopbar();
          showToast("Bravo, série terminée ! +15 points", { type: "success" });
          newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));
        }
        window.location.hash = `#/category/${cat.id}`;
      }
    });

    speakFrench(word.fr);
  }

  function toggleFlip() {
    flipped = !flipped;
    container.querySelector("#flashcard").classList.toggle("flipped", flipped);
    container.querySelector("#flip-btn").textContent = flipped ? "Voir l'expression" : "Voir le sens";
  }

  renderCard();
}
