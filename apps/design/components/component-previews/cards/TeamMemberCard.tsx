'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Twitter, Linkedin, Github, Mail, ExternalLink } from 'lucide-react';
import { Customization } from '@/types/customization';

type TeamMemberCardProps = {
  customization: Customization;
};

export function TeamMemberCard({ customization }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;

  // Convert percentage to hex for opacity values
  const borderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const gradientOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');
  const avatarShadowOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');
  const skillBgOpacityHex = Math.round(glassOpacity * 1 * 2.55).toString(16).padStart(2, '0');
  const socialBorderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const socialBgOpacityHex = Math.round(glassOpacity * 0.5 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const skills = ['Product Strategy', 'UX Design', 'Team Leadership'];

  return (
    <motion.div
      className="relative w-full max-w-xs overflow-hidden"
      style={{
        ...baseStyle,
        backgroundColor: customization.backgroundColor,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card with glass effect border */}
      <motion.div
        className="relative border overflow-hidden"
        style={{
          borderColor: `${customization.primaryColor}${borderOpacityHex}`,
          borderRadius: `${customization.borderRadius}px`,
          boxShadow: `0 20px 50px ${customization.primaryColor}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
        }}
        whileHover={{ y: -8 }}
      >
        {/* Avatar Section */}
        <div className="relative">
          {/* Background gradient */}
          <motion.div
            className="h-32"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}${gradientOpacityHex}, ${customization.secondaryColor}${gradientOpacityHex})`,
            }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
          />

          {/* Decorative circles */}
          <motion.div
            className="absolute top-4 right-4 w-16 h-16 rounded-full"
            style={{ backgroundColor: `${customization.primaryColor}${borderOpacityHex}` }}
            animate={{ scale: isHovered ? 1.2 : 1, x: isHovered ? 10 : 0 }}
          />
          <motion.div
            className="absolute top-8 right-12 w-8 h-8 rounded-full"
            style={{ backgroundColor: `${customization.secondaryColor}${gradientOpacityHex}` }}
            animate={{ scale: isHovered ? 1.3 : 1, y: isHovered ? -5 : 0 }}
          />

          {/* Avatar */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <motion.div
              className="relative w-24 h-24 rounded-full border-4"
              style={{
                borderColor: customization.backgroundColor,
                boxShadow: `0 8px 25px ${customization.primaryColor}${avatarShadowOpacityHex}`,
              }}
              whileHover={{ scale: 1.1 }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  color: customization.backgroundColor,
                }}
              >
                MC
              </div>

              {/* Online indicator */}
              <motion.div
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{
                  backgroundColor: '#22c55e',
                  borderColor: customization.backgroundColor,
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-6 px-5 text-center">
          {/* Name & Role */}
          <h3 className="text-xl font-bold mb-1">Maya Chen</h3>
          <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
            Chief Product Officer
          </p>

          {/* Bio */}
          <p className="mt-3 text-sm opacity-70 leading-relaxed">
            15+ years of experience building products that millions love.
            Previously at Google and Airbnb.
          </p>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${customization.primaryColor}${skillBgOpacityHex}`,
                  color: customization.primaryColor,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{
                  backgroundColor: customization.primaryColor,
                  color: customization.backgroundColor,
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            className="flex justify-center gap-2 mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{
                    borderColor: `${customization.primaryColor}${socialBorderOpacityHex}`,
                    backgroundColor: `${customization.primaryColor}${socialBgOpacityHex}`,
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: customization.primaryColor,
                    borderColor: customization.primaryColor,
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Contact Button */}
          <motion.button
            className="mt-5 w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium border"
            style={{
              borderColor: customization.primaryColor,
              color: customization.primaryColor,
            }}
            whileHover={{
              backgroundColor: customization.primaryColor,
              color: customization.backgroundColor,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Profile</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom gradient accent */}
        <motion.div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
