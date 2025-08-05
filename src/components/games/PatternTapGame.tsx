import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface PatternTapGameProps {
  challenge: {
    pattern: number[];
  };
  onComplete: (success: boolean) => void;
}

export const PatternTapGame = ({ challenge, onComplete }: PatternTapGameProps) => {
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'showing' | 'input'>('showing');

  useEffect(() => {
    const timer = setTimeout(() => {
      setGamePhase('input');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNumberClick = (number: number) => {
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