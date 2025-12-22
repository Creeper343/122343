// src/lib/faqData.ts
export type Category = 'general' | 'students' | 'schools';

export const faqItems = [
  {
    question: "Ist der Vergleich wirklich kostenlos?",
    answer: "Ja, zu 100%. Für Fahrschüler ist die Nutzung von Fahrschulfinder komplett kostenlos und unverbindlich.",
    category: 'students'
  },
  {
    question: "Wie aktuell sind die Preise?",
    answer: "Die Preise werden direkt von den Fahrschulen gepflegt oder von unserem Team regelmäßig aktualisiert.",
    category: 'general'
  },
  {
    question: "Muss ich mich als Fahrschüler anmelden?",
    answer: "Nein, um Fahrschulen zu vergleichen musst du dich nicht anmelden.",
    category: 'students'
  },
  {
    question: "Wie registriere ich meine Fahrschule?",
    answer: "Klicke oben rechts auf 'Partner werden'. Die Registrierung dauert nur 2 Minuten.",
    category: 'schools'
  },
  {
    question: "Was kostet der Führerschein insgesamt?",
    answer: "Das hängt von deinem Lernfortschritt ab. Unser Kostenrechner hilft dir bei einer Schätzung.",
    category: 'students'
  }
];