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

// Enhanced challenge types with fun interactive minigames
const baseChallenges = [
  {
    id: 1,
    type: 'target-click',
    title: "Bug Hunt",
    description: "Click all the bugs before time runs out!",
    targetCount: 8,
    timeLimit: 10,
    hint: "Quick reflexes needed!",
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
    showTime: 2000,
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
      { hex: "#3B82F6", name: "blue-500" },
      { hex: "#EF4444", name: "red-500" },
      { hex: "#10B981", name: "green-500" },
      { hex: "#F59E0B", name: "amber-500" }
    ],
    hint: "Common Tailwind colors",
    icon: Shuffle
  },
  {
    id: 7,
    type: 'target-click',
    title: "Memory Leak Hunt",
    description: "Find and click all memory leaks!",
    targetCount: 6,
    timeLimit: 8,
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
    type: 'reaction',
    title: "Build Complete",
    description: "Click when the build status shows success!",
    hint: "Watch for the green light",
    icon: Zap
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
    type: 'memory-grid',
    title: "Database Schema",
    description: "Remember the table relationships!",
    gridSize: 3,
    showTime: 3000,
    hint: "Foreign key connections",
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

// Target clicking game - click moving targets
const TargetClickGame = ({ challenge, onComplete }) => {
  const [targets, setTargets] = useState([]);
  const [clickedTargets, setClickedTargets] = useState([]);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onComplete(clickedTargets.length >= challenge.targetCount);
    }
  }, [timeLeft, gameStarted, clickedTargets.length, challenge.targetCount, onComplete]);

  useEffect(() => {
    if (clickedTargets.length >= challenge.targetCount) {
      onComplete(true);
    }
  }, [clickedTargets.length, challenge.targetCount, onComplete]);

  const startGame = () => {
    setGameStarted(true);
    generateTargets();
  };

  const generateTargets = () => {
    const newTargets = Array.from({ length: challenge.targetCount }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 5, // 5-85% to keep within bounds
      y: Math.random() * 70 + 10, // 10-80% to keep within bounds
      clicked: false
    }));
    setTargets(newTargets);
  };

  const handleTargetClick = (targetId) => {
    if (!clickedTargets.includes(targetId)) {
      setClickedTargets([...clickedTargets, targetId]);
      setTargets(targets.map(target => 
        target.id === targetId ? { ...target, clicked: true } : target
      ));
    }
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg">Get ready to hunt some bugs! 🐛</p>
        <p className="text-sm text-muted-foreground">
          Click {challenge.targetCount} targets in {challenge.timeLimit} seconds
        </p>
        <Button onClick={startGame} size="lg">Start Bug Hunt</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge variant="outline">Bugs: {clickedTargets.length}/{challenge.targetCount}</Badge>
      </div>
      
      <div className="relative bg-primary/5 rounded-lg border h-64 overflow-hidden">
        {targets.map((target) => (
          <motion.button
            key={target.id}
            className={`absolute w-8 h-8 rounded-full border-2 text-lg ${
              target.clicked 
                ? 'bg-green-500 border-green-600 text-white' 
                : 'bg-red-500 border-red-600 text-white hover:scale-110'
            } transition-transform`}
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            onClick={() => handleTargetClick(target.id)}
            disabled={target.clicked}
            animate={{
              scale: target.clicked ? 0.8 : [1, 1.1, 1],
              rotate: target.clicked ? 360 : 0,
            }}
            transition={{
              scale: { repeat: target.clicked ? 0 : Infinity, duration: 1 },
              rotate: { duration: 0.5 }
            }}
          >
            {target.clicked ? '✓' : '🐛'}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Reaction time game - click when color changes
const ReactionGame = ({ challenge, onComplete }) => {
  const [gamePhase, setGamePhase] = useState('initial'); // initial, waiting, go, finished, failed
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  useEffect(() => {
    if (gamePhase === 'waiting') {
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      const timer = setTimeout(() => {
        setGamePhase('go');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  const handleClick = () => {
    if (gamePhase === 'go') {
      const reaction = Date.now() - startTime;
      setReactionTime(reaction);
      setGamePhase('finished');
      setTimeout(() => {
        onComplete(reaction < 1000); // Success if under 1 second
      }, 1500);
    } else if (gamePhase === 'waiting') {
      setGamePhase('failed');
      setTimeout(() => onComplete(false), 1500);
    }
  };

  const startGame = () => {
    setGamePhase('waiting');
    setReactionTime(null);
  };

  if (gamePhase === 'initial') {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg">Test your reaction time! ⚡</p>
        <p className="text-sm text-muted-foreground">
          Click when the status turns GREEN. Don't click too early!
        </p>
        <Button onClick={startGame} size="lg">Start Reaction Test</Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <motion.div
        className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-lg font-bold cursor-pointer ${
          gamePhase === 'waiting' ? 'bg-red-500' :
          gamePhase === 'go' ? 'bg-green-500' :
          gamePhase === 'finished' ? 'bg-blue-500' :
          'bg-red-600'
        }`}
        onClick={handleClick}
        animate={{
          scale: gamePhase === 'go' ? [1, 1.1, 1] : 1,
        }}
        transition={{
          scale: { repeat: Infinity, duration: 0.5 }
        }}
      >
        {gamePhase === 'waiting' && 'WAIT...'}
        {gamePhase === 'go' && 'CLICK!'}
        {gamePhase === 'finished' && `${reactionTime}ms`}
        {gamePhase === 'failed' && 'TOO EARLY!'}
      </motion.div>
      
      <div className="space-y-2">
        {gamePhase === 'waiting' && <p className="text-muted-foreground">Wait for green...</p>}
        {gamePhase === 'go' && <p className="text-green-600 font-bold">CLICK NOW!</p>}
        {gamePhase === 'finished' && (
          <p className={`font-medium ${reactionTime < 500 ? 'text-green-600' : reactionTime < 1000 ? 'text-yellow-600' : 'text-red-600'}`}>
            {reactionTime < 500 ? 'Lightning fast! ⚡' : reactionTime < 1000 ? 'Good reflexes! 👍' : 'Too slow... 😅'}
          </p>
        )}
        {gamePhase === 'failed' && <p className="text-red-600">Patience is key! Try again.</p>}
      </div>
    </div>
  );
};

// Sequence memory game - click in order
const SequenceGame = ({ challenge, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [gamePhase, setGamePhase] = useState('showing'); // showing, input, complete
  const [userSequence, setUserSequence] = useState([]);

  useEffect(() => {
    if (gamePhase === 'showing') {
      const timer = setTimeout(() => {
        setGamePhase('input');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  const handleButtonClick = (item) => {
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
          {gamePhase === 'showing' ? 'Memorize this sequence...' : 'Click in the correct order'}
        </p>
        
        {gamePhase === 'showing' && (
          <div className="flex flex-wrap gap-2 justify-center mb-4 p-4 bg-primary/5 rounded-lg">
            {challenge.sequence.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Badge variant="secondary" className="text-sm">
                  {item}
                </Badge>
              </motion.div>
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
                  onClick={() => handleButtonClick(item)}
                  disabled={userSequence.includes(item)}
                  className="h-12"
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

// Memory grid game - remember positions
const MemoryGridGame = ({ challenge, onComplete }) => {
  const [gamePhase, setGamePhase] = useState('showing');
  const [activePositions, setActivePositions] = useState([]);
  const [userGuesses, setUserGuesses] = useState([]);

  useEffect(() => {
    // Generate random positions
    const positions = [];
    while (positions.length < Math.floor(challenge.gridSize * challenge.gridSize / 3)) {
      const pos = Math.floor(Math.random() * challenge.gridSize * challenge.gridSize);
      if (!positions.includes(pos)) positions.push(pos);
    }
    setActivePositions(positions);

    const timer = setTimeout(() => {
      setGamePhase('input');
    }, challenge.showTime);
    return () => clearTimeout(timer);
  }, [challenge.gridSize, challenge.showTime]);

  const handleCellClick = (position) => {
    if (gamePhase !== 'input') return;
    
    const newGuesses = userGuesses.includes(position) 
      ? userGuesses.filter(p => p !== position)
      : [...userGuesses, position];
    
    setUserGuesses(newGuesses);
    
    if (newGuesses.length === activePositions.length) {
      const isCorrect = activePositions.every(pos => newGuesses.includes(pos));
      setTimeout(() => onComplete(isCorrect), 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {gamePhase === 'showing' ? 'Remember the highlighted positions...' : 'Click the positions you remember'}
        </p>
        
        <div className={`grid gap-2 mx-auto`} style={{ gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)`, maxWidth: '240px' }}>
          {Array.from({ length: challenge.gridSize * challenge.gridSize }, (_, index) => (
            <motion.button
              key={index}
              className={`w-12 h-12 rounded border-2 ${
                gamePhase === 'showing' && activePositions.includes(index) 
                  ? 'bg-primary border-primary' 
                  : userGuesses.includes(index)
                  ? 'bg-secondary border-secondary'
                  : 'bg-background border-muted hover:border-primary'
              }`}
              onClick={() => handleCellClick(index)}
              whileHover={{ scale: gamePhase === 'input' ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {gamePhase === 'showing' && activePositions.includes(index) && '✨'}
              {gamePhase === 'input' && userGuesses.includes(index) && '📍'}
            </motion.button>
          ))}
        </div>
        
        {gamePhase === 'input' && (
          <p className="text-xs text-muted-foreground mt-2">
            Selected: {userGuesses.length}/{activePositions.length}
          </p>
        )}
      </div>
    </div>
  );
};

// Color matching game
const ColorMatchGame = ({ challenge, onComplete }) => {
  const [currentColor, setCurrentColor] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const randomColor = challenge.colors[Math.floor(Math.random() * challenge.colors.length)];
    setCurrentColor(randomColor);
  }, [challenge.colors]);

  const handleAnswerSelect = (color) => {
    setSelectedAnswer(color);
    setTimeout(() => {
      onComplete(color.hex === currentColor.hex);
    }, 1000);
  };

  if (!currentColor) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg mb-4">What's this color?</p>
        <div 
          className="w-24 h-24 mx-auto rounded-lg border-4 border-white shadow-lg"
          style={{ backgroundColor: currentColor.hex }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {challenge.colors.map((color, index) => (
          <Button
            key={index}
            variant={selectedAnswer === color ? (color.hex === currentColor.hex ? "default" : "destructive") : "outline"}
            onClick={() => !selectedAnswer && handleAnswerSelect(color)}
            disabled={selectedAnswer !== null}
            className="h-12"
          >
            {color.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Typing race game - enhanced version
const TypingRaceGame = ({ challenge, onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [isActive, setIsActive] = useState(true);
  const [wpm, setWpm] = useState(0);

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
    
    // Calculate WPM
    const wordsTyped = userInput.length / 5; // Standard: 5 characters = 1 word
    const timeElapsed = (challenge.timeLimit - timeLeft) / 60; // Convert to minutes
    if (timeElapsed > 0) {
      setWpm(Math.round(wordsTyped / timeElapsed));
    }
  }, [userInput, challenge.code, challenge.timeLimit, timeLeft, onComplete]);

  const accuracy = userInput.length > 0 ? 
    (userInput.split('').filter((char, i) => char === challenge.code[i]).length / userInput.length * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge variant="outline">WPM: {wpm}</Badge>
        <Badge variant="outline">Accuracy: {Math.round(accuracy)}%</Badge>
      </div>
      
      <div className="bg-muted p-4 rounded-lg font-mono text-sm">
        <div className="mb-2 text-muted-foreground">Type this code:</div>
        <div className="bg-background p-2 rounded border">
          {challenge.code.split('').map((char, index) => (
            <span
              key={index}
              className={`${
                index < userInput.length
                  ? userInput[index] === char
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                  : index === userInput.length
                  ? 'bg-blue-200 animate-pulse'
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
      
      <Progress value={(userInput.length / challenge.code.length) * 100} className="w-full" />
    </div>
  );
};

// Pattern tap game
const PatternTapGame = ({ challenge, onComplete }) => {
  const [userPattern, setUserPattern] = useState([]);
  const [gamePhase, setGamePhase] = useState('showing');

  useEffect(() => {
    const timer = setTimeout(() => {
      setGamePhase('input');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (number) => {
    if (gamePhase !== 'input') return;
    
    const newPattern = [...userPattern, number];
    setUserPattern(newPattern);
    
    if (newPattern.length === challenge.pattern.length) {
      const sortedPattern = [...challenge.pattern].sort((a, b) => a - b);
      const isCorrect = newPattern.every((num, index) => num === sortedPattern[index]);
      onComplete(isCorrect);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {gamePhase === 'showing' ? 'Remember this pattern...' : 'Tap numbers in ascending order'}
        </p>
        
        {gamePhase === 'showing' && (
          <div className="flex flex-wrap gap-2 justify-center mb-4 p-4 bg-primary/5 rounded-lg">
            {challenge.pattern.map((num, index) => (
              <motion.div
                key={index}
                className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        )}
        
        {gamePhase === 'input' && (
          <>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <p className="text-sm w-full mb-2">Your order:</p>
              {userPattern.map((num, index) => (
                <Badge key={index} variant="default" className="text-sm">
                  {num}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-3 max-w-48 mx-auto">
              {challenge.pattern.map((num, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleNumberClick(num)}
                  disabled={userPattern.includes(num)}
                  className="h-12 w-12 text-lg font-bold"
                >
                  {num}
                </Button>
              ))}
            </div>
          </>
        )}
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