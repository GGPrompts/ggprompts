'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type NewsletterSignupProps = {
  customization: Customization;
};

export function NewsletterSignup({ customization }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-6 overflow-hidden"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.backgroundColor}, ${customization.backgroundColor}ee)`,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}30`,
          boxShadow: `0 20px 50px ${customization.primaryColor}${Math.round(shadowIntensity * 0.2).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background decoration */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
          style={{
            background: `radial-gradient(circle, ${customization.primaryColor}, transparent)`,
            filter: `blur(${blurAmount * 2}px)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [glassOpacity / 100 * 1.3, glassOpacity / 100 * 2, glassOpacity / 100 * 1.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10">
          {/* Icon and heading */}
          <div className="text-center mb-5">
            <motion.div
              className="inline-flex p-3 rounded-2xl mb-4"
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Mail className="w-6 h-6" style={{ color: customization.primaryColor }} />
            </motion.div>

            <motion.h3
              className="text-xl font-bold mb-2"
              style={{ color: customization.textColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Stay in the Loop
            </motion.h3>

            <motion.p
              className="text-sm"
              style={{ color: `${customization.textColor}60` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Get the latest updates, tips, and exclusive offers delivered to your inbox.
            </motion.p>
          </div>

          {/* Form or Success Message */}
          {!isSubscribed ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: `${customization.primaryColor}10`,
                    border: `1px solid ${customization.primaryColor}20`,
                    color: customization.textColor,
                  }}
                  required
                />
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  animate={{
                    x: email ? [0, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Mail className="w-4 h-4" style={{ color: `${customization.textColor}30` }} />
                </motion.div>
              </div>

              <motion.button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  boxShadow: `0 8px 24px ${customization.primaryColor}40`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 12px 32px ${customization.primaryColor}60`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, white, transparent)`,
                    opacity: 0.2,
                  }}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <span className="relative z-10">Subscribe Now</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              className="text-center p-6 rounded-xl"
              style={{
                backgroundColor: `${customization.primaryColor}10`,
                border: `1px solid ${customization.primaryColor}30`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="inline-flex p-3 rounded-full mb-3"
                style={{
                  background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
              <h4 className="font-semibold mb-1" style={{ color: customization.textColor }}>
                You're all set!
              </h4>
              <p className="text-xs" style={{ color: `${customization.textColor}60` }}>
                Check your inbox for a confirmation email.
              </p>
            </motion.div>
          )}

          {/* Benefits */}
          <motion.div
            className="mt-5 flex items-center justify-center gap-4 text-xs"
            style={{ color: `${customization.textColor}50` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" style={{ color: customization.primaryColor }} />
              Weekly tips
            </span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span>No spam</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span>Unsubscribe anytime</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
