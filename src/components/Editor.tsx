
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
        websiteUrl={projectData.websiteUrl}
        githubUrl={projectData.githubUrl}
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
    // Try to dynamically import projectInfo from the actual project files
    const projectMap: Record<string, any> = {
      'candit.js': {
        name: 'Candit - Smart E-commerce',
        websiteUrl: 'https://candit-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/candit',
        summary: `A next-generation e-commerce platform with AI-powered recommendations and secure payments.

Key Features:
• AI-powered product recommendations using TensorFlow
• Secure payment processing with Stripe integration
• Real-time inventory management and stock tracking
• Advanced user authentication with JWT tokens
• Shopping cart persistence and wishlist functionality
• Admin dashboard with analytics and product management`,
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TensorFlow', 'Stripe', 'JWT', 'Redis'],
        description: 'A comprehensive e-commerce solution that combines modern web technologies with artificial intelligence to deliver personalized shopping experiences.'
      },
      'blocksnet.tsx': {
        name: 'BlocksNet - Neural Network Builder',
        websiteUrl: 'https://blocksnet-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/blocksnet',
        summary: `A revolutionary visual programming environment for building neural networks through drag-and-drop.

Core Features:
• Visual node-based neural network construction
• Real-time training with live loss visualization
• Multiple activation functions and optimizers
• Custom dataset import and preprocessing tools
• Model export for TensorFlow.js and Python
• Educational tutorials with step-by-step guidance`,
        technologies: ['React', 'TypeScript', 'TensorFlow.js', 'D3.js', 'WebGL', 'Canvas API'],
        description: 'An innovative platform that makes neural network creation accessible through visual programming, enabling users to build and train AI models without writing code.'
      },
      'calicalender.tsx': {
        name: 'CaliCalender - AI Calendar',
        websiteUrl: 'https://calicalender-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/calicalender',
        summary: `An intelligent calendar application powered by AI for optimal scheduling.

Advanced Features:
• AI-powered smart scheduling with optimal time suggestions
• Automatic conflict detection and intelligent resolution
• Natural language processing for event creation
• Seamless integration with Google Calendar and Outlook
• Productivity analytics with personalized insights
• Voice commands and hands-free operation`,
        technologies: ['React', 'TypeScript', 'OpenAI GPT-4', 'Supabase', 'FullCalendar', 'NLP'],
        description: 'A next-generation calendar that uses AI to optimize scheduling, reduce conflicts, and enhance productivity through smart automation.'
      },
      'hackathon-ideas-generator.tsx': {
        name: 'HackathonIdeasGenerator',
        websiteUrl: 'https://hackathon-ideas-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/hackathon-ideas-generator',
        summary: `The ultimate hackathon companion that transforms ideas into winning projects.

Revolutionary Features:
• AI-powered idea generation based on themes and trends
• Multi-AI judging system using GPT-4 and Claude
• Complete project code generation with best practices
• Automated project timeline and milestone planning
• Dynamic pitch deck creation with compelling narratives
• Real-time feasibility analysis and scope optimization`,
        technologies: ['React', 'TypeScript', 'OpenAI GPT-4', 'Claude AI', 'GitHub API'],
        description: 'An innovative platform that revolutionizes hackathon participation by automating the entire process from idea generation to final project submission.'
      },
      'skinscope.tsx': {
        name: 'SkinScope - Cancer Detection',
        websiteUrl: 'https://skinscope-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/skinscope',
        summary: `A life-saving mobile application for early skin cancer detection using AI.

Critical Health Features:
• AI-powered real-time camera analysis for lesion detection
• Custom-trained CNN model with 94% accuracy
• Instant risk assessment with confidence scores
• Multi-class classification for different cancer types
• Integration with dermatology databases for validation
• Local healthcare provider finder with specialist recommendations`,
        technologies: ['React Native', 'TensorFlow Lite', 'Computer Vision', 'Medical AI', 'Camera API'],
        description: 'A revolutionary app that uses cutting-edge AI to detect potential skin cancer through smartphone camera analysis, providing early warnings and connecting users with healthcare professionals.'
      },
      'aiposter.tsx': {
        name: 'AIPoster - Infographic Generator',
        websiteUrl: 'https://aiposter-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/aiposter',
        summary: `AI-powered tool for creating beautiful infographics with smart layouts.

Creative Features:
• Intelligent layout generation using AI algorithms
• Automatic color scheme selection and optimization
• Smart text placement and typography choices
• Integration with stock photo and icon libraries
• Export to multiple formats (PNG, PDF, SVG)
• Template library with customizable designs`,
        technologies: ['React', 'Canvas API', 'OpenAI', 'Design AI', 'Typography APIs'],
        description: 'An innovative design tool that leverages artificial intelligence to create stunning infographics automatically, making professional design accessible to everyone.'
      },
      'logoscan.tsx': {
        name: 'LogoScan - Sustainability Scanner',
        websiteUrl: 'https://logoscan-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/logoscan',
        summary: `AI-powered logo recognition for sustainability assessment.

Environmental Features:
• Real-time logo detection using computer vision
• Comprehensive sustainability database lookup
• Environmental impact scoring and ratings
• Alternative eco-friendly product suggestions
• Company sustainability report integration
• Carbon footprint calculation and tracking`,
        technologies: ['React Native', 'TensorFlow', 'Computer Vision', 'Sustainability APIs'],
        description: 'A conscious consumer app that uses AI to identify brand logos and provide instant sustainability ratings, helping users make environmentally responsible choices.'
      },
      'ecommerce-app.js': {
        name: 'E-commerce Application',
        websiteUrl: 'https://ecommerce-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/ecommerce-app',
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
        websiteUrl: 'https://weather-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/weather-dashboard',
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
        websiteUrl: 'https://task-manager-demo.vercel.app',
        githubUrl: 'https://github.com/danielxu/task-manager',
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
      websiteUrl: undefined,
      githubUrl: undefined,
      summary: 'Project details not available.',
      technologies: [],
      description: 'No description available.'
    };
  }
};
