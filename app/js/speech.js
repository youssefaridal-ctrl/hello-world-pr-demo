// طبقة التعامل مع النطق: تحويل النص إلى كلام (TTS) والتعرف على الكلام (STT)

let cachedVoices = [];
function loadVoices() {
  cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  return cachedVoices;
}
if (window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickFrenchVoice() {
  const voices = cachedVoices.length ? cachedVoices : loadVoices();
  return (
    voices.find((v) => v.lang === "fr-FR") ||
    voices.find((v) => v.lang && v.lang.startsWith("fr")) ||
    null
  );
}

export const ttsSupported = "speechSynthesis" in window;

export function speakFrench(text, { rate = 0.92, onEnd } = {}) {
  if (!ttsSupported) {
    onEnd && onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = rate;
  utter.pitch = 1;
  const voice = pickFrenchVoice();
  if (voice) utter.voice = voice;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (ttsSupported) window.speechSynthesis.cancel();
}

// ---------- التعرف على الكلام ----------
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
export const sttSupported = !!SpeechRecognitionAPI;

export function createRecognizer() {
  if (!sttSupported) return null;
  const recognizer = new SpeechRecognitionAPI();
  recognizer.lang = "fr-FR";
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 3;
  return recognizer;
}

// تطبيع النص للمقارنة: حروف صغيرة، إزالة علامات الترقيم والمسافات الزائدة
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // إزالة علامات التشكيل الفرنسية للمقارنة المرنة
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// حساب نسبة تشابه بسيطة بين نصين اعتماداً على مسافة ليفنشتاين
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

export function similarityScore(target, spoken) {
  const t = normalize(target);
  const s = normalize(spoken);
  if (!t.length) return 0;
  const dist = levenshtein(t, s);
  const score = Math.max(0, 1 - dist / Math.max(t.length, s.length || 1));
  return Math.round(score * 100);
}

/**
 * يبدأ الاستماع لمرة واحدة ويعيد نتيجة عبر Promise
 * @returns {Promise<{transcript: string, confidence: number}>}
 */
export function listenOnce({ timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    const recognizer = createRecognizer();
    if (!recognizer) {
      reject(new Error("STT_NOT_SUPPORTED"));
      return;
    }
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        recognizer.stop();
        reject(new Error("TIMEOUT"));
      }
    }, timeoutMs);

    recognizer.onresult = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const result = event.results[0][0];
      resolve({ transcript: result.transcript, confidence: result.confidence });
    };
    recognizer.onerror = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(event.error || "STT_ERROR"));
    };
    recognizer.onend = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error("NO_SPEECH"));
      }
    };
    try {
      recognizer.start();
    } catch (e) {
      clearTimeout(timer);
      reject(e);
    }
  });
}
