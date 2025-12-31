'use client';

import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';

type NeonCardProps = {
  customization: Customization;
};

export function NeonCard({ customization }: NeonCardProps) {
  const glowIntensity = parseInt(customization.glowIntensity) || 60;
  const glowSpread = parseInt(customization.glowSpread) || 40;
  const pulseSpeed = parseFloat(customization.pulseSpeed) || 2;
  const enablePulse = customization.animations;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;

  const baseGlow = Math.round(glowIntensity * 0.6);
  const midGlow = Math.round(glowIntensity * 0.4);
  const outerGlow = Math.round(glowIntensity * 0.2);

  // Convert percentage to hex for opacity values
  const tagOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const innerGlowOpacityHex = Math.round(glassOpacity * 0.7 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const boxShadowBase = `0 0 ${glowSpread * 0.5}px ${customization.primaryColor}${baseGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread}px ${customization.primaryColor}${midGlow.toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 1.5}px ${customization.primaryColor}${outerGlow.toString(16).padStart(2, '0')}, inset 0 0 20px ${customization.primaryColor}${innerGlowOpacityHex}`;

  const boxShadowPulse = `0 0 ${glowSpread * 0.75}px ${customization.primaryColor}${Math.min(255, baseGlow + 30).toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 1.5}px ${customization.primaryColor}${Math.min(255, midGlow + 20).toString(16).padStart(2, '0')}, 0 0 ${glowSpread * 2.25}px ${customization.primaryColor}${Math.min(255, outerGlow + 10).toString(16).padStart(2, '0')}`;

  return (
    <motion.div
      className="w-full max-w-sm p-6 rounded-xl border-2 transition-all"
      style={{
        ...baseStyle,
        backgroundColor: customization.backgroundColor,
        borderColor: customization.primaryColor,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
        boxShadow: boxShadowBase,
      }}
      animate={
        enablePulse
          ? {
              boxShadow: [boxShadowBase, boxShadowPulse, boxShadowBase],
            }
          : undefined
      }
      transition={enablePulse ? { duration: pulseSpeed, repeat: Infinity } : undefined}
    >
      <h3
        className="font-bold mb-2"
        style={{ textShadow: `0 0 ${glowSpread * 0.25}px ${customization.primaryColor}` }}
      >
        Neon Glow Card
      </h3>
      <p className="opacity-80 text-sm">
        Pulsing neon glow effect with customizable intensity.
      </p>
      <div className="mt-3 flex gap-2 text-xs">
        <span
          className="px-2 py-1 rounded"
          style={{ backgroundColor: `${customization.primaryColor}${tagOpacityHex}` }}
        >
          {glowIntensity}% glow
        </span>
        {enablePulse && (
          <span
            className="px-2 py-1 rounded"
            style={{ backgroundColor: `${customization.primaryColor}${tagOpacityHex}` }}
          >
            {pulseSpeed}s pulse
          </span>
        )}
      </div>
    </motion.div>
  );
}
