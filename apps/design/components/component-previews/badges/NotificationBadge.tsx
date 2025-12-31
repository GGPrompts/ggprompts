'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Customization } from '@/types/customization';
import { Bell, Mail, MessageSquare, ShoppingCart, Heart, Settings } from 'lucide-react';

type NotificationBadgeProps = {
  customization: Customization;
};

export function NotificationBadge({ customization }: NotificationBadgeProps) {
  const [counts, setCounts] = useState({
    bell: 5,
    mail: 23,
    messages: 99,
    cart: 3,
    heart: 128,
    settings: 0,
  });
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;

  // Convert percentage to hex for opacity values
  const iconBgOpacityHex = Math.round(glassOpacity * 1 * 2.55).toString(16).padStart(2, '0');
  const textBadgeBgOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');

  const incrementCount = (key: keyof typeof counts) => {
    setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontWeight: customization.fontWeight,
  };

  const formatCount = (count: number) => {
    if (count > 99) return '99+';
    return count.toString();
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Icon Buttons with Badges */}
      <div className="flex gap-6">
        {/* Bell with count */}
        <motion.button
          className="relative p-3 rounded-full"
          style={{ backgroundColor: `${customization.primaryColor}${iconBgOpacityHex}` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => incrementCount('bell')}
        >
          <Bell className="w-6 h-6" style={{ color: customization.primaryColor }} />
          <AnimatePresence>
            {counts.bell > 0 && (
              <motion.span
                key={counts.bell}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: customization.primaryColor }}
              >
                {formatCount(counts.bell)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mail with count */}
        <motion.button
          className="relative p-3 rounded-full"
          style={{ backgroundColor: `${customization.secondaryColor}${iconBgOpacityHex}` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => incrementCount('mail')}
        >
          <Mail className="w-6 h-6" style={{ color: customization.secondaryColor }} />
          <AnimatePresence>
            {counts.mail > 0 && (
              <motion.span
                key={counts.mail}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: customization.secondaryColor }}
              >
                {formatCount(counts.mail)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Messages with 99+ */}
        <motion.button
          className="relative p-3 rounded-full"
          style={{ backgroundColor: `${customization.primaryColor}${iconBgOpacityHex}` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => incrementCount('messages')}
        >
          <MessageSquare className="w-6 h-6" style={{ color: customization.primaryColor }} />
          <AnimatePresence>
            {counts.messages > 0 && (
              <motion.span
                key={counts.messages}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#ef4444' }}
              >
                {formatCount(counts.messages)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Pill Badges with Icons */}
      <div className="flex gap-3">
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: customization.primaryColor,
          }}
          whileHover={{ scale: 1.05 }}
        >
          <ShoppingCart className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-semibold" style={baseStyle}>
            {counts.cart}
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: '#ef4444',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Heart className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-semibold" style={baseStyle}>
            {formatCount(counts.heart)}
          </span>
        </motion.div>
      </div>

      {/* Pulsing Notification Dot */}
      <div className="flex gap-6 items-center">
        <motion.button
          className="relative p-3"
          whileHover={{ scale: 1.1 }}
        >
          <Settings className="w-6 h-6" style={{ color: customization.textColor }} />
          <motion.span
            className="absolute top-2 right-2 w-3 h-3 rounded-full"
            style={{ backgroundColor: customization.primaryColor }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>

        <div className="text-center">
          <p className="text-sm" style={{ color: customization.textColor }}>
            New updates available
          </p>
          <motion.div
            className="mt-1 h-1 rounded-full"
            style={{ backgroundColor: customization.primaryColor }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Inline Text Badges */}
      <div className="flex flex-wrap gap-3 justify-center">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${customization.primaryColor}${textBadgeBgOpacityHex}`,
            color: customization.primaryColor,
          }}
        >
          New
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: customization.primaryColor }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </span>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: '#22c55e20',
            color: '#22c55e',
          }}
        >
          Beta
        </span>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: '#f59e0b20',
            color: '#f59e0b',
          }}
        >
          Pro
        </span>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: '#ef444420',
            color: '#ef4444',
          }}
        >
          Hot
        </span>
      </div>

      <p className="text-xs opacity-50" style={{ color: customization.textColor }}>
        Click icons to increment counts
      </p>
    </div>
  );
}
