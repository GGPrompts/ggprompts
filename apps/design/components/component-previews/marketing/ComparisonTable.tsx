'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus, Crown } from 'lucide-react';
import { Customization } from '@/types/customization';

type ComparisonTableProps = {
  customization: Customization;
};

export function ComparisonTable({ customization }: ComparisonTableProps) {
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const features = [
    { name: 'Unlimited Projects', free: false, pro: true, enterprise: true },
    { name: 'Custom Domains', free: false, pro: true, enterprise: true },
    { name: 'API Access', free: 'Limited', pro: true, enterprise: true },
    { name: 'Team Members', free: '1', pro: '10', enterprise: 'Unlimited' },
    { name: 'Storage', free: '5GB', pro: '100GB', enterprise: 'Unlimited' },
    { name: 'Priority Support', free: false, pro: true, enterprise: true },
    { name: 'Custom Integrations', free: false, pro: false, enterprise: true },
    { name: 'SLA Guarantee', free: false, pro: false, enterprise: true },
  ];

  const plans = [
    { id: 'free', name: 'Free', price: '$0' },
    { id: 'pro', name: 'Pro', price: '$29', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom' },
  ];

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <motion.div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${customization.primaryColor}20` }}
          whileHover={{ scale: 1.2 }}
        >
          <Check className="w-3 h-3" style={{ color: customization.primaryColor }} />
        </motion.div>
      );
    }
    if (value === false) {
      return (
        <motion.div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${customization.textColor}10` }}
          whileHover={{ scale: 1.2 }}
        >
          <X className="w-3 h-3" style={{ color: `${customization.textColor}40` }} />
        </motion.div>
      );
    }
    return (
      <span className="text-xs font-medium" style={{ color: customization.textColor }}>
        {value}
      </span>
    );
  };

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative overflow-hidden"
        style={{
          background: customization.backgroundColor,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          border: `1px solid ${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-4 gap-2 p-4 border-b"
          style={{
            borderColor: `${customization.primaryColor}15`,
            background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}05, ${customization.secondaryColor}05)`,
          }}
        >
          <div className="text-xs font-medium" style={{ color: `${customization.textColor}60` }}>
            Features
          </div>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="text-center relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <div
                    className="px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1"
                    style={{
                      background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                      color: 'white',
                    }}
                  >
                    <Crown className="w-2 h-2" />
                    Popular
                  </div>
                </motion.div>
              )}
              <div
                className="text-xs font-bold mt-3"
                style={{ color: customization.textColor }}
              >
                {plan.name}
              </div>
              <div
                className="text-sm font-bold"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {plan.price}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table Body */}
        <div className="p-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="grid grid-cols-4 gap-2 p-3 rounded-lg items-center"
              style={{
                backgroundColor: index % 2 === 0 ? 'transparent' : `${customization.primaryColor}03`,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{
                backgroundColor: `${customization.primaryColor}08`,
              }}
            >
              <span className="text-xs" style={{ color: `${customization.textColor}80` }}>
                {feature.name}
              </span>
              <div className="flex justify-center">{renderValue(feature.free)}</div>
              <div className="flex justify-center">{renderValue(feature.pro)}</div>
              <div className="flex justify-center">{renderValue(feature.enterprise)}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA Row */}
        <div
          className="grid grid-cols-4 gap-2 p-4 border-t"
          style={{ borderColor: `${customization.primaryColor}15` }}
        >
          <div />
          {plans.map((plan, index) => (
            <motion.button
              key={plan.id}
              className="py-2 px-3 rounded-lg text-xs font-medium"
              style={{
                background: plan.popular
                  ? `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`
                  : `${customization.primaryColor}10`,
                color: plan.popular ? 'white' : customization.textColor,
                border: plan.popular ? 'none' : `1px solid ${customization.primaryColor}20`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: plan.popular
                  ? `0 8px 24px ${customization.primaryColor}40`
                  : `0 4px 12px ${customization.primaryColor}20`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
