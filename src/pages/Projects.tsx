import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Github, Lock, Unlock, Trophy, Code, Terminal, Zap, Shuffle, Target, Gamepad2, Timer, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import project data
import { CANDIT } from '@/content/projects/candit.js';
import { BLOCKSNET } from '@/content/projects/blocksnet.tsx';
import { CALICALENDER } from '@/content/projects/calicalender.tsx';
import { HACKATHONIDEASGENERATOR } from '@/content/projects/hackathon-ideas-generator.tsx';
import { AIPOSTER } from '@/content/projects/aiposter.tsx';
import { SKINSCOPE } from '@/content/projects/skinscope.tsx';
import { ECOSCAN } from '@/content/projects/logoscan.tsx';
import { RECESSHACKS } from '@/content/projects/recess-hacks.tsx';

// Import school projects
import { CSEXAMREVIEW } from '@/content/school-projects/cs-exam-review.tsx';
import { EASA } from '@/content/school-projects/easa-website.tsx';
import { HISTORYTIMELINE } from '@/content/school-projects/history-timeline.tsx';

// Enhanced challenge types with different minigames
const baseChallenges = [
  {
    id: 1,
    type: 'quiz',
    title: "Code the Algorithm",
    description: "What's the time complexity of binary search?",
    question: "Binary search has time complexity:",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    hint: "Think about how the search space is divided...",
    icon: Code
  },
  {
    id: 2,
    type: 'memory',
    title: "Memory Challenge",
    description: "Remember the sequence of technologies",
    sequence: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    hint: "Frontend to backend flow",
    icon: Target
  },
  {
    id: 3,
    type: 'typing',
    title: "Speed Coding",
    description: "Type this code snippet as fast as you can!",
    code: "const handleSubmit = (e) => { e.preventDefault(); }",
    timeLimit: 15,
    hint: "Focus on accuracy over speed",
    icon: Timer
  },
  {
    id: 4,
    type: 'quiz',
    title: "Debug the Logic",
    description: "Find the missing operator",
    question: "Complete: if (x ___ 0 && y > 5)",
    options: ["=", "==", "===", "!="],
    correct: 2,
    hint: "We want to check equality, not assignment",
    icon: Code
  },
  {
    id: 5,
    type: 'pattern',
    title: "Pattern Recognition",
    description: "Complete the sequence",
    pattern: [1, 1, 2, 3, 5, 8, "?"],
    options: [11, 13, 15, 21],
    correct: 1,
    hint: "Each number is the sum of the two preceding ones",
    icon: Shuffle
  },
  {
    id: 6,
    type: 'memory',
    title: "Tech Stack Memory",
    description: "Remember the order of these frameworks",
    sequence: ["Express", "MongoDB", "Redis", "Docker"],
    hint: "Backend tech stack order",
    icon: Target
  },
  {
    id: 7,
    type: 'typing',
    title: "Arrow Function Speed",
    description: "Type this modern JS syntax quickly!",
    code: "const users = data.filter(user => user.active).map(u => u.name)",
    timeLimit: 18,
    hint: "Modern JavaScript functional programming",
    icon: Timer
  },
  {
    id: 8,
    type: 'quiz',
    title: "CSS Flexbox",
    description: "Flexbox alignment knowledge",
    question: "Which property centers items both horizontally and vertically?",
    options: ["align-items: center", "justify-content: center", "place-items: center", "Both A and B"],
    correct: 3,
    hint: "You need both axes covered",
    icon: Code
  },
  {
    id: 9,
    type: 'pattern',
    title: "Binary Pattern",
    description: "Complete the binary sequence",
    pattern: [2, 4, 8, 16, "?"],
    options: [24, 32, 20, 18],
    correct: 1,
    hint: "Powers of 2",
    icon: Shuffle
  },
  {
    id: 10,
    type: 'memory',
    title: "Database Commands",
    description: "Remember SQL command order",
    sequence: ["SELECT", "FROM", "WHERE", "ORDER BY"],
    hint: "SQL query structure",
    icon: Target
  },
  {
    id: 11,
    type: 'typing',
    title: "React Hook",
    description: "Type this React hook correctly!",
    code: "const [state, setState] = useState(initialValue)",
    timeLimit: 12,
    hint: "React's most basic hook",
    icon: Timer
  }
];

const mainProjects = [
  CANDIT,
  BLOCKSNET, 
  CALICALENDER,
  HACKATHONIDEASGENERATOR,
  AIPOSTER,
  SKINSCOPE,
  ECOSCAN,
  RECESSHACKS
];

const schoolProjects = [
  CSEXAMREVIEW,
  EASA,
  HISTORYTIMELINE
];

const allProjects = [...mainProjects, ...schoolProjects];

// Memory game component
const MemoryGame = ({ challenge, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userSequence, setUserSequence] = useState([]);
  const [showSequence, setShowSequence] = useState(true);
  const [gamePhase, setGamePhase] = useState('showing'); // showing, input, complete

  useEffect(() => {
    if (gamePhase === 'showing') {
      const timer = setTimeout(() => {
        setGamePhase('input');
        setShowSequence(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  const handleItemClick = (item) => {
    if (gamePhase !== 'input') return;
    
    const newSequence = [...userSequence, item];
    setUserSequence(newSequence);
    
    if (newSequence.length === challenge.sequence.length) {
      const isCorrect = newSequence.every((item, index) => item === challenge.sequence[index]);
      onComplete(isCorrect);
    }
  };

  const shuffledOptions = [...challenge.sequence].sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {gamePhase === 'showing' ? 'Memorize this sequence...' : 'Click items in the correct order'}
        </p>
        
        {gamePhase === 'showing' && (
          <div className="flex flex-wrap gap-2 justify-center mb-4 p-4 bg-primary/5 rounded-lg">
            {challenge.sequence.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-sm animate-pulse">
                {item}
              </Badge>
            ))}
          </div>
        )}
        
        {gamePhase === 'input' && (
          <>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <p className="text-sm w-full mb-2">Your sequence:</p>
              {userSequence.map((item, index) => (
                <Badge key={index} variant="default" className="text-sm">
                  {item}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {shuffledOptions.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleItemClick(item)}
                  disabled={userSequence.includes(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Typing game component
const TypingGame = ({ challenge, onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onComplete(userInput === challenge.code);
    }
  }, [timeLeft, isActive, userInput, challenge.code, onComplete]);

  useEffect(() => {
    if (userInput === challenge.code) {
      setIsActive(false);
      onComplete(true);
    }
  }, [userInput, challenge.code, onComplete]);

  const accuracy = userInput.length > 0 ? 
    (userInput.split('').filter((char, i) => char === challenge.code[i]).length / userInput.length * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge variant="outline">Accuracy: {Math.round(accuracy)}%</Badge>
      </div>
      
      <div className="bg-muted p-4 rounded-lg font-mono text-sm">
        <div className="mb-2 text-muted-foreground">Type this:</div>
        <div className="bg-background p-2 rounded border">
          {challenge.code.split('').map((char, index) => (
            <span
              key={index}
              className={`${
                index < userInput.length
                  ? userInput[index] === char
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                  : 'bg-gray-100'
              }`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      
      <Input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Start typing..."
        className="font-mono"
        disabled={!isActive}
      />
    </div>
  );
};

// Pattern game component
const PatternGame = ({ challenge, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setTimeout(() => {
      onComplete(answerIndex === challenge.correct);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg mb-4">Complete the pattern:</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6 p-4 bg-primary/5 rounded-lg">
          {challenge.pattern.map((item, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg ${
                item === "?" ? 'border-dashed border-primary bg-primary/10' : 'border-solid border-muted bg-background'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {challenge.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? (index === challenge.correct ? "default" : "destructive") : "outline"}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className="h-12 text-lg"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main component
export default function Projects() {
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [unlockedProjects, setUnlockedProjects] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [allUnlocked, setAllUnlocked] = useState(false);

  const currentChallengeData = challenges[currentChallenge];
  const progress = challenges.length > 0 ? ((currentChallenge + 1) / challenges.length) * 100 : 0;

  const handleChallengeComplete = useCallback((isCorrect) => {
    setShowResult(true);
    
    // Always unlock exactly one project
    const nextProjectIndex = unlockedProjects.length;
    if (nextProjectIndex < allProjects.length) {
      setUnlockedProjects([...unlockedProjects, nextProjectIndex]);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setAllUnlocked(true);
        setUnlockedProjects(Array.from({ length: allProjects.length }, (_, i) => i));
      }
    }, 2000);
  }, [currentChallenge, unlockedProjects, challenges.length, allProjects.length]);

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    handleChallengeComplete(answerIndex === currentChallengeData.correct);
  };

  const resetGame = () => {
    // Shuffle challenges for new game
    const shuffled = [...baseChallenges].sort(() => Math.random() - 0.5).slice(0, allProjects.length);
    setChallenges(shuffled);
    setCurrentChallenge(0);
    setUnlockedProjects([]);
    setGameStarted(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setAllUnlocked(false);
  };

  const getProjectCardHeight = (project) => {
    // Fixed height to prevent overflow
    return 'h-72';
  };

  const startGame = () => {
    // Shuffle challenges when starting
    const shuffled = [...baseChallenges].sort(() => Math.random() - 0.5).slice(0, allProjects.length);
    setChallenges(shuffled);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
            >
              <Gamepad2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold">🎮 Project Vault</h1>
            <p className="text-xl text-muted-foreground">
              Complete diverse coding challenges to unlock my projects!
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Game Modes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Code Quiz</div>
                  <div className="text-xs text-muted-foreground">Algorithm & syntax</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Memory Game</div>
                  <div className="text-xs text-muted-foreground">Tech sequences</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Speed Typing</div>
                  <div className="text-xs text-muted-foreground">Code snippets</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-primary" />
                <span>Each challenge unlocks exactly one project</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Includes both main projects and school work</span>
              </div>
              <div className="flex items-center gap-3">
                <Shuffle className="w-4 h-4 text-primary" />
                <span>Challenges are randomized each game</span>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={startGame}
            className="text-lg px-8"
          >
            Start Challenge
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🎮 Project Vault</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="outline">Progress: {unlockedProjects.length}/{allProjects.length}</Badge>
            <Badge variant="outline">Challenge: {currentChallenge + 1}/{challenges.length}</Badge>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>

        {!allUnlocked && challenges.length > 0 && (
          <motion.div 
            key={currentChallenge}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <currentChallengeData.icon className="w-5 h-5" />
                  Challenge {currentChallenge + 1}: {currentChallengeData.title}
                </CardTitle>
                <CardDescription>{currentChallengeData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentChallengeData.type === 'quiz' && (
                  <>
                    <h3 className="text-lg font-medium">{currentChallengeData.question}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentChallengeData.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswer === index ? (index === currentChallengeData.correct ? "default" : "destructive") : "outline"}
                          onClick={() => !showResult && handleQuizAnswer(index)}
                          disabled={showResult}
                          className="text-left justify-start h-auto py-3"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
                
                {currentChallengeData.type === 'memory' && (
                  <MemoryGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'typing' && (
                  <TypingGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'pattern' && (
                  <PatternGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}

                {showResult && currentChallengeData.type === 'quiz' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <p className={`font-medium ${selectedAnswer === currentChallengeData.correct ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAnswer === currentChallengeData.correct ? '✅ Correct!' : '❌ Incorrect'}
                    </p>
                    <p className="text-sm text-muted-foreground">{currentChallengeData.hint}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {allUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">All Projects Unlocked!</h2>
              <p className="text-green-700">You've completed all challenges. Explore my work below!</p>
              <Button variant="outline" onClick={resetGame} className="mt-4">
                Play Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Projects Sections */}
        <div className="space-y-12">
          {/* Main Projects */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Main Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {mainProjects.map((project, index) => {
                  const isUnlocked = unlockedProjects.includes(index);
                  
                  return (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isUnlocked ? 1 : 0.3,
                        y: 0,
                        filter: isUnlocked ? 'none' : 'blur(4px)'
                      }}
                      transition={{ delay: index * 0.1 }}
                      className={getProjectCardHeight(project)}
                    >
                      <Card className={`h-full ${!isUnlocked ? 'relative' : ''}`}>
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Locked</p>
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {isUnlocked ? <Unlock className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4" />}
                              {project.name}
                            </CardTitle>
                            <Badge variant={project.status === 'Live' ? 'default' : 'secondary'} className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 pt-0 flex-1">
                          <p className="text-sm line-clamp-2">{project.summary.substring(0, 100)}...</p>
                          
                          {isUnlocked && project.technologies && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {isUnlocked && (
                            <div className="flex gap-2 pt-1 mt-auto">
                              <Button size="sm" asChild className="text-xs">
                                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Demo
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild className="text-xs">
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-3 h-3 mr-1" />
                                  Code
                                </a>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* School Projects */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              School Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {schoolProjects.map((project, index) => {
                  const globalIndex = mainProjects.length + index;
                  const isUnlocked = unlockedProjects.includes(globalIndex);
                  
                  return (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isUnlocked ? 1 : 0.3,
                        y: 0,
                        filter: isUnlocked ? 'none' : 'blur(4px)'
                      }}
                      transition={{ delay: index * 0.1 }}
                      className={getProjectCardHeight(project)}
                    >
                      <Card className={`h-full ${!isUnlocked ? 'relative' : ''}`}>
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Locked</p>
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {isUnlocked ? <Unlock className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4" />}
                              {project.name}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              School
                            </Badge>
                          </div>
                          <CardDescription className="text-sm line-clamp-2">
                            {project.description || project.summary.substring(0, 80) + "..."}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 pt-0 flex-1">
                          <p className="text-sm line-clamp-2">{project.summary.substring(0, 100)}...</p>
                          
                          {isUnlocked && project.technologies && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {isUnlocked && (
                            <div className="flex gap-2 pt-1 mt-auto">
                              <Button size="sm" asChild className="text-xs">
                                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Demo
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild className="text-xs">
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-3 h-3 mr-1" />
                                  Code
                                </a>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}