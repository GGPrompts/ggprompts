'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SpaceBackgroundProps {
  speed?: number;
  opacity?: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: { r: number; g: number; b: number };
  opacity: number;
  layer: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({
  speed = 0.5,
  opacity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<string>('terminal');

  // Track theme changes
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'terminal';
      setTheme(currentTheme);
    };

    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - canvas.width / 2) / (canvas.width / 2);
      targetMouseY = (e.clientY - canvas.height / 2) / (canvas.height / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create stars in different layers
    const stars: Star[] = [];
    const starCounts = [200, 100, 50]; // Far, mid, near

    starCounts.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (layer + 1) * 0.8 + 0.5,
          brightness: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
        });
      }
    });

    // Terminal-themed nebula colors (cyan/green instead of purple/pink)
    const nebulae: Nebula[] = [];
    const nebulaColors = [
      { r: 16, g: 185, b: 129 },  // Terminal green/cyan
      { r: 6, g: 182, b: 212 },   // Cyan
      { r: 20, g: 184, b: 166 },  // Teal
      { r: 34, g: 211, b: 238 },  // Light cyan
    ];

    for (let i = 0; i < 5; i++) {
      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        color,
        opacity: Math.random() * 0.03 + 0.02,
        layer: Math.floor(Math.random() * 2),
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    let lastShootingStar = 0;

    const createShootingStar = () => {
      const angle = (Math.random() * Math.PI) / 3 + Math.PI / 6;
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: -50,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 10 + 15,
        angle,
        opacity: Math.random() * 0.5 + 0.5,
        life: 0,
      });
    };

    const drawStar = (star: Star, offsetX: number, offsetY: number) => {
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
      const actualBrightness = star.brightness * twinkle;

      // Glow effect - cyan/white tinted
      const gradient = ctx.createRadialGradient(
        star.x + offsetX,
        star.y + offsetY,
        0,
        star.x + offsetX,
        star.y + offsetY,
        star.size * 3
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${actualBrightness})`);
      gradient.addColorStop(0.1, `rgba(200, 255, 240, ${actualBrightness * 0.8})`);
      gradient.addColorStop(0.5, `rgba(150, 255, 230, ${actualBrightness * 0.3})`);
      gradient.addColorStop(1, 'rgba(100, 200, 180, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x + offsetX, star.y + offsetY, star.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.fillStyle = `rgba(255, 255, 255, ${actualBrightness})`;
      ctx.beginPath();
      ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNebula = (nebula: Nebula, offsetX: number, offsetY: number) => {
      const gradient = ctx.createRadialGradient(
        nebula.x + offsetX,
        nebula.y + offsetY,
        0,
        nebula.x + offsetX,
        nebula.y + offsetY,
        nebula.radius
      );

      const { r, g, b } = nebula.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${nebula.opacity})`);
      gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${nebula.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(nebula.x + offsetX, nebula.y + offsetY, nebula.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawShootingStar = (star: ShootingStar) => {
      const tailGradient = ctx.createLinearGradient(
        star.x,
        star.y,
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );

      const fadeOpacity = 1 - star.life / 100;
      tailGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * fadeOpacity})`);
      tailGradient.addColorStop(0.1, `rgba(200, 255, 240, ${star.opacity * 0.8 * fadeOpacity})`);
      tailGradient.addColorStop(0.5, `rgba(150, 255, 230, ${star.opacity * 0.3 * fadeOpacity})`);
      tailGradient.addColorStop(1, 'rgba(100, 200, 180, 0)');

      ctx.strokeStyle = tailGradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );
      ctx.stroke();

      // Bright head
      ctx.fillStyle = `rgba(255, 255, 255, ${fadeOpacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (timestamp: number) => {
      // Smooth mouse following
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Pure black background instead of blue gradient
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae (background layer)
      nebulae.forEach((nebula) => {
        const parallaxStrength = (2 - nebula.layer) * 20;
        const offsetX = mouseX * parallaxStrength;
        const offsetY = mouseY * parallaxStrength;
        drawNebula(nebula, offsetX, offsetY);
      });

      // Draw stars in layers (back to front)
      for (let layer = 0; layer < 3; layer++) {
        const parallaxStrength = (2 - layer) * 30 + 10;
        const offsetX = mouseX * parallaxStrength;
        const offsetY = mouseY * parallaxStrength;
        const scrollSpeed = (layer + 1) * 0.1 * speed;

        stars
          .filter((star) => star.layer === layer)
          .forEach((star) => {
            star.twinklePhase += star.twinkleSpeed;
            star.y += scrollSpeed;

            if (star.y > canvas.height + 50) {
              star.y = -50;
              star.x = Math.random() * canvas.width;
            }

            let drawX = star.x + offsetX;
            let drawY = star.y + offsetY;

            drawStar({ ...star, x: drawX % canvas.width, y: drawY % canvas.height }, 0, 0);

            // Wrap around edges for seamless parallax
            if (drawX < 0)
              drawStar(
                { ...star, x: (drawX % canvas.width) + canvas.width, y: drawY % canvas.height },
                0,
                0
              );
            if (drawX > canvas.width)
              drawStar(
                { ...star, x: (drawX % canvas.width) - canvas.width, y: drawY % canvas.height },
                0,
                0
              );
            if (drawY < 0)
              drawStar(
                { ...star, x: drawX % canvas.width, y: (drawY % canvas.height) + canvas.height },
                0,
                0
              );
            if (drawY > canvas.height)
              drawStar(
                { ...star, x: drawX % canvas.width, y: (drawY % canvas.height) - canvas.height },
                0,
                0
              );
          });
      }

      // Create occasional shooting stars
      if (timestamp - lastShootingStar > 5000 + Math.random() * 10000) {
        createShootingStar();
        lastShootingStar = timestamp;
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life++;

        drawShootingStar(star);

        if (star.life > 100 || star.y > canvas.height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      // Subtle vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.8
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed]);

  // Calculate final opacity based on theme
  const finalOpacity = theme === 'light' ? 0 : opacity;

  // Don't render at all in light mode for better performance
  if (theme === 'light') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: finalOpacity, display: 'block' }}
      />
    </div>
  );
};
