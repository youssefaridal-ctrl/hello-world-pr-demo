// Rappels de pratique : notifications locales déclenchées quand l'app est ouverte
// (ou en tâche de fond sur Chrome/Android via Periodic Background Sync, si disponible).
// Sans serveur de push, on ne peut pas garantir une notification à l'heure pile app fermée —
// c'est une limite honnête d'une PWA sans backend, pas un bug.
import { getReminder, shouldNotifyNow, markReminderNotifiedToday } from "./progress.js";

export const notificationsSupported = "Notification" in window;

export function requestNotificationPermission() {
  if (!notificationsSupported) return Promise.resolve("unsupported");
  return Notification.requestPermission();
}

async function fireReminderNotification() {
  const title = "Aridal Lab";
  const body = "C'est l'heure de votre séance de français ! Quelques minutes suffisent pour progresser 🇫🇷";
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      reg.showNotification(title, { body, icon: "./assets/icon-192.png", badge: "./assets/icon-192.png", tag: "aridal-reminder" });
      return;
    }
  }
  if (notificationsSupported) new Notification(title, { body, icon: "./assets/icon-192.png" });
}

function checkAndFireReminder() {
  if (!notificationsSupported || Notification.permission !== "granted") return;
  if (shouldNotifyNow()) {
    fireReminderNotification();
    markReminderNotifiedToday();
  }
}

export function startReminderPolling() {
  checkAndFireReminder();
  setInterval(checkAndFireReminder, 60000);
}

// Meilleur effort : Periodic Background Sync (Chrome/Android, app installée uniquement).
// Le navigateur choisit librement quand (et si) il déclenche réellement l'événement.
export async function tryRegisterPeriodicSync() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    if ("periodicSync" in reg) {
      const status = await navigator.permissions.query({ name: "periodic-background-sync" });
      if (status.state === "granted") {
        await reg.periodicSync.register("aridal-reminder-check", { minInterval: 12 * 60 * 60 * 1000 });
      }
    }
  } catch {
    // Non supporté ou refusé — la vérification à l'ouverture de l'app reste le mécanisme principal.
  }
}
