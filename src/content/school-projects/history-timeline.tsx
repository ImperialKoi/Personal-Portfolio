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
  const categories = [
    { name: 'Wars & Conflicts', icon: '⚔️', color: 'bg-red-100 text-red-700' },
    { name: 'Political Events', icon: '🏛️', color: 'bg-blue-100 text-blue-700' },
    { name: 'Scientific Discoveries', icon: '🔬', color: 'bg-green-100 text-green-700' },
    { name: 'Cultural Movements', icon: '🎨', color: 'bg-purple-100 text-purple-700' },
    { name: 'Inventions', icon: '⚙️', color: 'bg-orange-100 text-orange-700' },
    { name: 'Explorations', icon: '🧭', color: 'bg-teal-100 text-teal-700' }
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