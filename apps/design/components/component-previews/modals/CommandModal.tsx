'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Search,
  Command,
  FileText,
  Settings,
  User,
  Folder,
  GitBranch,
  Terminal,
  Keyboard,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type CommandModalProps = {
  customization: Customization;
};

type CommandItem = {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  group: string;
};

export function CommandModal({ customization }: CommandModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const backdropOpacity = parseInt(customization.backdropOpacity || '50') || 50;
  const backdropHex = Math.round(backdropOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const commands: CommandItem[] = [
    { id: '1', label: 'Open File', shortcut: 'Ctrl+O', icon: FileText, group: 'File' },
    { id: '2', label: 'New Folder', shortcut: 'Ctrl+N', icon: Folder, group: 'File' },
    { id: '3', label: 'Settings', shortcut: 'Ctrl+,', icon: Settings, group: 'Preferences' },
    { id: '4', label: 'User Profile', icon: User, group: 'Preferences' },
    { id: '5', label: 'Git: Commit', shortcut: 'Ctrl+G', icon: GitBranch, group: 'Source Control' },
    { id: '6', label: 'Open Terminal', shortcut: 'Ctrl+`', icon: Terminal, group: 'View' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '320px' }}>
      {/* Trigger button */}
      {!isOpen && (
        <motion.button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2.5 font-medium rounded-lg flex items-center gap-2 border"
          style={{
            backgroundColor: customization.backgroundColor,
            borderColor: `${customization.primaryColor}40`,
            color: customization.textColor,
          }}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05, borderColor: customization.primaryColor }}
          whileTap={{ scale: 0.95 }}
        >
          <Command className="w-4 h-4" style={{ color: customization.primaryColor }} />
          Command Palette
          <span
            className="text-xs px-1.5 py-0.5 rounded ml-1"
            style={{
              backgroundColor: `${customization.textColor}10`,
              color: `${customization.textColor}60`,
            }}
          >
            Ctrl+K
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: `${customization.backgroundColor}${backdropHex}`, backdropFilter: `blur(${blurAmount}px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Command Modal */}
            <motion.div
              className="absolute left-1/2 top-4 w-[95%] max-w-sm -translate-x-1/2 border overflow-hidden"
              style={{
                backgroundColor: customization.backgroundColor,
                borderColor: `${customization.primaryColor}30`,
                borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
                boxShadow: `0 20px 40px ${customization.primaryColor}20`,
              }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: `${customization.textColor}15` }}
              >
                <Search className="w-4 h-4" style={{ color: `${customization.textColor}50` }} />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: customization.textColor }}
                  autoFocus
                />
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${customization.textColor}10`,
                    color: `${customization.textColor}50`,
                  }}
                >
                  ESC
                </span>
              </div>

              {/* Command list */}
              <div className="max-h-52 overflow-y-auto py-2">
                {Object.entries(groupedCommands).map(([group, items]) => (
                  <div key={group}>
                    <div
                      className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider"
                      style={{ color: `${customization.textColor}50` }}
                    >
                      {group}
                    </div>
                    {items.map((cmd, idx) => {
                      const Icon = cmd.icon;
                      const globalIdx = filteredCommands.indexOf(cmd);
                      const isSelected = globalIdx === selectedIndex;

                      return (
                        <motion.button
                          key={cmd.id}
                          className="w-full flex items-center gap-3 px-4 py-2"
                          style={{
                            backgroundColor: isSelected
                              ? `${customization.primaryColor}15`
                              : 'transparent',
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          onClick={() => setIsOpen(false)}
                          whileHover={{ backgroundColor: `${customization.primaryColor}15` }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{
                              color: isSelected
                                ? customization.primaryColor
                                : `${customization.textColor}60`,
                            }}
                          />
                          <span
                            className="flex-1 text-left text-sm"
                            style={{ color: customization.textColor }}
                          >
                            {cmd.label}
                          </span>
                          {cmd.shortcut && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: `${customization.textColor}08`,
                                color: `${customization.textColor}50`,
                              }}
                            >
                              {cmd.shortcut}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
                {filteredCommands.length === 0 && (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: `${customization.textColor}50` }}
                  >
                    No commands found
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center gap-4 px-4 py-2 border-t text-xs"
                style={{
                  borderColor: `${customization.textColor}15`,
                  color: `${customization.textColor}50`,
                }}
              >
                <div className="flex items-center gap-1">
                  <Keyboard className="w-3 h-3" />
                  <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1 rounded" style={{ backgroundColor: `${customization.textColor}10` }}>
                    Enter
                  </span>
                  <span>to select</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
