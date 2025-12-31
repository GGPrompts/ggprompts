import { Customization } from './customization';

export type ComponentCategory =
  | 'cards'
  | 'buttons'
  | 'badges'
  | 'forms'
  | 'navigation'
  | 'effects'
  | 'data-display'
  | 'modals'
  | 'feedback'
  | 'headers'
  | 'footers'
  | 'heroes'
  | 'pricing'
  | 'testimonials'
  | 'auth'
  | 'marketing';

export type CustomizableProp = {
  key: string;
  label: string;
  type: 'slider' | 'color' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: any;
  description?: string;
  tooltip?: string;
};

export type PreviewProps = {
  customization: Customization;
};

export type Component = {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  tags: string[];
  customizableProps: CustomizableProp[];
  defaultCustomization: Customization;
  previewComponent: React.ComponentType<PreviewProps>;
  thumbnail: string;
};
