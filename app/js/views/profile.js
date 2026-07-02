import { vocabulary } from "../data/vocabulary.js";
import { getState, getLevel, getXpIntoLevel, countMasteredWords, getAllBadgesWithStatus, resetProgress } from "../progress.js";
import { showToast } from "../utils.js";

const WEEKDAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

function lastSevenDays() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function renderProfile(container) {
  const state = getState();
  const level = getLevel();
  const totalWords = vocabulary.reduce((sum, c) => sum + c.words.length, 0);
  const mastered = countMasteredWords();
  const badges = getAllBadgesWithStatus();
  const days = lastSevenDays();
  const activeDates = new Set(state.history.map((h) => h.date));

  container.innerHTML = `
    <div class="page-title">حسابي</div>
    <div class="hero-card">
      <h1>المستوى ${level}</h1>
      <p>${state.xp} نقطة خبرة إجمالية</p>
      <div class="level-progress"><div class="level-progress__bar" style="width:${getXpIntoLevel()}%"></div></div>
    </div>

    <div class="stats-grid">
      <div class="mini-stat"><div class="mini-stat__value">${state.streak}🔥</div><div class="mini-stat__label">سلسلة الأيام</div></div>
      <div class="mini-stat"><div class="mini-stat__value num-ratio">${mastered}/${totalWords}</div><div class="mini-stat__label">كلمات متقنة</div></div>
      <div class="mini-stat"><div class="mini-stat__value">${Object.keys(state.conversationsDone).length}</div><div class="mini-stat__label">محادثات أُنجزت</div></div>
    </div>

    <div class="section-heading"><h2>نشاطك هذا الأسبوع</h2></div>
    <div class="week-strip">
      ${days.map((d) => {
        const dayIndex = new Date(d).getDay();
        const active = activeDates.has(d);
        return `<div class="week-day ${active ? "active" : ""}">${WEEKDAYS_AR[dayIndex]}</div>`;
      }).join("")}
    </div>

    <div class="section-heading"><h2>الأوسمة</h2></div>
    <div class="badge-grid">
      ${badges.map((b) => `
        <div class="badge-item ${b.earned ? "earned" : ""}">
          <div class="badge-item__icon">${b.icon}</div>
          <div class="badge-item__label">${b.label}</div>
        </div>
      `).join("")}
    </div>

    <div class="section-heading"><h2>الإعدادات</h2></div>
    <div class="card">
      <button class="btn btn--danger btn--block" id="reset-btn">إعادة تعيين كل التقدم</button>
    </div>
  `;

  container.querySelector("#reset-btn").addEventListener("click", () => {
    if (confirm("هل أنت متأكد من إعادة تعيين كل تقدمك؟ لا يمكن التراجع عن هذا الإجراء.")) {
      resetProgress();
      window.__refreshTopbar && window.__refreshTopbar();
      showToast("تمت إعادة التعيين", { type: "info" });
      renderProfile(container);
    }
  });
}
