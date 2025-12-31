'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type LogoCloudProps = {
  customization: Customization;
};

export function LogoCloud({ customization }: LogoCloudProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Sample company logos (represented as styled text for demo)
  const logos = [
    { name: 'Acme', letter: 'A' },
    { name: 'TechFlow', letter: 'T' },
    { name: 'DataSync', letter: 'D' },
    { name: 'CloudBase', letter: 'C' },
    { name: 'Nexus', letter: 'N' },
    { name: 'Quantum', letter: 'Q' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-6 overflow-hidden"
        style={{
          background: customization.backgroundColor,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          border: `1px solid ${customization.primaryColor}15`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Section title */}
        <motion.p
          className="text-center text-xs font-medium uppercase tracking-wider mb-6"
          style={{ color: `${customization.textColor}50` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Trusted by leading companies worldwide
        </motion.p>

        {/* Logo grid */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              className="flex items-center justify-center p-4 rounded-xl cursor-pointer group"
              style={{
                backgroundColor: `${customization.primaryColor}05`,
                border: `1px solid ${customization.primaryColor}10`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2 + index * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: `${customization.primaryColor}10`,
                borderColor: `${customization.primaryColor}30`,
                boxShadow: `0 8px 24px ${customization.primaryColor}15`,
              }}
            >
              <div className="flex items-center gap-2">
                {/* Logo icon placeholder */}
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
                    color: customization.primaryColor,
                  }}
                  whileHover={{
                    background: `linear-gradient(135deg, ${customization.primaryColor}40, ${customization.secondaryColor}40)`,
                  }}
                >
                  {logo.letter}
                </motion.div>
                {/* Company name */}
                <span
                  className="text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: customization.textColor }}
                >
                  {logo.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative gradient line */}
        <motion.div
          className="mt-6 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${customization.primaryColor}30, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        {/* Stats */}
        <motion.div
          className="mt-5 flex items-center justify-center gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { value: '500+', label: 'Companies' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="text-lg font-bold"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs"
                style={{ color: `${customization.textColor}50` }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
