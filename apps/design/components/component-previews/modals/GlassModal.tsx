'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Customization } from '@/types/customization';

type GlassModalProps = {
  customization: Customization;
};

export function GlassModal({ customization }: GlassModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const backdropOpacity = parseInt(customization.backdropOpacity || '50') || 50;
  const backdropHex = Math.round(backdropOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '300px' }}>
      {/* Trigger button when modal is closed */}
      {!isOpen && (
        <motion.button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 font-medium rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: 'white',
          }}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Open Modal
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundColor: `${customization.backgroundColor}${backdropHex}`,
                backdropFilter: `blur(${blurAmount}px)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="absolute inset-4 border overflow-hidden"
              style={{
                backgroundColor: `${customization.primaryColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
                borderColor: `${customization.primaryColor}40`,
                borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
                backdropFilter: `blur(${blurAmount}px)`,
                boxShadow: `0 25px 50px ${customization.primaryColor}30, inset 0 1px 0 ${customization.primaryColor}30`,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: `${customization.primaryColor}20` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${customization.primaryColor}25` }}
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: customization.primaryColor }} />
                  </div>
                  <h2 className="font-semibold" style={{ color: customization.textColor }}>
                    Success!
                  </h2>
                </div>
                <motion.button
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${customization.textColor}10` }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ backgroundColor: `${customization.textColor}20` }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" style={{ color: `${customization.textColor}70` }} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="mb-4" style={{ color: `${customization.textColor}80` }}>
                  Your changes have been saved successfully. The glassmorphic effect creates
                  a modern, premium feel.
                </p>

                {/* Progress indicator */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: `${customization.textColor}60` }}>Upload progress</span>
                    <span style={{ color: customization.primaryColor }}>100%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${customization.textColor}15` }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 py-2.5 font-medium text-white rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    }}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                  </motion.button>
                  <motion.button
                    className="px-5 py-2.5 font-medium border rounded-lg"
                    style={{
                      borderColor: `${customization.primaryColor}40`,
                      color: customization.textColor,
                    }}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ backgroundColor: `${customization.primaryColor}15` }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
