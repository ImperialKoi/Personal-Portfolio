import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PixelPerfectGameProps {
  challenge: {
    tolerance: number;
    targetCount: number;
    timeLimit: number;
  };
  onComplete: (success: boolean) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  clicked: boolean;
}

export const PixelPerfectGame = ({ challenge, onComplete }: PixelPerfectGameProps) => {
  const [targets, setTargets] = useState<Target[]>([]);
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
      x: Math.random() * 60 + 20, // Center area
      y: Math.random() * 40 + 30,
      clicked: false
    }));
    setTargets(newTargets);
  };

  const handleTargetClick = (e: React.MouseEvent, targetId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
    
    if (distance <= challenge.tolerance && !clickedTargets.includes(targetId)) {
      setClickedTargets([...clickedTargets, targetId]);
      setTargets(targets.map(target => 
        target.id === targetId ? { ...target, clicked: true } : target
      ));
    }
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg">Pixel Perfect Challenge! 🎯</p>
        <p className="text-sm text-muted-foreground">
          Click exactly in the center of {challenge.targetCount} targets
        </p>
        <Button onClick={startGame} size="lg">Start Precision Test</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge variant="outline">Hits: {clickedTargets.length}/{challenge.targetCount}</Badge>
      </div>
      
      <div className="relative bg-primary/5 rounded-lg border h-64 overflow-hidden">
        {targets.map((target) => (
          <div
            key={target.id}
            className={`absolute w-16 h-16 rounded-full border-4 cursor-crosshair ${
              target.clicked 
                ? 'bg-green-500 border-green-600' 
                : 'bg-blue-500 border-blue-600 hover:scale-105'
            } transition-transform flex items-center justify-center`}
            style={{ 
              left: `${target.x}%`, 
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => !target.clicked && handleTargetClick(e, target.id)}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
            {target.clicked && <span className="absolute text-white text-xs">✓</span>}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        Click within {challenge.tolerance}px of the center dot
      </p>
    </div>
  );
};