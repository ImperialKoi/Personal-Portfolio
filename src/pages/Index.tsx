
import { useState, useEffect } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { Terminal } from '@/components/Terminal';
import { Editor } from '@/components/Editor';
import { StatusBar } from '@/components/StatusBar';
import { CommandPalette } from '@/components/CommandPalette';
import { TabBar } from '@/components/TabBar';
import { BootSequence } from '@/components/BootSequence';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateFileStructure, getFileContent, getFileUrl } from '@/utils/fileDiscovery';
import { useScavengerHunt } from '@/hooks/useScavengerHunt';
import { ScavengerHuntProgress } from '@/components/ScavengerHuntProgress';

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

const PortfolioIDE = () => {
  const [activeFile, setActiveFile] = useState<string>('about.md');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [tabs, setTabs] = useState<TabType[]>([
    { 
      id: 'about.md', 
      name: 'about.md', 
      content: getFileContent('about.md')
    },
  ]);
  
  // Scavenger hunt
  const scavengerHunt = useScavengerHunt();

  const fileStructure: FileType[] = generateFileStructure();

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
      const fileContent = getFileContent(fileName);
      const fileUrl = getFileUrl(fileName) || projectUrl;
      setTabs(prev => [...prev, { 
        id: fileName, 
        name: fileName, 
        content: fileContent, 
        projectUrl: fileUrl 
      }]);
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
          Daniel Xu - Portfolio IDE
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
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={70} minSize={30}>
                <Editor content={activeTab?.content || ''} fileName={activeFile} projectUrl={activeTab?.projectUrl} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20}>
                <Terminal onToggle={() => {}} activeFile={activeFile} fileContent={activeTab?.content} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>

      <StatusBar 
        activeFile={activeFile}
        onTerminalToggle={() => {}}
        terminalVisible={true}
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
      
      {/* Scavenger Hunt Progress */}
      {scavengerHunt.isActive && (
        <ScavengerHuntProgress
          progress={scavengerHunt.progress}
          clues={scavengerHunt.clues}
          onReset={scavengerHunt.resetHunt}
          nextClue={scavengerHunt.getNextClue()}
        />
      )}
    </div>
  );
};

const Index = () => {
  const location = useLocation();
  const [isBooting, setIsBooting] = useState(location.pathname !== '/terminal');
  const navigate = useNavigate();

  const handleBootComplete = (mode: 'default' | 'simple' = 'default') => {
    setIsBooting(false);
    if (mode === 'simple') {
      navigate('/simple');
    } else {
      navigate('/terminal');
    }
  };

  if (isBooting) {
    return <BootSequence onBootComplete={handleBootComplete} />;
  }

  return <PortfolioIDE />;
};

export default Index;
