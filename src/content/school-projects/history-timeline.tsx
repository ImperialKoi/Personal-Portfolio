// History Timeline - Interactive Chronological Organizer
// Educational game for organizing historical events in proper chronological order

export const HISTORYTIMELINE = {
  name:        "HistoryTimeline",
  websiteUrl:  "https://historytimeline-demo.vercel.app",  // replace with your live URL
  githubUrl:   "https://github.com/danielxu/history-timeline",
  summary: `
An educational game for arranging historical events in correct chronological order.
Drag, drop, and challenge your knowledge across global history.
  `.trim(),
  coreFeatures: [
    "📚 Comprehensive historical events database",
    "🎯 Drag‑and‑drop timeline interface",
    "⏱️ Timed challenges with scoring",
    "🏆 Difficulty‑based progression",
    "🌍 Global event coverage by region",
    "📊 Performance tracking & analytics",
    "🎮 Gamified learning experience",
    "📱 Touch‑friendly mobile support"
  ],
  technologies: [
    "React", "TypeScript", "Tailwind CSS",
    "Framer Motion", "HTML5 Drag & Drop",
    "REST API / Mock Data"
  ],
  description: "An interactive chronological organizer that turns history facts into a fun, competitive game—perfect for classrooms and lifelong learners.",
  category:    "Education",
  status:      "Live",
  highlights: [
    "Randomized event sets each round",
    "Three difficulty levels (easy/medium/hard)",
    "Live timer & attempt counter",
    "Instant feedback & final scoring"
  ]
};