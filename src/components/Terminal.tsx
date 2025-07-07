
import { useState, useEffect, useRef } from 'react';
import { Minimize2, Square, X } from 'lucide-react';

interface TerminalProps {
  onToggle: () => void;
}

export const Terminal = ({ onToggle }: TerminalProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'error'; content: string }>>([
    { type: 'output', content: 'Welcome to Jane Doe\'s Portfolio Terminal!' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = {
    help: () => [
      'Available commands:',
      '',
      '  help              - Show this help message',
      '  whoami            - Display information about me',
      '  ls                - List files and directories',
      '  cat <file>        - Display file contents',
      '  open <file>       - Open file in editor',
      '  contact           - Show contact information',
      '  skills            - Display technical skills',
      '  projects          - List my projects',
      '  clear             - Clear terminal',
      '  sudo make coffee  - Easter egg 😉',
      '',
      'Navigation:',
      '  Use ↑/↓ arrow keys to navigate command history',
      '  Ctrl+Shift+P to open command palette',
    ],
    
    whoami: () => [
      'Hello! I\'m Jane Doe 👋',
      '',
      '🚀 Full-stack developer with 4+ years of experience',
      '💼 Currently building scalable web applications',
      '🎯 Passionate about clean code and great UX',
      '🌍 Located in San Francisco, CA',
      '📚 Always learning new technologies',
      '',
      'Fun fact: I debug with console.log() and I\'m not ashamed! 🐛',
    ],

    ls: () => [
      'portfolio/',
      '├── about.md',
      '├── resume.pdf',
      '├── projects/',
      '│   ├── ecommerce-app.js',
      '│   ├── weather-dashboard.tsx',
      '│   └── task-manager.py',
      '├── blog/',
      '│   ├── 2024-01-react-patterns.md',
      '│   └── 2023-12-typescript-tips.md',
      '└── contact.json',
    ],

    contact: () => [
      '📧 Email: jane.doe@email.com',
      '🐙 GitHub: github.com/janedoe',
      '💼 LinkedIn: linkedin.com/in/janedoe',
      '🌐 Portfolio: janedoe.dev',
      '📱 Phone: +1 (555) 123-4567',
      '',
      '⏰ Available Mon-Fri 9AM-5PM PST',
      '🚀 Open to new opportunities!',
    ],

    skills: () => [
      'Technical Skills:',
      '',
      '🎨 Frontend:',
      '  • React, Next.js, TypeScript',
      '  • Tailwind CSS, Styled Components',
      '  • Redux, Zustand, React Query',
      '',
      '⚙️  Backend:',
      '  • Node.js, Express, FastAPI',
      '  • Python, Django, Flask',
      '  • PostgreSQL, MongoDB, Redis',
      '',
      '☁️  DevOps & Tools:',
      '  • Docker, Kubernetes, AWS',
      '  • CI/CD, GitHub Actions',
      '  • Git, VS Code, Figma',
    ],

    projects: () => [
      'Featured Projects:',
      '',
      '🛒 E-commerce Platform (React/Node.js)',
      '   • Scalable shopping cart with 100k+ users',
      '   • Stripe payment integration',
      '   • Real-time inventory management',
      '',
      '🌤️  Weather Dashboard (TypeScript/React)',
      '   • Real-time weather data visualization',
      '   • PWA with offline capabilities',
      '   • Geolocation API integration',
      '',
      '📋 Task Manager API (Python/Django)',
      '   • RESTful API with JWT auth',
      '   • Async task processing with Celery',
      '   • WebSocket real-time updates',
      '',
      'Use "cat <filename>" to view project details!',
    ],

    clear: () => {
      setHistory([]);
      return [];
    },
  };

  const easterEggs = {
    'sudo make coffee': () => [
      '☕ Brewing coffee...',
      '▓▓▓▓▓▓▓▓▓▓ 100%',
      '',
      '☕ Coffee ready! But I\'m a developer, not a barista 😄',
      'How about we make some great software instead?',
    ],
    
    'sudo rm -rf /': () => [
      '🚨 Access denied. Nice try! 😏',
      'I\'m not falling for that one.',
    ],

    'exit': () => [
      'There\'s no escape from this portfolio! 😈',
      'But you can always hire me... 🤔',
    ],
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    if (!trimmedCmd) return;

    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Add input to history
    setHistory(prev => [...prev, { type: 'input', content: `$ ${trimmedCmd}` }]);

    // Handle commands
    if (easterEggs[trimmedCmd as keyof typeof easterEggs]) {
      const output = easterEggs[trimmedCmd as keyof typeof easterEggs]();
      setHistory(prev => [...prev, ...output.map(line => ({ type: 'output' as const, content: line }))]);
    } else if (commands[trimmedCmd as keyof typeof commands]) {
      const output = commands[trimmedCmd as keyof typeof commands]();
      if (trimmedCmd === 'clear') {
        // Clear is handled specially
        return;
      }
      setHistory(prev => [...prev, ...output.map(line => ({ type: 'output' as const, content: line }))]);
    } else if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4);
      setHistory(prev => [...prev, 
        { type: 'output', content: `Opening ${filename} in editor...` },
        { type: 'output', content: `Use the file explorer or editor tabs to view content.` }
      ]);
    } else if (trimmedCmd.startsWith('open ')) {
      const filename = trimmedCmd.substring(5);
      setHistory(prev => [...prev, 
        { type: 'output', content: `Opening ${filename}...` },
      ]);
    } else {
      setHistory(prev => [...prev, 
        { type: 'error', content: `Command not found: ${trimmedCmd}` },
        { type: 'output', content: 'Type "help" for available commands.' }
      ]);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d30] border-b border-[#2d2d30]">
        <span className="text-sm text-[#cccccc]">TERMINAL</span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggle}
            className="p-1 hover:bg-[#3e3e42] rounded"
          >
            <Minimize2 className="w-3 h-3 text-[#cccccc]" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-64 p-4 overflow-y-auto text-sm font-mono"
      >
        {history.map((line, index) => (
          <div 
            key={index} 
            className={`mb-1 ${
              line.type === 'input' 
                ? 'text-[#4fc1ff]' 
                : line.type === 'error' 
                ? 'text-[#f44747]' 
                : 'text-[#cccccc]'
            }`}
          >
            {line.content}
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center">
          <span className="text-[#4fc1ff] mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#cccccc] outline-none font-mono caret-[#4fc1ff]"
            placeholder="Type a command..."
            autoFocus
          />
          <span className="w-2 h-4 bg-[#4fc1ff] animate-pulse ml-1"></span>
        </div>
      </div>
    </div>
  );
};
