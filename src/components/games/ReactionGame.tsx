import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ReactionGameProps {
  challenge: any;
  onComplete: (success: boolean) => void;
}

export const ReactionGame = ({ challenge, onComplete }: ReactionGameProps) => {
  const [gamePhase, setGamePhase] = useState<'initial' | 'waiting' | 'go' | 'finished' | 'failed'>('initial');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  useEffect(() => {
    if (gamePhase === 'waiting') {
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      const timer = setTimeout(() => {
        setGamePhase('go');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  const handleClick = () => {
    if (gamePhase === 'go') {
      const reaction = Date.now() - (startTime || 0);
      setReactionTime(reaction);
      setGamePhase('finished');
      setTimeout(() => {
        onComplete(reaction < 1000); // Success if under 1 second
      }, 1500);
    } else if (gamePhase === 'waiting') {
      setGamePhase('failed');
      setTimeout(() => onComplete(false), 1500);
    }
  };

  const startGame = () => {
    setGamePhase('waiting');
    setReactionTime(null);
  };

  if (gamePhase === 'initial') {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg">Test your reaction time! ⚡</p>
        <p className="text-sm text-muted-foreground">
          Click when the status turns GREEN. Don't click too early!
        </p>
        <Button onClick={startGame} size="lg">Start Reaction Test</Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <motion.div
        className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-lg font-bold cursor-pointer ${
          gamePhase === 'waiting' ? 'bg-red-500' :
          gamePhase === 'go' ? 'bg-green-500' :
          gamePhase === 'finished' ? 'bg-blue-500' :
          'bg-red-600'
        }`}
        onClick={handleClick}
        animate={{
          scale: gamePhase === 'go' ? [1, 1.1, 1] : 1,
        }}
        transition={{
          scale: { repeat: Infinity, duration: 0.5 }
        }}
      >
        {gamePhase === 'waiting' && 'WAIT...'}
        {gamePhase === 'go' && 'CLICK!'}
        {gamePhase === 'finished' && `${reactionTime}ms`}
        {gamePhase === 'failed' && 'TOO EARLY!'}
      </motion.div>
      
      <div className="space-y-2">
        {gamePhase === 'waiting' && <p className="text-muted-foreground">Wait for green...</p>}
        {gamePhase === 'go' && <p className="text-green-600 font-bold">CLICK NOW!</p>}
        {gamePhase === 'finished' && (
          <p className={`font-medium ${(reactionTime || 0) < 500 ? 'text-green-600' : (reactionTime || 0) < 1000 ? 'text-yellow-600' : 'text-red-600'}`}>
            {(reactionTime || 0) < 500 ? 'Lightning fast! ⚡' : (reactionTime || 0) < 1000 ? 'Good reflexes! 👍' : 'Too slow... 😅'}
          </p>
        )}
        {gamePhase === 'failed' && <p className="text-red-600">Patience is key! Try again.</p>}
      </div>
    </div>
  );
};