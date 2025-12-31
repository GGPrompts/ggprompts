'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type DrawerSide = 'left' | 'right';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: DrawerSide;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  width?: string;
}

const slideVariants = {
  left: {
    closed: { x: '-100%' },
    open: { x: 0 },
  },
  right: {
    closed: { x: '100%' },
    open: { x: 0 },
  },
};

export function MobileDrawer({
  isOpen,
  onClose,
  side = 'left',
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  width = 'w-72',
}: MobileDrawerProps) {
  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={slideVariants[side]}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className={cn(
              'fixed top-0 bottom-0 z-50 flex flex-col bg-zinc-900 border-white/10 shadow-2xl',
              width,
              side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
              className
            )}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'absolute top-4 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10',
                  side === 'left' ? 'right-4' : 'left-4'
                )}
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface MobileDrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawerHeader({ children, className }: MobileDrawerHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-4 border-b border-white/10',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileDrawerContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawerContent({ children, className }: MobileDrawerContentProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto', className)}>
      {children}
    </div>
  );
}

interface MobileDrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawerFooter({ children, className }: MobileDrawerFooterProps) {
  return (
    <div
      className={cn(
        'px-4 py-4 border-t border-white/10',
        className
      )}
    >
      {children}
    </div>
  );
}
