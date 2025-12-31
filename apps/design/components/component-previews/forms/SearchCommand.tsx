'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, FileText, Code, Settings, User, ArrowRight } from 'lucide-react';
import { Customization } from '@/types/customization';

type SearchCommandProps = {
  customization: Customization;
};

export function SearchCommand({ customization }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const items = [
    { icon: FileText, label: 'Documents', shortcut: 'D' },
    { icon: Code, label: 'Code Snippets', shortcut: 'C' },
    { icon: Settings, label: 'Settings', shortcut: 'S' },
    { icon: User, label: 'Profile', shortcut: 'P' },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      className="w-full max-w-md overflow-hidden border"
      style={{
        ...baseStyle,
        backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 4)}`,
        backdropFilter: `blur(${blurAmount}px)`,
        borderColor: `${customization.primaryColor}40`,
        borderRadius: `${customization.borderRadius}px`,
        boxShadow: `0 20px 60px ${customization.primaryColor}20, inset 0 1px 0 ${customization.primaryColor}20`,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: `${customization.primaryColor}20` }}
      >
        <Search className="w-5 h-5" style={{ color: `${customization.textColor}60` }} />
        <input
          type="text"
          placeholder="Search anything..."
          className="flex-1 bg-transparent outline-none"
          style={{ color: customization.textColor }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          className="flex items-center gap-1 px-2 py-1 text-xs rounded"
          style={{ backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}`, color: customization.textColor }}
        >
          <span>Cmd</span>
          <span>K</span>
        </div>
      </div>
      <div className="py-2">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          const isSelected = index === selectedIndex;

          return (
            <motion.div
              key={item.label}
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              style={{
                backgroundColor: isSelected ? `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}` : 'transparent',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              animate={{ x: isSelected ? 4 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="w-4 h-4"
                  style={{ color: isSelected ? customization.primaryColor : `${customization.textColor}60` }}
                />
                <span style={{ color: customization.textColor }}>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${customization.textColor}10`,
                    color: `${customization.textColor}60`,
                  }}
                >
                  {item.shortcut}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ArrowRight className="w-4 h-4" style={{ color: customization.primaryColor }} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div
        className="px-4 py-2 text-xs border-t"
        style={{ borderColor: `${customization.primaryColor}20`, color: `${customization.textColor}50` }}
      >
        Use arrow keys to navigate
      </div>
    </motion.div>
  );
}
