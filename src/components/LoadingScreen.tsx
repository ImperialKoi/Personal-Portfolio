
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [showSplit, setShowSplit] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const name = "DANIEL XU";
  const letters = name.split('');

  useEffect(() => {
    // Letter by letter animation
    if (currentLetterIndex < letters.length) {
      const timer = setTimeout(() => {
        setCurrentLetterIndex(prev => prev + 1);
      }, 150); // 150ms delay between letters
      
      return () => clearTimeout(timer);
    } else {
      // After all letters are shown, wait a bit then start split animation
      const splitTimer = setTimeout(() => {
        setShowSplit(true);
      }, 800);
      
      return () => clearTimeout(splitTimer);
    }
  }, [currentLetterIndex, letters.length]);

  useEffect(() => {
    if (showSplit) {
      // Complete the animation after split animation finishes
      const completeTimer = setTimeout(() => {
        setAnimationComplete(true);
        onComplete();
      }, 1000); // 1s for split animation
      
      return () => clearTimeout(completeTimer);
    }
  }, [showSplit, onComplete]);

  if (animationComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Left half */}
      <div 
        className={`absolute inset-0 bg-black transition-transform duration-1000 ease-in-out ${
          showSplit ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ width: '50%', left: 0 }}
      />
      
      {/* Right half */}
      <div 
        className={`absolute inset-0 bg-black transition-transform duration-1000 ease-in-out ${
          showSplit ? 'translate-y-full' : 'translate-y-0'
        }`}
        style={{ width: '50%', right: 0 }}
      />
      
      {/* Text container */}
      <div 
        className={`relative z-10 text-white font-mono text-6xl md:text-8xl font-bold tracking-wider transition-transform duration-1000 ease-in-out ${
          showSplit ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-300 ${
              index < currentLetterIndex 
                ? 'animate-[fadeInBounce_0.6s_ease-out_forwards]' 
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    </div>
  );
};
