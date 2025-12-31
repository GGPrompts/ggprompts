import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection } from '@/types/collection';
import { frameworks, stylingOptions } from '@/config/presets.config';

/**
 * Generate a Cursor-style prompt for a single component.
 * Cursor prefers concise, inline-focused specifications with comment-style formatting.
 */
export function generateCursorPrompt(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  const features = [];
  if (customization.responsive) features.push('responsive');
  if (customization.darkMode) features.push('dark-mode');
  if (customization.accessibility) features.push('a11y');
  if (customization.animations) features.push('animated');

  const componentSpecificSpecs = getComponentSpecificSpecs(component, customization);

  const prompt = `// File: components/${toPascalCase(component.id)}.tsx
// Type: ${component.category}/${component.name}
// Style: ${getStylingDescription(component, customization)}
// Colors: primary=${customization.primaryColor}, secondary=${customization.secondaryColor}, bg=${customization.backgroundColor}, text=${customization.textColor}
// Typography: ${customization.fontFamily}, ${customization.fontSize}px, weight:${customization.fontWeight}
// Spacing: padding:${customization.padding}px, margin:${customization.margin}px, radius:${customization.borderRadius}px
// Animation: ${customization.animation}${customization.animation !== 'none' ? `, duration:${customization.duration}ms` : ''}${customization.animations ? ', framer-motion' : ''}
// Effects: shadow:${customization.shadowIntensity}%, blur:${customization.blurAmount}px
${componentSpecificSpecs ? `// Specs: ${componentSpecificSpecs}\n` : ''}// Features: ${features.join(', ') || 'none'}

Create a ${component.name} component with the above specs.
${customization.typescript ? 'Include TypeScript types' : 'Use JavaScript'}${stylingName === 'Tailwind CSS' ? ' and Tailwind classes' : ` with ${stylingName}`}.
Framework: ${frameworkName}.`;

  return prompt;
}

/**
 * Get styling description based on component type
 */
function getStylingDescription(
  component: ComponentDefinition,
  customization: Customization
): string {
  const styles: string[] = [];

  // Check for glass effects
  if (component.tags.includes('glass') || component.tags.includes('blur')) {
    styles.push(`glassmorphism, blur:${customization.blurAmount}px, opacity:${customization.glassOpacity}%`);
  }

  // Check for neon/glow effects
  if (component.tags.includes('neon') || component.tags.includes('glow')) {
    styles.push(`neon-glow, intensity:${customization.glowIntensity}%, spread:${customization.glowSpread}px`);
  }

  // Check for gradient
  if (component.tags.includes('gradient')) {
    styles.push(`gradient, angle:${customization.gradientAngle}deg`);
  }

  // Check for 3D/float effects
  if (component.tags.includes('3d') || component.tags.includes('float')) {
    styles.push(`3d-transform, rotateX:${customization.rotationX}deg, rotateY:${customization.rotationY}deg`);
  }

  // Check for neomorphic
  if (component.tags.includes('neomorphic')) {
    styles.push(`neomorphic, depth:${customization.neoDepth}px`);
  }

  if (styles.length === 0) {
    styles.push('modern, clean');
  }

  return styles.join(', ');
}

/**
 * Get component-specific specs in a concise format
 */
function getComponentSpecificSpecs(
  component: ComponentDefinition,
  customization: Customization
): string {
  switch (component.id) {
    case 'glass-card':
      return `glass-opacity:${customization.glassOpacity}%, border-opacity:${customization.glassBorderOpacity}%`;

    case 'floating-card':
      return `float-height:${customization.floatHeight}px, rotate:${customization.rotationX}/${customization.rotationY}deg`;

    case 'neon-card':
      return `glow:${customization.glowIntensity}%, spread:${customization.glowSpread}px, pulse:${customization.pulseSpeed}s`;

    case 'gradient-btn':
      return `gradient-angle:${customization.gradientAngle}deg, hover-scale:${customization.hoverScale}x`;

    case 'neo-btn':
      return `neo-depth:${customization.neoDepth}px, soft-shadow:${customization.softShadowIntensity}%`;

    case 'particle-btn':
      return `particles:${customization.particleCount}, explosion:${customization.explosionRadius}px`;

    case 'animated-input':
    case 'animated-form':
      return `field-stagger:${customization.fieldStagger}s`;

    case 'step-form':
      return `steps:${customization.stepCount}, progress:${customization.progressStyle}`;

    case 'cursor-follow':
      return `trail:${customization.trailLength}, blend:${customization.cursorBlendMode}, size:${customization.cursorSize}px`;

    case 'parallax-scroll':
      return `speed:${customization.parallaxSpeed}, layers:${customization.layerCount}, dir:${customization.parallaxDirection}`;

    case 'sidebar-nav':
      return `width:${customization.sidebarWidth}px, collapsed:${customization.collapseWidth}px`;

    default:
      return '';
  }
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Generate a Cursor collection prompt with inline specs for all components.
 * Optimized for copy-paste into Cursor with minimal verbosity.
 */
export function generateCursorCollectionPrompt(collection: Collection): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const componentSpecs = components
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return null;
      return generateInlineSpec(componentDef, saved.customization, saved.notes);
    })
    .filter(Boolean)
    .join('\n\n');

  const tokens = extractTokens(collection);

  return `// Design System: ${collection.name}
// Components: ${collection.components.length}
${collection.description ? `// Description: ${collection.description}\n` : ''}${collection.tags.length > 0 ? `// Tags: ${collection.tags.join(', ')}\n` : ''}
// === DESIGN TOKENS ===
// Colors: primary=[${tokens.colors.primary}], secondary=[${tokens.colors.secondary}]
// Typography: fonts=[${tokens.fonts}], sizes=[${tokens.sizes}]
// Spacing: padding=[${tokens.padding}], radius=[${tokens.radius}]
// Animations: types=[${tokens.animations}], durations=[${tokens.durations}]

// === COMPONENTS ===

${componentSpecs}

// === INSTRUCTIONS ===
// Create all components above with consistent design tokens.
// Use TypeScript and Tailwind CSS.
// Ensure components are reusable with proper props.
// Follow accessibility best practices.

Generated with design2prompt`;
}

/**
 * Generate inline spec for a single component (used in collection prompt)
 */
function generateInlineSpec(
  component: ComponentDefinition,
  customization: Customization,
  notes?: string
): string {
  const features = [];
  if (customization.responsive) features.push('responsive');
  if (customization.darkMode) features.push('dark-mode');
  if (customization.accessibility) features.push('a11y');

  const specificSpecs = getComponentSpecificSpecs(component, customization);

  return `// --- ${component.name} ---
// File: components/${toPascalCase(component.id)}.tsx
// Colors: ${customization.primaryColor}, ${customization.secondaryColor}
// Layout: p:${customization.padding}px, radius:${customization.borderRadius}px
// Animation: ${customization.animation}, ${customization.duration}ms
${specificSpecs ? `// Specs: ${specificSpecs}\n` : ''}// Features: ${features.join(', ') || 'standard'}${notes ? `\n// Notes: ${notes}` : ''}`;
}

/**
 * Extract design tokens from collection in a concise format
 */
function extractTokens(collection: Collection): {
  colors: { primary: string; secondary: string };
  fonts: string;
  sizes: string;
  padding: string;
  radius: string;
  animations: string;
  durations: string;
} {
  const primary = new Set<string>();
  const secondary = new Set<string>();
  const fonts = new Set<string>();
  const sizes = new Set<string>();
  const padding = new Set<string>();
  const radius = new Set<string>();
  const animations = new Set<string>();
  const durations = new Set<string>();

  collection.components.forEach((saved) => {
    const c = saved.customization;
    primary.add(c.primaryColor);
    secondary.add(c.secondaryColor);
    fonts.add(c.fontFamily);
    sizes.add(`${c.fontSize}px`);
    padding.add(`${c.padding}px`);
    radius.add(`${c.borderRadius}px`);
    animations.add(c.animation);
    durations.add(`${c.duration}ms`);
  });

  return {
    colors: {
      primary: Array.from(primary).join(', '),
      secondary: Array.from(secondary).join(', '),
    },
    fonts: Array.from(fonts).join(', '),
    sizes: Array.from(sizes).join(', '),
    padding: Array.from(padding).join(', '),
    radius: Array.from(radius).join(', '),
    animations: Array.from(animations).join(', '),
    durations: Array.from(durations).join(', '),
  };
}

/**
 * Generate individual Cursor prompts for each component in a collection.
 * Returns an array of prompts, one per component.
 */
export function generateCursorIndividualPrompts(collection: Collection): string[] {
  return collection.components
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return '';

      let prompt = generateCursorPrompt(componentDef, saved.customization);

      // Append notes if present
      if (saved.notes) {
        prompt += `\n// Note: ${saved.notes}`;
      }

      return prompt;
    })
    .filter(Boolean);
}
