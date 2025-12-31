'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Customization } from '@/types/customization';
import { Loader2, Check, Send } from 'lucide-react';

type LoadingButtonProps = {
  customization: Customization;
};

export function LoadingButton({ customization }: LoadingButtonProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingState2, setLoadingState2] = useState<'idle' | 'loading' | 'success'>('idle');
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const spinnerSize = parseInt(customization.spinnerSize) || 16;
  const showSuccessState = customization.showSuccessState !== 'false';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
    borderRadius: `${customization.borderRadius}px`,
  };

  const handleClick = (setter: typeof setLoadingState) => {
    setter('loading');
    setTimeout(() => {
      if (showSuccessState) {
        setter('success');
        setTimeout(() => setter('idle'), 1500);
      } else {
        setter('idle');
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Spinner Loading Button */}
      <motion.button
        className="px-8 py-3 flex items-center justify-center gap-2 text-white font-semibold min-w-[180px]"
        style={{
          ...baseStyle,
          backgroundColor: loadingState === 'success' ? '#22c55e' : customization.primaryColor,
          boxShadow: `0 4px 15px ${loadingState === 'success' ? '#22c55e' : customization.primaryColor}${Math.round(shadowIntensity).toString(16).padStart(2, '0')}`,
        }}
        onClick={() => loadingState === 'idle' && handleClick(setLoadingState)}
        whileHover={loadingState === 'idle' ? { scale: 1.02 } : {}}
        whileTap={loadingState === 'idle' ? { scale: 0.98 } : {}}
        disabled={loadingState !== 'idle'}
      >
        {loadingState === 'idle' && (
          <>
            <Send className="w-4 h-4" />
            Submit
          </>
        )}
        {loadingState === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 style={{ width: spinnerSize, height: spinnerSize }} />
            </motion.div>
            Processing...
          </>
        )}
        {loadingState === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Success!
          </motion.div>
        )}
      </motion.button>

      {/* Progress Bar Loading Button */}
      <motion.button
        className="relative px-8 py-3 flex items-center justify-center gap-2 text-white font-semibold min-w-[180px] overflow-hidden"
        style={{
          ...baseStyle,
          backgroundColor: loadingState2 === 'success' ? '#22c55e' : customization.secondaryColor,
        }}
        onClick={() => loadingState2 === 'idle' && handleClick(setLoadingState2)}
        whileHover={loadingState2 === 'idle' ? { scale: 1.02 } : {}}
        whileTap={loadingState2 === 'idle' ? { scale: 0.98 } : {}}
        disabled={loadingState2 !== 'idle'}
      >
        {loadingState2 === 'loading' && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/50"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'linear' }}
          />
        )}
        {loadingState2 === 'idle' && 'Save Changes'}
        {loadingState2 === 'loading' && 'Saving...'}
        {loadingState2 === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Saved!
          </motion.div>
        )}
      </motion.button>

      {/* Pulse Loading Button */}
      <motion.button
        className="px-8 py-3 flex items-center justify-center gap-2 border-2 font-semibold min-w-[180px]"
        style={{
          ...baseStyle,
          borderColor: customization.primaryColor,
          color: customization.primaryColor,
          backgroundColor: 'transparent',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="rounded-full"
              style={{
                width: spinnerSize / 2,
                height: spinnerSize / 2,
                backgroundColor: customization.primaryColor,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </span>
        <span className="ml-2">Loading</span>
      </motion.button>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Click buttons to see loading states
      </p>
    </div>
  );
}
