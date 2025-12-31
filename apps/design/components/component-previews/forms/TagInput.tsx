'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Customization } from '@/types/customization';

type TagInputProps = {
  customization: Customization;
};

export function TagInput({ customization }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Tailwind']);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const suggestions = ['JavaScript', 'Next.js', 'Vue', 'Node.js', 'Python', 'GraphQL'];
  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(s) &&
      inputValue.length > 0
  );

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <label
        className="block mb-2 text-sm font-medium"
        style={{ color: `${customization.textColor}90` }}
      >
        Skills & Technologies
      </label>

      {/* Input Container */}
      <motion.div
        className="relative p-3 border-2 min-h-[56px] cursor-text"
        style={{
          borderColor: isFocused ? customization.primaryColor : `${customization.textColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
        }}
        onClick={() => inputRef.current?.focus()}
        animate={{
          boxShadow: isFocused ? `0 0 20px ${customization.primaryColor}30` : 'none',
        }}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tags */}
          <AnimatePresence mode="popLayout">
            {tags.map((tag) => (
              <motion.div
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
                style={{
                  background: `linear-gradient(135deg, ${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}, ${customization.secondaryColor}${opacityToHex(glassOpacity * 1.3)})`,
                  border: `1px solid ${customization.primaryColor}40`,
                }}
              >
                <span style={{ color: customization.textColor }}>{tag}</span>
                <motion.button
                  type="button"
                  className="p-0.5 rounded-full hover:bg-red-500/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3 h-3" style={{ color: `${customization.textColor}70` }} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={tags.length === 0 ? 'Add tags...' : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none placeholder-current"
            style={{
              color: customization.textColor,
              opacity: 0.8,
            }}
          />
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {filteredSuggestions.length > 0 && isFocused && (
            <motion.div
              className="absolute left-0 right-0 mt-2 border overflow-hidden z-50"
              style={{
                top: '100%',
                backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 4)}`,
                backdropFilter: `blur(${blurAmount}px)`,
                borderColor: `${customization.primaryColor}40`,
                borderRadius: `${customization.borderRadius}px`,
                boxShadow: `0 10px 40px ${customization.primaryColor}20`,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredSuggestions.map((suggestion) => (
                <motion.div
                  key={suggestion}
                  className="px-4 py-2 cursor-pointer flex items-center gap-2"
                  style={{ color: customization.textColor }}
                  whileHover={{ backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(suggestion);
                  }}
                >
                  <Plus className="w-4 h-4" style={{ color: customization.primaryColor }} />
                  {suggestion}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Helper text */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
          Press Enter or comma to add
        </p>
        <p className="text-xs" style={{ color: `${customization.textColor}50` }}>
          {tags.length} tag{tags.length !== 1 ? 's' : ''}
        </p>
      </div>

      <p className="mt-3 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Tag input with autocomplete suggestions
      </p>
    </div>
  );
}
