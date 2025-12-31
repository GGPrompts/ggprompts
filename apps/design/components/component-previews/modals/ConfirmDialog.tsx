'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Customization } from '@/types/customization';

type ConfirmDialogProps = {
  customization: Customization;
};

export function ConfirmDialog({ customization }: ConfirmDialogProps) {
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
      {/* Trigger button when dialog is closed */}
      {!isOpen && (
        <motion.button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 font-medium rounded-lg flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: 'white',
          }}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-4 h-4" />
          Delete Item
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

            {/* Dialog */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 border overflow-hidden"
              style={{
                backgroundColor: customization.backgroundColor,
                borderColor: `${customization.primaryColor}30`,
                borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
                boxShadow: `0 25px 50px ${customization.primaryColor}20`,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <motion.button
                className="absolute top-3 right-3 p-1.5 rounded-lg z-10"
                style={{ backgroundColor: `${customization.textColor}10` }}
                onClick={() => setIsOpen(false)}
                whileHover={{ backgroundColor: `${customization.textColor}20` }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" style={{ color: `${customization.textColor}70` }} />
              </motion.button>

              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <motion.div
                  className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${customization.primaryColor}15` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  <AlertTriangle className="w-7 h-7" style={{ color: customization.primaryColor }} />
                </motion.div>

                {/* Title */}
                <h2
                  className="text-lg font-semibold mb-2"
                  style={{ color: customization.textColor }}
                >
                  Delete this item?
                </h2>

                {/* Description */}
                <p
                  className="text-sm mb-6"
                  style={{ color: `${customization.textColor}70` }}
                >
                  This action cannot be undone. This will permanently delete the item
                  from your account.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 py-2.5 font-medium border rounded-lg"
                    style={{
                      borderColor: `${customization.textColor}20`,
                      color: customization.textColor,
                      backgroundColor: 'transparent',
                    }}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ backgroundColor: `${customization.textColor}10` }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2.5 font-medium text-white rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    }}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete
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
