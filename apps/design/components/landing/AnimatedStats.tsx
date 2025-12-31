'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Grid3X3, Code2, Sparkles, Infinity as InfinityIcon } from 'lucide-react';

// Animated counter hook
function useCountUp(end: number, duration: number = 2, start: number = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration, start]);

  return { count, ref };
}

// Mini bar chart component
function MiniBarChart() {
  const bars = [40, 60, 35, 80, 55, 70, 45, 90, 65, 75];

  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-1.5 rounded-t bg-gradient-to-t from-emerald-500 to-cyan-400"
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  );
}

// Mini donut chart component
function MiniDonutChart() {
  const segments = [
    { color: '#10b981', percentage: 25 },
    { color: '#06b6d4', percentage: 20 },
    { color: '#8b5cf6', percentage: 18 },
    { color: '#f97316', percentage: 15 },
    { color: '#f43f5e', percentage: 12 },
    { color: '#84cc16', percentage: 10 },
  ];

  let cumulativePercentage = 0;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="rotate-[-90deg]">
      {segments.map((segment, index) => {
        const circumference = 2 * Math.PI * 12;
        const offset = (cumulativePercentage / 100) * circumference;
        const length = (segment.percentage / 100) * circumference;
        cumulativePercentage += segment.percentage;

        return (
          <motion.circle
            key={index}
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke={segment.color}
            strokeWidth="6"
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
          />
        );
      })}
    </svg>
  );
}

// Mini sparkline component
function MiniSparkline() {
  const points = [20, 35, 15, 45, 30, 60, 40, 55, 70, 50, 80, 65, 90];
  const width = 80;
  const height = 24;
  const maxVal = Math.max(...points);
  const minVal = Math.min(...points);

  const pathData = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point - minVal) / (maxVal - minVal)) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <motion.path
        d={pathData}
        fill="none"
        stroke="url(#sparkline-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        viewport={{ once: true }}
      />
    </svg>
  );
}

// AI icon grid
function AIIconGrid() {
  const icons = ['C', 'G', 'Cu', 'Wi', 'Co', 'Cd'];

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {icons.map((icon, index) => (
        <motion.div
          key={icon}
          className="w-4 h-4 rounded bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-[8px] font-bold text-white/80"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}

// Animated infinity symbol
function AnimatedInfinity() {
  return (
    <motion.div
      className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto]"
      animate={{
        backgroundPosition: ['0% center', '200% center'],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      }}
    >
      <InfinityIcon className="w-8 h-8 stroke-current" strokeWidth={2.5} />
    </motion.div>
  );
}

// Stat card component
type StatCardProps = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  visual: React.ReactNode;
  delay?: number;
};

function StatCard({ icon, value, label, visual, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-colors group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
          {icon}
        </div>
        <div className="opacity-60 group-hover:opacity-100 transition-opacity">{visual}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}

export function AnimatedStats() {
  const components = useCountUp(94, 2);
  const categories = useCountUp(16, 1.5);
  const linesOfCode = useCountUp(23, 2.5);
  const aiFormats = useCountUp(6, 1);

  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Built for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Scale
            </span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            A comprehensive component library designed to help you create perfect AI prompts
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          <StatCard
            icon={<Layers className="w-5 h-5 text-emerald-400" />}
            value={
              <span ref={components.ref}>
                {components.count}
                <span className="text-emerald-400">+</span>
              </span>
            }
            label="Components"
            visual={<MiniBarChart />}
            delay={0}
          />

          <StatCard
            icon={<Grid3X3 className="w-5 h-5 text-cyan-400" />}
            value={<span ref={categories.ref}>{categories.count}</span>}
            label="Categories"
            visual={<MiniDonutChart />}
            delay={0.1}
          />

          <StatCard
            icon={<Code2 className="w-5 h-5 text-purple-400" />}
            value={
              <span ref={linesOfCode.ref}>
                {linesOfCode.count}
                <span className="text-purple-400">K+</span>
              </span>
            }
            label="Lines of Code"
            visual={<MiniSparkline />}
            delay={0.2}
          />

          <StatCard
            icon={<Sparkles className="w-5 h-5 text-pink-400" />}
            value={<span ref={aiFormats.ref}>{aiFormats.count}</span>}
            label="AI Formats"
            visual={<AIIconGrid />}
            delay={0.3}
          />

          <div className="col-span-2 sm:col-span-1">
            <StatCard
              icon={<InfinityIcon className="w-5 h-5 text-amber-400" />}
              value={<AnimatedInfinity />}
              label="Possibilities"
              visual={
                <motion.div
                  className="flex gap-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-amber-400"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              }
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
