import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection } from '@/types/collection';
import { frameworks, stylingOptions } from '@/config/presets.config';
import { DesignTokens, exportDesignTokens } from './claude';

/**
 * GPT-4 Export Format
 *
 * Characteristics:
 * - Structured markdown format with clear sections
 * - Tables for specifications
 * - Code blocks for technical details
 * - Step-by-step implementation notes
 * - Technical and precise language
 */

export function generateGPT4Prompt(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  const features = [];
  if (customization.responsive) features.push('Responsive Design (Mobile-First)');
  if (customization.darkMode) features.push('Dark Mode Support');
  if (customization.accessibility) features.push('WCAG AA Accessibility');
  if (customization.animations) features.push('Smooth Animations');

  const prompt = `## Component: ${component.name}

**Category:** ${component.category}
**Framework:** ${frameworkName}
**Description:** ${component.description}

---

### Design Specifications

| Property | Value |
|----------|-------|
| Primary Color | \`${customization.primaryColor}\` |
| Secondary Color | \`${customization.secondaryColor}\` |
| Background Color | \`${customization.backgroundColor}\` |
| Text Color | \`${customization.textColor}\` |
| Font Family | ${customization.fontFamily} |
| Font Size | ${customization.fontSize}px |
| Font Weight | ${customization.fontWeight} |
| Padding | ${customization.padding}px |
| Margin | ${customization.margin}px |
| Border Radius | ${customization.borderRadius}px |
| Animation Type | ${customization.animation} |
| Animation Duration | ${customization.duration}ms |
| Shadow Intensity | ${customization.shadowIntensity}% |
| Blur Amount | ${customization.blurAmount}px |

---

### Technical Requirements

| Requirement | Value |
|-------------|-------|
| Framework | ${frameworkName} |
| TypeScript | ${customization.typescript ? 'Required' : 'Optional'} |
| Styling Solution | ${stylingName} |

---

### Features Checklist

${features.map(f => `- [x] ${f}`).join('\n') || '- [ ] No additional features specified'}

---

### Component-Specific Parameters

${getGPT4ComponentSpecifics(component, customization)}

---

### Implementation Requirements

1. **Create Component File**
   - File: \`${component.id}.${customization.typescript ? 'tsx' : 'jsx'}\`
   - Export as default or named export

2. **Apply Design System**
   - Use the color values from the specifications table
   - Apply typography settings consistently
   - Implement spacing according to padding/margin values

3. **Add Interactivity**
   - Animation: \`${customization.animation}\` with \`${customization.duration}ms\` duration
   - Implement hover states and focus indicators
   - Ensure keyboard navigation support

4. **Ensure Quality**
   ${customization.responsive ? '- Test across breakpoints (mobile, tablet, desktop)' : ''}
   ${customization.darkMode ? '- Verify dark mode color contrast' : ''}
   ${customization.accessibility ? '- Add ARIA labels and roles' : ''}
   - Validate props with TypeScript types

---

### Code Structure

\`\`\`${customization.typescript ? 'tsx' : 'jsx'}
// ${component.name} Component
// Category: ${component.category}
// Tags: ${component.tags.join(', ')}

${customization.typescript ? `interface ${toPascalCase(component.id)}Props {
  // Define component props here
  className?: string;
  children?: React.ReactNode;
}

export function ${toPascalCase(component.id)}({ className, children }: ${toPascalCase(component.id)}Props) {
  return (
    // Component implementation
  );
}` : `export function ${toPascalCase(component.id)}({ className, children }) {
  return (
    // Component implementation
  );
}`}
\`\`\`

---

**Tags:** ${component.tags.join(', ')}`;

  return prompt;
}

function getGPT4ComponentSpecifics(
  component: ComponentDefinition,
  customization: Customization
): string {
  const specificParams: Record<string, string> = {};

  switch (component.id) {
    case 'glass-card':
      specificParams['Glass Opacity'] = `${customization.glassOpacity}%`;
      specificParams['Border Opacity'] = `${customization.glassBorderOpacity}%`;
      specificParams['Backdrop Blur'] = `${customization.blurAmount}px`;
      break;

    case 'floating-card':
      specificParams['Float Height'] = `${customization.floatHeight}px`;
      specificParams['Rotation X'] = `${customization.rotationX}deg`;
      specificParams['Rotation Y'] = `${customization.rotationY}deg`;
      break;

    case 'neon-card':
      specificParams['Glow Intensity'] = `${customization.glowIntensity}%`;
      specificParams['Glow Spread'] = `${customization.glowSpread}px`;
      specificParams['Pulse Speed'] = `${customization.pulseSpeed}s`;
      break;

    case 'gradient-btn':
      specificParams['Gradient Angle'] = `${customization.gradientAngle}deg`;
      specificParams['Hover Scale'] = `${customization.hoverScale}x`;
      break;

    case 'neo-btn':
      specificParams['Neomorphic Depth'] = `${customization.neoDepth}px`;
      specificParams['Soft Shadow'] = `${customization.softShadowIntensity}%`;
      break;

    case 'particle-btn':
      specificParams['Particle Count'] = `${customization.particleCount}`;
      specificParams['Explosion Radius'] = `${customization.explosionRadius}px`;
      break;

    case 'animated-form':
    case 'animated-input':
      specificParams['Field Stagger'] = `${customization.fieldStagger}s`;
      specificParams['Animation Style'] = customization.animation;
      break;

    case 'step-form':
      specificParams['Step Count'] = `${customization.stepCount}`;
      specificParams['Progress Style'] = `${customization.progressStyle}`;
      break;

    case 'cursor-follow':
      specificParams['Trail Length'] = `${customization.trailLength}`;
      specificParams['Blend Mode'] = customization.cursorBlendMode;
      specificParams['Cursor Size'] = `${customization.cursorSize}px`;
      break;

    case 'parallax-scroll':
      specificParams['Parallax Speed'] = `${customization.parallaxSpeed}`;
      specificParams['Layer Count'] = `${customization.layerCount}`;
      specificParams['Direction'] = `${customization.parallaxDirection}`;
      break;

    case 'sidebar-nav':
      specificParams['Sidebar Width'] = `${customization.sidebarWidth}px`;
      specificParams['Collapsed Width'] = `${customization.collapseWidth}px`;
      break;

    default:
      // Return generic info for components without specific parameters
      break;
  }

  if (Object.keys(specificParams).length === 0) {
    return `| Parameter | Value |\n|-----------|-------|\n| Tags | ${component.tags.join(', ')} |`;
  }

  const tableRows = Object.entries(specificParams)
    .map(([key, value]) => `| ${key} | \`${value}\` |`)
    .join('\n');

  return `| Parameter | Value |\n|-----------|-------|\n${tableRows}`;
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Generate a comprehensive GPT-4 prompt for an entire collection
 * Formatted as a structured design system document
 */
export function generateGPT4CollectionPrompt(collection: Collection): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const tokens = exportDesignTokens(collection);

  const componentSections = components
    .map((saved, index) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return null;
      return generateGPT4ComponentSection(componentDef, saved.customization, index + 1, saved.notes);
    })
    .filter(Boolean)
    .join('\n\n');

  return `# Design System: ${collection.name}

${collection.description || 'A curated collection of UI components for implementation.'}

---

## Overview

| Metric | Value |
|--------|-------|
| Total Components | ${collection.components.length} |
| Categories | ${getUniqueCategories(collection).join(', ')} |
${collection.tags.length > 0 ? `| Tags | ${collection.tags.join(', ')} |` : ''}

---

## Design Tokens

### Color Palette

| Token | Values |
|-------|--------|
| Primary | ${tokens.colors.primary.map(c => `\`${c}\``).join(', ') || 'N/A'} |
| Secondary | ${tokens.colors.secondary.map(c => `\`${c}\``).join(', ') || 'N/A'} |
| Background | ${tokens.colors.background.map(c => `\`${c}\``).join(', ') || 'N/A'} |
| Text | ${tokens.colors.text.map(c => `\`${c}\``).join(', ') || 'N/A'} |

### Typography

| Token | Values |
|-------|--------|
| Font Families | ${tokens.typography.fontFamilies.join(', ') || 'N/A'} |
| Font Sizes | ${tokens.typography.fontSizes.join(', ') || 'N/A'} |
| Font Weights | ${tokens.typography.fontWeights.join(', ') || 'N/A'} |

### Spacing

| Token | Values |
|-------|--------|
| Padding | ${tokens.spacing.padding.join(', ') || 'N/A'} |
| Margin | ${tokens.spacing.margin.join(', ') || 'N/A'} |
| Border Radius | ${tokens.spacing.borderRadius.join(', ') || 'N/A'} |

### Effects

| Token | Values |
|-------|--------|
| Animations | ${tokens.effects.animations.join(', ') || 'N/A'} |
| Durations | ${tokens.effects.durations.join(', ') || 'N/A'} |
| Shadow Intensities | ${tokens.effects.shadows.join(', ') || 'N/A'} |

---

## Components

${componentSections}

---

## Implementation Checklist

- [ ] Set up project with required framework and styling solution
- [ ] Configure design tokens as CSS variables or theme constants
- [ ] Implement components in order of dependency
- [ ] Add TypeScript interfaces for all component props
- [ ] Test responsive behavior across breakpoints
- [ ] Verify accessibility compliance (WCAG AA)
- [ ] Add unit tests for component functionality
- [ ] Document usage examples for each component

---

## Code Organization

\`\`\`
components/
├── ui/
${components.map(c => {
  const comp = getComponentById(c.componentId);
  return comp ? `│   ├── ${comp.id}.tsx` : '';
}).filter(Boolean).join('\n')}
├── lib/
│   ├── utils.ts
│   └── design-tokens.ts
└── styles/
    └── globals.css
\`\`\`

---

*Generated with design2prompt*`;
}

function generateGPT4ComponentSection(
  component: ComponentDefinition,
  customization: Customization,
  index: number,
  notes?: string
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  return `### ${index}. ${component.name}

**Category:** ${component.category} | **Framework:** ${frameworkName} | **Styling:** ${stylingName}

${component.description}

#### Specifications

| Property | Value | Property | Value |
|----------|-------|----------|-------|
| Primary | \`${customization.primaryColor}\` | Font | ${customization.fontFamily} |
| Secondary | \`${customization.secondaryColor}\` | Size | ${customization.fontSize}px |
| Background | \`${customization.backgroundColor}\` | Weight | ${customization.fontWeight} |
| Text | \`${customization.textColor}\` | Radius | ${customization.borderRadius}px |

#### Features

| Feature | Enabled |
|---------|---------|
| Responsive | ${customization.responsive ? 'Yes' : 'No'} |
| Dark Mode | ${customization.darkMode ? 'Yes' : 'No'} |
| Accessibility | ${customization.accessibility ? 'Yes' : 'No'} |
| Animations | ${customization.animations ? 'Yes' : 'No'} |

${getGPT4ComponentSpecifics(component, customization)}

${notes ? `> **Notes:** ${notes}` : ''}

---`;
}

function getUniqueCategories(collection: Collection): string[] {
  const categories = new Set<string>();
  collection.components.forEach(saved => {
    const comp = getComponentById(saved.componentId);
    if (comp) categories.add(comp.category);
  });
  return Array.from(categories);
}

/**
 * Generate individual GPT-4 prompts for each component in a collection
 * Returns an array of prompts that can be used separately
 */
export function generateGPT4IndividualPrompts(collection: Collection): string[] {
  return collection.components
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return '';

      let prompt = generateGPT4Prompt(componentDef, saved.customization);

      // Append notes if present
      if (saved.notes) {
        prompt += `\n\n---\n\n> **Additional Notes:** ${saved.notes}`;
      }

      return prompt;
    })
    .filter(Boolean);
}

/**
 * Generate a GPT-4 formatted layout prompt for canvas arrangements
 */
export function generateGPT4LayoutPrompt(
  collection: Collection,
  layoutDescription?: string
): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const componentList = components
    .map((saved, index) => {
      const comp = getComponentById(saved.componentId);
      if (!comp) return null;

      const position = saved.canvasPosition
        ? `Position: (${saved.canvasPosition.x}, ${saved.canvasPosition.y})`
        : 'Position: Not specified';

      return `${index + 1}. **${comp.name}** (${comp.category}) - ${position}`;
    })
    .filter(Boolean)
    .join('\n');

  return `## Page Layout: ${collection.name}

${collection.description || 'A page layout composed of multiple UI components.'}

---

### Layout Overview

${layoutDescription || 'Arrange components according to the positions specified below.'}

---

### Component Arrangement

${componentList}

---

### Layout Requirements

1. **Grid System**
   - Use CSS Grid or Flexbox for layout
   - Implement responsive breakpoints
   - Maintain consistent spacing between components

2. **Component Order**
   - Render components in the order specified
   - Respect z-index for overlapping elements
   - Handle overflow appropriately

3. **Responsive Behavior**
   - Stack components vertically on mobile
   - Adjust spacing for tablet viewports
   - Maintain layout integrity on desktop

---

### Implementation

\`\`\`tsx
// Page Layout Component
export function ${toPascalCase(collection.name.replace(/\s+/g, '-'))}Layout() {
  return (
    <div className="layout-container">
${components.map((saved, index) => {
  const comp = getComponentById(saved.componentId);
  return comp ? `      <${toPascalCase(comp.id)} /> {/* Component ${index + 1} */}` : '';
}).filter(Boolean).join('\n')}
    </div>
  );
}
\`\`\`

---

*Generated with design2prompt*`;
}
