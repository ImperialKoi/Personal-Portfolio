import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onBootComplete: (mode?: 'default' | 'simple') => void;
}

const bootMessages = [
  "Initializing Daniel Xu Portfolio System...",
  "Loading kernel modules...",
  "Starting system services...",
  "[OK] Mounted /dev/portfolio",
  "[OK] Started portfolio web server",
  "[OK] Started file system daemon", 
  "[OK] Started terminal service",
  "[OK] Started code editor service",
  "Checking file system integrity...",
  "Loading user preferences...",
  "Initializing development environment...",
  "[OK] All systems operational",
  "Welcome to Daniel Xu Portfolio IDE v2.1.0",
  "",
  "System ready. Press any key to continue..."
];

export const BootSequence = ({ onBootComplete }: BootSequenceProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let messageIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const addNextMessage = () => {
      if (messageIndex < bootMessages.length && isMounted) {
        setMessages(prev => [...prev, bootMessages[messageIndex]]);
        messageIndex++;
        
        // Vary the timing for more realistic boot feel
        const delay = messageIndex === bootMessages.length ? 1500 : Math.random() * 200 + 100;
        timeoutId = setTimeout(addNextMessage, delay);
      } else if (isMounted) {
        setIsComplete(true);
      }
    };

    // Reset state when component mounts
    setMessages([]);
    setIsComplete(false);

    // Start the boot sequence
    const initialDelay = setTimeout(addNextMessage, 500);

    // Cursor blinking
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Allow user to skip by pressing any key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isComplete) {
        if (e.key === 't' || e.key === 'T') {
          onBootComplete('default');
        } else if (e.key === 's' || e.key === 'S') {
          onBootComplete('simple');
        } else {
          onBootComplete('default');
        }
      } else if (e.key === 't' || e.key === 'T') {
        onBootComplete('default');
      } else if (e.key === 's' || e.key === 'S') {
        onBootComplete('simple');
      }
    };

    const handleClick = () => {
      if (isComplete) {
        onBootComplete('default');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      isMounted = false;
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearInterval(cursorInterval);
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [onBootComplete]);

  return (
    <div className="h-screen bg-black text-green-400 font-mono overflow-hidden">
      <div className="flex flex-col space-y-2 text-base p-8">
        {!isComplete && messages.length === 0 && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin">◐</div>
            <span className="animate-pulse">Loading system...</span>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index} 
            className="whitespace-pre-wrap opacity-0 animate-fade-in"
            style={{ 
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'forwards'
            }}
          >
            {message}
          </div>
        ))}
        
        {showCursor && !isComplete && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse"></span>
        )}
      </div>
      
      {isComplete && (
        <div className="fixed bottom-8 left-8 right-8 text-center text-green-300 animate-pulse text-lg">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin">⟳</div>
            <span>Press 'T' for Portfolio IDE or 'S' for Simple Mode...</span>
            <div className="animate-spin">⟳</div>
          </div>
        </div>
      )}
    </div>
  );
};