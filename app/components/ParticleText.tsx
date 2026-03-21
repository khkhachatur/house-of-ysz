"use client";

import { useEffect, useRef } from "react";

interface ParticleTextProps {
  isHovered: boolean;
}

export default function ParticleText({ isHovered }: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // We store particles in a ref so they don't reset their positions on every render
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // willReadFrequently optimizes the canvas for the getImageData call
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;

    // 1. The Fix: Grab the dynamically generated font family name from the DOM
    const computedFont = window.getComputedStyle(document.body).fontFamily;

    // 2. Draw the text massive and hidden to sample it
    ctx.fillStyle = "white";
    ctx.font = `900 300px ${computedFont}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NEW", window.innerWidth / 2, window.innerHeight / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the solid text

    // 3. Generate particles ONLY once on mount
    if (particlesRef.current.length === 0) {
      const newParticles = [];
      // Tighter grid (every 5 pixels) for a much denser cloud
      for (let y = 0; y < canvas.height; y += 5) {
        for (let x = 0; x < canvas.width; x += 5) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            newParticles.push({
              targetX: x / dpr,
              targetY: y / dpr,
              // Start them completely scattered
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              size: Math.random() * 1.5 + 0.5,
              speed: Math.random() * 0.06 + 0.02,
              // Random offset points for them to float around when not hovered
              floatX: (Math.random() - 0.5) * window.innerWidth * 1.5,
              floatY: (Math.random() - 0.5) * window.innerHeight * 1.5,
            });
          }
        }
      }
      particlesRef.current = newParticles;
    }

    // 4. Animation Engine
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";

      particlesRef.current.forEach((p) => {
        if (isHovered) {
          // Hovered: Snap together to form the text
          p.x += (p.targetX - p.x) * p.speed;
          p.y += (p.targetY - p.y) * p.speed;
        } else {
          // Not Hovered: Disperse into a floating cloud
          p.x += (p.targetX + p.floatX - p.x) * (p.speed * 0.1);
          p.y += (p.targetY + p.floatY - p.y) * (p.speed * 0.1);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Give the browser a tiny delay to ensure fonts are fully painted before reading pixels
    setTimeout(animate, 100);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}