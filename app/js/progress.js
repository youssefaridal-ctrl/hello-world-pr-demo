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
  };
}

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
  { id: "first_step", label: "الخطوة الأولى", icon: "🌱", condition: (s) => s.xp >= 10 },
  { id: "streak_3", label: "ثلاثة أيام متتالية", icon: "🔥", condition: (s) => s.streak >= 3 },
  { id: "streak_7", label: "أسبوع كامل", icon: "🏆", condition: (s) => s.streak >= 7 },
  { id: "level_5", label: "المستوى الخامس", icon: "⭐", condition: (s) => getLevel() >= 5 },
  { id: "words_50", label: "50 كلمة متقنة", icon: "📚", condition: (s) => countMasteredWords() >= 50 },
  { id: "conversationalist", label: "متحدث بارع", icon: "🗣️", condition: (s) => Object.keys(s.conversationsDone).length >= 3 },
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
  save();
  return { newBadges, level: getLevel() };
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

export function resetProgress() {
  state = defaultState();
  save();
}
