'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Award, CheckCircle, Star } from 'lucide-react';
import { Customization } from '@/types/customization';

type TrustBadgesProps = {
  customization: Customization;
};

export function TrustBadges({ customization }: TrustBadgesProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const badges = [
    { icon: Shield, label: 'SOC 2 Type II', sublabel: 'Certified' },
    { icon: Lock, label: 'GDPR', sublabel: 'Compliant' },
    { icon: Award, label: 'ISO 27001', sublabel: 'Certified' },
    { icon: CheckCircle, label: '99.99%', sublabel: 'Uptime SLA' },
    { icon: Star, label: '4.9/5', sublabel: 'G2 Rating' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-5 overflow-hidden"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.backgroundColor}, ${customization.backgroundColor}ee)`,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          border: `1px solid ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(ellipse at center, ${customization.primaryColor}, transparent 70%)`,
          }}
        />

        {/* Title */}
        <motion.p
          className="text-center text-xs font-medium uppercase tracking-wider mb-4"
          style={{ color: `${customization.textColor}50` }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Enterprise-grade security & compliance
        </motion.p>

        {/* Badges row */}
        <div className="flex items-center justify-between gap-2">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                className="flex flex-col items-center text-center p-3 rounded-xl flex-1 group cursor-pointer"
                style={{
                  backgroundColor: `${customization.primaryColor}05`,
                  border: `1px solid ${customization.primaryColor}10`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: `${customization.primaryColor}15`,
                  borderColor: `${customization.primaryColor}40`,
                  boxShadow: `0 8px 24px ${customization.primaryColor}20`,
                }}
              >
                {/* Icon with glow */}
                <motion.div
                  className="relative mb-2"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60"
                    style={{ backgroundColor: customization.primaryColor }}
                    transition={{ duration: 0.3 }}
                  />
                  <div
                    className="relative p-2 rounded-lg"
                    style={{
                      background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: customization.primaryColor }}
                    />
                  </div>
                </motion.div>

                {/* Label */}
                <span
                  className="text-xs font-bold"
                  style={{
                    background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {badge.label}
                </span>

                {/* Sublabel */}
                <span
                  className="text-[10px]"
                  style={{ color: `${customization.textColor}50` }}
                >
                  {badge.sublabel}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${customization.primaryColor}30)`,
            }}
          />
          <Lock className="w-3 h-3" style={{ color: `${customization.textColor}30` }} />
          <span className="text-[10px]" style={{ color: `${customization.textColor}40` }}>
            Bank-level encryption
          </span>
          <div
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, ${customization.primaryColor}30, transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
