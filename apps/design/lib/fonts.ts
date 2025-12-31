import { Inter, JetBrains_Mono, Space_Grotesk, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

// Font theme configurations for the showcase
export const fontThemes = [
  {
    id: 'modern',
    name: 'Modern',
    fontFamily: 'Inter, sans-serif',
    variable: '--font-inter',
    className: inter.className,
  },
  {
    id: 'developer',
    name: 'Developer',
    fontFamily: 'JetBrains Mono, monospace',
    variable: '--font-jetbrains',
    className: jetbrainsMono.className,
  },
  {
    id: 'geometric',
    name: 'Geometric',
    fontFamily: 'Space Grotesk, sans-serif',
    variable: '--font-space-grotesk',
    className: spaceGrotesk.className,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    fontFamily: 'Playfair Display, serif',
    variable: '--font-playfair',
    className: playfairDisplay.className,
  },
] as const;

export type FontTheme = (typeof fontThemes)[number];
