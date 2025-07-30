// HackathonIdeasGenerator - AI-Powered Hackathon Project Generator
// Generates, judges, and codes hackathon projects using advanced AI

export const HACKATHONIDEASGENERATOR = {
  name:        "HackathonIdeasGenerator",
  websiteUrl:  "https://hackathonideas-demo.vercel.app",   // update if you have a live demo
  githubUrl:   "https://github.com/danielxu/hackathon-ideas-generator",
  summary: `
An AI‑driven hackathon project ideation tool that generates, judges & even bootstraps complete starter code.
Perfect for teams looking to hit the ground running with high‑impact, feasible ideas.
  `.trim(),
  coreFeatures: [
    "🤖 AI‑powered hackathon idea generation",
    "⚖️ Intelligent multi‑criteria AI judging",
    "💻 Automated project scaffolding & codegen",
    "🎯 Difficulty‑based idea filtering",
    "📊 Feasibility & innovation scoring",
    "⏱️ Accurate time‑to‑build estimates",
    "🔄 Iterative refinement & tech stack optimization"
  ],
  judgingCriteria: [
    "🎯 Technical Feasibility (30%)",
    "💡 Innovation Level (25%)",
    "🚀 Market Potential (20%)",
    "⏰ Time Complexity (15%)",
    "🛠️ Resource Requirements (10%)"
  ],
  techCategories: {
    ai:         ["OpenAI GPT‑4", "Claude AI", "Custom Prompt Engineering"],
    generation: ["Context‑aware Templating", "Idea Variations"],
    judging:    ["Automated Scoring Engine", "Weighted Criteria"],
    coding:     ["Project Scaffolding", "File/Folder Structure", "Boilerplate Generation"],
    frontend:   ["React", "TypeScript", "Tailwind CSS"]
  },
  technologies: [
    "React", "TypeScript", "Tailwind CSS",
    "OpenAI GPT‑4", "Claude AI",
    "Node.js", "Express"
  ],
  description: `
A one‑stop AI hackathon companion: brainstorm brilliant project ideas,
score them against real‑world criteria, and generate starter code so you can focus on features, not setup.
  `.trim(),
  category:    "Developer Tools",
  status:      "Alpha"
};
