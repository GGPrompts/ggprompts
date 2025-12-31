'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Customization } from '@/types/customization';

type AlertBannerProps = {
  customization: Customization;
};

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export function AlertBanner({ customization }: AlertBannerProps) {
  const [currentVariant, setCurrentVariant] = useState<AlertVariant>('info');
  const [isVisible, setIsVisible] = useState(true);

  const baseStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}px`,
    fontWeight: customization.fontWeight,
  };

  const variantConfig: Record<
    AlertVariant,
    { icon: React.ElementType; color: string; title: string; message: string }
  > = {
    success: {
      icon: CheckCircle2,
      color: '#22c55e',
      title: 'Successfully deployed!',
      message: 'Your application is now live and running.',
    },
    error: {
      icon: XCircle,
      color: '#ef4444',
      title: 'Deployment failed',
      message: 'There was an error deploying your application.',
    },
    warning: {
      icon: AlertTriangle,
      color: '#f59e0b',
      title: 'Action required',
      message: 'Your subscription expires in 3 days.',
    },
    info: {
      icon: Info,
      color: customization.primaryColor,
      title: 'New feature available',
      message: 'Check out our latest updates and improvements.',
    },
  };

  const config = variantConfig[currentVariant];
  const Icon = config.icon;

  const cycleVariant = () => {
    const variants: AlertVariant[] = ['success', 'error', 'warning', 'info'];
    const currentIndex = variants.indexOf(currentVariant);
    setCurrentVariant(variants[(currentIndex + 1) % variants.length]);
    setIsVisible(true);
  };

  return (
    <div className="w-full max-w-md relative" style={{ ...baseStyle, minHeight: '280px' }}>
      {/* Variant selector */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
        {(['success', 'error', 'warning', 'info'] as AlertVariant[]).map((variant) => {
          const vConfig = variantConfig[variant];
          return (
            <motion.button
              key={variant}
              className="px-3 py-1.5 text-xs font-medium rounded-lg capitalize"
              style={{
                backgroundColor:
                  variant === currentVariant ? vConfig.color : `${vConfig.color}20`,
                color: variant === currentVariant ? 'white' : vConfig.color,
              }}
              onClick={() => {
                setCurrentVariant(variant);
                setIsVisible(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {variant}
            </motion.button>
          );
        })}
      </div>

      {/* Banner area */}
      <div className="absolute top-16 left-0 right-0 px-4">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={currentVariant}
              className="w-full border overflow-hidden"
              style={{
                backgroundColor: `${config.color}08`,
                borderColor: `${config.color}30`,
                borderRadius: `${customization.borderRadius}px`,
              }}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Gradient accent line */}
              <motion.div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${config.color}, ${customization.secondaryColor})`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <motion.div
                    className="p-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${config.color}15` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: customization.textColor }}
                    >
                      {config.title}
                    </p>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: `${customization.textColor}70` }}
                    >
                      {config.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      <motion.button
                        className="text-xs font-medium flex items-center gap-1"
                        style={{ color: config.color }}
                        whileHover={{ gap: '6px' }}
                      >
                        Learn more
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        className="text-xs"
                        style={{ color: `${customization.textColor}50` }}
                        onClick={() => setIsVisible(false)}
                        whileHover={{ color: customization.textColor }}
                      >
                        Dismiss
                      </motion.button>
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    className="p-1 rounded shrink-0"
                    style={{ color: `${customization.textColor}50` }}
                    onClick={() => setIsVisible(false)}
                    whileHover={{ backgroundColor: `${customization.textColor}10` }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show again button */}
        {!isVisible && (
          <motion.button
            className="w-full py-3 mt-4 border rounded-lg flex items-center justify-center gap-2 text-sm"
            style={{
              borderColor: `${customization.textColor}20`,
              color: `${customization.textColor}70`,
            }}
            onClick={() => setIsVisible(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
          >
            <RefreshCw className="w-4 h-4" />
            Show banner again
          </motion.button>
        )}
      </div>

      {/* Info text */}
      <div
        className="absolute bottom-4 left-4 right-4 text-center text-xs"
        style={{ color: `${customization.textColor}40` }}
      >
        Full-width alert banners with multiple variants
      </div>
    </div>
  );
}
