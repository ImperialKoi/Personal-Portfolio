// EASA Website - East Asian Student Association
// Professional organization website for the East Asian Student Association

export const EASA = {
  name:        "EASA Website",
  websiteUrl:  "https://easa-demo.vercel.app",      // replace with your live URL
  githubUrl:   "https://github.com/danielxu/easa-website",
  summary: `
Professional organization site for the East Asian Student Association.
Features event management, member profiles, and community engagement.
  `.trim(),
  coreFeatures: [
    "🌏 Interactive event calendar with categorization",
    "👥 Board member profiles & bios",
    "📝 Online membership registration",
    "📸 Photo gallery & event highlights",
    "🤝 Community partnerships showcase",
    "🗣️ Multi‑language support (EN/中文/한국어/日本語)",
    "📧 Newsletter signup & notifications",
    "📱 Mobile‑responsive PWA design"
  ],
  features: [
    "• Access to exclusive cultural events",
    "• Networking opportunities",
    "• Academic and career support",
    "• Leadership development",
    "• Cultural exchange programs"
  ],
  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Lunar New Year Celebration',
      date: '2024-02-10',
      time: '6:00 PM - 9:00 PM',
      location: 'Student Union Ballroom',
      description: 'Join us for traditional performances, authentic cuisine, and cultural activities celebrating the Year of the Dragon.',
      category: 'cultural'
    },
    {
      id: '2',
      title: 'Community Service Day',
      date: '2024-02-25',
      time: '9:00 AM - 3:00 PM',
      location: 'Local Community Center',
      description: 'Volunteer opportunity to give back to the local community through various service projects.',
      category: 'volunteer'
    }
  ],
  technologies: [
    "React", "TypeScript", "Tailwind CSS",
    "Framer Motion", "Static CMS", "Netlify (or your host)"
  ],
  description: `
A clean, modern site for EASA that highlights cultural programming, academic panels,
and volunteer initiatives—all wrapped in an accessible, multilingual interface.
  `.trim(),
  category:    "Non‑Profit / Community",
  status:      "Live",
  highlights: [
    "Dynamic tabbed navigation (About, Events, Board, Join)",
    "Category‑colored event cards",
    "Animated member avatars",
    "Responsive grid layouts"
  ]
};
