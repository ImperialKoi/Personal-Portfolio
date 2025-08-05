import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ColorMatchGameProps {
  challenge: {
    colors: Array<{ hex: string; name: string }>;
  };
  onComplete: (success: boolean) => void;
}

export const ColorMatchGame = ({ challenge, onComplete }: ColorMatchGameProps) => {
  const [currentColor, setCurrentColor] = useState<{ hex: string; name: string } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<{ hex: string; name: string } | null>(null);

  useEffect(() => {
    const randomColor = challenge.colors[Math.floor(Math.random() * challenge.colors.length)];
    setCurrentColor(randomColor);
  }, [challenge.colors]);

  const handleAnswerSelect = (color: { hex: string; name: string }) => {
    setSelectedAnswer(color);
    setTimeout(() => {
      onComplete(color.hex === currentColor?.hex);
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