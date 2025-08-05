import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SequenceGameProps {
  challenge: {
    sequence: string[];
  };
  onComplete: (success: boolean) => void;
}

export const SequenceGame = ({ challenge, onComplete }: SequenceGameProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [gamePhase, setGamePhase] = useState<'showing' | 'input' | 'complete'>('showing');
  const [userSequence, setUserSequence] = useState<string[]>([]);

  useEffect(() => {
    if (gamePhase === 'showing') {
      const timer = setTimeout(() => {
        setGamePhase('input');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  const handleButtonClick = (item: string) => {
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