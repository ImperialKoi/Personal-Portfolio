import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onBootComplete: (mode?: 'default' | 'simple') => void;
}

const bootMessages = [
  "Initializing Jane Doe Portfolio System...",
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
  "Welcome to Jane Doe Portfolio IDE v2.1.0",
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

    const addNextMessage = () => {
      if (messageIndex < bootMessages.length) {
        setMessages(prev => [...prev, bootMessages[messageIndex]]);
        messageIndex++;
        
        // Vary the timing for more realistic boot feel
        const delay = messageIndex === bootMessages.length ? 1500 : Math.random() * 200 + 100;
        timeoutId = setTimeout(addNextMessage, delay);
      } else {
        setIsComplete(true);
        // Auto-continue after 2 seconds
        setTimeout(() => {
          onBootComplete();
        }, 2000);
      }
    };

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
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearInterval(cursorInterval);
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [onBootComplete, isComplete]);

  return (
    <div className="h-screen bg-black text-green-400 font-mono text-sm p-8 overflow-hidden">
      <div className="flex flex-col space-y-1">
        {messages.map((message, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {message}
          </div>
        ))}
        {showCursor && (
          <span className="inline-block w-2 h-5 bg-green-400 animate-pulse"></span>
        )}
      </div>
      
      {isComplete && (
        <div className="fixed bottom-8 left-8 right-8 text-center text-green-300 animate-pulse">
          Press 'T' for Portfolio IDE or 'S' for Simple Mode...
        </div>
      )}
    </div>
  );
};