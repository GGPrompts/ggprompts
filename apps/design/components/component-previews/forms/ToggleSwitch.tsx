'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Moon, Sun, Bell, BellOff, Wifi, WifiOff } from 'lucide-react';
import { Customization } from '@/types/customization';

type ToggleSwitchProps = {
  customization: Customization;
};

type Toggle = {
  id: string;
  label: string;
  iconOn: React.ElementType;
  iconOff: React.ElementType;
};

const toggles: Toggle[] = [
  { id: 'darkMode', label: 'Dark Mode', iconOn: Moon, iconOff: Sun },
  { id: 'notifications', label: 'Notifications', iconOn: Bell, iconOff: BellOff },
  { id: 'autoSync', label: 'Auto Sync', iconOn: Wifi, iconOff: WifiOff },
];

export function ToggleSwitch({ customization }: ToggleSwitchProps) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    darkMode: true,
    notifications: false,
    autoSync: true,
  });
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const toggleSwitch = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: customization.textColor }}
      >
        Settings
      </h3>
      <div className="space-y-4">
        {toggles.map((toggle, index) => {
          const isEnabled = enabled[toggle.id];
          const IconOn = toggle.iconOn;
          const IconOff = toggle.iconOff;

          return (
            <motion.div
              key={toggle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                backgroundColor: `${customization.textColor}05`,
                borderRadius: `${customization.borderRadius}px`,
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    color: isEnabled ? customization.primaryColor : `${customization.textColor}50`,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isEnabled ? (
                    <IconOn className="w-5 h-5" />
                  ) : (
                    <IconOff className="w-5 h-5" />
                  )}
                </motion.div>
                <span style={{ color: customization.textColor }}>{toggle.label}</span>
              </div>

              {/* Toggle Switch */}
              <motion.button
                type="button"
                className="relative w-14 h-8 rounded-full cursor-pointer"
                style={{
                  backgroundColor: isEnabled
                    ? customization.primaryColor
                    : `${customization.textColor}30`,
                }}
                onClick={() => toggleSwitch(toggle.id)}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect when enabled */}
                {isEnabled && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: `0 0 20px ${customization.primaryColor}60`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* Track indicator dots */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ opacity: isEnabled ? 0.5 : 0 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: `${customization.textColor}40` }}
                    animate={{ opacity: isEnabled ? 0 : 0.5 }}
                  />
                </div>

                {/* Thumb */}
                <motion.div
                  className="absolute top-1 w-6 h-6 rounded-full shadow-lg flex items-center justify-center"
                  style={{
                    backgroundColor: '#fff',
                  }}
                  animate={{
                    x: isEnabled ? 28 : 4,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isEnabled
                        ? customization.primaryColor
                        : `${customization.textColor}30`,
                    }}
                    animate={{ scale: isEnabled ? 1 : 0.8 }}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Status indicator */}
      <motion.div
        className="mt-4 p-3 rounded-lg border"
        style={{
          borderColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 2)}`,
          backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`,
          borderRadius: `${customization.borderRadius}px`,
        }}
      >
        <p className="text-xs" style={{ color: `${customization.textColor}70` }}>
          Active: {Object.entries(enabled).filter(([, v]) => v).length} / {toggles.length}
        </p>
      </motion.div>

      <p className="mt-3 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Animated toggle switches with icons
      </p>
    </div>
  );
}
