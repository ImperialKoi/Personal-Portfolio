import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Gift, Eye } from 'lucide-react';

interface HiddenElementProps {
  id: string;
  onFound: (id: string) => void;
  hint?: string;
  className?: string;
  children?: React.ReactNode;
  triggerType?: 'click' | 'hover' | 'sequence';
  sequence?: string[];
}

export const HiddenElement = ({ 
  id, 
  onFound, 
  hint, 
  className = '', 
  children,
  triggerType = 'click',
  sequence = []
}: HiddenElementProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const handleInteraction = () => {
    if (isFound) return;

    if (triggerType === 'click') {
      handleFound();
    }
  };

  const handleSequence = (key: string) => {
    if (isFound) return;

    const newProgress = [...sequenceProgress, key];
    setSequenceProgress(newProgress);

    // Check if sequence matches
    const isSequenceComplete = sequence.every((key, index) => 
      newProgress[index] === key
    );

    if (isSequenceComplete && newProgress.length === sequence.length) {
      handleFound();
    } else if (newProgress.length >= sequence.length) {
      setSequenceProgress([]);
    }
  };

  const handleFound = () => {
    setIsFound(true);
    setIsVisible(true);
    onFound(id);
  };

  const handleMouseEnter = () => {
    if (triggerType === 'hover' && !isFound) {
      setShowHint(true);
    }
  };

  const handleMouseLeave = () => {
    setShowHint(false);
  };

  return (
    <div 
      className={`relative ${className}`}
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Hidden clickable area */}
      {!isFound && (
        <div 
          className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-10 hover:bg-primary transition-opacity duration-300"
          title={hint}
        />
      )}

      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && hint && !isFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap"
          >
            <Search className="inline w-3 h-3 mr-1" />
            {hint}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Found indicator */}
      <AnimatePresence>
        {isFound && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 z-50"
          >
            <Gift className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse effect when not found */}
      {!isFound && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/20 rounded animate-pulse opacity-30" />
        </div>
      )}
    </div>
  );
};