'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  RefreshCw,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type ToastNotificationProps = {
  customization: Customization;
};

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

type Toast = {
  id: number;
  variant: ToastVariant;
  title: string;
  message: string;
};

export function ToastNotification({ customization }: ToastNotificationProps) {
  const [toasts, setToasts] = useState<Toast[]>([
    { id: 1, variant: 'success', title: 'Success!', message: 'Your changes have been saved.' },
    { id: 2, variant: 'error', title: 'Error', message: 'Something went wrong.' },
  ]);
  const toastWidth = parseInt(customization.toastWidth) || 320;
  const showIcon = customization.showIcon !== 'false';

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const variantConfig: Record<ToastVariant, { icon: React.ElementType; color: string }> = {
    success: { icon: CheckCircle2, color: '#22c55e' },
    error: { icon: XCircle, color: '#ef4444' },
    warning: { icon: AlertCircle, color: '#f59e0b' },
    info: { icon: Info, color: customization.primaryColor },
  };

  const addToast = (variant: ToastVariant) => {
    const messages: Record<ToastVariant, { title: string; message: string }> = {
      success: { title: 'Success!', message: 'Your changes have been saved.' },
      error: { title: 'Error', message: 'Something went wrong.' },
      warning: { title: 'Warning', message: 'Please check your input.' },
      info: { title: 'Info', message: 'New update available.' },
    };

    const newToast: Toast = {
      id: Date.now(),
      variant,
      ...messages[variant],
    };

    setToasts((prev) => [...prev, newToast].slice(-3));
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '300px' }}>
      {/* Trigger buttons */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
        {(['success', 'error', 'warning', 'info'] as ToastVariant[]).map((variant) => {
          const config = variantConfig[variant];
          return (
            <motion.button
              key={variant}
              className="px-3 py-1.5 text-xs font-medium rounded-lg capitalize"
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
              }}
              onClick={() => addToast(variant)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {variant}
            </motion.button>
          );
        })}
        <motion.button
          className="px-3 py-1.5 text-xs font-medium rounded-lg"
          style={{
            backgroundColor: `${customization.textColor}10`,
            color: `${customization.textColor}70`,
          }}
          onClick={() => setToasts([])}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Toast container */}
      <div className="absolute bottom-4 right-4 left-4 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const config = variantConfig[toast.variant];
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                layout
                className="flex items-start gap-3 p-4 rounded-xl border shadow-lg"
                style={{
                  width: toastWidth,
                  backgroundColor: customization.backgroundColor,
                  borderColor: `${config.color}30`,
                  borderRadius: `${customization.borderRadius}px`,
                  boxShadow: `0 10px 25px ${config.color}15`,
                }}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                {/* Icon */}
                {showIcon && (
                  <div
                    className="p-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: customization.textColor }}>
                    {toast.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: `${customization.textColor}70` }}
                  >
                    {toast.message}
                  </p>
                </div>

                {/* Close button */}
                <motion.button
                  className="p-1 rounded shrink-0"
                  style={{ color: `${customization.textColor}50` }}
                  onClick={() => removeToast(toast.id)}
                  whileHover={{ backgroundColor: `${customization.textColor}10` }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>

                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 rounded-b-xl"
                  style={{
                    backgroundColor: config.color,
                    borderBottomLeftRadius: `${customization.borderRadius}px`,
                  }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  onAnimationComplete={() => removeToast(toast.id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state hint */}
      {toasts.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: `${customization.textColor}40` }}
        >
          <p className="text-sm">Click a button to show a toast</p>
        </div>
      )}
    </div>
  );
}
