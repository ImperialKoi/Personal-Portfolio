import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MemoryGridGameProps {
  challenge: {
    gridSize: number;
    showTime: number;
  };
  onComplete: (success: boolean) => void;
}

export const MemoryGridGame = ({ challenge, onComplete }: MemoryGridGameProps) => {
  const [gamePhase, setGamePhase] = useState<'showing' | 'input'>('showing');
  const [activePositions, setActivePositions] = useState<number[]>([]);
  const [userGuesses, setUserGuesses] = useState<number[]>([]);

  useEffect(() => {
    // Generate random positions
    const positions: number[] = [];
    while (positions.length < Math.floor(challenge.gridSize * challenge.gridSize / 3)) {
      const pos = Math.floor(Math.random() * challenge.gridSize * challenge.gridSize);
      if (!positions.includes(pos)) positions.push(pos);
    }
    setActivePositions(positions);

    const timer = setTimeout(() => {
      setGamePhase('input');
    }, challenge.showTime);
    return () => clearTimeout(timer);
  }, [challenge.gridSize, challenge.showTime]);

  const handleCellClick = (position: number) => {
    if (gamePhase !== 'input') return;
    
    const newGuesses = userGuesses.includes(position) 
      ? userGuesses.filter(p => p !== position)
      : [...userGuesses, position];
    
    setUserGuesses(newGuesses);
    
    if (newGuesses.length === activePositions.length) {
      const isCorrect = activePositions.every(pos => newGuesses.includes(pos));
      setTimeout(() => onComplete(isCorrect), 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {gamePhase === 'showing' ? 'Remember the highlighted positions...' : 'Click the positions you remember'}
        </p>
        
        <div className={`grid gap-2 mx-auto`} style={{ gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)`, maxWidth: '240px' }}>
          {Array.from({ length: challenge.gridSize * challenge.gridSize }, (_, index) => (
            <motion.button
              key={index}
              className={`w-12 h-12 rounded border-2 ${
                gamePhase === 'showing' && activePositions.includes(index) 
                  ? 'bg-primary border-primary' 
                  : userGuesses.includes(index)
                  ? 'bg-secondary border-secondary'
                  : 'bg-background border-muted hover:border-primary'
              }`}
              onClick={() => handleCellClick(index)}
              whileHover={{ scale: gamePhase === 'input' ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {gamePhase === 'showing' && activePositions.includes(index) && '✨'}
              {gamePhase === 'input' && userGuesses.includes(index) && '📍'}
            </motion.button>
          ))}
        </div>
        
        {gamePhase === 'input' && (
          <p className="text-xs text-muted-foreground mt-2">
            Selected: {userGuesses.length}/{activePositions.length}
          </p>
        )}
      </div>
    </div>
  );
};