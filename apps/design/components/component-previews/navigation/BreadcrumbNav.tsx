'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, Home, Folder, FileText, Settings } from 'lucide-react';
import { Customization } from '@/types/customization';

type BreadcrumbNavProps = {
  customization: Customization;
};

export function BreadcrumbNav({ customization }: BreadcrumbNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const breadcrumbs = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: Folder, label: 'Projects', href: '#' },
    { icon: Folder, label: 'Design System', href: '#' },
    { icon: FileText, label: 'Components', href: '#', current: true },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      {/* Main Breadcrumb */}
      <motion.nav
        className="flex items-center p-3 rounded-xl border"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.8)}`,
          backdropFilter: `blur(${blurAmount}px)`,
          borderColor: `${customization.primaryColor}20`,
          boxShadow: `0 4px 20px ${customization.primaryColor}10`,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {breadcrumbs.map((crumb, index) => {
            const Icon = crumb.icon;
            const isLast = index === breadcrumbs.length - 1;
            const isHovered = hoveredIndex === index;

            return (
              <motion.li
                key={crumb.label}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Breadcrumb Item */}
                <motion.a
                  href={crumb.href}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isHovered || isLast
                      ? `${customization.primaryColor}${opacityToHex(glassOpacity)}`
                      : 'transparent',
                    color: isLast
                      ? customization.primaryColor
                      : `${customization.textColor}${isHovered ? '' : '80'}`,
                  }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{crumb.label}</span>
                </motion.a>

                {/* Separator */}
                {!isLast && (
                  <motion.div
                    className="mx-1"
                    style={{ color: `${customization.textColor}30` }}
                    animate={{ x: isHovered ? 3 : 0 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </ol>
      </motion.nav>

      {/* Alternative Style - Pill Breadcrumbs */}
      <motion.nav
        className="flex items-center gap-2 mt-4 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {breadcrumbs.map((crumb, index) => {
          const Icon = crumb.icon;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <motion.div key={`pill-${crumb.label}`} className="flex items-center gap-2">
              <motion.a
                href={crumb.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border"
                style={{
                  backgroundColor: isLast ? customization.primaryColor : 'transparent',
                  borderColor: isLast
                    ? customization.primaryColor
                    : `${customization.primaryColor}30`,
                  color: isLast
                    ? customization.backgroundColor
                    : `${customization.textColor}80`,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: isLast
                    ? customization.primaryColor
                    : `${customization.primaryColor}20`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{crumb.label}</span>
              </motion.a>
              {!isLast && (
                <motion.span
                  style={{ color: `${customization.primaryColor}50` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                >
                  /
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Compact Version */}
      <motion.div
        className="flex items-center gap-2 mt-4 text-sm"
        style={{ color: `${customization.textColor}60` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Home className="w-4 h-4" style={{ color: customization.primaryColor }} />
        <span>/</span>
        <span>...</span>
        <span>/</span>
        <motion.span
          className="px-2 py-0.5 rounded-md font-medium"
          style={{
            backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity)}`,
            color: customization.primaryColor,
          }}
        >
          Components
        </motion.span>
      </motion.div>

      {/* Description */}
      <p
        className="text-xs mt-4 opacity-50 text-center"
        style={{ color: customization.textColor }}
      >
        Breadcrumb navigation with animated separators and hover effects
      </p>
    </div>
  );
}
