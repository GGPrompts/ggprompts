'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Customization } from '@/types/customization';

type PricingCardProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function PricingCard({ customization, textContent }: PricingCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const planName = textContent?.planName ?? 'Pro';
  const price = textContent?.price ?? '$29';
  const period = textContent?.period ?? '/month';
  const description = textContent?.description ?? 'Perfect for growing teams';
  const buttonText = textContent?.buttonText ?? 'Get Started';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const features = [
    'Unlimited projects',
    'Custom components',
    'AI prompt export',
    'Priority support',
    'Team collaboration',
  ];

  return (
    <div className="w-full max-w-xs relative" style={baseStyle}>
      {/* Hot badge - outside overflow container */}
      <motion.div
        className="absolute top-3 -right-6 px-6 py-1 text-xs font-bold text-white transform rotate-45 z-10"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        HOT
      </motion.div>

      <motion.div
        className="relative p-6 border overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}95`,
          borderColor: `${customization.primaryColor}50`,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          boxShadow: `0 20px 40px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >

        {/* Glow effect */}
        <div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${customization.primaryColor}, transparent)`,
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${customization.primaryColor}20`,
                color: customization.primaryColor,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>Best Value</span>
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: customization.textColor }}>
              {planName} Plan
            </h3>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className="text-4xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {price}
              </span>
              <span style={{ color: `${customization.textColor}60` }}>{period}</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div
                  className="p-1 rounded-full"
                  style={{ backgroundColor: `${customization.primaryColor}20` }}
                >
                  <Check className="w-3 h-3" style={{ color: customization.primaryColor }} />
                </div>
                <span className="text-sm" style={{ color: `${customization.textColor}80` }}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            className="w-full py-3 font-bold text-white rounded-lg relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              boxShadow: `0 4px 20px ${customization.primaryColor}50`,
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: `0 8px 30px ${customization.primaryColor}70`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 opacity-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${customization.textColor}30, transparent)`,
              }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">{buttonText}</span>
          </motion.button>

          <p className="text-xs text-center mt-3" style={{ color: `${customization.textColor}50` }}>
            14-day free trial included
          </p>
        </div>
      </motion.div>
    </div>
  );
}
