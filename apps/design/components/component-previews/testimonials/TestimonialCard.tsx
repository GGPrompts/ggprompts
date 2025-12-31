'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Customization } from '@/types/customization';

type TestimonialCardProps = {
  customization: Customization;
};

export function TestimonialCard({ customization }: TestimonialCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
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
        className="relative p-6 border overflow-hidden"
        style={{
          backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity)}`,
          borderColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 2)}`,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          backdropFilter: `blur(${blurAmount}px)`,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -5,
          boxShadow: `0 16px 40px ${customization.primaryColor}${Math.round(shadowIntensity * 0.5).toString(16).padStart(2, '0')}`,
        }}
      >
        {/* Quote decoration */}
        <motion.div
          className="absolute top-4 right-4 opacity-20"
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
        >
          <Quote className="w-16 h-16" style={{ color: customization.primaryColor }} />
        </motion.div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <motion.div
              key={star}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Star
                className="w-4 h-4 fill-current"
                style={{ color: '#fbbf24' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Quote text */}
        <p className="relative z-10 mb-6 leading-relaxed" style={{ color: `${customization.textColor}90` }}>
          "The customization options are incredible. I was able to create exactly
          the UI components I needed and export them for my AI workflow."
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 relative z-10">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            }}
            whileHover={{ scale: 1.1 }}
          >
            JD
          </motion.div>
          <div>
            <p className="font-semibold" style={{ color: customization.textColor }}>
              Jane Doe
            </p>
            <p className="text-sm" style={{ color: `${customization.textColor}60` }}>
              Senior Developer at TechCorp
            </p>
          </div>
        </div>

        {/* Decorative gradient */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>
    </div>
  );
}
