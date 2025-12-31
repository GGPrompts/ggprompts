import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection } from '@/types/collection';
import { frameworks, stylingOptions } from '@/config/presets.config';

/**
 * Universal AI Export Format
 *
 * Characteristics:
 * - Works with any AI assistant
 * - Balanced detail level
 * - Clear sections without AI-specific formatting
 * - Plain, readable structure
 */

export function generateUniversalPrompt(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  const sections: string[] = [];

  // Header section
  sections.push(`COMPONENT REQUEST: ${component.name}

Category: ${component.category}
Description: ${component.description}`);

  // Technical setup
  sections.push(`TECHNICAL SETUP

Framework: ${frameworkName}
Language: ${customization.typescript ? 'TypeScript' : 'JavaScript'}
Styling: ${stylingName}`);

  // Visual design
  sections.push(`VISUAL DESIGN

Colors:
- Primary: ${customization.primaryColor}
- Secondary: ${customization.secondaryColor}
- Background: ${customization.backgroundColor}
- Text: ${customization.textColor}

Typography:
- Font: ${customization.fontFamily}
- Size: ${customization.fontSize}px
- Weight: ${customization.fontWeight}

Spacing:
- Padding: ${customization.padding}px
- Margin: ${customization.margin}px
- Border Radius: ${customization.borderRadius}px`);

  // Effects
  if (customization.animations || customization.animation !== 'none') {
    sections.push(`EFFECTS AND ANIMATIONS

Animation Style: ${customization.animation}
Duration: ${customization.duration}ms
Shadow Intensity: ${customization.shadowIntensity}%
Blur Amount: ${customization.blurAmount}px`);
  }

  // Component-specific requirements
  sections.push(`COMPONENT-SPECIFIC REQUIREMENTS

${getUniversalComponentRequirements(component, customization)}`);

  // Features
  const features: string[] = [];
  if (customization.responsive) features.push('Responsive design (mobile-first)');
  if (customization.darkMode) features.push('Dark mode support');
  if (customization.accessibility) features.push('Accessibility (WCAG AA)');
  if (customization.animations) features.push('Smooth animations');

  if (features.length > 0) {
    sections.push(`REQUIRED FEATURES

${features.map(f => `- ${f}`).join('\n')}`);
  }

  // Output expectations
  sections.push(`EXPECTED OUTPUT

1. Complete, working component code
2. ${customization.typescript ? 'TypeScript interfaces for props' : 'PropTypes or JSDoc comments'}
3. Styling using ${stylingName}
4. Usage example showing how to import and use the component`);

  return sections.join('\n\n---\n\n');
}

function getUniversalComponentRequirements(
  component: ComponentDefinition,
  customization: Customization
): string {
  switch (component.id) {
    case 'glass-card':
      return `Glass Card Requirements:
- Frosted glass effect using backdrop-filter blur
- Glass opacity: ${customization.glassOpacity || '15'}%
- Border opacity: ${customization.glassBorderOpacity || '40'}%
- Semi-transparent background
- Proper layering for glass effect`;

    case 'floating-card':
      return `Floating Card Requirements:
- 3D hover effect with transforms
- Float height: ${customization.floatHeight || '10'}px
- Rotation X: ${customization.rotationX || '5'} degrees
- Rotation Y: ${customization.rotationY || '5'} degrees
- Smooth transition on hover`;

    case 'neon-card':
      return `Neon Card Requirements:
- Glowing border effect
- Glow intensity: ${customization.glowIntensity || '60'}%
- Glow spread: ${customization.glowSpread || '40'}px
- Pulse animation: ${customization.pulseSpeed || '2'}s
- Use box-shadow for glow effect`;

    case 'gradient-btn':
      return `Gradient Button Requirements:
- Linear gradient background
- Angle: ${customization.gradientAngle || '135'} degrees
- From primary (${customization.primaryColor}) to secondary (${customization.secondaryColor})
- Hover scale: ${customization.hoverScale || '1.05'}x
- Smooth color transition`;

    case 'neo-btn':
      return `Neomorphic Button Requirements:
- Soft, raised appearance
- Shadow depth: ${customization.neoDepth || '8'}px
- Shadow intensity: ${customization.softShadowIntensity || '20'}%
- Pressed state with inset shadows
- Subtle, elegant aesthetic`;

    case 'particle-btn':
      return `Particle Button Requirements:
- Particle system on click
- Particle count: ${customization.particleCount || '20'}
- Explosion radius: ${customization.explosionRadius || '50'}px
- Gradient background
- Animated particle effects`;

    case 'animated-form':
      return `Animated Form Requirements:
- Staggered field entrance animations
- Stagger delay: ${customization.fieldStagger || '0.1'}s per field
- Animation style: ${customization.animation}
- Focus states with visual feedback
- Form validation support`;

    case 'step-form':
      return `Step Form Requirements:
- Multi-step wizard
- Step count: ${customization.stepCount || '3'} steps
- Progress indicator: ${customization.progressStyle || 'bar'}
- Smooth step transitions
- Step validation before proceeding`;

    default:
      return `General Requirements:
- Follow ${component.category} component patterns
- Apply specified colors and typography
- Include interactive states (hover, focus, active)
- Tags: ${component.tags.join(', ')}`;
  }
}

// Collection export functions

export function generateUniversalCollectionPrompt(collection: Collection): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const sections: string[] = [];

  // Header
  sections.push(`DESIGN SYSTEM: ${collection.name}

${collection.description || 'A collection of UI components.'}

Components: ${collection.components.length}
${collection.tags.length > 0 ? `Tags: ${collection.tags.join(', ')}` : ''}`);

  // Design tokens
  const tokens = extractDesignTokens(collection);
  sections.push(`DESIGN TOKENS

Colors:
${tokens.colors.map(c => `- ${c}`).join('\n')}

Typography:
${tokens.fonts.map(f => `- ${f}`).join('\n')}

Spacing:
${tokens.spacing.map(s => `- ${s}`).join('\n')}

Effects:
${tokens.effects.map(e => `- ${e}`).join('\n')}`);

  // Components
  const componentSections = components
    .map((saved, index) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return null;
      return generateComponentSection(componentDef, saved.customization, index + 1, saved.notes);
    })
    .filter(Boolean)
    .join('\n\n');

  sections.push(`COMPONENTS

${componentSections}`);

  // Implementation notes
  sections.push(`IMPLEMENTATION NOTES

1. Use consistent design tokens across all components
2. Components should be reusable and accept props for customization
3. Follow accessibility best practices
4. Include proper TypeScript types where applicable
5. Add comments for complex logic
6. Provide usage examples for each component`);

  return sections.join('\n\n===\n\n');
}

function generateComponentSection(
  component: ComponentDefinition,
  customization: Customization,
  index: number,
  notes?: string
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  return `[${index}] ${component.name}
Type: ${component.category}
Description: ${component.description}
Framework: ${frameworkName} (${customization.typescript ? 'TypeScript' : 'JavaScript'})
Styling: ${stylingName}

Design:
- Colors: ${customization.primaryColor}, ${customization.secondaryColor}
- Background: ${customization.backgroundColor}
- Text: ${customization.textColor}
- Font: ${customization.fontFamily}, ${customization.fontSize}px
- Border Radius: ${customization.borderRadius}px
- Animation: ${customization.animation} (${customization.duration}ms)

${getUniversalComponentRequirements(component, customization)}
${notes ? `\nNotes: ${notes}` : ''}`;
}

function extractDesignTokens(collection: Collection): {
  colors: string[];
  fonts: string[];
  spacing: string[];
  effects: string[];
} {
  const colors = new Set<string>();
  const fonts = new Set<string>();
  const spacing = new Set<string>();
  const effects = new Set<string>();

  collection.components.forEach((saved) => {
    const c = saved.customization;

    colors.add(`Primary: ${c.primaryColor}`);
    colors.add(`Secondary: ${c.secondaryColor}`);
    colors.add(`Background: ${c.backgroundColor}`);
    colors.add(`Text: ${c.textColor}`);

    fonts.add(`Family: ${c.fontFamily}`);
    fonts.add(`Size: ${c.fontSize}px`);
    fonts.add(`Weight: ${c.fontWeight}`);

    spacing.add(`Padding: ${c.padding}px`);
    spacing.add(`Margin: ${c.margin}px`);
    spacing.add(`Border Radius: ${c.borderRadius}px`);

    effects.add(`Animation: ${c.animation}`);
    effects.add(`Duration: ${c.duration}ms`);
    effects.add(`Shadow: ${c.shadowIntensity}%`);
  });

  return {
    colors: Array.from(colors),
    fonts: Array.from(fonts),
    spacing: Array.from(spacing),
    effects: Array.from(effects),
  };
}

export function generateUniversalIndividualPrompts(collection: Collection): string[] {
  return collection.components
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return '';
      return generateUniversalPrompt(componentDef, saved.customization);
    })
    .filter(Boolean);
}
