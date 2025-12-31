'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { Customization } from '@/types/customization';

type LoginCardProps = {
  customization: Customization;
};

export function LoginCard({ customization }: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <motion.div
        className="relative p-6 border overflow-hidden"
        style={{
          backgroundColor: `${customization.backgroundColor}f8`,
          borderColor: `${customization.primaryColor}30`,
          borderRadius: `${Number(customization.borderRadius) * 1.5}px`,
          boxShadow: `0 20px 60px ${customization.primaryColor}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background decoration */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${customization.primaryColor}, transparent)` }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex p-3 rounded-xl mb-3"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <Lock className="w-6 h-6" style={{ color: customization.primaryColor }} />
            </motion.div>
            <h2 className="text-xl font-bold" style={{ color: customization.textColor }}>
              Welcome Back
            </h2>
            <p className="text-sm mt-1" style={{ color: `${customization.textColor}60` }}>
              Sign in to your account
            </p>
          </div>

          {/* Social login */}
          <div className="flex gap-3 mb-6">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Chrome, label: 'Google' },
            ].map((provider, index) => {
              const Icon = provider.icon;
              return (
                <motion.button
                  key={provider.label}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg"
                  style={{
                    borderColor: `${customization.textColor}20`,
                    color: customization.textColor,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{
                    backgroundColor: `${customization.primaryColor}10`,
                    borderColor: `${customization.primaryColor}40`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{provider.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: `${customization.textColor}15` }} />
            <span className="text-xs" style={{ color: `${customization.textColor}40` }}>
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: `${customization.textColor}15` }} />
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 border rounded-lg transition-all"
                style={{
                  borderColor: focused === 'email' ? customization.primaryColor : `${customization.textColor}20`,
                  backgroundColor: focused === 'email' ? `${customization.primaryColor}08` : 'transparent',
                }}
              >
                <Mail
                  className="w-5 h-5"
                  style={{ color: focused === 'email' ? customization.primaryColor : `${customization.textColor}50` }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: customization.textColor }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 border rounded-lg transition-all"
                style={{
                  borderColor: focused === 'password' ? customization.primaryColor : `${customization.textColor}20`,
                  backgroundColor: focused === 'password' ? `${customization.primaryColor}08` : 'transparent',
                }}
              >
                <Lock
                  className="w-5 h-5"
                  style={{ color: focused === 'password' ? customization.primaryColor : `${customization.textColor}50` }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: customization.textColor }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: `${customization.textColor}50` }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: `${customization.textColor}50` }} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-current" style={{ accentColor: customization.primaryColor }} />
                <span style={{ color: `${customization.textColor}70` }}>Remember me</span>
              </label>
              <button type="button" style={{ color: customization.primaryColor }}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full py-3 font-medium text-white rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                boxShadow: `0 4px 20px ${customization.primaryColor}40`,
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${customization.primaryColor}60` }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center mt-4" style={{ color: `${customization.textColor}60` }}>
            Don't have an account?{' '}
            <button style={{ color: customization.primaryColor, fontWeight: 500 }}>
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
