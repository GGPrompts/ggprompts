'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import {
  componentLibrary,
  getAllComponents,
  ComponentDefinition,
  categoryDisplayNames,
} from '@/lib/component-registry';
import { ComponentCategory } from '@/types/component';
import { useCanvasStore, VIEWPORT_DIMENSIONS } from '@/lib/stores/canvas-store';
import { CanvasComponent, CanvasPosition } from '@/types/canvas';
import { defaultCustomization } from '@/types/customization';
import { cn } from '@/lib/utils';

type ComponentLibrarySidebarProps = {
  className?: string;
};

export function ComponentLibrarySidebar({ className }: ComponentLibrarySidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['cards', 'buttons'])
  );

  const { addComponent, components, viewportDevice } = useCanvasStore();
  const dimensions = VIEWPORT_DIMENSIONS[viewportDevice];

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) {
      return componentLibrary;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<ComponentCategory, ComponentDefinition[]> = {
      cards: [],
      buttons: [],
      badges: [],
      forms: [],
      navigation: [],
      effects: [],
      'data-display': [],
      modals: [],
      feedback: [],
      headers: [],
      footers: [],
      heroes: [],
      pricing: [],
      testimonials: [],
      auth: [],
      marketing: [],
    };

    Object.entries(componentLibrary).forEach(([category, comps]) => {
      filtered[category as ComponentCategory] = comps.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    return filtered;
  }, [searchQuery]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddComponent = (componentDef: ComponentDefinition) => {
    // Calculate a position that doesn't overlap with existing components
    const existingPositions = components.map((c) => c.position);
    const gridSize = 20;

    // Find a good starting position
    let startX = 100;
    let startY = 100;

    // Check for overlaps and cascade position
    while (
      existingPositions.some(
        (pos) =>
          Math.abs(pos.x - startX) < 50 && Math.abs(pos.y - startY) < 50
      )
    ) {
      startX += gridSize * 2;
      startY += gridSize * 2;

      // Wrap if we go too far
      if (startX > dimensions.width - 300) {
        startX = 100;
        startY += 100;
      }
      if (startY > dimensions.height - 200) {
        startY = 100;
      }
    }

    const position: CanvasPosition = {
      x: startX,
      y: startY,
      width: 320,
      height: 200,
      zIndex: 0, // Will be set by the store
    };

    const newComponent: CanvasComponent = {
      id: `canvas-${componentDef.id}-${Date.now()}`,
      componentId: componentDef.id,
      customization: {
        ...defaultCustomization,
        ...componentDef.defaultCustomization,
      },
      order: components.length,
      position,
      locked: false,
      hidden: false,
    };

    addComponent(newComponent);
  };

  const categoriesWithComponents = Object.entries(filteredComponents).filter(
    ([_, comps]) => comps.length > 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'w-72 bg-zinc-900/95 backdrop-blur-sm border-r border-white/10 flex flex-col h-full',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {categoriesWithComponents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-white/40"
            >
              <p className="text-sm">No components found</p>
            </motion.div>
          ) : (
            categoriesWithComponents.map(([category, comps]) => (
              <div key={category} className="mb-2">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {categoryDisplayNames[category as ComponentCategory]}
                  </span>
                  <span className="ml-auto text-xs text-white/40">{comps.length}</span>
                </button>

                {/* Category items */}
                <AnimatePresence>
                  {expandedCategories.has(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-2 space-y-1 mt-1">
                        {comps.map((comp) => (
                          <motion.div
                            key={comp.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="group"
                          >
                            <button
                              onClick={() => handleAddComponent(comp)}
                              className="w-full flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-lg transition-all text-left"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-white truncate">
                                    {comp.name}
                                  </span>
                                </div>
                                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                                  {comp.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {comp.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-1.5 py-0.5 text-[10px] bg-white/5 text-white/40 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                                  <Plus className="w-4 h-4" />
                                </div>
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-zinc-900/50">
        <p className="text-xs text-white/40 text-center">
          Click a component to add it to the canvas
        </p>
      </div>
    </motion.div>
  );
}
