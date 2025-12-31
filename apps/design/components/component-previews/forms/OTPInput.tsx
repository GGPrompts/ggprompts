'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Customization } from '@/types/customization';

type OTPInputProps = {
  customization: Customization;
};

const OTP_LENGTH = 6;

export function OTPInput({ customization }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < OTP_LENGTH) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)]?.focus();
  };

  // Simulate verification when all digits are entered
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== '');
    if (isComplete && !isVerified) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 1500);
    } else if (!isComplete) {
      setIsVerified(false);
    }
  }, [otp, isVerified]);

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setIsVerified(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
          style={{
            background: isVerified
              ? `linear-gradient(135deg, #22c55e, #16a34a)`
              : `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          }}
          animate={isVerifying ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: isVerifying ? Infinity : 0, ease: 'linear' }}
        >
          {isVerified ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <Shield className="w-6 h-6 text-white" />
          )}
        </motion.div>
        <h3
          className="text-lg font-semibold"
          style={{ color: customization.textColor }}
        >
          {isVerified ? 'Verified!' : 'Enter Verification Code'}
        </h3>
        <p className="text-sm mt-1" style={{ color: `${customization.textColor}60` }}>
          {isVerified
            ? 'Your identity has been confirmed'
            : 'We sent a 6-digit code to your device'}
        </p>
      </div>

      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => {
          const isFocused = activeIndex === index;
          const isFilled = digit !== '';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <motion.input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                disabled={isVerified}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 outline-none transition-all"
                style={{
                  borderColor: isVerified
                    ? '#22c55e'
                    : isFocused
                    ? customization.primaryColor
                    : isFilled
                    ? `${customization.primaryColor}60`
                    : `${customization.textColor}30`,
                  borderRadius: `${customization.borderRadius}px`,
                  backgroundColor: isVerified
                    ? '#22c55e10'
                    : isFilled
                    ? `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`
                    : `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
                  color: customization.textColor,
                }}
                animate={{
                  scale: isFocused ? 1.05 : 1,
                }}
                transition={{ duration: 0.15 }}
              />

              {/* Focus glow */}
              {isFocused && !isVerified && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: `${customization.borderRadius}px`,
                    boxShadow: `0 0 20px ${customization.primaryColor}${opacityToHex(glassOpacity * 2.7)}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}

              {/* Success checkmark animation */}
              {isVerified && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#22c55e' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index, type: 'spring' }}
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Resend / Reset */}
      <div className="mt-6 text-center">
        {isVerified ? (
          <motion.button
            type="button"
            className="text-sm font-medium"
            style={{ color: customization.primaryColor }}
            onClick={resetOtp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset and try again
          </motion.button>
        ) : (
          <p className="text-sm" style={{ color: `${customization.textColor}50` }}>
            Didn&apos;t receive code?{' '}
            <button
              type="button"
              className="font-medium"
              style={{ color: customization.primaryColor }}
            >
              Resend
            </button>
          </p>
        )}
      </div>

      <p className="mt-4 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        OTP input with auto-focus and verification
      </p>
    </div>
  );
}
