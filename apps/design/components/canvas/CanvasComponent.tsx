'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Trash2, GripVertical, Layers, Type, X } from 'lucide-react';
import { CanvasComponent as CanvasComponentType } from '@/types/canvas';
import { useCanvasStore, VIEWPORT_DIMENSIONS } from '@/lib/stores/canvas-store';
import { ComponentPreview } from '@/components/studio/ComponentPreview';
import { getComponentById, TextSlot } from '@/lib/component-registry';
import { cn } from '@/lib/utils';

type CanvasComponentProps = {
  component: CanvasComponentType;
  isSelected: boolean;
  zoom: number;
};

type ResizeHandle = 'e' | 's' | 'se' | null;

export function CanvasComponentWrapper({
  component,
  isSelected,
  zoom,
}: CanvasComponentProps) {
  const {
    selectComponent,
    removeComponent,
    toggleComponentLock,
    toggleComponentVisibility,
    bringToFront,
    updateComponentPosition,
    updateComponentText,
    viewportDevice,
    grid,
  } = useCanvasStore();

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    width: number;
    height: number;
  } | null>(null);

  // Text editing state
  const [isEditingText, setIsEditingText] = useState(false);
  const editPanelRef = useRef<HTMLDivElement>(null);

  const dimensions = VIEWPORT_DIMENSIONS[viewportDevice];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    disabled: component.locked || isResizing, // Disable drag when resizing
    data: {
      type: 'canvas-component',
      component,
    },
  });

  const componentDef = getComponentById(component.componentId);

  // Resize handlers
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setResizeHandle(handle);
      resizeStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        width: component.position.width,
        height: component.position.height,
      };

      // Select the component when starting resize
      selectComponent(component.id);
      bringToFront(component.id);
    },
    [component.id, component.position.width, component.position.height, selectComponent, bringToFront]
  );

  useEffect(() => {
    if (!isResizing || !resizeStartRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = (e.clientX - resizeStartRef.current.mouseX) / zoom;
      const deltaY = (e.clientY - resizeStartRef.current.mouseY) / zoom;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;

      // Apply deltas based on which handle is being dragged
      if (resizeHandle === 'e' || resizeHandle === 'se') {
        newWidth = Math.max(100, resizeStartRef.current.width + deltaX);
      }
      if (resizeHandle === 's' || resizeHandle === 'se') {
        newHeight = Math.max(80, resizeStartRef.current.height + deltaY);
      }

      // Apply grid snapping if enabled
      if (grid.snap) {
        newWidth = Math.round(newWidth / grid.size) * grid.size;
        newHeight = Math.round(newHeight / grid.size) * grid.size;
      }

      // Constrain to canvas bounds
      const maxWidth = dimensions.width - component.position.x;
      const maxHeight = dimensions.height - component.position.y;
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);

      updateComponentPosition(component.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      resizeStartRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, zoom, grid.snap, grid.size, dimensions, component.id, component.position.x, component.position.y, updateComponentPosition]);

  // Get text slots from component definition
  const textSlots = componentDef?.textSlots || [];
  const hasTextSlots = textSlots.length > 0;

  // Handle double-click to enter text edit mode
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (component.locked || !hasTextSlots) return;
      setIsEditingText(true);
    },
    [component.locked, hasTextSlots]
  );

  // Handle click outside to exit edit mode
  useEffect(() => {
    if (!isEditingText) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (editPanelRef.current && !editPanelRef.current.contains(e.target as Node)) {
        setIsEditingText(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditingText(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditingText]);

  // Handle text change
  const handleTextChange = useCallback(
    (slotKey: string, value: string) => {
      updateComponentText(component.id, slotKey, value);
    },
    [component.id, updateComponentText]
  );

  // Get text value for a slot
  const getTextValue = useCallback(
    (slot: TextSlot) => {
      return component.textContent?.[slot.key] ?? slot.defaultValue;
    },
    [component.textContent]
  );

  // Calculate the actual position (transform from dnd-kit + stored position)
  // Use very high z-index when dragging, resizing, or editing text to stay on top
  const effectiveZIndex = (isDragging || isResizing || isEditingText) ? 99999 : component.position.zIndex;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: component.position.x,
    top: component.position.y,
    width: component.position.width,
    height: component.position.height,
    zIndex: effectiveZIndex,
    transform: CSS.Translate.toString(transform),
    cursor: component.locked ? 'not-allowed' : isDragging ? 'grabbing' : isResizing ? 'default' : 'grab',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id, e.shiftKey || e.metaKey);
    bringToFront(component.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComponentLock(component.id);
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComponentVisibility(component.id);
  };

  if (component.hidden) {
    // Show ghost outline when hidden
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-dashed border-white/20 rounded-lg bg-white/5"
        onClick={handleClick}
      >
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleToggleVisibility}
            className="p-1.5 rounded bg-black/50 text-white/60 hover:text-white hover:bg-black/70 transition-colors"
            title="Show component"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-center h-full text-white/30 text-sm">
          Hidden: {componentDef?.name || 'Component'}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditingText ? {} : listeners)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      initial={false}
      animate={{
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging
          ? '0 20px 40px rgba(0,0,0,0.3)'
          : isSelected
          ? '0 0 0 2px #10b981, 0 8px 20px rgba(0,0,0,0.2)'
          : '0 4px 12px rgba(0,0,0,0.15)',
      }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group rounded-lg overflow-hidden',
        'bg-zinc-900/90 backdrop-blur-sm border',
        isSelected ? 'border-emerald-500' : 'border-white/10',
        isDragging && 'opacity-90',
        component.locked && 'ring-2 ring-amber-500/50',
        isEditingText && 'ring-2 ring-cyan-500/50'
      )}
    >
      {/* Component header with controls */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-between px-2">
        {/* Drag handle */}
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-4 h-4 text-white/50" />
          <span className="text-xs text-white/70 font-medium truncate max-w-[100px]">
            {componentDef?.name || 'Component'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {hasTextSlots && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingText(true);
              }}
              className={cn(
                'p-1 rounded transition-colors',
                isEditingText
                  ? 'text-cyan-400 bg-cyan-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
              title="Edit text (double-click)"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleToggleVisibility}
            className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={component.hidden ? 'Show' : 'Hide'}
          >
            {component.hidden ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={handleToggleLock}
            className={cn(
              'p-1 rounded transition-colors',
              component.locked
                ? 'text-amber-400 bg-amber-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}
            title={component.locked ? 'Unlock' : 'Lock'}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              bringToFront(component.id);
            }}
            className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Bring to front"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Component preview content - reduced padding for precise alignment */}
      <div className="w-full h-full p-2 flex items-center justify-center overflow-hidden">
        {componentDef ? (
          <div className="transform-gpu" style={{ transform: `scale(${Math.min(1, component.position.width / 400)})` }}>
            <ComponentPreview
              component={componentDef}
              customization={component.customization}
              textContent={component.textContent}
            />
          </div>
        ) : (
          <div className="text-white/50 text-sm">Component not found</div>
        )}
      </div>

      {/* Text editing panel */}
      <AnimatePresence>
        {isEditingText && hasTextSlots && (
          <motion.div
            ref={editPanelRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/20 rounded-lg shadow-xl z-30 overflow-hidden"
            style={{ minWidth: '280px' }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white/90">Edit Text</span>
              </div>
              <button
                onClick={() => setIsEditingText(false)}
                className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Text inputs */}
            <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto">
              {textSlots.map((slot) => (
                <div key={slot.key}>
                  <label className="block text-xs text-white/60 mb-1.5">{slot.label}</label>
                  {slot.multiline ? (
                    <textarea
                      value={getTextValue(slot)}
                      onChange={(e) => handleTextChange(slot.key, e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none"
                      rows={3}
                      placeholder={slot.defaultValue}
                    />
                  ) : (
                    <input
                      type="text"
                      value={getTextValue(slot)}
                      onChange={(e) => handleTextChange(slot.key, e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                      placeholder={slot.defaultValue}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-3 py-2 bg-zinc-800/30 border-t border-white/5">
              <p className="text-xs text-white/40">Press Escape or click outside to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize handles - functional with mouse event handlers */}
      {isSelected && !component.locked && (
        <>
          {/* Right edge (E) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            className={cn(
              "absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-emerald-500 rounded-full cursor-ew-resize opacity-70 hover:opacity-100 transition-opacity z-20",
              resizeHandle === 'e' && "opacity-100 bg-emerald-400"
            )}
          />
          {/* Bottom edge (S) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            className={cn(
              "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-emerald-500 rounded-full cursor-ns-resize opacity-70 hover:opacity-100 transition-opacity z-20",
              resizeHandle === 's' && "opacity-100 bg-emerald-400"
            )}
          />
          {/* Corner (SE) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            className={cn(
              "absolute -right-2 -bottom-2 w-4 h-4 bg-emerald-500 rounded-full cursor-nwse-resize opacity-70 hover:opacity-100 transition-opacity z-20",
              resizeHandle === 'se' && "opacity-100 bg-emerald-400"
            )}
          />
        </>
      )}

      {/* Lock indicator */}
      {component.locked && (
        <div className="absolute bottom-2 left-2 bg-amber-500/90 text-black text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Locked
        </div>
      )}
    </motion.div>
  );
}
