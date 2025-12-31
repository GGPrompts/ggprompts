'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Menu, X, PanelLeft, PanelLeftClose, PanelRight, PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  variant?: 'hamburger' | 'panel-left' | 'panel-right';
}

/**
 * Animated hamburger/panel toggle button
 */
export function HamburgerButton({
  isOpen,
  onClick,
  className,
  variant = 'hamburger',
}: HamburgerButtonProps) {
  const getIcon = () => {
    switch (variant) {
      case 'panel-left':
        return isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />;
      case 'panel-right':
        return isOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />;
      case 'hamburger':
      default:
        return isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />;
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors',
        className
      )}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {getIcon()}
    </motion.button>
  );
}

interface MobileNavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: number | string;
  active?: boolean;
}

interface MobileNavListProps {
  items: MobileNavItem[];
  onItemClick?: (item: MobileNavItem) => void;
  className?: string;
}

/**
 * Navigation list for mobile drawer
 */
export function MobileNavList({ items, onItemClick, className }: MobileNavListProps) {
  return (
    <nav className={cn('flex flex-col gap-1 p-2', className)}>
      {items.map((item) => (
        <MobileNavListItem
          key={item.id}
          item={item}
          onClick={() => {
            item.onClick?.();
            onItemClick?.(item);
          }}
        />
      ))}
    </nav>
  );
}

interface MobileNavListItemProps {
  item: MobileNavItem;
  onClick?: () => void;
}

function MobileNavListItem({ item, onClick }: MobileNavListItemProps) {
  const Component = item.href ? 'a' : 'button';

  return (
    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
      <Component
        href={item.href}
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
          item.active
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
        )}
      >
        {item.icon && (
          <span
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              item.active ? 'bg-emerald-500/20' : 'bg-white/5'
            )}
          >
            {item.icon}
          </span>
        )}
        <span className="flex-1 font-medium">{item.label}</span>
        {item.badge !== undefined && (
          <span
            className={cn(
              'px-2.5 py-1 text-xs font-bold rounded-full',
              item.active
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 text-white/70'
            )}
          >
            {item.badge}
          </span>
        )}
      </Component>
    </motion.div>
  );
}

interface MobileSidebarToggleProps {
  leftOpen?: boolean;
  rightOpen?: boolean;
  onLeftToggle?: () => void;
  onRightToggle?: () => void;
  showLeft?: boolean;
  showRight?: boolean;
  className?: string;
}

/**
 * Sidebar toggle buttons for mobile (typically shown in header)
 * Shows panel icons instead of hamburger for sidebar-style navigation
 */
export function MobileSidebarToggle({
  leftOpen = false,
  rightOpen = false,
  onLeftToggle,
  onRightToggle,
  showLeft = true,
  showRight = false,
  className,
}: MobileSidebarToggleProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showLeft && onLeftToggle && (
        <HamburgerButton
          isOpen={leftOpen}
          onClick={onLeftToggle}
          variant="panel-left"
        />
      )}
      {showRight && onRightToggle && (
        <HamburgerButton
          isOpen={rightOpen}
          onClick={onRightToggle}
          variant="panel-right"
        />
      )}
    </div>
  );
}

export type { MobileNavItem };
