'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from './ui/GlassCard';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <GlassCard variant="dark" hover3d className="text-center">
          <motion.h1
            className="text-6xl md:text-8xl font-mono font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text terminal-glow"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Matt&apos;s Portfolio
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-foreground/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Building modern web experiences and elegant terminal interfaces
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/templates">
              <button className="px-6 py-3 glass rounded-lg hover:scale-105 transition-transform border-glow hover:border-glow">
                View Projects
              </button>
            </Link>
            <button className="px-6 py-3 glass-dark rounded-lg hover:scale-105 transition-transform border-glow hover:border-glow text-foreground">
              Get in Touch
            </button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
