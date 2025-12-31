'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Terminal, Sparkles } from 'lucide-react';
import { Customization } from '@/types/customization';

type TypewriterTextProps = {
  customization: Customization;
};

export function TypewriterText({ customization }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const phrases = [
    'Building the future...',
    'Creating amazing experiences.',
    'Design meets functionality.',
    'Code with passion.',
  ];

  const currentPhrase = phrases[currentPhraseIndex];

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentPhrase[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      // Pause at end of phrase, then delete and move to next
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setDisplayText('');
          setCurrentIndex(0);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setIsTyping(true);
        }, 500);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isTyping, currentPhrase]);

  const handleReset = () => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(true);
  };

  const toggleTyping = () => {
    setIsTyping(!isTyping);
  };

  return (
    <div className="w-full max-w-md" style={baseStyle}>
      {/* Main Terminal Display */}
      <motion.div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: `${customization.primaryColor}30`,
          boxShadow: `0 10px 40px ${customization.primaryColor}15`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Terminal Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: `${customization.primaryColor}20` }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-1" style={{ color: `${customization.textColor}50` }}>
            <Terminal className="w-4 h-4" />
            <span className="text-xs">typewriter.tsx</span>
          </div>
          <div className="w-12" />
        </div>

        {/* Terminal Content */}
        <div className="p-6">
          <div className="flex items-start gap-2">
            <span style={{ color: customization.primaryColor }}>{'>'}</span>
            <div className="flex-1">
              <span style={{ color: customization.textColor }}>{displayText}</span>
              <motion.span
                className="inline-block w-3 h-5 ml-0.5"
                style={{ backgroundColor: customization.primaryColor }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className="flex items-center justify-center gap-3 px-4 py-3 border-t"
          style={{ borderColor: `${customization.primaryColor}20` }}
        >
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: `${customization.primaryColor}15`,
              color: customization.primaryColor,
            }}
            onClick={toggleTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isTyping ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isTyping ? 'Pause' : 'Resume'}
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: `${customization.secondaryColor}15`,
              color: customization.secondaryColor,
            }}
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>
      </motion.div>

      {/* Alternative Styles */}
      <div className="mt-6 space-y-4">
        {/* Gradient Text Typewriter */}
        <GradientTypewriter customization={customization} />

        {/* Code Block Style */}
        <CodeTypewriter customization={customization} />
      </div>
    </div>
  );
}

// Gradient text typewriter variant
function GradientTypewriter({ customization }: { customization: Customization }) {
  const [text, setText] = useState('');
  const fullText = 'Design systems made beautiful.';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="p-4 rounded-lg text-center"
      style={{
        backgroundColor: `${customization.primaryColor}10`,
        border: `1px solid ${customization.primaryColor}20`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.span
        className="text-lg font-bold bg-clip-text"
        style={{
          backgroundImage: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
        <motion.span
          className="inline-block w-0.5 h-5 ml-1 align-middle"
          style={{ backgroundColor: customization.primaryColor }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </motion.span>
    </motion.div>
  );
}

// Code block typewriter variant
function CodeTypewriter({ customization }: { customization: Customization }) {
  const [lines, setLines] = useState<string[]>([]);
  const codeLines = [
    'const design = {',
    '  theme: "modern",',
    '  animations: true,',
    '  effects: "stunning"',
    '};',
  ];

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < codeLines.length) {
        setLines((prev) => [...prev, codeLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="p-4 rounded-lg font-mono text-sm"
      style={{
        backgroundColor: '#1a1a2e',
        border: `1px solid ${customization.primaryColor}20`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex"
        >
          <span style={{ color: '#64748b', width: '2ch', marginRight: '1ch' }}>{i + 1}</span>
          <span style={{ color: customization.primaryColor }}>{line}</span>
        </motion.div>
      ))}
      <div className="flex items-center mt-1">
        <span style={{ color: '#64748b', width: '2ch', marginRight: '1ch' }}>{lines.length + 1}</span>
        <motion.span
          className="w-2 h-4"
          style={{ backgroundColor: customization.primaryColor }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
