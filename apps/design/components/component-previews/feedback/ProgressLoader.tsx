'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Customization } from '@/types/customization';

type ProgressLoaderProps = {
  customization: Customization;
};

export function ProgressLoader({ customization }: ProgressLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  // Simulate progress
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  const resetLoader = () => {
    setProgress(0);
    setIsLoading(true);
  };

  const steps = [
    { label: 'Initializing...', threshold: 0 },
    { label: 'Loading assets...', threshold: 25 },
    { label: 'Processing data...', threshold: 50 },
    { label: 'Almost there...', threshold: 75 },
    { label: 'Finalizing...', threshold: 90 },
  ];

  const currentStep = steps.filter((s) => progress >= s.threshold).pop();

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '300px' }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backgroundColor: `${customization.backgroundColor}${opacityHex}`,
              borderRadius: `${customization.borderRadius}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute w-32 h-32 rounded-full blur-3xl"
                style={{ backgroundColor: `${customization.primaryColor}20` }}
                animate={{
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute right-0 bottom-0 w-40 h-40 rounded-full blur-3xl"
                style={{ backgroundColor: `${customization.secondaryColor}20` }}
                animate={{
                  x: [0, -20, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Spinner */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {/* Outer ring */}
              <motion.div
                className="w-20 h-20 rounded-full border-4"
                style={{ borderColor: `${customization.primaryColor}20` }}
              />
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: customization.primaryColor,
                  borderRightColor: customization.secondaryColor,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              {/* Center percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: customization.primaryColor }}
                >
                  {Math.min(100, Math.round(progress))}%
                </span>
              </div>
            </motion.div>

            {/* Status text */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep?.label}
                  className="font-medium"
                  style={{ color: customization.textColor }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {currentStep?.label}
                </motion.p>
              </AnimatePresence>
              <p
                className="text-sm mt-1"
                style={{ color: `${customization.textColor}60` }}
              >
                Please wait while we prepare your content
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48">
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${customization.primaryColor}20` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Dots animation */}
            <div className="flex gap-1 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: customization.primaryColor }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: customization.backgroundColor }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <Loader2
                className="w-8 h-8"
                style={{ color: customization.primaryColor }}
              />
            </motion.div>
            <p className="font-semibold mb-1" style={{ color: customization.textColor }}>
              Loading Complete!
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: `${customization.textColor}60` }}
            >
              Your content is ready
            </p>
            <motion.button
              className="px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                color: 'white',
              }}
              onClick={resetLoader}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Restart Demo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
