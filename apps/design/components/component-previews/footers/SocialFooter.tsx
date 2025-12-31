'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Globe,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type SocialFooterProps = {
  customization: Customization;
};

export function SocialFooter({ customization }: SocialFooterProps) {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, handle: '@acmeinc', followers: '125K' },
    { name: 'GitHub', icon: Github, handle: 'acme', followers: '45K' },
    { name: 'LinkedIn', icon: Linkedin, handle: 'acme-inc', followers: '89K' },
    { name: 'Instagram', icon: Instagram, handle: '@acmeinc', followers: '230K' },
    { name: 'YouTube', icon: Youtube, handle: 'AcmeInc', followers: '67K' },
    { name: 'Discord', icon: MessageCircle, handle: 'acme', followers: '12K' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-4xl" style={baseStyle}>
      <motion.footer
        className="relative overflow-hidden rounded-xl border"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}20`,
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {socialLinks.map((social, index) => (
            <motion.div
              key={social.name}
              className="absolute w-32 h-32 rounded-full blur-3xl opacity-5"
              style={{
                backgroundColor: customization.primaryColor,
                left: `${(index * 20) % 100}%`,
                top: `${(index * 30) % 100}%`,
              }}
              animate={{
                scale: hoveredSocial === social.name ? 2 : 1,
                opacity: hoveredSocial === social.name ? 0.15 : 0.05,
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ color: customization.textColor }}>
                Acme Inc
              </span>
            </div>
            <p className="text-sm" style={{ color: `${customization.textColor}60` }}>
              Connect with us on social media
            </p>
          </motion.div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              const isHovered = hoveredSocial === social.name;

              return (
                <motion.a
                  key={social.name}
                  href="#"
                  className="relative p-4 rounded-xl border transition-all group"
                  style={{
                    backgroundColor: isHovered
                      ? `${customization.primaryColor}10`
                      : 'transparent',
                    borderColor: isHovered
                      ? customization.primaryColor
                      : `${customization.primaryColor}20`,
                  }}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredSocial(social.name)}
                  onHoverEnd={() => setHoveredSocial(null)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: isHovered
                          ? customization.primaryColor
                          : `${customization.primaryColor}15`,
                      }}
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-colors"
                        style={{
                          color: isHovered ? 'white' : customization.primaryColor,
                        }}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                    >
                      <ExternalLink
                        className="w-4 h-4"
                        style={{ color: customization.primaryColor }}
                      />
                    </motion.div>
                  </div>

                  <div>
                    <p className="font-semibold text-sm" style={{ color: customization.textColor }}>
                      {social.name}
                    </p>
                    <p className="text-xs" style={{ color: `${customization.textColor}60` }}>
                      {social.handle}
                    </p>
                  </div>

                  <motion.div
                    className="mt-2 pt-2 border-t flex items-center justify-between"
                    style={{ borderColor: `${customization.primaryColor}15` }}
                  >
                    <span className="text-xs" style={{ color: `${customization.textColor}50` }}>
                      Followers
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: customization.primaryColor }}
                    >
                      {social.followers}
                    </span>
                  </motion.div>
                </motion.a>
              );
            })}
          </div>

          {/* Bottom section */}
          <motion.div
            className="flex items-center justify-between pt-6 border-t"
            style={{ borderColor: `${customization.primaryColor}15` }}
            variants={itemVariants}
          >
            <div className="flex items-center gap-4">
              <motion.a
                href="#"
                className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: `${customization.textColor}70` }}
                whileHover={{ color: customization.primaryColor }}
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </motion.a>
              <span style={{ color: `${customization.primaryColor}30` }}>|</span>
              <motion.a
                href="#"
                className="text-sm transition-colors"
                style={{ color: `${customization.textColor}70` }}
                whileHover={{ color: customization.primaryColor }}
              >
                Press Kit
              </motion.a>
              <span style={{ color: `${customization.primaryColor}30` }}>|</span>
              <motion.a
                href="#"
                className="text-sm transition-colors"
                style={{ color: `${customization.textColor}70` }}
                whileHover={{ color: customization.primaryColor }}
              >
                Brand Assets
              </motion.a>
            </div>

            <p className="text-sm" style={{ color: `${customization.textColor}50` }}>
              &copy; 2024 Acme Inc
            </p>
          </motion.div>
        </div>
      </motion.footer>

      <div className="mt-3 text-center">
        <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
          Social Footer
        </p>
        <p className="text-xs opacity-50 mt-1" style={{ color: customization.textColor }}>
          Social links with follower counts and hover effects
        </p>
      </div>
    </div>
  );
}
