import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shell } from "@/components/Shell";
import { Project } from "@/components/Project";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Projects = () => {
  const [showLoading, setShowLoading] = useState(true);
  const projects = [
    {
      title: "E-Commerce Platform",
      tech: "React, Node.js, MongoDB, Stripe",
      description: "Full-stack e-commerce with payment processing",
    },
    {
      title: "Task Manager Pro",
      tech: "Python, Django, PostgreSQL, Redis",
      description: "Advanced project management with real-time collaboration",
    },
    {
      title: "Weather Dashboard",
      tech: "React, TypeScript, OpenWeather API",
      description: "Interactive weather forecasting with data visualization",
    },
    {
      title: "AI Chat Assistant",
      tech: "Python, FastAPI, OpenAI GPT, WebSockets",
      description: "Intelligent chatbot with context awareness",
    },
    {
      title: "Mobile Fitness Tracker",
      tech: "React Native, Firebase, Health APIs",
      description: "Cross-platform fitness tracking and goal setting",
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setShowLoading(false);
    }, 1500);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <Shell>
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>
            A showcase of my selected projects, demonstrating my skills and
            experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Project key={index} {...project} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
          <CardDescription>
            A comprehensive list of technologies I've worked with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>JavaScript</Badge>
            <Badge>TypeScript</Badge>
            <Badge>React</Badge>
            <Badge>Node.js</Badge>
            <Badge>Python</Badge>
            <Badge>Django</Badge>
            <Badge>PostgreSQL</Badge>
            <Badge>MongoDB</Badge>
            <Badge>Firebase</Badge>
            <Badge>AWS</Badge>
            <Badge>Docker</Badge>
            <Badge>Git</Badge>
            <Badge>HTML</Badge>
            <Badge>CSS</Badge>
            <Badge>Tailwind CSS</Badge>
            <Badge>Next.js</Badge>
            <Badge>Express.js</Badge>
            <Badge>FastAPI</Badge>
            <Badge>WebSockets</Badge>
            <Badge>Stripe API</Badge>
            <Badge>OpenAI GPT</Badge>
            <Badge>Health APIs</Badge>
            <Badge>Redis</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>
            A brief overview of my professional experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="techcorp">
              <AccordionTrigger>TechCorp Inc. (2022-Present)</AccordionTrigger>
              <AccordionContent>
                Senior Software Engineer: Led development of microservices
                architecture serving 1M+ users. Implemented CI/CD pipelines
                reducing deployment time by 60%. Mentored team of 5 junior
                developers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="startupxyz">
              <AccordionTrigger>StartupXYZ (2020-2022)</AccordionTrigger>
              <AccordionContent>
                Full-Stack Developer: Built scalable web applications using
                React, Node.js, and AWS. Optimized database queries improving
                response time by 40%. Collaborated with cross-functional teams
                on product roadmap.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </Shell>
  );
};

export default Projects;
