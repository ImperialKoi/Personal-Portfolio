
import { X } from 'lucide-react';
import { TabType } from '@/pages/Index';

interface TabBarProps {
  tabs: TabType[];
  activeTab: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const iconColors = {
    js: 'text-[#f7df1e]',
    jsx: 'text-[#61dafb]',
    ts: 'text-[#3178c6]',
    tsx: 'text-[#3178c6]',
    py: 'text-[#3776ab]',
    json: 'text-[#85c1e9]',
    md: 'text-[#519aba]',
    pdf: 'text-[#dc3545]',
  };

  const iconSymbols = {
    js: '{}',
    jsx: '⚛',
    ts: 'TS',
    tsx: '⚛',
    py: '🐍',
    json: '{}',
    md: '📝',
    pdf: '📄',
  };

  const color = iconColors[ext as keyof typeof iconColors] || 'text-[#cccccc]';
  const symbol = iconSymbols[ext as keyof typeof iconSymbols] || '📄';

  return <span className={`text-xs ${color} mr-2`}>{symbol}</span>;
};

export const TabBar = ({ tabs, activeTab, onTabSelect, onTabClose }: TabBarProps) => {
  return (
    <div className="flex bg-[#2d2d30] border-b border-[#2d2d30] overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center px-3 py-2 text-sm cursor-pointer border-r border-[#2d2d30] min-w-0 ${
            activeTab === tab.id
              ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
              : 'bg-[#2d2d30] text-[#969696] hover:bg-[#323233]'
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          {getFileIcon(tab.name)}
          <span className="truncate mr-2">{tab.name}</span>
          {tab.isDirty && (
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="p-1 hover:bg-[#3e3e42] rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
