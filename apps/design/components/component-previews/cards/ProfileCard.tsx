'use client';

import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Customization } from '@/types/customization';

type ProfileCardProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function ProfileCard({ customization, textContent }: ProfileCardProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const avatarSize = parseInt(customization.avatarSize) || 80;
  const showSocialLinks = customization.showSocialLinks !== 'false';

  const name = textContent?.name ?? 'Alex Chen';
  const role = textContent?.role ?? 'Senior Developer';
  const bio = textContent?.bio ?? 'Building the future of web development.';

  // Convert percentage to hex for opacity values
  const borderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const shadowOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');
  const avatarShadowOpacityHex = Math.round(glassOpacity * 2.7 * 2.55).toString(16).padStart(2, '0');
  const avatarBgOpacityHex = Math.round(glassOpacity * 4 * 2.55).toString(16).padStart(2, '0');
  const dividerOpacityHex = Math.round(glassOpacity * 1.3 * 2.55).toString(16).padStart(2, '0');
  const socialBorderOpacityHex = Math.round(glassOpacity * 2 * 2.55).toString(16).padStart(2, '0');
  const socialBgOpacityHex = Math.round(glassOpacity * 0.7 * 2.55).toString(16).padStart(2, '0');
  const buttonShadowOpacityHex = Math.round(glassOpacity * 3.3 * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
    { icon: Github, label: 'GitHub', color: '#333' },
    { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
    { icon: Mail, label: 'Email', color: customization.primaryColor },
  ];

  return (
    <motion.div
      className="w-full max-w-sm overflow-hidden border"
      style={{
        ...baseStyle,
        backgroundColor: customization.backgroundColor,
        borderColor: `${customization.primaryColor}${borderOpacityHex}`,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
        boxShadow: `0 20px 60px ${customization.primaryColor}${Math.round(shadowIntensity * 0.4).toString(16).padStart(2, '0')}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header gradient background */}
      <div
        className="relative h-24"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
        }}
      >
        {/* Animated pattern overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
          animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Avatar */}
      <div className="relative px-6">
        <motion.div
          className="absolute rounded-full border-4 overflow-hidden"
          style={{
            width: avatarSize,
            height: avatarSize,
            top: -avatarSize / 2,
            borderColor: customization.backgroundColor,
            boxShadow: `0 8px 20px ${customization.primaryColor}${avatarShadowOpacityHex}`,
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div
            className="w-full h-full flex items-center justify-center font-bold"
            style={{
              background: `linear-gradient(135deg, ${customization.primaryColor}${avatarBgOpacityHex}, ${customization.secondaryColor}${avatarBgOpacityHex})`,
              color: customization.textColor,
              fontSize: `${avatarSize * 0.3}px`,
            }}
          >
            AJ
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6" style={{ paddingTop: avatarSize / 2 + 8 }}>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <motion.div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: customization.primaryColor }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span style={{ color: customization.backgroundColor }}>&#10003;</span>
          </motion.div>
        </div>

        <p className="text-sm opacity-60 mt-1">{role}</p>

        <p className="mt-3 text-sm opacity-80 leading-relaxed">
          {bio}
        </p>

        {/* Location & Website */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5 opacity-60">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <motion.a
            href="#"
            className="flex items-center gap-1.5"
            style={{ color: customization.primaryColor }}
            whileHover={{ x: 2 }}
          >
            <LinkIcon className="w-4 h-4" />
            <span>alexj.design</span>
          </motion.a>
        </div>

        {/* Stats */}
        <div
          className="flex justify-between mt-5 pt-5 border-t"
          style={{ borderColor: `${customization.primaryColor}${dividerOpacityHex}` }}
        >
          {[
            { label: 'Projects', value: '142' },
            { label: 'Followers', value: '12.4k' },
            { label: 'Following', value: '847' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="font-bold text-lg" style={{ color: customization.primaryColor }}>
                {stat.value}
              </div>
              <div className="text-xs opacity-50">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        {showSocialLinks && (
          <div className="flex justify-center gap-3 mt-5">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.button
                  key={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center border"
                  style={{
                    borderColor: `${customization.primaryColor}${socialBorderOpacityHex}`,
                    backgroundColor: `${customization.primaryColor}${socialBgOpacityHex}`,
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: customization.primaryColor,
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Icon className="w-4 h-4" style={{ color: customization.textColor }} />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <motion.button
          className="w-full mt-5 py-3 rounded-lg font-medium"
          style={{
            background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
            color: customization.backgroundColor,
          }}
          whileHover={{ scale: 1.02, boxShadow: `0 8px 25px ${customization.primaryColor}${buttonShadowOpacityHex}` }}
          whileTap={{ scale: 0.98 }}
        >
          Follow
        </motion.button>
      </div>
    </motion.div>
  );
}
