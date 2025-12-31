'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Cpu, Cloud, Lock } from 'lucide-react';
import { Customization } from '@/types/customization';

type FeatureGridProps = {
  customization: Customization;
};

export function FeatureGrid({ customization }: FeatureGridProps) {
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized performance', color: customization.primaryColor },
    { icon: Shield, title: 'Secure', description: 'Enterprise security', color: customization.secondaryColor },
    { icon: Globe, title: 'Global CDN', description: 'Edge deployment', color: '#8b5cf6' },
    { icon: Cpu, title: 'AI Powered', description: 'Smart automation', color: '#ec4899' },
    { icon: Cloud, title: 'Cloud Native', description: 'Scalable infra', color: '#f59e0b' },
    { icon: Lock, title: 'Privacy First', description: 'GDPR compliant', color: '#10b981' },
  ];

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <div className="grid grid-cols-3 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="relative p-4 border text-center group cursor-pointer overflow-hidden"
              style={{
                backgroundColor: `${customization.backgroundColor}95`,
                borderColor: `${feature.color}25`,
                borderRadius: `${customization.borderRadius}px`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring' }}
              whileHover={{
                scale: 1.05,
                borderColor: `${feature.color}60`,
                boxShadow: `0 8px 30px ${feature.color}${Math.round(shadowIntensity * 0.3).toString(16).padStart(2, '0')}`,
              }}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle at center, ${feature.color}15, transparent)`,
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className="inline-flex p-2.5 rounded-xl mb-3"
                  style={{ backgroundColor: `${feature.color}15` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </motion.div>

                <h4 className="text-sm font-semibold mb-1" style={{ color: customization.textColor }}>
                  {feature.title}
                </h4>
                <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs opacity-50 text-center mt-3" style={{ color: customization.textColor }}>
        Hover-activated feature grid with icons
      </p>
    </div>
  );
}
