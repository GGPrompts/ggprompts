'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Customization } from '@/types/customization';

type DatePickerInputProps = {
  customization: Customization;
};

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function DatePickerInput({ customization }: DatePickerInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isFocused, setIsFocused] = useState(false);
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="w-full max-w-sm" style={baseStyle} ref={containerRef}>
      <label
        className="block mb-2 text-sm font-medium"
        style={{ color: `${customization.textColor}90` }}
      >
        Select Date
      </label>

      {/* Input */}
      <motion.div
        className="relative"
        animate={{
          boxShadow: isFocused || isOpen ? `0 0 20px ${customization.primaryColor}30` : 'none',
        }}
        style={{ borderRadius: `${customization.borderRadius}px` }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 border-2 cursor-pointer transition-colors"
          style={{
            borderColor: isOpen ? customization.primaryColor : `${customization.textColor}30`,
            borderRadius: `${customization.borderRadius}px`,
            backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 3.4)}`,
          }}
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <Calendar
            className="w-5 h-5 flex-shrink-0"
            style={{ color: isOpen ? customization.primaryColor : `${customization.textColor}50` }}
          />
          <span
            style={{
              color: selectedDate ? customization.textColor : `${customization.textColor}50`,
            }}
          >
            {selectedDate ? formatDate(selectedDate) : 'Choose a date...'}
          </span>
        </div>
      </motion.div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute mt-2 p-4 border z-50"
            style={{
              backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 4)}`,
              backdropFilter: `blur(${blurAmount}px)`,
              borderColor: `${customization.primaryColor}40`,
              borderRadius: `${customization.borderRadius}px`,
              boxShadow: `0 20px 60px ${customization.primaryColor}20`,
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                type="button"
                className="p-1 rounded-md"
                style={{ color: customization.textColor }}
                onClick={goToPreviousMonth}
                whileHover={{ scale: 1.1, backgroundColor: `${customization.primaryColor}20` }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span
                className="font-semibold"
                style={{ color: customization.textColor }}
              >
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <motion.button
                type="button"
                className="p-1 rounded-md"
                style={{ color: customization.textColor }}
                onClick={goToNextMonth}
                whileHover={{ scale: 1.1, backgroundColor: `${customization.primaryColor}20` }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium py-1"
                  style={{ color: `${customization.textColor}50` }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date, isCurrentMonth }, index) => {
                const selected = isSelected(date);
                const today = isToday(date);

                return (
                  <motion.button
                    key={index}
                    type="button"
                    className="relative w-9 h-9 flex items-center justify-center text-sm rounded-lg"
                    style={{
                      color: selected
                        ? '#fff'
                        : isCurrentMonth
                        ? customization.textColor
                        : `${customization.textColor}30`,
                      backgroundColor: selected ? customization.primaryColor : 'transparent',
                    }}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsOpen(false);
                    }}
                    whileHover={{
                      backgroundColor: selected
                        ? customization.primaryColor
                        : `${customization.primaryColor}20`,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {date.getDate()}
                    {today && !selected && (
                      <motion.div
                        className="absolute bottom-1 w-1 h-1 rounded-full"
                        style={{ backgroundColor: customization.primaryColor }}
                        layoutId="today-indicator"
                      />
                    )}
                    {selected && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{ boxShadow: `0 0 15px ${customization.primaryColor}60` }}
                        layoutId="selected-day"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderColor: `${customization.textColor}20` }}>
              <motion.button
                type="button"
                className="flex-1 py-1.5 text-sm font-medium rounded-lg"
                style={{
                  color: customization.primaryColor,
                  backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 0.7)}`,
                }}
                onClick={() => {
                  setSelectedDate(new Date());
                  setIsOpen(false);
                }}
                whileHover={{ backgroundColor: `${customization.primaryColor}${opacityToHex(glassOpacity * 1.3)}` }}
                whileTap={{ scale: 0.98 }}
              >
                Today
              </motion.button>
              <motion.button
                type="button"
                className="flex-1 py-1.5 text-sm font-medium rounded-lg"
                style={{
                  color: `${customization.textColor}70`,
                  backgroundColor: `${customization.textColor}${opacityToHex(glassOpacity * 0.7)}`,
                }}
                onClick={() => {
                  setSelectedDate(null);
                  setIsOpen(false);
                }}
                whileHover={{ backgroundColor: `${customization.textColor}${opacityToHex(glassOpacity * 1.3)}` }}
                whileTap={{ scale: 0.98 }}
              >
                Clear
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Date picker with calendar dropdown
      </p>
    </div>
  );
}
