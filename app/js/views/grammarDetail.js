import { grammarLessons } from "../data/grammar.js";
import { speakFrench } from "../speech.js";
import { addXp, markLessonComplete, isLessonComplete } from "../progress.js";
import { showToast } from "../utils.js";

export function renderGrammarDetail(container, lessonId) {
  const lesson = grammarLessons.find((l) => l.id === lessonId);
  if (!lesson) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>الدرس غير موجود</p></div>`;
    return;
  }

  const progressKey = `grammar:${lesson.id}`;
  const alreadyDone = isLessonComplete(progressKey);

  container.innerHTML = `
    <a href="#/grammar" class="back-link">→ رجوع إلى القواعد</a>
    <div class="hub-header">
      <div class="hub-header__icon" style="background:var(--color-primary);">${lesson.icon}</div>
      <div class="page-title" style="margin:0;">${lesson.title}</div>
    </div>
    <p class="grammar-explain">${lesson.explanation}</p>

    ${(lesson.conjugationTables || []).map((table) => `
      <table class="conj-table">
        <caption>${table.verb}</caption>
        ${table.rows.map((row) => `
          <tr>
            <td>${row.pronoun}</td>
            <td class="conj-audio" data-fr="${row.pronoun} ${row.form}">${row.form} 🔊</td>
          </tr>
        `).join("")}
      </table>
    `).join("")}

    <div class="section-heading"><h2>أمثلة</h2></div>
    ${lesson.examples.map((ex) => `
      <div class="example-row conj-audio" data-fr="${ex.fr}">
        <div>
          <div class="example-row__fr">${ex.fr}</div>
          <div class="example-row__ar">${ex.ar}</div>
        </div>
        <span>🔊</span>
      </div>
    `).join("")}

    <button class="btn btn--primary btn--block" id="complete-btn" style="margin-top:20px;" ${alreadyDone ? "disabled" : ""}>
      ${alreadyDone ? "تم إنهاء هذا الدرس ✅" : "أنهيت الدرس (+10 نقاط)"}
    </button>
  `;

  container.querySelectorAll(".conj-audio").forEach((el) => {
    el.addEventListener("click", () => speakFrench(el.dataset.fr));
  });

  const completeBtn = container.querySelector("#complete-btn");
  if (!alreadyDone) {
    completeBtn.addEventListener("click", () => {
      markLessonComplete(progressKey);
      const { newBadges } = addXp(10);
      window.__refreshTopbar && window.__refreshTopbar();
      showToast("أحسنت! +10 نقاط خبرة", { type: "success" });
      newBadges.forEach((b) => showToast(`وسام جديد: ${b.icon} ${b.label}`, { type: "info" }));
      completeBtn.textContent = "تم إنهاء هذا الدرس ✅";
      completeBtn.disabled = true;
    });
  }
}
