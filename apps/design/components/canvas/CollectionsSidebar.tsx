'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronRight, ChevronDown, FolderOpen, Package } from 'lucide-react';
import { useCollectionStore } from '@/lib/stores/collection-store';
import { useCanvasStore, VIEWPORT_DIMENSIONS } from '@/lib/stores/canvas-store';
import { getComponentById } from '@/lib/component-registry';
import { CanvasComponent, CanvasPosition } from '@/types/canvas';
import { SavedComponent, Collection } from '@/types/collection';
import { cn } from '@/lib/utils';

type CollectionsSidebarProps = {
  className?: string;
};

export function CollectionsSidebar({ className }: CollectionsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

  const { collections } = useCollectionStore();
  const { addComponent, components, viewportDevice } = useCanvasStore();
  const dimensions = VIEWPORT_DIMENSIONS[viewportDevice];

  // Filter collections and components based on search
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) {
      return collections;
    }

    const query = searchQuery.toLowerCase();
    return collections
      .map((collection) => ({
        ...collection,
        components: collection.components.filter((comp) => {
          const componentDef = getComponentById(comp.componentId);
          return (
            componentDef?.name.toLowerCase().includes(query) ||
            comp.notes?.toLowerCase().includes(query) ||
            collection.name.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((collection) => collection.components.length > 0 || collection.name.toLowerCase().includes(query));
  }, [collections, searchQuery]);

  const toggleCollection = (collectionId: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const handleAddSavedComponent = (savedComponent: SavedComponent, collection: Collection) => {
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

    // Use saved canvas position if available, otherwise use calculated position
    const position: CanvasPosition = savedComponent.canvasPosition || {
      x: startX,
      y: startY,
      width: 320,
      height: 200,
      zIndex: 0,
    };

    const newComponent: CanvasComponent = {
      id: `canvas-${savedComponent.componentId}-${Date.now()}`,
      componentId: savedComponent.componentId,
      customization: { ...savedComponent.customization },
      notes: savedComponent.notes,
      order: components.length,
      position: { ...position, zIndex: 0 }, // zIndex will be set by store
      locked: false,
      hidden: false,
    };

    addComponent(newComponent);
  };

  const totalComponents = collections.reduce((acc, c) => acc + c.components.length, 0);

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
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">My Collections</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search saved components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Collections list */}
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {collections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-white/40"
            >
              <Package className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm font-medium">No collections yet</p>
              <p className="text-xs mt-1 text-center px-4">
                Save components from the Studio to create collections
              </p>
            </motion.div>
          ) : filteredCollections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-white/40"
            >
              <p className="text-sm">No matching components</p>
            </motion.div>
          ) : (
            filteredCollections.map((collection) => (
              <div key={collection.id} className="mb-2">
                {/* Collection header */}
                <button
                  onClick={() => toggleCollection(collection.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {expandedCollections.has(collection.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium truncate flex-1 text-left">
                    {collection.name}
                  </span>
                  <span className="text-xs text-white/40">{collection.components.length}</span>
                </button>

                {/* Collection items */}
                <AnimatePresence>
                  {expandedCollections.has(collection.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-2 space-y-1 mt-1">
                        {collection.components.length === 0 ? (
                          <p className="text-xs text-white/30 px-3 py-2">No components</p>
                        ) : (
                          collection.components.map((savedComp) => {
                            const componentDef = getComponentById(savedComp.componentId);
                            if (!componentDef) return null;

                            return (
                              <motion.div
                                key={savedComp.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="group"
                              >
                                <button
                                  onClick={() => handleAddSavedComponent(savedComp, collection)}
                                  className="w-full flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 rounded-lg transition-all text-left"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-white truncate">
                                        {componentDef.name}
                                      </span>
                                    </div>
                                    {savedComp.notes && (
                                      <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                                        {savedComp.notes}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span
                                        className="w-3 h-3 rounded-full border border-white/20"
                                        style={{
                                          backgroundColor: savedComp.customization.primaryColor || '#10b981',
                                        }}
                                      />
                                      <span className="text-[10px] text-white/40">
                                        {componentDef.category}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                                      <Plus className="w-4 h-4" />
                                    </div>
                                  </div>
                                </button>
                              </motion.div>
                            );
                          })
                        )}
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
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{collections.length} collections</span>
          <span>{totalComponents} saved components</span>
        </div>
        <p className="text-xs text-white/30 text-center mt-2">
          Click a component to add it to the canvas
        </p>
      </div>
    </motion.div>
  );
}
