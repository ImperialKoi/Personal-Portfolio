import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useHorrorGame } from '@/hooks/useHorrorGame';
import { useScavengerHunt } from '@/hooks/useScavengerHunt';
import { toast } from '@/hooks/use-toast';

interface TerminalProps {
  onToggle: () => void;
  activeFile?: string;
  fileContent?: string;
}

export const Terminal = ({ onToggle, activeFile, fileContent }: TerminalProps) => {
  const initialLines = [
    'Daniel Xu Portfolio Terminal v1.0.0',
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
  const [isHorrorMode, setIsHorrorMode] = useState(false);
  const [currentPath, setCurrentPath] = useState('daniel/portfolio');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const snakeAwardedRef = useRef(false);
  const horrorAwardedRef = useRef(false);
  const snakeGame = useSnakeGame();
  const horrorGame = useHorrorGame();
  const scavengerHunt = useScavengerHunt();
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
      '  cd          - Change directory',
      '  date        - Show current date and time',
      '  echo        - Echo text back',
      '  ls          - List portfolio contents',
      '  run         - Run the current Python file',
      '  snake       - Play Snake game',
      '  horror      - Play Horror Escape Room',
      '  projects    - Show project overview',
      '  resume      - Download resume',
      '  hunt        - Check scavenger hunt progress',
      '  konami      - ↑↑↓↓←→←→BA (hidden)',
      '  matrix      - Enter the matrix',
      '  hidden      - Show hidden files',
      '  easteregg   - Find the easter egg',
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
    horror: () => {
      setIsHorrorMode(true);
      horrorGame.resetGame();
      return horrorGame.renderGame();
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
      'GitHub: github.com/danielxu | Portfolio: danielxu.dev',
      ''
    ],
    resume: () => {
      // Create a fake resume blob and trigger download
      const resumeContent = `
DANIEL XU
Software Engineer & Full-Stack Developer
Email: daniel.xu@email.com | Phone: (555) 123-4567
GitHub: github.com/danielxu | LinkedIn: linkedin.com/in/danielxu

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
      a.download = 'daniel_xu_resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return [
        '📄 Downloading resume...',
        'daniel_xu_resume.txt saved to Downloads folder',
        ''
      ];
    },
    cd: (args: string[]) => {
      if (args.length === 0) {
        setCurrentPath('daniel/portfolio');
        return [`Changed directory to daniel/portfolio`];
      }
      
      const target = args[0];
      
      // Special case for project-vault
      if (target === 'project-vault') {
        setTimeout(() => {
          window.location.href = '/projects';
        }, 500);
        return [
          '🎮 Entering Project Vault...',
          'Initializing minigames...',
          'Redirecting in 0.5 seconds...',
          ''
        ];
      }
      
      if (target === '..') {
        const pathParts = currentPath.split('/');
        if (pathParts.length > 1) {
          pathParts.pop();
          const newPath = pathParts.join('/');
          setCurrentPath(newPath);
          return [`Changed directory to ${newPath}`];
        } else {
          return ['Already at root directory'];
        }
      } else if (target.startsWith('/')) {
        // Absolute path
        setCurrentPath(target.substring(1));
        return [`Changed directory to ${target.substring(1)}`];
      } else {
        // Relative path
        const newPath = currentPath === '' ? target : `${currentPath}/${target}`;
        setCurrentPath(newPath);
        return [`Changed directory to ${newPath}`];
      }
    },
    simple: () => {
      setTimeout(() => {
        window.location.href = '/simple';
      }, 600); 
      return [
        '🎨 Launching simple portfolio view...',
        'Redirecting to simplified interface...',
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
    },
    hunt: () => {
      const { progress, clues } = scavengerHunt;
      const nextClue = scavengerHunt.getNextClue();
      
      if (progress.completed) {
        return [
          '🎉 SCAVENGER HUNT COMPLETED! 🎉',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'You have found all the hidden secrets!',
          'Welcome to the developer vault! 🔓',
          ''
        ];
      }
      
      return [
        '🔍 SCAVENGER HUNT PROGRESS',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        `Found: ${progress.cluesFound.length}/${clues.length} clues`,
        `Stage: ${progress.currentStage}`,
        '',
        nextClue ? `Next hint: ${nextClue.hint}` : 'No more clues available',
        nextClue ? `Location: ${nextClue.location}` : '',
        '',
        'Use secret commands to find hidden clues!',
        ''
      ];
    },
    konami: () => {
      const clue = scavengerHunt.checkSecretCode('konami');
      if (clue) {
        toast({
          title: "🎮 Konami Code Activated!",
          description: clue.reward || "First clue found!",
          duration: 4000,
        });
        return [
          '🎮 KONAMI CODE ACTIVATED!',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '↑ ↑ ↓ ↓ ← → ← → B A',
          '',
          'You unlocked the first secret!',
          'The hunt has begun...',
          ''
        ];
      }
      return [
        '🎮 Konami Code',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'Already found or invalid sequence',
        ''
      ];
    },
    matrix: () => {
      const clue = scavengerHunt.checkSecretCode('matrix');
      if (clue) {
        toast({
          title: "🔴 Welcome to the Matrix",
          description: clue.reward || "Another clue discovered!",
          duration: 4000,
        });
        return [
          '🔴 THE MATRIX HAS YOU...',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'Wake up, Neo...',
          'The Matrix has you...',
          'Follow the white rabbit.',
          '',
          'Clue discovered! 🐰',
          ''
        ];
      }
      return [
        '🔴 Matrix Access',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'Already accessed or invalid code',
        ''
      ];
    },
    hidden: () => {
      const clue = scavengerHunt.checkSecretCode('hidden');
      if (clue) {
        toast({
          title: "📁 Hidden Files Revealed",
          description: clue.reward || "Secret files found!",
          duration: 4000,
        });
        return [
          '📁 HIDDEN FILES REVEALED',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '.secret/',
          '.vault/',
          '.hidden_projects/',
          '.easter_egg.js',
          '.developer_notes.md',
          '',
          'Hidden files discovered! 🕵️',
          ''
        ];
      }
      return [
        '📁 Hidden Files',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'No hidden files found or already discovered',
        ''
      ];
    },
    easteregg: () => {
      const clue = scavengerHunt.checkSecretCode('easteregg');
      if (clue) {
        toast({
          title: "🥚 Easter Egg Found!",
          description: clue.reward || "You found the easter egg!",
          duration: 4000,
        });
        return [
          '🥚 EASTER EGG DISCOVERED!',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '    /\\_/\\  ',
          '   ( o.o ) ',
          '    > ^ <  ',
          '',
          'You found the hidden easter egg!',
          'The developer approves! 👨‍💻',
          ''
        ];
      }
      return [
        '🥚 Easter Egg',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'Already found or keep looking!',
        ''
      ];
    },
    morse: () => {
      const clue = scavengerHunt.checkSecretCode('morse');
      if (clue) {
        toast({ title: '• — • Morse Decoded', description: clue.reward, duration: 4000 });
        return [
          '• — • MORSE CODE',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'Decoded successfully.',
          ''
        ];
      }
      return [
        '• — • Morse',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'No new signals detected.',
        ''
      ];
    },
    caesar: () => {
      const clue = scavengerHunt.checkSecretCode('caesar');
      if (clue) {
        toast({ title: '🔐 Caesar Cipher', description: clue.reward, duration: 4000 });
        return [
          '🔐 CAESAR CIPHER',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'Cipher cracked. Rotations aligned.',
          ''
        ];
      }
      return [
        '🔐 Caesar',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'Already cracked or invalid.',
        ''
      ];
    },
    'unlock-vault': () => {
      // Require all codes + game achievements
      const requiredIds = [
        'terminal-secret', // konami
        'hidden-element',  // matrix
        'css-secret',      // easteregg
        'file-explorer',   // hidden
        'morse-clue',
        'caesar-clue',
        'snake-master',
        'escape-artist',
      ];

      const hasAllRequirements = requiredIds.every(id => scavengerHunt.progress.cluesFound.includes(id));

      if (hasAllRequirements) {
        const clue = scavengerHunt.checkSecretCode('unlock-vault');
        if (clue) {
          toast({
            title: "🔓 Secret Vault Unlocked!",
            description: "Welcome to the developer's secret vault!",
            duration: 6000,
          });
          return [
            '🔓 SECRET VAULT UNLOCKED!',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '🎉 CONGRATULATIONS! 🎉',
            '',
            'You have successfully completed the scavenger hunt!',
            'Welcome to my secret developer vault!',
            '',
            '🏆 Achievement Unlocked: Master Detective',
            '📱 Special access granted to hidden projects',
            '🔐 Developer secrets revealed',
            '',
            'Thank you for exploring my portfolio!',
            '- Daniel Xu',
            ''
          ];
        }
      }
      return [
        '🔐 Vault Access Denied',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'Requirements not met. Find all codes and beat both games (Snake ≥ 50, Escape Room victory).',
        ''
      ];
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

    // Handle horror game typed actions
    if (isHorrorMode) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsHorrorMode(false);
        horrorGame.resetGame();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const action = input.trim();
        if (action.length > 0) {
          setOutput(prev => [...prev, `$ ${input}`, '']);
          horrorGame.processAction(action);
          setHistory(prev => [...prev, input]);
          setHistoryIndex(-1);
          setInput('');
        }
        return;
      }
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

  // Add global keyboard listener for snake game
  useEffect(() => {
    if (!isSnakeMode) return;

    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      snakeGame.handleKeyPress(e.key);
      
      if (e.key === 'Escape') {
        setIsSnakeMode(false);
        snakeGame.resetGame();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [isSnakeMode, snakeGame]);

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

  // Animate output display (skip animation in snake/horror modes for better performance)
  useEffect(() => {
    if (isSnakeMode || isHorrorMode) {
      setDisplayedOutput(output);
      return;
    }

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
  }, [output, displayedOutput.length, isSnakeMode, isHorrorMode]);

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
          return [...prev.slice(0, lastCommandIndex + 1), '', ...gameLines];
        }
        return [...gameLines];
      });
      
      // Award Snake Master when reaching 50 points
      if (snakeGame.gameState.score >= 50 && !snakeAwardedRef.current) {
        const already = scavengerHunt.clues.find(c => c.id === 'snake-master')?.found;
        if (!already) {
          const clue = scavengerHunt.findClue('snake-master');
          if (clue) {
            toast({ title: '🐍 Snake Master!', description: clue.reward, duration: 4000 });
          }
        }
        snakeAwardedRef.current = true;
      }
      
      // Auto-exit when game is over
      if (snakeGame.gameState.gameOver) {
        setTimeout(() => {
          setIsSnakeMode(false);
        }, 3000); // Wait 3 seconds before exiting
      }
    }
  }, [isSnakeMode, snakeGame.gameState]);

  // Separate effect to handle real-time snake game updates
  useEffect(() => {
    if (!isSnakeMode) return;
    
    const interval = setInterval(() => {
      if (snakeGame.gameState.isPlaying && !snakeGame.gameState.gameOver) {
        const gameLines = snakeGame.renderGame();
        setOutput(prev => {
          const lastCommandIndex = prev.lastIndexOf('$ snake');
          if (lastCommandIndex !== -1) {
            return [...prev.slice(0, lastCommandIndex + 1), '', ...gameLines];
          }
          return [...gameLines];
        });
      }
    }, 50); // Update display every 50ms for smooth animation
    
    return () => clearInterval(interval);
  }, [isSnakeMode, snakeGame]);

  // Award Escape Artist on victory
  useEffect(() => {
    if (isHorrorMode && horrorGame.gameState.victory && !horrorAwardedRef.current) {
      const already = scavengerHunt.clues.find(c => c.id === 'escape-artist')?.found;
      if (!already) {
        const clue = scavengerHunt.findClue('escape-artist');
        if (clue) {
          toast({ title: '🗝️ Escape Artist!', description: clue.reward, duration: 4000 });
        }
      }
      horrorAwardedRef.current = true;
    }
  }, [isHorrorMode, horrorGame.gameState.victory]);

  // Update horror game display
  useEffect(() => {
    if (isHorrorMode) {
      const gameLines = horrorGame.renderGame();
      setOutput(prev => {
        const lastCommandIndex = prev.lastIndexOf('$ horror');
        if (lastCommandIndex !== -1) {
          return [...prev.slice(0, lastCommandIndex + 1), '', ...gameLines];
        }
        return [...gameLines];
      });
    }
  }, [isHorrorMode, horrorGame.gameState]);
  
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
        className="flex-1 min-w-0 w-full p-4 overflow-y-auto overflow-x-hidden font-mono text-sm"
      >
        {displayedOutput.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words break-all max-w-full">
            {line}
          </div>
        ))}
        
        {!isSnakeMode && (
          <div className="flex items-center min-w-0">
            <span className="text-[#4fc1ff] mr-2">{currentPath}$</span>
            <div className="relative flex-1 min-w-0 overflow-hidden">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
                className="bg-transparent border-none outline-none text-[#d4d4d4] w-full disabled:opacity-50 caret-transparent"
                placeholder={isRunning ? "Running..." : "Type a command..."}
                autoFocus
              />
              <div 
                className="absolute top-0 bg-[#d4d4d4] w-2 h-5 animate-pulse pointer-events-none"
                style={{ 
                  left: `${input.length * 0.6}em`,
                  animation: 'blink 1s infinite'
                }}
              />
            </div>
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