"use client"
import type React from "react"
import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react"
import { cn } from "@/lib/utils"

export const CometCard = ({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  children,
  expandScrollDistance = 2800,
}: {
  rotateDepth?: number
  translateDepth?: number
  className?: string
  children: React.ReactNode
  expandScrollDistance?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`])

  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`])
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`])

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`

  // Track scroll position to determine if expanded
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const shouldExpand = scrollY >= expandScrollDistance
      setIsExpanded(shouldExpand)
      
      // Show/hide skills content based on expansion
      const skillsContent = document.querySelector('.skills-content')
      if (skillsContent) {
        if (shouldExpand) {
          skillsContent.classList.remove('opacity-0')
          skillsContent.classList.add('opacity-100')
          
          // Trigger skills animation when expanded
          setTimeout(() => {
            const skillItems = document.querySelectorAll('.skill-item')
            const skillProgress = document.querySelectorAll('.skill-progress')
            
            skillItems.forEach((item, index) => {
              item.style.opacity = '1'
              item.style.transform = 'translateY(0) scale(1)'
              item.style.transition = `all 0.8s ease ${index * 0.15}s`
            })
            
            skillProgress.forEach((progress, index) => {
              const level = progress.getAttribute('data-level') || progress.style.width
              progress.style.width = level
              progress.style.transition = `width 1.5s ease ${0.5 + index * 0.1}s`
            })
          }, 100)
        } else {
          skillsContent.classList.remove('opacity-100')
          skillsContent.classList.add('opacity-0')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Check initial scroll position
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [expandScrollDistance])

  // Handle mouse tracking
  useEffect(() => {
    if (isExpanded) {
      // Reset to neutral position when expanded
      x.set(0)
      y.set(0)
      return
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from card center to mouse
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Normalize based on screen dimensions for consistent tilt
      const maxDistance = Math.max(window.innerWidth, window.innerHeight)
      const xPct = Math.max(-0.5, Math.min(0.5, deltaX / maxDistance))
      const yPct = Math.max(-0.5, Math.min(0.5, deltaY / maxDistance))

      x.set(xPct)
      y.set(yPct)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isExpanded, x, y])

  return (
    <div className={cn("perspective-distant transform-3d", className)}>
      <motion.div
        ref={ref}
        style={{
          rotateX: isExpanded ? 0 : rotateX,
          rotateY: isExpanded ? 0 : rotateY,
          translateX: isExpanded ? 0 : translateX,
          translateY: isExpanded ? 0 : translateY,
          boxShadow: isExpanded 
            ? "none"
            : "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={isExpanded ? {} : {
          scale: 1.05,
          z: 50,
          transition: { duration: 0.2 },
        }}
        className="relative rounded-2xl"
      >
        {children}
        {!isExpanded && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay"
            style={{
              background: glareBackground,
              opacity: 0.6,
            }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </div>
  )
}