'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Zap,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type MobileMenuNavProps = {
  customization: Customization;
};

export function MobileMenuNav({ customization }: MobileMenuNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: 3 },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: 12 },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 400, damping: 40 },
    },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 400, damping: 40 },
    },
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 300 },
    }),
  };

  return (
    <div className="w-full max-w-md" style={baseStyle}>
      {/* Mobile Header Bar */}
      <motion.header
        className="flex items-center justify-between px-4 py-3 border rounded-t-xl"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Hamburger Button */}
        <motion.button
          className="relative w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity)}`,
            color: customization.primaryColor,
          }}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            }}
          >
            <Zap className="w-4 h-4" style={{ color: customization.backgroundColor }} />
          </div>
          <span className="font-bold" style={{ color: customization.textColor }}>
            Acme
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ color: `${customization.textColor}70` }}
            whileHover={{ color: customization.primaryColor }}
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Content Preview Area */}
      <div
        className="relative h-96 border border-t-0 rounded-b-xl overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 2)}`,
          borderColor: `${customization.primaryColor}20`,
        }}
      >
        {/* Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0 bg-black/50 z-10"
              style={{ backdropFilter: `blur(${blurAmount / 3}px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.aside
              className="absolute top-0 left-0 bottom-0 w-72 z-20 flex flex-col"
              style={{
                backgroundColor: customization.backgroundColor,
                boxShadow: `10px 0 30px ${customization.primaryColor}20`,
              }}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Drawer Header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: `${customization.primaryColor}${opacityToHex(glassOpacity)}` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                      color: customization.backgroundColor,
                    }}
                  >
                    JD
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: customization.textColor }}>
                      John Doe
                    </p>
                    <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                      Pro Member
                    </p>
                  </div>
                </div>
                <motion.button
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`,
                    color: customization.primaryColor,
                  }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{
                        backgroundColor: isActive
                          ? `${customization.primaryColor}${opacityToHex(glassOpacity)}`
                          : 'transparent',
                        color: isActive
                          ? customization.primaryColor
                          : `${customization.textColor}80`,
                      }}
                      variants={itemVariants}
                      custom={index}
                      onClick={() => {
                        setActiveItem(item.id);
                        setIsOpen(false);
                      }}
                      whileHover={{
                        backgroundColor: isActive
                          ? `${customization.primaryColor}${opacityToHex(glassOpacity)}`
                          : `${customization.primaryColor}${opacityToHex(glassOpacity * 0.5)}`,
                        x: 5,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: isActive
                            ? `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}`
                            : `${customization.primaryColor}${opacityToHex(glassOpacity * 0.5)}`,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {item.badge && (
                        <span
                          className="px-2.5 py-1 text-xs font-bold rounded-full"
                          style={{
                            backgroundColor: customization.primaryColor,
                            color: customization.backgroundColor,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </motion.button>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <motion.div
                className="p-4 border-t"
                style={{ borderColor: `${customization.primaryColor}${opacityToHex(glassOpacity)}` }}
                variants={itemVariants}
                custom={menuItems.length}
              >
                <motion.button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 0.5)}`,
                    color: `${customization.textColor}70`,
                  }}
                  whileHover={{
                    backgroundColor: '#ef444420',
                    color: '#ef4444',
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Placeholder Content */}
        <div className="p-6 text-center">
          <p className="text-sm opacity-50" style={{ color: customization.textColor }}>
            Tap the menu icon to open the drawer
          </p>
        </div>
      </div>
    </div>
  );
}
