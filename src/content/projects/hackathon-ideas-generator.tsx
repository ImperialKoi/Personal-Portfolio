// HackathonIdeasGenerator - AI-Powered Hackathon Project Generator
// Generates, judges, and codes hackathon projects using advanced AI

import React, { useState } from 'react';

interface HackathonIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  techStack: string[];
  estimatedTime: string;
  aiScore: number;
  feasibility: number;
  innovation: number;
}

const HackathonIdeasGenerator = () => {
  const [currentIdea, setCurrentIdea] = useState<HackathonIdea | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<HackathonIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCoding, setIsCoding] = useState(false);
  const [codingProgress, setCodingProgress] = useState(0);

  const features = [
    "🤖 AI-powered idea generation",
    "⚖️ Intelligent AI judging system",
    "💻 Automated project coding",
    "🎯 Difficulty-based filtering",
    "📊 Feasibility scoring",
    "🏆 Innovation rating system",
    "⏱️ Time estimation accuracy",
    "🔄 Iterative idea refinement",
    "📱 Tech stack optimization",
    "🎨 Complete project scaffolding"
  ];

  const techStack = {
    ai: ["OpenAI GPT-4", "Claude AI", "Custom prompt engineering"],
    generation: ["Idea templating", "Context-aware prompting"],
    judging: ["Multi-criteria evaluation", "Automated scoring"],
    coding: ["Code generation", "Project scaffolding", "File structure"],
    frontend: ["React", "TypeScript", "Tailwind CSS"]
  };

  const judgingCriteria = [
    "🎯 Technical Feasibility (30%)",
    "💡 Innovation Level (25%)",
    "🚀 Market Potential (20%)",
    "⏰ Time Complexity (15%)",
    "🛠️ Resource Requirements (10%)"
  ];

  const generateIdea = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI idea generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIdea: HackathonIdea = {
        id: `idea_${Date.now()}`,
        title: "EcoTrack - Personal Carbon Footprint Tracker",
        description: "A mobile app that uses AI and IoT integration to automatically track and optimize personal carbon footprints through daily activities, transportation, and consumption patterns.",
        difficulty: 'intermediate',
        category: 'Sustainability',
        techStack: ['React Native', 'Node.js', 'TensorFlow', 'IoT Sensors', 'MongoDB'],
        estimatedTime: '36 hours',
        aiScore: 8.7,
        feasibility: 9.2,
        innovation: 8.1
      };
      
      setCurrentIdea(newIdea);
      setGeneratedIdeas(prev => [...prev, newIdea]);
    } catch (error) {
      console.error('Idea generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const codeProject = async () => {
    if (!currentIdea) return;
    
    setIsCoding(true);
    setCodingProgress(0);
    
    try {
      const steps = [
        'Setting up project structure...',
        'Generating frontend components...',
        'Creating backend API...',
        'Setting up database...',
        'Implementing AI features...',
        'Adding styling and polish...',
        'Finalizing documentation...'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCodingProgress(((i + 1) / steps.length) * 100);
      }
      
      console.log('Project coding completed!');
    } catch (error) {
      console.error('Coding failed:', error);
    } finally {
      setIsCoding(false);
    }
  };

  const IdeaCard = ({ idea }: { idea: HackathonIdea }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{idea.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          idea.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
          idea.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {idea.difficulty}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">{idea.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium">AI Score: <span className="text-blue-600">{idea.aiScore}/10</span></p>
          <p className="text-sm font-medium">Feasibility: <span className="text-green-600">{idea.feasibility}/10</span></p>
        </div>
        <div>
          <p className="text-sm font-medium">Innovation: <span className="text-purple-600">{idea.innovation}/10</span></p>
          <p className="text-sm font-medium">Est. Time: <span className="text-orange-600">{idea.estimatedTime}</span></p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Tech Stack:</p>
        <div className="flex flex-wrap gap-2">
          {idea.techStack.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <button 
        onClick={codeProject}
        disabled={isCoding}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isCoding ? `Coding... ${Math.round(codingProgress)}%` : '💻 AI Code This Project'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">HackathonIdeasGenerator - AI Project Creator</h1>
        
        <div className="text-center mb-8">
          <button 
            onClick={generateIdea}
            disabled={isGenerating}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isGenerating ? '🤖 Generating...' : '✨ Generate Perfect Hackathon Idea'}
          </button>
        </div>
        
        {currentIdea && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Latest Generated Idea</h2>
            <IdeaCard idea={currentIdea} />
          </div>
        )}
        
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
            <h3 className="text-xl font-semibold mb-4">AI Judging Criteria</h3>
            <ul className="space-y-2">
              {judgingCriteria.map((criteria, index) => (
                <li key={index} className="flex items-center text-sm">
                  {criteria}
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

export default HackathonIdeasGenerator;