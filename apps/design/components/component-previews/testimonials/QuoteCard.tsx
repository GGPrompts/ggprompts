'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Customization } from '@/types/customization';

type QuoteCardProps = {
  customization: Customization;
};

export function QuoteCard({ customization }: QuoteCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Gradient border effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-2xl opacity-70 blur-sm"
          style={{
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor}, ${customization.primaryColor})`,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Card content */}
        <div
          className="relative p-6 rounded-2xl"
          style={{
            backgroundColor: customization.backgroundColor,
          }}
        >
          {/* Large quote icon */}
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <div
              className="p-3 rounded-full"
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}30, ${customization.secondaryColor}30)`,
              }}
            >
              <Quote
                className="w-6 h-6"
                style={{
                  color: customization.primaryColor,
                }}
              />
            </div>
          </motion.div>

          {/* Quote text with gradient */}
          <motion.blockquote
            className="text-center text-lg font-medium mb-6 leading-relaxed"
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            "Design is not just what it looks like and feels like. Design is how it works."
          </motion.blockquote>

          {/* Divider */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-px flex-1" style={{ backgroundColor: `${customization.primaryColor}20` }} />
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              }}
            />
            <div className="h-px flex-1" style={{ backgroundColor: `${customization.primaryColor}20` }} />
          </motion.div>

          {/* Author */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-semibold" style={{ color: customization.textColor }}>
              Steve Jobs
            </p>
            <p className="text-sm" style={{ color: `${customization.textColor}50` }}>
              Co-founder of Apple
            </p>
          </motion.div>

          {/* Corner accents */}
          <div
            className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 rounded-tl-lg"
            style={{ borderColor: `${customization.primaryColor}30` }}
          />
          <div
            className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 rounded-br-lg"
            style={{ borderColor: `${customization.secondaryColor}30` }}
          />
        </div>
      </motion.div>
    </div>
  );
}
