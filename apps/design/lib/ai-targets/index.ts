/**
 * AI Targets - Multi-AI Export System
 *
 * This module provides export functions for generating prompts
 * optimized for different AI assistants.
 *
 * Supported AI Targets:
 * - Claude: Natural language, detailed descriptions
 * - GPT-4: Structured format with code blocks
 * - Cursor: Inline snippets for IDE integration
 * - Copilot: GitHub Copilot optimized format
 * - Windsurf: Step-by-step numbered instructions
 * - Universal: Balanced format for any AI
 */

// Claude AI target exports
export {
  generateClaudePrompt,
  generateCollectionPrompt as generateClaudeCollectionPrompt,
  generateIndividualPrompts as generateClaudeIndividualPrompts,
  exportDesignTokens,
  type DesignTokens,
} from './claude';

// GPT-4 AI target exports
export {
  generateGPT4Prompt,
  generateGPT4CollectionPrompt,
  generateGPT4IndividualPrompts,
  generateGPT4LayoutPrompt,
} from './gpt4';

// Cursor AI target exports
export {
  generateCursorPrompt,
  generateCursorCollectionPrompt,
  generateCursorIndividualPrompts,
} from './cursor';

// GitHub Copilot target exports
export {
  generateCopilotPrompt,
  generateCopilotCollectionPrompt,
  generateCopilotIndividualPrompts,
} from './copilot';

// Windsurf AI target exports
export {
  generateWindsurfPrompt,
  generateWindsurfCollectionPrompt,
  generateWindsurfIndividualPrompts,
} from './windsurf';

// Universal AI target exports
export {
  generateUniversalPrompt,
  generateUniversalCollectionPrompt,
  generateUniversalIndividualPrompts,
} from './universal';

// Types for AI target selection
export type AITarget = 'claude' | 'gpt4' | 'cursor' | 'copilot' | 'windsurf' | 'universal';

export type AITargetConfig = {
  id: AITarget;
  name: string;
  description: string;
  icon?: string;
};

// AI target configurations
export const aiTargets: AITargetConfig[] = [
  {
    id: 'claude',
    name: 'Claude',
    description: 'Natural language with detailed descriptions',
    icon: 'anthropic',
  },
  {
    id: 'gpt4',
    name: 'GPT-4',
    description: 'Structured format with code blocks',
    icon: 'openai',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'Inline snippets for IDE integration',
    icon: 'cursor',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'GitHub Copilot optimized format',
    icon: 'github',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'Step-by-step numbered instructions',
    icon: 'windsurf',
  },
  {
    id: 'universal',
    name: 'Universal',
    description: 'Balanced format for any AI assistant',
    icon: 'universal',
  },
];

// Import types for master export functions
import { ComponentDefinition } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import { Collection } from '@/types/collection';

// Import all generators for master export
import { generateClaudePrompt, generateCollectionPrompt, generateIndividualPrompts } from './claude';
import { generateGPT4Prompt, generateGPT4CollectionPrompt, generateGPT4IndividualPrompts } from './gpt4';
import { generateCursorPrompt, generateCursorCollectionPrompt, generateCursorIndividualPrompts } from './cursor';
import { generateCopilotPrompt, generateCopilotCollectionPrompt, generateCopilotIndividualPrompts } from './copilot';
import { generateWindsurfPrompt, generateWindsurfCollectionPrompt, generateWindsurfIndividualPrompts } from './windsurf';
import { generateUniversalPrompt, generateUniversalCollectionPrompt, generateUniversalIndividualPrompts } from './universal';

/**
 * Master export function - generates prompt for specified AI target
 */
export function generatePromptForTarget(
  target: AITarget,
  component: ComponentDefinition,
  customization: Customization
): string {
  switch (target) {
    case 'claude':
      return generateClaudePrompt(component, customization);
    case 'gpt4':
      return generateGPT4Prompt(component, customization);
    case 'cursor':
      return generateCursorPrompt(component, customization);
    case 'copilot':
      return generateCopilotPrompt(component, customization);
    case 'windsurf':
      return generateWindsurfPrompt(component, customization);
    case 'universal':
    default:
      return generateUniversalPrompt(component, customization);
  }
}

/**
 * Master collection export function - generates collection prompt for specified AI target
 */
export function generateCollectionPromptForTarget(
  target: AITarget,
  collection: Collection
): string {
  switch (target) {
    case 'claude':
      return generateCollectionPrompt(collection);
    case 'gpt4':
      return generateGPT4CollectionPrompt(collection);
    case 'cursor':
      return generateCursorCollectionPrompt(collection);
    case 'copilot':
      return generateCopilotCollectionPrompt(collection);
    case 'windsurf':
      return generateWindsurfCollectionPrompt(collection);
    case 'universal':
    default:
      return generateUniversalCollectionPrompt(collection);
  }
}

/**
 * Master individual prompts export function - generates individual prompts for specified AI target
 */
export function generateIndividualPromptsForTarget(
  target: AITarget,
  collection: Collection
): string[] {
  switch (target) {
    case 'claude':
      return generateIndividualPrompts(collection);
    case 'gpt4':
      return generateGPT4IndividualPrompts(collection);
    case 'cursor':
      return generateCursorIndividualPrompts(collection);
    case 'copilot':
      return generateCopilotIndividualPrompts(collection);
    case 'windsurf':
      return generateWindsurfIndividualPrompts(collection);
    case 'universal':
    default:
      return generateUniversalIndividualPrompts(collection);
  }
}

/**
 * Export all prompts for all AI targets at once
 */
export function generateAllTargetPrompts(
  component: ComponentDefinition,
  customization: Customization
): Record<AITarget, string> {
  return {
    claude: generateClaudePrompt(component, customization),
    gpt4: generateGPT4Prompt(component, customization),
    cursor: generateCursorPrompt(component, customization),
    copilot: generateCopilotPrompt(component, customization),
    windsurf: generateWindsurfPrompt(component, customization),
    universal: generateUniversalPrompt(component, customization),
  };
}

/**
 * Export all collection prompts for all AI targets at once
 */
export function generateAllTargetCollectionPrompts(
  collection: Collection
): Record<AITarget, string> {
  return {
    claude: generateCollectionPrompt(collection),
    gpt4: generateGPT4CollectionPrompt(collection),
    cursor: generateCursorCollectionPrompt(collection),
    copilot: generateCopilotCollectionPrompt(collection),
    windsurf: generateWindsurfCollectionPrompt(collection),
    universal: generateUniversalCollectionPrompt(collection),
  };
}

/**
 * Export all individual prompts for all AI targets at once
 */
export function generateAllTargetIndividualPrompts(
  collection: Collection
): Record<AITarget, string[]> {
  return {
    claude: generateIndividualPrompts(collection),
    gpt4: generateGPT4IndividualPrompts(collection),
    cursor: generateCursorIndividualPrompts(collection),
    copilot: generateCopilotIndividualPrompts(collection),
    windsurf: generateWindsurfIndividualPrompts(collection),
    universal: generateUniversalIndividualPrompts(collection),
  };
}
