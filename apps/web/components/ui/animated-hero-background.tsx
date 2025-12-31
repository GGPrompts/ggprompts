'use client';

import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeroBackgroundProps {
  className?: string;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Particle density multiplier (default: 1) */
  density?: number;
  /** Enable/disable animation (respects prefers-reduced-motion by default) */
  animate?: boolean;
  /** URL for user avatar image (left cluster) */
  userAvatarUrl?: string;
  /** URL for logo image (right cluster) - defaults to GGPrompts logo */
  logoUrl?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  brightness: number;
  stream: number;
  progress: number;
}

interface OrbitalRing {
  radius: number;
  speed: number;
  offset: number;
  brightness: number;
}

export function AnimatedHeroBackground({
  className,
  speed = 1,
  density = 1,
  animate = true,
  userAvatarUrl,
  logoUrl = '/ggprompts-logo.svg',
}: AnimatedHeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef({ primary: [16, 185, 129], secondary: [6, 182, 212] });
  const isLightThemeRef = useRef(false);
  const prefersReducedMotion = useRef(false);
  const leftImageRef = useRef<HTMLImageElement | null>(null);
  const rightImageRef = useRef<HTMLImageElement | null>(null);
  const imagesLoadedRef = useRef({ left: false, right: false });
  const loadedUrlsRef = useRef({ left: '', right: '' });

  // Parse RGB from CSS variable format "r g b"
  const parseRGB = (value: string): number[] => {
    const parts = value.trim().split(/\s+/).map(Number);
    if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
      return parts;
    }
    return [16, 185, 129]; // Fallback to terminal green
  };

  // Read theme colors from CSS variables
  const updateColors = useCallback(() => {
    if (typeof window === 'undefined') return;

    const styles = getComputedStyle(document.documentElement);
    const primaryRGB = styles.getPropertyValue('--primary-rgb');
    const secondaryRGB = styles.getPropertyValue('--secondary-rgb');

    if (primaryRGB) colorsRef.current.primary = parseRGB(primaryRGB);
    if (secondaryRGB) colorsRef.current.secondary = parseRGB(secondaryRGB);

    // Detect light theme
    const theme = document.documentElement.getAttribute('data-theme');
    isLightThemeRef.current = theme === 'light';
  }, []);

  // Load images for cluster cores
  const loadImages = useCallback(() => {
    // Load user avatar (left cluster) - reload if URL changed
    if (userAvatarUrl && loadedUrlsRef.current.left !== userAvatarUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        leftImageRef.current = img;
        imagesLoadedRef.current.left = true;
        loadedUrlsRef.current.left = userAvatarUrl;
      };
      img.onerror = () => {
        imagesLoadedRef.current.left = false;
      };
      img.src = userAvatarUrl;
    }

    // Load logo (right cluster) - reload if URL changed
    if (logoUrl && loadedUrlsRef.current.right !== logoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        rightImageRef.current = img;
        imagesLoadedRef.current.right = true;
        loadedUrlsRef.current.right = logoUrl;
      };
      img.onerror = () => {
        imagesLoadedRef.current.right = false;
      };
      img.src = logoUrl;
    }
  }, [userAvatarUrl, logoUrl]);

  // Initialize particles for data streams
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const numStreams = Math.floor(16 * density);
    const particlesPerStream = Math.floor(8 * density);
    const centerY = height / 2;
    const leftX = width * 0.22;
    const rightX = width * 0.78;

    for (let s = 0; s < numStreams; s++) {
      const yOffset = (s - numStreams / 2) * (height * 0.025);

      for (let p = 0; p < particlesPerStream; p++) {
        particles.push({
          x: 0,
          y: 0,
          vx: 0.002 + Math.random() * 0.003,
          vy: 0,
          size: Math.random() > 0.7 ? 2 : 1,
          brightness: 0.4 + Math.random() * 0.5,
          stream: s,
          progress: Math.random(),
        });
      }
    }

    particlesRef.current = particles;
  }, [density]);

  // Main draw function
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const { primary, secondary } = colorsRef.current;
    const isLight = isLightThemeRef.current;
    const centerY = height / 2;
    const centerX = width / 2;

    // Detect mobile/vertical layout
    const isVertical = width < 640;

    // Responsive positioning
    const maxContentWidth = 1200;
    const contentWidth = Math.min(width, maxContentWidth);
    const contentOffset = (width - contentWidth) / 2;

    // Position clusters - vertical on mobile, horizontal on desktop
    let cluster1X: number, cluster1Y: number, cluster2X: number, cluster2Y: number;
    let ringScale: number;

    if (isVertical) {
      // Vertical layout: stack top and bottom
      cluster1X = centerX;
      cluster1Y = height * 0.30;
      cluster2X = centerX;
      cluster2Y = height * 0.70;
      ringScale = 0.85; // Slightly smaller rings on mobile
    } else {
      // Horizontal layout: left and right
      const spread = contentWidth * 0.35;
      cluster1X = contentOffset + contentWidth / 2 - spread;
      cluster1Y = centerY;
      cluster2X = contentOffset + contentWidth / 2 + spread;
      cluster2Y = centerY;
      ringScale = 1.0;
    }

    // Clear with fade effect for trails - use light bg for light theme
    const bgColor = isLight ? 'rgba(248, 250, 252, 0.15)' : 'rgba(5, 7, 9, 0.15)';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid dots - constrained to content area
    ctx.fillStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.04)`;
    const gridSpacing = 50;
    const gridLeft = contentOffset + gridSpacing;
    const gridRight = contentOffset + contentWidth - gridSpacing;
    for (let x = gridLeft; x < gridRight; x += gridSpacing) {
      for (let y = gridSpacing; y < height - gridSpacing; y += gridSpacing) {
        const edgeFadeX = Math.min(x - gridLeft, gridRight - x) / 100;
        const edgeFadeY = Math.min(y, height - y) / 100;
        const edgeFade = Math.min(edgeFadeX, edgeFadeY);
        if (edgeFade > 0.1 && Math.random() > 0.7) {
          ctx.globalAlpha = 0.08 * Math.min(1, edgeFade);
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Draw orbital rings - cluster 1 (user avatar)
    const cluster1Rings: OrbitalRing[] = [
      { radius: height * 0.12 * ringScale, speed: 0.0003, offset: 0, brightness: 0.25 },
      { radius: height * 0.18 * ringScale, speed: -0.0002, offset: 30, brightness: 0.18 },
      { radius: height * 0.24 * ringScale, speed: 0.00015, offset: 60, brightness: 0.12 },
      { radius: height * 0.30 * ringScale, speed: -0.0001, offset: 90, brightness: 0.08 },
    ];

    cluster1Rings.forEach((ring) => {
      const rotationOffset = time * ring.speed * speed + ring.offset;

      for (let angle = 0; angle < 360; angle += 2) {
        const rad = (angle + rotationOffset) * (Math.PI / 180);
        const x = cluster1X + Math.cos(rad) * ring.radius;
        const y = cluster1Y + Math.sin(rad) * ring.radius * 0.5;

        const pulse = 0.6 + 0.4 * Math.sin(rad * 4 + time * 0.001 * speed);
        const alpha = ring.brightness * pulse;

        if (Math.random() > 0.3) {
          ctx.fillStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Draw orbital rings - cluster 2 (logo, cyan-shifted)
    const cluster2Rings: OrbitalRing[] = [
      { radius: height * 0.13 * ringScale, speed: -0.00035, offset: 0, brightness: 0.28 },
      { radius: height * 0.19 * ringScale, speed: 0.00025, offset: 25, brightness: 0.20 },
      { radius: height * 0.26 * ringScale, speed: -0.00018, offset: 55, brightness: 0.14 },
      { radius: height * 0.33 * ringScale, speed: 0.00012, offset: 85, brightness: 0.09 },
    ];

    cluster2Rings.forEach((ring) => {
      const rotationOffset = time * ring.speed * speed + ring.offset;

      for (let angle = 0; angle < 360; angle += 2) {
        const rad = (angle + rotationOffset) * (Math.PI / 180);
        const x = cluster2X + Math.cos(rad) * ring.radius;
        const y = cluster2Y + Math.sin(rad) * ring.radius * 0.5;

        const pulse = 0.6 + 0.4 * Math.sin(rad * 3.5 + time * 0.0012 * speed);
        const alpha = ring.brightness * pulse;

        // Blend towards secondary color
        const r = Math.floor(primary[0] * 0.7 + secondary[0] * 0.3);
        const g = Math.floor(primary[1] * 0.8 + secondary[1] * 0.2);
        const b = Math.floor(primary[2] * 0.6 + secondary[2] * 0.4);

        if (Math.random() > 0.25) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Draw glowing cores
    const corePulse = 0.85 + 0.15 * Math.sin(time * 0.002 * speed);
    const coreRadius = height * 0.08 * ringScale;
    const imageRadius = height * 0.055 * ringScale;

    // Cluster 1 core glow (user avatar)
    const coreGradient1 = ctx.createRadialGradient(cluster1X, cluster1Y, 0, cluster1X, cluster1Y, coreRadius);
    coreGradient1.addColorStop(0, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.9)`);
    coreGradient1.addColorStop(0.3, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.4)`);
    coreGradient1.addColorStop(1, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0)`);

    ctx.globalAlpha = corePulse;
    ctx.fillStyle = coreGradient1;
    ctx.beginPath();
    ctx.arc(cluster1X, cluster1Y, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw user avatar in cluster 1 core (if loaded)
    if (imagesLoadedRef.current.left && leftImageRef.current) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(cluster1X, cluster1Y, imageRadius, 0, Math.PI * 2);
      ctx.clip();
      const imgSize = imageRadius * 2;
      ctx.drawImage(leftImageRef.current, cluster1X - imageRadius, cluster1Y - imageRadius, imgSize, imgSize);
      ctx.restore();

      // Add subtle border glow around avatar
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.8)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cluster1X, cluster1Y, imageRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Cluster 2 core glow (logo)
    const coreRadius2 = height * 0.09 * ringScale;
    const imageRadius2 = height * 0.06 * ringScale;
    const rBlend = Math.floor(primary[0] * 0.8 + secondary[0] * 0.2);
    const gBlend = Math.floor(primary[1] * 0.85 + secondary[1] * 0.15);
    const bBlend = Math.floor(primary[2] * 0.7 + secondary[2] * 0.3);

    const coreGradient2 = ctx.createRadialGradient(cluster2X, cluster2Y, 0, cluster2X, cluster2Y, coreRadius2);
    coreGradient2.addColorStop(0, `rgba(${rBlend}, ${gBlend}, ${bBlend}, 0.95)`);
    coreGradient2.addColorStop(0.3, `rgba(${rBlend}, ${gBlend}, ${bBlend}, 0.45)`);
    coreGradient2.addColorStop(1, `rgba(${rBlend}, ${gBlend}, ${bBlend}, 0)`);

    ctx.globalAlpha = corePulse;
    ctx.fillStyle = coreGradient2;
    ctx.beginPath();
    ctx.arc(cluster2X, cluster2Y, coreRadius2, 0, Math.PI * 2);
    ctx.fill();

    // Draw logo in cluster 2 core (if loaded) with theme gradient
    if (imagesLoadedRef.current.right && rightImageRef.current) {
      const imgSize = imageRadius2 * 2;

      // Create offscreen canvas for gradient-colored logo
      const offscreen = document.createElement('canvas');
      offscreen.width = imgSize;
      offscreen.height = imgSize;
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        // Draw the logo
        offCtx.drawImage(rightImageRef.current, 0, 0, imgSize, imgSize);

        // Apply theme gradient using source-atop compositing
        offCtx.globalCompositeOperation = 'source-atop';
        const logoGradient = offCtx.createLinearGradient(0, 0, imgSize, imgSize);
        logoGradient.addColorStop(0, `rgb(${primary[0]}, ${primary[1]}, ${primary[2]})`);
        logoGradient.addColorStop(0.5, `rgb(${rBlend}, ${gBlend}, ${bBlend})`);
        logoGradient.addColorStop(1, `rgb(${secondary[0]}, ${secondary[1]}, ${secondary[2]})`);
        offCtx.fillStyle = logoGradient;
        offCtx.fillRect(0, 0, imgSize, imgSize);
      }

      // Draw backdrop behind logo for better contrast
      ctx.save();
      ctx.globalAlpha = 0.9;
      const logoBackdrop = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(8, 10, 12, 0.95)';
      ctx.fillStyle = logoBackdrop;
      ctx.beginPath();
      ctx.arc(cluster2X, cluster2Y, imageRadius2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw the gradient-colored logo
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(cluster2X, cluster2Y, imageRadius2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(offscreen, cluster2X - imageRadius2, cluster2Y - imageRadius2, imgSize, imgSize);
      ctx.restore();

      // Add subtle border glow around logo
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = `rgba(${rBlend}, ${gBlend}, ${bBlend}, 0.8)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cluster2X, cluster2Y, imageRadius2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw and update flowing particles
    const numStreams = Math.floor(16 * density);
    particlesRef.current.forEach((particle) => {
      // Update progress
      if (animate && !prefersReducedMotion.current) {
        particle.progress += particle.vx * speed;
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.brightness = 0.4 + Math.random() * 0.5;
        }
      }

      const t = particle.progress;
      const ease = t * t * (3 - 2 * t);

      let x: number, y: number;

      if (isVertical) {
        // Vertical flow: from cluster 1 (top) to cluster 2 (bottom)
        y = cluster1Y + (cluster2Y - cluster1Y) * ease;

        // X offset: funnel shape - compressed at ends, expanded in middle
        const funnelFactor = Math.sin(t * Math.PI);
        const baseOffset = (particle.stream - numStreams / 2) * (width * 0.015);
        const xOffset = baseOffset * (0.15 + funnelFactor * 0.85);

        // Subtle wave for organic feel
        const wave = Math.sin(t * Math.PI * 3 + particle.stream * 0.4) * (width * 0.008) * funnelFactor;
        x = centerX + xOffset + wave;
      } else {
        // Horizontal flow: from cluster 1 (left) to cluster 2 (right)
        x = cluster1X + (cluster2X - cluster1X) * ease;

        // Y offset: funnel shape - compressed at ends, expanded in middle
        const funnelFactor = Math.sin(t * Math.PI);
        const baseOffset = (particle.stream - numStreams / 2) * (height * 0.018);
        const yOffset = baseOffset * (0.15 + funnelFactor * 0.85);

        // Subtle wave for organic feel
        const wave = Math.sin(t * Math.PI * 3 + particle.stream * 0.4) * (height * 0.008) * funnelFactor;
        y = centerY + yOffset + wave;
      }

      // Brightness peaks in middle
      const midBright = Math.pow(Math.sin(t * Math.PI), 0.7);
      const centerFactor = 1 - Math.abs(particle.stream - numStreams / 2) / (numStreams / 2) * 0.5;
      const alpha = (0.15 + 0.5 * midBright) * centerFactor * particle.brightness;

      // Color gradient across stream
      const r = Math.floor(primary[0] * (1 - t * 0.2));
      const g = primary[1];
      const b = Math.floor(primary[2] + t * 45);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw central nexus - positioned between the two clusters
    const nexusCenterX = (cluster1X + cluster2X) / 2;
    const nexusCenterY = (cluster1Y + cluster2Y) / 2;
    const nexusRotation = time * 0.001 * speed;
    const nexusScale = isVertical ? 0.7 : 1.0;

    // Outer hexagonal frames
    for (let layer = 0; layer < 4; layer++) {
      const size = height * (0.08 - layer * 0.015) * nexusScale;
      const rotation = nexusRotation * (layer % 2 === 0 ? 1 : -1) + layer * 15;
      const alpha = 0.3 - layer * 0.06;

      ctx.strokeStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();

      for (let i = 0; i <= 6; i++) {
        const angle = (Math.PI / 3) * i + rotation * (Math.PI / 180);
        const x = nexusCenterX + Math.cos(angle) * size;
        const y = nexusCenterY + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Inner diamond
    const diamondSize = height * 0.035 * nexusScale;
    const diamondPulse = 0.9 + 0.1 * Math.sin(time * 0.003 * speed);

    ctx.strokeStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${0.6 * diamondPulse})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(nexusCenterX, nexusCenterY - diamondSize);
    ctx.lineTo(nexusCenterX + diamondSize, nexusCenterY);
    ctx.lineTo(nexusCenterX, nexusCenterY + diamondSize);
    ctx.lineTo(nexusCenterX - diamondSize, nexusCenterY);
    ctx.closePath();
    ctx.stroke();

    // Core glow
    const nexusCoreSize = height * 0.02 * nexusScale;
    const coreGradient = ctx.createRadialGradient(nexusCenterX, nexusCenterY, 0, nexusCenterX, nexusCenterY, nexusCoreSize);
    coreGradient.addColorStop(0, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${0.95 * diamondPulse})`);
    coreGradient.addColorStop(0.5, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${0.5 * diamondPulse})`);
    coreGradient.addColorStop(1, `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0)`);

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(nexusCenterX, nexusCenterY, nexusCoreSize, 0, Math.PI * 2);
    ctx.fill();

    // Radiating spokes
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle + nexusRotation * 0.5) * (Math.PI / 180);

      for (let seg = 0; seg < 3; seg++) {
        const r1 = height * (0.1 + seg * 0.035) * nexusScale;
        const r2 = r1 + height * 0.025 * nexusScale;
        const alpha = 0.15 - seg * 0.04;

        ctx.strokeStyle = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nexusCenterX + Math.cos(rad) * r1, nexusCenterY + Math.sin(rad) * r1);
        ctx.lineTo(nexusCenterX + Math.cos(rad) * r2, nexusCenterY + Math.sin(rad) * r2);
        ctx.stroke();
      }
    }
  }, [speed, density, animate]);

  // Animation loop
  const animationLoop = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use logical dimensions (divide by dpr since ctx is already scaled)
    const dpr = window.devicePixelRatio || 1;
    draw(ctx, canvas.width / dpr, canvas.height / dpr, time);

    if (animate && !prefersReducedMotion.current) {
      animationRef.current = requestAnimationFrame(animationLoop);
    }
  }, [draw, animate]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initParticles(rect.width, rect.height);
  }, [initParticles]);

  // Setup and cleanup
  useEffect(() => {
    // Check reduced motion preference
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial setup
    updateColors();
    loadImages();
    handleResize();

    // Start animation
    if (animate && !prefersReducedMotion.current) {
      animationRef.current = requestAnimationFrame(animationLoop);
    } else {
      // Draw single frame for reduced motion
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const staticBg = isLightThemeRef.current ? 'rgba(248, 250, 252, 1)' : 'rgba(5, 7, 9, 1)';
          ctx.fillStyle = staticBg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          draw(ctx, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1), 0);
        }
      }
    }

    // Event listeners - handle both resize and zoom
    window.addEventListener('resize', handleResize);

    // Handle zoom changes via visualViewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Reduced motion listener
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
      if (e.matches) {
        cancelAnimationFrame(animationRef.current);
      } else if (animate) {
        animationRef.current = requestAnimationFrame(animationLoop);
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      observer.disconnect();
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [animate, animationLoop, handleResize, updateColors, loadImages, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-none',
        className
      )}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    />
  );
}
