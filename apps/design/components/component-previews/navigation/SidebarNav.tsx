'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Home,
  BarChart3,
  Users,
  Folder,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Zap,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type SidebarNavProps = {
  customization: Customization;
};

export function SidebarNav({ customization }: SidebarNavProps) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedSection, setExpandedSection] = useState<string | null>('projects');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarWidth = parseInt(customization.sidebarWidth) || 240;
  const collapseWidth = parseInt(customization.collapseWidth) || 70;

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const navSections = [
    {
      id: 'main',
      items: [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics', badge: 'New' },
        { id: 'team', icon: Users, label: 'Team' },
      ],
    },
    {
      id: 'projects',
      label: 'Projects',
      expandable: true,
      items: [
        { id: 'all-projects', icon: Folder, label: 'All Projects' },
        { id: 'design-system', icon: Zap, label: 'Design System' },
        { id: 'mobile-app', icon: Zap, label: 'Mobile App' },
      ],
    },
    {
      id: 'settings',
      items: [
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'help', icon: HelpCircle, label: 'Help & Support' },
      ],
    },
  ];

  const NavItem = ({ item, isNested = false }: { item: any; isNested?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <motion.button
        className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left ${
          isNested ? 'ml-6' : ''
        }`}
        style={{
          backgroundColor: isActive ? `${customization.primaryColor}15` : 'transparent',
          color: isActive ? customization.primaryColor : `${customization.textColor}80`,
        }}
        onClick={() => setActiveItem(item.id)}
        whileHover={{
          backgroundColor: isActive
            ? `${customization.primaryColor}15`
            : `${customization.primaryColor}08`,
          x: 4,
        }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
            style={{ backgroundColor: customization.primaryColor }}
            layoutId="activeIndicator"
          />
        )}
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.badge && (
              <motion.span
                className="px-2 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor: customization.primaryColor,
                  color: customization.backgroundColor,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {item.badge}
              </motion.span>
            )}
          </>
        )}
      </motion.button>
    );
  };

  return (
    <div className="flex gap-4" style={baseStyle}>
      {/* Main Sidebar */}
      <motion.aside
        className="flex flex-col border rounded-xl overflow-hidden"
        style={{
          width: isCollapsed ? collapseWidth : sidebarWidth,
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
          boxShadow: `0 4px 20px ${customization.primaryColor}10`,
        }}
        animate={{ width: isCollapsed ? collapseWidth : sidebarWidth }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: `${customization.primaryColor}15` }}
        >
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
              >
                <Zap className="w-4 h-4" style={{ color: customization.backgroundColor }} />
              </div>
              <span className="font-bold" style={{ color: customization.textColor }}>
                Acme Inc
              </span>
            </motion.div>
          )}
          <motion.button
            className="p-2 rounded-lg"
            style={{ color: `${customization.textColor}60` }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ backgroundColor: `${customization.primaryColor}10` }}
          >
            <ChevronRight
              className="w-4 h-4"
              style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
            />
          </motion.button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <motion.div
            className="p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: `${customization.primaryColor}08`,
                border: `1px solid ${customization.primaryColor}15`,
              }}
            >
              <Search className="w-4 h-4" style={{ color: `${customization.textColor}50` }} />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: customization.textColor }}
              />
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.id} className="mb-4">
              {section.expandable && !isCollapsed && (
                <motion.button
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: `${customization.textColor}50` }}
                  onClick={() =>
                    setExpandedSection(expandedSection === section.id ? null : section.id)
                  }
                >
                  {section.label}
                  <motion.div
                    animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </motion.button>
              )}
              <AnimatePresence>
                {(!section.expandable || expandedSection === section.id || isCollapsed) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    {section.items.map((item) => (
                      <NavItem key={item.id} item={item} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="p-3 border-t"
          style={{ borderColor: `${customization.primaryColor}15` }}
        >
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-3 p-2 rounded-lg"
              style={{ backgroundColor: `${customization.primaryColor}08` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  color: customization.backgroundColor,
                }}
              >
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: customization.textColor }}>
                  John Doe
                </p>
                <p className="text-xs truncate" style={{ color: `${customization.textColor}50` }}>
                  john@acme.com
                </p>
              </div>
              <motion.button
                className="p-1.5 rounded-lg"
                style={{ color: `${customization.textColor}50` }}
                whileHover={{ color: customization.primaryColor }}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Preview Info */}
      <div
        className="text-xs opacity-50 mt-2"
        style={{ color: customization.textColor }}
      >
        Click the arrow to collapse
      </div>
    </div>
  );
}
