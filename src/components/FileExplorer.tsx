
import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode, Image, FileSpreadsheet } from 'lucide-react';
import { FileType } from '@/pages/Index';
import { getFileContent } from '@/utils/fileDiscovery';

interface FileExplorerProps {
  files: FileType[];
  onFileSelect: (fileName: string, content: string, projectUrl?: string) => void;
  activeFile?: string;
}

const getFileIcon = (extension: string = '') => {
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-[#f7df1e]" />;
    case 'md':
      return <FileText className="w-4 h-4 text-[#519aba]" />;
    case 'json':
      return <FileCode className="w-4 h-4 text-[#85c1e9]" />;
    case 'py':
      return <FileCode className="w-4 h-4 text-[#3776ab]" />;
    case 'pdf':
      return <FileSpreadsheet className="w-4 h-4 text-[#dc3545]" />;
    case 'png':
    case 'jpg':
    case 'svg':
      return <Image className="w-4 h-4 text-[#17a2b8]" />;
    default:
      return <FileText className="w-4 h-4 text-[#cccccc]" />;
  }
};

const FileItem = ({ file, onFileSelect, activeFile, level = 0 }: {
  file: FileType;
  onFileSelect: (fileName: string, content: string, projectUrl?: string) => void;
  activeFile?: string;
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(level === 0);

  const handleClick = () => {
    if (file.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      const content = getFileContent(file.name);
      onFileSelect(file.name, content, file.url);
    }
  };

  const isActive = activeFile === file.name;
  const paddingLeft = level * 16 + 8;

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer text-sm ${
          isActive ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleClick}
      >
        {file.type === 'folder' && (
          <span className="mr-1">
            {isOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        )}
        
        <span className="mr-2">
          {file.type === 'folder' ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-[#dcb67a]" />
            ) : (
              <Folder className="w-4 h-4 text-[#dcb67a]" />
            )
          ) : (
            getFileIcon(file.extension)
          )}
        </span>
        
        <span className="flex-1 truncate">{file.name}</span>
      </div>
      
      {file.type === 'folder' && isOpen && file.children && (
        <div>
          {file.children.map((child, index) => (
            <FileItem 
              key={index}
              file={child}
              onFileSelect={onFileSelect}
              activeFile={activeFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer = ({ files, onFileSelect, activeFile }: FileExplorerProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 text-xs font-semibold text-[#cccccc] bg-[#2d2d30] border-b border-[#2d2d30]">
        EXPLORER
      </div>
      <div className="flex-1 overflow-y-auto">
        {files.map((file, index) => (
          <FileItem 
            key={index}
            file={file}
            onFileSelect={onFileSelect}
            activeFile={activeFile}
          />
        ))}
      </div>
    </div>
  );
};
