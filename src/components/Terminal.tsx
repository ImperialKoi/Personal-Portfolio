import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TerminalProps {
  onToggle: () => void;
  activeFile?: string;
  fileContent?: string;
}

export const Terminal = ({ onToggle, activeFile, fileContent }: TerminalProps) => {
  const [output, setOutput] = useState<string[]>([
    'Jane Doe Portfolio Terminal v1.0.0',
    'Type "help" for available commands',
    ''
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

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
      '  help     - Show this help message',
      '  clear    - Clear the terminal',
      '  whoami   - Display current user',
      '  date     - Show current date and time',
      '  echo     - Echo text back',
      '  ls       - List portfolio contents',
      '  run      - Run the current Python file',
      ''
    ],
    clear: () => {
      setOutput([]);
      return [];
    },
    whoami: () => ['jane-doe'],
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

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
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
      </div>
    </div>
  );
};