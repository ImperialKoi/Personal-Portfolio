// RecessHacks - Hackathon Event Website
// Comprehensive platform for hackathon registration, team formation, and event management

import React, { useState } from 'react';

interface Participant {
  id: string;
  name: string;
  school: string;
  skills: string[];
  lookingForTeam: boolean;
}

interface Schedule {
  time: string;
  event: string;
  location: string;
  type: 'keynote' | 'workshop' | 'meal' | 'competition' | 'networking';
}

const RecessHacks = () => {
  const [registeredParticipants] = useState<number>(247);
  const [teamsFormed] = useState<number>(52);
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2'>('day1');

  const features = [
    "🎯 Online registration & check-in system",
    "👥 Smart team formation matching",
    "📅 Interactive event schedule",
    "🏆 Real-time leaderboard & judging",
    "💬 In-app messaging & announcements",
    "🍕 Meal planning & dietary restrictions",
    "🎁 Sponsor showcase & prize tracking",
    "📱 Mobile-responsive PWA design",
    "🔐 Secure participant authentication",
    "📊 Event analytics & feedback collection"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Supabase", "Real-time subscriptions", "Edge functions"],
    features: ["PWA", "Push notifications", "Offline support"],
    integrations: ["Discord API", "Slack integration", "Email notifications"],
    design: ["Figma", "Custom illustrations", "Responsive design"]
  };

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

  const day2Schedule: Schedule[] = [
    { time: '8:00 AM', event: 'Breakfast', location: 'Cafeteria', type: 'meal' },
    { time: '10:00 AM', event: 'Mentor Office Hours', location: 'Various', type: 'networking' },
    { time: '12:00 PM', event: 'Lunch', location: 'Cafeteria', type: 'meal' },
    { time: '2:00 PM', event: 'Submissions Due', location: 'Online', type: 'competition' },
    { time: '3:00 PM', event: 'Project Presentations', location: 'Auditorium', type: 'competition' },
    { time: '5:00 PM', event: 'Judging & Deliberation', location: 'Private', type: 'competition' },
    { time: '6:00 PM', event: 'Awards Ceremony', location: 'Auditorium', type: 'keynote' },
    { time: '7:00 PM', event: 'Closing Reception', location: 'Main Hall', type: 'networking' }
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
  };

  const StatsCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );

  const ScheduleView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Event Schedule</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setSelectedDay('day1')}
            className={`px-4 py-2 rounded text-sm ${
              selectedDay === 'day1' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            Day 1
          </button>
          <button 
            onClick={() => setSelectedDay('day2')}
            className={`px-4 py-2 rounded text-sm ${
              selectedDay === 'day2' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            Day 2
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {(selectedDay === 'day1' ? day1Schedule : day2Schedule).map((item, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mr-4">{getEventIcon(item.type)}</div>
            <div className="flex-1">
              <div className="font-medium">{item.event}</div>
              <div className="text-sm text-gray-600">{item.location}</div>
            </div>
            <div className="text-sm font-medium text-blue-600">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const SponsorsSection = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Our Sponsors</h3>
      <div className="grid grid-cols-2 gap-4">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="text-center p-4 border rounded-lg">
            <div className="text-3xl mb-2">{sponsor.logo}</div>
            <div className="font-medium">{sponsor.name}</div>
            <div className="text-sm text-gray-600">{sponsor.tier}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">RecessHacks 2024</h1>
          <p className="text-xl text-gray-600 mb-6">
            48 hours of coding, creativity, and collaboration
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Register Now
            </button>
            <button className="px-8 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Registered Hackers" value={registeredParticipants.toString()} icon="👨‍💻" />
          <StatsCard title="Teams Formed" value={teamsFormed.toString()} icon="👥" />
          <StatsCard title="Prize Pool" value="$25,000" icon="💰" />
          <StatsCard title="Sponsors" value="12+" icon="🤝" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ScheduleView />
          <SponsorsSection />
        </div>

        {/* Features & Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Platform Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
            <div className="space-y-3">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <strong className="capitalize text-sm">{category}:</strong>
                  <p className="text-xs text-gray-600">{items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecessHacks;