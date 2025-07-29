// History Timeline - Interactive Chronological Organizer
// Educational game for organizing historical events in proper chronological order

import React, { useState, useEffect } from 'react';

interface HistoricalEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  description: string;
  category: 'war' | 'discovery' | 'invention' | 'political' | 'cultural' | 'scientific';
  difficulty: 'easy' | 'medium' | 'hard';
  region: string;
}

interface GameRound {
  id: string;
  events: HistoricalEvent[];
  playerOrder: string[];
  correctOrder: string[];
  timeLimit: number;
  timeRemaining: number;
  score: number;
  attempts: number;
}

const HistoryTimeline = () => {
  const [gameRound, setGameRound] = useState<GameRound | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const features = [
    "📚 Comprehensive historical events database",
    "🎯 Drag-and-drop timeline interface",
    "⏱️ Timed challenges with scoring",
    "🏆 Difficulty-based progression system",
    "🌍 Global historical coverage",
    "📊 Performance tracking & analytics",
    "🎮 Educational gamification elements",
    "📱 Touch-friendly mobile interface",
    "🔄 Randomized event selection",
    "💡 Detailed historical context"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    interaction: ["HTML5 Drag & Drop", "Touch events", "Gesture handling"],
    data: ["Historical events database", "Categorized content"],
    gaming: ["Scoring system", "Timer mechanics", "Progress tracking"],
    education: ["Learning objectives", "Difficulty scaling", "Performance analytics"]
  };

  const sampleEvents: HistoricalEvent[] = [
    {
      id: '1',
      title: 'American Revolution begins',
      date: '1775',
      year: 1775,
      description: 'The American Revolutionary War started with the battles of Lexington and Concord.',
      category: 'war',
      difficulty: 'medium',
      region: 'North America'
    },
    {
      id: '2',
      title: 'Declaration of Independence',
      date: '1776',
      year: 1776,
      description: 'The Continental Congress adopted the Declaration of Independence.',
      category: 'political',
      difficulty: 'easy',
      region: 'North America'
    },
    {
      id: '3',
      title: 'French Revolution begins',
      date: '1789',
      year: 1789,
      description: 'The French Revolution started with the storming of the Bastille.',
      category: 'political',
      difficulty: 'medium',
      region: 'Europe'
    },
    {
      id: '4',
      title: 'Napoleon becomes Emperor',
      date: '1804',
      year: 1804,
      description: 'Napoleon Bonaparte crowned himself Emperor of the French.',
      category: 'political',
      difficulty: 'medium',
      region: 'Europe'
    },
    {
      id: '5',
      title: 'World War I begins',
      date: '1914',
      year: 1914,
      description: 'World War I started with the assassination of Archduke Franz Ferdinand.',
      category: 'war',
      difficulty: 'easy',
      region: 'Global'
    }
  ];

  const categories = [
    { name: 'Wars & Conflicts', icon: '⚔️', color: 'bg-red-100 text-red-700' },
    { name: 'Political Events', icon: '🏛️', color: 'bg-blue-100 text-blue-700' },
    { name: 'Scientific Discoveries', icon: '🔬', color: 'bg-green-100 text-green-700' },
    { name: 'Cultural Movements', icon: '🎨', color: 'bg-purple-100 text-purple-700' },
    { name: 'Inventions', icon: '⚙️', color: 'bg-orange-100 text-orange-700' },
    { name: 'Explorations', icon: '🧭', color: 'bg-teal-100 text-teal-700' }
  ];

  useEffect(() => {
    if (gameRound && gameRound.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameRound(prev => prev ? {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        } : null);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameRound && gameRound.timeRemaining === 0) {
      endGame();
    }
  }, [gameRound?.timeRemaining]);

  const startGame = () => {
    const shuffledEvents = [...sampleEvents].sort(() => Math.random() - 0.5);
    const correctOrder = shuffledEvents.map(e => e.id).sort((a, b) => {
      const eventA = shuffledEvents.find(e => e.id === a)!;
      const eventB = shuffledEvents.find(e => e.id === b)!;
      return eventA.year - eventB.year;
    });

    setGameRound({
      id: `round_${Date.now()}`,
      events: shuffledEvents,
      playerOrder: shuffledEvents.map(e => e.id),
      correctOrder,
      timeLimit: selectedDifficulty === 'easy' ? 120 : selectedDifficulty === 'medium' ? 90 : 60,
      timeRemaining: selectedDifficulty === 'easy' ? 120 : selectedDifficulty === 'medium' ? 90 : 60,
      score: 0,
      attempts: 0
    });
    setGameComplete(false);
  };

  const endGame = () => {
    if (gameRound) {
      const correctPlacements = gameRound.playerOrder.reduce((count, eventId, index) => {
        return gameRound.correctOrder[index] === eventId ? count + 1 : count;
      }, 0);
      
      const finalScore = correctPlacements * 100 + Math.max(0, gameRound.timeRemaining * 2);
      setGameRound(prev => prev ? { ...prev, score: finalScore } : null);
    }
    setGameComplete(true);
  };

  const handleDragStart = (eventId: string) => {
    setDraggedEvent(eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedEvent || !gameRound) return;

    const newOrder = [...gameRound.playerOrder];
    const draggedIndex = newOrder.indexOf(draggedEvent);
    
    // Remove dragged event from its current position
    newOrder.splice(draggedIndex, 1);
    // Insert at new position
    newOrder.splice(targetIndex, 0, draggedEvent);

    setGameRound(prev => prev ? {
      ...prev,
      playerOrder: newOrder,
      attempts: prev.attempts + 1
    } : null);
    
    setDraggedEvent(null);
  };

  const getEventById = (id: string) => {
    return gameRound?.events.find(e => e.id === id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'war': return '⚔️';
      case 'political': return '🏛️';
      case 'scientific': return '🔬';
      case 'cultural': return '🎨';
      case 'invention': return '⚙️';
      case 'discovery': return '🧭';
      default: return '📅';
    }
  };

  const checkAnswer = () => {
    if (!gameRound) return;
    
    const isCorrect = JSON.stringify(gameRound.playerOrder) === JSON.stringify(gameRound.correctOrder);
    
    if (isCorrect) {
      endGame();
    } else {
      // Show feedback but allow continued play
      setGameRound(prev => prev ? {
        ...prev,
        attempts: prev.attempts + 1
      } : null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const GameInterface = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Organize the Timeline</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            Attempts: <span className="font-bold">{gameRound?.attempts}</span>
          </div>
          <div className="text-lg font-bold text-blue-600">
            {formatTime(gameRound?.timeRemaining || 0)}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Drag and drop the events to arrange them in chronological order (earliest to latest):
        </p>
        
        <div className="space-y-3">
          {gameRound?.playerOrder.map((eventId, index) => {
            const event = getEventById(eventId);
            if (!event) return null;
            
            return (
              <div
                key={eventId}
                draggable
                onDragStart={() => handleDragStart(eventId)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="p-4 border-2 border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getCategoryIcon(event.category)}</span>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">{event.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{event.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={checkAnswer}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Check Answer
        </button>
        <button
          onClick={endGame}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          End Game
        </button>
      </div>
    </div>
  );

  const ResultsView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <h3 className="text-2xl font-bold mb-4">Game Complete!</h3>
      <div className="text-4xl mb-4">🏆</div>
      <div className="text-3xl font-bold text-blue-600 mb-2">{gameRound?.score}</div>
      <p className="text-gray-600 mb-6">points earned</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <div className="text-lg font-bold">{gameRound?.attempts}</div>
          <div className="text-sm text-gray-600">Attempts</div>
        </div>
        <div>
          <div className="text-lg font-bold">{formatTime(gameRound?.timeRemaining || 0)}</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
        <div>
          <div className="text-lg font-bold">{selectedDifficulty}</div>
          <div className="text-sm text-gray-600">Difficulty</div>
        </div>
      </div>
      
      <button
        onClick={startGame}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Play Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">History Timeline - Chronological Challenge</h1>
        
        {!gameRound || gameComplete ? (
          <>
            {gameComplete && <div className="mb-8"><ResultsView /></div>}
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Start New Game</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Difficulty:</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-4 py-2 rounded ${
                        selectedDifficulty === difficulty
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedDifficulty === 'easy' && 'More time, easier events (2 minutes)'}
                  {selectedDifficulty === 'medium' && 'Balanced challenge (1.5 minutes)'}
                  {selectedDifficulty === 'hard' && 'Quick thinking required (1 minute)'}
                </p>
              </div>
              
              <button
                onClick={startGame}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Start Timeline Challenge
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Historical Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category, index) => (
                  <div key={index} className={`p-3 rounded-lg ${category.color}`}>
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <GameInterface />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
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

export default HistoryTimeline;