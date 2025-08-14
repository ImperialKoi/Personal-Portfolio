import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Github, Lock, Unlock, Trophy, Code, Terminal, Zap, Shuffle, Target, Gamepad2, Timer, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScavengerHunt } from '@/hooks/useScavengerHunt';
import { HiddenElement } from '@/components/HiddenElement';
import { ScavengerHuntProgress } from '@/components/ScavengerHuntProgress';
import { toast } from '@/hooks/use-toast';

// Import game components
import { 
  TargetClickGame, 
  ReactionGame, 
  WhackAMoleGame, 
  DragDropGame,
  SequenceGame,
  MemoryGridGame,
  ColorMatchGame,
  TypingRaceGame,
  PatternTapGame,
  SimonSaysGame,
  MathRushGame,
  PixelPerfectGame
} from '@/components/games';

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

// Enhanced challenge types with fun interactive minigames
const baseChallenges = [
  {
    id: 1,
    type: 'target-click',
    title: "Bug Hunt",
    description: "Click all the bugs scattered across the page!",
    targetCount: 12,
    timeLimit: 15,
    hint: "They're hiding everywhere!",
    icon: Target
  },
  {
    id: 2,
    type: 'reaction',
    title: "Code Compile",
    description: "Click when the status turns green!",
    hint: "Wait for the right moment...",
    icon: Zap
  },
  {
    id: 3,
    type: 'sequence',
    title: "API Call Chain",
    description: "Click the buttons in the correct API sequence",
    sequence: ["GET", "POST", "PUT", "DELETE"],
    hint: "CRUD operations order",
    icon: Code
  },
  {
    id: 4,
    type: 'memory-grid',
    title: "Component Layout",
    description: "Remember the component positions!",
    gridSize: 4,
    showTime: 2500,
    hint: "Focus on the pattern",
    icon: Target
  },
  {
    id: 5,
    type: 'typing-race',
    title: "Speed Coding",
    description: "Type the function as fast as possible!",
    code: "const fetchData = async () => await api.get('/users')",
    timeLimit: 15,
    hint: "Modern async/await pattern",
    icon: Timer
  },
  {
    id: 6,
    type: 'color-match',
    title: "CSS Color Game",
    description: "Match the color with its hex code!",
    colors: [
      { hex: "#3b82f6", name: "blue-500" },
      { hex: "#00a6f4", name: "sky-500" },
      { hex: "#155dfc", name: "blue-600" },
      { hex: "#0084d1", name: "sky-600" }
    ],
    hint: "Common Tailwind colors",
    icon: Shuffle
  },
  {
    id: 7,
    type: 'target-click',
    title: "Memory Leak Hunt",
    description: "Find and click all memory leaks across the screen!",
    targetCount: 8,
    timeLimit: 10,
    hint: "They're hiding in the code",
    icon: Target
  },
  {
    id: 8,
    type: 'pattern-tap',
    title: "Algorithm Pattern",
    description: "Tap the pattern to complete the sorting algorithm",
    pattern: [1, 3, 2, 4, 5],
    hint: "Bubble sort visualization",
    icon: Shuffle
  },
  {
    id: 9,
    type: 'whack-a-mole',
    title: "Exception Whacker",
    description: "Whack the exceptions as they pop up!",
    targetCount: 10,
    timeLimit: 12,
    hint: "Quick reflexes needed!",
    icon: Target
  },
  {
    id: 10,
    type: 'sequence',
    title: "Git Workflow",
    description: "Click commands in proper Git workflow order",
    sequence: ["git add", "git commit", "git push", "git merge"],
    hint: "Standard development flow",
    icon: Code
  },
  {
    id: 11,
    type: 'simon-says',
    title: "Debug Commands",
    description: "Repeat the debugging sequence!",
    sequence: ["console.log", "debugger", "breakpoint", "inspect"],
    hint: "Follow the exact order",
    icon: Target
  },
  {
    id: 12,
    type: 'typing-race',
    title: "React Component",
    description: "Type this JSX component quickly!",
    code: "<Button onClick={handleClick} className='btn-primary'>Submit</Button>",
    timeLimit: 12,
    hint: "Basic React JSX syntax",
    icon: Timer
  },
  {
    id: 13,
    type: 'drag-drop',
    title: "Code Organizer",
    description: "Drag code blocks to their correct positions!",
    items: ["import", "useState", "useEffect", "return"],
    correctOrder: [0, 1, 2, 3],
    hint: "Standard React component structure",
    icon: Code
  },
  {
    id: 14,
    type: 'math-rush',
    title: "Algorithm Complexity",
    description: "Solve time complexity equations quickly!",
    equations: [
      { question: "O(2^n) vs O(n!)", answer: "O(n!) is worse", options: ["O(2^n) is worse", "O(n!) is worse", "Equal", "Depends"] },
      { question: "O(log n) + O(n)", answer: "O(n)", options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"] }
    ],
    timeLimit: 20,
    hint: "Choose the dominant term",
    icon: Zap
  },
  {
    id: 15,
    type: 'pixel-perfect',
    title: "Difference Hunter",
    description: "Find the square that doesn't match!",
    tolerance: 15,
    targetCount: 5,
    timeLimit: 15,
    hint: "Compare each square carefully",
    icon: Target
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


// Main component
export default function Projects() {
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [unlockedProjects, setUnlockedProjects] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [allUnlocked, setAllUnlocked] = useState(false);
  
  // Scavenger hunt
  const scavengerHunt = useScavengerHunt();

  const currentChallengeData = challenges[currentChallenge];
  const progress = challenges.length > 0 ? ((currentChallenge + 1) / challenges.length) * 100 : 0;

  // Main completion handler — unlocks exactly one locked project on success
  const handleChallengeComplete = useCallback((isCorrect: boolean) => {
    // show immediate feedback
    setShowResult(true);

    if (isCorrect) {
      // Unlock one random locked project using functional update (prevents race conditions)
      setUnlockedProjects(prev => {
        const allIndices = allProjects.map((_, i) => i);
        const locked = allIndices.filter(i => !prev.includes(i));
        if (locked.length === 0) return prev; // nothing to do
        const choice = locked[Math.floor(Math.random() * locked.length)];
        const next = [...prev, choice];

        // If we've just unlocked the last one, mark allUnlocked
        if (next.length === allProjects.length) {
          setAllUnlocked(true);
        }
        return next;
      });
    }

    // After a brief display of the result, advance to the next challenge (wraps around)
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      setCurrentChallenge(prev => {
        // wrap to keep cycling through the challenge pool until allUnlocked becomes true
        const poolSize = Math.max(challenges.length, 1);
        return (prev + 1) % poolSize;
      });
    }, 2000);
  }, [challenges.length, allProjects.length, allProjects]);

  // Quiz answer handler — use handleChallengeComplete with the right boolean
  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = !!(currentChallengeData && answerIndex === currentChallengeData.correct);
    handleChallengeComplete(isCorrect);
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
          <h1 className="text-3xl font-bold mb-1">🎮 Project Vault</h1>
          <div className="text-[10px] text-muted-foreground tracking-widest mb-8">ROT13: pnfrne</div>
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
                
                {currentChallengeData.type === 'target-click' && (
                  <TargetClickGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'reaction' && (
                  <ReactionGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'sequence' && (
                  <SequenceGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'memory-grid' && (
                  <MemoryGridGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'typing-race' && (
                  <TypingRaceGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'color-match' && (
                  <ColorMatchGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'pattern-tap' && (
                  <PatternTapGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'whack-a-mole' && (
                  <WhackAMoleGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'simon-says' && (
                  <SimonSaysGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'drag-drop' && (
                  <DragDropGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'math-rush' && (
                  <MathRushGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
                )}
                
                {currentChallengeData.type === 'pixel-perfect' && (
                  <PixelPerfectGame challenge={currentChallengeData} onComplete={handleChallengeComplete} />
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
                        scale: isUnlocked ? [0.9, 1.05, 1] : 1,
                        filter: isUnlocked ? 'none' : 'blur(4px)'
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        scale: { duration: 0.6 }
                      }}
                      className={getProjectCardHeight(project)}
                    >
                      <Card className={`h-full ${!isUnlocked ? 'relative' : ''}`}>
                        {!isUnlocked && (
                          <motion.div 
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Locked</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {isUnlocked && (
                          <motion.div
                            className="absolute top-2 right-2 z-20"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="bg-green-500 rounded-full p-1"
                            >
                              <Unlock className="w-4 h-4 text-white" />
                            </motion.div>
                          </motion.div>
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
                        scale: isUnlocked ? [0.9, 1.05, 1] : 1,
                        filter: isUnlocked ? 'none' : 'blur(4px)'
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        scale: { duration: 0.6 }
                      }}
                      className={getProjectCardHeight(project)}
                    >
                      <Card className={`h-full ${!isUnlocked ? 'relative' : ''}`}>
                        {!isUnlocked && (
                          <motion.div 
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="text-center">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              </motion.div>
                              <p className="text-sm text-muted-foreground">Locked</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {isUnlocked && (
                          <motion.div
                            className="absolute top-2 right-2 z-20"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="bg-green-500 rounded-full p-1"
                            >
                              <Unlock className="w-4 h-4 text-white" />
                            </motion.div>
                          </motion.div>
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