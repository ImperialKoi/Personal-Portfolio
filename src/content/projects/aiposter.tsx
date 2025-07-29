// AIPoster - AI-Powered Infographics Generator
// Advanced AI system for creating beautiful, data-driven infographics with smart layout

import React, { useState } from 'react';

interface InfographicTemplate {
  id: string;
  name: string;
  category: string;
  layout: 'vertical' | 'horizontal' | 'grid' | 'timeline';
  elements: number;
  aiOptimized: boolean;
}

interface GeneratedInfographic {
  id: string;
  title: string;
  template: InfographicTemplate;
  imageUrl: string;
  dataPoints: number;
  generationTime: number;
}

const AIPoster = () => {
  const [currentInfographic, setCurrentInfographic] = useState<GeneratedInfographic | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InfographicTemplate | null>(null);
  const [userInput, setUserInput] = useState('');

  const features = [
    "🎨 AI-powered layout optimization",
    "📊 Automatic data visualization",
    "🖼️ Intelligent image selection & placement",
    "🎯 Context-aware design choices",
    "📱 Responsive design generation",
    "🌈 Smart color palette selection",
    "📝 Auto-generated compelling copy",
    "⚡ Real-time preview & editing",
    "📤 Multiple export formats (PNG, PDF, SVG)",
    "🔄 Iterative design refinement"
  ];

  const techStack = {
    ai: ["GPT-4 Vision", "DALL-E 3", "Custom layout algorithms"],
    design: ["Canvas API", "Fabric.js", "CSS Grid", "SVG manipulation"],
    data: ["D3.js", "Chart.js", "Data parsing & visualization"],
    backend: ["Node.js", "Image processing", "PDF generation"],
    frontend: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"]
  };

  const templates: InfographicTemplate[] = [
    {
      id: 'modern_stats',
      name: 'Modern Statistics',
      category: 'Business',
      layout: 'vertical',
      elements: 6,
      aiOptimized: true
    },
    {
      id: 'timeline_story',
      name: 'Timeline Story',
      category: 'Educational',
      layout: 'timeline',
      elements: 8,
      aiOptimized: true
    },
    {
      id: 'comparison_grid',
      name: 'Comparison Grid',
      category: 'Analysis',
      layout: 'grid',
      elements: 4,
      aiOptimized: true
    },
    {
      id: 'process_flow',
      name: 'Process Flow',
      category: 'Workflow',
      layout: 'horizontal',
      elements: 5,
      aiOptimized: true
    }
  ];

  const aiCapabilities = [
    "🧠 Content analysis & structure",
    "🎨 Aesthetic composition optimization",
    "📏 Typography & spacing automation",
    "🖼️ Contextual image generation",
    "📊 Data-driven chart selection",
    "🌈 Brand-aware color harmony"
  ];

  const generateInfographic = async () => {
    if (!selectedTemplate || !userInput.trim()) return;
    
    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newInfographic: GeneratedInfographic = {
        id: `infographic_${Date.now()}`,
        title: `AI Generated: ${userInput.slice(0, 30)}...`,
        template: selectedTemplate,
        imageUrl: '/placeholder-infographic.png',
        dataPoints: Math.floor(Math.random() * 50) + 10,
        generationTime: Date.now() - startTime
      };
      
      setCurrentInfographic(newInfographic);
    } catch (error) {
      console.error('Infographic generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const TemplateCard = ({ template }: { template: InfographicTemplate }) => (
    <div 
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selectedTemplate?.id === template.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedTemplate(template)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{template.name}</h4>
        {template.aiOptimized && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            🤖 AI
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">{template.category}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{template.layout} layout</span>
        <span>{template.elements} elements</span>
      </div>
    </div>
  );

  const InfographicPreview = ({ infographic }: { infographic: GeneratedInfographic }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">{infographic.title}</h3>
      
      <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🎨</div>
          <p className="text-lg font-semibold">Generated Infographic</p>
          <p className="text-sm text-gray-600">
            {infographic.dataPoints} data points visualized
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Template:</span>
          <p className="text-gray-600">{infographic.template.name}</p>
        </div>
        <div>
          <span className="font-medium">Generation Time:</span>
          <p className="text-gray-600">{infographic.generationTime}ms</p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Download PNG
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Export PDF
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AIPoster - Intelligent Infographics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Content Input</h3>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your data, topic, or message you want to visualize..."
                className="w-full h-32 p-3 border rounded-lg resize-none"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Template</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
            
            <button 
              onClick={generateInfographic}
              disabled={isGenerating || !selectedTemplate || !userInput.trim()}
              className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              {isGenerating ? '🎨 AI Creating...' : '✨ Generate Infographic'}
            </button>
          </div>
          
          <div>
            {currentInfographic ? (
              <InfographicPreview infographic={currentInfographic} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🎨</div>
                  <p>Your AI-generated infographic will appear here</p>
                </div>
              </div>
            )}
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

export default AIPoster;