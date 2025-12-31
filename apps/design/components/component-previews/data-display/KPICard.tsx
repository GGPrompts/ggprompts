'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Zap, Clock, Users } from 'lucide-react';
import { Customization } from '@/types/customization';

type KPICardProps = {
  customization: Customization;
};

export function KPICard({ customization }: KPICardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const kpis = [
    {
      icon: Target,
      label: 'Conversion Rate',
      value: '3.24%',
      target: '4.00%',
      progress: 81,
      change: '+0.42%',
      isPositive: true,
      color: customization.primaryColor,
    },
    {
      icon: Zap,
      label: 'Response Time',
      value: '142ms',
      target: '200ms',
      progress: 129,
      change: '-18ms',
      isPositive: true,
      color: '#10b981',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '8,429',
      target: '10,000',
      progress: 84,
      change: '+12.4%',
      isPositive: true,
      color: customization.secondaryColor,
    },
    {
      icon: Clock,
      label: 'Avg. Session',
      value: '4m 32s',
      target: '5m 00s',
      progress: 91,
      change: '-8s',
      isPositive: false,
      color: '#f59e0b',
    },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown;
          const progressCapped = Math.min(kpi.progress, 100);

          return (
            <motion.div
              key={kpi.label}
              className="relative p-4 border overflow-hidden"
              style={{
                backgroundColor: `${customization.backgroundColor}${opacityHex}`,
                borderColor: `${kpi.color}30`,
                borderRadius: `${customization.borderRadius}px`,
                boxShadow: `0 4px 20px ${kpi.color}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 8px 30px ${kpi.color}${Math.round(shadowIntensity * 0.5).toString(16).padStart(2, '0')}`,
              }}
            >
              {/* Background glow */}
              <div
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20"
                style={{ backgroundColor: kpi.color }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <motion.div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${kpi.color}20` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: kpi.isPositive ? '#10b98115' : '#ef444415',
                      color: kpi.isPositive ? '#10b981' : '#ef4444',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {kpi.change}
                  </motion.div>
                </div>

                {/* Label */}
                <p className="text-xs mb-1" style={{ color: `${customization.textColor}60` }}>
                  {kpi.label}
                </p>

                {/* Value */}
                <motion.p
                  className="text-2xl font-bold mb-2"
                  style={{ color: customization.textColor }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.15 }}
                >
                  {kpi.value}
                </motion.p>

                {/* Progress bar */}
                <div className="mb-2">
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${customization.textColor}15` }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}80)`,
                        boxShadow: `0 0 10px ${kpi.color}50`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressCapped}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Target info */}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
                    Target: {kpi.target}
                  </span>
                  <motion.span
                    className="text-xs font-medium"
                    style={{
                      color: kpi.progress >= 100 ? '#10b981' : kpi.color,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    {kpi.progress >= 100 ? 'Exceeded!' : `${kpi.progress}%`}
                  </motion.span>
                </div>
              </div>

              {/* Decorative corner */}
              <motion.div
                className="absolute bottom-0 right-0 w-16 h-16 opacity-10"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${kpi.color} 50%)`,
                  borderRadius: `0 0 ${customization.borderRadius}px 0`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              />
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        KPI cards with targets and progress tracking
      </p>
    </div>
  );
}
