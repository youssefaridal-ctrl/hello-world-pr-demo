import { getCategoryById } from "../data/vocabulary.js";
import { getState, recordLastPosition, isLevelUnlocked } from "../progress.js";

export function renderCategoryHub(container, categoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">😕</div><p>Thème introuvable</p></div>`;
    return;
  }
  if (!isLevelUnlocked(cat.level)) {
    container.innerHTML = `
      <a href="#/lessons" class="back-link">← Retour aux thèmes</a>
      <div class="empty-state">
        <div class="empty-state__icon">🔒</div>
        <p>Ce thème appartient au niveau ${cat.level}, pas encore débloqué.<br/>Continuez à pratiquer pour l'ouvrir !</p>
      </div>
    `;
    return;
  }
  recordLastPosition({ hash: `#/category/${cat.id}`, label: cat.title, icon: cat.icon });
  const state = getState();
  const mastered = cat.words.filter((w) => {
    const entry = state.wordMastery[`${categoryId}:${w.fr}`];
    return entry && entry.correct >= 3 && entry.correct > entry.wrong;
  }).length;
  const percent = Math.round((mastered / cat.words.length) * 100);

  container.innerHTML = `
    <a href="#/lessons" class="back-link">← Retour aux thèmes</a>
    <div class="hub-header">
      <div class="hub-header__icon" style="background:${cat.color}">${cat.icon}</div>
      <div>
        <div class="page-title" style="margin:0;">${cat.title} <span class="level-badge level-badge--${cat.level}">${cat.level}</span></div>
        <div class="page-subtitle" style="margin:0;">${cat.words.length} expressions · ${mastered} maîtrisées</div>
      </div>
    </div>
    <div class="progress-track"><div class="progress-track__bar" style="width:${percent}%"></div></div>

    <div class="exercise-grid">
      <a href="#/category/${cat.id}/flashcards" class="exercise-tile">
        <div class="exercise-tile__icon">🗂️</div>
        <div class="exercise-tile__title">Cartes mémo</div>
        <div class="exercise-tile__desc">Sens et usage en français</div>
      </a>
      <a href="#/category/${cat.id}/shadowing" class="exercise-tile">
        <div class="exercise-tile__icon">🪞</div>
        <div class="exercise-tile__title">Répétition immédiate</div>
        <div class="exercise-tile__desc">Écoutez et répétez sans délai</div>
      </a>
      <a href="#/category/${cat.id}/listening" class="exercise-tile">
        <div class="exercise-tile__icon">👂</div>
        <div class="exercise-tile__title">Écoute active</div>
        <div class="exercise-tile__desc">Reconnaître à l'oreille</div>
      </a>
      <a href="#/category/${cat.id}/quiz" class="exercise-tile">
        <div class="exercise-tile__icon">✏️</div>
        <div class="exercise-tile__title">Quiz de sens</div>
        <div class="exercise-tile__desc">Associez expression et définition</div>
      </a>
      <a href="#/category/${cat.id}/speaking" class="exercise-tile">
        <div class="exercise-tile__icon">🎙️</div>
        <div class="exercise-tile__title">Prise de parole</div>
        <div class="exercise-tile__desc">Prononcez et comparez</div>
      </a>
      <a href="#/category/${cat.id}/rapid" class="exercise-tile">
        <div class="exercise-tile__icon">⏱️</div>
        <div class="exercise-tile__title">Réponse rapide</div>
        <div class="exercise-tile__desc">Répondez sans hésiter</div>
      </a>
    </div>
  `;
}
