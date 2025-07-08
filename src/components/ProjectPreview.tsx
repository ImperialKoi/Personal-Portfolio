import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, FileText, ExternalLink } from 'lucide-react';

interface ProjectPreviewProps {
  projectName: string;
  websiteUrl?: string;
  summary: string;
  technologies: string[];
  description: string;
}

export const ProjectPreview = ({ 
  projectName, 
  websiteUrl, 
  summary, 
  technologies, 
  description 
}: ProjectPreviewProps) => {
  const [viewMode, setViewMode] = useState<'preview' | 'summary'>('summary');

  return (
    <div className="h-full bg-[#1e1e1e] text-[#d4d4d4] flex flex-col">
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d30]">
        <h2 className="text-lg font-semibold text-[#4fc1ff]">{projectName}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'summary' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('summary')}
            className="text-xs"
          >
            <FileText className="w-4 h-4 mr-1" />
            Summary
          </Button>
          {websiteUrl && (
            <Button
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('preview')}
              className="text-xs"
            >
              <Globe className="w-4 h-4 mr-1" />
              Preview
            </Button>
          )}
          {websiteUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(websiteUrl, '_blank')}
              className="text-xs"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'summary' ? (
          <div className="p-6 space-y-6 overflow-auto h-full">
            <Card className="p-4 bg-[#252526] border-[#2d2d30]">
              <h3 className="text-lg font-semibold mb-3 text-[#4fc1ff]">Project Overview</h3>
              <p className="text-[#d4d4d4] leading-relaxed">{description}</p>
            </Card>

            <Card className="p-4 bg-[#252526] border-[#2d2d30]">
              <h3 className="text-lg font-semibold mb-3 text-[#4fc1ff]">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#1e1e1e] text-[#ce9178] rounded-full text-sm border border-[#2d2d30]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-[#252526] border-[#2d2d30]">
              <h3 className="text-lg font-semibold mb-3 text-[#4fc1ff]">Summary</h3>
              <p className="text-[#d4d4d4] leading-relaxed whitespace-pre-wrap">{summary}</p>
            </Card>

            {websiteUrl && (
              <Card className="p-4 bg-[#252526] border-[#2d2d30]">
                <h3 className="text-lg font-semibold mb-3 text-[#4fc1ff]">Live Demo</h3>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#4fc1ff]" />
                  <a 
                    href={websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#4fc1ff] hover:underline break-all"
                  >
                    {websiteUrl}
                  </a>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="h-full p-4">
            {websiteUrl ? (
              <iframe
                src={websiteUrl}
                className="w-full h-full border border-[#2d2d30] rounded"
                title={`${projectName} Preview`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[#858585]">
                <div className="text-center">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No website URL provided for this project</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};