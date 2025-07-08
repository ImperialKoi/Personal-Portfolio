
import { useState, useEffect, useRef } from 'react';
import { ProjectPreview } from './ProjectPreview';

interface EditorProps {
  content: string;
  fileName: string;
  projectUrl?: string;
}

// Track which files have been seen before (even partially)
const seenFiles = new Set<string>();

export const Editor = ({ content, fileName, projectUrl }: EditorProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Check if this is a project file that should show preview
  const isProjectFile = fileName.includes('.js') || fileName.includes('.tsx') || fileName.includes('.py');
  const shouldShowPreview = isProjectFile && projectUrl;

  useEffect(() => {
    // Check if this file has been seen before
    const hasBeenSeen = seenFiles.has(fileName);
    
    if (hasBeenSeen) {
      // Show content immediately without animation
      setDisplayedContent(content);
      setIsTyping(false);
      return;
    }
    
    // First time seeing this file - mark as seen and run typing animation
    seenFiles.add(fileName);
    setDisplayedContent('');
    setIsTyping(true);
    
    // Typing animation
    let index = 0;
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;
    
    const typeContent = () => {
      if (isCancelled) return;
      
      if (index < content.length) {
        setDisplayedContent(content.substring(0, index + 1));
        index++;
        timeoutId = setTimeout(typeContent, Math.random() * 20 + 5);
      } else {
        setIsTyping(false);
      }
    };

    const timer = setTimeout(typeContent, 100);
    
    return () => {
      isCancelled = true;
      clearTimeout(timer);
      clearTimeout(timeoutId);
    };
  }, [content, fileName]);

  const getLanguageFromExtension = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'text';
    }
  };

  const formatContent = (content: string, language: string) => {
    // Simple syntax highlighting
    let formatted = content;

    if (language === 'javascript' || language === 'typescript') {
      // Keywords
      formatted = formatted.replace(
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g,
        '<span class="text-[#569cd6]">$1</span>'
      );
      // Strings
      formatted = formatted.replace(
        /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="text-[#ce9178]">$1$2$1</span>'
      );
      // Comments
      formatted = formatted.replace(
        /(\/\/.*$)/gm,
        '<span class="text-[#6a9955]">$1</span>'
      );
    } else if (language === 'python') {
      // Keywords
      formatted = formatted.replace(
        /\b(def|class|import|from|if|else|elif|for|while|return|try|except|with|as)\b/g,
        '<span class="text-[#569cd6]">$1</span>'
      );
      // Strings
      formatted = formatted.replace(
        /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="text-[#ce9178]">$1$2$1</span>'
      );
      // Comments
      formatted = formatted.replace(
        /(#.*$)/gm,
        '<span class="text-[#6a9955]">$1</span>'
      );
    } else if (language === 'markdown') {
      // Headers
      formatted = formatted.replace(
        /^(#{1,6})\s(.*)$/gm,
        '<span class="text-[#4fc1ff] font-bold">$1 $2</span>'
      );
      // Code blocks
      formatted = formatted.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<span class="text-[#d4d4d4] bg-[#0d1117] p-2 rounded block">```$1\n$2```</span>'
      );
      // Inline code
      formatted = formatted.replace(
        /`([^`]+)`/g,
        '<span class="text-[#ce9178] bg-[#0d1117] px-1 rounded">$1</span>'
      );
      // Bold
      formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="font-bold">$1</span>'
      );
      // Italic
      formatted = formatted.replace(
        /\*(.*?)\*/g,
        '<span class="italic">$1</span>'
      );
      // Links
      formatted = formatted.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<span class="text-[#4fc1ff] underline">$1</span>'
      );
    }

    return formatted;
  };

  const language = getLanguageFromExtension(fileName);
  const formattedContent = formatContent(displayedContent, language);

  // Show project preview for project files with URLs
  if (shouldShowPreview) {
    const projectData = getProjectData(fileName);
    return (
      <ProjectPreview
        projectName={projectData.name}
        websiteUrl={projectUrl}
        summary={projectData.summary}
        technologies={projectData.technologies}
        description={projectData.description}
      />
    );
  }

  return (
    <div className="h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm overflow-auto">
      <div className="p-4">
        <div className="flex items-center mb-4 text-xs text-[#858585]">
          <div className="flex items-center space-x-4">
            <span>Ln 1, Col 1</span>
            <span>{language.toUpperCase()}</span>
            <span>UTF-8</span>
            <span>CRLF</span>
          </div>
        </div>
        
        <div className="relative">
          <div 
            className="whitespace-pre-wrap leading-6"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-[#d4d4d4] animate-pulse ml-1 align-text-bottom"></span>
          )}
        </div>
      </div>
    </div>
  );

  function getProjectData(fileName: string) {
    const projectMap: Record<string, any> = {
      'ecommerce-app.js': {
        name: 'E-commerce Application',
        summary: `A full-featured e-commerce platform built with React and Node.js.

Features:
• Product catalog with search and filtering
• Shopping cart and checkout process
• User authentication and profiles
• Payment integration with Stripe
• Admin dashboard for product management
• Real-time inventory tracking`,
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
        description: 'A comprehensive e-commerce solution providing seamless shopping experience with modern web technologies and secure payment processing.'
      },
      'weather-dashboard.tsx': {
        name: 'Weather Dashboard',
        summary: `Real-time weather monitoring application with interactive charts.

Features:
• Current weather conditions
• 7-day forecast with hourly details
• Interactive weather maps
• Location-based weather alerts
• Historical weather data visualization
• Responsive design for mobile and desktop`,
        technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
        description: 'An intuitive weather dashboard that provides comprehensive weather information with beautiful visualizations and real-time updates.'
      },
      'task-manager.py': {
        name: 'Task Management System',
        summary: `Python-based task management system with CLI interface.

Features:
• Create, edit, and delete tasks
• Priority levels and due dates
• Category-based organization
• Progress tracking and reports
• Export tasks to various formats
• Team collaboration features`,
        technologies: ['Python', 'SQLite', 'Click', 'Pandas', 'Rich'],
        description: 'A powerful command-line task management system designed for developers and teams who prefer terminal-based workflows.'
      }
    };

    return projectMap[fileName] || {
      name: fileName,
      summary: 'Project details not available.',
      technologies: [],
      description: 'No description available.'
    };
  }
};
