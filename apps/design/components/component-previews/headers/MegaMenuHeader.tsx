'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  Zap,
  Shield,
  Cloud,
  Code,
  Database,
  BarChart,
  Users,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Layers,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type MegaMenuHeaderProps = {
  customization: Customization;
};

type MegaMenuItem = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type MegaMenu = {
  featured: { title: string; description: string; image: string };
  items: MegaMenuItem[];
};

export function MegaMenuHeader({ customization }: MegaMenuHeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const megaMenus: Record<string, MegaMenu> = {
    Products: {
      featured: {
        title: 'New: AI Assistant',
        description: 'Supercharge your workflow with intelligent automation',
        image: 'sparkles',
      },
      items: [
        { icon: Zap, title: 'Automation', description: 'Workflow automation tools' },
        { icon: Shield, title: 'Security', description: 'Enterprise-grade protection' },
        { icon: Cloud, title: 'Cloud', description: 'Scalable infrastructure' },
        { icon: Database, title: 'Database', description: 'Managed data storage' },
      ],
    },
    Solutions: {
      featured: {
        title: 'Enterprise Ready',
        description: 'Built for teams of all sizes',
        image: 'layers',
      },
      items: [
        { icon: Code, title: 'Developers', description: 'APIs and SDKs' },
        { icon: BarChart, title: 'Analytics', description: 'Data insights' },
        { icon: Users, title: 'Teams', description: 'Collaboration tools' },
        { icon: Layers, title: 'Platform', description: 'Full-stack solution' },
      ],
    },
    Resources: {
      featured: {
        title: 'Learning Center',
        description: 'Guides, tutorials, and best practices',
        image: 'book',
      },
      items: [
        { icon: BookOpen, title: 'Documentation', description: 'Technical guides' },
        { icon: MessageCircle, title: 'Community', description: 'Join the discussion' },
        { icon: Sparkles, title: 'Blog', description: 'Latest updates' },
        { icon: Users, title: 'Support', description: '24/7 help desk' },
      ],
    },
  };

  const navItems = [
    { label: 'Products', hasMegaMenu: true },
    { label: 'Solutions', hasMegaMenu: true },
    { label: 'Pricing', hasMegaMenu: false },
    { label: 'Resources', hasMegaMenu: true },
  ];

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      <div
        className="relative rounded-xl border"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
        }}
      >
        {/* Header */}
        <motion.header
          className="relative z-20 px-4 py-3 border-b overflow-visible"
          style={{ borderColor: `${customization.primaryColor}15` }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ color: customization.textColor }}>
                Acme
              </span>
            </motion.div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <motion.button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color:
                        openMenu === item.label
                          ? customization.primaryColor
                          : `${customization.textColor}90`,
                      backgroundColor:
                        openMenu === item.label ? `${customization.primaryColor}10` : 'transparent',
                    }}
                    whileHover={{
                      backgroundColor: `${customization.primaryColor}10`,
                    }}
                  >
                    {item.label}
                    {item.hasMegaMenu && (
                      <motion.div
                        animate={{ rotate: openMenu === item.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {item.hasMegaMenu && openMenu === item.label && megaMenus[item.label] && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] p-4 border rounded-xl z-50"
                        style={{
                          backgroundColor: customization.backgroundColor,
                          borderColor: `${customization.primaryColor}20`,
                          boxShadow: `0 20px 40px ${customization.primaryColor}15`,
                        }}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex gap-4">
                          {/* Featured section */}
                          <motion.div
                            className="w-2/5 p-4 rounded-lg"
                            style={{
                              background: `linear-gradient(135deg, ${customization.primaryColor}15, ${customization.secondaryColor}15)`,
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                              style={{
                                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                              }}
                            >
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h4
                              className="font-semibold mb-1"
                              style={{ color: customization.textColor }}
                            >
                              {megaMenus[item.label].featured.title}
                            </h4>
                            <p
                              className="text-xs mb-3"
                              style={{ color: `${customization.textColor}70` }}
                            >
                              {megaMenus[item.label].featured.description}
                            </p>
                            <motion.button
                              className="flex items-center gap-1 text-xs font-medium"
                              style={{ color: customization.primaryColor }}
                              whileHover={{ x: 3 }}
                            >
                              Learn more
                              <ArrowRight className="w-3 h-3" />
                            </motion.button>
                          </motion.div>

                          {/* Menu items */}
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            {megaMenus[item.label].items.map((menuItem, idx) => {
                              const Icon = menuItem.icon;
                              return (
                                <motion.button
                                  key={menuItem.title}
                                  className="flex items-start gap-3 p-3 rounded-lg text-left transition-colors"
                                  style={{ color: customization.textColor }}
                                  whileHover={{
                                    backgroundColor: `${customization.primaryColor}10`,
                                  }}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 * idx }}
                                >
                                  <div
                                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                    style={{
                                      backgroundColor: `${customization.primaryColor}15`,
                                      color: customization.primaryColor,
                                    }}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{menuItem.title}</div>
                                    <div
                                      className="text-xs"
                                      style={{ color: `${customization.textColor}60` }}
                                    >
                                      {menuItem.description}
                                    </div>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                className="px-4 py-2 text-sm font-medium rounded-lg"
                style={{ color: `${customization.textColor}90` }}
                whileHover={{ backgroundColor: `${customization.primaryColor}10` }}
              >
                Sign In
              </motion.button>
              <motion.button
                className="px-4 py-2 text-sm font-medium text-white rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Content area */}
        <div className="p-8 min-h-[120px]">
          <p
            className="text-center text-sm"
            style={{ color: `${customization.textColor}50` }}
          >
            Hover over Products, Solutions, or Resources to see mega menu
          </p>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Mega Menu Header
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Feature-rich dropdown with icons and sections
        </p>
      </div>
    </div>
  );
}
