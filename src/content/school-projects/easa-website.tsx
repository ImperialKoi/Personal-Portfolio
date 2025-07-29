// EASA Website - East Asian Student Association
// Professional organization website for the East Asian Student Association

import React, { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'cultural' | 'academic' | 'social' | 'volunteer';
  image?: string;
}

interface BoardMember {
  id: string;
  name: string;
  position: string;
  year: string;
  major: string;
  bio: string;
  image?: string;
}

const EASAWebsite = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'board' | 'join'>('about');

  const features = [
    "🌏 Cultural event organization & promotion",
    "📅 Interactive event calendar",
    "👥 Board member profiles & contact",
    "📝 Online membership registration",
    "📸 Photo gallery & event highlights",
    "📱 Mobile-responsive design",
    "🌐 Multi-language support (English/Chinese/Korean/Japanese)",
    "📧 Newsletter signup & notifications",
    "🤝 Community partnerships showcase",
    "📋 Resource sharing for students"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    cms: ["Content management", "Event scheduling", "Photo galleries"],
    features: ["Responsive design", "Accessibility", "SEO optimization"],
    integrations: ["Email services", "Social media", "Payment processing"],
    hosting: ["Static hosting", "CDN", "Performance optimization"]
  };

  const boardMembers: BoardMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      position: 'President',
      year: 'Senior',
      major: 'Computer Science',
      bio: 'Passionate about building bridges between cultures and promoting Asian heritage on campus.'
    },
    {
      id: '2',
      name: 'Kevin Liu',
      position: 'Vice President',
      year: 'Junior',
      major: 'Business Administration',
      bio: 'Dedicated to organizing meaningful events that celebrate our diverse East Asian cultures.'
    },
    {
      id: '3',
      name: 'Yuki Tanaka',
      position: 'Secretary',
      year: 'Sophomore',
      major: 'International Relations',
      bio: 'Focused on effective communication and maintaining strong community connections.'
    },
    {
      id: '4',
      name: 'Min-jun Park',
      position: 'Treasurer',
      year: 'Junior',
      major: 'Economics',
      bio: 'Ensuring financial sustainability while maximizing resources for impactful programs.'
    }
  ];

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
      title: 'Asian Career Network Panel',
      date: '2024-02-15',
      time: '7:00 PM - 8:30 PM',
      location: 'Business Building, Room 201',
      description: 'Panel discussion with successful Asian professionals sharing career insights and networking opportunities.',
      category: 'academic'
    },
    {
      id: '3',
      title: 'K-Pop Dance Workshop',
      date: '2024-02-20',
      time: '5:00 PM - 7:00 PM',
      location: 'Recreation Center Studio A',
      description: 'Learn popular K-Pop choreography in a fun, beginner-friendly environment.',
      category: 'cultural'
    },
    {
      id: '4',
      title: 'Community Service Day',
      date: '2024-02-25',
      time: '9:00 AM - 3:00 PM',
      location: 'Local Community Center',
      description: 'Volunteer opportunity to give back to the local community through various service projects.',
      category: 'volunteer'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'volunteer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AboutSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Welcome to EASA</h2>
        <p className="text-lg">
          The East Asian Student Association is dedicated to celebrating and promoting East Asian cultures 
          while fostering community among students from China, Japan, Korea, and other East Asian countries.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl mb-3">🌸</div>
          <h3 className="text-xl font-semibold mb-2">Cultural Heritage</h3>
          <p className="text-gray-600">
            Celebrating the rich traditions, customs, and heritage of East Asian cultures through 
            authentic events and educational programs.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Community Building</h3>
          <p className="text-gray-600">
            Creating a supportive network for East Asian students and allies to connect, 
            collaborate, and build lasting friendships.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="text-xl font-semibold mb-2">Academic Support</h3>
          <p className="text-gray-600">
            Providing resources, mentorship, and academic support to help East Asian students 
            succeed in their educational journey.
          </p>
        </div>
      </div>
    </div>
  );

  const EventsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <span className={`px-2 py-1 rounded text-sm ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">🕐</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📍</span>
                  <span>{event.location}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{event.description}</p>
              
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BoardSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meet Our Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boardMembers.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.position}</p>
                <p className="text-sm text-gray-600">{member.year} • {member.major}</p>
                <p className="text-gray-700 mt-2">{member.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const JoinSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Join EASA</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Become a Member</h3>
        <p className="text-gray-700 mb-6">
          Join our vibrant community of East Asian students and allies. Membership is open to all students 
          interested in East Asian culture, regardless of background.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-2">Benefits Include:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Access to exclusive cultural events</li>
              <li>• Networking opportunities</li>
              <li>• Academic and career support</li>
              <li>• Leadership development</li>
              <li>• Cultural exchange programs</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">How to Join:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Complete online registration form</li>
              <li>• Attend new member orientation</li>
              <li>• Participate in welcome activities</li>
              <li>• Connect with board members</li>
              <li>• Start enjoying membership benefits!</li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Register Now
          </button>
          <button className="px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-red-600">EASA</div>
              <div className="ml-2 text-gray-600">East Asian Student Association</div>
            </div>
            
            <div className="flex space-x-6">
              {(['about', 'events', 'board', 'join'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded ${
                    activeTab === tab
                      ? 'text-red-600 bg-red-50 font-medium'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'about' && <AboutSection />}
        {activeTab === 'events' && <EventsSection />}
        {activeTab === 'board' && <BoardSection />}
        {activeTab === 'join' && <JoinSection />}
      </main>

      {/* Footer with Tech Stack */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Website Features</h3>
              <ul className="space-y-2">
                {features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
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
          
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; 2024 East Asian Student Association. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EASAWebsite;