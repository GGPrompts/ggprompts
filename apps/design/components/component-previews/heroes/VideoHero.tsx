'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type VideoHeroProps = {
  customization: Customization;
};

export function VideoHero({ customization }: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-6 overflow-hidden"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.backgroundColor}, ${customization.backgroundColor}dd)`,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}30`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Video Container with Overlay */}
        <motion.div
          className="relative mb-6 rounded-xl overflow-hidden"
          style={{
            aspectRatio: '16/9',
            border: `1px solid ${customization.primaryColor}20`,
            boxShadow: `0 20px 50px ${customization.primaryColor}20`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Video Placeholder Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${gradientAngle + 45}deg,
                ${customization.primaryColor}20,
                ${customization.secondaryColor}20,
                ${customization.primaryColor}20)`,
            }}
          >
            {/* Animated mesh pattern */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(${customization.primaryColor}40 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '24px 24px'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Play overlay */}
          {!isPlaying && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(180deg, transparent, ${customization.backgroundColor}90)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                className="relative flex items-center justify-center"
                onClick={() => setIsPlaying(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulsing ring */}
                <motion.div
                  className="absolute w-20 h-20 rounded-full"
                  style={{
                    border: `2px solid ${customization.primaryColor}`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Play button */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    boxShadow: `0 8px 32px ${customization.primaryColor}50`,
                  }}
                >
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Video Controls */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            style={{
              background: `linear-gradient(transparent, ${customization.backgroundColor}ee)`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Progress bar */}
            <div className="relative h-1 rounded-full bg-white/20 mb-3 cursor-pointer overflow-hidden">
              <motion.div
                className="absolute h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                }}
                initial={{ width: '0%' }}
                animate={{ width: isPlaying ? '35%' : '0%' }}
                transition={{ duration: isPlaying ? 3 : 0 }}
              />
              <motion.div
                className="absolute w-3 h-3 rounded-full -top-1"
                style={{
                  backgroundColor: customization.primaryColor,
                  boxShadow: `0 0 10px ${customization.primaryColor}`,
                  left: isPlaying ? '35%' : '0%',
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${customization.primaryColor}20` }}
                  whileHover={{ scale: 1.1, backgroundColor: `${customization.primaryColor}40` }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" style={{ color: customization.textColor }} />
                  ) : (
                    <Play className="w-4 h-4" style={{ color: customization.textColor }} />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-md"
                  style={{ backgroundColor: `${customization.primaryColor}20` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" style={{ color: customization.textColor }} />
                  ) : (
                    <Volume2 className="w-4 h-4" style={{ color: customization.textColor }} />
                  )}
                </motion.button>
                <span className="text-xs" style={{ color: `${customization.textColor}70` }}>
                  {isPlaying ? '0:45' : '0:00'} / 2:30
                </span>
              </div>
              <motion.button
                className="p-1.5 rounded-md"
                style={{ backgroundColor: `${customization.primaryColor}20` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Maximize className="w-4 h-4" style={{ color: customization.textColor }} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h1
            className="text-2xl font-bold mb-2"
            style={{ color: customization.textColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            See How It{' '}
            <span
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Works
            </span>
          </motion.h1>

          <motion.p
            className="mb-5 leading-relaxed text-sm"
            style={{ color: `${customization.textColor}70` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Watch our 2-minute demo to discover how easy it is to build
            stunning interfaces with our platform.
          </motion.p>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 font-medium text-white rounded-lg text-sm"
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                boxShadow: `0 4px 20px ${customization.primaryColor}40`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 8px 30px ${customization.primaryColor}60` }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="px-5 py-2.5 font-medium border rounded-lg text-sm"
              style={{
                borderColor: `${customization.primaryColor}50`,
                color: customization.textColor,
              }}
              whileHover={{ backgroundColor: `${customization.primaryColor}15` }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
