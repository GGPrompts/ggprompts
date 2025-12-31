'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type BarChartProps = {
  customization: Customization;
};

export function BarChart({ customization }: BarChartProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const data = [
    { label: 'Mon', value: 65, previous: 55 },
    { label: 'Tue', value: 85, previous: 70 },
    { label: 'Wed', value: 55, previous: 60 },
    { label: 'Thu', value: 95, previous: 80 },
    { label: 'Fri', value: 75, previous: 65 },
    { label: 'Sat', value: 45, previous: 40 },
    { label: 'Sun', value: 35, previous: 30 },
  ];

  const maxValue = 100;
  const barWidth = 28;
  const barGap = 8;
  const chartHeight = 140;

  return (
    <div className="w-full max-w-md" style={baseStyle}>
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
              Weekly Sales
            </h3>
            <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}60` }}>
              Current vs Previous Week
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded"
                style={{ backgroundColor: customization.primaryColor }}
              />
              <span className="text-xs" style={{ color: `${customization.textColor}70` }}>
                Current
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded"
                style={{ backgroundColor: `${customization.secondaryColor}60` }}
              />
              <span className="text-xs" style={{ color: `${customization.textColor}70` }}>
                Previous
              </span>
            </div>
          </div>
        </div>

        {/* Chart container */}
        <div className="relative" style={{ height: chartHeight + 40 }}>
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ height: chartHeight }}>
            {[0, 25, 50, 75, 100].map((value) => (
              <div
                key={value}
                className="absolute w-full border-b"
                style={{
                  bottom: `${(value / maxValue) * 100}%`,
                  borderColor: `${customization.textColor}10`,
                }}
              >
                <span
                  className="absolute -left-1 text-xs -translate-y-1/2"
                  style={{ color: `${customization.textColor}40` }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute bottom-8 left-6 right-0 flex items-end justify-around" style={{ height: chartHeight }}>
            {data.map((item, index) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="flex items-end gap-1" style={{ height: chartHeight }}>
                  {/* Previous bar */}
                  <motion.div
                    className="rounded-t relative overflow-hidden"
                    style={{
                      width: barWidth / 2,
                      backgroundColor: `${customization.secondaryColor}30`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.previous / maxValue) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                    whileHover={{ backgroundColor: `${customization.secondaryColor}50` }}
                  />

                  {/* Current bar */}
                  <motion.div
                    className="rounded-t relative overflow-hidden"
                    style={{
                      width: barWidth / 2,
                      background: `linear-gradient(180deg, ${customization.primaryColor}, ${customization.primaryColor}90)`,
                      boxShadow: `0 0 12px ${customization.primaryColor}40`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08 + 0.1, ease: 'easeOut' }}
                    whileHover={{
                      boxShadow: `0 0 20px ${customization.primaryColor}60`,
                      scale: 1.05,
                    }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                      }}
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1 + 0.8,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  </motion.div>
                </div>

                {/* Label */}
                <motion.span
                  className="text-xs"
                  style={{ color: `${customization.textColor}60` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  {item.label}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div
          className="flex items-center justify-between pt-3 mt-2 border-t"
          style={{ borderColor: `${customization.primaryColor}15` }}
        >
          <div className="flex items-center gap-2">
            <motion.span
              className="text-lg font-bold"
              style={{ color: customization.primaryColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              +18.5%
            </motion.span>
            <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
              vs last week
            </span>
          </div>
          <motion.div
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${customization.primaryColor}20`,
              color: customization.primaryColor,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            Good progress
          </motion.div>
        </div>

        <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
          Animated bar chart with comparison data
        </p>
      </motion.div>
    </div>
  );
}
