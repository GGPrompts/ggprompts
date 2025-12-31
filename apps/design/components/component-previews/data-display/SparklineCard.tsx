'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Customization } from '@/types/customization';

type SparklineCardProps = {
  customization: Customization;
};

export function SparklineCard({ customization }: SparklineCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const cards = [
    {
      label: 'Revenue',
      value: '$48.2K',
      change: '+12.5%',
      isPositive: true,
      data: [25, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 92],
      color: customization.primaryColor,
    },
    {
      label: 'Users',
      value: '12,847',
      change: '-3.2%',
      isPositive: false,
      data: [80, 75, 70, 65, 72, 60, 58, 55, 52, 48, 45, 42],
      color: customization.secondaryColor,
    },
  ];

  const createSparklinePath = (data: number[], width: number, height: number) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    const points = data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / range) * height;
      return { x, y };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return { linePath, areaPath };
  };

  return (
    <div className="w-full max-w-md" style={baseStyle}>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, index) => {
          const { linePath, areaPath } = createSparklinePath(card.data, 120, 40);
          const TrendIcon = card.isPositive ? TrendingUp : TrendingDown;
          const ArrowIcon = card.isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <motion.div
              key={card.label}
              className="relative p-4 border overflow-hidden"
              style={{
                backgroundColor: `${customization.backgroundColor}${opacityHex}`,
                borderColor: `${card.color}30`,
                borderRadius: `${customization.borderRadius}px`,
                boxShadow: `0 4px 20px ${card.color}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 8px 30px ${card.color}${Math.round(shadowIntensity * 0.5).toString(16).padStart(2, '0')}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: `${customization.textColor}60` }}
                >
                  {card.label}
                </span>
                <motion.div
                  className="p-1 rounded"
                  style={{ backgroundColor: `${card.color}20` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <TrendIcon className="w-3 h-3" style={{ color: card.color }} />
                </motion.div>
              </div>

              {/* Value */}
              <motion.div
                className="text-2xl font-bold mb-1"
                style={{ color: customization.textColor }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 + 0.2 }}
              >
                {card.value}
              </motion.div>

              {/* Change indicator */}
              <div className="flex items-center gap-1 mb-3">
                <motion.div
                  className="flex items-center px-1.5 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: card.isPositive ? '#10b98115' : '#ef444415',
                    color: card.isPositive ? '#10b981' : '#ef4444',
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                >
                  <ArrowIcon className="w-3 h-3" />
                  {card.change}
                </motion.div>
                <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
                  vs last week
                </span>
              </div>

              {/* Sparkline */}
              <svg
                width="100%"
                height="40"
                viewBox="0 0 120 40"
                preserveAspectRatio="none"
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id={`sparkGradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={card.color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={card.color} stopOpacity="0" />
                  </linearGradient>
                  <filter id={`sparkGlow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Area fill */}
                <motion.path
                  d={areaPath}
                  fill={`url(#sparkGradient-${index})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                />

                {/* Line */}
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke={card.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#sparkGlow-${index})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                />

                {/* End dot */}
                <motion.circle
                  cx="120"
                  cy={40 - ((card.data[card.data.length - 1] - Math.min(...card.data)) / (Math.max(...card.data) - Math.min(...card.data) || 1)) * 40}
                  r="3"
                  fill={card.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 1.2, type: 'spring' }}
                />
              </svg>

              {/* Decorative glow */}
              <div
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20"
                style={{ backgroundColor: card.color }}
              />
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        Mini sparkline cards with trend indicators
      </p>
    </div>
  );
}
