// CaliCalender - AI-Powered Calendar Application
// Smart scheduling with AI assistance for optimal time management

import React, { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  priority: 'low' | 'medium' | 'high';
  aiSuggested?: boolean;
}

const CaliCalender = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const features = [
    "🤖 AI-powered scheduling suggestions",
    "📅 Smart conflict resolution",
    "⏰ Optimal meeting time finder",
    "🎯 Priority-based event organization",
    "📱 Cross-platform synchronization",
    "🔔 Intelligent reminder system",
    "📊 Productivity analytics & insights",
    "🌍 Multi-timezone support",
    "📝 AI-generated meeting agendas",
    "🔄 Auto-rescheduling for conflicts"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "FullCalendar"],
    ai: ["OpenAI GPT-4", "Natural Language Processing"],
    backend: ["Supabase", "Edge Functions", "Real-time subscriptions"],
    integrations: ["Google Calendar", "Outlook", "Zoom API"],
    mobile: ["PWA", "Push notifications"]
  };

  const aiCapabilities = [
    "📝 Natural language event creation",
    "🎯 Smart scheduling optimization",
    "⚡ Conflict detection and resolution",
    "📈 Productivity pattern analysis",
    "🤝 Meeting preparation assistance",
    "📍 Location-based scheduling"
  ];

  useEffect(() => {
    // Simulate AI suggestions
    const suggestions = [
      "Schedule 30min for email review at 9 AM",
      "Block focus time for deep work from 10-12 PM",
      "Suggest rescheduling the 3 PM meeting to avoid conflicts"
    ];
    setAiSuggestions(suggestions);
  }, [currentDate]);

  const generateAISchedule = async () => {
    try {
      // Simulate AI scheduling
      const aiEvent: CalendarEvent = {
        id: `ai_${Date.now()}`,
        title: "AI Suggested: Focus Block",
        start: new Date(Date.now() + 60 * 60 * 1000),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000),
        priority: 'high',
        aiSuggested: true
      };
      
      setEvents(prev => [...prev, aiEvent]);
    } catch (error) {
      console.error('AI scheduling failed:', error);
    }
  };

  const CalendarView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Smart Calendar</h3>
        <button 
          onClick={generateAISchedule}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          🤖 AI Schedule
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        {events.map(event => (
          <div 
            key={event.id} 
            className={`p-3 rounded ${event.aiSuggested ? 'bg-blue-100 border-blue-300' : 'bg-gray-100'} border`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{event.title}</span>
              {event.aiSuggested && <span className="text-blue-600 text-sm">🤖 AI</span>}
            </div>
            <div className="text-sm text-gray-600">
              {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CaliCalender - AI-Powered Scheduling</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">AI Suggestions</h3>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">AI Capabilities</h3>
            <ul className="space-y-2">
              {aiCapabilities.map((capability, index) => (
                <li key={index} className="flex items-center text-sm">
                  {capability}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
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

export default CaliCalender;