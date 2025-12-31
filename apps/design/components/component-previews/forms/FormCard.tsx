'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Check, Loader2 } from 'lucide-react';
import { Customization } from '@/types/customization';

type FormCardProps = {
  customization: Customization;
};

type FormField = {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  icon: React.ElementType;
  required?: boolean;
};

const formFields: FormField[] = [
  { id: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text', icon: User, required: true },
  { id: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email', icon: Mail, required: true },
  { id: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', type: 'tel', icon: Phone },
  { id: 'address', label: 'Address', placeholder: '123 Main St', type: 'text', icon: MapPin },
];

export function FormCard({ customization }: FormCardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const glassOpacity = parseInt(customization.glassOpacity || '15') || 15;
  const blurAmount = parseInt(customization.blurAmount || '12') || 12;
  const opacityToHex = (opacity: number) => Math.round(opacity * 2.55).toString(16).padStart(2, '0');

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const resetForm = () => {
    setValues({});
    setIsSubmitted(false);
  };

  const filledFields = Object.values(values).filter((v) => v.trim()).length;
  const progress = (filledFields / formFields.length) * 100;

  return (
    <motion.div
      className="w-full max-w-md p-6 border"
      style={{
        ...baseStyle,
        backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 4)}`,
        backdropFilter: `blur(${blurAmount}px)`,
        borderColor: `${customization.primaryColor}30`,
        borderRadius: `${customization.borderRadius}px`,
        boxShadow: `0 20px 60px ${customization.primaryColor}15`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{
                background: `linear-gradient(135deg, #22c55e, #16a34a)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: customization.textColor }}
            >
              Form Submitted!
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: `${customization.textColor}60` }}
            >
              We&apos;ve received your information
            </p>
            <motion.button
              type="button"
              className="px-6 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: `${customization.primaryColor}20`,
                color: customization.primaryColor,
              }}
              onClick={resetForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Another
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h3
                className="text-xl font-semibold mb-1"
                style={{ color: customization.textColor }}
              >
                Contact Information
              </h3>
              <p
                className="text-sm"
                style={{ color: `${customization.textColor}60` }}
              >
                Fill out the form below to get in touch
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: `${customization.textColor}60` }}
                >
                  Form Progress
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: customization.primaryColor }}
                >
                  {filledFields}/{formFields.length} fields
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${customization.textColor}20` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {formFields.map((field, index) => {
                const Icon = field.icon;
                const isFocused = focused === field.id;
                const hasValue = values[field.id]?.trim();

                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label
                      className="block mb-1.5 text-sm font-medium"
                      style={{ color: `${customization.textColor}90` }}
                    >
                      {field.label}
                      {field.required && (
                        <span style={{ color: '#ef4444' }}> *</span>
                      )}
                    </label>
                    <div className="relative">
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        animate={{
                          color: isFocused ? customization.primaryColor : `${customization.textColor}50`,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={values[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        onFocus={() => setFocused(field.id)}
                        onBlur={() => setFocused(null)}
                        className="w-full pl-11 pr-4 py-3 border-2 outline-none transition-all"
                        style={{
                          borderColor: isFocused
                            ? customization.primaryColor
                            : hasValue
                            ? `${customization.primaryColor}50`
                            : `${customization.textColor}20`,
                          borderRadius: `${customization.borderRadius}px`,
                          backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 2.5)}`,
                          color: customization.textColor,
                        }}
                        required={field.required}
                      />
                      {hasValue && (
                        <motion.div
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check
                            className="w-4 h-4"
                            style={{ color: '#22c55e' }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Payment Method (Optional Section) */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: `${customization.textColor}15` }}>
              <div
                className="flex items-center gap-2 mb-4"
                style={{ color: `${customization.textColor}70` }}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Details (Optional)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full px-4 py-2.5 border-2 outline-none transition-colors text-sm"
                    style={{
                      borderColor: `${customization.textColor}20`,
                      borderRadius: `${customization.borderRadius}px`,
                      backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 2.5)}`,
                      color: customization.textColor,
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-2.5 border-2 outline-none transition-colors text-sm"
                  style={{
                    borderColor: `${customization.textColor}20`,
                    borderRadius: `${customization.borderRadius}px`,
                    backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 2.5)}`,
                    color: customization.textColor,
                  }}
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full px-4 py-2.5 border-2 outline-none transition-colors text-sm"
                  style={{
                    borderColor: `${customization.textColor}20`,
                    borderRadius: `${customization.borderRadius}px`,
                    backgroundColor: `${customization.backgroundColor}${opacityToHex(glassOpacity * 2.5)}`,
                    color: customization.textColor,
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3 font-semibold flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`,
                borderRadius: `${customization.borderRadius}px`,
                color: '#fff',
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 10px 30px ${customization.primaryColor}40` }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Form'
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="mt-4 text-xs opacity-50 text-center" style={{ color: customization.textColor }}>
        Complete form with progress tracking
      </p>
    </motion.div>
  );
}
