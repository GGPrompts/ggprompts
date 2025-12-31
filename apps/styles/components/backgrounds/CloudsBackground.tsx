'use client';

import { useEffect, useRef } from 'react';

export function CloudsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Clouds animation - Light mode background
    const clouds: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      puffs: Array<{ dx: number; dy: number; r: number }>;
    }> = [];

    // Create fluffy clouds
    for (let i = 0; i < 5; i++) {
      const puffs = [];
      const puffCount = Math.random() * 4 + 3;
      for (let j = 0; j < puffCount; j++) {
        puffs.push({
          dx: (Math.random() - 0.5) * 60,
          dy: (Math.random() - 0.5) * 30,
          r: Math.random() * 30 + 20,
        });
      }

      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        size: Math.random() * 50 + 50,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.4,
        puffs,
      });
    }

    const animate = () => {
      // Light sky gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw fluffy clouds
      clouds.forEach((cloud) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;

        // Draw each puff of the cloud
        cloud.puffs.forEach((puff) => {
          ctx.beginPath();
          ctx.arc(
            cloud.x + puff.dx,
            cloud.y + puff.dy,
            cloud.size * (puff.r / 50),
            0,
            Math.PI * 2,
          );
          ctx.fill();
        });

        cloud.x += cloud.speed;

        // Wrap clouds around screen
        if (cloud.x - cloud.size > canvas.width) {
          cloud.x = -cloud.size * 2;
          cloud.y = Math.random() * canvas.height * 0.6;
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
