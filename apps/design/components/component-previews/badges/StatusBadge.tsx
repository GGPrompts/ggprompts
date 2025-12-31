'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type StatusBadgeProps = {
  customization: Customization;
};

type StatusType = 'online' | 'offline' | 'away' | 'busy';

const statusConfig: Record<StatusType, { color: string; label: string; animation?: boolean }> = {
  online: { color: '#22c55e', label: 'Online', animation: true },
  offline: { color: '#6b7280', label: 'Offline', animation: false },
  away: { color: '#f59e0b', label: 'Away', animation: true },
  busy: { color: '#ef4444', label: 'Do Not Disturb', animation: false },
};

export function StatusBadge({ customization }: StatusBadgeProps) {
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  // Convert percentage to hex for opacity values
  const badgeBgOpacityHex = Math.round(glassOpacity * 1 * 2.55).toString(16).padStart(2, '0');
  const badgeBorderOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const statuses: StatusType[] = ['online', 'offline', 'away', 'busy'];

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Status Badges Row */}
      <div className="flex flex-wrap gap-4 justify-center">
        {statuses.map((status) => {
          const config = statusConfig[status];
          return (
            <motion.div
              key={status}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                backgroundColor: `${config.color}${badgeBgOpacityHex}`,
                border: `1px solid ${config.color}${badgeBorderOpacityHex}`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-3 w-3">
                {config.animation && (
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: config.color }}
                    animate={{ scale: [1, 1.5], opacity: [0.75, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: config.color }}
                />
              </span>
              <span
                style={{
                  ...baseStyle,
                  color: config.color,
                  fontSize: '14px',
                }}
              >
                {config.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Compact Status Dots */}
      <div className="flex gap-6 items-center">
        {statuses.map((status) => {
          const config = statusConfig[status];
          return (
            <motion.div
              key={`compact-${status}`}
              className="flex flex-col items-center gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <span className="relative flex h-4 w-4">
                {config.animation && (
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: config.color }}
                    animate={{ scale: [1, 1.8], opacity: [0.75, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span
                  className="relative inline-flex rounded-full h-4 w-4"
                  style={{ backgroundColor: config.color }}
                />
              </span>
              <span
                className="text-xs"
                style={{ color: customization.textColor, opacity: 0.7 }}
              >
                {status}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* User Avatar with Status */}
      <div className="flex gap-6">
        {statuses.slice(0, 2).map((status) => {
          const config = statusConfig[status];
          return (
            <motion.div
              key={`avatar-${status}`}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
              >
                JD
              </div>
              <span
                className="absolute bottom-0 right-0 flex h-4 w-4 rounded-full border-2"
                style={{
                  backgroundColor: config.color,
                  borderColor: customization.surfaceColor,
                }}
              >
                {config.animation && (
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: config.color }}
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Themed Status Badges */}
      <div className="flex gap-3">
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: `${customization.primaryColor}${badgeBgOpacityHex}`,
            border: `1px solid ${customization.primaryColor}${badgeBorderOpacityHex}`,
          }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: customization.primaryColor }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ ...baseStyle, color: customization.primaryColor, fontSize: '14px' }}>
            Active
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            backgroundColor: `${customization.secondaryColor}${badgeBgOpacityHex}`,
            border: `1px solid ${customization.secondaryColor}${badgeBorderOpacityHex}`,
          }}
          whileHover={{ scale: 1.05 }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: customization.secondaryColor }}
          />
          <span style={{ ...baseStyle, color: customization.secondaryColor, fontSize: '14px' }}>
            Syncing
          </span>
        </motion.div>
      </div>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Status indicators with dot animations
      </p>
    </div>
  );
}
