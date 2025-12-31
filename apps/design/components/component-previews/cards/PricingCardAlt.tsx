'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, X, Zap, Crown, Sparkles } from 'lucide-react';
import { Customization } from '@/types/customization';

type PricingCardAltProps = {
  customization: Customization;
};

export function PricingCardAlt({ customization }: PricingCardAltProps) {
  const [isAnnual, setIsAnnual] = useState(true);
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;

  // Convert percentage to hex for opacity values
  const opacityHex = Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0');
  const shadowOpacityHex = Math.round(glassOpacity * 3.3 * 2.55).toString(16).padStart(2, '0');
  const toggleBgOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const iconBgOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const featureBgOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const featureDisabledOpacityHex = Math.round(glassOpacity * 0.7 * 2.55).toString(16).padStart(2, '0');
  const buttonShadowOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const monthlyPrice = 29;
  const annualPrice = 24;
  const currentPrice = isAnnual ? annualPrice : monthlyPrice;
  const savings = ((monthlyPrice - annualPrice) * 12);

  const features = [
    { name: 'Unlimited Projects', included: true },
    { name: 'Advanced Analytics', included: true },
    { name: 'Priority Support', included: true },
    { name: 'Custom Integrations', included: true },
    { name: 'Team Collaboration', included: true },
    { name: 'API Access', included: true },
    { name: 'White-label Options', included: false },
    { name: 'Dedicated Account Manager', included: false },
  ];

  return (
    <motion.div
      className="relative w-full max-w-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor}, ${customization.primaryColor})`,
          backgroundSize: '200% 200%',
          padding: '2px',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="w-full h-full rounded-2xl"
          style={{ backgroundColor: customization.backgroundColor }}
        />
      </motion.div>

      <div
        className="relative p-6"
        style={{
          ...baseStyle,
          color: customization.textColor,
        }}
      >
        {/* Popular Badge */}
        <motion.div
          className="absolute -top-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: customization.backgroundColor,
            boxShadow: `0 4px 20px ${customization.primaryColor}${shadowOpacityHex}`,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Crown className="w-3.5 h-3.5" />
          MOST POPULAR
        </motion.div>

        {/* Header */}
        <div className="text-center mt-6 mb-6">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}${iconBgOpacityHex}, ${customization.secondaryColor}${iconBgOpacityHex})`,
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Zap className="w-8 h-8" style={{ color: customization.primaryColor }} />
          </motion.div>
          <h3 className="text-2xl font-bold mb-1">Pro Plan</h3>
          <p className="text-sm opacity-60">Perfect for growing teams</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span
            className={`text-sm ${!isAnnual ? 'opacity-100' : 'opacity-50'}`}
            style={{ color: !isAnnual ? customization.primaryColor : undefined }}
          >
            Monthly
          </span>
          <motion.button
            className="relative w-14 h-7 rounded-full p-1"
            style={{
              backgroundColor: `${customization.primaryColor}${toggleBgOpacityHex}`,
            }}
            onClick={() => setIsAnnual(!isAnnual)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                boxShadow: `0 2px 8px ${customization.primaryColor}${shadowOpacityHex}`,
              }}
              animate={{ x: isAnnual ? 26 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <span
            className={`text-sm ${isAnnual ? 'opacity-100' : 'opacity-50'}`}
            style={{ color: isAnnual ? customization.primaryColor : undefined }}
          >
            Annual
          </span>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg opacity-60">$</span>
            <motion.span
              className="text-5xl font-bold"
              style={{ color: customization.primaryColor }}
              key={currentPrice}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {currentPrice}
            </motion.span>
            <span className="text-lg opacity-60">/mo</span>
          </div>
          {isAnnual && (
            <motion.p
              className="text-sm mt-2 flex items-center justify-center gap-1"
              style={{ color: '#22c55e' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className="w-4 h-4" />
              Save ${savings} per year
            </motion.p>
          )}
          <p className="text-xs opacity-50 mt-1">Billed {isAnnual ? 'annually' : 'monthly'}</p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: feature.included
                    ? `${customization.primaryColor}${featureBgOpacityHex}`
                    : `${customization.textColor}${featureDisabledOpacityHex}`,
                }}
              >
                {feature.included ? (
                  <Check
                    className="w-3 h-3"
                    style={{ color: customization.primaryColor }}
                  />
                ) : (
                  <X
                    className="w-3 h-3"
                    style={{ color: `${customization.textColor}${buttonShadowOpacityHex}` }}
                  />
                )}
              </div>
              <span
                className={`text-sm ${feature.included ? 'opacity-90' : 'opacity-40'}`}
              >
                {feature.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className="w-full py-4 rounded-xl font-semibold text-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: customization.backgroundColor,
            boxShadow: `0 10px 30px ${customization.primaryColor}${buttonShadowOpacityHex}`,
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: `0 15px 40px ${customization.primaryColor}${Math.round(glassOpacity * 4 * 2.55).toString(16).padStart(2, '0')}`,
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative">Get Started</span>
        </motion.button>

        {/* Trust Badge */}
        <p className="text-xs text-center mt-4 opacity-50">
          14-day free trial. No credit card required.
        </p>
      </div>
    </motion.div>
  );
}
