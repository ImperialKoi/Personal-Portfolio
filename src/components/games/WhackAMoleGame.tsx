import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface WhackAMoleGameProps {
  challenge: {
    targetCount: number;
    timeLimit: number;
  };
  onComplete: (success: boolean) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  clickable: boolean;
}

export const WhackAMoleGame = ({ challenge, onComplete }: WhackAMoleGameProps) => {
  const [clickedTargets, setClickedTargets] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTargets, setActiveTargets] = useState<Target[]>([]);

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

  useEffect(() => {
    if (gameStarted) {
      const showTarget = () => {
        const newTarget: Target = {
          id: Date.now(),
          x: Math.random() * 70 + 15, // Better positioning within container
          y: Math.random() * 50 + 25,
          clickable: true
        };
        setActiveTargets(prev => [...prev, newTarget]);
        
        // Remove target after 1.2 seconds if not clicked
        setTimeout(() => {
          setActiveTargets(prev => prev.filter(t => t.id !== newTarget.id));
          if (gameStarted && clickedTargets.length < challenge.targetCount) {
            setTimeout(showTarget, Math.random() * 800 + 300);
          }
        }, 1200);
      };
      
      const initialDelay = setTimeout(showTarget, 500);
      return () => clearTimeout(initialDelay);
    }
  }, [gameStarted, clickedTargets.length, challenge.targetCount]);

  const handleTargetClick = (targetId: number) => {
    const target = activeTargets.find(t => t.id === targetId);
    if (target && target.clickable) {
      setClickedTargets(prev => [...prev, targetId]);
      setActiveTargets(prev => prev.filter(t => t.id !== targetId));
      
      // Show next target quickly after successful hit
      if (clickedTargets.length + 1 < challenge.targetCount && gameStarted) {
        setTimeout(() => {
          const newTarget: Target = {
            id: Date.now(),
            x: Math.random() * 70 + 15,
            y: Math.random() * 50 + 25,
            clickable: true
          };
          setActiveTargets(prev => [...prev, newTarget]);
          setTimeout(() => {
            setActiveTargets(prev => prev.filter(t => t.id !== newTarget.id));
          }, 1200);
        }, Math.random() * 400 + 200);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setClickedTargets([]);
    setActiveTargets([]);
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg">Whack the exceptions! ⚡</p>
        <p className="text-sm text-muted-foreground">
          Click {challenge.targetCount} exceptions as they appear in {challenge.timeLimit} seconds
        </p>
        <Button onClick={startGame} size="lg">Start Exception Hunt</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge variant="outline">Caught: {clickedTargets.length}/{challenge.targetCount}</Badge>
      </div>
      
      <div className="relative bg-primary/5 rounded-lg border h-64 overflow-hidden">
        <AnimatePresence>
          {activeTargets.map((target) => (
            <motion.button
              key={target.id}
              className="absolute w-14 h-14 rounded-full bg-red-500 border-2 border-red-600 text-white text-xl hover:scale-125 transition-transform shadow-lg z-10"
              style={{ 
                left: `${target.x}%`, 
                top: `${target.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleTargetClick(target.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: 1,
                rotate: [0, 10, -10, 0]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                duration: 0.3,
                scale: { repeat: Infinity, duration: 0.6 }
              }}
            >
              💥
            </motion.button>
          ))}
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
          {activeTargets.length === 0 && <p className="text-sm">Watch for exceptions...</p>}
        </div>
      </div>
    </div>
  );
};