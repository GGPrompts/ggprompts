'use client';

import { motion } from 'framer-motion';
import {
  MessageSquare,
  UserPlus,
  CreditCard,
  Star,
  Bell,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { Customization } from '@/types/customization';

type ActivityFeedProps = {
  customization: Customization;
};

export function ActivityFeed({ customization }: ActivityFeedProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const activities = [
    {
      id: 1,
      type: 'comment',
      icon: MessageSquare,
      user: 'Sarah Chen',
      avatar: 'SC',
      action: 'commented on',
      target: 'Project Alpha',
      time: '2 min ago',
      color: customization.primaryColor,
    },
    {
      id: 2,
      type: 'user',
      icon: UserPlus,
      user: 'Mike Johnson',
      avatar: 'MJ',
      action: 'joined the team',
      target: '',
      time: '15 min ago',
      color: '#10b981',
    },
    {
      id: 3,
      type: 'payment',
      icon: CreditCard,
      user: 'Emma Wilson',
      avatar: 'EW',
      action: 'processed payment for',
      target: '$2,480.00',
      time: '1 hour ago',
      color: customization.secondaryColor,
    },
    {
      id: 4,
      type: 'review',
      icon: Star,
      user: 'Alex Turner',
      avatar: 'AT',
      action: 'left a 5-star review',
      target: '',
      time: '2 hours ago',
      color: '#f59e0b',
    },
    {
      id: 5,
      type: 'alert',
      icon: AlertCircle,
      user: 'System',
      avatar: 'SY',
      action: 'detected unusual activity in',
      target: 'Dashboard API',
      time: '3 hours ago',
      color: '#ef4444',
    },
    {
      id: 6,
      type: 'delivery',
      icon: Package,
      user: 'Delivery Bot',
      avatar: 'DB',
      action: 'shipped order',
      target: '#ORD-2847',
      time: '5 hours ago',
      color: '#a855f7',
    },
  ];

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="p-4 border overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityHex}`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: `${customization.primaryColor}20` }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bell className="w-4 h-4" style={{ color: customization.primaryColor }} />
            </motion.div>
            <h3 className="font-semibold" style={{ color: customization.textColor }}>
              Activity Feed
            </h3>
          </div>
          <motion.span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${customization.primaryColor}20`,
              color: customization.primaryColor,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            Live
          </motion.span>
        </div>

        <div className="space-y-1 max-h-[280px] overflow-y-auto">
          {activities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <motion.div
                key={activity.id}
                className="flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'transparent',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{
                  backgroundColor: `${customization.primaryColor}10`,
                }}
              >
                {/* Avatar */}
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${activity.color}40, ${activity.color}20)`,
                      color: activity.color,
                    }}
                  >
                    {activity.avatar}
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full"
                    style={{
                      backgroundColor: customization.backgroundColor,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.08 + 0.2 }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${activity.color}30`,
                      }}
                    >
                      <Icon className="w-2 h-2" style={{ color: activity.color }} />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight" style={{ color: customization.textColor }}>
                    <span className="font-medium">{activity.user}</span>
                    <span style={{ color: `${customization.textColor}70` }}> {activity.action} </span>
                    {activity.target && (
                      <span className="font-medium" style={{ color: activity.color }}>
                        {activity.target}
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}50` }}>
                    {activity.time}
                  </p>
                </div>

                {/* Action indicator */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.3 }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: activity.color,
                      boxShadow: `0 0 8px ${activity.color}60`,
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View all button */}
        <motion.button
          className="w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: `${customization.primaryColor}15`,
            color: customization.primaryColor,
          }}
          whileHover={{
            backgroundColor: `${customization.primaryColor}25`,
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          View all activity
        </motion.button>

        <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
          Live activity feed with avatars and timestamps
        </p>
      </motion.div>
    </div>
  );
}
