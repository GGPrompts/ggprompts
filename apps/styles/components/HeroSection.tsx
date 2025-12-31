'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { hero } from '@/lib/portfolio-data';
import { Terminal, Github, Linkedin, Mail } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Terminal Velocity Background Art */}
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/art/terminal_velocity_hero.png"
          alt="Terminal Velocity"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Name Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border-glow"
          >
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-foreground/80">
              SYSTEM.MATT_M | PROMPT.ENGINEER
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text terminal-glow">
              {hero.tagline}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Link href="#projects">
              <button className="px-8 py-4 glass rounded-lg hover:scale-105 transition-all border-glow font-mono text-lg">
                View Projects
              </button>
            </Link>
            <Link href="#contact">
              <button className="px-8 py-4 glass-dark rounded-lg hover:scale-105 transition-all border-glow font-mono text-lg">
                Get in Touch
              </button>
            </Link>
            <Link href="https://github.com/GGPrompts" target="_blank" rel="noopener noreferrer">
              <button className="px-8 py-4 glass-dark rounded-lg hover:scale-105 transition-all font-mono text-lg flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: 'Projects', value: '45+' },
              { label: 'GitHub Stars', value: '140+' },
              { label: 'Time to Launch', value: '6 Months' },
              { label: 'Token Reduction', value: '43.7%' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="glass-dark rounded-lg p-4 border-glow"
              >
                <div className="text-2xl md:text-3xl font-mono font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-foreground/60 font-mono">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-foreground/40 text-sm font-mono"
        >
          ↓ scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
