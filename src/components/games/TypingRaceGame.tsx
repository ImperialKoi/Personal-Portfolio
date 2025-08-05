import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TypingRaceGameProps {
  challenge: {
    code: string;
    timeLimit: number;
  };
  onComplete: (success: boolean) => void;
}

export const TypingRaceGame = ({ challenge, onComplete }: TypingRaceGameProps) => {
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