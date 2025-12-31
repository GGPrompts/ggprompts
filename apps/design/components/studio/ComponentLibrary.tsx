'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  componentLibrary,
  categoryDisplayNames,
  searchComponents,
  ComponentDefinition,
} from '@/lib/component-registry';
import { ComponentCategory } from '@/types/component';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  CreditCard,
  MousePointer,
  FileText,
  Menu,
  Sparkles,
  BarChart3,
  Layers,
  PanelTop,
  PanelBottom,
  ChevronRight,
  LayoutGrid,
  DollarSign,
  MessageSquare,
  KeyRound,
  Megaphone,
  BadgeCheck,
  Bell,
} from 'lucide-react';

type ComponentLibraryProps = {
  selectedComponent: ComponentDefinition | null;
  onSelectComponent: (component: ComponentDefinition) => void;
};

const categoryIconMap: Record<ComponentCategory, React.ReactNode> = {
  cards: <CreditCard className="w-4 h-4" />,
  buttons: <MousePointer className="w-4 h-4" />,
  badges: <BadgeCheck className="w-4 h-4" />,
  forms: <FileText className="w-4 h-4" />,
  navigation: <Menu className="w-4 h-4" />,
  effects: <Sparkles className="w-4 h-4" />,
  'data-display': <BarChart3 className="w-4 h-4" />,
  modals: <Layers className="w-4 h-4" />,
  feedback: <Bell className="w-4 h-4" />,
  headers: <PanelTop className="w-4 h-4" />,
  footers: <PanelBottom className="w-4 h-4" />,
  heroes: <LayoutGrid className="w-4 h-4" />,
  pricing: <DollarSign className="w-4 h-4" />,
  testimonials: <MessageSquare className="w-4 h-4" />,
  auth: <KeyRound className="w-4 h-4" />,
  marketing: <Megaphone className="w-4 h-4" />,
};

export function ComponentLibrary({
  selectedComponent,
  onSelectComponent,
}: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<ComponentCategory[]>([
    'cards',
    'buttons',
  ]);

  const toggleCategory = (category: ComponentCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredComponents = searchQuery
    ? searchComponents(searchQuery)
    : null;

  const categoriesToShow = Object.entries(componentLibrary).filter(
    ([_, components]) => components.length > 0
  );

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-lg mb-3">Component Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {searchQuery && filteredComponents ? (
            // Search results
            <div className="space-y-1">
              <p className="text-xs text-white/40 px-2 py-1">
                {filteredComponents.length} results for "{searchQuery}"
              </p>
              {filteredComponents.map((component) => (
                <ComponentItem
                  key={component.id}
                  component={component}
                  isSelected={selectedComponent?.id === component.id}
                  onClick={() => onSelectComponent(component)}
                />
              ))}
            </div>
          ) : (
            // Category view
            <div className="space-y-1">
              {categoriesToShow.map(([category, components]) => (
                <CategorySection
                  key={category}
                  category={category as ComponentCategory}
                  components={components}
                  isExpanded={expandedCategories.includes(category as ComponentCategory)}
                  onToggle={() => toggleCategory(category as ComponentCategory)}
                  selectedComponent={selectedComponent}
                  onSelectComponent={onSelectComponent}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          12 components · 6 categories
        </p>
      </div>
    </div>
  );
}

type CategorySectionProps = {
  category: ComponentCategory;
  components: ComponentDefinition[];
  isExpanded: boolean;
  onToggle: () => void;
  selectedComponent: ComponentDefinition | null;
  onSelectComponent: (component: ComponentDefinition) => void;
};

function CategorySection({
  category,
  components,
  isExpanded,
  onToggle,
  selectedComponent,
  onSelectComponent,
}: CategorySectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/5 transition-colors"
      >
        <ChevronRight
          className={cn(
            'w-4 h-4 transition-transform text-white/60',
            isExpanded && 'rotate-90'
          )}
        />
        {categoryIconMap[category]}
        <span className="font-medium text-sm flex-1 text-left">
          {categoryDisplayNames[category]}
        </span>
        <span className="text-xs text-white/40">{components.length}</span>
      </button>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="ml-6 mt-1 space-y-1"
        >
          {components.map((component) => (
            <ComponentItem
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onClick={() => onSelectComponent(component)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

type ComponentItemProps = {
  component: ComponentDefinition;
  isSelected: boolean;
  onClick: () => void;
};

function ComponentItem({ component, isSelected, onClick }: ComponentItemProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md transition-colors',
              isSelected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'hover:bg-white/5'
            )}
          >
            <div className="font-medium text-sm">{component.name}</div>
            <div
              className={cn(
                'text-xs line-clamp-2',
                isSelected ? 'text-emerald-400/70' : 'text-white/50'
              )}
            >
              {component.description}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs bg-zinc-800 border-white/10">
          <p className="font-medium">{component.name}</p>
          <p className="text-xs text-white/60">{component.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
