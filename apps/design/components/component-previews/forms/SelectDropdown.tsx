'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Customization } from '@/types/customization';

type SelectDropdownProps = {
  customization: Customization;
};

type Option = {
  value: string;
  label: string;
};

const options: Option[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
];

export function SelectDropdown({ customization }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-xs" style={baseStyle} ref={containerRef}>
      <label
        className="block mb-2 text-sm font-medium"
        style={{ color: `${customization.textColor}90` }}
      >
        Select Framework
      </label>
      <motion.button
        type="button"
        className="relative w-full px-4 py-3 flex items-center justify-between border-2 cursor-pointer transition-colors"
        style={{
          borderColor: isOpen ? customization.primaryColor : `${customization.textColor}30`,
          borderRadius: `${customization.borderRadius}px`,
          backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
          color: selected ? customization.textColor : `${customization.textColor}60`,
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <span>{selected?.label || 'Choose an option...'}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: `${customization.textColor}60` }} />
        </motion.div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: `${customization.borderRadius}px`,
            boxShadow: `0 0 20px ${customization.primaryColor}${opacityToHex(glassOpacity * 2.7)}`,
          }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute mt-2 w-full max-w-xs overflow-hidden border z-50"
            style={{
              backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 4)}`,
              backdropFilter: `blur(${blurAmount}px)`,
              borderColor: `${customization.primaryColor}40`,
              borderRadius: `${customization.borderRadius}px`,
              boxShadow: `0 10px 40px ${customization.primaryColor}20`,
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="py-1">
              {options.map((option, index) => {
                const isSelected = selected?.value === option.value;
                const isHighlighted = highlightedIndex === index;

                return (
                  <motion.div
                    key={option.value}
                    className="flex items-center justify-between px-4 py-2.5 cursor-pointer"
                    style={{
                      backgroundColor: isHighlighted ? `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}` : 'transparent',
                      color: customization.textColor,
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(option)}
                    animate={{ x: isHighlighted ? 4 : 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Check className="w-4 h-4" style={{ color: customization.primaryColor }} />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Custom animated select dropdown
      </p>
    </div>
  );
}
