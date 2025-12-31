'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Linkedin, Mail, Terminal, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ContactSection() {
  const contactMethods = [
    {
      icon: Github,
      label: 'GitHub',
      value: 'GGPrompts',
      href: 'https://github.com/GGPrompts',
      description: '45+ open source projects',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'ggprompts@gmail.com',
      href: 'mailto:ggprompts@gmail.com',
      description: 'Get in touch directly',
    },
    {
      icon: Terminal,
      label: 'GGPrompts',
      value: 'Matrix Prompt Sharing',
      href: 'https://github.com/GGPrompts/GGPrompts',
      description: 'Prompt sharing platform',
    },
  ];

  return (
    <section id="contact" className="container mx-auto px-4 py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-mono font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text terminal-glow">
            Let's Connect
          </span>
        </h2>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Interested in AI-assisted development, terminal tools, or collaboration?
          <br />
          Reach out through any of these channels.
        </p>
      </motion.div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        {contactMethods.map((method, i) => (
          <motion.div
            key={method.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link href={method.href} target="_blank" rel="noopener noreferrer">
              <Card className="glass border-white/10 h-full group hover:border-primary/30 transition-all duration-300 hover:scale-105">
                <div className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 glass-dark rounded-full group-hover:border-glow">
                      <method.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-mono font-bold text-foreground mb-2">
                    {method.label}
                  </h3>
                  <p className="text-sm text-primary font-mono mb-2">
                    {method.value}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {method.description}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Terminal Resume CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="glass border-primary/20 overflow-hidden">
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <Terminal className="w-12 h-12 text-emerald-400 terminal-glow" />
            </div>
            <h3 className="text-2xl font-mono font-bold text-foreground mb-3">
              Want a Unique Experience?
            </h3>
            <p className="text-foreground/70 mb-6">
              Try the <span className="text-primary font-mono">interactive terminal resume</span> —
              a fully functional CLI with 20+ commands. Type <code className="px-2 py-1 glass-dark rounded text-sm">help</code> to get started.
            </p>
            <Link href="/templates/resume-terminal">
              <button className="px-8 py-4 glass-dark rounded-lg hover:scale-105 transition-all border-glow font-mono text-lg inline-flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Launch Terminal Resume
              </button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Philosophy Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 text-center"
      >
        <blockquote className="text-2xl md:text-3xl font-mono italic text-foreground/60 max-w-3xl mx-auto">
          "AI doesn't replace developers—it creates them"
        </blockquote>
        <p className="mt-4 text-sm font-mono text-foreground/40">
          — Full Stack Prompt Engineer Philosophy
        </p>
      </motion.div>
    </section>
  );
}
