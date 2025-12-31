'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Home, Settings, User, Bell, ChevronRight } from 'lucide-react';
import { Customization } from '@/types/customization';

type SlideDrawerProps = {
  customization: Customization;
};

export function SlideDrawer({ customization }: SlideDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', badge: null },
    { icon: User, label: 'Profile', badge: null },
    { icon: Bell, label: 'Notifications', badge: '3' },
    { icon: Settings, label: 'Settings', badge: null },
  ];

  return (
    <div className="w-full max-w-md relative overflow-hidden" style={{ ...baseStyle, minHeight: '300px' }}>
      {/* Main content area */}
      <motion.div
        className="absolute inset-0 p-6"
        style={{
          backgroundColor: customization.backgroundColor,
          borderRadius: `${customization.borderRadius}px`,
        }}
        animate={{ x: isOpen ? 200 : 0, scale: isOpen ? 0.95 : 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: customization.textColor }}>
            Content Area
          </h3>
          <motion.button
            className="px-3 py-1.5 text-sm font-medium rounded-lg"
            style={{
              backgroundColor: `${customization.primaryColor}20`,
              color: customization.primaryColor,
            }}
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Menu
          </motion.button>
        </div>
        <p className="text-sm" style={{ color: `${customization.textColor}60` }}>
          The slide drawer pushes content aside with a smooth animation.
        </p>
      </motion.div>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-52 border-r"
              style={{
                backgroundColor: `${customization.backgroundColor}${opacityHex}`,
                backdropFilter: `blur(${blurAmount}px)`,
                borderColor: `${customization.primaryColor}20`,
                boxShadow: `4px 0 20px ${customization.primaryColor}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: `${customization.primaryColor}15` }}
              >
                <span className="font-semibold" style={{ color: customization.textColor }}>
                  Menu
                </span>
                <motion.button
                  className="p-1 rounded"
                  style={{ backgroundColor: `${customization.textColor}10` }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ backgroundColor: `${customization.textColor}20` }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" style={{ color: `${customization.textColor}70` }} />
                </motion.button>
              </div>

              {/* Menu items */}
              <div className="p-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: `${customization.primaryColor}15` }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" style={{ color: `${customization.textColor}70` }} />
                        <span className="text-sm" style={{ color: customization.textColor }}>
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span
                            className="px-1.5 py-0.5 text-xs rounded-full"
                            style={{
                              backgroundColor: customization.primaryColor,
                              color: 'white',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className="w-3 h-3"
                          style={{ color: `${customization.textColor}40` }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="absolute bottom-0 left-0 right-0 p-4 border-t"
                style={{ borderColor: `${customization.primaryColor}15` }}
              >
                <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                  Slide drawer with push effect
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
