import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TargetClickGameProps {
  challenge: {
    targetCount: number;
    timeLimit: number;
  };
  onComplete: (success: boolean) => void;
}

export const TargetClickGame = ({ challenge, onComplete }: TargetClickGameProps) => {
  const [targets, setTargets] = useState<Array<{id: number; x: number; y: number; clicked: boolean}>>([]);
  const [clickedTargets, setClickedTargets] = useState<number[]>([]);
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
      x: Math.random() * 90 + 5, // 5-95% across viewport width
      y: Math.random() * 80 + 10, // 10-90% across viewport height (avoid header)
      clicked: false
    }));
    setTargets(newTargets);
  };

  const handleTargetClick = (targetId: number) => {
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
          Click {challenge.targetCount} targets scattered across the entire page in {challenge.timeLimit} seconds
        </p>
        <Button onClick={startGame} size="lg">Start Bug Hunt</Button>
      </div>
    );
  }

  return (
    <>
      {/* Game UI */}
      <div className="space-y-4 relative z-20">
        <div className="flex justify-between items-center">
          <Badge variant="outline">Time: {timeLeft}s</Badge>
          <Badge variant="outline">Bugs: {clickedTargets.length}/{challenge.targetCount}</Badge>
        </div>
        
        <div className="bg-primary/5 rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Look around the entire page! Targets are scattered everywhere.
          </p>
        </div>
      </div>
      
      {/* Full-page overlay for targets */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {targets.map((target) => (
          <motion.button
            key={target.id}
            className={`absolute w-10 h-10 rounded-full border-2 text-lg pointer-events-auto ${
              target.clicked 
                ? 'bg-green-500 border-green-600 text-white' 
                : 'bg-red-500 border-red-600 text-white hover:scale-110 shadow-lg'
            } transition-transform z-50`}
            style={{ 
              left: `${target.x}%`, 
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleTargetClick(target.id)}
            disabled={target.clicked}
            animate={{
              scale: target.clicked ? 0.8 : [1, 1.2, 1],
              rotate: target.clicked ? 360 : 0,
              y: target.clicked ? 0 : [0, -5, 0],
            }}
            transition={{
              scale: { repeat: target.clicked ? 0 : Infinity, duration: 1.5 },
              rotate: { duration: 0.5 },
              y: { repeat: target.clicked ? 0 : Infinity, duration: 2 }
            }}
          >
            {target.clicked ? '✓' : '🐛'}
          </motion.button>
        ))}
      </div>
    </>
  );
};