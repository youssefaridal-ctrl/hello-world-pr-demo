export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sample(array, n) {
  return shuffle(array).slice(0, n);
}

export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function showToast(message, { type = "success", duration = 2600 } = {}) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast--visible"));
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

const LEVEL_LABELS = { B1: "Intermédiaire (B1)", B2: "Intermédiaire avancé (B2)", C1: "Avancé (C1)" };

export function notifyLevelUnlock(newlyUnlockedLevel) {
  if (!newlyUnlockedLevel) return;
  showToast(`Niveau débloqué : ${LEVEL_LABELS[newlyUnlockedLevel] || newlyUnlockedLevel} 🔓`, { type: "info", duration: 3400 });
  fireConfetti(30);
}

// Bloque l'accès direct (par lien) à un contenu dont le niveau CECRL n'est pas encore débloqué.
// Retourne true (et affiche l'écran de verrouillage) si l'accès doit être refusé.
export function guardLevelLocked(container, isLevelUnlocked, level, backHash, backLabel) {
  if (isLevelUnlocked(level)) return false;
  container.innerHTML = `
    <a href="${backHash}" class="back-link">← ${backLabel}</a>
    <div class="empty-state">
      <div class="empty-state__icon">🔒</div>
      <p>Ce contenu appartient au niveau ${level}, pas encore débloqué.</p>
    </div>
  `;
  return true;
}

export function timeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} j`;
  const weeks = Math.floor(days / 7);
  return `il y a ${weeks} sem.`;
}

export function fireConfetti(count = 40) {
  const layer = document.getElementById("confetti-layer");
  if (!layer) return;
  const colors = ["#FF6B6B", "#4D96FF", "#FFB84D", "#3DDC97", "#9B6BFF", "#FF8FB1"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = randomChoice(colors);
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}
