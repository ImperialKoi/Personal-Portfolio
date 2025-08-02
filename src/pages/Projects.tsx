import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, Github, Lock, Unlock, Trophy, Code, Terminal, Zap } from 'lucide-react';
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

const challenges = [
  {
    id: 1,
    title: "Code the Algorithm",
    description: "What's the time complexity of binary search?",
    question: "Binary search has time complexity:",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    hint: "Think about how the search space is divided..."
  },
  {
    id: 2,
    title: "Debug the Logic",
    description: "Find the missing operator",
    question: "Complete: if (x ___ 0 && y > 5)",
    options: ["=", "==", "===", "!="],
    correct: 2,
    hint: "We want to check equality, not assignment"
  },
  {
    id: 3,
    title: "Terminal Command",
    description: "Git workflow knowledge",
    question: "Which command creates a new branch and switches to it?",
    options: ["git branch new-feature", "git checkout new-feature", "git checkout -b new-feature", "git switch new-feature"],
    correct: 2,
    hint: "The -b flag is key here"
  }
];

const projects = [
  CANDIT,
  BLOCKSNET, 
  CALICALENDER,
  HACKATHONIDEASGENERATOR,
  AIPOSTER,
  SKINSCOPE,
  ECOSCAN,
  RECESSHACKS
];

export default function Projects() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [unlockedProjects, setUnlockedProjects] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [allUnlocked, setAllUnlocked] = useState(false);

  const currentChallengeData = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === currentChallengeData.correct) {
      setScore(score + 1);
      // Unlock 2-3 projects per correct answer
      const projectsToUnlock = Math.min(3, projects.length - unlockedProjects.length);
      const newUnlocked = [];
      for (let i = 0; i < projectsToUnlock; i++) {
        const nextProject = unlockedProjects.length + i;
        if (nextProject < projects.length) {
          newUnlocked.push(nextProject);
        }
      }
      setUnlockedProjects([...unlockedProjects, ...newUnlocked]);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setAllUnlocked(true);
        // Unlock all remaining projects
        setUnlockedProjects(Array.from({ length: projects.length }, (_, i) => i));
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentChallenge(0);
    setUnlockedProjects([]);
    setGameStarted(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAllUnlocked(false);
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
              <Code className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold">🎮 Project Vault</h1>
            <p className="text-xl text-muted-foreground">
              My projects are locked behind coding challenges. Prove your skills to unlock them!
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Game Rules</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <span>Answer coding challenges to unlock projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Each correct answer unlocks 2-3 projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span>Wrong answers still unlock 1 project (you tried!)</span>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => setGameStarted(true)}
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🎮 Project Vault</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="outline">Score: {score}/{challenges.length}</Badge>
            <Badge variant="outline">Unlocked: {unlockedProjects.length}/{projects.length}</Badge>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>

        {!allUnlocked && (
          <motion.div 
            key={currentChallenge}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Challenge {currentChallenge + 1}: {currentChallengeData.title}
                </CardTitle>
                <CardDescription>{currentChallengeData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">{currentChallengeData.question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentChallengeData.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? (index === currentChallengeData.correct ? "default" : "destructive") : "outline"}
                      onClick={() => !showResult && handleAnswerSelect(index)}
                      disabled={showResult}
                      className="text-left justify-start h-auto py-3"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                {showResult && (
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => {
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
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {isUnlocked ? <Unlock className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4" />}
                          {project.name}
                        </CardTitle>
                        <Badge variant={project.status === 'Live' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm">{project.summary.substring(0, 150)}...</p>
                      
                      {isUnlocked && project.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
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
                        <div className="flex gap-2">
                          <Button size="sm" asChild>
                            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Demo
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
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
      </div>
    </div>
  );
}