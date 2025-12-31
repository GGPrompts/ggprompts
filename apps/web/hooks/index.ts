export { useAuth } from './useAuth'
export { usePromptInteractions } from './usePromptInteractions'
// Re-export TabzChrome utilities from shared package
export { useTabzChrome, TabzChromeProvider, buildClaudeCommand } from '@ggprompts/tabz'
export type { SpawnTerminalOptions, PluginScope, InstallPluginOptions } from '@ggprompts/tabz'
export { useKeyboardNav, useKeyboardNavContext, KeyboardNavProvider } from './useKeyboardNav'
export { useFuzzySearch, createFuzzySearch } from './useFuzzySearch'
export type { FuzzySearchOptions, FuzzySearchResult } from './useFuzzySearch'
