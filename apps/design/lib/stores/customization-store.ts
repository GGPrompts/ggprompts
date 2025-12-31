import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ComponentDefinition } from '@/lib/component-registry';
import { Customization, defaultCustomization } from '@/types/customization';

// Global settings that persist across component switches
// These are the "theme" - colors, typography, spacing, effects, code prefs
const GLOBAL_KEYS: (keyof Customization)[] = [
  // Colors
  'colorPreset',
  'primaryColor',
  'secondaryColor',
  'backgroundColor',
  'textColor',
  // Typography
  'fontFamily',
  'fontSize',
  'fontWeight',
  // Spacing
  'padding',
  'margin',
  'borderRadius',
  // Effects
  'animation',
  'duration',
  'shadowIntensity',
  'blurAmount',
  // Framework/Code
  'framework',
  'typescript',
  'styling',
  // Features
  'responsive',
  'darkMode',
  'accessibility',
  'animations',
];

// Extract global settings from a customization object
function extractGlobalSettings(customization: Customization): Partial<Customization> {
  const globals: Partial<Customization> = {};
  for (const key of GLOBAL_KEYS) {
    if (key in customization) {
      globals[key] = customization[key];
    }
  }
  return globals;
}

type CustomizationStore = {
  selectedComponent: ComponentDefinition | null;
  customization: Customization;
  setComponent: (component: ComponentDefinition | null) => void;
  updateCustomization: (updates: Partial<Customization>) => void;
  resetCustomization: () => void;
  resetToDefaults: () => void; // Full reset including globals
};

export const useCustomizationStore = create<CustomizationStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedComponent: null,
        customization: defaultCustomization,

        setComponent: (component) => {
          const currentGlobals = extractGlobalSettings(get().customization);
          const componentDefaults = component?.defaultCustomization || {};

          // Merge: defaults + component defaults + current global settings (globals win)
          set({
            selectedComponent: component,
            customization: {
              ...defaultCustomization,
              ...componentDefaults,
              ...currentGlobals,
            } as Customization,
          });
        },

        updateCustomization: (updates) =>
          set((state) => ({
            customization: { ...state.customization, ...updates },
          })),

        // Reset only component-specific settings, keep globals
        resetCustomization: () => {
          const currentGlobals = extractGlobalSettings(get().customization);
          set({
            customization: {
              ...defaultCustomization,
              ...currentGlobals,
            },
          });
        },

        // Full reset - back to default theme
        resetToDefaults: () =>
          set({ customization: defaultCustomization }),
      }),
      {
        name: 'design2prompt-theme',
        // Only persist global settings to localStorage
        partialize: (state) => ({
          customization: extractGlobalSettings(state.customization),
        }),
        // Merge persisted globals with defaults on load
        merge: (persisted, current) => {
          const persistedState = persisted as { customization?: Partial<Customization> };
          return {
            ...current,
            customization: {
              ...current.customization,
              ...(persistedState?.customization || {}),
            },
          };
        },
      }
    ),
    { name: 'CustomizationStore' }
  )
);
