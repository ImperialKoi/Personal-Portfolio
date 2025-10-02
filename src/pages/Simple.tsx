"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Code,
  Database,
  Globe,
  Smartphone,
  ChevronDown,
  User,
  Briefcase,
  MessageSquare,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnimatedUnderline from "@/components/AnimatedUnderline"
import { motion, useScroll, useTransform } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import Lenis from "@studio-freight/lenis"
import { useScavengerHunt } from "@/hooks/useScavengerHunt"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/all"
import { CometCard } from "@/components/ui/comet-card"
import { StickyScroll } from "@/components/ui/sticky-scroll"

// Skills Underline Component that listens for trigger event
const SkillsUnderline = () => {
  const [draw, setDraw] = useState(false)

  useEffect(() => {
    const handleTrigger = () => {
      setDraw(true)
    }

    window.addEventListener('triggerSkillsUnderline', handleTrigger)

    return () => {
      window.removeEventListener('triggerSkillsUnderline', handleTrigger)
    }
  }, [])

  return <AnimatedUnderline draw={draw} className="max-w-xs mx-auto" />
}

// Matrix Trail Component
const MatrixTrail = () => {
  const [trails, setTrails] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    char: string
    opacity: number
    size: number
    timestamp: number
  }>>([])

  const lastMousePos = useRef({ x: 0, y: 0 })
  const lastMouseVelocity = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let trailId = 0

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX
      const currentY = e.clientY

      // Calculate velocity
      const velocityX = currentX - lastMousePos.current.x
      const velocityY = currentY - lastMousePos.current.y

      // Only create trails if mouse is moving
      if (Math.abs(velocityX) > 1 || Math.abs(velocityY) > 1) {
        lastMouseVelocity.current = { x: velocityX, y: velocityY }

        // Create multiple particles in a cone shape
        const particleCount = Math.min(8, Math.max(3, Math.abs(velocityX) + Math.abs(velocityY)) / 3)

        for (let i = 0; i < particleCount; i++) {
          const chars = ['0', '1']
          const char = chars[Math.floor(Math.random() * chars.length)]

          // Calculate backwards direction (opposite of velocity)
          const backwardX = -velocityX
          const backwardY = -velocityY

          // Add cone spread (random angle within 60 degrees)
          const spreadAngle = (Math.random() - 0.5) * Math.PI / 3 // 60 degrees spread
          const magnitude = Math.sqrt(backwardX * backwardX + backwardY * backwardY)
          const baseAngle = Math.atan2(backwardY, backwardX)
          const finalAngle = baseAngle + spreadAngle

          // Calculate particle velocity with random magnitude
          const speed = (0.5 + Math.random() * 1.5) * Math.min(magnitude * 0.3, 8)
          const particleVx = Math.cos(finalAngle) * speed
          const particleVy = Math.sin(finalAngle) * speed

          // Random offset from mouse position
          const offsetX = (Math.random() - 0.5) * 20
          const offsetY = (Math.random() - 0.5) * 20

          const newTrail = {
            id: trailId++,
            x: currentX + offsetX,
            y: currentY + offsetY,
            vx: particleVx,
            vy: particleVy,
            char,
            opacity: 0.8 + Math.random() * 0.2,
            size: 0.8 + Math.random() * 0.4,
            timestamp: Date.now()
          }

          setTrails(prev => [...prev.slice(-30), newTrail])
        }
      }

      lastMousePos.current = { x: currentX, y: currentY }
    }

    // Update particle positions and fade them out
    const updateInterval = setInterval(() => {
      setTrails(prev => prev
        .map(trail => ({
          ...trail,
          x: trail.x + trail.vx,
          y: trail.y + trail.vy,
          vx: trail.vx * 0.98, // Slight deceleration
          vy: trail.vy * 0.98,
          opacity: Math.max(0, trail.opacity - 0.03)
        }))
        .filter(trail => trail.opacity > 0.05)
      )
    }, 16) // ~60fps

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(updateInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {trails.map(trail => (
        <div
          key={trail.id}
          className="absolute text-green-400 font-mono font-bold select-none"
          style={{
            left: trail.x - 6,
            top: trail.y - 12,
            opacity: trail.opacity,
            fontSize: `${trail.size}rem`,
            textShadow: `0 0 ${10 * trail.opacity}px rgba(34, 197, 94, ${trail.opacity * 0.8})`,
            transform: `scale(${trail.size})`,
            transition: 'none'
          }}
        >
          {trail.char}
        </div>
      ))}
    </div>
  )
}

export default function Simple() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Scavenger hunt
  const scavengerHunt = useScavengerHunt()

  // Scroll tracking for animations
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])

  // Add state for underline animation
  const [underlineInView, setUnderlineInView] = useState({
    about: false,
    skills: false,
    projects: false,
    contact: false,
    expandReality: false,
  })

  // Navigation sections
  const navigationSections = [
    { id: "hero", icon: User, label: "Home", ref: heroRef },
    { id: "about", icon: User, label: "About", ref: aboutRef },
    { id: "skills", icon: Code, label: "Skills", ref: skillsRef },
    { id: "projects", icon: Briefcase, label: "Projects", ref: projectsRef },
    { id: "contact", icon: MessageSquare, label: "Contact", ref: contactRef },
  ]

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    gsap.set(".comet-card-container", {
      width: "20rem", // 320px initial width
      height: "24rem", // 384px initial height
      opacity: 1, // Start visible
    })

    ScrollTrigger.create({
      trigger: "#expand-reality",
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(".comet-card-container", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" })
      },
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#expand-reality",
        start: "center center",
        end: "+=800 center",
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    })

    tl.to(".comet-card-container", {
      width: "100vw",
      height: "100vh",
      duration: 1,
      ease: "power2.out",
    })

    // Skills section animations
    gsap.set(".skill-item", { opacity: 0, y: 50, scale: 0.8 })
    gsap.set(".skill-progress", { width: "0%" })

    ScrollTrigger.create({
      trigger: ".skills-section",
      start: "top 70%",
      end: "bottom 30%",
      onEnter: () => {
        gsap.to(".skill-item", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
        })

        // Animate progress bars with delay
        gsap.to(".skill-progress", {
          width: (index, target) => target.getAttribute("data-level") + "%",
          duration: 1.5,
          delay: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        })
      },
      onLeave: () => {
        gsap.to(".skill-item", {
          opacity: 0.3,
          scale: 0.95,
          duration: 0.5,
          stagger: 0.05,
        })
      },
      onEnterBack: () => {
        gsap.to(".skill-item", {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
        })
      },
    })

    // Expand Your Reality section animations
    gsap.set(".expand-text", { opacity: 0, y: 50 })
    gsap.set(".expand-subtitle", { opacity: 0, y: 50 })
    gsap.set(".expand-description", { opacity: 0, y: 50 })

    ScrollTrigger.create({
      trigger: "#expand-reality",
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        gsap.to(".expand-text", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        gsap.to(".expand-subtitle", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "back.out(1.7)",
        })
        gsap.to(".expand-description", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "back.out(1.7)",
        })
      },
      onLeave: () => {
        gsap.to(".expand-text", {
          opacity: 0,
          y: 50,
          duration: 0.5,
        })
        gsap.to(".expand-subtitle", {
          opacity: 0,
          y: 50,
          duration: 0.5,
        })
        gsap.to(".expand-description", {
          opacity: 0,
          y: 50,
          duration: 0.5,
        })
      },
      onEnterBack: () => {
        gsap.to(".expand-text", {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        gsap.to(".expand-subtitle", {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
        gsap.to(".expand-description", {
          opacity: 1,
          y: 0,
          duration: 0.5,
        })
      },
    })

    // Text animations during card expansion
    tl.to(
      ".expand-text",
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0.2,
    )

    tl.to(
      ".expand-subtitle",
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0.4,
    )

    tl.to(
      ".expand-description",
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0.6,
    )

    // Fade out text as animation completes
    tl.to(
      [".expand-text", ".expand-subtitle", ".expand-description"],
      {
        opacity: 0,
        y: -20,
        duration: 0.2,
        stagger: 0.1,
        ease: "power2.in",
      },
      0.8,
    )

    return tl
  })

  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Console log scroll Y position
  useEffect(() => {
    const handleScroll = () => {
      console.log('Current scroll Y:', window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Scroll animations and active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class
            entry.target.classList.add("animate-fade-in")

            // Update active section
            const sectionId = entry.target.getAttribute("data-section")
            if (sectionId) {
              setActiveSection(sectionId)
            }
          }
        })
      },
      { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" },
    )

    const refs = [heroRef, aboutRef, skillsRef, projectsRef, contactRef]
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  // Scroll animations for underline
  useEffect(() => {
    const sectionRefs = [
      { id: "about", ref: aboutRef },
      { id: "skills", ref: skillsRef },
      { id: "projects", ref: projectsRef },
      { id: "contact", ref: contactRef },
    ]
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section")
          if (sectionId && entry.isIntersecting) {
            setUnderlineInView((prev) => ({ ...prev, [sectionId]: true }))
          }
        })
      },
      { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" },
    )
    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current)
    })
    return () => {
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current)
      })
    }
  }, [])

  const stats = [
    { number: "35+", label: "Projects Built" },
    { number: "2+", label: "Years Coding" },
    { number: "3", label: "Hackathons Organized" },
    { number: "2×", label: "Hackathons Won" },
  ]

  const skills = [
    { name: "React", level: 95, icon: Code },
    { name: "TypeScript", level: 90, icon: Code },
    { name: "Node.js", level: 85, icon: Database },
    { name: "PostgreSQL", level: 80, icon: Database },
    { name: "Next.js", level: 88, icon: Globe },
    { name: "Python", level: 75, icon: Smartphone },
  ]

  const projects = [
    {
      title: "RecessHacks",
      sub: "A Internation Hackathon",
      description: "The 5th iteration of a classic highschool international hackathon.",
      tech: ["Next", "Node.js", "PostgreSQL", "Argon2", "NodeMailer"],
      github: "https://github.com/Recess-Hacks/recess-hacks",
      live: "https://recess-hacks.vercel.app",
      image: "/recess-hacks.png",
      category: "Full-Stack",
    },
    {
      title: "BlocksNet",
      sub: "Neural Network Builder",
      description: "Visual drag-and-drop interface for building and training neural networks",
      tech: ["React", "TypeScript", "TensorFlow.js", "D3.js", "WebGL"],
      github: "https://github.com/ImperialKoi/BlocksNet",
      live: "https://blocks-net.vercel.app/",
      image: "/blocks-net.png",
      category: "AI/ML",
    },
    {
      title: "CaliCalender",
      sub: "AI Calendar",
      description: "Smart scheduling with AI-powered optimization and conflict resolution",
      tech: ["React", "OpenAI GPT-4", "Supabase", "FullCalendar"],
      github: "https://github.com/ImperialKoi/CaliCalender",
      live: "https://calender-app-tan.vercel.app/",
      image: "/cali-calendar.png",
      category: "AI/Productivity",
    },
    {
      title: "HackathonIdeasGenerator",
      sub: "AI ideas generator",
      description: "AI generates, judges, and codes the perfect hackathon project for you",
      tech: ["React", "OpenAI", "Claude AI", "TypeScript"],
      github: "https://github.com/ImperialKoi/HackathonIdeaGenerator",
      live: "https://hackathon-idea-generator-chi.vercel.app/",
      image: "/hackathon-ideas-gen.png",
      category: "AI Tools",
    },
    {
      title: "SkinScope",
      sub: "Cancer Detection",
      description: "AI-powered camera app for early skin cancer detection and diagnosis",
      tech: ["React Native", "TensorFlow", "Computer Vision", "Medical AI"],
      github: "https://github.com/ImperialKoi/SkinScope",
      live: "https://skin-scope.vercel.app/",
      image: "/skinscope.png",
      category: "Healthcare AI",
    },
    {
      title: "Personal Portfolio",
      sub: "Daniel's Personal Portfolio",
      description: "Simple and Fun Personal Portfolio with an IDE",
      tech: ["React", "ShadCN", "OpenAI", "Three.js"],
      github: "https://github.com/ImperialKoi/Personal-Portfolio",
      live: "https://daniel-xu.vercel.app",
      image: "/faux-canvas1.png",
      category: "Personal Portfolio",
    },
  ]

  const downloadResume = () => {
    const a = document.createElement("a")
    a.href = "/Resume.pdf"
    a.download = "Daniel_Resume.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      {/* Matrix Trail Effect */}
      <MatrixTrail />

      {/* Left Navigation Squares */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {navigationSections.map((section, index) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <div
              key={section.id}
              className={`
                md:w-8 md:h-8 w-[1.5rem] h-[1.5rem] border-2 border-primary/30 cursor-pointer
                transition-all duration-300 ease-in-out
                hover:rotate-45 hover:border-primary hover:bg-primary/20
                ${isActive ? "bg-primary/20 border-primary rotate-12" : "hover:shadow-lg"}
                ${!darkMode ? "hover:bg-foreground/10" : "hover:bg-primary/30"}
                backdrop-blur-sm bg-background/80
                flex items-center justify-center
                group
              `}
              onClick={() => scrollToSection(section.ref)}
              title={section.label}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon
                className={`
                md:h-4 md:w-4 w-[1rem] h-[1rem] transition-all duration-300
                ${isActive ? "text-primary" : "text-muted-foreground"}
                group-hover:text-primary group-hover:scale-110
              `}
              />
            </div>
          )
        })}
      </div>

      {/* New Navbar */}
      <Navbar
        activeSection={activeSection}
        onSectionSelect={(sectionId) => {
          const section = navigationSections.find((s) => s.id === sectionId)
          if (section && section.ref && section.ref.current) {
            scrollToSection(section.ref)
          }
        }}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onTerminal={() => {
          window.location.href = "/terminal"
        }}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section
          ref={heroRef}
          data-section="hero"
          className="min-h-screen flex items-center justify-center relative overflow-hidden md:pt-16 pt-24"
        >
          <motion.div
            className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center animate-fade-in"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {/* Left side - Text content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-2">
                <motion.div
                  className="text-sm text-muted-foreground uppercase tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Passionate Programmer • Freelancer • Full-Stack Developer
                </motion.div>
                <motion.p
                  className="text-primary text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Hi my name is
                </motion.p>
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Daniel Xu
                </motion.h1>
                <motion.h2
                  className="text-2xl md:text-3xl text-primary font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  A Full-stack Developer
                </motion.h2>
              </div>

              <motion.p
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                I am a Full-Stack Developer with a passion for delivering exceptional results. With my expertise in
                React and Next.js on the frontend, and Node.js, Express, and PostgreSQL on the backend, I bring a unique
                combination of technical skills and creative problem-solving to every project I work on.
                <span className="block mt-2 text-xs tracking-widest text-muted-foreground select-text">
                  -- --- .-. ... .
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <Button
                  size="lg"
                  className="hover-scale group"
                  onClick={() => window.open("https://mailto:imperialkoi9@gmail.com", "_blank")}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact me!
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side - Illustration */}
            <motion.div
              className="relative animate-scale-in"
              style={{ y: parallaxY }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative z-10">
                <motion.img
                  src="/developer-illustration.png"
                  alt="Developer illustration"
                  className="w-full max-w-md mx-auto hover-scale"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 2, -2, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
              {/* Background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll</span>
            <ChevronDown className="h-5 w-5 text-primary" />
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} data-section="about" className="py-20 bg-card/30">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Who am I?</h2>
              <AnimatedUnderline draw={underlineInView.about} className="max-w-xs mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm a Grade 11 student at <span className="font-medium text-foreground">Abbey Park High School</span>,
                  passionate about building web applications and organizing community tech events. I am currently
                  organizing <span className="font-semibold">three</span> hackathons at school and have previously won{" "}
                  <span className="font-semibold">two</span> hackathons. I enjoy mentoring peers, collaborating on
                  projects, and turning ideas into working prototypes.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Abbey Park High School</h3>
                    <p className="text-primary font-medium mb-2">Grade 11 · Student Organizer</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Organizing 3 school hackathons focused on beginner-friendly projects</li>
                      <li>• Won 2 hackathons as a competitor — experience pitching and rapid prototyping</li>
                      <li>• Active in the school tech community and mentoring junior students</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="hover-scale text-center relative">
                        <GlowingEffect disabled={false} proximity={150} />
                        <CardContent className="p-6">
                          <motion.div
                            className="text-3xl font-bold text-primary mb-2"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {stat.number}
                          </motion.div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section
          id="expand-reality"
          data-section="skills"
          ref={skillsRef}
          className="relative h-screen flex items-center justify-center overflow-hidden mb-20"
        >
          <div className="comet-card-container absolute">
            <CometCard className="w-full h-full" expandScrollDistance={2000}>
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-xl relative overflow-hidden">
                {/* Background cosmic image */}
                <img
                  src="/stars.gif"
                  alt="Cosmic nebula"
                  className="w-full h-full object-cover rounded-xl opacity-60"
                />

                {/* Skills Section - Only visible when expanded */}
                <div className="skills-content absolute inset-0 p-8 flex flex-col justify-start pt-32 opacity-0 transition-opacity duration-1000 overflow-hidden">
                  <div className="max-w-6xl mx-auto w-full h-full">
                    <div className="text-center mb-8">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">My Skills</h2>
                      <SkillsUnderline />
                    </div>

                    <StickyScroll
                      content={skills.map((skill) => {
                        const Icon = skill.icon;
                        return {
                          title: skill.name,
                          description: `Proficiency level: ${skill.level}% - One of my core technical skills that I use regularly in my projects and development work.`,
                          content: (
                            <div className="flex flex-col items-center justify-center h-full p-8">
                              <Icon className="h-24 w-24 text-white mb-4" />
                              <div className="text-center">
                                <h3 className="text-3xl font-bold text-white mb-2">{skill.name}</h3>
                                <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                                  <div
                                    className="h-3 bg-white rounded-full transition-all duration-1000"
                                    style={{ width: `${skill.level}%` }}
                                  />
                                </div>
                                <span className="text-xl text-white/90">{skill.level}%</span>
                              </div>
                            </div>
                          ),
                        };
                      })}
                    />
                  </div>
                </div>
              </div>
            </CometCard>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={projectsRef} data-section="projects" className="py-20 bg-card/30">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Projects</h2>
              <AnimatedUnderline draw={underlineInView.projects} className="max-w-xs mx-auto mb-2" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Here are some of my recent projects that showcase my skills and passion for development.
              </p>
              <div className="flex justify-center">
                <Button size="lg" className="hover-scale group" onClick={() => (window.location.href = "/projects")}>
                  <Trophy className="mr-2 h-5 w-5" />🎮 Play Project Vault Game
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <CardContainer key={project.title} className="inter-var">
                  <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] dark:bg-card dark:border-white/[0.2] border-black/[0.1] w-auto h-[29rem] rounded-xl p-6 border">
                    <GlowingEffect disabled={false} proximity={200} />
                    <CardItem translateZ="50" className="text-xl font-bold text-black dark:text-white">
                      {project.title}
                    </CardItem>
                    <CardItem translateZ="50" className="text-lg font-bold text-gray-500 dark:text-white">
                      {project.sub}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      {project.description}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={`${project.title} project screenshot`}
                        className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      />
                    </CardItem>
                    <CardItem translateZ="80" className="w-full mt-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardItem>
                    <div className="flex justify-between items-center mt-6">
                      <CardItem
                        translateZ={20}
                        as="a"
                        href={project.github}
                        target="_blank"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white border border-primary/20 hover:bg-primary/10"
                      >
                        <Github className="h-4 w-4 mr-2 inline" />
                        Code →
                      </CardItem>
                      <CardItem
                        translateZ={20}
                        as="a"
                        href={project.live}
                        target="_blank"
                        className="px-4 py-2 rounded-xl bg-primary dark:bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 inline" />
                        Demo
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} data-section="contact" className="py-20">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <div className="mb-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Let's Work Together</h2>
              <AnimatedUnderline draw={underlineInView.contact} className="max-w-xs mx-auto mb-2" />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                I'm always open to discussing new opportunities and interesting projects. Feel free to reach out if
                you'd like to collaborate!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="hover-scale group"
                onClick={() => window.open("https://mailto:imperialkoi9@gmail.com", "_blank")}
              >
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg" className="hover-scale bg-transparent" onClick={downloadResume}>
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center mt-8">
              <Button
                variant="outline"
                size="icon"
                className="hover-scale bg-transparent"
                onClick={() => window.open("https://github.com/ImperialKoi", "_blank")}
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover-scale bg-transparent"
                onClick={() => window.open("https://www.linkedin.com/in/daniel-xu-876272368/", "_blank")}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover-scale bg-transparent"
                onClick={() => window.open("https://mailto:imperialkoi9@gmail.com", "_blank")}
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground">
              © 2025 Daniel Xu. All rights reserved. Built with ❤️ using React & TypeScript.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
