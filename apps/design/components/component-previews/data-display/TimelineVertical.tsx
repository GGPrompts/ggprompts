'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  Rocket,
  Code,
  Zap,
  Package,
  Flag
} from 'lucide-react';
import { Customization } from '@/types/customization';

type TimelineVerticalProps = {
  customization: Customization;
};

export function TimelineVertical({ customization }: TimelineVerticalProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const events = [
    {
      id: 1,
      icon: Flag,
      title: 'Project Kickoff',
      description: 'Initial planning and team assembly completed',
      date: 'Jan 15, 2024',
      status: 'completed',
      color: '#10b981',
    },
    {
      id: 2,
      icon: Code,
      title: 'Development Phase',
      description: 'Core features implementation and API integration',
      date: 'Feb 20, 2024',
      status: 'completed',
      color: customization.primaryColor,
    },
    {
      id: 3,
      icon: Zap,
      title: 'Beta Testing',
      description: 'Internal testing and bug fixes in progress',
      date: 'Mar 10, 2024',
      status: 'current',
      color: customization.secondaryColor,
    },
    {
      id: 4,
      icon: Package,
      title: 'Production Deploy',
      description: 'Final deployment to production servers',
      date: 'Apr 01, 2024',
      status: 'upcoming',
      color: '#a855f7',
    },
    {
      id: 5,
      icon: Rocket,
      title: 'Public Launch',
      description: 'Official product launch and marketing campaign',
      date: 'Apr 15, 2024',
      status: 'upcoming',
      color: '#f59e0b',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'current':
        return Clock;
      default:
        return Circle;
    }
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="p-5 border overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}${opacityHex}`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold" style={{ color: customization.textColor }}>
              Project Timeline
            </h3>
            <p className="text-xs mt-0.5" style={{ color: `${customization.textColor}60` }}>
              Development roadmap
            </p>
          </div>
          <motion.div
            className="px-2 py-1 rounded-full text-xs"
            style={{
              backgroundColor: `${customization.secondaryColor}20`,
              color: customization.secondaryColor,
            }}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            In Progress
          </motion.div>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: `${customization.textColor}15` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Events */}
          <div className="space-y-4">
            {events.map((event, index) => {
              const EventIcon = event.icon;
              const StatusIcon = getStatusIcon(event.status);
              const isCompleted = event.status === 'completed';
              const isCurrent = event.status === 'current';

              return (
                <motion.div
                  key={event.id}
                  className="relative flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.12 }}
                >
                  {/* Timeline node */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.12 + 0.1, type: 'spring' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isCompleted || isCurrent
                          ? `${event.color}20`
                          : `${customization.textColor}10`,
                        boxShadow: isCurrent ? `0 0 20px ${event.color}40` : 'none',
                      }}
                    >
                      <StatusIcon
                        className="w-4 h-4"
                        style={{
                          color: isCompleted || isCurrent
                            ? event.color
                            : `${customization.textColor}40`,
                        }}
                      />
                    </div>

                    {/* Pulse animation for current */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: `2px solid ${event.color}`,
                        }}
                        animate={{
                          scale: [1, 1.4, 1.4],
                          opacity: [0.6, 0, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Content card */}
                  <motion.div
                    className="flex-1 p-3 rounded-lg border"
                    style={{
                      backgroundColor: isCurrent
                        ? `${event.color}08`
                        : 'transparent',
                      borderColor: isCurrent
                        ? `${event.color}30`
                        : `${customization.textColor}10`,
                    }}
                    whileHover={{
                      backgroundColor: `${event.color}10`,
                      borderColor: `${event.color}30`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <EventIcon
                          className="w-4 h-4"
                          style={{
                            color: isCompleted || isCurrent
                              ? event.color
                              : `${customization.textColor}50`,
                          }}
                        />
                        <h4
                          className="text-sm font-medium"
                          style={{
                            color: isCompleted || isCurrent
                              ? customization.textColor
                              : `${customization.textColor}60`,
                          }}
                        >
                          {event.title}
                        </h4>
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: `${customization.textColor}50` }}
                      >
                        {event.date}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: isCompleted || isCurrent
                          ? `${customization.textColor}70`
                          : `${customization.textColor}40`,
                      }}
                    >
                      {event.description}
                    </p>

                    {/* Progress indicator for current */}
                    {isCurrent && (
                      <motion.div
                        className="mt-2 h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: `${event.color}20` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${event.color}, ${event.color}80)`,
                          }}
                          initial={{ width: '0%' }}
                          animate={{ width: '65%' }}
                          transition={{ duration: 1, delay: 0.6 }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <p className="text-xs opacity-50 text-center mt-4" style={{ color: customization.textColor }}>
          Vertical timeline with status indicators
        </p>
      </motion.div>
    </div>
  );
}
