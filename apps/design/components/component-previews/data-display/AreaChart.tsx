'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type AreaChartProps = {
  customization: Customization;
};

export function AreaChart({ customization }: AreaChartProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Sample data points for the chart
  const dataPoints = [
    { x: 0, y: 30 },
    { x: 1, y: 45 },
    { x: 2, y: 35 },
    { x: 3, y: 65 },
    { x: 4, y: 55 },
    { x: 5, y: 75 },
    { x: 6, y: 60 },
    { x: 7, y: 85 },
    { x: 8, y: 70 },
    { x: 9, y: 90 },
    { x: 10, y: 80 },
    { x: 11, y: 95 },
  ];

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const width = 340;
  const height = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxY = 100;
  const minY = 0;

  // Scale functions
  const scaleX = (x: number) => (x / (dataPoints.length - 1)) * chartWidth + padding.left;
  const scaleY = (y: number) => chartHeight - ((y - minY) / (maxY - minY)) * chartHeight + padding.top;

  // Create SVG path for the line
  const linePath = dataPoints
    .map((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create SVG path for the area (closed)
  const areaPath = `${linePath} L ${scaleX(dataPoints.length - 1)} ${scaleY(0)} L ${scaleX(0)} ${scaleY(0)} Z`;

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
              Revenue Growth
            </h3>
            <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}60` }}>
              Monthly performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <span className="text-xs" style={{ color: `${customization.textColor}70` }}>
              2024
            </span>
          </div>
        </div>

        <svg width={width} height={height} className="overflow-visible">
          <defs>
            {/* Gradient for area fill */}
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={customization.primaryColor} stopOpacity="0.6" />
              <stop offset="50%" stopColor={customization.primaryColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={customization.primaryColor} stopOpacity="0" />
            </linearGradient>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              <motion.line
                x1={padding.left}
                y1={scaleY(value)}
                x2={width - padding.right}
                y2={scaleY(value)}
                stroke={`${customization.textColor}15`}
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <text
                x={padding.left - 8}
                y={scaleY(value) + 4}
                textAnchor="end"
                fill={`${customization.textColor}50`}
                fontSize="10"
              >
                {value}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {dataPoints.map((point, index) => (
            index % 2 === 0 && (
              <text
                key={index}
                x={scaleX(point.x)}
                y={height - 8}
                textAnchor="middle"
                fill={`${customization.textColor}50`}
                fontSize="9"
              >
                {labels[index]}
              </text>
            )
          ))}

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={customization.primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Data points */}
          {dataPoints.map((point, index) => (
            <motion.circle
              key={index}
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              r="4"
              fill={customization.backgroundColor}
              stroke={customization.primaryColor}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.5, fill: customization.primaryColor }}
            />
          ))}
        </svg>

        <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
          SVG area chart with gradient fill and animations
        </p>
      </motion.div>
    </div>
  );
}
