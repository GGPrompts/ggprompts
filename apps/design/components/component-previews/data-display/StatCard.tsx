'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { Customization } from '@/types/customization';

type StatCardProps = {
  customization: Customization;
};

export function StatCard({ customization }: StatCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');
  const iconSize = parseInt(customization.iconSize) || 24;
  const showTrend = customization.showTrend !== 'false';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const stats = [
    { icon: Users, label: 'Active Users', value: '12,847', change: '+12.5%', isPositive: true },
    { icon: DollarSign, label: 'Revenue', value: '$48.2K', change: '+8.2%', isPositive: true },
    { icon: ShoppingCart, label: 'Orders', value: '1,429', change: '-3.1%', isPositive: false },
    { icon: Activity, label: 'Conversion', value: '3.24%', change: '+0.4%', isPositive: true },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={stat.label}
              className="relative p-4 border overflow-hidden"
              style={{
                backgroundColor: `${customization.backgroundColor}${opacityHex}`,
                borderColor: `${customization.primaryColor}30`,
                borderRadius: `${customization.borderRadius}px`,
                boxShadow: `0 4px 20px ${customization.primaryColor}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 8px 30px ${customization.primaryColor}${Math.round(shadowIntensity * 0.5).toString(16).padStart(2, '0')}`,
              }}
            >
              {/* Background gradient */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${customization.primaryColor}, transparent)`,
                  transform: 'translate(30%, -30%)',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${customization.primaryColor}20` }}
                  >
                    <Icon style={{ width: iconSize, height: iconSize, color: customization.primaryColor }} />
                  </div>
                  {showTrend && (
                    <div
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: stat.isPositive ? '#10b98115' : '#ef444415',
                        color: stat.isPositive ? '#10b981' : '#ef4444',
                      }}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {stat.change}
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <motion.p
                    className="text-2xl font-bold"
                    style={{ color: customization.textColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <p className="text-xs" style={{ color: `${customization.textColor}60` }}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        Animated stat cards with trend indicators
      </p>
    </div>
  );
}
