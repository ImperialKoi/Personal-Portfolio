"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PixelatedCanvasProps {
  src: string;
  width: number;
  height: number;
  cellSize?: number;
  dotScale?: number;
  shape?: 'square' | 'circle';
  backgroundColor?: string;
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: 'repel' | 'attract';
  followSpeed?: number;
  jitterStrength?: number;
  jitterSpeed?: number;
  sampleAverage?: boolean;
  className?: string;
}

export function PixelatedCanvas({
  src,
  width,
  height,
  cellSize = 4,
  dotScale = 0.9,
  shape = 'square',
  backgroundColor = '#000000',
  dropoutStrength = 0.1,
  interactive = false,
  distortionStrength = 0.1,
  distortionRadius = 200,
  distortionMode = 'repel',
  followSpeed = 0.2,
  jitterStrength = 4,
  jitterSpeed = 1,
  sampleAverage = false,
  className,
}: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    imageRef.current = img;

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      const draw = () => {
        if (!ctx || !img) return;

        // Smooth mouse position
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * followSpeed;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * followSpeed;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw image off-screen for sampling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCtx.drawImage(img, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);

        // Draw pixelated version
        for (let y = 0; y < height; y += cellSize) {
          for (let x = 0; x < width; x += cellSize) {
            const imgX = Math.floor((x / width) * img.width);
            const imgY = Math.floor((y / height) * img.height);
            const pixelIndex = (imgY * img.width + imgX) * 4;

            let r = imageData.data[pixelIndex];
            let g = imageData.data[pixelIndex + 1];
            let b = imageData.data[pixelIndex + 2];
            const a = imageData.data[pixelIndex + 3];

            // Sample average if enabled
            if (sampleAverage) {
              let totalR = 0, totalG = 0, totalB = 0, count = 0;
              for (let dy = 0; dy < cellSize; dy++) {
                for (let dx = 0; dx < cellSize; dx++) {
                  const sampleX = Math.min(imgX + dx, img.width - 1);
                  const sampleY = Math.min(imgY + dy, img.height - 1);
                  const sampleIndex = (sampleY * img.width + sampleX) * 4;
                  totalR += imageData.data[sampleIndex];
                  totalG += imageData.data[sampleIndex + 1];
                  totalB += imageData.data[sampleIndex + 2];
                  count++;
                }
              }
              r = totalR / count;
              g = totalG / count;
              b = totalB / count;
            }

            // Apply dropout
            if (Math.random() < dropoutStrength) continue;

            let drawX = x;
            let drawY = y;

            // Apply distortion based on mouse position
            if (interactive) {
              const dx = x + cellSize / 2 - mouseRef.current.x;
              const dy = y + cellSize / 2 - mouseRef.current.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < distortionRadius) {
                const force = (1 - distance / distortionRadius) * distortionStrength;
                const angle = Math.atan2(dy, dx);
                const distortMultiplier = distortionMode === 'repel' ? 1 : -1;
                drawX += Math.cos(angle) * force * cellSize * 10 * distortMultiplier;
                drawY += Math.sin(angle) * force * cellSize * 10 * distortMultiplier;
              }

              // Apply jitter
              drawX += (Math.random() - 0.5) * jitterStrength * Math.sin(Date.now() * jitterSpeed * 0.001);
              drawY += (Math.random() - 0.5) * jitterStrength * Math.cos(Date.now() * jitterSpeed * 0.001);
            }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

            if (shape === 'circle') {
              ctx.beginPath();
              ctx.arc(
                drawX + cellSize / 2,
                drawY + cellSize / 2,
                (cellSize / 2) * dotScale,
                0,
                Math.PI * 2
              );
              ctx.fill();
            } else {
              const size = cellSize * dotScale;
              const offset = (cellSize - size) / 2;
              ctx.fillRect(drawX + offset, drawY + offset, size, size);
            }
          }
        }

        if (interactive) {
          animationRef.current = requestAnimationFrame(draw);
        }
      };

      draw();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas || !interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [src, width, height, cellSize, dotScale, shape, backgroundColor, dropoutStrength, interactive, distortionStrength, distortionRadius, distortionMode, followSpeed, jitterStrength, jitterSpeed, sampleAverage]);

  return <canvas ref={canvasRef} className={cn(className)} />;
}
