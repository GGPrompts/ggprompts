'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Smile, Paperclip, Send } from 'lucide-react';
import { Customization } from '@/types/customization';

type TextareaAutosizeProps = {
  customization: Customization;
};

const MAX_HEIGHT = 200;
const MIN_HEIGHT = 56;

export function TextareaAutosize({ customization }: TextareaAutosizeProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        // Handle send
        setValue('');
      }
    }
  };

  const charCount = value.length;
  const maxChars = 500;
  const charPercentage = (charCount / maxChars) * 100;

  return (
    <div className="w-full max-w-md" style={baseStyle}>
      <label
        className="block mb-2 text-sm font-medium"
        style={{ color: `${customization.textColor}90` }}
      >
        Write a message
      </label>

      <motion.div
        className="relative border-2 overflow-hidden transition-colors"
        style={{
          borderColor: isFocused ? customization.primaryColor : `${customization.textColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
        }}
        animate={{
          boxShadow: isFocused ? `0 0 20px ${customization.primaryColor}30` : 'none',
        }}
      >
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message here..."
            maxLength={maxChars}
            className="w-full px-4 py-3 resize-none outline-none bg-transparent"
            style={{
              color: customization.textColor,
              minHeight: `${MIN_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
            }}
          />

          {/* Placeholder icon when empty */}
          {!value && !isFocused && (
            <motion.div
              className="absolute top-3 right-3 opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            >
              <MessageSquare className="w-5 h-5" style={{ color: customization.textColor }} />
            </motion.div>
          )}
        </div>

        {/* Bottom Toolbar */}
        <motion.div
          className="flex items-center justify-between px-3 py-2 border-t"
          style={{ borderColor: `${customization.textColor}15` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Actions */}
          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              className="p-1.5 rounded-md transition-colors"
              style={{ color: `${customization.textColor}50` }}
              whileHover={{
                scale: 1.1,
                color: customization.primaryColor,
                backgroundColor: `${customization.primaryColor}10`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Smile className="w-5 h-5" />
            </motion.button>
            <motion.button
              type="button"
              className="p-1.5 rounded-md transition-colors"
              style={{ color: `${customization.textColor}50` }}
              whileHover={{
                scale: 1.1,
                color: customization.primaryColor,
                backgroundColor: `${customization.primaryColor}10`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Character count and send */}
          <div className="flex items-center gap-3">
            {/* Character counter */}
            <div className="flex items-center gap-2">
              <div
                className="relative w-8 h-8"
                style={{ opacity: value ? 1 : 0.3 }}
              >
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    strokeWidth="2"
                    style={{ stroke: `${customization.textColor}20` }}
                  />
                  <motion.circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      stroke:
                        charPercentage > 90
                          ? '#ef4444'
                          : charPercentage > 70
                          ? '#f97316'
                          : customization.primaryColor,
                    }}
                    strokeDasharray={`${2 * Math.PI * 12}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 12 * (1 - charPercentage / 100),
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-medium"
                  style={{
                    color:
                      charPercentage > 90
                        ? '#ef4444'
                        : charPercentage > 70
                        ? '#f97316'
                        : `${customization.textColor}60`,
                  }}
                >
                  {maxChars - charCount}
                </span>
              </div>
            </div>

            {/* Send button */}
            <motion.button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm"
              style={{
                background: value.trim()
                  ? `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`
                  : `${customization.textColor}20`,
                color: value.trim() ? '#fff' : `${customization.textColor}50`,
              }}
              disabled={!value.trim()}
              whileHover={value.trim() ? { scale: 1.05 } : {}}
              whileTap={value.trim() ? { scale: 0.95 } : {}}
            >
              <Send className="w-4 h-4" />
              Send
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Helper text */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      <p className="mt-3 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Auto-expanding textarea with toolbar
      </p>
    </div>
  );
}
