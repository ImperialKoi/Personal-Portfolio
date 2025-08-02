// CS Exam Review – Competitive Quiz System
// Interactive quiz platform with real‑time scoring & leaderboards

export const CSEXAMREVIEW = {
  name:        "CSExamReview",
  websiteUrl:  "https://csexamreview-demo.vercel.app",  
  githubUrl:   "https://github.com/danielxu/csexamreview",
  summary: `
An interactive quiz platform for computer science exam prep.
Choose Practice, Timed, or Competitive mode and test your CS knowledge
across data structures, algorithms, OOP, and more—all in real time.
  `.trim(),
  coreFeatures: [
    "🎯 Competitive scoring with streak bonuses",
    "🏆 Live leaderboard & real‑time rankings",
    "⏱️ Multiple modes: Practice, Timed, Competitive",
    "📊 Detailed performance analytics & progress tracking",
    "👥 Multiplayer quiz battles",
    "🔄 Adaptive difficulty adjustment",
    "💡 In‑depth explanations for every question",
    "📚 Comprehensive CS topic coverage"
  ],
  setCurrentPlayer: [
    'id: player1',
    'name: You',
    'score: 0',
    'streak: 0',
    'answeredQuestions: 0'
  ],
  leaderboard: [
    { id: '1', name: 'Alex Chen', score: 2450, streak: 12, answeredQuestions: 45 },
    { id: '2', name: 'You', score: 2380, streak: 8, answeredQuestions: 42 },
    { id: '3', name: 'Mike Johnson', score: 2290, streak: 15, answeredQuestions: 38 },
  ],
  categories: [
    { name: 'Data Structures', questions: 45, icon: '🏗️' },
    { name: 'Algorithms', questions: 52, icon: '⚡' },
    { name: 'Object-Oriented Programming', questions: 38, icon: '🔧' },
    { name: 'Database Systems', questions: 31, icon: '💾' },
    { name: 'Computer Networks', questions: 29, icon: '🌐' },
    { name: 'Operating Systems', questions: 35, icon: '💻' }
  ],
  technologies: [
    "React", "TypeScript", "Tailwind CSS",
    "WebSockets", "Supabase", "PostgreSQL",
    "Chart.js", "Edge Functions"
  ],
  description: "A modern quiz system built to make CS exam review engaging, measurable, and competitive—ideal for students and study groups.",
  category:    "Education",
  status:      "Live",
  highlights: [
    "Practice, Timed & Competitive modes",
    "Real‑time scoring & streak tracking",
    "Adaptive difficulty per user performance",
    "Multiplayer leaderboard battles"
  ]
};
