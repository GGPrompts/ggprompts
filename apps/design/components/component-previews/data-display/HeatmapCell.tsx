'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type HeatmapCellProps = {
  customization: Customization;
};

export function HeatmapCell({ customization }: HeatmapCellProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Sample heatmap data - activity by day and hour
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['6a', '9a', '12p', '3p', '6p', '9p'];

  // Generate sample data matrix
  const data = days.map((_, dayIndex) =>
    hours.map((_, hourIndex) => {
      // Create varying intensity patterns
      const baseValue = Math.sin(dayIndex * 0.8 + hourIndex * 0.5) * 0.5 + 0.5;
      const noise = Math.random() * 0.3;
      return Math.min(1, Math.max(0, baseValue + noise));
    })
  );

  // Color interpolation based on customization colors
  const getColor = (intensity: number) => {
    // From low (secondary) to high (primary) color
    const lowColor = customization.secondaryColor;
    const highColor = customization.primaryColor;

    // Parse hex colors
    const parseHex = (hex: string) => {
      const clean = hex.replace('#', '');
      return {
        r: parseInt(clean.substr(0, 2), 16),
        g: parseInt(clean.substr(2, 2), 16),
        b: parseInt(clean.substr(4, 2), 16),
      };
    };

    const low = parseHex(lowColor);
    const high = parseHex(highColor);

    // Interpolate
    const r = Math.round(low.r + (high.r - low.r) * intensity);
    const g = Math.round(low.g + (high.g - low.g) * intensity);
    const b = Math.round(low.b + (high.b - low.b) * intensity);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getOpacity = (intensity: number) => {
    return 0.2 + intensity * 0.8;
  };

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
              Activity Heatmap
            </h3>
            <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}60` }}>
              Engagement by time and day
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: `${customization.textColor}50` }}>Low</span>
            <div className="flex gap-0.5">
              {[0.2, 0.4, 0.6, 0.8, 1].map((level, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: getColor(level),
                    opacity: getOpacity(level),
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: `${customization.textColor}50` }}>High</span>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="flex">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-around pr-2" style={{ height: 7 * 28 }}>
            {days.map((day, index) => (
              <motion.span
                key={day}
                className="text-xs h-6 flex items-center"
                style={{ color: `${customization.textColor}60` }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {day}
              </motion.span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            {/* X-axis labels */}
            <div className="flex justify-around mb-2">
              {hours.map((hour, index) => (
                <motion.span
                  key={hour}
                  className="text-xs text-center flex-1"
                  style={{ color: `${customization.textColor}60` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {hour}
                </motion.span>
              ))}
            </div>

            {/* Cells */}
            <div className="grid gap-1">
              {data.map((row, dayIndex) => (
                <div key={dayIndex} className="flex gap-1">
                  {row.map((value, hourIndex) => (
                    <motion.div
                      key={hourIndex}
                      className="flex-1 h-6 rounded cursor-pointer relative group"
                      style={{
                        backgroundColor: getColor(value),
                        opacity: getOpacity(value),
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: getOpacity(value) }}
                      transition={{
                        delay: (dayIndex * hours.length + hourIndex) * 0.015,
                        type: 'spring',
                        stiffness: 300,
                      }}
                      whileHover={{
                        scale: 1.15,
                        zIndex: 10,
                        boxShadow: `0 0 12px ${getColor(value)}`,
                      }}
                    >
                      {/* Tooltip */}
                      <motion.div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20"
                        style={{
                          backgroundColor: customization.backgroundColor,
                          border: `1px solid ${customization.primaryColor}40`,
                          color: customization.textColor,
                        }}
                        initial={false}
                      >
                        {Math.round(value * 100)}% activity
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <motion.div
          className="flex items-center justify-between mt-4 pt-4 border-t"
          style={{ borderColor: `${customization.primaryColor}15` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                Peak Time
              </p>
              <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
                Thu 3pm
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                Avg. Activity
              </p>
              <p className="text-sm font-medium" style={{ color: customization.textColor }}>
                67%
              </p>
            </div>
          </div>
          <motion.div
            className="px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: `${customization.primaryColor}20`,
              color: customization.primaryColor,
            }}
            whileHover={{ scale: 1.05 }}
          >
            View Details
          </motion.div>
        </motion.div>

        <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
          Color-coded heatmap cells for data visualization
        </p>
      </motion.div>
    </div>
  );
}
