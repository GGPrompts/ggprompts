'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Palette,
  Layers,
  Wand2,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { HeroShowcase, AnimatedStats } from '@/components/landing';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white overflow-hidden">
      {/* Animated background effects - neon dark theme */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />

        {/* Neon glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-emerald-400/5 rounded-full blur-[80px] animate-pulse delay-500" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-xl">design2prompt</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/studio"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Studio
            </Link>
            <Link
              href="/collections"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/canvas"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Canvas
            </Link>
            <Link
              href="/studio"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="px-6 pt-12 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-6">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Visual Component Builder for AI</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                  Design Components.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Generate Perfect Prompts.
                  </span>
                </h1>

                <p className="text-lg text-gray-400 max-w-xl mb-8">
                  Visually customize UI components and generate detailed prompts for
                  Claude, GPT, Cursor, and any AI coding assistant.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/studio"
                    className="group flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all"
                  >
                    Open Studio
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/collections"
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                  >
                    View Collections
                  </Link>
                </div>
              </motion.div>

              {/* Right side - Component showcase */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <HeroShowcase />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Animated Stats Section */}
        <AnimatedStats />

        {/* Features */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              From Design to AI Prompt in Seconds
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Palette className="w-6 h-6" />}
                title="Browse & Customize"
                description="94+ customizable components across 16 categories: cards, buttons, forms, navigation, and more."
                color="emerald"
              />
              <FeatureCard
                icon={<Eye className="w-6 h-6" />}
                title="Live Preview"
                description="See your changes in real-time with interactive previews and animations."
                color="cyan"
              />
              <FeatureCard
                icon={<Layers className="w-6 h-6" />}
                title="Canvas Mode"
                description="Drag and drop components on a visual canvas to design full page layouts."
                color="purple"
              />
              <FeatureCard
                icon={<Wand2 className="w-6 h-6" />}
                title="Export to AI"
                description="Generate detailed prompts for Claude, GPT, Cursor, and other AI assistants."
                color="emerald"
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-20 bg-emerald-950/10 border-y border-emerald-500/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

            <div className="grid md:grid-cols-4 gap-6">
              <StepCard
                number="1"
                title="Browse"
                description="Choose from our component library"
              />
              <StepCard
                number="2"
                title="Customize"
                description="Adjust colors, effects, and styling"
              />
              <StepCard
                number="3"
                title="Preview"
                description="See live updates instantly"
              />
              <StepCard
                number="4"
                title="Export"
                description="Copy your AI-ready prompt"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-32 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
            Start creating perfect AI prompts for your UI components today.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-5 h-5" />
            Open Studio
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-emerald-500/10">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>design2prompt</span>
            </div>
            <div className="flex items-center gap-4">
              <span>94+ Components</span>
              <span>·</span>
              <span>16 Categories</span>
              <span>·</span>
              <span>6 AI Targets</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'emerald' | 'cyan' | 'purple';
}) {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
