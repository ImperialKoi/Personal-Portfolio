// CS Exam Review - Competitive Quiz System
// Interactive quiz platform with real-time scoring and leaderboards for computer science exam preparation

import React, { useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

interface Player {
  id: string;
  name: string;
  score: number;
  streak: number;
  answeredQuestions: number;
}

interface GameSession {
  id: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  gameMode: 'practice' | 'competitive' | 'timed';
}

const CSExamReview = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    id: 'player1',
    name: 'You',
    score: 0,
    streak: 0,
    answeredQuestions: 0
  });
  const [leaderboard] = useState<Player[]>([
    { id: '1', name: 'Alex Chen', score: 2450, streak: 12, answeredQuestions: 45 },
    { id: '2', name: 'Sarah Kim', score: 2380, streak: 8, answeredQuestions: 42 },
    { id: '3', name: 'Mike Johnson', score: 2290, streak: 15, answeredQuestions: 38 },
    { id: '4', name: 'You', score: 1850, streak: 5, answeredQuestions: 32 },
    { id: '5', name: 'Lisa Wang', score: 1720, streak: 3, answeredQuestions: 29 }
  ]);

  const features = [
    "🎯 Competitive scoring system with streaks",
    "🏆 Real-time leaderboard rankings",
    "📚 Comprehensive CS topics coverage",
    "⏱️ Multiple game modes (Practice, Timed, Competitive)",
    "📊 Detailed performance analytics",
    "🎮 Achievement system & badges",
    "👥 Multiplayer quiz battles",
    "📈 Progress tracking over time",
    "🔄 Adaptive difficulty adjustment",
    "💡 Detailed explanations for answers"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    realtime: ["WebSockets", "Real-time updates", "Live leaderboards"],
    backend: ["Supabase", "PostgreSQL", "Edge functions"],
    gamification: ["Scoring algorithms", "Achievement system", "Progress tracking"],
    education: ["Question bank", "Difficulty levels", "Performance analytics"]
  };

  const categories = [
    { name: 'Data Structures', questions: 45, icon: '🏗️' },
    { name: 'Algorithms', questions: 52, icon: '⚡' },
    { name: 'Object-Oriented Programming', questions: 38, icon: '🔧' },
    { name: 'Database Systems', questions: 31, icon: '💾' },
    { name: 'Computer Networks', questions: 29, icon: '🌐' },
    { name: 'Operating Systems', questions: 35, icon: '💻' }
  ];

  const sampleQuestion: Question = {
    id: 'q1',
    question: 'What is the time complexity of searching in a balanced binary search tree?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 1,
    category: 'Data Structures',
    difficulty: 'medium',
    explanation: 'In a balanced BST, the height is O(log n), so search operations take O(log n) time.'
  };

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (gameSession && gameSession.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameSession(prev => prev ? {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        } : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameSession?.timeRemaining]);

  const startGame = (mode: 'practice' | 'competitive' | 'timed') => {
    setGameSession({
      id: `game_${Date.now()}`,
      currentQuestion: 1,
      totalQuestions: 20,
      timeRemaining: mode === 'timed' ? 30 : 0,
      gameMode: mode
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const submitAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === sampleQuestion.correctAnswer;
    const points = isCorrect ? (100 + currentPlayer.streak * 10) : 0;
    
    setCurrentPlayer(prev => ({
      ...prev,
      score: prev.score + points,
      streak: isCorrect ? prev.streak + 1 : 0,
      answeredQuestions: prev.answeredQuestions + 1
    }));
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const nextQuestion = () => {
    if (gameSession && gameSession.currentQuestion < gameSession.totalQuestions) {
      setGameSession(prev => prev ? {
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeRemaining: prev.gameMode === 'timed' ? 30 : prev.timeRemaining
      } : null);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameSession(null);
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
        <div>
          <h3 className="text-xl font-semibold">
            Question {gameSession?.currentQuestion} of {gameSession?.totalQuestions}
          </h3>
          <p className="text-sm text-gray-600">{sampleQuestion.category} • {sampleQuestion.difficulty}</p>
        </div>
        
        <div className="text-right">
          {gameSession?.gameMode === 'timed' && (
            <div className="text-lg font-bold text-red-600">
              {formatTime(gameSession.timeRemaining)}
            </div>
          )}
          <div className="text-sm text-gray-600">
            Score: {currentPlayer.score} • Streak: {currentPlayer.streak}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">{sampleQuestion.question}</h4>
        
        <div className="space-y-3">
          {sampleQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !selectedAnswer && submitAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === null
                  ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  : selectedAnswer === index
                    ? index === sampleQuestion.correctAnswer
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : index === sampleQuestion.correctAnswer
                      ? 'border-green-500 bg-green-100'
                      : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold mb-2">Explanation:</h5>
          <p className="text-sm">{sampleQuestion.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <button
          onClick={nextQuestion}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {gameSession?.currentQuestion === gameSession?.totalQuestions ? 'Finish Game' : 'Next Question'}
        </button>
      )}
    </div>
  );

  const LeaderboardView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
      <div className="space-y-3">
        {leaderboard.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg font-bold w-8">#{index + 1}</span>
              <div>
                <p className="font-medium">{player.name}</p>
                <p className="text-sm text-gray-600">
                  {player.answeredQuestions} questions • {player.streak} streak
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">{player.score.toLocaleString()}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CS Exam Review - Competitive Quiz</h1>
        
        {!gameSession ? (
          <>
            <div className="text-center mb-8">
              <p className="text-xl text-gray-600 mb-6">
                Test your computer science knowledge in a competitive environment
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => startGame('practice')}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  📚 Practice Mode
                </button>
                <button 
                  onClick={() => startGame('timed')}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  ⏱️ Timed Challenge
                </button>
                <button 
                  onClick={() => startGame('competitive')}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  🏆 Competitive Mode
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Question Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((category, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{category.icon}</span>
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">{category.questions} questions</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <LeaderboardView />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <GameInterface />
            </div>
            <div>
              <LeaderboardView />
            </div>
          </div>
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

export default CSExamReview;