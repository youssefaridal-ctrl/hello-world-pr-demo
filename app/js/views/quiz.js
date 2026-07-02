import { getCategoryById, getAllWords } from "../data/vocabulary.js";
import { addXp, recordWordResult } from "../progress.js";
import { shuffle, sample, showToast, fireConfetti } from "../utils.js";

const QUESTIONS_PER_ROUND = 8;

export function renderQuiz(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>الفئة غير موجودة</p></div>`;
    return;
  }

  const pool = shuffle(cat.words).slice(0, Math.min(QUESTIONS_PER_ROUND, cat.words.length));
  const allOtherWords = getAllWords().filter((w) => w.categoryId !== cat.id || !pool.includes(w));

  const questions = pool.map((word) => {
    const distractors = sample(
      allOtherWords.length >= 3 ? allOtherWords : getAllWords().filter((w) => w.fr !== word.fr),
      3
    ).map((w) => w.ar);
    const options = shuffle([word.ar, ...distractors]);
    return { word, options, askFrench: true };
  });

  let current = 0;
  let correctCount = 0;

  function renderQuestion() {
    if (current >= questions.length) {
      renderResult();
      return;
    }
    const q = questions[current];
    container.innerHTML = `
      <a href="#/category/${cat.id}" class="back-link">→ رجوع</a>
      <div class="page-title">${cat.title} · اختبار سريع</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(current / questions.length) * 100}%"></div></div>
      <div class="quiz-question fr-text">${q.word.fr}</div>
      <div class="quiz-options">
        ${q.options.map((opt) => `<button class="quiz-option" data-opt="${encodeURIComponent(opt)}">${opt}</button>`).join("")}
      </div>
      <div class="quiz-feedback" id="feedback"></div>
    `;

    container.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(btn, q));
    });
  }

  function handleAnswer(btn, q) {
    const chosen = decodeURIComponent(btn.dataset.opt);
    const isCorrect = chosen === q.word.ar;
    container.querySelectorAll(".quiz-option").forEach((b) => {
      b.classList.add("disabled");
      const val = decodeURIComponent(b.dataset.opt);
      if (val === q.word.ar) b.classList.add("correct");
      else if (b === btn) b.classList.add("wrong");
    });
    recordWordResult(cat.id, q.word.fr, isCorrect);
    const feedback = container.querySelector("#feedback");
    if (isCorrect) {
      correctCount += 1;
      feedback.textContent = "إجابة صحيحة! ✅";
      feedback.className = "quiz-feedback correct";
    } else {
      feedback.textContent = `إجابة خاطئة، الصحيح: ${q.word.ar}`;
      feedback.className = "quiz-feedback wrong";
    }
    setTimeout(() => {
      current += 1;
      renderQuestion();
    }, 1100);
  }

  function renderResult() {
    const percent = Math.round((correctCount / questions.length) * 100);
    const xpEarned = correctCount * 5;
    const { newBadges } = addXp(xpEarned);
    window.__refreshTopbar && window.__refreshTopbar();
    if (percent >= 80) fireConfetti();

    container.innerHTML = `
      <div class="quiz-result card">
        <div style="font-size:2.4rem;">${percent >= 80 ? "🏆" : percent >= 50 ? "👏" : "💪"}</div>
        <div class="quiz-result__score num-ratio">${correctCount}/${questions.length}</div>
        <p class="page-subtitle">حصلت على ${xpEarned} نقطة خبرة</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">
          <button class="btn btn--secondary" id="retry-btn">إعادة المحاولة</button>
          <button class="btn btn--primary" id="done-btn">متابعة</button>
        </div>
      </div>
    `;
    newBadges.forEach((b) => showToast(`وسام جديد: ${b.icon} ${b.label}`, { type: "info" }));
    container.querySelector("#retry-btn").addEventListener("click", () => renderQuiz(container, categoryId));
    container.querySelector("#done-btn").addEventListener("click", () => {
      window.location.hash = `#/category/${cat.id}`;
    });
  }

  renderQuestion();
}
