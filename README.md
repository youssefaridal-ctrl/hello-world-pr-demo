# Hello World

A tiny example project used to practice the GitHub pull request workflow.

## Usage

Run the script:

```
node hello.js
```

It prints a greeting to the console. This project is intentionaly kept simple.

## Aridal Lab — French Fluency App

The `app/` directory contains **Aridal Lab**, an installable, gamified web app
that helps learners who already read/write French get fluent at *speaking*
it — through advanced communicative expressions, simulated conversations, and
speech-recognition-scored pronunciation drills, entirely in French (full
immersion, no translation crutch).

### Run it locally

No build step is required — it's a static app built with vanilla HTML/CSS/JS
(ES modules). Serve the `app/` folder with any static file server, for example:

```
cd app
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a modern browser (Chrome recommended for
full speech-recognition support).

### Features

- **Placement test**: a 19-question diagnostic (grammar + expressions +
  nuance, styled like a French-institute positioning test) that places new
  users at the right starting level — B1, B2, or C1 — instead of forcing
  everyone through the same content. Users can also skip it and pick a level
  manually.
- **Three CECRL levels (B1/B2/C1) with progressive unlock**: every theme,
  grammar lesson, and conversation is tagged with a level; content above the
  assessed level is locked until enough expressions are mastered (20 to
  unlock B2, 50 for C1), shown via level badges and lock screens throughout
  the app.
- **Practice-time reminders**: an optional daily notification (time picker in
  the profile) nudges users back at their chosen practice time via the Web
  Notifications API and the service worker, with a best-effort Periodic
  Background Sync registration on supporting browsers. Honest caveat shown
  in-app: without a push backend, delivery while the app is fully closed
  isn't guaranteed on every device — the primary mechanism checks on app
  open.
- **Fluency-focused expression themes** (not basic vocabulary): logical
  connectors, filler expressions, giving opinions, spontaneous reactions,
  reformulating, idioms, social/professional small talk, handling
  disagreement, storytelling, and politeness registers — flashcards give a
  French definition, an example, and a register tag (soutenu/neutre/familier).
- **Six exercise types per theme**: flashcards, quiz (expression ↔
  definition), active listening, speaking practice, **shadowing**
  (listen-then-repeat-immediately fluency drills), and **rapid response**
  (timed spontaneous production from a French-only cue, with no written
  expression shown, to break the mental-translation habit).
- **Advanced grammar** (subjonctif, discours rapporté, concordance des temps,
  pronoms relatifs composés, gérondif, voix passive) with spoken conjugation
  tables and examples.
- **Conversation simulator**: turn-based dialogues with a virtual teacher for
  advanced real-life scenarios (job interview, work meeting, storytelling,
  social small talk, handling a last-minute change).
- **Resume where you left off**: the app remembers your exact last position
  (theme, exercise, conversation, or grammar lesson) and surfaces a
  "Reprendre" button on the home screen plus a learning-path history on the
  profile page, so every session continues from the previous one.
- **Gamification**: XP, levels, daily streaks, and badges stored locally in
  the browser (no backend required).
- **Installable PWA**: has a web app manifest and service worker, so it can
  be added to a phone's home screen and works offline. The service worker
  is versioned (`CACHE_VERSION` in `app/sw.js`) — bump it when shipping new
  lessons or structural changes, and installed users get an in-app "Mettre à
  jour" prompt instead of silently going stale.

### Browser support note

Text-to-speech and speech-recognition rely on the Web Speech API. Playback
works broadly; speech recognition (`SpeechRecognition`) currently has the
best support in Chrome/Chromium-based browsers.
