import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection, SavedComponent } from '@/types/collection';
import { frameworks, stylingOptions } from '@/config/presets.config';

export function generateClaudePrompt(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  const features = [];
  if (customization.responsive) features.push('✅ Fully responsive (mobile-first)');
  if (customization.darkMode) features.push('✅ Dark mode support');
  if (customization.accessibility) features.push('✅ WCAG AA accessibility');
  if (customization.animations) features.push('✅ Smooth animations on interaction');

  const prompt = `Create a ${component.name} component with the following specifications:

## Component Type
${component.category}: ${component.name}
${component.description}

## Framework & Setup
- Framework: ${frameworkName}
- TypeScript: ${customization.typescript ? 'Yes' : 'No'}
- Styling: ${stylingName}

## Design Specifications

### Colors
- Primary: ${customization.primaryColor}
- Secondary: ${customization.secondaryColor}
- Background: ${customization.backgroundColor}
- Text: ${customization.textColor}

### Typography
- Font Family: ${customization.fontFamily}
- Base Font Size: ${customization.fontSize}px
- Font Weight: ${customization.fontWeight}

### Spacing & Layout
- Padding: ${customization.padding}px
- Margin: ${customization.margin}px
- Border Radius: ${customization.borderRadius}px

### Effects & Animations
- Animation Type: ${customization.animation}
- Duration: ${customization.duration}ms
- Shadow Intensity: ${customization.shadowIntensity}%
- Blur Amount: ${customization.blurAmount}px

## Features Required
${features.join('\n')}

## Component-Specific Requirements
${getComponentSpecificRequirements(component, customization)}

## Additional Requirements
- Component should be reusable and accept props
- Include proper TypeScript types/interfaces
- Add helpful comments explaining complex logic
- Follow best practices for the chosen framework
- Include usage example

Please create this component with attention to detail and modern best practices.`;

  return prompt;
}

function getComponentSpecificRequirements(
  component: ComponentDefinition,
  customization: Customization
): string {
  switch (component.id) {
    case 'glass-card':
      return `- Glass opacity: ${customization.glassOpacity}%
- Border opacity: ${customization.glassBorderOpacity}%
- Backdrop blur effect with customizable intensity
- Frosted glass aesthetic`;

    case 'floating-card':
      return `- Float height on hover: ${customization.floatHeight}px
- 3D rotation X: ${customization.rotationX}°
- 3D rotation Y: ${customization.rotationY}°
- Smooth perspective transforms on hover`;

    case 'neon-card':
      return `- Glow intensity: ${customization.glowIntensity}%
- Glow spread: ${customization.glowSpread}px
- Pulse animation speed: ${customization.pulseSpeed}s
- Neon border with box-shadow glow effects`;

    case 'gradient-btn':
      return `- Gradient angle: ${customization.gradientAngle}°
- Hover scale: ${customization.hoverScale}x
- Gradient from primary to secondary color
- Smooth hover transition with scale effect`;

    case 'neo-btn':
      return `- Neomorphic depth: ${customization.neoDepth}px
- Soft shadow intensity: ${customization.softShadowIntensity}%
- Pressed state with inset shadows
- Soft, raised appearance`;

    case 'particle-btn':
      return `- Particle count: ${customization.particleCount}
- Explosion radius: ${customization.explosionRadius}px
- Particle animation on click
- Gradient background with particle overlay`;

    case 'animated-form':
      return `- Field stagger delay: ${customization.fieldStagger}s
- Animation style: ${customization.animation}
- Staggered entrance animations for form fields
- Focus states with visual feedback`;

    case 'step-form':
      return `- Step count: ${customization.stepCount}
- Progress style: ${customization.progressStyle}
- Multi-step wizard with progress indicator
- Smooth transitions between steps`;

    default:
      return `Tags: ${component.tags.join(', ')}`;
  }
}

// Collection export functions

export type DesignTokens = {
  colors: {
    primary: string[];
    secondary: string[];
    background: string[];
    text: string[];
  };
  typography: {
    fontFamilies: string[];
    fontSizes: string[];
    fontWeights: string[];
  };
  spacing: {
    padding: string[];
    margin: string[];
    borderRadius: string[];
  };
  effects: {
    animations: string[];
    durations: string[];
    shadows: string[];
  };
};

export function generateCollectionPrompt(collection: Collection): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const componentPrompts = components
    .map((saved, index) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return null;
      return `### ${index + 1}. ${componentDef.name}

${generateComponentSection(componentDef, saved.customization)}
${saved.notes ? `\n**Notes:** ${saved.notes}` : ''}`;
    })
    .filter(Boolean)
    .join('\n\n---\n\n');

  const tokens = exportDesignTokens(collection);

  return `# Design System: ${collection.name}

${collection.description || 'A curated collection of UI components.'}

**Components:** ${collection.components.length}
${collection.tags.length > 0 ? `**Tags:** ${collection.tags.join(', ')}` : ''}

---

## Components

${componentPrompts}

---

## Design Tokens

### Colors
- **Primary colors:** ${tokens.colors.primary.join(', ') || 'N/A'}
- **Secondary colors:** ${tokens.colors.secondary.join(', ') || 'N/A'}
- **Background colors:** ${tokens.colors.background.join(', ') || 'N/A'}
- **Text colors:** ${tokens.colors.text.join(', ') || 'N/A'}

### Typography
- **Font families:** ${tokens.typography.fontFamilies.join(', ') || 'N/A'}
- **Font sizes:** ${tokens.typography.fontSizes.join(', ') || 'N/A'}
- **Font weights:** ${tokens.typography.fontWeights.join(', ') || 'N/A'}

### Spacing
- **Padding values:** ${tokens.spacing.padding.join(', ') || 'N/A'}
- **Margin values:** ${tokens.spacing.margin.join(', ') || 'N/A'}
- **Border radius:** ${tokens.spacing.borderRadius.join(', ') || 'N/A'}

### Effects
- **Animation types:** ${tokens.effects.animations.join(', ') || 'N/A'}
- **Durations:** ${tokens.effects.durations.join(', ') || 'N/A'}

---

## Implementation Notes

- All components should follow consistent styling patterns
- Use the design tokens above for consistency across the system
- Components should be reusable and accept customization via props
- Include TypeScript types for all component interfaces
- Follow accessibility best practices (WCAG AA)

---

Generated with design2prompt`;
}

function generateComponentSection(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName =
    frameworks[customization.framework as keyof typeof frameworks] ||
    customization.framework;
  const stylingName =
    stylingOptions[customization.styling as keyof typeof stylingOptions] ||
    customization.styling;

  return `**Type:** ${component.category} / ${component.name}
**Description:** ${component.description}

**Framework:** ${frameworkName} ${customization.typescript ? '(TypeScript)' : ''}
**Styling:** ${stylingName}

**Colors:**
- Primary: \`${customization.primaryColor}\`
- Secondary: \`${customization.secondaryColor}\`
- Background: \`${customization.backgroundColor}\`
- Text: \`${customization.textColor}\`

**Typography:**
- Font: ${customization.fontFamily}, ${customization.fontSize}px, weight ${customization.fontWeight}

**Spacing:**
- Padding: ${customization.padding}px
- Margin: ${customization.margin}px
- Border Radius: ${customization.borderRadius}px

**Effects:**
- Animation: ${customization.animation} (${customization.duration}ms)
- Shadow: ${customization.shadowIntensity}%
- Blur: ${customization.blurAmount}px

**Component-Specific:**
${getComponentSpecificRequirements(component, customization)}`;
}

export function generateIndividualPrompts(collection: Collection): string[] {
  return collection.components
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return '';
      return generateClaudePrompt(componentDef, saved.customization);
    })
    .filter(Boolean);
}

export function exportDesignTokens(collection: Collection): DesignTokens {
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
    margin: new Set<string>(),
    borderRadius: new Set<string>(),
  };
  const effects = {
    animations: new Set<string>(),
    durations: new Set<string>(),
    shadows: new Set<string>(),
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
    spacing.margin.add(`${c.margin}px`);
    spacing.borderRadius.add(`${c.borderRadius}px`);

    effects.animations.add(c.animation);
    effects.durations.add(`${c.duration}ms`);
    effects.shadows.add(`${c.shadowIntensity}%`);
  });

  return {
    colors: {
      primary: Array.from(colors.primary),
      secondary: Array.from(colors.secondary),
      background: Array.from(colors.background),
      text: Array.from(colors.text),
    },
    typography: {
      fontFamilies: Array.from(typography.fontFamilies),
      fontSizes: Array.from(typography.fontSizes),
      fontWeights: Array.from(typography.fontWeights),
    },
    spacing: {
      padding: Array.from(spacing.padding),
      margin: Array.from(spacing.margin),
      borderRadius: Array.from(spacing.borderRadius),
    },
    effects: {
      animations: Array.from(effects.animations),
      durations: Array.from(effects.durations),
      shadows: Array.from(effects.shadows),
    },
  };
}
