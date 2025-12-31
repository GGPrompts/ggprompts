'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type MetricTileProps = {
  customization: Customization;
};

export function MetricTile({ customization }: MetricTileProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const metrics = [
    { label: 'CPU', value: 67, color: customization.primaryColor },
    { label: 'Memory', value: 82, color: customization.secondaryColor },
    { label: 'Disk', value: 45, color: '#8b5cf6' },
  ];

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="p-5 border"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityHex}`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: customization.textColor }}>
            System Status
          </h3>
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#10b981' }}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm" style={{ color: `${customization.textColor}80` }}>
                  {metric.label}
                </span>
                <span className="text-sm font-medium" style={{ color: metric.color }}>
                  {metric.value}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${customization.textColor}15` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${metric.color}, ${metric.color}80)`,
                    boxShadow: `0 0 10px ${metric.color}50`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mini sparkline */}
        <div className="mt-5 pt-4 border-t" style={{ borderColor: `${customization.primaryColor}15` }}>
          <div className="flex items-end justify-between h-12 gap-1">
            {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 70, 80].map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  background: `linear-gradient(180deg, ${customization.primaryColor}, ${customization.primaryColor}40)`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: `${customization.textColor}50` }}>
            Activity (last 24h)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
