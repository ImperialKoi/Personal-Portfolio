import { FileType } from '@/pages/Index';

// Import all content files
import aboutContent from '@/content/about.md?raw';
import resumeContent from '@/content/resume.md?raw';
import contactContent from '@/content/contact.json?raw';
import ecommerceContent from '@/content/projects/ecommerce-app.js?raw';
import weatherContent from '@/content/projects/weather-dashboard.tsx?raw';
import taskManagerContent from '@/content/projects/task-manager.py?raw';
import reactPatternsContent from '@/content/blog/2024-01-react-patterns.md?raw';
import typescriptTipsContent from '@/content/blog/2023-12-typescript-tips.md?raw';

// Content mapping
const contentMap: Record<string, string> = {
  'about.md': aboutContent,
  'resume.md': resumeContent,
  'contact.json': contactContent,
  'ecommerce-app.js': ecommerceContent,
  'weather-dashboard.tsx': weatherContent,
  'task-manager.py': taskManagerContent,
  '2024-01-react-patterns.md': reactPatternsContent,
  '2023-12-typescript-tips.md': typescriptTipsContent,
};

// URL mapping for project files
const urlMap: Record<string, string> = {
  'ecommerce-app.js': 'https://shopify.com',
  'weather-dashboard.tsx': 'https://weather.com',
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
              name: 'ecommerce-app',
              type: 'folder',
              children: [
                { 
                  name: 'ecommerce-app.js', 
                  type: 'file', 
                  extension: 'js', 
                  url: getFileUrl('ecommerce-app.js')
                }
              ]
            },
            {
              name: 'weather-dashboard',
              type: 'folder',
              children: [
                { 
                  name: 'weather-dashboard.tsx', 
                  type: 'file', 
                  extension: 'tsx', 
                  url: getFileUrl('weather-dashboard.tsx')
                }
              ]
            },
            {
              name: 'task-manager',
              type: 'folder',
              children: [
                { 
                  name: 'task-manager.py', 
                  type: 'file', 
                  extension: 'py'
                }
              ]
            }
          ]
        },
        {
          name: 'blog',
          type: 'folder',
          children: [
            { 
              name: '2024-01-react-patterns.md', 
              type: 'file', 
              extension: 'md'
            },
            { 
              name: '2023-12-typescript-tips.md', 
              type: 'file', 
              extension: 'md'
            },
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