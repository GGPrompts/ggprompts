import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection } from '@/types/collection';
import { frameworks, stylingOptions } from '@/config/presets.config';

/**
 * Generates a GitHub Copilot-optimized prompt for a single component.
 * Output is formatted as JSDoc/TSDoc comments optimized for autocomplete.
 *
 * @param component - The component definition from the registry
 * @param customization - The customization settings applied to the component
 * @returns A JSDoc-formatted string optimized for Copilot autocomplete
 */
export function generateCopilotPrompt(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  const features = buildFeatureAnnotations(customization);
  const componentProps = buildComponentProps(component, customization);
  const animations = buildAnimationAnnotation(customization);
  const specificProps = getComponentSpecificProps(component, customization);

  const prompt = `/**
 * @component ${formatComponentName(component.name)}
 * @description ${component.description}
 * @category ${component.category}
 * @style ${getStyleFromTags(component.tags)}
 *
 * @framework ${frameworkName}
 * @styling ${stylingName}
 * @typescript ${customization.typescript ? 'enabled' : 'disabled'}
 *
 * ${componentProps}
 *
 * @colors
 * @prop {string} primaryColor - "${customization.primaryColor}"
 * @prop {string} secondaryColor - "${customization.secondaryColor}"
 * @prop {string} backgroundColor - "${customization.backgroundColor}"
 * @prop {string} textColor - "${customization.textColor}"
 *
 * @typography
 * @prop {string} fontFamily - "${customization.fontFamily}"
 * @prop {string} fontSize - "${customization.fontSize}px"
 * @prop {string} fontWeight - "${customization.fontWeight}"
 *
 * @spacing
 * @prop {string} padding - "${customization.padding}px"
 * @prop {string} margin - "${customization.margin}px"
 * @prop {string} borderRadius - "${customization.borderRadius}px"
 *
 * @effects
 * @prop {string} shadowIntensity - "${customization.shadowIntensity}%"
 * @prop {string} blurAmount - "${customization.blurAmount}px"
 * ${animations}
 *
 * ${specificProps}
 *
 * ${features}
 *
 * @tags ${component.tags.join(', ')}
 *
 * @example
 * // Basic usage
 * <${formatComponentName(component.name)} />
 *
 * @example
 * // With custom props
 * <${formatComponentName(component.name)}
 *   primaryColor="${customization.primaryColor}"
 *   className="custom-class"
 * />
 */`;

  return prompt;
}

/**
 * Generates a collection of components as a single JSDoc block.
 * Useful for generating design system documentation.
 *
 * @param collection - The collection of saved components
 * @returns A JSDoc-formatted string documenting all components
 */
export function generateCopilotCollectionPrompt(collection: Collection): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const componentDocs = components
    .map((saved, index) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return null;
      return generateComponentDocBlock(componentDef, saved.customization, index + 1);
    })
    .filter(Boolean)
    .join('\n\n');

  const designTokens = generateDesignTokensBlock(collection);

  return `/**
 * @module ${formatModuleName(collection.name)}
 * @description ${collection.description || 'A curated collection of UI components'}
 * @version 1.0.0
 * @generated design2prompt
 *
 * @summary
 * Components: ${collection.components.length}
 * Tags: ${collection.tags.length > 0 ? collection.tags.join(', ') : 'none'}
 * Created: ${new Date(collection.createdAt).toISOString().split('T')[0]}
 */

${designTokens}

// ============================================
// COMPONENT DEFINITIONS
// ============================================

${componentDocs}

/**
 * @example
 * // Import all components from this design system
 * import {
${components.map(c => {
  const def = getComponentById(c.componentId);
  return def ? ` *   ${formatComponentName(def.name)},` : null;
}).filter(Boolean).join('\n')}
 * } from './${formatModuleName(collection.name)}';
 */`;
}

/**
 * Generates individual Copilot prompts for each component in a collection.
 * Returns an array of prompts that can be used separately.
 *
 * @param collection - The collection of saved components
 * @returns An array of JSDoc-formatted prompts
 */
export function generateCopilotIndividualPrompts(collection: Collection): string[] {
  return collection.components
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return '';
      return generateCopilotPrompt(componentDef, saved.customization);
    })
    .filter(Boolean);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formats a component name to PascalCase for use in code.
 */
function formatComponentName(name: string): string {
  return name
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Formats a module name to kebab-case.
 */
function formatModuleName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extracts the primary style from component tags.
 */
function getStyleFromTags(tags: string[]): string {
  const styleKeywords = ['glass', 'neon', 'gradient', 'neomorphic', 'floating', 'minimal', 'modern', 'animated'];
  const foundStyle = tags.find(tag => styleKeywords.includes(tag.toLowerCase()));
  return foundStyle || 'custom';
}

/**
 * Builds feature annotations for the component.
 */
function buildFeatureAnnotations(customization: Customization): string {
  const features = [];
  if (customization.responsive) features.push('@feature responsive - Mobile-first design');
  if (customization.darkMode) features.push('@feature darkMode - Dark mode support');
  if (customization.accessibility) features.push('@feature a11y - WCAG AA compliant');
  if (customization.animations) features.push('@feature animated - Motion effects enabled');

  return features.length > 0 ? features.map(f => ` * ${f}`).join('\n') : ' * @feature none';
}

/**
 * Builds component props annotation.
 */
function buildComponentProps(component: ComponentDefinition, customization: Customization): string {
  const props = component.customizableProps.map(prop => {
    const value = customization[prop as keyof Customization];
    const type = typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string';
    return `@prop {${type}} ${prop} - ${formatPropValue(value)}`;
  });

  return props.length > 0
    ? '@customizable\n * ' + props.join('\n * ')
    : '@customizable none';
}

/**
 * Builds animation annotation.
 */
function buildAnimationAnnotation(customization: Customization): string {
  if (customization.animation === 'none' || !customization.animations) {
    return '@animation none';
  }

  return `@animation ${customization.animation} - duration: ${customization.duration}ms`;
}

/**
 * Formats a prop value for display.
 */
function formatPropValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

/**
 * Gets component-specific props as JSDoc annotations.
 */
function getComponentSpecificProps(
  component: ComponentDefinition,
  customization: Customization
): string {
  switch (component.id) {
    case 'glass-card':
      return `@glass
 * @prop {string} glassOpacity - "${customization.glassOpacity}%"
 * @prop {string} glassBorderOpacity - "${customization.glassBorderOpacity}%"
 * @prop {string} backdropBlur - "${customization.blurAmount}px"
 * @visual Frosted glass aesthetic with blur backdrop`;

    case 'floating-card':
      return `@3d
 * @prop {string} floatHeight - "${customization.floatHeight}px"
 * @prop {string} rotationX - "${customization.rotationX}deg"
 * @prop {string} rotationY - "${customization.rotationY}deg"
 * @visual 3D perspective transforms on hover`;

    case 'neon-card':
      return `@neon
 * @prop {string} glowIntensity - "${customization.glowIntensity}%"
 * @prop {string} glowSpread - "${customization.glowSpread}px"
 * @prop {string} pulseSpeed - "${customization.pulseSpeed}s"
 * @visual Pulsing neon border with box-shadow glow`;

    case 'gradient-btn':
      return `@gradient
 * @prop {string} gradientAngle - "${customization.gradientAngle}deg"
 * @prop {string} hoverScale - "${customization.hoverScale}x"
 * @visual Gradient from primary to secondary with hover scale`;

    case 'neo-btn':
      return `@neomorphic
 * @prop {string} neoDepth - "${customization.neoDepth}px"
 * @prop {string} softShadowIntensity - "${customization.softShadowIntensity}%"
 * @visual Soft raised appearance with inset pressed state`;

    case 'particle-btn':
      return `@particle
 * @prop {number} particleCount - ${customization.particleCount}
 * @prop {string} explosionRadius - "${customization.explosionRadius}px"
 * @visual Particle explosion effect on click`;

    case 'animated-input':
    case 'animated-form':
      return `@animated
 * @prop {string} fieldStagger - "${customization.fieldStagger}s"
 * @visual Staggered entrance animations for form fields`;

    case 'step-form':
      return `@wizard
 * @prop {number} stepCount - ${customization.stepCount}
 * @prop {string} progressStyle - "${customization.progressStyle}"
 * @visual Multi-step form with progress indicator`;

    case 'glass-nav':
    case 'glass-modal':
      return `@glass
 * @prop {string} glassOpacity - "${customization.glassOpacity}%"
 * @prop {string} blurAmount - "${customization.blurAmount}px"
 * @visual Glassmorphic design with blur backdrop`;

    case 'sidebar-nav':
      return `@sidebar
 * @prop {string} sidebarWidth - "${customization.sidebarWidth}px"
 * @prop {string} collapseWidth - "${customization.collapseWidth}px"
 * @visual Collapsible sidebar with icon-only mode`;

    case 'cursor-follow':
      return `@cursor
 * @prop {number} trailLength - ${customization.trailLength}
 * @prop {string} cursorBlendMode - "${customization.cursorBlendMode}"
 * @prop {string} cursorSize - "${customization.cursorSize}px"
 * @visual Trailing cursor effect with blend modes`;

    case 'parallax-scroll':
      return `@parallax
 * @prop {string} parallaxSpeed - "${customization.parallaxSpeed}"
 * @prop {number} layerCount - ${customization.layerCount}
 * @prop {string} parallaxDirection - "${customization.parallaxDirection}"
 * @visual Multi-layer parallax scrolling effect`;

    default:
      return `@component-type ${component.category}
 * @tags ${component.tags.join(', ')}`;
  }
}

/**
 * Generates a doc block for a single component in a collection.
 */
function generateComponentDocBlock(
  component: ComponentDefinition,
  customization: Customization,
  index: number
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  return `/**
 * ${index}. ${formatComponentName(component.name)}
 * @component ${formatComponentName(component.name)}
 * @description ${component.description}
 * @category ${component.category}
 *
 * @framework ${frameworkName} + ${stylingName}
 * @typescript ${customization.typescript}
 *
 * @prop {string} primaryColor - "${customization.primaryColor}"
 * @prop {string} secondaryColor - "${customization.secondaryColor}"
 * @prop {string} backgroundColor - "${customization.backgroundColor}"
 * @prop {string} borderRadius - "${customization.borderRadius}px"
 * @prop {string} animation - "${customization.animation}" (${customization.duration}ms)
 *
 * @example
 * <${formatComponentName(component.name)} />
 */
interface ${formatComponentName(component.name)}Props {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}`;
}

/**
 * Generates design tokens block for a collection.
 */
function generateDesignTokensBlock(collection: Collection): string {
  const colors = {
    primary: new Set<string>(),
    secondary: new Set<string>(),
    background: new Set<string>(),
    text: new Set<string>(),
  };
  const typography = {
    fontFamilies: new Set<string>(),
    fontSizes: new Set<string>(),
    fontWeights: new Set<string>(),
  };
  const spacing = {
    padding: new Set<string>(),
    borderRadius: new Set<string>(),
  };

  collection.components.forEach((saved) => {
    const c = saved.customization;
    colors.primary.add(c.primaryColor);
    colors.secondary.add(c.secondaryColor);
    colors.background.add(c.backgroundColor);
    colors.text.add(c.textColor);
    typography.fontFamilies.add(c.fontFamily);
    typography.fontSizes.add(`${c.fontSize}px`);
    typography.fontWeights.add(c.fontWeight);
    spacing.padding.add(`${c.padding}px`);
    spacing.borderRadius.add(`${c.borderRadius}px`);
  });

  return `// ============================================
// DESIGN TOKENS
// ============================================

/**
 * @tokens Colors
 * @primary ${Array.from(colors.primary).join(' | ')}
 * @secondary ${Array.from(colors.secondary).join(' | ')}
 * @background ${Array.from(colors.background).join(' | ')}
 * @text ${Array.from(colors.text).join(' | ')}
 */
const colors = {
  primary: [${Array.from(colors.primary).map(c => `'${c}'`).join(', ')}],
  secondary: [${Array.from(colors.secondary).map(c => `'${c}'`).join(', ')}],
  background: [${Array.from(colors.background).map(c => `'${c}'`).join(', ')}],
  text: [${Array.from(colors.text).map(c => `'${c}'`).join(', ')}],
} as const;

/**
 * @tokens Typography
 * @fontFamily ${Array.from(typography.fontFamilies).join(' | ')}
 * @fontSize ${Array.from(typography.fontSizes).join(' | ')}
 * @fontWeight ${Array.from(typography.fontWeights).join(' | ')}
 */
const typography = {
  fontFamily: [${Array.from(typography.fontFamilies).map(f => `'${f}'`).join(', ')}],
  fontSize: [${Array.from(typography.fontSizes).map(s => `'${s}'`).join(', ')}],
  fontWeight: [${Array.from(typography.fontWeights).map(w => `'${w}'`).join(', ')}],
} as const;

/**
 * @tokens Spacing
 * @padding ${Array.from(spacing.padding).join(' | ')}
 * @borderRadius ${Array.from(spacing.borderRadius).join(' | ')}
 */
const spacing = {
  padding: [${Array.from(spacing.padding).map(p => `'${p}'`).join(', ')}],
  borderRadius: [${Array.from(spacing.borderRadius).map(r => `'${r}'`).join(', ')}],
} as const;`;
}
