import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SimonSaysGameProps {
  challenge: {
    sequence: string[];
  };
  onComplete: (success: boolean) => void;
}

export const SimonSaysGame = ({ challenge, onComplete }: SimonSaysGameProps) => {
  const [gamePhase, setGamePhase] = useState<'showing' | 'input'>('showing');
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    if (gamePhase === 'showing') {
      let index = 0;
      const showSequence = () => {
        if (index < challenge.sequence.length) {
          setHighlightIndex(index);
          setTimeout(() => {
            setHighlightIndex(-1);
            index++;
            setTimeout(showSequence, 300);
          }, 600);
        } else {
          setGamePhase('input');
        }
      };
      setTimeout(showSequence, 500);
    }
  }, [gamePhase, challenge.sequence]);

  const handleButtonClick = (item: string) => {
    if (gamePhase !== 'input') return;
    
    const newInput = [...userInput, item];
    setUserInput(newInput);
    
    if (newInput.length === challenge.sequence.length) {
      const isCorrect = newInput.every((item, index) => item === challenge.sequence[index]);
      onComplete(isCorrect);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {gamePhase === 'showing' ? 'Watch the sequence...' : 'Repeat the sequence'}
        </p>
        
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {challenge.sequence.map((item, index) => (
            <Button
              key={index}
              variant={highlightIndex === index ? "default" : "outline"}
              onClick={() => handleButtonClick(item)}
              disabled={gamePhase === 'showing'}
              className={`h-16 transition-all ${
                highlightIndex === index ? 'animate-pulse scale-110' : ''
              }`}
            >
              {item}
            </Button>
          ))}
        </div>
        
        {gamePhase === 'input' && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Your sequence:</p>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {userInput.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};