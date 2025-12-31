'use client';

import { Sparkles } from 'lucide-react';
import { Customization } from '@/types/customization';

type GlassCardProps = {
  customization: Customization;
  textContent?: Record<string, string>;
};

export function GlassCard({ customization, textContent }: GlassCardProps) {
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const borderOpacity = parseInt(customization.glassBorderOpacity) || 40;
  const shadowIntensity = parseInt(customization.shadowIntensity) || 50;

  const title = textContent?.title ?? 'Glass Card';
  const description = textContent?.description ?? 'A beautiful frosted glass effect with customizable blur.';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div
      className="w-full max-w-sm p-6 rounded-xl backdrop-blur-md border transition-all duration-300"
      style={{
        ...baseStyle,
        backgroundColor: `${customization.primaryColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}`,
        borderColor: `${customization.primaryColor}${Math.round(borderOpacity * 2.55).toString(16).padStart(2, '0')}`,
        borderRadius: `${customization.borderRadius}px`,
        color: customization.textColor,
        boxShadow: `0 8px 32px ${customization.primaryColor}${Math.round(shadowIntensity * 0.5).toString(16).padStart(2, '0')}, inset 0 0 20px ${customization.primaryColor}10`,
        backdropFilter: `blur(${customization.blurAmount}px)`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${customization.primaryColor}30` }}
        >
          <Sparkles className="w-6 h-6" style={{ color: customization.primaryColor }} />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm opacity-70">Frosted glass effect</p>
        </div>
      </div>
      <p className="opacity-80 text-sm">
        {description}
      </p>
    </div>
  );
}
