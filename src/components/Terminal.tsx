import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSnakeGame } from '@/hooks/useSnakeGame';

interface TerminalProps {
  onToggle: () => void;
  activeFile?: string;
  fileContent?: string;
}

export const Terminal = ({ onToggle, activeFile, fileContent }: TerminalProps) => {
  const initialLines = [
    'Jane Doe Portfolio Terminal v1.0.0',
    'Type "help" for available commands',
    ''
  ];
  const [output, setOutput] = useState<string[]>([]);
  const [displayedOutput, setDisplayedOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSnakeMode, setIsSnakeMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
  const snakeGame = useSnakeGame();

  const runPythonCode = async (code: string) => {
    setIsRunning(true);
    setOutput(prev => [...prev, `> Running Python code...`, '']);
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-python', {
        body: { code }
      });

      if (error) {
        setOutput(prev => [...prev, `Error: ${error.message}`, '']);
      } else {
        if (data.output) {
          setOutput(prev => [...prev, data.output, '']);
        }
        if (data.error) {
          setOutput(prev => [...prev, `Error: ${data.error}`, '']);
        }
        if (!data.output && !data.error) {
          setOutput(prev => [...prev, 'Code executed successfully (no output)', '']);
        }
      }
    } catch (err) {
      setOutput(prev => [...prev, `Error: ${err.message}`, '']);
    } finally {
      setIsRunning(false);
    }
  };

  const commands = {
    help: () => [
      'Available commands:',
      '  help        - Show this help message',
      '  clear       - Clear the terminal',
      '  date        - Show current date and time',
      '  echo        - Echo text back',
      '  ls          - List portfolio contents',
      '  run         - Run the current Python file',
      '  snake       - Play Snake game',
      '  projects    - Show project overview',
      '  resume      - Download resume',
      ''
    ],
    clear: () => {
      setOutput([]);
      setDisplayedOutput([]);
      return [];
    },
    date: () => [new Date().toString()],
    echo: (args: string[]) => [args.join(' ')],
    ls: () => [
      'about.md',
      'resume.pdf',
      'projects/',
      'blog/',
      'contact.json',
      ''
    ],
    snake: () => {
      setIsSnakeMode(true);
      snakeGame.startGame();
      return snakeGame.renderGame();
    },
    projects: () => [
      '📁 PROJECT PORTFOLIO',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '🌐 E-Commerce Platform',
      '   Tech: React, Node.js, MongoDB, Stripe',
      '   Full-stack e-commerce with payment processing',
      '',
      '📊 Task Manager Pro',
      '   Tech: Python, Django, PostgreSQL, Redis',
      '   Advanced project management with real-time collaboration',
      '',
      '🌤️  Weather Dashboard',
      '   Tech: React, TypeScript, OpenWeather API',
      '   Interactive weather forecasting with data visualization',
      '',
      '🤖 AI Chat Assistant',
      '   Tech: Python, FastAPI, OpenAI GPT, WebSockets',
      '   Intelligent chatbot with context awareness',
      '',
      '📱 Mobile Fitness Tracker',
      '   Tech: React Native, Firebase, Health APIs',
      '   Cross-platform fitness tracking and goal setting',
      '',
      'Total Projects: 15+ | Years of Experience: 5+',
      'GitHub: github.com/janedoe | Portfolio: janedoe.dev',
      ''
    ],
    resume: () => {
      // Create a fake resume blob and trigger download
      const resumeContent = `
JANE DOE
Software Engineer & Full-Stack Developer
Email: jane.doe@email.com | Phone: (555) 123-4567
GitHub: github.com/janedoe | LinkedIn: linkedin.com/in/janedoe

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022-Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored team of 5 junior developers

Full-Stack Developer | StartupXYZ | 2020-2022
• Built scalable web applications using React, Node.js, and AWS
• Optimized database queries improving response time by 40%
• Collaborated with cross-functional teams on product roadmap

EDUCATION
Bachelor of Science in Computer Science | State University | 2020
• Magna Cum Laude, GPA: 3.8/4.0
• Relevant Coursework: Data Structures, Algorithms, Database Systems

SKILLS
Languages: JavaScript, Python, TypeScript, Java, SQL
Frameworks: React, Node.js, Django, Express, Next.js
Tools: Git, Docker, AWS, MongoDB, PostgreSQL, Redis
      `;
      
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jane_doe_resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return [
        '📄 Downloading resume...',
        'jane_doe_resume.txt saved to Downloads folder',
        ''
      ];
    },
    run: () => {
      if (activeFile?.endsWith('.py') && fileContent) {
        runPythonCode(fileContent);
        return [];
      } else {
        return ['Error: No Python file is currently open or file is empty'];
      }
    }
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.trim().split(' ');
    
    if (cmd === '') return;
    
    setOutput(prev => [...prev, `$ ${command}`, '']);
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    if (commands[cmd as keyof typeof commands]) {
      const result = commands[cmd as keyof typeof commands](args);
      if (result.length > 0) {
        setOutput(prev => [...prev, ...result, '']);
      }
    } else {
      setOutput(prev => [...prev, `Command not found: ${cmd}`, '']);
    }
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle snake game controls
    if (isSnakeMode) {
      e.preventDefault();
      snakeGame.handleKeyPress(e.key);
      
      if (e.key === 'Escape') {
        setIsSnakeMode(false);
        snakeGame.resetGame();
      }
      
      return;
    }

    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Initial typing animation for terminal startup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const typeNextLine = () => {
      if (currentIndex < initialLines.length) {
        setOutput(prev => [...prev, initialLines[currentIndex]]);
        currentIndex++;
        timeoutId = setTimeout(typeNextLine, 500);
      }
    };

    typeNextLine();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Animate output display
  useEffect(() => {
    if (output.length === 0) {
      setDisplayedOutput([]);
      return;
    }

    if (displayedOutput.length < output.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedOutput(output.slice(0, displayedOutput.length + 1));
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [output, displayedOutput.length]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayedOutput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update snake game display and auto-exit on game over
  useEffect(() => {
    if (isSnakeMode) {
      const gameLines = snakeGame.renderGame();
      setOutput(prev => {
        const lastCommandIndex = prev.lastIndexOf('$ snake');
        if (lastCommandIndex !== -1) {
          return [...prev.slice(0, lastCommandIndex + 1), '', ...gameLines, ''];
        }
        return [...prev, ...gameLines, ''];
      });
      
      // Auto-exit when game is over
      if (snakeGame.gameState.gameOver) {
        setTimeout(() => {
          setIsSnakeMode(false);
        }, 3000); // Wait 3 seconds before exiting
      }
    }
  }, [isSnakeMode, snakeGame.gameState]);

  return (
    <div className={`bg-[#1e1e1e] text-[#d4d4d4] flex flex-col ${isMaximized ? 'fixed inset-0 z-50' : 'h-full'}`}>
      <div className="flex items-center justify-between bg-[#2d2d30] px-4 py-2 border-b border-[#3e3e42]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
          <span className="ml-2 text-[#cccccc] text-sm">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          {activeFile?.endsWith('.py') && (
            <button
              onClick={() => runPythonCode(fileContent || '')}
              disabled={isRunning || !fileContent}
              className="flex items-center space-x-1 px-2 py-1 bg-[#0e639c] hover:bg-[#1177bb] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          )}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="text-[#cccccc] hover:text-white transition-colors"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm"
      >
        {displayedOutput.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
        {!isSnakeMode && (
          <div className="flex items-center">
            <span className="text-[#4fc1ff] mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              className="bg-transparent border-none outline-none text-[#d4d4d4] flex-1 disabled:opacity-50"
              placeholder={isRunning ? "Running..." : "Type a command..."}
              autoFocus
            />
          </div>
        )}
        
        {isSnakeMode && (
          <div className="text-[#888] text-xs mt-2">
            Snake Mode Active - Use WASD/Arrow keys to play, SPACE to pause, ESC to exit
          </div>
        )}
      </div>
    </div>
  );
};