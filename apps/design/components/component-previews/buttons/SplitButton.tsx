'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Customization } from '@/types/customization';
import { ChevronDown, Download, Share, Copy, Mail } from 'lucide-react';

type SplitButtonProps = {
  customization: Customization;
};

export function SplitButton({ customization }: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSecondary, setIsOpenSecondary] = useState(false);
  const hoverScale = parseFloat(customization.hoverScale) || 1.02;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  // Convert percentage to hex for opacity values
  const dividerOpacityHex = Math.round(glassOpacity * 5.3 * 2.55).toString(16).padStart(2, '0');
  const dropdownBorderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const hoverBgOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const hoverBgLightOpacityHex = Math.round(glassOpacity * 0.7 * 2.55).toString(16).padStart(2, '0');

  const dropdownOptions = [
    { Icon: Share, label: 'Share' },
    { Icon: Copy, label: 'Copy Link' },
    { Icon: Mail, label: 'Email' },
  ];

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Primary Split Button */}
      <div className="relative">
        <motion.div
          className="flex overflow-hidden"
          style={{
            borderRadius: `${customization.borderRadius}px`,
            boxShadow: `0 4px 15px ${customization.primaryColor}${Math.round(shadowIntensity).toString(16).padStart(2, '0')}`,
          }}
          whileHover={{ scale: hoverScale }}
        >
          <motion.button
            className="px-6 py-3 flex items-center gap-2 text-white font-semibold"
            style={{
              ...baseStyle,
              backgroundColor: customization.primaryColor,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
          <div
            className="w-px"
            style={{ backgroundColor: `${customization.primaryColor}${dividerOpacityHex}` }}
          />
          <motion.button
            className="px-3 py-3 text-white"
            style={{ backgroundColor: customization.primaryColor }}
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 z-10 min-w-[160px] py-2 rounded-lg shadow-xl"
              style={{
                backgroundColor: customization.surfaceColor,
                border: `1px solid ${customization.primaryColor}${dropdownBorderOpacityHex}`,
              }}
            >
              {dropdownOptions.map(({ Icon, label }) => (
                <motion.button
                  key={label}
                  className="w-full px-4 py-2 flex items-center gap-3 text-left transition-colors"
                  style={{
                    ...baseStyle,
                    color: customization.textColor,
                  }}
                  whileHover={{
                    backgroundColor: `${customization.primaryColor}${hoverBgOpacityHex}`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: customization.primaryColor }} />
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outline Split Button */}
      <div className="relative">
        <motion.div
          className="flex overflow-hidden border-2"
          style={{
            borderRadius: `${customization.borderRadius}px`,
            borderColor: customization.secondaryColor,
          }}
          whileHover={{ scale: hoverScale }}
        >
          <motion.button
            className="px-6 py-3 flex items-center gap-2 font-semibold transition-colors"
            style={{
              ...baseStyle,
              color: customization.secondaryColor,
              backgroundColor: 'transparent',
            }}
            whileHover={{
              backgroundColor: `${customization.secondaryColor}${hoverBgLightOpacityHex}`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Share className="w-4 h-4" />
            Share
          </motion.button>
          <div
            className="w-px"
            style={{ backgroundColor: customization.secondaryColor }}
          />
          <motion.button
            className="px-3 py-3 transition-colors"
            style={{
              color: customization.secondaryColor,
              backgroundColor: 'transparent',
            }}
            whileHover={{
              backgroundColor: `${customization.secondaryColor}${hoverBgLightOpacityHex}`,
            }}
            onClick={() => setIsOpenSecondary(!isOpenSecondary)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isOpenSecondary ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isOpenSecondary && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 z-10 min-w-[160px] py-2 rounded-lg shadow-xl border"
              style={{
                backgroundColor: customization.surfaceColor,
                borderColor: `${customization.secondaryColor}${dropdownBorderOpacityHex}`,
              }}
            >
              {dropdownOptions.map(({ Icon, label }) => (
                <motion.button
                  key={label}
                  className="w-full px-4 py-2 flex items-center gap-3 text-left transition-colors"
                  style={{
                    ...baseStyle,
                    color: customization.textColor,
                  }}
                  whileHover={{
                    backgroundColor: `${customization.secondaryColor}${hoverBgOpacityHex}`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: customization.secondaryColor }} />
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Click arrow for more options
      </p>
    </div>
  );
}
