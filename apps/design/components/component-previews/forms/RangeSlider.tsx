'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Volume2, DollarSign, Percent } from 'lucide-react';
import { Customization } from '@/types/customization';

type RangeSliderProps = {
  customization: Customization;
};

type SliderConfig = {
  id: string;
  label: string;
  icon: React.ElementType;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
};

const sliders: SliderConfig[] = [
  { id: 'volume', label: 'Volume', icon: Volume2, min: 0, max: 100, step: 1, unit: '%', defaultValue: 75 },
  { id: 'price', label: 'Max Price', icon: DollarSign, min: 0, max: 1000, step: 10, unit: '$', defaultValue: 450 },
  { id: 'discount', label: 'Discount', icon: Percent, min: 0, max: 50, step: 5, unit: '%', defaultValue: 20 },
];

export function RangeSlider({ customization }: RangeSliderProps) {
  const [values, setValues] = useState<Record<string, number>>({
    volume: 75,
    price: 450,
    discount: 20,
  });
  const [dragging, setDragging] = useState<string | null>(null);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const handleChange = (id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="w-full max-w-sm" style={baseStyle}>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: customization.textColor }}
      >
        Adjustments
      </h3>
      <div className="space-y-6">
        {sliders.map((slider, index) => {
          const value = values[slider.id];
          const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
          const Icon = slider.icon;
          const isDragging = dragging === slider.id;

          return (
            <motion.div
              key={slider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              {/* Label and Value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: customization.primaryColor }}
                  />
                  <span style={{ color: customization.textColor }}>{slider.label}</span>
                </div>
                <motion.div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: isDragging ? customization.primaryColor : `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}`,
                    color: isDragging ? '#fff' : customization.primaryColor,
                  }}
                  animate={{ scale: isDragging ? 1.1 : 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {slider.unit === '$' ? `${slider.unit}${value}` : `${value}${slider.unit}`}
                </motion.div>
              </div>

              {/* Slider Track */}
              <div className="relative h-2">
                {/* Background Track */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: `${customization.textColor}20`,
                    borderRadius: `${customization.borderRadius}px`,
                  }}
                />

                {/* Filled Track */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    borderRadius: `${customization.borderRadius}px`,
                  }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.1 }}
                />

                {/* Glow effect when dragging */}
                {isDragging && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
                    style={{
                      width: `${percentage}%`,
                      boxShadow: `0 0 20px ${customization.primaryColor}60`,
                      borderRadius: `${customization.borderRadius}px`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                {/* Input (invisible but functional) */}
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={value}
                  onChange={(e) => handleChange(slider.id, Number(e.target.value))}
                  onMouseDown={() => setDragging(slider.id)}
                  onMouseUp={() => setDragging(null)}
                  onTouchStart={() => setDragging(slider.id)}
                  onTouchEnd={() => setDragging(null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Thumb */}
                <motion.div
                  className="absolute top-1/2 w-5 h-5 rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${percentage}%`,
                    transform: 'translate(-50%, -50%)',
                    background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                    boxShadow: isDragging
                      ? `0 0 20px ${customization.primaryColor}80`
                      : `0 2px 8px ${customization.primaryColor}40`,
                  }}
                  animate={{
                    scale: isDragging ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.div
                    className="absolute inset-1 rounded-full bg-white"
                    animate={{ scale: isDragging ? 0.6 : 0.8 }}
                  />
                </motion.div>
              </div>

              {/* Min/Max Labels */}
              <div className="flex justify-between text-xs" style={{ color: `${customization.textColor}50` }}>
                <span>{slider.unit === '$' ? `${slider.unit}${slider.min}` : `${slider.min}${slider.unit}`}</span>
                <span>{slider.unit === '$' ? `${slider.unit}${slider.max}` : `${slider.max}${slider.unit}`}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Gradient range sliders with value display
      </p>
    </div>
  );
}
