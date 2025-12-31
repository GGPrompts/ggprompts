'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, Lock, Check, X } from 'lucide-react';
import { Customization } from '@/types/customization';

type SignupCardProps = {
  customization: Customization;
};

export function SignupCard({ customization }: SignupCardProps) {
  const [password, setPassword] = useState('Abc123!@');
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

  const passwordChecks = [
    { label: 'At least 8 characters', check: password.length >= 8 },
    { label: 'Contains uppercase', check: /[A-Z]/.test(password) },
    { label: 'Contains number', check: /\d/.test(password) },
    { label: 'Contains special char', check: /[!@#$%^&*]/.test(password) },
  ];

  const passedChecks = passwordChecks.filter((c) => c.check).length;
  const strength = passedChecks / passwordChecks.length;

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
        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(90deg, ${customization.primaryColor}50, ${customization.secondaryColor}50, ${customization.primaryColor}50)`,
            backgroundSize: '200% 100%',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: customization.textColor }}>
              Create Account
            </h2>
            <p className="text-sm mt-1" style={{ color: `${customization.textColor}60` }}>
              Join thousands of developers
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Name field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 border rounded-lg transition-all"
                style={{
                  borderColor: focused === 'name' ? customization.primaryColor : `${customization.textColor}20`,
                }}
              >
                <User className="w-5 h-5" style={{ color: `${customization.textColor}50` }} />
                <input
                  type="text"
                  placeholder="Full name"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: customization.textColor }}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </motion.div>

            {/* Email field */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 border rounded-lg transition-all"
                style={{
                  borderColor: focused === 'email' ? customization.primaryColor : `${customization.textColor}20`,
                }}
              >
                <Mail className="w-5 h-5" style={{ color: `${customization.textColor}50` }} />
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
              transition={{ delay: 0.2 }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 border rounded-lg transition-all"
                style={{
                  borderColor: focused === 'password' ? customization.primaryColor : `${customization.textColor}20`,
                }}
              >
                <Lock className="w-5 h-5" style={{ color: `${customization.textColor}50` }} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: customization.textColor }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </motion.div>

            {/* Password strength */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {/* Strength bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden mb-3"
                style={{ backgroundColor: `${customization.textColor}15` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      strength < 0.5 ? '#ef4444' : strength < 0.75 ? '#f59e0b' : '#10b981',
                  }}
                  animate={{ width: `${strength * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Checks */}
              <div className="grid grid-cols-2 gap-2">
                {passwordChecks.map((check, index) => (
                  <motion.div
                    key={check.label}
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {check.check ? (
                      <Check className="w-3 h-3" style={{ color: '#10b981' }} />
                    ) : (
                      <X className="w-3 h-3" style={{ color: `${customization.textColor}30` }} />
                    )}
                    <span
                      className="text-xs"
                      style={{ color: check.check ? '#10b981' : `${customization.textColor}50` }}
                    >
                      {check.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full py-3 font-medium text-white rounded-lg mt-2"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                boxShadow: `0 4px 20px ${customization.primaryColor}40`,
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${customization.primaryColor}60` }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account
            </motion.button>

            {/* Terms */}
            <p className="text-xs text-center" style={{ color: `${customization.textColor}50` }}>
              By signing up, you agree to our{' '}
              <button style={{ color: customization.primaryColor }}>Terms</button> and{' '}
              <button style={{ color: customization.primaryColor }}>Privacy Policy</button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
