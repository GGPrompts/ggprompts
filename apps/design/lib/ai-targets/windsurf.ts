import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection } from '@/types/collection';
import { frameworks, stylingOptions } from '@/config/presets.config';

/**
 * Windsurf AI Export Format
 *
 * Characteristics:
 * - Step-by-step numbered instructions
 * - Explicit file creation steps
 * - Clear action items
 * - Beginner-friendly verbosity
 */

export function generateWindsurfPrompt(
  component: ComponentDefinition,
  customization: Customization
): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;
  const componentFileName = getComponentFileName(component.name, customization.typescript);
  const fileExtension = customization.typescript ? 'tsx' : 'jsx';

  const steps: string[] = [];
  let stepNumber = 1;

  // Step 1: Create file
  steps.push(`Step ${stepNumber}: Create file components/${componentFileName}
Create a new file at the path: components/${componentFileName}
This will be your main component file.`);
  stepNumber++;

  // Step 2: Add imports
  steps.push(`Step ${stepNumber}: Add imports at the top of the file
Add the following imports based on your framework (${frameworkName}):
${getImportsForFramework(customization)}`);
  stepNumber++;

  // Step 3: Define props interface (if TypeScript)
  if (customization.typescript) {
    steps.push(`Step ${stepNumber}: Define the props interface
Create a TypeScript interface for your component props:

interface ${component.name.replace(/\s+/g, '')}Props {
${getPropsInterface(component, customization)}}

This ensures type safety and better developer experience.`);
    stepNumber++;
  }

  // Step 4: Define component colors and styling variables
  steps.push(`Step ${stepNumber}: Set up your design tokens
Define the following color and styling variables:

Colors:
  - Primary Color: ${customization.primaryColor}
  - Secondary Color: ${customization.secondaryColor}
  - Background Color: ${customization.backgroundColor}
  - Text Color: ${customization.textColor}

Typography:
  - Font Family: ${customization.fontFamily}
  - Font Size: ${customization.fontSize}px
  - Font Weight: ${customization.fontWeight}

Spacing:
  - Padding: ${customization.padding}px
  - Margin: ${customization.margin}px
  - Border Radius: ${customization.borderRadius}px`);
  stepNumber++;

  // Step 5: Create the component structure
  steps.push(`Step ${stepNumber}: Create the component structure
Build the ${component.name} component with these requirements:

Component Type: ${component.category}
Description: ${component.description}

${getComponentSpecificSteps(component, customization)}`);
  stepNumber++;

  // Step 6: Add effects and animations
  if (customization.animations && customization.animation !== 'none') {
    steps.push(`Step ${stepNumber}: Add animations and effects
Configure the following animation settings:

Animation Type: ${customization.animation}
Duration: ${customization.duration}ms
Shadow Intensity: ${customization.shadowIntensity}%
Blur Amount: ${customization.blurAmount}px

${getAnimationInstructions(customization)}`);
    stepNumber++;
  }

  // Step 7: Add responsive styles
  if (customization.responsive) {
    steps.push(`Step ${stepNumber}: Make the component responsive
Add responsive breakpoints for mobile-first design:

- Mobile (default): Stack elements vertically, full width
- Tablet (768px+): Adjust spacing and layout
- Desktop (1024px+): Full desktop layout

Use ${stylingName} responsive utilities for consistency.`);
    stepNumber++;
  }

  // Step 8: Add dark mode support
  if (customization.darkMode) {
    steps.push(`Step ${stepNumber}: Add dark mode support
Implement dark mode with the following approach:

- Use CSS variables or theme context for color switching
- Primary color in dark mode: ${customization.primaryColor}
- Background in dark mode: ${customization.backgroundColor}
- Ensure sufficient contrast (WCAG AA)`);
    stepNumber++;
  }

  // Step 9: Add accessibility
  if (customization.accessibility) {
    steps.push(`Step ${stepNumber}: Ensure accessibility (WCAG AA)
Add the following accessibility features:

- Proper semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast
- Screen reader friendly content`);
    stepNumber++;
  }

  // Step 10: Export the component
  steps.push(`Step ${stepNumber}: Export the component
Add the export statement at the bottom of your file:

export default ${component.name.replace(/\s+/g, '')};

Or for named exports:
export { ${component.name.replace(/\s+/g, '')} };`);
  stepNumber++;

  // Step 11: Usage example
  steps.push(`Step ${stepNumber}: Usage example
Here's how to use your new component:

import ${component.name.replace(/\s+/g, '')} from './components/${componentFileName.replace(`.${fileExtension}`, '')}';

function App() {
  return (
    <${component.name.replace(/\s+/g, '')}
      ${getExampleProps(component, customization)}
    />
  );
}`);

  const features = getFeaturesList(customization);

  return `# Create ${component.name} Component - Step by Step Guide

## Overview
- **Component:** ${component.name}
- **Category:** ${component.category}
- **Framework:** ${frameworkName}
- **Styling:** ${stylingName}
- **TypeScript:** ${customization.typescript ? 'Yes' : 'No'}

## Features to Include
${features}

---

## Instructions

${steps.join('\n\n---\n\n')}

---

## Final Checklist
- [ ] File created at correct path
- [ ] All imports added
${customization.typescript ? '- [ ] Props interface defined\n' : ''}- [ ] Colors and typography applied
- [ ] Component structure complete
${customization.animations ? '- [ ] Animations working\n' : ''}- [ ] ${customization.responsive ? 'Responsive design implemented\n' : ''}${customization.darkMode ? '- [ ] Dark mode supported\n' : ''}${customization.accessibility ? '- [ ] Accessibility tested\n' : ''}- [ ] Component exported
- [ ] Usage example tested

Generated with design2prompt`;
}

function getComponentFileName(name: string, typescript: boolean): string {
  const pascalCase = name.replace(/\s+/g, '');
  return `${pascalCase}.${typescript ? 'tsx' : 'jsx'}`;
}

function getImportsForFramework(customization: Customization): string {
  const imports: string[] = [];

  switch (customization.framework) {
    case 'react':
    case 'nextjs':
      imports.push("import React from 'react';");
      if (customization.animations) {
        imports.push("import { motion } from 'framer-motion';");
      }
      break;
    case 'vue':
      imports.push("import { defineComponent, ref } from 'vue';");
      break;
    case 'svelte':
      imports.push("// Svelte - no explicit import needed");
      if (customization.animations) {
        imports.push("import { fade, fly, scale } from 'svelte/transition';");
      }
      break;
    case 'astro':
      imports.push("---");
      imports.push("// Astro frontmatter");
      imports.push("---");
      break;
    default:
      imports.push("// Vanilla JS - no framework imports needed");
  }

  if (customization.styling === 'styled-components') {
    imports.push("import styled from 'styled-components';");
  }

  return imports.join('\n');
}

function getPropsInterface(component: ComponentDefinition, customization: Customization): string {
  const baseProps = [
    '  children?: React.ReactNode;',
    '  className?: string;',
  ];

  // Add component-specific props based on the component type
  switch (component.id) {
    case 'glass-card':
    case 'floating-card':
    case 'neon-card':
      baseProps.push('  title?: string;');
      baseProps.push('  description?: string;');
      break;
    case 'gradient-btn':
    case 'neo-btn':
    case 'particle-btn':
      baseProps.push('  onClick?: () => void;');
      baseProps.push('  disabled?: boolean;');
      baseProps.push('  variant?: "primary" | "secondary";');
      break;
    case 'animated-form':
    case 'step-form':
      baseProps.push('  onSubmit?: (data: Record<string, unknown>) => void;');
      baseProps.push('  initialValues?: Record<string, unknown>;');
      break;
    default:
      baseProps.push('  // Add your custom props here');
  }

  return baseProps.join('\n');
}

function getComponentSpecificSteps(component: ComponentDefinition, customization: Customization): string {
  switch (component.id) {
    case 'glass-card':
      return `Glass Card Specific Steps:
1. Create a container div with backdrop-filter: blur(${customization.blurAmount}px)
2. Set background opacity to ${customization.glassOpacity || '15'}%
3. Add a semi-transparent border with ${customization.glassBorderOpacity || '40'}% opacity
4. Apply the frosted glass aesthetic with proper layering`;

    case 'floating-card':
      return `Floating Card Specific Steps:
1. Create a card with 3D transform capabilities
2. On hover, apply translateY(-${customization.floatHeight || '10'}px)
3. Add perspective transforms: rotateX(${customization.rotationX || '5'}deg), rotateY(${customization.rotationY || '5'}deg)
4. Use smooth transitions for the hover effect`;

    case 'neon-card':
      return `Neon Card Specific Steps:
1. Create a card with a glowing border effect
2. Use box-shadow for the neon glow with intensity ${customization.glowIntensity || '60'}%
3. Set glow spread to ${customization.glowSpread || '40'}px
4. Add pulse animation with speed ${customization.pulseSpeed || '2'}s`;

    case 'gradient-btn':
      return `Gradient Button Specific Steps:
1. Create a button with linear-gradient at ${customization.gradientAngle || '135'}deg
2. Gradient goes from primary (${customization.primaryColor}) to secondary (${customization.secondaryColor})
3. On hover, scale to ${customization.hoverScale || '1.05'}x
4. Add smooth color transition`;

    case 'neo-btn':
      return `Neomorphic Button Specific Steps:
1. Create soft, raised button appearance
2. Apply depth shadows of ${customization.neoDepth || '8'}px
3. Use soft shadow intensity of ${customization.softShadowIntensity || '20'}%
4. On press, switch to inset shadows for pressed state`;

    case 'particle-btn':
      return `Particle Button Specific Steps:
1. Create button with gradient background
2. Add particle system overlay with ${customization.particleCount || '20'} particles
3. On click, trigger explosion effect with radius ${customization.explosionRadius || '50'}px
4. Particles should animate outward and fade`;

    case 'animated-form':
      return `Animated Form Specific Steps:
1. Create form container with staggered child animations
2. Each field appears with ${customization.fieldStagger || '0.1'}s delay
3. Use ${customization.animation} animation style
4. Add focus states with visual feedback`;

    case 'step-form':
      return `Step Form Specific Steps:
1. Create multi-step wizard with ${customization.stepCount || '3'} steps
2. Add progress indicator style: ${customization.progressStyle || 'bar'}
3. Implement smooth transitions between steps
4. Track current step and validate before proceeding`;

    default:
      return `General Component Steps:
1. Create the base structure for ${component.name}
2. Apply the specified colors and typography
3. Add any interactive states (hover, focus, active)
4. Implement component-specific functionality

Tags: ${component.tags.join(', ')}`;
  }
}

function getAnimationInstructions(customization: Customization): string {
  switch (customization.animation) {
    case 'smooth':
      return `Use ease-in-out timing with ${customization.duration}ms duration.
Example: transition: all ${customization.duration}ms ease-in-out;`;
    case 'bounce':
      return `Use cubic-bezier for bounce effect: cubic-bezier(0.68, -0.55, 0.265, 1.55)
Duration: ${customization.duration}ms`;
    case 'spring':
      return `For Framer Motion:
{ type: "spring", stiffness: 300, damping: 20 }

For CSS:
cubic-bezier(0.175, 0.885, 0.32, 1.275) with ${customization.duration}ms`;
    default:
      return 'No animation - use static styles only.';
  }
}

function getFeaturesList(customization: Customization): string {
  const features: string[] = [];

  if (customization.responsive) features.push('- [x] Fully responsive (mobile-first)');
  else features.push('- [ ] Responsive design (not required)');

  if (customization.darkMode) features.push('- [x] Dark mode support');
  else features.push('- [ ] Dark mode (not required)');

  if (customization.accessibility) features.push('- [x] WCAG AA accessibility');
  else features.push('- [ ] Accessibility (not required)');

  if (customization.animations) features.push('- [x] Smooth animations');
  else features.push('- [ ] Animations (not required)');

  return features.join('\n');
}

function getExampleProps(component: ComponentDefinition, customization: Customization): string {
  switch (component.id) {
    case 'glass-card':
    case 'floating-card':
    case 'neon-card':
      return `title="Card Title"
      description="Card description goes here"`;
    case 'gradient-btn':
    case 'neo-btn':
    case 'particle-btn':
      return `onClick={() => console.log('clicked')}`;
    case 'animated-form':
    case 'step-form':
      return `onSubmit={(data) => console.log(data)}`;
    default:
      return '';
  }
}

// Collection export functions

export function generateWindsurfCollectionPrompt(collection: Collection): string {
  const components = collection.components
    .slice()
    .sort((a, b) => a.order - b.order);

  const totalSteps = components.length + 3; // +3 for setup, tokens, and final steps
  let currentStep = 1;

  const sections: string[] = [];

  // Setup step
  sections.push(`## Step ${currentStep}: Project Setup

Before creating components, ensure your project is properly configured:

1. Create components directory: \`mkdir -p components\`
2. Install required dependencies based on your framework
3. Set up your styling solution (Tailwind, CSS Modules, etc.)`);
  currentStep++;

  // Design tokens step
  sections.push(`## Step ${currentStep}: Define Design Tokens

Create a shared design tokens file for consistency across all components.
File: \`lib/design-tokens.ts\` or \`styles/tokens.css\`

${getDesignTokensSection(collection)}`);
  currentStep++;

  // Component steps
  components.forEach((saved, index) => {
    const componentDef = getComponentById(saved.componentId);
    if (!componentDef) return;

    sections.push(`## Step ${currentStep}: Create ${componentDef.name}

**File:** components/${getComponentFileName(componentDef.name, saved.customization.typescript)}
**Category:** ${componentDef.category}
**Order in collection:** ${index + 1}

${saved.notes ? `**Notes:** ${saved.notes}\n` : ''}
### Sub-steps:

${generateComponentSubSteps(componentDef, saved.customization)}`);
    currentStep++;
  });

  // Final step
  sections.push(`## Step ${currentStep}: Verify and Test

Final checklist for your component collection:

- [ ] All ${components.length} components created
- [ ] Design tokens applied consistently
- [ ] Components properly exported
- [ ] No TypeScript errors (if applicable)
- [ ] Components render correctly
- [ ] Animations working as expected
- [ ] Responsive design verified
- [ ] Dark mode tested (if applicable)`);

  return `# Design System Implementation Guide: ${collection.name}

${collection.description || 'A curated collection of UI components.'}

## Overview
- **Total Components:** ${collection.components.length}
- **Total Steps:** ${totalSteps}
${collection.tags.length > 0 ? `- **Tags:** ${collection.tags.join(', ')}` : ''}

---

${sections.join('\n\n---\n\n')}

---

Generated with design2prompt`;
}

function generateComponentSubSteps(component: ComponentDefinition, customization: Customization): string {
  const frameworkName = frameworks[customization.framework as keyof typeof frameworks] || customization.framework;
  const stylingName = stylingOptions[customization.styling as keyof typeof stylingOptions] || customization.styling;

  return `a. Create the file with ${frameworkName} structure
b. Add imports (React, animations library if needed)
${customization.typescript ? 'c. Define TypeScript interface for props\n' : ''}c. Apply these styles:
   - Primary: ${customization.primaryColor}
   - Secondary: ${customization.secondaryColor}
   - Border Radius: ${customization.borderRadius}px
   - Animation: ${customization.animation} (${customization.duration}ms)

d. ${getComponentSpecificSteps(component, customization).split('\n')[0]}
e. Export the component`;
}

function getDesignTokensSection(collection: Collection): string {
  const colors = new Set<string>();
  const fonts = new Set<string>();
  const spacings = new Set<string>();
  const animations = new Set<string>();

  collection.components.forEach((saved) => {
    const c = saved.customization;
    colors.add(c.primaryColor);
    colors.add(c.secondaryColor);
    colors.add(c.backgroundColor);
    colors.add(c.textColor);
    fonts.add(c.fontFamily);
    spacings.add(`${c.padding}px`);
    spacings.add(`${c.borderRadius}px`);
    animations.add(c.animation);
  });

  return `### Colors
${Array.from(colors).map(c => `- ${c}`).join('\n')}

### Typography
${Array.from(fonts).map(f => `- ${f}`).join('\n')}

### Spacing
${Array.from(spacings).map(s => `- ${s}`).join('\n')}

### Animations
${Array.from(animations).map(a => `- ${a}`).join('\n')}`;
}

export function generateWindsurfIndividualPrompts(collection: Collection): string[] {
  return collection.components
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((saved) => {
      const componentDef = getComponentById(saved.componentId);
      if (!componentDef) return '';
      return generateWindsurfPrompt(componentDef, saved.customization);
    })
    .filter(Boolean);
}
