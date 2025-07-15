
import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode, Image, FileSpreadsheet } from 'lucide-react';
import { FileType } from '@/pages/Index';

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

  const getFileContent = (fileName: string): string => {
    const contentMap: Record<string, string> = {
      'resume.pdf': `# Daniel Xu - Full Stack Developer

## Contact Information
📧 daniel.xu@email.com
🌐 linkedin.com/in/danielxu
🐙 github.com/danielxu
📱 +1 (555) 123-4567

## Experience

### Senior Frontend Developer @ TechCorp (2022-Present)
- Led development of React-based e-commerce platform serving 100k+ users
- Implemented micro-frontend architecture reducing deployment time by 60%
- Mentored junior developers and established code review processes

### Full Stack Developer @ StartupXYZ (2020-2022)
- Built scalable Node.js APIs handling 1M+ requests/day
- Designed and implemented real-time chat features using WebSockets
- Optimized database queries reducing response time by 40%

## Skills
**Frontend:** React, TypeScript, Next.js, Tailwind CSS, Redux
**Backend:** Node.js, Python, Django, Express.js
**Database:** PostgreSQL, MongoDB, Redis
**DevOps:** Docker, AWS, CI/CD, Kubernetes

## Education
B.S. Computer Science - University of Technology (2020)`,

      'ecommerce-app.js': `// E-commerce Platform - React/Node.js
// Live Demo: https://shop-demo.janedoe.dev

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const EcommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Key Features Implemented:
  // ✅ Product catalog with search/filter
  // ✅ Shopping cart with persistent state
  // ✅ Secure payment processing (Stripe)
  // ✅ User authentication & profiles
  // ✅ Admin dashboard for inventory
  // ✅ Real-time order tracking
  // ✅ Mobile-responsive design
  // ✅ SEO optimization

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App implementation continues... */}
    </div>
  );
};

export default EcommerceApp;`,

      'weather-dashboard.tsx': `// Weather Dashboard - TypeScript/React
// Live Demo: https://weather.janedoe.dev

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
}

const WeatherDashboard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        \`/api/weather?city=\${encodeURIComponent(city)}\`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Weather fetch failed:', error);
    }
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-12 h-12 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-12 h-12 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-12 h-12 text-blue-500" />;
      default: return <Sun className="w-12 h-12" />;
    }
  };

  // Tech Stack:
  // - React 18 with TypeScript
  // - Tailwind CSS for styling
  // - OpenWeather API integration
  // - Real-time updates every 5 minutes
  // - Geolocation API for auto-detection
  // - Progressive Web App (PWA)
  // - Dark/Light mode toggle

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      {/* Dashboard UI continues... */}
    </div>
  );
};

export default WeatherDashboard;`,

      'task-manager.py': `# Task Manager API - Python/Django
# Live Demo: https://tasks-api.janedoe.dev

from django.db import models
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from celery import shared_task

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('review', 'In Review'),
        ('done', 'Done'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Task.STATUS_CHOICES):
            task.status = new_status
            task.save()
            
            # Send notification
            send_status_notification.delay(task.id, new_status)
            
            return Response({'status': 'updated'})
        return Response({'error': 'Invalid status'})

@shared_task
def send_status_notification(task_id, status):
    """Celery task for async notifications"""
    # Implementation for email/slack notifications
    pass

# Features Implemented:
# ✅ RESTful API with Django REST Framework
# ✅ JWT Authentication
# ✅ Task CRUD operations with filtering
# ✅ File attachments with S3 storage
# ✅ Real-time updates via WebSockets
# ✅ Async task processing with Celery
# ✅ Email notifications
# ✅ API documentation with Swagger`,

      'contact.json': `{
  "contact": {
    "name": "Daniel Xu",
    "title": "Full Stack Developer",
    "email": "daniel.xu@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "timezone": "PST (UTC-8)",
    "availability": "Open to new opportunities"
  },
  "social": {
    "github": "https://github.com/janedoe",
    "linkedin": "https://linkedin.com/in/janedoe",
    "twitter": "https://twitter.com/janedoe_dev",
    "portfolio": "https://janedoe.dev",
    "blog": "https://blog.janedoe.dev"
  },
  "preferences": {
    "contact_method": "email",
    "response_time": "24 hours",
    "languages": ["English", "Spanish"],
    "work_style": "Remote-first, flexible hours"
  },
  "quick_commands": {
    "schedule_call": "calendly.com/janedoe",
    "view_calendar": "Available Mon-Fri 9AM-5PM PST",
    "download_resume": "/resume.pdf",
    "latest_work": "/projects"
  }
}`,

      '2024-01-react-patterns.md': `# Modern React Patterns That Will Make You a Better Developer

*Published January 15, 2024*

As React continues to evolve, so do the patterns and practices that make our code more maintainable, performant, and elegant. Here are some modern React patterns I've been using in production that have significantly improved my development experience.

## 1. Compound Components Pattern

The compound component pattern allows you to create flexible and reusable components:

\`\`\`jsx
// Usage
<Card>
  <Card.Header>
    <Card.Title>User Profile</Card.Title>
  </Card.Header>
  <Card.Body>
    <Card.Text>Welcome back!</Card.Text>
  </Card.Body>
</Card>
\`\`\`

## 2. Custom Hooks for Logic Reuse

Instead of cramming all logic into components, extract it into custom hooks:

\`\`\`jsx
const useUserProfile = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Logic here...
  
  return { user, loading, updateUser };
};
\`\`\`

## 3. The Power of useReducer

For complex state logic, useReducer often provides better structure than useState:

\`\`\`jsx
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO':
      return state.map(todo => 
        todo.id === action.id 
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
};
\`\`\`

## Key Takeaways

- Composition over inheritance
- Extract logic into custom hooks
- Use TypeScript for better DX
- Test your patterns thoroughly

What patterns are you using in 2024? Let me know!`,

      '2023-12-typescript-tips.md': `# 5 TypeScript Tips That Will Level Up Your React Code

*Published December 8, 2023*

TypeScript has become essential for modern React development. Here are some advanced tips that have transformed how I write React applications.

## 1. Generic Components

Create truly reusable components with generics:

\`\`\`typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

## 2. Discriminated Unions for State

Model complex state with discriminated unions:

\`\`\`typescript
type AsyncData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
\`\`\`

## 3. Utility Types for Props

Leverage TypeScript's utility types:

\`\`\`typescript
// Extract props from existing components
type ButtonProps = React.ComponentProps<'button'>;

// Make some props optional
type PartialUser = Partial<User>;

// Pick specific props
type UserPreview = Pick<User, 'name' | 'avatar'>;
\`\`\`

## 4. Strict Event Handlers

Type your event handlers properly:

\`\`\`typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Type-safe form handling
};
\`\`\`

## 5. Conditional Rendering Types

Type conditional content elegantly:

\`\`\`typescript
type ConditionalProps = 
  | { showButton: true; onButtonClick: () => void }
  | { showButton: false; onButtonClick?: never };
\`\`\`

These patterns have made my React code more robust and maintainable. Try them out!`
    };

    return contentMap[fileName] || `// ${fileName}\n\n// File content would go here...`;
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
