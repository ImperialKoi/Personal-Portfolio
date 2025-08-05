import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MathRushGameProps {
  challenge: {
    equations: Array<{
      question: string;
      answer: string;
      options: string[];
    }>;
    timeLimit: number;
  };
  onComplete: (success: boolean) => void;
}

export const MathRushGame = ({ challenge, onComplete }: MathRushGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete(score >= challenge.equations.length / 2); // Pass if got half right
    }
  }, [timeLeft, score, challenge.equations.length, onComplete]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === challenge.equations[currentQuestion].answer;
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion < challenge.equations.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        onComplete(score + (isCorrect ? 1 : 0) >= challenge.equations.length / 2);
      }
    }, 1000);
  };

  const question = challenge.equations[currentQuestion];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Time: {timeLeft}s</Badge>
        <Badge variant="outline">Score: {score}/{challenge.equations.length}</Badge>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-medium mb-4">{question.question}</h3>
        <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? (option === question.answer ? "default" : "destructive") : "outline"}
              onClick={() => !selectedAnswer && handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};