# Hello World

A tiny example project used to practice the GitHub pull request workflow.

## Usage

Run the script:

```
node hello.js
```

It prints a greeting to the console. This project is intentionaly kept simple.

## Bonjour — French Learning App

The `app/` directory contains **Bonjour**, an interactive, gamified web app that
teaches French to Arabic-speaking learners through communication-focused
practice: vocabulary, grammar, listening, speaking (with real-time speech
recognition scoring), and simulated conversations with a virtual teacher.

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

- **Vocabulary lessons** across 11 themed categories (greetings, numbers,
  colors, family, food, time, body, travel, shopping, verbs, weather) with
  flip flashcards, Arabic transliteration, and native-sounding French audio.
- **Grammar lessons** covering articles, `être`/`avoir`, `-er` verbs, negation,
  questions, and adjective agreement, with conjugation tables and spoken
  examples.
- **Quizzes & listening drills** with instant feedback and spaced-repetition
  style word mastery tracking.
- **Speaking practice** using the Web Speech API: the app listens to your
  pronunciation and scores it against the target phrase.
- **Conversation simulator**: turn-based dialogues with a virtual teacher
  where you speak your lines and get scored, covering real-life scenarios
  (meeting someone, ordering coffee, asking for directions, shopping, daily
  routine).
- **Gamification**: XP, levels, daily streaks, and badges stored locally in
  the browser (no backend required).

### Browser support note

Text-to-speech and speech-recognition rely on the Web Speech API. Playback
works broadly; speech recognition (`SpeechRecognition`) currently has the
best support in Chrome/Chromium-based browsers.
