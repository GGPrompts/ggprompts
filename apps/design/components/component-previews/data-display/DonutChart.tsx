'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type DonutChartProps = {
  customization: Customization;
};

export function DonutChart({ customization }: DonutChartProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const data = [
    { label: 'Desktop', value: 45, color: customization.primaryColor },
    { label: 'Mobile', value: 32, color: customization.secondaryColor },
    { label: 'Tablet', value: 18, color: '#a855f7' },
    { label: 'Other', value: 5, color: '#f59e0b' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate cumulative offsets for each segment
  let cumulativeOffset = 0;
  const segments = data.map((item) => {
    const segmentLength = (item.value / total) * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += segmentLength;
    return {
      ...item,
      offset,
      length: segmentLength,
      percentage: Math.round((item.value / total) * 100),
    };
  });

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="p-5 border overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityHex}`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: customization.textColor }}>
              Traffic Sources
            </h3>
            <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}60` }}>
              Device breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Donut Chart */}
          <div className="relative">
            <svg
              width={size}
              height={size}
              className="transform -rotate-90"
            >
              <defs>
                {segments.map((segment, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`donutGradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={segment.color} stopOpacity="0.7" />
                  </linearGradient>
                ))}
                <filter id="donutShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Background circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={`${customization.textColor}10`}
                strokeWidth={strokeWidth}
              />

              {/* Segments */}
              {segments.map((segment, index) => (
                <motion.circle
                  key={segment.label}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={`url(#donutGradient-${index})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${segment.length} ${circumference}`}
                  filter="url(#donutShadow)"
                  style={{
                    transform: `rotate(${(segment.offset / circumference) * 360}deg)`,
                    transformOrigin: 'center',
                  }}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - segment.length }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </svg>

            {/* Center content */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: customization.textColor }}
              >
                {total}K
              </span>
              <span
                className="text-xs"
                style={{ color: `${customization.textColor}60` }}
              >
                Total Visits
              </span>
            </motion.div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {segments.map((segment, index) => (
              <motion.div
                key={segment.label}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: segment.color,
                      boxShadow: `0 0 8px ${segment.color}50`,
                    }}
                    whileHover={{ scale: 1.3 }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: `${customization.textColor}80` }}
                  >
                    {segment.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: customization.textColor }}
                  >
                    {segment.percentage}%
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: `${customization.textColor}50` }}
                  >
                    ({segment.value}K)
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs opacity-50 text-center mt-4" style={{ color: customization.textColor }}>
          Animated donut chart with center label
        </p>
      </motion.div>
    </div>
  );
}
