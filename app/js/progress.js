// إدارة تقدم المستخدم: النقاط، السلسلة اليومية، المستوى، وإتقان الكلمات (تكرار متباعد مبسط)
const STORAGE_KEY = "fr_app_progress_v1";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    completedLessons: {}, // { lessonId: true }
    wordMastery: {}, // { "categoryId:fr": { correct: 0, wrong: 0, lastSeen, dueDate } }
    conversationsDone: {},
    badges: [],
    history: [], // [{date, xp}]
    lastPosition: null, // { hash, label, icon, timestamp }
    recentActivity: [], // [{ hash, label, icon, timestamp }] — most recent first, capped
    cecrlLevel: null, // "B1" | "B2" | "C1" — set by the placement test
    unlockedLevels: [], // CECRL levels the learner can currently access
    reminder: { enabled: false, time: "19:00", lastNotifiedDate: null },
  };
}

// Niveaux CECRL couverts par l'app (public déjà à l'aise à l'écrit, donc on démarre à B1)
export const CECRL_LEVELS = ["B1", "B2", "C1"];
const UNLOCK_THRESHOLDS = { B2: 20, C1: 50 }; // mots maîtrisés requis pour débloquer le niveau suivant

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function getLevel() {
  return Math.floor(state.xp / 100) + 1;
}

export function getXpIntoLevel() {
  return state.xp % 100;
}

const BADGES = [
  { id: "first_step", label: "Premier pas", icon: "🌱", condition: (s) => s.xp >= 10 },
  { id: "streak_3", label: "3 jours d'affilée", icon: "🔥", condition: (s) => s.streak >= 3 },
  { id: "streak_7", label: "Semaine complète", icon: "🏆", condition: (s) => s.streak >= 7 },
  { id: "level_5", label: "Niveau 5 atteint", icon: "⭐", condition: (s) => getLevel() >= 5 },
  { id: "words_50", label: "50 expressions maîtrisées", icon: "📚", condition: (s) => countMasteredWords() >= 50 },
  { id: "conversationalist", label: "Beau parleur", icon: "🗣️", condition: (s) => Object.keys(s.conversationsDone).length >= 3 },
];

function checkBadges() {
  const newlyEarned = [];
  for (const badge of BADGES) {
    if (!state.badges.includes(badge.id) && badge.condition(state)) {
      state.badges.push(badge.id);
      newlyEarned.push(badge);
    }
  }
  return newlyEarned;
}

export function touchStreak() {
  const today = todayStr();
  if (state.lastActiveDate === today) return; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.lastActiveDate === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastActiveDate = today;
  save();
}

export function addXp(amount) {
  touchStreak();
  state.xp += amount;
  const today = todayStr();
  const last = state.history[state.history.length - 1];
  if (last && last.date === today) {
    last.xp += amount;
  } else {
    state.history.push({ date: today, xp: amount });
  }
  if (state.history.length > 30) state.history.shift();
  const newBadges = checkBadges();
  const newlyUnlockedLevel = refreshUnlockedLevels();
  save();
  return { newBadges, level: getLevel(), newlyUnlockedLevel };
}

export function markLessonComplete(lessonId) {
  state.completedLessons[lessonId] = true;
  save();
}

export function isLessonComplete(lessonId) {
  return !!state.completedLessons[lessonId];
}

export function markConversationDone(convId) {
  state.conversationsDone[convId] = true;
  save();
}

function wordKey(categoryId, fr) {
  return `${categoryId}:${fr}`;
}

export function recordWordResult(categoryId, fr, correct) {
  const key = wordKey(categoryId, fr);
  const entry = state.wordMastery[key] || { correct: 0, wrong: 0, lastSeen: null, dueDate: null };
  if (correct) entry.correct += 1;
  else entry.wrong += 1;
  entry.lastSeen = todayStr();
  // تكرار متباعد مبسط: كل إجابة صحيحة متتالية تؤجل المراجعة القادمة أكثر
  const interval = correct ? Math.min(14, Math.pow(2, entry.correct)) : 1;
  const due = new Date(Date.now() + interval * 86400000);
  entry.dueDate = due.toISOString().slice(0, 10);
  state.wordMastery[key] = entry;
  save();
}

export function getWordMastery(categoryId, fr) {
  return state.wordMastery[wordKey(categoryId, fr)] || { correct: 0, wrong: 0 };
}

export function countMasteredWords() {
  return Object.values(state.wordMastery).filter((w) => w.correct >= 3 && w.correct > w.wrong).length;
}

export function getWordsDueForReview(allWords) {
  const today = todayStr();
  return allWords.filter((w) => {
    const entry = state.wordMastery[wordKey(w.categoryId, w.fr)];
    if (!entry) return false;
    return entry.dueDate && entry.dueDate <= today;
  });
}

export function getEarnedBadges() {
  return BADGES.filter((b) => state.badges.includes(b.id));
}

export function getAllBadgesWithStatus() {
  return BADGES.map((b) => ({ ...b, earned: state.badges.includes(b.id) }));
}

// Mémorise la position exacte de l'apprenant (thème, exercice, conversation ou leçon de grammaire)
// pour que la session suivante puisse reprendre exactement là où elle s'est arrêtée.
export function recordLastPosition({ hash, label, icon }) {
  const entry = { hash, label, icon, timestamp: Date.now() };
  state.lastPosition = entry;
  state.recentActivity = [entry, ...state.recentActivity.filter((a) => a.hash !== hash)].slice(0, 8);
  save();
}

export function getLastPosition() {
  return state.lastPosition;
}

export function getRecentActivity() {
  return state.recentActivity;
}

// ---------- Niveau CECRL (test de positionnement + déblocage progressif) ----------

export function setCecrlLevel(level) {
  state.cecrlLevel = level;
  const startIndex = CECRL_LEVELS.indexOf(level);
  state.unlockedLevels = CECRL_LEVELS.slice(0, startIndex + 1);
  save();
}

export function getCecrlLevel() {
  return state.cecrlLevel;
}

export function isLevelUnlocked(level) {
  return state.unlockedLevels.includes(level);
}

export function getUnlockedLevels() {
  return state.unlockedLevels;
}

// Débloque le niveau suivant si le nombre de mots maîtrisés dépasse le seuil requis.
// Renvoie le niveau nouvellement débloqué (ou null).
function refreshUnlockedLevels() {
  if (!state.cecrlLevel) return null;
  const mastered = countMasteredWords();
  let newlyUnlocked = null;
  for (const level of CECRL_LEVELS) {
    if (state.unlockedLevels.includes(level)) continue;
    const threshold = UNLOCK_THRESHOLDS[level];
    if (threshold !== undefined && mastered >= threshold) {
      state.unlockedLevels.push(level);
      newlyUnlocked = level;
    }
  }
  return newlyUnlocked;
}

// ---------- Rappels de la séance (notifications) ----------

export function setReminder({ enabled, time }) {
  state.reminder = { ...state.reminder, enabled, time };
  save();
}

export function getReminder() {
  return state.reminder;
}

export function markReminderNotifiedToday() {
  state.reminder.lastNotifiedDate = todayStr();
  save();
}

export function shouldNotifyNow() {
  const r = state.reminder;
  if (!r.enabled) return false;
  if (r.lastNotifiedDate === todayStr()) return false;
  const [h, m] = r.time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  return now >= target;
}

export function resetProgress() {
  state = defaultState();
  save();
}
