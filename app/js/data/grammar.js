// Points de grammaire avancés (B2-C1) pour affiner la précision à l'oral et à l'écrit
export const grammarLessons = [
  {
    id: "subjonctif",
    title: "Le subjonctif présent",
    level: "B2",
    icon: "📘",
    explanation:
      "Le subjonctif exprime le doute, le souhait, l'obligation ou l'émotion. Il s'utilise après certaines expressions : il faut que, je veux que, je doute que, bien que... Pour la plupart des verbes, on part de la 3ᵉ personne du pluriel au présent (ils parlent → qu'ils parlent) et on ajoute -e, -es, -e, -ions, -iez, -ent.",
    conjugationTables: [
      {
        verb: "parler (subjonctif)",
        rows: [
          { pronoun: "que je", form: "parle" },
          { pronoun: "que tu", form: "parles" },
          { pronoun: "qu'il / elle", form: "parle" },
          { pronoun: "que nous", form: "parlions" },
          { pronoun: "que vous", form: "parliez" },
          { pronoun: "qu'ils / elles", form: "parlent" },
        ],
      },
      {
        verb: "être (subjonctif, irrégulier)",
        rows: [
          { pronoun: "que je", form: "sois" },
          { pronoun: "que tu", form: "sois" },
          { pronoun: "qu'il / elle", form: "soit" },
          { pronoun: "que nous", form: "soyons" },
          { pronoun: "que vous", form: "soyez" },
          { pronoun: "qu'ils / elles", form: "soient" },
        ],
      },
    ],
    examples: [
      { fr: "Il faut que tu viennes à la réunion.", note: "Obligation" },
      { fr: "Je doute qu'il soit prêt à temps.", note: "Doute" },
      { fr: "Bien qu'il pleuve, nous sortirons.", note: "Concession" },
      { fr: "Je suis content que vous soyez là.", note: "Émotion" },
    ],
  },
  {
    id: "discours-rapporte",
    title: "Le discours rapporté",
    level: "B2",
    icon: "💭",
    explanation:
      "Pour rapporter les paroles de quelqu'un, on utilise dire que / demander si / demander ce que. Au passé, les temps changent : présent → imparfait, passé composé → plus-que-parfait, futur → conditionnel présent. Les indicateurs de temps changent aussi (aujourd'hui → ce jour-là, demain → le lendemain).",
    examples: [
      { fr: "« Je suis fatigué » → Il a dit qu'il était fatigué.", note: "présent → imparfait" },
      { fr: "« J'ai fini » → Elle a dit qu'elle avait fini.", note: "passé composé → plus-que-parfait" },
      { fr: "« Je viendrai demain » → Il a dit qu'il viendrait le lendemain.", note: "futur → conditionnel" },
      { fr: "« Es-tu libre ? » → Il m'a demandé si j'étais libre.", note: "question fermée → si" },
      { fr: "« Que fais-tu ? » → Elle m'a demandé ce que je faisais.", note: "question ouverte → ce que" },
    ],
  },
  {
    id: "concordance-temps",
    title: "La concordance des temps",
    level: "B2",
    icon: "⏳",
    explanation:
      "Le temps du verbe subordonné dépend du temps du verbe principal. Si le verbe principal est au passé, l'action simultanée se met à l'imparfait, l'action antérieure au plus-que-parfait, et l'action postérieure au conditionnel présent.",
    examples: [
      { fr: "Il dit qu'il travaille. → Il a dit qu'il travaillait.", note: "simultanéité" },
      { fr: "Il dit qu'il a fini. → Il a dit qu'il avait fini.", note: "antériorité" },
      { fr: "Il dit qu'il partira. → Il a dit qu'il partirait.", note: "postériorité" },
    ],
  },
  {
    id: "pronoms-relatifs",
    title: "Les pronoms relatifs composés",
    level: "C1",
    icon: "🧩",
    explanation:
      "Au-delà de qui/que/où/dont, les pronoms composés (lequel, à laquelle, sur lesquels, ce dont, ce à quoi...) permettent des phrases plus précises et plus élégantes, typiques d'un français soutenu.",
    examples: [
      { fr: "Le sujet dont je te parle est complexe.", note: "dont = parler de" },
      { fr: "Voici le collègue avec lequel j'ai travaillé.", note: "lequel après préposition" },
      { fr: "C'est la raison pour laquelle j'ai refusé.", note: "laquelle après préposition composée" },
      { fr: "Ce à quoi je pense, c'est notre prochain projet.", note: "ce à quoi = penser à" },
      { fr: "Ce dont j'ai besoin, c'est de temps.", note: "ce dont = avoir besoin de" },
    ],
  },
  {
    id: "gerondif",
    title: "Le gérondif",
    level: "B1",
    icon: "🌀",
    explanation:
      "Le gérondif (en + participe présent) exprime la simultanéité, la manière ou la condition. Il rend le discours plus fluide en évitant deux phrases séparées.",
    examples: [
      { fr: "Il parle en marchant.", note: "simultanéité" },
      { fr: "Elle a appris le français en regardant des séries.", note: "manière" },
      { fr: "En travaillant plus, tu réussiras.", note: "condition" },
      { fr: "C'est en forgeant qu'on devient forgeron.", note: "expression figée" },
    ],
  },
  {
    id: "voix-passive",
    title: "La voix passive",
    level: "B2",
    icon: "🔃",
    explanation:
      "La voix passive met en valeur l'action ou son résultat plutôt que celui qui la fait. Construction : sujet + être (au temps voulu) + participe passé (+ par + agent, facultatif).",
    examples: [
      { fr: "Le contrat a été signé par les deux parties.", note: "passé composé passif" },
      { fr: "Ce roman est lu dans le monde entier.", note: "présent passif" },
      { fr: "La décision sera annoncée demain.", note: "futur passif" },
      { fr: "Le projet a été reporté.", note: "agent non précisé" },
    ],
  },
];
