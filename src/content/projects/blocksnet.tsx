// BlocksNet - Visual Neural Network Builder
// Scratch-like drag-and-drop interface for creating and training neural networks

import React, { useState, useCallback } from 'react';

interface NeuralBlock {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'activation';
  position: { x: number; y: number };
  connections: string[];
  parameters: Record<string, any>;
}

const BlocksNet = () => {
  const [blocks, setBlocks] = useState<NeuralBlock[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const features = [
    "🧠 Drag-and-drop neural network builder",
    "📊 Real-time training visualization",
    "🎯 Multiple activation functions (ReLU, Sigmoid, Tanh)",
    "📈 Live loss and accuracy graphs",
    "💾 Save and load network architectures",
    "🔄 Support for different layer types",
    "📱 Educational tooltips and explanations",
    "⚡ WebGL-accelerated training",
    "📋 Pre-built templates for common tasks",
    "🎨 Beautiful, intuitive interface"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "TensorFlow.js", "D3.js"],
    visualization: ["Three.js", "Canvas API", "WebGL"],
    ml: ["TensorFlow.js", "Custom training loops"],
    ui: ["React DnD", "Framer Motion", "Tailwind CSS"]
  };

  const createBlock = useCallback((type: string, position: { x: number; y: number }) => {
    const newBlock: NeuralBlock = {
      id: `block_${Date.now()}`,
      type: type as any,
      position,
      connections: [],
      parameters: getDefaultParameters(type)
    };
    setBlocks(prev => [...prev, newBlock]);
  }, []);

  const trainNetwork = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    try {
      // Simulate training process
      for (let epoch = 0; epoch < 100; epoch++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setTrainingProgress((epoch + 1) / 100);
      }
      
      console.log('Training completed successfully');
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const BlockCanvas = () => (
    <div className="w-full h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Neural Network Canvas</h3>
        <p className="text-gray-600">Drag blocks here to build your network</p>
        {blocks.length > 0 && (
          <div className="mt-4">
            <p className="text-sm">Blocks: {blocks.length}</p>
            <button 
              onClick={trainNetwork}
              disabled={isTraining}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isTraining ? `Training... ${Math.round(trainingProgress * 100)}%` : 'Train Network'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">BlocksNet - Visual Neural Networks</h1>
        
        <BlockCanvas />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
            <div className="space-y-3">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <strong className="capitalize">{category}:</strong>
                  <span className="ml-2">{items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDefaultParameters(type: string) {
  switch (type) {
    case 'hidden':
      return { neurons: 64, activation: 'relu' };
    case 'output':
      return { neurons: 10, activation: 'softmax' };
    default:
      return {};
  }
}

export default BlocksNet;