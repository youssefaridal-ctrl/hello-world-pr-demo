import { getCategoryById } from "../data/vocabulary.js";
import { getState } from "../progress.js";

export function renderCategoryHub(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>الفئة غير موجودة</p></div>`;
    return;
  }
  const state = getState();
  const mastered = cat.words.filter((w) => {
    const entry = state.wordMastery[`${categoryId}:${w.fr}`];
    return entry && entry.correct >= 3 && entry.correct > entry.wrong;
  }).length;
  const percent = Math.round((mastered / cat.words.length) * 100);

  container.innerHTML = `
    <a href="#/lessons" class="back-link">→ رجوع إلى الفئات</a>
    <div class="hub-header">
      <div class="hub-header__icon" style="background:${cat.color}">${cat.icon}</div>
      <div>
        <div class="page-title" style="margin:0;">${cat.title}</div>
        <div class="page-subtitle" style="margin:0;">${cat.words.length} كلمة · ${mastered} متقنة</div>
      </div>
    </div>
    <div class="progress-track"><div class="progress-track__bar" style="width:${percent}%"></div></div>

    <div class="exercise-grid">
      <a href="#/category/${cat.id}/flashcards" class="exercise-tile">
        <div class="exercise-tile__icon">🗂️</div>
        <div class="exercise-tile__title">بطاقات تعليمية</div>
        <div class="exercise-tile__desc">تعلم الكلمات مع النطق</div>
      </a>
      <a href="#/category/${cat.id}/listening" class="exercise-tile">
        <div class="exercise-tile__icon">👂</div>
        <div class="exercise-tile__title">الاستماع</div>
        <div class="exercise-tile__desc">استمع واختر الكلمة الصحيحة</div>
      </a>
      <a href="#/category/${cat.id}/quiz" class="exercise-tile">
        <div class="exercise-tile__icon">✏️</div>
        <div class="exercise-tile__title">اختبار سريع</div>
        <div class="exercise-tile__desc">اختبر معرفتك بالمعنى</div>
      </a>
      <a href="#/category/${cat.id}/speaking" class="exercise-tile">
        <div class="exercise-tile__icon">🎙️</div>
        <div class="exercise-tile__title">تدرّب على النطق</div>
        <div class="exercise-tile__desc">تحدث وقارن نطقك</div>
      </a>
    </div>
  `;
}
