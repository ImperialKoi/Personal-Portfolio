import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Download, ExternalLink, Code, Database, Globe, Smartphone, Terminal, ChevronDown, Moon, Sun, User, Briefcase, MessageSquare, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import developerIllustration from '@/assets/developer-illustration.png';
import AnimatedUnderline from '@/components/AnimatedUnderline';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Navbar } from '@/components/Navbar';

export default function Simple() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Add state for underline animation
  const [underlineInView, setUnderlineInView] = useState({
    about: false,
    skills: false,
    projects: false,
    contact: false,
  });

  // Navigation sections
  const navigationSections = [
    { id: 'hero', icon: User, label: 'Home', ref: heroRef },
    { id: 'about', icon: User, label: 'About', ref: aboutRef },
    { id: 'skills', icon: Code, label: 'Skills', ref: skillsRef },
    { id: 'projects', icon: Briefcase, label: 'Projects', ref: projectsRef },
    { id: 'contact', icon: MessageSquare, label: 'Contact', ref: contactRef },
  ];

  // Theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll animations and active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class
            entry.target.classList.add('animate-fade-in');
            
            // Update active section
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' }
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

  // Scroll animations for underline
  useEffect(() => {
    const sectionRefs = [
      { id: 'about', ref: aboutRef },
      { id: 'skills', ref: skillsRef },
      { id: 'projects', ref: projectsRef },
      { id: 'contact', ref: contactRef },
    ];
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId && entry.isIntersecting) {
            setUnderlineInView((prev) => ({ ...prev, [sectionId]: true }));
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' }
    );
    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => {
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current);
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

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Left Navigation Squares */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {navigationSections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div
              key={section.id}
              className={`
                w-8 h-8 border-2 border-primary/30 cursor-pointer
                transition-all duration-300 ease-in-out
                hover:rotate-45 hover:border-primary hover:bg-primary/20
                ${isActive ? 'bg-primary/20 border-primary rotate-12' : 'hover:shadow-lg'}
                ${!darkMode ? 'hover:bg-foreground/10' : 'hover:bg-primary/30'}
                backdrop-blur-sm bg-background/80
                flex items-center justify-center
                group
              `}
              onClick={() => scrollToSection(section.ref)}
              title={section.label}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className={`
                h-4 w-4 transition-all duration-300
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
                group-hover:text-primary group-hover:scale-110
              `} />
            </div>
          );
        })}
      </div>

      {/* New Navbar */}
      <Navbar
        activeSection={activeSection}
        onSectionSelect={(sectionId) => {
          const section = navigationSections.find(s => s.id === sectionId);
          if (section && section.ref && section.ref.current) {
            scrollToSection(section.ref);
          }
        }}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onTerminal={() => { window.location.href = '/'; }}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section 
          ref={heroRef} 
          data-section="hero"
          className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        >
          {/* Background decorative dots */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-60 left-1/3 w-1 h-1 bg-primary rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-60 right-1/3 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse delay-800"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  Passionate Programmer • Freelancer • Full-Stack Developer
                </div>
                <p className="text-primary text-lg">Hi my name is</p>
                <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                  Daniel Xu
                </h1>
                <h2 className="text-2xl md:text-3xl text-primary font-semibold">
                  A Full-stack Developer
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                I am a Full-Stack Developer with a passion for delivering exceptional results.
                With my expertise in React and Next.js on the frontend, and Node.js, Express, 
                and PostgreSQL on the backend, I bring a unique combination of technical skills 
                and creative problem-solving to every project I work on.
              </p>
              
              <Button size="lg" className="hover-scale group">
                <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Contact me!
              </Button>
            </div>
            
            {/* Right side - Illustration */}
            <div className="relative animate-scale-in">
              <div className="relative z-10">
                <img 
                  src={developerIllustration} 
                  alt="Developer illustration"
                  className="w-full max-w-md mx-auto hover-scale"
                />
              </div>
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll</span>
            <ChevronDown className="h-5 w-5 text-primary" />
          </div>
        </section>

        {/* About Section */}
        <section 
          ref={aboutRef} 
          data-section="about"
          className="py-20 bg-card/30"
        >
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Who am I?</h2>
              <AnimatedUnderline draw={underlineInView.about} className="max-w-xs mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With 5+ years of comprehensive experience in web application development, 
                  I have polished my skills in both frontend and backend development. In addition 
                  to my hands-on experience in web development, my education has also played a 
                  critical role in providing a strong foundation for my career.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      B.Sc (Hons) in Computer Science
                    </h3>
                    <p className="text-primary font-medium mb-2">University of California | 2018 ~ 2020</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Studied computer science, software development, DevOps</li>
                      <li>• Graduated with First Class Honours</li>
                      <li>• Got merit in 7 modules out of 9</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Full-Stack Development Bootcamp
                    </h3>
                    <p className="text-primary font-medium mb-2">Tech Academy | 2017 - 2018</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Studied modules specializing in web development</li>
                      <li>• Completed with overall Excellence</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="hover-scale text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">15+</div>
                      <div className="text-sm text-muted-foreground">Projects Completed</div>
                    </CardContent>
                  </Card>
                  <Card className="hover-scale text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">5+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </CardContent>
                  </Card>
                  <Card className="hover-scale text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">1M+</div>
                      <div className="text-sm text-muted-foreground">Users Served</div>
                    </CardContent>
                  </Card>
                  <Card className="hover-scale text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section 
          ref={skillsRef} 
          data-section="skills"
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">My Skills</h2>
              <AnimatedUnderline draw={underlineInView.skills} className="max-w-xs mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <Card key={skill.name} className="hover-scale group" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{skill.name}</h3>
                        <div className="text-sm text-muted-foreground">{skill.level}% proficiency</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section 
          ref={projectsRef} 
          data-section="projects"
          className="py-20 bg-card/30"
        >
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Projects</h2>
              <AnimatedUnderline draw={underlineInView.projects} className="max-w-xs mx-auto mb-2" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here are some of my recent projects that showcase my skills and passion for development.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={project.title} className="hover-scale group overflow-hidden" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader>
                    <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">{project.description}</CardDescription>
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
                      <Button variant="outline" size="sm" className="hover-scale flex-1">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Button>
                      <Button variant="outline" size="sm" className="hover-scale flex-1">
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
        <section 
          ref={contactRef} 
          data-section="contact"
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-8 text-center">
            <div className="mb-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Let's Work Together</h2>
              <AnimatedUnderline draw={underlineInView.contact} className="max-w-xs mx-auto mb-2" />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                I'm always open to discussing new opportunities and interesting projects. 
                Feel free to reach out if you'd like to collaborate!
              </p>
            </div>
            
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
            
            {/* Social Links */}
            <div className="flex gap-4 justify-center mt-8">
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
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground">
              © 2024 Daniel Xu. All rights reserved. Built with ❤️ using React & TypeScript.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}