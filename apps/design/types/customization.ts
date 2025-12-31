export type Customization = {
  // Colors
  colorPreset?: string; // Track which preset is active (e.g., 'terminal', 'ocean')
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  surfaceColor?: string; // For badges and surface elements

  // Typography
  fontFamily: string;
  fontSize: string;
  fontWeight: string;

  // Spacing
  padding: string;
  margin: string;
  borderRadius: string;

  // Effects
  animation: 'none' | 'smooth' | 'bounce' | 'spring';
  duration: string;
  shadowIntensity: string;
  blurAmount: string; // Glass blur amount (string for slider)
  glassOpacity?: string; // Glass opacity (string for slider)

  // Framework
  framework: 'react' | 'nextjs' | 'vue' | 'svelte' | 'vanilla' | 'astro';
  typescript: boolean;
  styling: 'tailwind' | 'css-modules' | 'styled-components';

  // Features
  responsive: boolean;
  darkMode: boolean;
  accessibility: boolean;
  animations: boolean;

  // Modal-specific
  backdropOpacity?: string;
  modalScale?: string;

  // Form-specific
  inputHeight?: string;
  focusRingWidth?: string;

  // Data display-specific
  showGrid?: string; // 'true'/'false'
  dataPointSize?: string;

  // Navigation-specific
  indicatorSize?: string;
  showLabels?: string; // 'true'/'false'

  // Header-specific
  headerHeight?: string;
  showDivider?: string; // 'true'/'false'

  // Footer-specific
  columnCount?: string;

  // Hero-specific
  heroHeight?: string;
  showBadge?: string; // 'true'/'false'

  // Marketing-specific
  sectionPadding?: string;
  showDecorations?: string; // 'true'/'false'

  // Pricing-specific
  showPopular?: string; // 'true'/'false'

  // Testimonial-specific
  showAvatar?: string; // 'true'/'false'
  quoteSize?: string;

  // Auth-specific
  showSocialLogin?: string; // 'true'/'false'
  formWidth?: string;

  // Badge-specific
  badgeSize?: string;
  pulseAnimation?: string; // 'true'/'false'

  // Feedback-specific
  animationSpeed?: string;
  showIcon?: string; // 'true'/'false'

  // Component-specific (dynamic based on selected component)
  [key: string]: any;
};

export const defaultCustomization: Customization = {
  // Colors
  primaryColor: '#10b981',
  secondaryColor: '#06b6d4',
  backgroundColor: '#0a0a0a',
  textColor: '#f0fdf4',
  surfaceColor: '#1a1a1a',

  // Typography
  fontFamily: 'Inter',
  fontSize: '16',
  fontWeight: '400',

  // Spacing
  padding: '20',
  margin: '10',
  borderRadius: '8',

  // Effects
  animation: 'smooth',
  duration: '300',
  shadowIntensity: '50',
  blurAmount: '12',

  // Framework
  framework: 'react',
  typescript: true,
  styling: 'tailwind',

  // Features
  responsive: true,
  darkMode: true,
  accessibility: true,
  animations: true,

  // Component-specific defaults (added dynamically)
  glassOpacity: '15',
  glassBorderOpacity: '40',
  floatHeight: '10',
  rotationX: '5',
  rotationY: '5',
  glowIntensity: '60',
  glowSpread: '40',
  pulseSpeed: '2',
  gradientAngle: '135',
  hoverScale: '1.05',
  neoDepth: '8',
  softShadowIntensity: '20',
  particleCount: '20',
  explosionRadius: '50',
  fieldStagger: '0.1',
  stepCount: '3',
  progressStyle: 'bar',
  navPosition: 'top',
  navSpacing: '20',
  sidebarWidth: '240',
  collapseWidth: '60',
  trailLength: '8',
  cursorBlendMode: 'screen',
  cursorSize: '20',
  parallaxSpeed: '0.5',
  layerCount: '3',
  parallaxDirection: 'vertical',

  // Modal-specific defaults
  backdropOpacity: '50',
  modalScale: '100',

  // Form-specific defaults
  inputHeight: '40',
  focusRingWidth: '2',

  // Data display-specific defaults
  showGrid: 'true',
  dataPointSize: '8',

  // Navigation-specific defaults
  indicatorSize: '4',
  showLabels: 'true',

  // Header-specific defaults
  headerHeight: '64',
  showDivider: 'true',

  // Footer-specific defaults
  columnCount: '4',

  // Hero-specific defaults
  heroHeight: '600',
  showBadge: 'true',

  // Marketing-specific defaults
  sectionPadding: '80',
  showDecorations: 'true',

  // Pricing-specific defaults
  showPopular: 'true',

  // Testimonial-specific defaults
  showAvatar: 'true',
  quoteSize: '18',

  // Auth-specific defaults
  showSocialLogin: 'true',
  formWidth: '400',

  // Badge-specific defaults
  badgeSize: '24',
  pulseAnimation: 'false',

  // Feedback-specific defaults
  animationSpeed: '300',
  showIcon: 'true',
};
