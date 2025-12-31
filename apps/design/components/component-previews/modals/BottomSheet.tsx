'use client';

import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useState } from 'react';
import { Share2, Copy, MessageCircle, Mail, Link, MoreHorizontal } from 'lucide-react';
import { Customization } from '@/types/customization';

type BottomSheetProps = {
  customization: Customization;
};

export function BottomSheet({ customization }: BottomSheetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const dragControls = useDragControls();
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const backdropOpacity = parseInt(customization.backdropOpacity || '50') || 50;
  const backdropHex = Math.round(backdropOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: Copy },
    { id: 'message', label: 'Message', icon: MessageCircle },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'link', label: 'Get Link', icon: Link },
  ];

  return (
    <div className="w-full max-w-md relative overflow-hidden" style={{ ...baseStyle, minHeight: '320px' }}>
      {/* Background content (simulated app) */}
      <div
        className="absolute inset-0 p-4"
        style={{
          backgroundColor: customization.backgroundColor,
          borderRadius: `${customization.borderRadius}px`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: customization.textColor }}>
            Content Preview
          </h3>
        </div>
        <div
          className="h-24 rounded-lg mb-4"
          style={{ backgroundColor: `${customization.primaryColor}15` }}
        />
        <motion.button
          className="w-full py-3 font-medium rounded-lg flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: 'white',
          }}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: `${customization.backgroundColor}${backdropHex}`, backdropFilter: `blur(${blurAmount}px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 border-t"
              style={{
                backgroundColor: customization.backgroundColor,
                borderColor: `${customization.primaryColor}20`,
                borderTopLeftRadius: `${Number(customization.borderRadius) * 2}px`,
                borderTopRightRadius: `${Number(customization.borderRadius) * 2}px`,
                boxShadow: `0 -10px 40px ${customization.primaryColor}15`,
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setIsOpen(false);
                }
              }}
            >
              {/* Handle */}
              <div
                className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: `${customization.textColor}30` }}
                />
              </div>

              {/* Title */}
              <div className="px-5 pb-4">
                <h3 className="font-semibold text-lg" style={{ color: customization.textColor }}>
                  Share this content
                </h3>
                <p className="text-sm" style={{ color: `${customization.textColor}60` }}>
                  Choose how you want to share
                </p>
              </div>

              {/* Share options grid */}
              <div className="grid grid-cols-4 gap-3 px-5 pb-4">
                {shareOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      className="flex flex-col items-center gap-2 py-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${customization.primaryColor}25, ${customization.secondaryColor}25)`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: customization.primaryColor }} />
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: customization.textColor }}
                      >
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* More options */}
              <div
                className="px-5 py-3 border-t"
                style={{ borderColor: `${customization.textColor}10` }}
              >
                <motion.button
                  className="w-full flex items-center gap-3 py-2 rounded-lg"
                  whileHover={{ backgroundColor: `${customization.primaryColor}10` }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${customization.textColor}10` }}
                  >
                    <MoreHorizontal
                      className="w-5 h-5"
                      style={{ color: `${customization.textColor}60` }}
                    />
                  </div>
                  <span className="text-sm" style={{ color: customization.textColor }}>
                    More options
                  </span>
                </motion.button>
              </div>

              {/* Cancel button */}
              <div className="px-5 pb-5">
                <motion.button
                  className="w-full py-3 font-medium rounded-lg"
                  style={{
                    backgroundColor: `${customization.textColor}10`,
                    color: customization.textColor,
                  }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ backgroundColor: `${customization.textColor}15` }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
