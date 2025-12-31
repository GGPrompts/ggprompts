'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // md breakpoint in Tailwind
const TABLET_BREAKPOINT = 1024; // lg breakpoint in Tailwind

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param breakpoint - Custom breakpoint in pixels (default: 768)
 * @returns boolean indicating if viewport is below breakpoint
 */
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial value
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to detect if the current viewport is tablet-sized or smaller
 * @returns boolean indicating if viewport is below tablet breakpoint (1024px)
 */
export function useIsTablet(): boolean {
  return useIsMobile(TABLET_BREAKPOINT);
}

/**
 * Hook that returns current viewport size category
 * @returns 'mobile' | 'tablet' | 'desktop'
 */
export function useViewportSize(): 'mobile' | 'tablet' | 'desktop' {
  const [size, setSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setSize('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setSize('tablet');
      } else {
        setSize('desktop');
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return size;
}

export { MOBILE_BREAKPOINT, TABLET_BREAKPOINT };
