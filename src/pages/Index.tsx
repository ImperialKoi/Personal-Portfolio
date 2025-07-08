
import { useState, useEffect } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { Terminal } from '@/components/Terminal';
import { Editor } from '@/components/Editor';
import { StatusBar } from '@/components/StatusBar';
import { CommandPalette } from '@/components/CommandPalette';
import { TabBar } from '@/components/TabBar';
import { BootSequence } from '@/components/BootSequence';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export type FileType = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileType[];
  extension?: string;
  url?: string;
};

export type TabType = {
  id: string;
  name: string;
  content: string;
  isDirty?: boolean;
  projectUrl?: string;
};

const Index = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [activeFile, setActiveFile] = useState<string>('about.md');
  const [showTerminal, setShowTerminal] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [tabs, setTabs] = useState<TabType[]>([
    { id: 'about.md', name: 'about.md', content: `# Hello! I'm Jane Doe 👋

Full-stack developer passionate about creating amazing web experiences.

## Current Focus
- 🚀 Building scalable React applications
- 🎨 Crafting beautiful user interfaces
- 🔧 DevOps and cloud architecture
- 📱 Mobile-first responsive design

## Skills
\`\`\`javascript
const skills = {
  frontend: ['React', 'TypeScript', 'Tailwind'],
  backend: ['Node.js', 'Python', 'PostgreSQL'],
  tools: ['Docker', 'AWS', 'Git']
};
\`\`\`

*Click around to explore my work!* ✨` },
  ]);

  const fileStructure: FileType[] = [
    {
      name: 'portfolio',
      type: 'folder',
      children: [
        { name: 'about.md', type: 'file', extension: 'md' },
        { name: 'resume.pdf', type: 'file', extension: 'pdf' },
        {
          name: 'projects',
          type: 'folder',
          children: [
            { name: 'ecommerce-app.js', type: 'file', extension: 'js', url: 'https://shopify.com' },
            { name: 'weather-dashboard.tsx', type: 'file', extension: 'tsx', url: 'https://weather.com' },
            { name: 'task-manager.py', type: 'file', extension: 'py' },
          ]
        },
        {
          name: 'blog',
          type: 'folder',
          children: [
            { name: '2024-01-react-patterns.md', type: 'file', extension: 'md' },
            { name: '2023-12-typescript-tips.md', type: 'file', extension: 'md' },
          ]
        },
        { name: 'contact.json', type: 'file', extension: 'json' },
      ]
    }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openFile = (fileName: string, content: string, projectUrl?: string) => {
    setActiveFile(fileName);
    if (!tabs.find(t => t.id === fileName)) {
      setTabs(prev => [...prev, { id: fileName, name: fileName, content, projectUrl }]);
    }
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeFile === tabId && tabs.length > 1) {
      const remainingTabs = tabs.filter(t => t.id !== tabId);
      setActiveFile(remainingTabs[0]?.id || '');
    }
  };

  const activeTab = tabs.find(t => t.id === activeFile);

  if (isBooting) {
    return <BootSequence onBootComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col font-mono overflow-hidden animate-fade-in">
      {/* Title Bar */}
      <div className="h-8 bg-[#323233] flex items-center px-4 text-sm border-b border-[#2d2d30]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
        </div>
        <div className="flex-1 text-center text-[#cccccc]">
          Jane Doe - Portfolio IDE
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#252526] border-r border-[#2d2d30] flex flex-col">
          <FileExplorer 
            files={fileStructure} 
            onFileSelect={openFile}
            activeFile={activeFile}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <TabBar 
            tabs={tabs}
            activeTab={activeFile}
            onTabSelect={setActiveFile}
            onTabClose={closeTab}
          />
          
          <div className="flex-1">
            {showTerminal ? (
              <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel defaultSize={70} minSize={30}>
                  <Editor content={activeTab?.content || ''} fileName={activeFile} projectUrl={activeTab?.projectUrl} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20}>
                  <Terminal onToggle={() => setShowTerminal(!showTerminal)} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <Editor content={activeTab?.content || ''} fileName={activeFile} projectUrl={activeTab?.projectUrl} />
            )}
          </div>
        </div>
      </div>

      <StatusBar 
        activeFile={activeFile}
        onTerminalToggle={() => setShowTerminal(!showTerminal)}
        terminalVisible={showTerminal}
      />

      {showCommandPalette && (
        <CommandPalette 
          onClose={() => setShowCommandPalette(false)}
          onCommand={(command) => {
            console.log('Command executed:', command);
            setShowCommandPalette(false);
          }}
        />
      )}
    </div>
  );
};

export default Index;
