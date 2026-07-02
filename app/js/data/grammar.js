// دروس قواعدية مبسطة للمبتدئين مع أمثلة صوتية
export const grammarLessons = [
  {
    id: "articles",
    title: "أدوات التعريف والتنكير",
    icon: "📘",
    explanation:
      "في الفرنسية، لكل اسم جنس (مذكر أو مؤنث) وعدد (مفرد أو جمع). أدوات التعريف: le (مذكر) - la (مؤنث) - les (جمع). أدوات التنكير: un (مذكر) - une (مؤنث) - des (جمع).",
    examples: [
      { fr: "le garçon", ar: "الولد (مذكر)" },
      { fr: "la fille", ar: "البنت (مؤنث)" },
      { fr: "les enfants", ar: "الأطفال (جمع)" },
      { fr: "un livre", ar: "كتاب (مذكر نكرة)" },
      { fr: "une table", ar: "طاولة (مؤنث نكرة)" },
    ],
  },
  {
    id: "etre-avoir",
    title: "تصريف être و avoir في المضارع",
    icon: "📗",
    explanation: "être (يكون) و avoir (يملك) فعلان أساسيان لا بد من حفظ تصريفهما جيداً لأنهما يُستعملان في كل جملة تقريباً.",
    conjugationTables: [
      {
        verb: "être",
        rows: [
          { pronoun: "Je", form: "suis" },
          { pronoun: "Tu", form: "es" },
          { pronoun: "Il / Elle", form: "est" },
          { pronoun: "Nous", form: "sommes" },
          { pronoun: "Vous", form: "êtes" },
          { pronoun: "Ils / Elles", form: "sont" },
        ],
      },
      {
        verb: "avoir",
        rows: [
          { pronoun: "J'", form: "ai" },
          { pronoun: "Tu", form: "as" },
          { pronoun: "Il / Elle", form: "a" },
          { pronoun: "Nous", form: "avons" },
          { pronoun: "Vous", form: "avez" },
          { pronoun: "Ils / Elles", form: "ont" },
        ],
      },
    ],
    examples: [
      { fr: "Je suis étudiant.", ar: "أنا طالب." },
      { fr: "Nous avons deux enfants.", ar: "لدينا طفلان." },
    ],
  },
  {
    id: "er-verbs",
    title: "تصريف الأفعال المنتهية بـ -ER",
    icon: "📙",
    explanation: "معظم الأفعال الفرنسية تنتهي بـ -er (مثل parler، aimer، habiter). لتصريفها في المضارع، نحذف -er ونضيف: e, es, e, ons, ez, ent.",
    conjugationTables: [
      {
        verb: "parler",
        rows: [
          { pronoun: "Je", form: "parle" },
          { pronoun: "Tu", form: "parles" },
          { pronoun: "Il / Elle", form: "parle" },
          { pronoun: "Nous", form: "parlons" },
          { pronoun: "Vous", form: "parlez" },
          { pronoun: "Ils / Elles", form: "parlent" },
        ],
      },
    ],
    examples: [
      { fr: "Je parle français.", ar: "أتحدث الفرنسية." },
      { fr: "Vous parlez très bien.", ar: "أنت تتحدث جيداً جداً." },
    ],
  },
  {
    id: "negation",
    title: "النفي: ne...pas",
    icon: "📕",
    explanation: "لنفي جملة في الفرنسية، نضع ne قبل الفعل و pas بعده: Sujet + ne + verbe + pas.",
    examples: [
      { fr: "Je ne parle pas anglais.", ar: "لا أتحدث الإنجليزية." },
      { fr: "Il n'est pas là.", ar: "هو ليس هنا." },
      { fr: "Nous n'avons pas faim.", ar: "لسنا جائعين." },
    ],
  },
  {
    id: "questions",
    title: "طرح الأسئلة",
    icon: "❓",
    explanation:
      "يمكن طرح الأسئلة بثلاث طرق: برفع النبرة في نهاية الجملة (Tu vas bien ?)، أو باستعمال Est-ce que في البداية (Est-ce que tu vas bien ?)، أو بقلب الفعل والفاعل (Vas-tu bien ?).",
    examples: [
      { fr: "Comment tu t'appelles ?", ar: "ما اسمك؟" },
      { fr: "Où habites-tu ?", ar: "أين تسكن؟" },
      { fr: "Quel âge as-tu ?", ar: "كم عمرك؟" },
      { fr: "Qu'est-ce que tu fais ?", ar: "ماذا تفعل؟" },
    ],
  },
  {
    id: "adjectives",
    title: "توافق الصفات",
    icon: "📔",
    explanation: "الصفة في الفرنسية توافق الاسم في الجنس والعدد. غالباً نضيف -e للمؤنث و -s للجمع.",
    examples: [
      { fr: "Il est grand. / Elle est grande.", ar: "هو طويل. / هي طويلة." },
      { fr: "Il est petit. / Elle est petite.", ar: "هو صغير. / هي صغيرة." },
      { fr: "Ils sont contents.", ar: "هم سعداء (جمع)." },
    ],
  },
];
