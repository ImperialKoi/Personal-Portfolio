import { FileType } from '@/pages/Index';

// Import all content files
import aboutContent from '@/content/about.md?raw';
import resumeContent from '@/content/resume.md?raw';
import contactContent from '@/content/contact.json?raw';

// Main projects
import candidContent from '@/content/projects/candit.js?raw';
import blocksnetContent from '@/content/projects/blocksnet.tsx?raw';
import calicalenderContent from '@/content/projects/calicalender.tsx?raw';
import hackathonIdeasContent from '@/content/projects/hackathon-ideas-generator.tsx?raw';
import aiposterContent from '@/content/projects/aiposter.tsx?raw';
import skinscopeContent from '@/content/projects/skinscope.tsx?raw';
import logoscanContent from '@/content/projects/logoscan.tsx?raw';
import recessHacksContent from '@/content/projects/recess-hacks.tsx?raw';

// School projects
import csExamReviewContent from '@/content/school-projects/cs-exam-review.tsx?raw';
import historyTimelineContent from '@/content/school-projects/history-timeline.tsx?raw';
import easaWebsiteContent from '@/content/school-projects/easa-website.tsx?raw';
import amongusKeyboardContent from '@/content/school-projects/amongus-keyboard.py?raw';
import classkickAutoContent from '@/content/school-projects/classkick-auto.py?raw';

// Content mapping
const contentMap: Record<string, string> = {
  'about.md': aboutContent,
  'resume.md': resumeContent,
  'contact.json': contactContent,
  
  // Main projects
  'candit.js': candidContent,
  'blocksnet.tsx': blocksnetContent,
  'calicalender.tsx': calicalenderContent,
  'hackathon-ideas-generator.tsx': hackathonIdeasContent,
  'aiposter.tsx': aiposterContent,
  'skinscope.tsx': skinscopeContent,
  'logoscan.tsx': logoscanContent,
  'recess-hacks.tsx': recessHacksContent,
  
  // School projects
  'cs-exam-review.tsx': csExamReviewContent,
  'history-timeline.tsx': historyTimelineContent,
  'easa-website.tsx': easaWebsiteContent,
  'amongus-keyboard.py': amongusKeyboardContent,
  'classkick-auto.py': classkickAutoContent,
};

// URL mapping for project files
const urlMap: Record<string, string> = {
  // Main projects - no external URLs as these are portfolio showcases
};

export const getFileContent = (fileName: string): string => {
  return contentMap[fileName] || `// Content for ${fileName} not found`;
};

export const getFileUrl = (fileName: string): string | undefined => {
  return urlMap[fileName];
};

export const generateFileStructure = (): FileType[] => {
  return [
    {
      name: 'portfolio',
      type: 'folder',
      children: [
        { 
          name: 'about.md', 
          type: 'file', 
          extension: 'md'
        },
        { 
          name: 'resume.md', 
          type: 'file', 
          extension: 'md'
        },
        {
          name: 'projects',
          type: 'folder',
          children: [
            { 
              name: 'candit.js', 
              type: 'file', 
              extension: 'js'
            },
            { 
              name: 'blocksnet.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'calicalender.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'hackathon-ideas-generator.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'aiposter.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'skinscope.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'ecoscan.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'recess-hacks.tsx', 
              type: 'file', 
              extension: 'tsx'
            }
          ]
        },
        {
          name: 'school-projects',
          type: 'folder',
          children: [
            { 
              name: 'cs-exam-review.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'history-timeline.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'easa-website.tsx', 
              type: 'file', 
              extension: 'tsx'
            },
            { 
              name: 'amongus-keyboard.py', 
              type: 'file', 
              extension: 'py'
            },
            { 
              name: 'classkick-auto.py', 
              type: 'file', 
              extension: 'py'
            }
          ]
        },
        { 
          name: 'contact.json', 
          type: 'file', 
          extension: 'json'
        },
      ]
    }
  ];
};

// Helper function to add new files to the structure
export const addFileToStructure = (
  fileName: string, 
  content: string, 
  path: string[] = ['portfolio'], 
  extension?: string,
  url?: string
): void => {
  // Add to content map
  contentMap[fileName] = content;
  
  // Add URL if provided
  if (url) {
    urlMap[fileName] = url;
  }
  
  // Note: In a real application, you might want to persist this
  // to localStorage or a backend service
  console.log(`File ${fileName} added to ${path.join('/')}`);
};