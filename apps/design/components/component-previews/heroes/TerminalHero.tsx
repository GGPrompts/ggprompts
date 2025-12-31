'use client';

import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Customization } from '@/types/customization';

type TerminalHeroProps = {
  customization: Customization;
};

export function TerminalHero({ customization }: TerminalHeroProps) {
  const [copied, setCopied] = useState(false);
  const gradientAngle = parseInt(customization.gradientAngle) || 135;
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const terminalLines = [
    { type: 'comment', content: '# Quick start with npm' },
    { type: 'command', content: 'npx create-awesome-app@latest my-project' },
    { type: 'output', content: 'Creating project...' },
    { type: 'output', content: 'Installing dependencies...' },
    { type: 'success', content: '✓ Project ready!' },
    { type: 'command', content: 'cd my-project && npm run dev' },
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg" style={baseStyle}>
      <motion.div
        className="relative p-8 overflow-hidden"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${customization.backgroundColor}, ${customization.backgroundColor}ee)`,
          borderRadius: `${Number(customization.borderRadius) * 2}px`,
          border: `1px solid ${customization.primaryColor}30`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background grid effect */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${customization.primaryColor}20 1px, transparent 1px), linear-gradient(90deg, ${customization.primaryColor}20 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Glowing orb */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
          style={{
            background: `radial-gradient(circle, ${customization.primaryColor}, transparent)`,
            filter: `blur(${blurAmount * 2}px)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [glassOpacity / 100 * 2, glassOpacity / 100 * 3.3, glassOpacity / 100 * 2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-medium rounded-full"
            style={{
              backgroundColor: `${customization.primaryColor}15`,
              color: customization.primaryColor,
              border: `1px solid ${customization.primaryColor}30`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Terminal className="w-3 h-3" />
            <span>Developer First</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl font-bold mb-3"
            style={{ color: customization.textColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Build Faster with{' '}
            <span
              style={{
                background: `linear-gradient(${gradientAngle}deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CLI Tools
            </span>
          </motion.h1>

          <motion.p
            className="mb-6 leading-relaxed text-sm"
            style={{ color: `${customization.textColor}70` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Get started in seconds with our powerful command-line interface.
            Deploy, scale, and manage your applications effortlessly.
          </motion.p>

          {/* Terminal Window */}
          <motion.div
            className="rounded-lg overflow-hidden mb-6"
            style={{
              backgroundColor: '#0d1117',
              border: `1px solid ${customization.primaryColor}20`,
              boxShadow: `0 8px 32px ${customization.primaryColor}15`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Terminal Header */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ backgroundColor: '#161b22', borderBottom: '1px solid #30363d' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-gray-500 font-mono">terminal</span>
              <motion.button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </motion.button>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-xs space-y-1">
              {terminalLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  {line.type === 'comment' && (
                    <span className="text-gray-500">{line.content}</span>
                  )}
                  {line.type === 'command' && (
                    <>
                      <span style={{ color: customization.primaryColor }}>$</span>
                      <span className="text-gray-300">{line.content}</span>
                    </>
                  )}
                  {line.type === 'output' && (
                    <span className="text-gray-500 pl-4">{line.content}</span>
                  )}
                  {line.type === 'success' && (
                    <span style={{ color: customization.secondaryColor }}>{line.content}</span>
                  )}
                </motion.div>
              ))}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <span style={{ color: customization.primaryColor }}>$</span>
                <motion.span
                  className="w-2 h-4 inline-block"
                  style={{ backgroundColor: customization.primaryColor }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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
              Get Started
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="px-5 py-2.5 font-medium border rounded-lg text-sm flex items-center gap-2"
              style={{
                borderColor: `${customization.primaryColor}50`,
                color: customization.textColor,
              }}
              whileHover={{ backgroundColor: `${customization.primaryColor}15` }}
              whileTap={{ scale: 0.95 }}
            >
              <Terminal className="w-4 h-4" />
              View Docs
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
