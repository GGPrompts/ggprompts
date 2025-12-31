'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Search, FileText, Zap, Settings, LogOut, Plus, GitBranch, Code } from 'lucide-react';
import { Customization } from '@/types/customization';

type CommandPaletteProps = {
  customization: Customization;
};

export function CommandPalette({ customization }: CommandPaletteProps) {
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

  const commandGroups = [
    {
      label: 'Quick Actions',
      items: [
        { icon: Plus, label: 'New Project', shortcut: 'N' },
        { icon: Zap, label: 'Quick Deploy', shortcut: 'D' },
        { icon: Code, label: 'Open Editor', shortcut: 'E' },
      ],
    },
    {
      label: 'Navigation',
      items: [
        { icon: FileText, label: 'Go to Dashboard', shortcut: '1' },
        { icon: GitBranch, label: 'Switch Branch', shortcut: 'B' },
        { icon: Settings, label: 'Preferences', shortcut: ',' },
      ],
    },
  ];

  const flatItems = commandGroups.flatMap((group) => group.items);
  const filteredGroups = commandGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  let itemCounter = -1;

  return (
    <motion.div
      className="w-full max-w-md overflow-hidden border"
      style={{
        ...baseStyle,
        backgroundColor: `${customization.backgroundColor}98`,
        borderColor: `${customization.primaryColor}30`,
        borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
        boxShadow: `0 25px 50px -12px ${customization.primaryColor}30`,
        backdropFilter: `blur(${blurAmount}px)`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Search Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b"
        style={{ borderColor: `${customization.primaryColor}15` }}
      >
        <Search className="w-5 h-5" style={{ color: customization.primaryColor }} />
        <input
          type="text"
          placeholder="Type a command or search..."
          className="flex-1 bg-transparent outline-none text-base"
          style={{ color: customization.textColor }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
        />
      </div>

      {/* Command Groups */}
      <div className="max-h-80 overflow-y-auto py-2">
        <AnimatePresence mode="popLayout">
          {filteredGroups.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: groupIndex * 0.05 }}
            >
              <div
                className="px-4 py-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: `${customization.textColor}50` }}
              >
                {group.label}
              </div>
              {group.items.map((item) => {
                itemCounter++;
                const currentIndex = itemCounter;
                const Icon = item.icon;
                const isSelected = currentIndex === selectedIndex;

                return (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? `${customization.primaryColor}15` : 'transparent',
                    }}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-1.5 rounded-md"
                        style={{
                          backgroundColor: isSelected
                            ? `${customization.primaryColor}25`
                            : `${customization.textColor}08`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{
                            color: isSelected ? customization.primaryColor : `${customization.textColor}70`,
                          }}
                        />
                      </div>
                      <span style={{ color: customization.textColor }}>{item.label}</span>
                    </div>
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 text-xs rounded"
                      style={{
                        backgroundColor: `${customization.textColor}08`,
                        color: `${customization.textColor}50`,
                      }}
                    >
                      <span style={{ fontSize: '10px' }}>Cmd</span>
                      <span>{item.shortcut}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-3 text-xs border-t"
        style={{ borderColor: `${customization.primaryColor}15`, color: `${customization.textColor}50` }}
      >
        <div className="flex items-center gap-4">
          <span>Navigate with arrows</span>
          <span>Enter to select</span>
        </div>
        <span>ESC to close</span>
      </div>
    </motion.div>
  );
}
