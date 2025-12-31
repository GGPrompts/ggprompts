'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, RefreshCw, PartyPopper, Sparkles } from 'lucide-react';
import { Customization } from '@/types/customization';

type SuccessStateProps = {
  customization: Customization;
};

export function SuccessState({ customization }: SuccessStateProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [key, setKey] = useState(0);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const replay = () => {
    setIsVisible(false);
    setTimeout(() => {
      setKey((k) => k + 1);
      setIsVisible(true);
    }, 300);
  };

  // Confetti particles
  const confettiColors = [
    customization.primaryColor,
    customization.secondaryColor,
    '#22c55e',
    '#f59e0b',
    '#ec4899',
  ];

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '300px' }}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={key}
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{
              backgroundColor: customization.backgroundColor,
              borderRadius: `${customization.borderRadius}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-sm"
                  style={{
                    backgroundColor: confettiColors[i % confettiColors.length],
                    left: `${10 + Math.random() * 80}%`,
                    top: '-10px',
                  }}
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    y: 400,
                    rotate: Math.random() * 720 - 360,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: 'easeIn',
                  }}
                />
              ))}
            </div>

            {/* Success circle with checkmark */}
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${customization.primaryColor}30, transparent)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Circle background */}
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Checkmark */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                >
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </motion.div>

                {/* Sparkle effects */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: customization.primaryColor }} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Success text */}
            <motion.div
              className="text-center mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center gap-2 mb-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
              >
                <PartyPopper className="w-5 h-5" style={{ color: customization.primaryColor }} />
                <h2
                  className="text-2xl font-bold"
                  style={{ color: customization.textColor }}
                >
                  Success!
                </h2>
                <PartyPopper
                  className="w-5 h-5 scale-x-[-1]"
                  style={{ color: customization.secondaryColor }}
                />
              </motion.div>
              <p
                className="text-sm"
                style={{ color: `${customization.textColor}70` }}
              >
                Your action was completed successfully
              </p>
            </motion.div>

            {/* Animated details */}
            <motion.div
              className="w-48 space-y-2 my-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {['Payment processed', 'Email sent', 'Account updated'].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: `${customization.primaryColor}10` }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: customization.primaryColor }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </motion.div>
                  <span className="text-xs" style={{ color: customization.textColor }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Replay button */}
            <motion.button
              className="px-5 py-2 mt-2 font-medium rounded-lg flex items-center gap-2 border"
              style={{
                borderColor: `${customization.primaryColor}40`,
                color: customization.primaryColor,
              }}
              onClick={replay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: `${customization.primaryColor}10`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Replay Animation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
