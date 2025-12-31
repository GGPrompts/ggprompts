'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Customization } from '@/types/customization';

type CTAFooterProps = {
  customization: Customization;
};

export function CTAFooter({ customization }: CTAFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const quickLinks = ['Features', 'Pricing', 'Support', 'Blog'];
  const legalLinks = ['Privacy', 'Terms', 'Security'];

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      <motion.footer
        className="relative overflow-hidden rounded-xl border"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top, ${customization.primaryColor}20, transparent 50%)`,
          }}
        />

        <div className="relative z-10">
          {/* CTA Section */}
          <motion.div
            className="p-8 text-center border-b"
            style={{ borderColor: `${customization.primaryColor}15` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{
                backgroundColor: `${customization.primaryColor}15`,
                color: customization.primaryColor,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-3 h-3" />
              Join 50,000+ subscribers
            </motion.div>

            <motion.h3
              className="text-2xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Stay in the loop
            </motion.h3>

            <motion.p
              className="text-sm mb-6 max-w-md mx-auto"
              style={{ color: `${customization.textColor}70` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Get the latest updates, tips, and exclusive content delivered straight to your inbox. No spam, unsubscribe anytime.
            </motion.p>

            {/* Email Input */}
            <motion.div
              className="flex items-center gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div
                className="flex-1 relative rounded-lg border transition-colors overflow-hidden"
                style={{
                  borderColor: `${customization.primaryColor}30`,
                  backgroundColor: `${customization.backgroundColor}80`,
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={subscribed}
                  className="w-full px-4 py-3 text-sm bg-transparent outline-none disabled:opacity-50"
                  style={{ color: customization.textColor }}
                />
                {subscribed && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: customization.backgroundColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2" style={{ color: customization.primaryColor }}>
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Subscribed!</span>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.button
                onClick={handleSubscribe}
                disabled={subscribed || !email}
                className="px-6 py-3 text-sm font-medium text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  boxShadow: `0 4px 15px ${customization.primaryColor}30`,
                }}
                whileHover={{ scale: subscribed ? 1 : 1.02 }}
                whileTap={{ scale: subscribed ? 1 : 0.98 }}
              >
                Subscribe
                <Send className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            className="px-8 py-6 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold" style={{ color: customization.textColor }}>
                Acme
              </span>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center gap-6">
              {quickLinks.map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="text-sm font-medium transition-colors"
                  style={{ color: `${customization.textColor}70` }}
                  whileHover={{ color: customization.primaryColor }}
                >
                  {link}
                </motion.a>
              ))}
            </nav>

            {/* Legal + Copyright */}
            <div className="flex items-center gap-4">
              {legalLinks.map((link, index) => (
                <span key={link} className="flex items-center gap-4">
                  <motion.a
                    href="#"
                    className="text-xs transition-colors"
                    style={{ color: `${customization.textColor}50` }}
                    whileHover={{ color: customization.primaryColor }}
                  >
                    {link}
                  </motion.a>
                  {index < legalLinks.length - 1 && (
                    <span style={{ color: `${customization.textColor}30` }}>|</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          CTA Footer
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Newsletter signup with animated subscription
        </p>
      </div>
    </div>
  );
}
