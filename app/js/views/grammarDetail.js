import { grammarLessons } from "../data/grammar.js";
import { speakFrench } from "../speech.js";
import { addXp, markLessonComplete, isLessonComplete, recordLastPosition, isLevelUnlocked } from "../progress.js";
import { showToast, notifyLevelUnlock } from "../utils.js";

export function renderGrammarDetail(container, lessonId) {
  const lesson = grammarLessons.find((l) => l.id === lessonId);
  if (!lesson) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Leçon introuvable</p></div>`;
    return;
  }
  if (!isLevelUnlocked(lesson.level)) {
    container.innerHTML = `
      <a href="#/grammar" class="back-link">← Retour à la grammaire</a>
      <div class="empty-state">
        <div class="empty-state__icon">🔒</div>
        <p>Cette leçon appartient au niveau ${lesson.level}, pas encore débloqué.</p>
      </div>
    `;
    return;
  }
  recordLastPosition({ hash: `#/grammar/${lesson.id}`, label: `Grammaire : ${lesson.title}`, icon: lesson.icon });

  const progressKey = `grammar:${lesson.id}`;
  const alreadyDone = isLessonComplete(progressKey);

  container.innerHTML = `
    <a href="#/grammar" class="back-link">← Retour à la grammaire</a>
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

    <div class="section-heading"><h2>Exemples</h2></div>
    ${lesson.examples.map((ex) => `
      <div class="example-row conj-audio" data-fr="${ex.fr}">
        <div>
          <div class="example-row__fr">${ex.fr}</div>
          ${ex.note ? `<div class="example-row__ar">${ex.note}</div>` : ""}
        </div>
        <span>🔊</span>
      </div>
    `).join("")}

    <button class="btn btn--primary btn--block" id="complete-btn" style="margin-top:20px;" ${alreadyDone ? "disabled" : ""}>
      ${alreadyDone ? "Leçon terminée ✅" : "J'ai terminé cette leçon (+10 points)"}
    </button>
  `;

  container.querySelectorAll(".conj-audio").forEach((el) => {
    el.addEventListener("click", () => speakFrench(el.dataset.fr));
  });

  const completeBtn = container.querySelector("#complete-btn");
  if (!alreadyDone) {
    completeBtn.addEventListener("click", () => {
      markLessonComplete(progressKey);
      const { newBadges, newlyUnlockedLevel } = addXp(10);
      window.__refreshTopbar && window.__refreshTopbar();
      showToast("Bravo ! +10 points d'expérience", { type: "success" });
      newBadges.forEach((b) => showToast(`Nouveau badge : ${b.icon} ${b.label}`, { type: "info" }));
      notifyLevelUnlock(newlyUnlockedLevel);
      completeBtn.textContent = "Leçon terminée ✅";
      completeBtn.disabled = true;
    });
  }
}
