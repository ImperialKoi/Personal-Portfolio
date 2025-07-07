
import { useState, useEffect, useRef } from 'react';
import { Search, FileText, Folder, Terminal, Settings } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

export const CommandPalette = ({ onClose, onCommand }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'open-about',
      label: 'Open About',
      description: 'View personal information and bio',
      icon: <FileText className="w-4 h-4" />,
      category: 'Files'
    },
    {
      id: 'open-resume',
      label: 'Open Resume',
      description: 'View detailed work experience',
      icon: <FileText className="w-4 h-4" />,
      category: 'Files'
    },
    {
      id: 'open-projects',
      label: 'Open Projects',
      description: 'Browse project portfolio',
      icon: <Folder className="w-4 h-4" />,
      category: 'Files'
    },
    {
      id: 'open-contact',
      label: 'Open Contact',
      description: 'Get in touch information',
      icon: <FileText className="w-4 h-4" />,
      category: 'Files'
    },
    {
      id: 'toggle-terminal',
      label: 'Toggle Terminal',
      description: 'Show/hide integrated terminal',
      icon: <Terminal className="w-4 h-4" />,
      category: 'View'
    },
    {
      id: 'help',
      label: 'Show Help',
      description: 'Display available commands',
      icon: <Settings className="w-4 h-4" />,
      category: 'Help'
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (filteredCommands[selectedIndex]) {
          onCommand(filteredCommands[selectedIndex].id);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#3e3e42]">
          <Search className="w-4 h-4 text-[#969696] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#cccccc] outline-none placeholder-[#969696]"
          />
          <div className="text-xs text-[#969696] ml-3">
            <kbd className="px-2 py-1 bg-[#3e3e42] rounded text-xs">Esc</kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <div className="py-2">
              {filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className={`flex items-center px-4 py-3 cursor-pointer ${
                    index === selectedIndex
                      ? 'bg-[#37373d] text-white'
                      : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                  }`}
                  onClick={() => onCommand(command.id)}
                >
                  <div className="mr-3 text-[#969696]">
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    <div className="text-sm text-[#969696]">{command.description}</div>
                  </div>
                  <div className="text-xs text-[#969696] px-2 py-1 bg-[#3e3e42] rounded">
                    {command.category}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#969696]">
              <Search className="w-8 h-8 mx-auto mb-4 opacity-50" />
              <p>No commands found</p>
              <p className="text-sm mt-1">Try searching for files, settings, or actions</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#252526] border-t border-[#3e3e42] text-xs text-[#969696] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <kbd className="px-1 bg-[#3e3e42] rounded mr-1">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center">
              <kbd className="px-1 bg-[#3e3e42] rounded mr-1">Enter</kbd>
              Select
            </span>
          </div>
          <span>Command Palette</span>
        </div>
      </div>
    </div>
  );
};
