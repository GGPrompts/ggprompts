'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { Customization } from '@/types/customization';

type PasswordInputProps = {
  customization: Customization;
};

type StrengthRule = {
  label: string;
  check: (password: string) => boolean;
};

const strengthRules: StrengthRule[] = [
  { label: 'At least 8 characters', check: (p) => p.length >= 8 },
  { label: 'Contains uppercase', check: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase', check: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', check: (p) => /[0-9]/.test(p) },
  { label: 'Contains special char', check: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordInput({ customization }: PasswordInputProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const passedRules = useMemo(() => {
    return strengthRules.filter((rule) => rule.check(password));
  }, [password]);

  const strength = passedRules.length;
  const strengthPercentage = (strength / strengthRules.length) * 100;

  const getStrengthColor = () => {
    if (strength <= 1) return '#ef4444'; // red
    if (strength <= 2) return '#f97316'; // orange
    if (strength <= 3) return '#eab308'; // yellow
    if (strength <= 4) return '#22c55e'; // green
    return customization.primaryColor; // primary for all passed
  };

  const getStrengthLabel = () => {
    if (strength === 0) return 'Enter password';
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <label
        className="block mb-2 text-sm font-medium"
        style={{ color: `${customization.textColor}90` }}
      >
        Create Password
      </label>

      {/* Input Container */}
      <motion.div
        className="relative"
        animate={{
          boxShadow: isFocused ? `0 0 20px ${customization.primaryColor}30` : 'none',
        }}
        style={{ borderRadius: `${customization.borderRadius}px` }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-2 transition-colors"
          style={{
            borderColor: isFocused ? customization.primaryColor : `${customization.textColor}30`,
            borderRadius: `${customization.borderRadius}px`,
            backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
          }}
        >
          <Lock
            className="w-5 h-5 flex-shrink-0"
            style={{ color: isFocused ? customization.primaryColor : `${customization.textColor}50` }}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your password"
            className="flex-1 bg-transparent outline-none"
            style={{ color: customization.textColor }}
          />
          <motion.button
            type="button"
            className="p-1 rounded-md transition-colors"
            style={{ color: `${customization.textColor}60` }}
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Strength Meter */}
      {password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-3"
        >
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium" style={{ color: getStrengthColor() }}>
                {getStrengthLabel()}
              </span>
              <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
                {strength}/{strengthRules.length}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${customization.textColor}20` }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: getStrengthColor() }}
                initial={{ width: 0 }}
                animate={{ width: `${strengthPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Rules Checklist */}
          <div className="space-y-1.5">
            {strengthRules.map((rule, index) => {
              const passed = rule.check(password);
              return (
                <motion.div
                  key={rule.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: passed ? `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}` : `${customization.textColor}${opacityToHex(glassOpacity * 0.7)}`,
                    }}
                    animate={{ scale: passed ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {passed ? (
                      <Check className="w-3 h-3" style={{ color: customization.primaryColor }} />
                    ) : (
                      <X className="w-3 h-3" style={{ color: `${customization.textColor}40` }} />
                    )}
                  </motion.div>
                  <span
                    className="text-xs"
                    style={{
                      color: passed ? customization.textColor : `${customization.textColor}50`,
                      textDecoration: passed ? 'line-through' : 'none',
                    }}
                  >
                    {rule.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <p className="mt-4 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Password input with strength indicator
      </p>
    </div>
  );
}
