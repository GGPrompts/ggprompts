'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, Globe } from 'lucide-react';
import { Customization } from '@/types/customization';

type CenteredHeaderProps = {
  customization: Customization;
};

export function CenteredHeader({ customization }: CenteredHeaderProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const leftNavItems = ['Shop', 'Collections', 'Lookbook'];
  const rightNavItems = ['About', 'Journal', 'Contact'];

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      <motion.header
        className="relative w-full py-4 px-6"
        style={{
          backgroundColor: customization.backgroundColor,
          borderBottom: `1px solid ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Top Bar */}
        <motion.div
          className="flex items-center justify-between text-xs mb-4 pb-3 border-b"
          style={{ borderColor: `${customization.primaryColor}15` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: `${customization.textColor}70` }}
            >
              <Globe className="w-3 h-3" />
              <span>EN</span>
            </button>
            <span style={{ color: `${customization.textColor}50` }}>|</span>
            <span style={{ color: `${customization.textColor}70` }}>
              Free shipping on orders over $100
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="hover:opacity-80 transition-opacity"
              style={{ color: `${customization.textColor}70` }}
            >
              Track Order
            </button>
            <span style={{ color: `${customization.textColor}50` }}>|</span>
            <button
              className="hover:opacity-80 transition-opacity"
              style={{ color: `${customization.textColor}70` }}
            >
              Help
            </button>
          </div>
        </motion.div>

        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="flex items-center gap-6">
            {leftNavItems.map((item, index) => (
              <motion.button
                key={item}
                className="relative text-sm font-medium tracking-wide uppercase"
                style={{
                  color:
                    activeItem === item
                      ? customization.primaryColor
                      : `${customization.textColor}90`,
                }}
                onHoverStart={() => setActiveItem(item)}
                onHoverEnd={() => setActiveItem(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5"
                  style={{ backgroundColor: customization.primaryColor }}
                  initial={{ width: 0 }}
                  animate={{ width: activeItem === item ? '100%' : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Center Logo */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="text-2xl font-bold tracking-widest"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                LUXE
              </div>
              <div
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ color: `${customization.textColor}60` }}
              >
                Boutique
              </div>
            </motion.div>
          </motion.div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-6">
            {rightNavItems.map((item, index) => (
              <motion.button
                key={item}
                className="relative text-sm font-medium tracking-wide uppercase"
                style={{
                  color:
                    activeItem === item
                      ? customization.primaryColor
                      : `${customization.textColor}90`,
                }}
                onHoverStart={() => setActiveItem(item)}
                onHoverEnd={() => setActiveItem(null)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5"
                  style={{ backgroundColor: customization.primaryColor }}
                  initial={{ width: 0 }}
                  animate={{ width: activeItem === item ? '100%' : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Icon Actions */}
        <motion.div
          className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="p-2 rounded-full transition-colors"
            style={{ color: `${customization.textColor}80` }}
            whileHover={{
              backgroundColor: `${customization.primaryColor}15`,
              color: customization.primaryColor,
            }}
          >
            <Search className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full transition-colors"
            style={{ color: `${customization.textColor}80` }}
            whileHover={{
              backgroundColor: `${customization.primaryColor}15`,
              color: customization.primaryColor,
            }}
          >
            <User className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full transition-colors relative"
            style={{ color: `${customization.textColor}80` }}
            whileHover={{
              backgroundColor: `${customization.primaryColor}15`,
              color: customization.primaryColor,
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <motion.span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: customization.primaryColor }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              3
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.header>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Centered Logo Header
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Elegant layout with logo in center, nav on sides
        </p>
      </div>
    </div>
  );
}
