
import { Terminal, GitBranch, Zap, AlertCircle } from 'lucide-react';

interface StatusBarProps {
  activeFile: string;
  onTerminalToggle: () => void;
  terminalVisible: boolean;
}

export const StatusBar = ({ activeFile, onTerminalToggle, terminalVisible }: StatusBarProps) => {
  const getFileLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languages = {
      js: 'JavaScript',
      jsx: 'JavaScript React',
      ts: 'TypeScript',
      tsx: 'TypeScript React',
      py: 'Python',
      json: 'JSON',
      md: 'Markdown',
      pdf: 'PDF',
    };
    return languages[ext as keyof typeof languages] || 'Plain Text';
  };

  return (
    <div className="h-6 bg-[#007acc] flex items-center justify-between px-4 text-xs text-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>0</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3" />
          <span>0</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span>Ln 1, Col 1</span>
        <span>{getFileLanguage(activeFile)}</span>
        <span>UTF-8</span>
        <span>CRLF</span>
        
        <button
          onClick={onTerminalToggle}
          className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-[#005a9e] ${
            terminalVisible ? 'bg-[#005a9e]' : ''
          }`}
        >
          <Terminal className="w-3 h-3" />
          <span>Terminal</span>
        </button>
      </div>
    </div>
  );
};
