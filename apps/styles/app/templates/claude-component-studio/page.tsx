'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  Palette,
  Copy,
  Send,
  Code2,
  Sparkles,
  Settings,
  Eye,
  Download,
  Share2,
  Wand2,
  Layers,
  Type,
  Box,
  Zap,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

// Component library
const componentLibrary = {
  cards: [
    {
      id: 'glass-card',
      name: 'Glassmorphic Card',
      category: 'Cards',
      preview: 'glass',
      customizable: ['background', 'blur', 'border', 'shadow']
    },
    {
      id: 'floating-card',
      name: '3D Floating Card',
      category: 'Cards',
      preview: 'floating',
      customizable: ['float-intensity', 'rotation', 'shadow']
    },
    {
      id: 'neon-card',
      name: 'Neon Glow Card',
      category: 'Cards',
      preview: 'neon',
      customizable: ['glow-color', 'intensity', 'pulse']
    }
  ],
  buttons: [
    {
      id: 'gradient-btn',
      name: 'Gradient Button',
      category: 'Buttons',
      preview: 'gradient',
      customizable: ['colors', 'angle', 'hover-effect']
    },
    {
      id: 'neo-btn',
      name: 'Neomorphic Button',
      category: 'Buttons',
      preview: 'neo',
      customizable: ['depth', 'soft-shadow', 'pressed-state']
    },
    {
      id: 'particle-btn',
      name: 'Particle Effect Button',
      category: 'Buttons',
      preview: 'particle',
      customizable: ['particle-count', 'explosion-radius', 'colors']
    }
  ],
  forms: [
    {
      id: 'animated-form',
      name: 'Animated Form',
      category: 'Forms',
      preview: 'animated',
      customizable: ['field-animation', 'validation-style', 'submit-effect']
    },
    {
      id: 'step-form',
      name: 'Multi-Step Form',
      category: 'Forms',
      preview: 'steps',
      customizable: ['progress-style', 'transition', 'validation']
    }
  ],
  navigation: [
    {
      id: 'floating-nav',
      name: 'Floating Navigation',
      category: 'Navigation',
      preview: 'floating',
      customizable: ['position', 'animation', 'backdrop']
    },
    {
      id: 'sidebar-nav',
      name: 'Collapsible Sidebar',
      category: 'Navigation',
      preview: 'sidebar',
      customizable: ['width', 'collapse-style', 'icons']
    }
  ],
  effects: [
    {
      id: 'cursor-follow',
      name: 'Cursor Follow Effect',
      category: 'Effects',
      preview: 'cursor',
      customizable: ['trail-length', 'color', 'blend-mode']
    },
    {
      id: 'parallax-scroll',
      name: 'Parallax Scroll',
      category: 'Effects',
      preview: 'parallax',
      customizable: ['speed', 'layers', 'direction']
    }
  ]
};

// Framework templates
const frameworks = {
  react: 'React + TypeScript',
  nextjs: 'Next.js 14+ App Router',
  vue: 'Vue 3 Composition API',
  svelte: 'SvelteKit',
  vanilla: 'Vanilla JS',
  astro: 'Astro'
};

// Preview component renderer
const ComponentPreview = ({
  component,
  customization
}: {
  component: any;
  customization: any;
}) => {
  if (!component) return null;

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Glass Card Preview
  if (component.id === 'glass-card') {
    const glassOpacity = parseInt(customization.glassOpacity) || 15;
    const borderOpacity = parseInt(customization.glassBorderOpacity) || 40;
    const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
    return (
      <div
        className="w-full max-w-sm p-6 rounded-xl backdrop-blur-md border transition-all duration-300"
        style={{
          ...baseStyle,
          backgroundColor: `${customization.primaryColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
          borderColor: `${customization.primaryColor}${Math.round(borderOpacity * 2.55).toString(16).padStart(2, '0')}`,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.textColor,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.5).toString(16).padStart(2, '0')}, inset 0 0 20px ${customization.primaryColor}10`,
          backdropFilter: `blur(${customization.blurAmount}px)`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${customization.primaryColor}30` }}
          >
            <Sparkles className="w-6 h-6" style={{ color: customization.primaryColor }} />
          </div>
          <div>
            <h3 className="font-bold">Glassmorphic Card</h3>
            <p className="text-sm opacity-70">Frosted glass effect</p>
          </div>
        </div>
        <p className="opacity-80 text-sm">Beautiful frosted glass aesthetic with customizable blur and transparency.</p>
      </div>
    );
  }

  // Floating Card Preview
  if (component.id === 'floating-card') {
    const floatHeight = parseInt(customization.floatHeight) || 10;
    const rotationX = parseInt(customization.rotationX) || 5;
    const rotationY = parseInt(customization.rotationY) || 5;
    return (
      <motion.div
        className="w-full max-w-sm p-6 rounded-xl border transition-all cursor-pointer"
        style={{
          ...baseStyle,
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.textColor,
          boxShadow: `0 20px 40px ${customization.primaryColor}30`,
        }}
        whileHover={{
          y: -floatHeight,
          rotateX: rotationX,
          rotateY: -rotationY,
          boxShadow: `0 ${30 + floatHeight}px ${60 + floatHeight}px ${customization.primaryColor}40`,
        }}
        transition={{ duration: Number(customization.duration) / 1000 }}
      >
        <h3 className="font-bold mb-2">3D Floating Card</h3>
        <p className="opacity-80 text-sm">Hover to see the 3D lift effect with perspective transforms.</p>
        <div className="mt-4 flex gap-2">
          <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: `${customization.primaryColor}20` }}>Hover me</span>
          <span className="px-2 py-1 text-xs rounded opacity-60" style={{ backgroundColor: `${customization.primaryColor}10` }}>
            {floatHeight}px lift
          </span>
        </div>
      </motion.div>
    );
  }

  // Neon Card Preview
  if (component.id === 'neon-card') {
    const glowIntensity = parseInt(customization.glowIntensity) || 60;
    const glowSpread = parseInt(customization.glowSpread) || 40;
    const pulseSpeed = parseFloat(customization.pulseSpeed) || 2;
    const enablePulse = customization.animations;

    const baseGlow = Math.round(glowIntensity * 0.6);
    const midGlow = Math.round(glowIntensity * 0.4);
    const outerGlow = Math.round(glowIntensity * 0.2);

    return (
      <motion.div
        className="w-full max-w-sm p-6 rounded-xl border-2 transition-all"
        style={{
          ...baseStyle,
          backgroundColor: customization.backgroundColor,
          borderColor: customization.primaryColor,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.textColor,
          boxShadow: `0 0 ${glowSpread * 0.5}px ${customization.primaryColor}${baseGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread}px ${customization.primaryColor}${midGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 1.5}px ${customization.primaryColor}${outerGlow.toString(16).padStart(2, '0')}, inset 0 0 20px ${customization.primaryColor}10`,
        }}
        animate={enablePulse ? {
          boxShadow: [
            `0 0 ${glowSpread * 0.5}px ${customization.primaryColor}${baseGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread}px ${customization.primaryColor}${midGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 1.5}px ${customization.primaryColor}${outerGlow.toString(16).padStart(2, '0')}`,
            `0 0 ${glowSpread * 0.75}px ${customization.primaryColor}${Math.min(255, baseGlow + 30).toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 1.5}px ${customization.primaryColor}${Math.min(255, midGlow + 20).toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 2.25}px ${customization.primaryColor}${Math.min(255, outerGlow + 10).toString(16).padStart(2, '0')}`,
            `0 0 ${glowSpread * 0.5}px ${customization.primaryColor}${baseGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread}px ${customization.primaryColor}${midGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 1.5}px ${customization.primaryColor}${outerGlow.toString(16).padStart(2, '0')}`,
          ],
        } : undefined}
        transition={enablePulse ? { duration: pulseSpeed, repeat: Infinity } : undefined}
      >
        <h3 className="font-bold mb-2" style={{ textShadow: `0 0 ${glowSpread * 0.25}px ${customization.primaryColor}` }}>Neon Glow Card</h3>
        <p className="opacity-80 text-sm">Pulsing neon glow effect with customizable intensity.</p>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="px-2 py-1 rounded" style={{ backgroundColor: `${customization.primaryColor}20` }}>
            {glowIntensity}% glow
          </span>
          {enablePulse && (
            <span className="px-2 py-1 rounded" style={{ backgroundColor: `${customization.primaryColor}20` }}>
              {pulseSpeed}s pulse
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // Gradient Button Preview
  if (component.id === 'gradient-btn') {
    const gradientAngle = parseInt(customization.gradientAngle) || 135;
    const hoverScale = parseFloat(customization.hoverScale) || 1.05;
    const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
    return (
      <div className="flex flex-col gap-4 items-center">
        <motion.button
          className="px-8 py-3 rounded-lg font-bold text-white transition-all"
          style={{
            ...baseStyle,
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            borderRadius: `${customization.borderRadius}px`,
            boxShadow: `0 4px 20px ${customization.primaryColor}${Math.round(shadowIntensity * 1.5).toString(16).padStart(2, '0')}`,
          }}
          whileHover={{
            scale: hoverScale,
            boxShadow: `0 8px 30px ${customization.primaryColor}${Math.round(shadowIntensity * 2).toString(16).padStart(2, '0')}`
          }}
          whileTap={{ scale: 0.95 }}
        >
          Gradient Button
        </motion.button>
        <motion.button
          className="px-8 py-3 rounded-lg font-bold border-2 transition-all"
          style={{
            ...baseStyle,
            background: 'transparent',
            borderImage: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor}) 1`,
            borderRadius: `${customization.borderRadius}px`,
            color: customization.primaryColor,
          }}
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: 0.95 }}
        >
          Outline Variant
        </motion.button>
        <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
          {gradientAngle}° angle · {hoverScale}x hover
        </p>
      </div>
    );
  }

  // Neomorphic Button Preview
  if (component.id === 'neo-btn') {
    const bgColor = customization.backgroundColor;
    const neoDepth = parseInt(customization.neoDepth) || 8;
    const softShadowIntensity = parseInt(customization.softShadowIntensity) || 20;
    const duration = parseInt(customization.duration) || 300;
    return (
      <div className="flex flex-col gap-4 items-center">
        <motion.button
          className="px-8 py-3 rounded-xl font-medium transition-all"
          style={{
            ...baseStyle,
            backgroundColor: bgColor,
            color: customization.textColor,
            borderRadius: `${customization.borderRadius}px`,
            boxShadow: `${neoDepth}px ${neoDepth}px ${neoDepth * 2}px ${customization.primaryColor}${softShadowIntensity.toString(16).padStart(2, '0')}, -${neoDepth}px -${neoDepth}px ${neoDepth * 2}px ${customization.secondaryColor}${Math.round(softShadowIntensity / 2).toString(16).padStart(2, '0')}`,
          }}
          whileHover={{
            boxShadow: `${neoDepth / 2}px ${neoDepth / 2}px ${neoDepth}px ${customization.primaryColor}${Math.round(softShadowIntensity * 1.5).toString(16).padStart(2, '0')}, -${neoDepth / 2}px -${neoDepth / 2}px ${neoDepth}px ${customization.secondaryColor}${softShadowIntensity.toString(16).padStart(2, '0')}`,
          }}
          whileTap={{
            boxShadow: `inset ${neoDepth / 2}px ${neoDepth / 2}px ${neoDepth}px ${customization.primaryColor}${softShadowIntensity.toString(16).padStart(2, '0')}, inset -${neoDepth / 2}px -${neoDepth / 2}px ${neoDepth}px ${customization.secondaryColor}${Math.round(softShadowIntensity / 2).toString(16).padStart(2, '0')}`,
          }}
          transition={{ duration: duration / 1000 }}
        >
          Neomorphic Button
        </motion.button>
        <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
          Click to see pressed state · {neoDepth}px depth
        </p>
      </div>
    );
  }

  // Particle Button Preview
  if (component.id === 'particle-btn') {
    const particleCount = parseInt(customization.particleCount) || 20;
    const explosionRadius = parseInt(customization.explosionRadius) || 50;
    const duration = parseInt(customization.duration) || 300;
    return (
      <div className="flex flex-col gap-4 items-center">
        <motion.button
          className="relative px-8 py-3 rounded-lg font-bold text-white overflow-hidden"
          style={{
            ...baseStyle,
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            borderRadius: `${customization.borderRadius}px`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Particle Button</span>
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${customization.primaryColor}40 0%, transparent ${explosionRadius}%)`,
            }}
            animate={{
              scale: [1, 1 + (explosionRadius / 50), 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: duration / 500, repeat: Infinity }}
          />
          {/* Particle indicators */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: Math.min(particleCount, 8) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: customization.secondaryColor,
                  opacity: 0.6,
                }}
                animate={{
                  x: [0, Math.cos(i * (Math.PI / 4)) * explosionRadius * 0.3],
                  y: [0, Math.sin(i * (Math.PI / 4)) * explosionRadius * 0.3],
                  opacity: [0.6, 0],
                }}
                transition={{ duration: duration / 300, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.button>
        <p className="text-xs opacity-60" style={{ color: customization.textColor }}>
          {particleCount} particles · {explosionRadius}px radius
        </p>
      </div>
    );
  }

  // Animated Form Preview
  if (component.id === 'animated-form') {
    const fieldStagger = parseFloat(customization.fieldStagger) || 0.1;
    const animationStyle = customization.animation || 'smooth';

    // Animation variants based on style
    const variantsByStyle = {
      bounce: {
        hidden: { opacity: 0, y: 30, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.5 } }
      },
      spring: {
        hidden: { opacity: 0, x: -50, scale: 0.9 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
      },
      slide: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      },
      smooth: {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
      }
    } as const;

    const variants = variantsByStyle[animationStyle as keyof typeof variantsByStyle] || variantsByStyle.smooth;
    const fields = ['Name', 'Email', 'Message'];

    return (
      <div
        className="w-full max-w-sm p-6 rounded-xl border space-y-4"
        style={{
          ...baseStyle,
          backgroundColor: `${customization.primaryColor}10`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.textColor,
        }}
      >
        <h3 className="font-bold">Contact Form</h3>
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: fieldStagger }}
        >
          {fields.map((field, i) => (
            <motion.div key={field} variants={variants}>
              {i < 2 ? (
                <input
                  type={field === 'Email' ? 'email' : 'text'}
                  placeholder={field}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent transition-all duration-200"
                  style={{
                    borderColor: `${customization.primaryColor}40`,
                    borderRadius: `${Number(customization.borderRadius) / 2}px`,
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = customization.primaryColor;
                    e.target.style.boxShadow = `0 0 0 2px ${customization.primaryColor}30`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${customization.primaryColor}40`;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ) : (
                <textarea
                  placeholder={field}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border bg-transparent transition-all duration-200 resize-none"
                  style={{
                    borderColor: `${customization.primaryColor}40`,
                    borderRadius: `${Number(customization.borderRadius) / 2}px`,
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = customization.primaryColor;
                    e.target.style.boxShadow = `0 0 0 2px ${customization.primaryColor}30`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${customization.primaryColor}40`;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              )}
            </motion.div>
          ))}
          <motion.button
            variants={variants}
            className="w-full px-4 py-2 rounded-lg font-medium text-white"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              borderRadius: `${Number(customization.borderRadius) / 2}px`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </motion.div>
        <p className="text-xs opacity-50 text-center">{animationStyle} · {fieldStagger}s stagger</p>
      </div>
    );
  }

  // Multi-Step Form Preview
  if (component.id === 'step-form') {
    const stepCount = parseInt(customization.stepCount) || 3;
    const progressStyle = customization.progressStyle || 'circles';

    const renderProgress = () => {
      if (progressStyle === 'bar') {
        return (
          <div className="mb-6">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${customization.primaryColor}20` }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${100 / stepCount}%`,
                  backgroundColor: customization.primaryColor,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs opacity-60">
              {Array.from({ length: stepCount }).map((_, i) => (
                <span key={i}>Step {i + 1}</span>
              ))}
            </div>
          </div>
        );
      }

      if (progressStyle === 'dots') {
        return (
          <div className="flex items-center justify-center gap-3 mb-6">
            {Array.from({ length: stepCount }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-all"
                style={{
                  backgroundColor: i === 0 ? customization.primaryColor : `${customization.primaryColor}30`,
                  transform: i === 0 ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        );
      }

      if (progressStyle === 'breadcrumb') {
        return (
          <div className="flex items-center gap-2 mb-6 text-sm">
            {Array.from({ length: stepCount }).map((_, i) => (
              <React.Fragment key={i}>
                <span style={{ color: i === 0 ? customization.primaryColor : `${customization.primaryColor}60` }}>
                  Step {i + 1}
                </span>
                {i < stepCount - 1 && <ChevronRight className="w-4 h-4 opacity-40" />}
              </React.Fragment>
            ))}
          </div>
        );
      }

      // Default: circles
      return (
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: stepCount }).map((_, i) => (
            <React.Fragment key={i}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: i === 0 ? customization.primaryColor : `${customization.primaryColor}30`,
                  color: i === 0 ? customization.backgroundColor : customization.textColor,
                }}
              >
                {i + 1}
              </div>
              {i < stepCount - 1 && (
                <div
                  className="flex-1 h-1 mx-2 rounded"
                  style={{ backgroundColor: `${customization.primaryColor}30` }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    };

    return (
      <div
        className="w-full max-w-md p-6 rounded-xl border"
        style={{
          ...baseStyle,
          backgroundColor: `${customization.primaryColor}10`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.textColor,
        }}
      >
        {renderProgress()}
        <h3 className="font-bold mb-2">Step 1: Basic Info</h3>
        <p className="text-sm opacity-70">{stepCount} steps · {progressStyle} style</p>
      </div>
    );
  }

  // Floating Navigation Preview
  if (component.id === 'floating-nav') {
    const navSpacing = parseInt(customization.navSpacing) || 6;
    const navPosition = customization.navPosition || 'bottom';
    return (
      <div className="w-full h-32 relative flex items-center justify-center">
        <motion.div
          className="px-6 py-3 rounded-full border flex items-center"
          style={{
            ...baseStyle,
            backgroundColor: `${customization.backgroundColor}ee`,
            borderColor: `${customization.primaryColor}30`,
            backdropFilter: `blur(${customization.blurAmount}px)`,
            boxShadow: `0 10px 40px ${customization.primaryColor}20`,
            gap: `${navSpacing * 4}px`,
            position: 'absolute',
            ...(navPosition === 'top' && { top: 0 }),
            ...(navPosition === 'bottom' && { bottom: 0 }),
            ...(navPosition === 'left' && { left: 0, flexDirection: 'column' as const, borderRadius: `${customization.borderRadius}px` }),
            ...(navPosition === 'right' && { right: 0, flexDirection: 'column' as const, borderRadius: `${customization.borderRadius}px` }),
          }}
          initial={{ y: navPosition === 'top' ? -20 : navPosition === 'bottom' ? 20 : 0, x: navPosition === 'left' ? -20 : navPosition === 'right' ? 20 : 0, opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
        >
          {['Home', 'About', 'Work', 'Contact'].map((item, i) => (
            <motion.span
              key={item}
              className="cursor-pointer transition-colors text-sm"
              style={{ color: i === 0 ? customization.primaryColor : customization.textColor }}
              whileHover={{ color: customization.primaryColor }}
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
        <p className="absolute bottom-0 right-0 text-xs opacity-50" style={{ color: customization.textColor }}>
          {navPosition} · {navSpacing}rem gap
        </p>
      </div>
    );
  }

  // Sidebar Navigation Preview
  if (component.id === 'sidebar-nav') {
    const sidebarWidth = parseInt(customization.sidebarWidth) || 200;
    const collapseWidth = parseInt(customization.collapseWidth) || 60;
    const duration = parseInt(customization.duration) || 300;
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
      <div className="flex gap-4 items-start">
        <motion.div
          className="p-4 rounded-xl border overflow-hidden"
          style={{
            ...baseStyle,
            backgroundColor: `${customization.primaryColor}10`,
            borderColor: `${customization.primaryColor}30`,
            borderRadius: `${customization.borderRadius}px`,
            color: customization.textColor,
          }}
          animate={{ width: isCollapsed ? collapseWidth : sidebarWidth }}
          transition={{ duration: duration / 1000 }}
        >
          <div className="font-bold mb-4 pb-2 border-b flex items-center justify-between" style={{ borderColor: `${customization.primaryColor}30` }}>
            {!isCollapsed && <span>Navigation</span>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ marginLeft: isCollapsed ? 'auto' : 0, marginRight: isCollapsed ? 'auto' : 0 }}
            >
              <ChevronRight
                className="w-4 h-4 transition-transform"
                style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
              />
            </button>
          </div>
          {['Dashboard', 'Projects', 'Settings', 'Profile'].map((item, i) => (
            <div
              key={item}
              className="py-2 px-3 rounded-lg mb-1 cursor-pointer transition-all whitespace-nowrap overflow-hidden"
              style={{
                backgroundColor: i === 0 ? `${customization.primaryColor}30` : 'transparent',
                borderRadius: `${Number(customization.borderRadius) / 2}px`,
              }}
            >
              {isCollapsed ? item.charAt(0) : item}
            </div>
          ))}
        </motion.div>
        <div className="text-xs opacity-50" style={{ color: customization.textColor }}>
          <p>{sidebarWidth}px / {collapseWidth}px</p>
          <p className="mt-1">{duration}ms transition</p>
        </div>
      </div>
    );
  }

  // Cursor Follow Effect Preview
  if (component.id === 'cursor-follow') {
    const cursorSize = parseInt(customization.cursorSize) || 32;
    const trailLength = parseInt(customization.trailLength) || 5;
    const blendMode = customization.cursorBlendMode || 'normal';
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    return (
      <div
        ref={containerRef}
        className="w-full h-48 rounded-xl border flex items-center justify-center relative overflow-hidden cursor-none"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          color: customization.textColor,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Trail elements that follow cursor */}
        {isHovering && Array.from({ length: trailLength }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${cursorSize * (1 - i * 0.12)}px`,
              height: `${cursorSize * (1 - i * 0.12)}px`,
              background: `radial-gradient(circle, ${customization.primaryColor}${Math.round(80 - i * 12).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: `blur(${2 + i * 2}px)`,
              mixBlendMode: blendMode as any,
              left: mousePos.x,
              top: mousePos.y,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              left: mousePos.x,
              top: mousePos.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 500 - i * 80,
              damping: 30 + i * 5,
              mass: 0.5 + i * 0.1,
            }}
          />
        ))}
        <div className="relative z-10 text-center pointer-events-none">
          <p className="text-sm opacity-70">{isHovering ? 'Following your cursor!' : 'Hover here to see effect'}</p>
          <p className="text-xs opacity-50 mt-1">{cursorSize}px · {trailLength} trails · {blendMode}</p>
        </div>
      </div>
    );
  }

  // Parallax Scroll Preview
  if (component.id === 'parallax-scroll') {
    const parallaxSpeed = parseFloat(customization.parallaxSpeed) || 1;
    const layerCount = parseInt(customization.layerCount) || 3;
    const direction = customization.parallaxDirection || 'vertical';
    const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0.5, y: 0.5 });
    };

    return (
      <div
        ref={containerRef}
        className="w-full h-48 rounded-xl border relative overflow-hidden"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: layerCount }).map((_, layer) => {
          const depth = (layer + 1) * parallaxSpeed * 15;
          const xOffset = direction !== 'vertical' ? (mousePos.x - 0.5) * depth : 0;
          const yOffset = direction !== 'horizontal' ? (mousePos.y - 0.5) * depth : 0;

          return (
            <motion.div
              key={layer}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 1 - layer * (0.6 / layerCount) }}
              animate={{
                x: xOffset,
                y: yOffset,
              }}
              transition={{
                type: 'spring',
                stiffness: 150 - layer * 20,
                damping: 20 + layer * 5,
              }}
            >
              <div
                className="rounded-lg flex items-center justify-center font-mono text-xs"
                style={{
                  width: `${80 - layer * 15}px`,
                  height: `${80 - layer * 15}px`,
                  backgroundColor: `${customization.primaryColor}${Math.round(50 - layer * (35 / layerCount)).toString(16).padStart(2, '0')}`,
                  border: `1px solid ${customization.primaryColor}40`,
                  color: customization.textColor,
                }}
              >
                L{layer + 1}
              </div>
            </motion.div>
          );
        })}
        <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none" style={{ color: customization.textColor }}>
          <p className="text-xs opacity-50">{layerCount} layers · {parallaxSpeed}x · {direction} · Move mouse!</p>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div
      className="p-6 rounded-lg border text-center"
      style={{
        ...baseStyle,
        backgroundColor: `${customization.primaryColor}20`,
        borderColor: customization.primaryColor,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
      }}
    >
      <h3 className="text-xl font-bold mb-2">{component.name}</h3>
      <p className="opacity-80">Preview for this component type</p>
    </div>
  );
};

// Color presets
const colorPresets = {
  terminal: {
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    backgroundColor: '#0a0a0a',
    textColor: '#f0fdf4',
  },
  sunset: {
    primaryColor: '#f97316',
    secondaryColor: '#ec4899',
    backgroundColor: '#1c1917',
    textColor: '#fef3c7',
  },
  ocean: {
    primaryColor: '#0ea5e9',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#0c1929',
    textColor: '#e0f2fe',
  },
  forest: {
    primaryColor: '#22c55e',
    secondaryColor: '#84cc16',
    backgroundColor: '#14190f',
    textColor: '#ecfccb',
  },
};

// Component-specific options renderer
const ComponentSpecificOptions = ({
  component,
  customization,
  setCustomization
}: {
  component: any;
  customization: any;
  setCustomization: React.Dispatch<React.SetStateAction<any>>;
}) => {
  if (!component) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a component to see specific options</p>
      </div>
    );
  }

  const updateValue = (key: string, value: string) => {
    setCustomization((prev: any) => ({ ...prev, [key]: value }));
  };

  // Glass Card Options
  if (component.id === 'glass-card') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Box className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Glass Card Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Glass Opacity: {customization.glassOpacity}%</Label>
          <Slider
            value={[parseInt(customization.glassOpacity)]}
            onValueChange={(v) => updateValue('glassOpacity', v[0].toString())}
            min={5}
            max={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Background transparency level</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Blur Amount: {customization.blurAmount}px</Label>
          <Slider
            value={[parseInt(customization.blurAmount)]}
            onValueChange={(v) => updateValue('blurAmount', v[0].toString())}
            min={0}
            max={24}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Frosted glass blur intensity</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Border Opacity: {customization.glassBorderOpacity}%</Label>
          <Slider
            value={[parseInt(customization.glassBorderOpacity)]}
            onValueChange={(v) => updateValue('glassBorderOpacity', v[0].toString())}
            min={10}
            max={80}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Border visibility</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Shadow Intensity: {customization.shadowIntensity}%</Label>
          <Slider
            value={[parseInt(customization.shadowIntensity)]}
            onValueChange={(v) => updateValue('shadowIntensity', v[0].toString())}
            min={0}
            max={100}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Drop shadow strength</p>
        </div>
      </div>
    );
  }

  // Floating Card Options
  if (component.id === 'floating-card') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">3D Floating Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Float Height: {customization.floatHeight}px</Label>
          <Slider
            value={[parseInt(customization.floatHeight)]}
            onValueChange={(v) => updateValue('floatHeight', v[0].toString())}
            min={5}
            max={30}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Lift distance on hover</p>
        </div>
        <div>
          <Label className="text-xs font-mono">X Rotation: {customization.rotationX}°</Label>
          <Slider
            value={[parseInt(customization.rotationX)]}
            onValueChange={(v) => updateValue('rotationX', v[0].toString())}
            min={0}
            max={15}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Tilt on X axis</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Y Rotation: {customization.rotationY}°</Label>
          <Slider
            value={[parseInt(customization.rotationY)]}
            onValueChange={(v) => updateValue('rotationY', v[0].toString())}
            min={0}
            max={15}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Tilt on Y axis</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Animation Duration: {customization.duration}ms</Label>
          <Slider
            value={[parseInt(customization.duration)]}
            onValueChange={(v) => updateValue('duration', v[0].toString())}
            min={100}
            max={800}
            step={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Transition speed</p>
        </div>
      </div>
    );
  }

  // Neon Card Options
  if (component.id === 'neon-card') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Neon Glow Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Glow Intensity: {customization.glowIntensity}%</Label>
          <Slider
            value={[parseInt(customization.glowIntensity)]}
            onValueChange={(v) => updateValue('glowIntensity', v[0].toString())}
            min={20}
            max={100}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Brightness of the glow</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Glow Spread: {customization.glowSpread}px</Label>
          <Slider
            value={[parseInt(customization.glowSpread)]}
            onValueChange={(v) => updateValue('glowSpread', v[0].toString())}
            min={10}
            max={80}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">How far the glow extends</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Pulse Speed: {customization.pulseSpeed}s</Label>
          <Slider
            value={[parseFloat(customization.pulseSpeed) * 10]}
            onValueChange={(v) => updateValue('pulseSpeed', (v[0] / 10).toString())}
            min={5}
            max={40}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Animation cycle duration</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-mono">Enable Pulse</Label>
            <p className="text-xs text-muted-foreground">Animate the glow</p>
          </div>
          <Switch
            checked={customization.animations}
            onCheckedChange={(v) => setCustomization((prev: any) => ({ ...prev, animations: v }))}
          />
        </div>
      </div>
    );
  }

  // Gradient Button Options
  if (component.id === 'gradient-btn') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Gradient Button Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Gradient Angle: {customization.gradientAngle}°</Label>
          <Slider
            value={[parseInt(customization.gradientAngle)]}
            onValueChange={(v) => updateValue('gradientAngle', v[0].toString())}
            min={0}
            max={360}
            step={15}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Direction of gradient</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Hover Scale: {customization.hoverScale}x</Label>
          <Slider
            value={[parseFloat(customization.hoverScale) * 100]}
            onValueChange={(v) => updateValue('hoverScale', (v[0] / 100).toString())}
            min={100}
            max={120}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Scale factor on hover</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Shadow Intensity: {customization.shadowIntensity}%</Label>
          <Slider
            value={[parseInt(customization.shadowIntensity)]}
            onValueChange={(v) => updateValue('shadowIntensity', v[0].toString())}
            min={0}
            max={100}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Glow effect strength</p>
        </div>
      </div>
    );
  }

  // Neomorphic Button Options
  if (component.id === 'neo-btn') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Box className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Neomorphic Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Depth: {customization.neoDepth}px</Label>
          <Slider
            value={[parseInt(customization.neoDepth)]}
            onValueChange={(v) => updateValue('neoDepth', v[0].toString())}
            min={2}
            max={16}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Shadow offset distance</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Shadow Softness: {customization.softShadowIntensity}%</Label>
          <Slider
            value={[parseInt(customization.softShadowIntensity)]}
            onValueChange={(v) => updateValue('softShadowIntensity', v[0].toString())}
            min={10}
            max={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Blur of soft shadows</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Animation Duration: {customization.duration}ms</Label>
          <Slider
            value={[parseInt(customization.duration)]}
            onValueChange={(v) => updateValue('duration', v[0].toString())}
            min={100}
            max={500}
            step={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Press transition speed</p>
        </div>
      </div>
    );
  }

  // Particle Button Options
  if (component.id === 'particle-btn') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Particle Effect Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Particle Count: {customization.particleCount}</Label>
          <Slider
            value={[parseInt(customization.particleCount)]}
            onValueChange={(v) => updateValue('particleCount', v[0].toString())}
            min={5}
            max={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Number of particles</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Explosion Radius: {customization.explosionRadius}px</Label>
          <Slider
            value={[parseInt(customization.explosionRadius)]}
            onValueChange={(v) => updateValue('explosionRadius', v[0].toString())}
            min={20}
            max={100}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">How far particles spread</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Animation Duration: {customization.duration}ms</Label>
          <Slider
            value={[parseInt(customization.duration)]}
            onValueChange={(v) => updateValue('duration', v[0].toString())}
            min={200}
            max={1000}
            step={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Particle lifetime</p>
        </div>
      </div>
    );
  }

  // Animated Form Options
  if (component.id === 'animated-form') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Animated Form Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Field Stagger: {customization.fieldStagger}s</Label>
          <Slider
            value={[parseFloat(customization.fieldStagger) * 100]}
            onValueChange={(v) => updateValue('fieldStagger', (v[0] / 100).toString())}
            min={5}
            max={30}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Delay between field animations</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Animation Style</Label>
          <Select value={customization.animation} onValueChange={(v) => updateValue('animation', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smooth">Smooth Fade</SelectItem>
              <SelectItem value="bounce">Bounce In</SelectItem>
              <SelectItem value="spring">Spring Pop</SelectItem>
              <SelectItem value="slide">Slide Up</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">How fields animate in</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-mono">Input Focus Effects</Label>
            <p className="text-xs text-muted-foreground">Animate on focus</p>
          </div>
          <Switch
            checked={customization.animations}
            onCheckedChange={(v) => setCustomization((prev: any) => ({ ...prev, animations: v }))}
          />
        </div>
      </div>
    );
  }

  // Step Form Options
  if (component.id === 'step-form') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Multi-Step Form Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Number of Steps: {customization.stepCount}</Label>
          <Slider
            value={[parseInt(customization.stepCount)]}
            onValueChange={(v) => updateValue('stepCount', v[0].toString())}
            min={2}
            max={6}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Total form steps</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Progress Style</Label>
          <Select value={customization.progressStyle} onValueChange={(v) => updateValue('progressStyle', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="circles">Numbered Circles</SelectItem>
              <SelectItem value="bar">Progress Bar</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="breadcrumb">Breadcrumb</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">How progress is displayed</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Transition Duration: {customization.duration}ms</Label>
          <Slider
            value={[parseInt(customization.duration)]}
            onValueChange={(v) => updateValue('duration', v[0].toString())}
            min={200}
            max={600}
            step={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Step transition speed</p>
        </div>
      </div>
    );
  }

  // Floating Navigation Options
  if (component.id === 'floating-nav') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Box className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Floating Nav Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Position</Label>
          <Select value={customization.navPosition} onValueChange={(v) => updateValue('navPosition', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="left">Left Side</SelectItem>
              <SelectItem value="right">Right Side</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Where nav floats</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Item Spacing: {customization.navSpacing}rem</Label>
          <Slider
            value={[parseInt(customization.navSpacing)]}
            onValueChange={(v) => updateValue('navSpacing', v[0].toString())}
            min={2}
            max={10}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Gap between nav items</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Blur Amount: {customization.blurAmount}px</Label>
          <Slider
            value={[parseInt(customization.blurAmount)]}
            onValueChange={(v) => updateValue('blurAmount', v[0].toString())}
            min={0}
            max={20}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Backdrop blur intensity</p>
        </div>
      </div>
    );
  }

  // Sidebar Navigation Options
  if (component.id === 'sidebar-nav') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Box className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Sidebar Nav Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Expanded Width: {customization.sidebarWidth}px</Label>
          <Slider
            value={[parseInt(customization.sidebarWidth)]}
            onValueChange={(v) => updateValue('sidebarWidth', v[0].toString())}
            min={150}
            max={300}
            step={10}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Full sidebar width</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Collapsed Width: {customization.collapseWidth}px</Label>
          <Slider
            value={[parseInt(customization.collapseWidth)]}
            onValueChange={(v) => updateValue('collapseWidth', v[0].toString())}
            min={40}
            max={80}
            step={5}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Icon-only mode width</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Animation Duration: {customization.duration}ms</Label>
          <Slider
            value={[parseInt(customization.duration)]}
            onValueChange={(v) => updateValue('duration', v[0].toString())}
            min={150}
            max={500}
            step={50}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Collapse transition speed</p>
        </div>
      </div>
    );
  }

  // Cursor Follow Effect Options
  if (component.id === 'cursor-follow') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Cursor Effect Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Cursor Size: {customization.cursorSize}px</Label>
          <Slider
            value={[parseInt(customization.cursorSize)]}
            onValueChange={(v) => updateValue('cursorSize', v[0].toString())}
            min={16}
            max={64}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Size of the glow effect</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Trail Length: {customization.trailLength}</Label>
          <Slider
            value={[parseInt(customization.trailLength)]}
            onValueChange={(v) => updateValue('trailLength', v[0].toString())}
            min={1}
            max={10}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Number of trailing elements</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Blend Mode</Label>
          <Select value={customization.cursorBlendMode} onValueChange={(v) => updateValue('cursorBlendMode', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="screen">Screen</SelectItem>
              <SelectItem value="overlay">Overlay</SelectItem>
              <SelectItem value="color-dodge">Color Dodge</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">How colors blend</p>
        </div>
      </div>
    );
  }

  // Parallax Scroll Options
  if (component.id === 'parallax-scroll') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-medium">Parallax Scroll Options</span>
        </div>
        <div>
          <Label className="text-xs font-mono">Speed Multiplier: {customization.parallaxSpeed}x</Label>
          <Slider
            value={[parseFloat(customization.parallaxSpeed) * 10]}
            onValueChange={(v) => updateValue('parallaxSpeed', (v[0] / 10).toString())}
            min={5}
            max={30}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Relative scroll speed</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Layer Count: {customization.layerCount}</Label>
          <Slider
            value={[parseInt(customization.layerCount)]}
            onValueChange={(v) => updateValue('layerCount', v[0].toString())}
            min={2}
            max={5}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Number of parallax layers</p>
        </div>
        <div>
          <Label className="text-xs font-mono">Direction</Label>
          <Select value={customization.parallaxDirection} onValueChange={(v) => updateValue('parallaxDirection', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="both">Both Axes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Scroll direction</p>
        </div>
      </div>
    );
  }

  // Default fallback for any unhandled component
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">No specific options for this component</p>
      <p className="text-xs mt-1">Use the general customization tabs</p>
    </div>
  );
};

export default function ClaudeComponentStudio() {
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [customization, setCustomization] = useState({
    // Colors
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    backgroundColor: '#000000',
    textColor: '#ffffff',

    // Typography
    fontFamily: 'Inter',
    fontSize: '16',
    fontWeight: '400',

    // Spacing
    padding: '20',
    margin: '10',
    borderRadius: '8',

    // Effects
    animation: 'smooth',
    duration: '300',
    shadowIntensity: '50',
    blurAmount: '12',

    // Framework
    framework: 'react',
    typescript: true,
    styling: 'tailwind',

    // Features
    responsive: true,
    darkMode: true,
    accessibility: true,
    animations: true,

    // Component-specific options
    // Glass Card
    glassOpacity: '15',
    glassBorderOpacity: '40',

    // Floating Card
    floatHeight: '10',
    rotationX: '5',
    rotationY: '5',

    // Neon Card
    glowIntensity: '60',
    pulseSpeed: '2',
    glowSpread: '40',

    // Gradient Button
    gradientAngle: '135',
    hoverScale: '1.05',

    // Neomorphic Button
    neoDepth: '8',
    softShadowIntensity: '20',

    // Particle Button
    particleCount: '20',
    explosionRadius: '50',

    // Animated Form
    fieldStagger: '0.1',

    // Step Form
    stepCount: '3',
    progressStyle: 'circles',

    // Floating Nav
    navPosition: 'bottom',
    navSpacing: '6',

    // Sidebar Nav
    sidebarWidth: '200',
    collapseWidth: '60',

    // Cursor Follow
    trailLength: '5',
    cursorBlendMode: 'normal',
    cursorSize: '32',

    // Parallax Scroll
    parallaxSpeed: '1',
    layerCount: '3',
    parallaxDirection: 'vertical'
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const applyPreset = (presetName: keyof typeof colorPresets) => {
    const preset = colorPresets[presetName];
    setCustomization(prev => ({
      ...prev,
      ...preset,
    }));
    toast.success(`Applied ${presetName} preset`, {
      description: "Color scheme updated",
    });
  };

  const generateClaudePrompt = () => {
    if (!selectedComponent) {
      toast.error("No component selected", {
        description: "Please select a component to generate a prompt",
      });
      return;
    }

    const prompt = `Create a ${selectedComponent.name} component with the following specifications:

## Component Type
${selectedComponent.category}: ${selectedComponent.name}

## Framework & Setup
- Framework: ${frameworks[customization.framework as keyof typeof frameworks]}
- TypeScript: ${customization.typescript ? 'Yes' : 'No'}
- Styling: ${customization.styling === 'tailwind' ? 'Tailwind CSS' : customization.styling === 'css-modules' ? 'CSS Modules' : 'Styled Components'}

## Design Specifications
### Colors
- Primary: ${customization.primaryColor}
- Secondary: ${customization.secondaryColor}
- Background: ${customization.backgroundColor}
- Text: ${customization.textColor}

### Typography
- Font Family: ${customization.fontFamily}
- Base Font Size: ${customization.fontSize}px
- Font Weight: ${customization.fontWeight}

### Spacing & Layout
- Padding: ${customization.padding}px
- Margin: ${customization.margin}px
- Border Radius: ${customization.borderRadius}px

### Effects & Animations
- Animation Type: ${customization.animation}
- Duration: ${customization.duration}ms
- Shadow Intensity: ${customization.shadowIntensity}%
- Blur Amount: ${customization.blurAmount}px

## Features Required
${customization.responsive ? '✅ Fully responsive (mobile-first)' : ''}
${customization.darkMode ? '✅ Dark mode support' : ''}
${customization.accessibility ? '✅ WCAG AA accessibility' : ''}
${customization.animations ? '✅ Smooth animations on interaction' : ''}

## Additional Requirements
- Component should be reusable and accept props
- Include proper TypeScript types/interfaces
- Add helpful comments explaining complex logic
- Follow best practices for the chosen framework
- Include usage example

Please create this component with attention to detail and modern best practices.`;

    setGeneratedPrompt(prompt);
    setShowPrompt(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
    toast.success("Copied to clipboard!", {
      description: "Prompt is ready to paste into Claude",
    });
  };

  const sendToClaude = () => {
    // This would integrate with Claude API or open Claude with the prompt
    toast("Opening Claude...", {
      description: "Your prompt has been prepared",
    });
    // In real implementation, this would open Claude or use API
  };

  return (
    <main className="min-h-screen relative">
      <SpaceBackground speed={0.3} opacity={0.5} />

      {/* Header */}
      <div className="relative z-10 border-b border-border/40 glass-dark backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  Claude Component Studio
                </h1>
                <p className="text-sm text-muted-foreground">Visual builder → Perfect Claude prompts</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-mono">
                <Sparkles className="h-3 w-3 mr-1" />
                Beta
              </Badge>
              <Badge className="font-mono bg-gradient-to-r from-primary to-secondary text-white border-0">
                50+ Components
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Component Library Sidebar */}
          <div className="lg:col-span-3">
            <Card className="glass-dark border-glow sticky top-8">
              <CardHeader>
                <CardTitle className="font-mono text-lg">Component Library</CardTitle>
                <CardDescription>Select a component to customize</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {Object.entries(componentLibrary).map(([category, components]) => (
                      <div key={category}>
                        <h3 className="text-sm font-mono uppercase text-muted-foreground mb-3">
                          {category}
                        </h3>
                        <div className="space-y-2">
                          {components.map((component) => (
                            <motion.div
                              key={component.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <button
                                onClick={() => setSelectedComponent(component)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  selectedComponent?.id === component.id
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm">{component.name}</span>
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-6">
            <Card className="glass-dark border-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-mono text-xl">Customization</CardTitle>
                    <CardDescription>
                      {selectedComponent ? `Customizing: ${selectedComponent.name}` : 'Select a component to start'}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="component" className="space-y-6">
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <TabsList className="grid grid-cols-6 w-max md:w-auto">
                      <TabsTrigger value="component" className="text-xs sm:text-sm whitespace-nowrap">
                        <Settings className="w-3 h-3 mr-1" />
                        Tune
                      </TabsTrigger>
                      <TabsTrigger value="colors" className="text-xs sm:text-sm whitespace-nowrap">Colors</TabsTrigger>
                      <TabsTrigger value="typography" className="text-xs sm:text-sm whitespace-nowrap">Type</TabsTrigger>
                      <TabsTrigger value="spacing" className="text-xs sm:text-sm whitespace-nowrap">Space</TabsTrigger>
                      <TabsTrigger value="effects" className="text-xs sm:text-sm whitespace-nowrap">Effects</TabsTrigger>
                      <TabsTrigger value="framework" className="text-xs sm:text-sm whitespace-nowrap">Code</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="component" className="space-y-4">
                    <ComponentSpecificOptions
                      component={selectedComponent}
                      customization={customization}
                      setCustomization={setCustomization}
                    />
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-mono">Primary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={customization.primaryColor}
                            onChange={(e) => setCustomization({...customization, primaryColor: e.target.value})}
                            className="w-16 h-10"
                          />
                          <Input
                            value={customization.primaryColor}
                            onChange={(e) => setCustomization({...customization, primaryColor: e.target.value})}
                            className="font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-mono">Secondary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={customization.secondaryColor}
                            onChange={(e) => setCustomization({...customization, secondaryColor: e.target.value})}
                            className="w-16 h-10"
                          />
                          <Input
                            value={customization.secondaryColor}
                            onChange={(e) => setCustomization({...customization, secondaryColor: e.target.value})}
                            className="font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-mono">Background</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={customization.backgroundColor}
                            onChange={(e) => setCustomization({...customization, backgroundColor: e.target.value})}
                            className="w-16 h-10"
                          />
                          <Input
                            value={customization.backgroundColor}
                            onChange={(e) => setCustomization({...customization, backgroundColor: e.target.value})}
                            className="font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-mono">Text Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={customization.textColor}
                            onChange={(e) => setCustomization({...customization, textColor: e.target.value})}
                            className="w-16 h-10"
                          />
                          <Input
                            value={customization.textColor}
                            onChange={(e) => setCustomization({...customization, textColor: e.target.value})}
                            className="font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color Presets */}
                    <div>
                      <Label className="text-xs font-mono mb-2">Quick Presets</Label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => applyPreset('terminal')}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Terminal
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => applyPreset('sunset')}
                        >
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          Sunset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => applyPreset('ocean')}
                        >
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                          Ocean
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => applyPreset('forest')}
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Forest
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-4">
                    <div>
                      <Label className="text-xs font-mono">Font Family</Label>
                      <Select value={customization.fontFamily} onValueChange={(v) => setCustomization({...customization, fontFamily: v})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Font Size: {customization.fontSize}px</Label>
                      <Slider
                        value={[parseInt(customization.fontSize)]}
                        onValueChange={(v) => setCustomization({...customization, fontSize: v[0].toString()})}
                        min={12}
                        max={24}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Font Weight</Label>
                      <RadioGroup value={customization.fontWeight} onValueChange={(v) => setCustomization({...customization, fontWeight: v})}>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="300" id="light" />
                            <Label htmlFor="light" className="text-xs">Light</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="400" id="regular" />
                            <Label htmlFor="regular" className="text-xs">Regular</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="600" id="semibold" />
                            <Label htmlFor="semibold" className="text-xs">Semibold</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="700" id="bold" />
                            <Label htmlFor="bold" className="text-xs">Bold</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="spacing" className="space-y-4">
                    <div>
                      <Label className="text-xs font-mono">Padding: {customization.padding}px</Label>
                      <Slider
                        value={[parseInt(customization.padding)]}
                        onValueChange={(v) => setCustomization({...customization, padding: v[0].toString()})}
                        min={0}
                        max={60}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Margin: {customization.margin}px</Label>
                      <Slider
                        value={[parseInt(customization.margin)]}
                        onValueChange={(v) => setCustomization({...customization, margin: v[0].toString()})}
                        min={0}
                        max={40}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Border Radius: {customization.borderRadius}px</Label>
                      <Slider
                        value={[parseInt(customization.borderRadius)]}
                        onValueChange={(v) => setCustomization({...customization, borderRadius: v[0].toString()})}
                        min={0}
                        max={32}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="effects" className="space-y-4">
                    <div>
                      <Label className="text-xs font-mono">Animation Style</Label>
                      <Select value={customization.animation} onValueChange={(v) => setCustomization({...customization, animation: v})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="smooth">Smooth</SelectItem>
                          <SelectItem value="bounce">Bounce</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Duration: {customization.duration}ms</Label>
                      <Slider
                        value={[parseInt(customization.duration)]}
                        onValueChange={(v) => setCustomization({...customization, duration: v[0].toString()})}
                        min={100}
                        max={1000}
                        step={50}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Shadow Intensity: {customization.shadowIntensity}%</Label>
                      <Slider
                        value={[parseInt(customization.shadowIntensity)]}
                        onValueChange={(v) => setCustomization({...customization, shadowIntensity: v[0].toString()})}
                        min={0}
                        max={100}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Blur Amount: {customization.blurAmount}px</Label>
                      <Slider
                        value={[parseInt(customization.blurAmount)]}
                        onValueChange={(v) => setCustomization({...customization, blurAmount: v[0].toString()})}
                        min={0}
                        max={24}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="framework" className="space-y-4">
                    <div>
                      <Label className="text-xs font-mono">Framework</Label>
                      <Select value={customization.framework} onValueChange={(v) => setCustomization({...customization, framework: v})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(frameworks).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-mono">Styling Method</Label>
                      <RadioGroup value={customization.styling} onValueChange={(v) => setCustomization({...customization, styling: v})}>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tailwind" id="tailwind" />
                            <Label htmlFor="tailwind" className="text-xs">Tailwind CSS</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="css-modules" id="css-modules" />
                            <Label htmlFor="css-modules" className="text-xs">CSS Modules</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="styled-components" id="styled" />
                            <Label htmlFor="styled" className="text-xs">Styled Components</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="typescript" className="text-xs font-mono">TypeScript</Label>
                        <Switch
                          id="typescript"
                          checked={customization.typescript}
                          onCheckedChange={(v) => setCustomization({...customization, typescript: v})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="responsive" className="text-xs font-mono">Responsive</Label>
                        <Switch
                          id="responsive"
                          checked={customization.responsive}
                          onCheckedChange={(v) => setCustomization({...customization, responsive: v})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="darkmode" className="text-xs font-mono">Dark Mode</Label>
                        <Switch
                          id="darkmode"
                          checked={customization.darkMode}
                          onCheckedChange={(v) => setCustomization({...customization, darkMode: v})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="a11y" className="text-xs font-mono">Accessibility</Label>
                        <Switch
                          id="a11y"
                          checked={customization.accessibility}
                          onCheckedChange={(v) => setCustomization({...customization, accessibility: v})}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="glass-dark border-glow mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-mono">Live Preview</CardTitle>
                    <CardDescription>
                      {selectedComponent
                        ? `Previewing: ${selectedComponent.name}`
                        : 'Select a component to preview'}
                    </CardDescription>
                  </div>
                  {selectedComponent && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewKey(k => k + 1)}
                            className="gap-2"
                          >
                            <motion.div
                              key={previewKey}
                              animate={{ rotate: [0, -360] }}
                              transition={{ duration: 0.5 }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </motion.div>
                            Replay
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Replay component animation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[300px] rounded-lg border border-border/50 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: customization.backgroundColor,
                    padding: `${customization.padding}px`,
                  }}
                >
                  {selectedComponent ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedComponent.id}-${previewKey}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex items-center justify-center"
                      >
                        <ComponentPreview
                          component={selectedComponent}
                          customization={customization}
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="text-center">
                      <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-muted-foreground">Select a component to preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="lg:col-span-3">
            <Card className="glass-dark border-glow sticky top-8">
              <CardHeader>
                <CardTitle className="font-mono text-lg">Generate & Send</CardTitle>
                <CardDescription>Create your Claude prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generateClaudePrompt}
                  className="w-full gap-2"
                  size="lg"
                  disabled={!selectedComponent}
                >
                  <Wand2 className="h-5 w-5" />
                  Generate Claude Prompt
                </Button>

                {showPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <Textarea
                      value={generatedPrompt}
                      readOnly
                      className="font-mono text-xs h-48"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setShowPrompt(false)}
                      >
                        <X className="h-3 w-3" />
                        Close
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={copyToClipboard}
                      >
                        {copiedToClipboard ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                <Separator />

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Label className="text-xs font-mono">Quick Actions</Label>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Export Configuration
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Component
                  </Button>
                </div>

                {/* Stats */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Components</span>
                    <span className="font-mono">50+</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Frameworks</span>
                    <span className="font-mono">6</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Customizations</span>
                    <span className="font-mono">∞</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <Card className="glass-dark border-glow max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-mono font-bold">How It Works</h2>
              </div>
              <div className="grid md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-mono">1. Browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Select component</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-mono">2. Customize</p>
                  <p className="text-xs text-muted-foreground mt-1">Colors & settings</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-mono">3. Generate</p>
                  <p className="text-xs text-muted-foreground mt-1">Perfect prompt</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-mono">4. Send</p>
                  <p className="text-xs text-muted-foreground mt-1">To Claude</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}