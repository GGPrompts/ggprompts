'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, Users, Zap, Globe } from 'lucide-react';
import { Customization } from '@/types/customization';

type StatsCounterProps = {
  customization: Customization;
};

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsCounter({ customization }: StatsCounterProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const stats = [
    { icon: Users, value: 50000, suffix: '+', label: 'Active Users', trend: '+12%' },
    { icon: Zap, value: 1000000, suffix: '+', label: 'API Requests/Day', trend: '+45%' },
    { icon: Globe, value: 150, suffix: '+', label: 'Countries', trend: '+8%' },
    { icon: TrendingUp, value: 99.9, suffix: '%', label: 'Uptime', trend: 'Stable' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-6 overflow-hidden"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.backgroundColor}, ${customization.backgroundColor}dd)`,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}25`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${customization.primaryColor}${opacityToHex(glassOpacity * 2.6)}, transparent 50%),
                        radial-gradient(circle at 80% 50%, ${customization.secondaryColor}${opacityToHex(glassOpacity * 2.6)}, transparent 50%)`,
          }}
          animate={{
            opacity: [glassOpacity / 100 * 0.3, glassOpacity / 100 * 1, glassOpacity / 100 * 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Stats grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="relative p-4 rounded-xl overflow-hidden group cursor-pointer"
                style={{
                  backgroundColor: `${customization.primaryColor}08`,
                  border: `1px solid ${customization.primaryColor}15`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.1 + index * 0.15,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: `${customization.primaryColor}15`,
                  borderColor: `${customization.primaryColor}40`,
                  boxShadow: `0 12px 30px ${customization.primaryColor}20`,
                }}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at center, ${customization.primaryColor}20, transparent 70%)`,
                  }}
                />

                {/* Icon and trend */}
                <div className="flex items-center justify-between mb-3">
                  <motion.div
                    className="p-2 rounded-lg"
                    style={{
                      background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: customization.primaryColor }} />
                  </motion.div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: stat.trend.includes('+')
                        ? '#10b98120'
                        : `${customization.primaryColor}15`,
                      color: stat.trend.includes('+') ? '#10b981' : customization.primaryColor,
                    }}
                  >
                    {stat.trend}
                  </span>
                </div>

                {/* Value */}
                <motion.div
                  className="text-2xl font-bold mb-1"
                  style={{
                    background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </motion.div>

                {/* Label */}
                <p
                  className="text-xs"
                  style={{ color: `${customization.textColor}60` }}
                >
                  {stat.label}
                </p>

                {/* Animated progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{
                    background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  }}
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom text */}
        <motion.p
          className="text-center text-xs mt-5"
          style={{ color: `${customization.textColor}40` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Real-time metrics updated every minute
        </motion.p>
      </motion.div>
    </div>
  );
}
