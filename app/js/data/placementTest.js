// Test de positionnement — inspiré des tests utilisés par les instituts de français (Alliance
// Française, TCF) : questions à choix multiples classées par palier CECRL. Le score détermine
// le niveau de départ dans l'application (B1, B2 ou C1).
export const placementTest = [
  // ---------- Palier B1 ----------
  {
    level: "B1",
    question: "Il pleut, ___ je prends un parapluie.",
    options: ["donc", "bien que", "dont", "quoique"],
    correctIndex: 0,
  },
  {
    level: "B1",
    question: "Je ne suis pas d'accord ___ toi sur ce point.",
    options: ["de", "à", "avec", "pour"],
    correctIndex: 2,
  },
  {
    level: "B1",
    question: "Qu'est-ce que tu ___ dans la vie ?",
    options: ["fait", "font", "fais", "faire"],
    correctIndex: 2,
  },
  {
    level: "B1",
    question: "Que signifie l'expression « Ça fait un bail ! » ?",
    options: [
      "Il y a longtemps qu'on ne s'est pas vus",
      "C'est très cher",
      "Je suis très pressé",
      "Je ne comprends pas du tout",
    ],
    correctIndex: 0,
  },
  {
    level: "B1",
    question: "Il est fatigué, ___ il continue de travailler.",
    options: ["cependant", "car", "parce que", "donc"],
    correctIndex: 0,
  },
  {
    level: "B1",
    question: "Nous ___ français depuis deux ans.",
    options: ["parlons", "parlez", "parle", "parlent"],
    correctIndex: 0,
  },
  // ---------- Palier B2 ----------
  {
    level: "B2",
    question: "Il faut que tu ___ à la réunion demain.",
    options: ["viens", "viennes", "venais", "viendras"],
    correctIndex: 1,
  },
  {
    level: "B2",
    question: "« Je suis fatigué » → Il a dit qu'il ___ fatigué.",
    options: ["est", "soit", "était", "fût"],
    correctIndex: 2,
  },
  {
    level: "B2",
    question: "Que signifie « poser un lapin » à quelqu'un ?",
    options: [
      "Ne pas venir à un rendez-vous sans prévenir",
      "Arriver en retard",
      "Réussir un examen difficile",
      "Se fâcher contre quelqu'un",
    ],
    correctIndex: 0,
  },
  {
    level: "B2",
    question: "« En d'autres termes » sert principalement à :",
    options: ["reformuler une idée", "contredire fermement", "remercier poliment", "s'excuser"],
    correctIndex: 0,
  },
  {
    level: "B2",
    question: "L'idée est excellente ; ___, sa mise en œuvre pose problème.",
    options: ["par conséquent", "néanmoins", "c'est-à-dire", "d'ailleurs"],
    correctIndex: 1,
  },
  {
    level: "B2",
    question: "Il a appris le français en ___ des séries chaque soir.",
    options: ["regarde", "regardant", "regardé", "regarder"],
    correctIndex: 1,
  },
  // ---------- Palier C1 ----------
  {
    level: "C1",
    question: "Voici le collègue ___ j'ai travaillé pendant trois ans.",
    options: ["qui", "que", "avec lequel", "dont"],
    correctIndex: 2,
  },
  {
    level: "C1",
    question: "Le contrat ___ hier par les deux parties.",
    options: ["a signé", "a été signé", "est signant", "signait"],
    correctIndex: 1,
  },
  {
    level: "C1",
    question: "Il a dit qu'il ___ le lendemain.",
    options: ["partira", "partirait", "parte", "part"],
    correctIndex: 1,
  },
  {
    level: "C1",
    question: "« Auriez-vous l'amabilité de fermer la fenêtre ? » est une formule :",
    options: ["très polie et formelle", "un ordre direct et sec", "une insulte voilée", "une plaisanterie"],
    correctIndex: 0,
  },
  {
    level: "C1",
    question: "Que signifie « chercher midi à quatorze heures » ?",
    options: [
      "Compliquer inutilement une situation simple",
      "Être en retard à un rendez-vous",
      "Bien planifier son emploi du temps",
      "Être perfectionniste au travail",
    ],
    correctIndex: 0,
  },
  {
    level: "C1",
    question: "Les ventes ont chuté ; ___, les bénéfices ont progressé grâce à la réduction des coûts.",
    options: ["donc", "en effet", "toutefois", "bref"],
    correctIndex: 2,
  },
  {
    level: "C1",
    question: "« Ce à quoi je pense, c'est notre prochain projet » — le pronom souligne :",
    options: [
      "un complément introduit par 'penser à'",
      "un complément introduit par 'avoir besoin de'",
      "un sujet direct",
      "une négation"
    ],
    correctIndex: 0,
  },
];

// Score total → palier de départ recommandé
export function scoreToLevel(correctCount, totalCount) {
  const ratio = correctCount / totalCount;
  if (ratio >= 0.72) return "C1";
  if (ratio >= 0.4) return "B2";
  return "B1";
}
