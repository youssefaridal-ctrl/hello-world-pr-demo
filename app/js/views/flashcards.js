import { getCategoryById } from "../data/vocabulary.js";
import { speakFrench } from "../speech.js";
import { addXp, recordWordResult } from "../progress.js";
import { showToast } from "../utils.js";

export function renderFlashcards(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>الفئة غير موجودة</p></div>`;
    return;
  }
  let index = 0;
  let flipped = false;
  let xpAwarded = false;

  function renderCard() {
    const word = cat.words[index];
    container.innerHTML = `
      <a href="#/category/${cat.id}" class="back-link">→ رجوع</a>
      <div class="page-title">${cat.title} · بطاقات تعليمية</div>
      <div class="flashcard-wrap">
        <div class="flashcard-counter">${index + 1} / ${cat.words.length}</div>
        <div class="flashcard ${flipped ? "flipped" : ""}" id="flashcard">
          <div class="flashcard__inner">
            <div class="flashcard__face flashcard__face--front">
              <div class="flashcard__word fr-text">${word.fr}</div>
              <div class="flashcard__hint">${word.translit}</div>
              <button class="icon-btn" id="speak-btn" aria-label="استمع">🔊</button>
            </div>
            <div class="flashcard__face flashcard__face--back">
              <div class="flashcard__word">${word.ar}</div>
              <div class="flashcard__example fr-text">${word.example.fr}</div>
              <div class="flashcard__example">${word.example.ar}</div>
            </div>
          </div>
        </div>
        <div class="flashcard-nav">
          <button class="icon-btn" id="prev-btn" ${index === 0 ? "disabled" : ""}>→</button>
          <button class="btn btn--secondary" id="flip-btn">${flipped ? "الوجه الآخر" : "اقلب البطاقة"}</button>
          <button class="icon-btn" id="next-btn">←</button>
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
          showToast("أحسنت! أنهيت كل البطاقات 🎉 +15 نقطة", { type: "success" });
          newBadges.forEach((b) => showToast(`وسام جديد: ${b.icon} ${b.label}`, { type: "info" }));
        }
        window.location.hash = `#/category/${cat.id}`;
      }
    });

    speakFrench(word.fr);
  }

  function toggleFlip() {
    flipped = !flipped;
    container.querySelector("#flashcard").classList.toggle("flipped", flipped);
    container.querySelector("#flip-btn").textContent = flipped ? "الوجه الآخر" : "اقلب البطاقة";
  }

  renderCard();
}
