'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Home, User, Settings, Bell, BarChart3, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type TabsNavProps = {
  customization: Customization;
};

export function TabsNav({ customization }: TabsNavProps) {
  const [activeTab, setActiveTab] = useState(0);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const tabs = [
    { icon: Home, label: 'Dashboard', content: 'Dashboard overview with key metrics and insights.' },
    { icon: BarChart3, label: 'Analytics', content: 'Track your performance and growth trends.' },
    { icon: User, label: 'Profile', content: 'Manage your profile settings and preferences.' },
    { icon: Bell, label: 'Notifications', content: 'View and manage your notifications.' },
    { icon: Settings, label: 'Settings', content: 'Configure your application settings.' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      {/* Tabs Container */}
      <motion.div
        className="p-1.5 rounded-xl border"
        style={{
          backgroundColor: `${customization.backgroundColor}`,
          borderColor: `${customization.primaryColor}20`,
          boxShadow: `0 4px 20px ${customization.primaryColor}10`,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative flex">
          {/* Active Tab Indicator */}
          <motion.div
            className="absolute top-0 bottom-0 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
              boxShadow: `0 4px 15px ${customization.primaryColor}40`,
            }}
            layoutId="activeTab"
            animate={{
              width: `${100 / tabs.length}%`,
              x: `${activeTab * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />

          {/* Tab Buttons */}
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;

            return (
              <motion.button
                key={tab.label}
                className="relative flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg z-10"
                onClick={() => setActiveTab(index)}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{
                    color: isActive ? customization.backgroundColor : `${customization.textColor}70`,
                  }}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        className="mt-4 p-5 rounded-xl border"
        style={{
          backgroundColor: `${customization.backgroundColor}`,
          borderColor: `${customization.primaryColor}20`,
        }}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
              }}
            >
              {(() => {
                const Icon = tabs[activeTab].icon;
                return <Icon className="w-5 h-5" style={{ color: customization.primaryColor }} />;
              })()}
            </div>
            <h3 className="text-lg font-bold" style={{ color: customization.textColor }}>
              {tabs[activeTab].label}
            </h3>
          </div>
          <p className="text-sm opacity-70" style={{ color: customization.textColor }}>
            {tabs[activeTab].content}
          </p>
        </motion.div>
      </motion.div>

      {/* Alternative Pills Style */}
      <motion.div
        className="flex gap-2 mt-6 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {tabs.slice(0, 3).map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;

          return (
            <motion.button
              key={`pill-${tab.label}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
              style={{
                backgroundColor: isActive ? `${customization.primaryColor}15` : 'transparent',
                borderColor: isActive ? customization.primaryColor : `${customization.primaryColor}30`,
                color: isActive ? customization.primaryColor : `${customization.textColor}70`,
              }}
              onClick={() => setActiveTab(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: customization.primaryColor }}
                  layoutId="pillIndicator"
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Underline Style Tabs */}
      <motion.div
        className="flex mt-6 border-b"
        style={{ borderColor: `${customization.primaryColor}20` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {tabs.slice(0, 4).map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;

          return (
            <motion.button
              key={`underline-${tab.label}`}
              className="relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium"
              style={{
                color: isActive ? customization.primaryColor : `${customization.textColor}60`,
              }}
              onClick={() => setActiveTab(index)}
              whileHover={{ color: customization.primaryColor }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{
                    background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  }}
                  layoutId="underlineIndicator"
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
