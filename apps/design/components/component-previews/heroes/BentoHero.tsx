'use client';

import { motion } from 'framer-motion';
import { Zap, Palette, Code2, Layers } from 'lucide-react';
import { Customization } from '@/types/customization';

type BentoHeroProps = {
  customization: Customization;
};

export function BentoHero({ customization }: BentoHeroProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const bentoItems = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed',
      size: 'large',
      color: customization.primaryColor,
    },
    {
      icon: Palette,
      title: 'Customizable',
      description: 'Make it yours',
      size: 'small',
      color: customization.secondaryColor,
    },
    {
      icon: Code2,
      title: 'Developer First',
      description: 'Clean code output',
      size: 'small',
      color: '#a855f7',
    },
    {
      icon: Layers,
      title: 'Components',
      description: '50+ ready to use',
      size: 'medium',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <div className="grid grid-cols-4 grid-rows-2 gap-3">
        {bentoItems.map((item, index) => {
          const Icon = item.icon;
          const colSpan = item.size === 'large' ? 2 : item.size === 'medium' ? 2 : 1;
          const rowSpan = item.size === 'large' ? 2 : 1;

          return (
            <motion.div
              key={item.title}
              className="relative p-4 border overflow-hidden"
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                backgroundColor: `${customization.backgroundColor}95`,
                borderColor: `${item.color}30`,
                borderRadius: `${customization.borderRadius}px`,
                boxShadow: `0 4px 20px ${item.color}${Math.round(shadowIntensity * 0.2).toString(16).padStart(2, '0')}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 8px 30px ${item.color}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
                borderColor: `${item.color}60`,
              }}
            >
              {/* Background glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30"
                style={{
                  background: `radial-gradient(circle, ${item.color}, transparent)`,
                }}
              />

              <div className="relative z-10 h-full flex flex-col">
                <motion.div
                  className="p-2 rounded-lg w-fit mb-2"
                  style={{ backgroundColor: `${item.color}20` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </motion.div>

                <h3
                  className={`font-semibold mb-1 ${item.size === 'large' ? 'text-xl' : 'text-sm'}`}
                  style={{ color: customization.textColor }}
                >
                  {item.title}
                </h3>

                <p
                  className={`${item.size === 'large' ? 'text-sm' : 'text-xs'}`}
                  style={{ color: `${customization.textColor}60` }}
                >
                  {item.description}
                </p>

                {item.size === 'large' && (
                  <motion.div
                    className="mt-auto pt-4 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: `${item.color}20`, color: item.color }}
                    >
                      Popular
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        Bento grid layout with animated cards
      </p>
    </div>
  );
}
