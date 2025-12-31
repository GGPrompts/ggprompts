// Color presets for quick theme switching
export const colorPresets = {
  terminal: {
    name: 'Terminal',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    backgroundColor: '#0a0a0a',
    textColor: '#f0fdf4',
  },
  sunset: {
    name: 'Sunset',
    primaryColor: '#f97316',
    secondaryColor: '#ec4899',
    backgroundColor: '#1c1917',
    textColor: '#fef3c7',
  },
  ocean: {
    name: 'Ocean',
    primaryColor: '#0ea5e9',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#0c1929',
    textColor: '#e0f2fe',
  },
  forest: {
    name: 'Forest',
    primaryColor: '#22c55e',
    secondaryColor: '#84cc16',
    backgroundColor: '#14190f',
    textColor: '#ecfccb',
  },
  midnight: {
    name: 'Midnight',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    backgroundColor: '#0f0f1a',
    textColor: '#e0e7ff',
  },
  rose: {
    name: 'Rose',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    backgroundColor: '#1a0a0f',
    textColor: '#ffe4e6',
  },
};

export type PresetKey = keyof typeof colorPresets;

// Framework options
export const frameworks = {
  react: 'React + TypeScript',
  nextjs: 'Next.js 15+ App Router',
  vue: 'Vue 3 Composition API',
  svelte: 'SvelteKit',
  vanilla: 'Vanilla JS',
  astro: 'Astro',
} as const;

export type FrameworkKey = keyof typeof frameworks;

// Styling options
export const stylingOptions = {
  tailwind: 'Tailwind CSS',
  'css-modules': 'CSS Modules',
  'styled-components': 'Styled Components',
} as const;

export type StylingKey = keyof typeof stylingOptions;

// Animation presets
export const animationPresets = {
  none: { name: 'None', duration: 0 },
  smooth: { name: 'Smooth', duration: 300 },
  bounce: { name: 'Bounce', duration: 500 },
  spring: { name: 'Spring', duration: 400 },
} as const;

export type AnimationKey = keyof typeof animationPresets;
