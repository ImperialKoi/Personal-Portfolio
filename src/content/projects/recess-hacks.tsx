// RecessHacks - Hackathon Event Website
// Comprehensive platform for hackathon registration, team formation, and event management

export const RECESSHACKS = {
  name:        "RecessHacks",
  websiteUrl:  "https://recesshacks-demo.vercel.app",
  githubUrl:   "https://github.com/danielxu/recesshacks",
  summary: `
Comprehensive platform for hackathon registration, team formation, scheduling, and event management.
  `.trim(),
  coreFeatures: [
    "🎯 Online registration & check‑in system",
    "👥 Smart team‑formation matching",
    "📅 Interactive event schedule",
    "🏆 Real‑time leaderboard & judging",
    "💬 In‑app messaging & announcements",
    "🍕 Meal planning & dietary restriction support",
    "🎁 Sponsor showcase & prize tracking",
    "📱 Mobile‑responsive PWA design",
    "🔐 Secure participant authentication",
    "📊 Event analytics & feedback collection"
  ],
  const sponsors = [
    { name: 'TechCorp', tier: 'Platinum', logo: '🏢' },
    { name: 'StartupLab', tier: 'Gold', logo: '🚀' },
    { name: 'DevTools Inc', tier: 'Silver', logo: '⚙️' },
    { name: 'CloudHost', tier: 'Bronze', logo: '☁️' }
  ];
  const day1Schedule: Schedule[] = [
    { time: '9:00 AM', event: 'Registration & Breakfast', location: 'Main Lobby', type: 'meal' },
    { time: '10:00 AM', event: 'Opening Ceremony', location: 'Auditorium', type: 'keynote' },
    { time: '11:00 AM', event: 'Team Formation', location: 'Main Hall', type: 'networking' },
    { time: '12:00 PM', event: 'Hacking Begins!', location: 'All Rooms', type: 'competition' },
    { time: '1:00 PM', event: 'Lunch', location: 'Cafeteria', type: 'meal' },
    { time: '3:00 PM', event: 'API Workshop', location: 'Room 101', type: 'workshop' },
    { time: '6:00 PM', event: 'Dinner', location: 'Cafeteria', type: 'meal' },
    { time: '8:00 PM', event: 'Networking Social', location: 'Lounge', type: 'networking' }
  ];
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'keynote': return '🎤';
      case 'workshop': return '🛠️';
      case 'meal': return '🍽️';
      case 'competition': return '🏆';
      case 'networking': return '🤝';
      default: return '📅';
    }
  }
  techCategories: {
    frontend:     ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend:      ["Supabase", "Real‑time Subscriptions", "Edge Functions"],
    features:     ["PWA", "Push Notifications", "Offline Support"],
    integrations: ["Discord API", "Slack Integration", "Email Notifications"],
    design:       ["Figma", "Custom Illustrations", "Responsive Design"]
  },
  category:    "Event Management",
  status:      "Live",
  description: "A full‑featured hackathon event website that handles everything from registration to team matching, scheduling, and live event tracking.",
};