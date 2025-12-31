'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Eye, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Customization } from '@/types/customization';

type CounterCardProps = {
  customization: Customization;
};

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (latest >= 1000000) {
      return `${(latest / 1000000).toFixed(1)}M`;
    }
    if (latest >= 1000) {
      return `${(latest / 1000).toFixed(1)}K`;
    }
    return Math.round(latest).toLocaleString();
  });

  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: 'easeOut',
    });

    const unsubscribe = rounded.on('change', (v) => {
      setDisplayValue(v);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, count, rounded]);

  return <span>{displayValue}</span>;
}

export function CounterCard({ customization }: CounterCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const counters = [
    {
      icon: Eye,
      label: 'Page Views',
      value: 2847593,
      suffix: '',
      color: customization.primaryColor,
      bgGradient: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.primaryColor}05)`,
    },
    {
      icon: ShoppingCart,
      label: 'Orders Today',
      value: 1429,
      suffix: '',
      color: customization.secondaryColor,
      bgGradient: `linear-gradient(135deg, ${customization.secondaryColor}20, ${customization.secondaryColor}05)`,
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: 48250,
      suffix: '',
      color: '#ef4444',
      bgGradient: 'linear-gradient(135deg, #ef444420, #ef444405)',
    },
    {
      icon: Share2,
      label: 'Shares',
      value: 12847,
      suffix: '',
      color: '#a855f7',
      bgGradient: 'linear-gradient(135deg, #a855f720, #a855f705)',
    },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <div className="grid grid-cols-2 gap-3">
        {counters.map((counter, index) => {
          const Icon = counter.icon;

          return (
            <motion.div
              key={counter.label}
              className="relative p-5 border overflow-hidden"
              style={{
                background: counter.bgGradient,
                borderColor: `${counter.color}30`,
                borderRadius: `${customization.borderRadius}px`,
                boxShadow: `0 4px 20px ${counter.color}${Math.round(shadowIntensity * 0.25).toString(16).padStart(2, '0')}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 8px 30px ${counter.color}${Math.round(shadowIntensity * 0.45).toString(16).padStart(2, '0')}`,
              }}
            >
              {/* Animated background circle */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${counter.color}30, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="mb-3"
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  <div
                    className="inline-flex p-2.5 rounded-xl"
                    style={{
                      backgroundColor: `${counter.color}20`,
                      boxShadow: `0 0 20px ${counter.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: counter.color }} />
                  </div>
                </motion.div>

                {/* Counter value */}
                <motion.div
                  className="text-3xl font-bold mb-1"
                  style={{ color: customization.textColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <AnimatedCounter value={counter.value} duration={2 + index * 0.3} />
                  {counter.suffix && (
                    <span className="text-lg ml-1" style={{ color: counter.color }}>
                      {counter.suffix}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <motion.p
                  className="text-sm"
                  style={{ color: `${customization.textColor}60` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  {counter.label}
                </motion.p>

                {/* Pulse indicator */}
                <motion.div
                  className="absolute top-4 right-4 flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: counter.color }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: counter.color }}
                  >
                    Live
                  </span>
                </motion.div>
              </div>

              {/* Decorative lines */}
              <svg
                className="absolute bottom-0 left-0 w-full h-12 opacity-10"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M0,24 Q60,12 120,24 T240,24"
                  fill="none"
                  stroke={counter.color}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: index * 0.1 + 0.6 }}
                />
              </svg>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        Animated counter cards with live indicators
      </p>
    </div>
  );
}
