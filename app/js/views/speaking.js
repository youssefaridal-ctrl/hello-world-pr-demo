import { getCategoryById } from "../data/vocabulary.js";
import { speakFrench, sttSupported, listenOnce, similarityScore } from "../speech.js";
import { addXp, recordWordResult } from "../progress.js";
import { shuffle, showToast, fireConfetti } from "../utils.js";

const WORDS_PER_ROUND = 8;

export function renderSpeaking(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>الفئة غير موجودة</p></div>`;
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
      <a href="#/category/${cat.id}" class="back-link">→ رجوع</a>
      <div class="page-title">${cat.title} · تدرّب على النطق</div>
      <div class="quiz-progress progress-track"><div class="progress-track__bar" style="width:${(index / words.length) * 100}%"></div></div>

      <div class="speaking-target">
        <div class="speaking-target__fr">${word.fr}</div>
        <div class="speaking-target__translit">${word.translit}</div>
        <div class="speaking-target__ar">${word.ar}</div>
      </div>

      <div class="speaking-controls">
        <button class="icon-btn" id="listen-btn" aria-label="استمع للنطق الصحيح" style="width:56px;height:56px;font-size:1.4rem;">🔊</button>
        ${
          sttSupported
            ? `<button class="btn--icon-round" id="mic-btn" aria-label="اضغط وتحدث">🎙️</button>
               <div class="speaking-hint" id="mic-hint">اضغط على الميكروفون وانطق الكلمة بصوت واضح</div>`
            : `<div class="empty-state"><div class="empty-state__icon">🎙️</div><p>متصفحك لا يدعم التعرف على الصوت. جرّب متصفح Chrome على الحاسوب أو أندرويد.</p></div>`
        }
      </div>
      <div id="result-area"></div>
      ${sttSupported ? `<button class="btn btn--ghost btn--block" id="skip-btn">تخطي هذه الكلمة</button>` : `<button class="btn btn--primary btn--block" id="skip-btn">التالي</button>`}
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
    if (hint) hint.textContent = "🎙️ أستمع الآن... تحدث الآن";

    try {
      const { transcript } = await listenOnce({ timeoutMs: 7000 });
      const score = similarityScore(word.fr, transcript);
      showResult(word, transcript, score);
    } catch (err) {
      const message = err.message === "TIMEOUT" || err.message === "NO_SPEECH"
        ? "لم أسمع شيئاً، حاول مرة أخرى وتحدث بوضوح"
        : "حدث خطأ في التعرف على الصوت، حاول مجدداً";
      showToast(message, { type: "error" });
    } finally {
      listening = false;
      micBtn.classList.remove("listening");
      if (hint) hint.textContent = "اضغط على الميكروفون وانطق الكلمة بصوت واضح";
    }
  }

  function showResult(word, transcript, score) {
    totalScore += score;
    recordWordResult(cat.id, word.fr, score >= 60);
    const level = score >= 85 ? "great" : score >= 55 ? "ok" : "retry";
    const message = score >= 85 ? "نطق ممتاز! 🌟" : score >= 55 ? "جيد، استمر بالتحسن 👍" : "حاول مرة أخرى، استمع جيداً ثم كرر 🔁";
    const area = container.querySelector("#result-area");
    area.innerHTML = `
      <div class="speaking-result speaking-result--${level}" style="--score:${score}">
        <div class="score-circle" style="--score:${score}"><span>${score}%</span></div>
        <div style="font-weight:700;">${message}</div>
        <div class="transcript-box">سمعت: "${transcript}"</div>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:14px;">
          <button class="btn btn--secondary" id="retry-word-btn">حاول مجدداً</button>
          <button class="btn btn--primary" id="next-word-btn">التالي ←</button>
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
        <p class="page-subtitle">متوسط دقة النطق في هذه الجلسة</p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">
          <button class="btn btn--secondary" id="retry-btn">إعادة المحاولة</button>
          <button class="btn btn--primary" id="done-btn">متابعة</button>
        </div>
      </div>
    `;
    newBadges.forEach((b) => showToast(`وسام جديد: ${b.icon} ${b.label}`, { type: "info" }));
    container.querySelector("#retry-btn").addEventListener("click", () => renderSpeaking(container, categoryId));
    container.querySelector("#done-btn").addEventListener("click", () => {
      window.location.hash = `#/category/${cat.id}`;
    });
  }

  renderWord();
}
