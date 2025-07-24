import { useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, MapPin, Download, ExternalLink, Code, Database, Globe, Smartphone, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Simple() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [heroRef, aboutRef, skillsRef, projectsRef, contactRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const skills = [
    { name: 'React', level: 95, icon: Code },
    { name: 'TypeScript', level: 90, icon: Code },
    { name: 'Node.js', level: 85, icon: Database },
    { name: 'PostgreSQL', level: 80, icon: Database },
    { name: 'Next.js', level: 88, icon: Globe },
    { name: 'React Native', level: 75, icon: Smartphone },
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      github: 'https://github.com/danielxu/ecommerce',
      live: 'https://ecommerce-demo.com',
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      tech: ['React', 'Socket.io', 'Express', 'MongoDB'],
      github: 'https://github.com/danielxu/taskmanager',
      live: 'https://taskmanager-demo.com',
    },
    {
      title: 'Weather Dashboard',
      description: 'Beautiful weather app with location-based forecasts',
      tech: ['React', 'TypeScript', 'Weather API', 'Charts.js'],
      github: 'https://github.com/danielxu/weather',
      live: 'https://weather-demo.com',
    },
  ];

  const downloadResume = () => {
    const resumeContent = `
DANIEL XU
Software Engineer & Full-Stack Developer
Email: daniel.xu@email.com | Phone: (555) 123-4567
GitHub: github.com/danielxu | LinkedIn: linkedin.com/in/danielxu

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022-Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews

Full-Stack Developer | StartupXYZ | 2020-2022
• Built responsive web applications using React and Node.js
• Designed and optimized database schemas for high performance
• Collaborated with UX team to implement pixel-perfect designs

EDUCATION
Bachelor of Science in Computer Science | University of California | 2020

SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frontend: React, Next.js, Vue.js, HTML/CSS, Tailwind CSS
Backend: Node.js, Express, Django, RESTful APIs
Databases: PostgreSQL, MongoDB, Redis
Tools: Git, Docker, AWS, Firebase
`;
    
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daniel_xu_resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Terminal Mode Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="hover-scale group bg-background/80 backdrop-blur-sm"
          onClick={() => window.location.href = '/'}
        >
          <Terminal className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          Terminal Mode
        </Button>
      </div>
      
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="animate-scale-in">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-6 hover-scale">
              Daniel Xu
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Full-Stack Developer passionate about creating amazing web experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="hover-scale group" onClick={downloadResume}>
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Download Resume
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="hover-scale">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover-scale">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover-scale">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hi! I'm a passionate full-stack developer with 5+ years of experience building 
                  scalable web applications. I love turning complex problems into simple, 
                  beautiful solutions.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  When I'm not coding, you can find me exploring new technologies, contributing 
                  to open source projects, or hiking in the great outdoors.
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="hover-scale group">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary">15+</div>
                    <div className="text-muted-foreground">Projects Completed</div>
                  </CardContent>
                </Card>
                <Card className="hover-scale group">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary">5+</div>
                    <div className="text-muted-foreground">Years Experience</div>
                  </CardContent>
                </Card>
                <Card className="hover-scale group">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary">1M+</div>
                    <div className="text-muted-foreground">Users Served</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Skills</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <Card key={skill.name} className="hover-scale group" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{skill.name}</h3>
                        <div className="text-sm text-muted-foreground">{skill.level}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <Card key={project.title} className="hover-scale group overflow-hidden" style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader>
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover-scale">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Button>
                    <Button variant="outline" size="sm" className="hover-scale">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-foreground">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="hover-scale group">
              <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Get In Touch
            </Button>
            <Button variant="outline" size="lg" className="hover-scale" onClick={downloadResume}>
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">© 2024 Daniel Xu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}