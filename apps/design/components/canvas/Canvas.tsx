'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore, VIEWPORT_DIMENSIONS } from '@/lib/stores/canvas-store';
import { CanvasComponent } from '@/types/canvas';
import { CanvasComponentWrapper } from './CanvasComponent';
import { CanvasGrid } from './CanvasGrid';
import { CanvasToolbar } from './CanvasToolbar';
import { ComponentPreview } from '@/components/studio/ComponentPreview';
import { getComponentById } from '@/lib/component-registry';
import { cn } from '@/lib/utils';

type CanvasProps = {
  onExport?: () => void;
  onSaveLayout?: () => void;
};

export function Canvas({ onExport, onSaveLayout }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const {
    components,
    viewport,
    viewportDevice,
    grid,
    selection,
    isDragging,
    isPanning,
    setDragging,
    setPanning,
    setViewport,
    updateComponentPosition,
    clearSelection,
    snapToGrid,
    screenToCanvas,
  } = useCanvasStore();

  const dimensions = VIEWPORT_DIMENSIONS[viewportDevice];

  // Create snap modifier based on grid settings
  const snapModifier = createSnapModifier(grid.snap ? grid.size : 1);

  // Configure sensors for drag detection
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Minimum drag distance before activation
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveDragId(event.active.id as string);
      setDragging(true);
    },
    [setDragging]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      if (active && delta) {
        const componentId = active.id as string;

        // Get the component's current position
        const component = components.find((c) => c.id === componentId);
        if (component) {
          // Calculate new position with optional grid snapping
          let newX = component.position.x + delta.x / viewport.zoom;
          let newY = component.position.y + delta.y / viewport.zoom;

          // Apply grid snapping
          if (grid.snap) {
            const snapped = snapToGrid({ x: newX, y: newY });
            newX = snapped.x;
            newY = snapped.y;
          }

          // Constrain to canvas bounds
          newX = Math.max(0, Math.min(newX, dimensions.width - component.position.width));
          newY = Math.max(0, Math.min(newY, dimensions.height - component.position.height));

          updateComponentPosition(componentId, { x: newX, y: newY });
        }
      }

      setActiveDragId(null);
      setDragging(false);
    },
    [components, viewport.zoom, grid.snap, dimensions, snapToGrid, updateComponentPosition, setDragging]
  );

  // Handle canvas panning with middle mouse button or space + drag
  const [isPanningActive, setIsPanningActive] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [viewportStart, setViewportStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Middle mouse button or space key held
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault();
        setIsPanningActive(true);
        setPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
        setViewportStart({ x: viewport.x, y: viewport.y });
      } else if (e.button === 0 && e.target === canvasRef.current) {
        // Click on empty canvas area - clear selection
        clearSelection();
      }
    },
    [viewport, setPanning, clearSelection]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanningActive) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setViewport({
          x: viewportStart.x + dx,
          y: viewportStart.y + dy,
        });
      }
    },
    [isPanningActive, panStart, viewportStart, setViewport]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanningActive) {
      setIsPanningActive(false);
      setPanning(false);
    }
  }, [isPanningActive, setPanning]);

  // Handle zoom with scroll wheel (plain scroll = zoom, shift+scroll = pan)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      // Shift + scroll for horizontal pan
      if (e.shiftKey) {
        setViewport({
          x: viewport.x - e.deltaY,
          y: viewport.y,
        });
        return;
      }

      // Plain scroll for zoom (like Figma)
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.max(0.25, Math.min(2, viewport.zoom + delta));

      // Zoom toward cursor position
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomRatio = newZoom / viewport.zoom;
        const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
        const newY = mouseY - (mouseY - viewport.y) * zoomRatio;

        setViewport({ x: newX, y: newY, zoom: newZoom });
      }
    },
    [viewport, setViewport]
  );

  // Get active drag component for overlay
  const activeDragComponent = activeDragId
    ? components.find((c) => c.id === activeDragId)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex justify-center p-4 border-b border-white/10 bg-zinc-950">
        <CanvasToolbar onExport={onExport} onSaveLayout={onSaveLayout} />
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-hidden relative bg-zinc-950',
          isPanningActive && 'cursor-grabbing'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%),
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />

        {/* Viewport frame */}
        <DndContext
          sensors={sensors}
          modifiers={grid.snap ? [snapModifier] : []}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <motion.div
            ref={canvasRef}
            className="absolute bg-zinc-900/50 border border-white/20 rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              left: '50%',
              top: '50%',
              x: viewport.x - dimensions.width / 2,
              y: viewport.y - dimensions.height / 2,
              scale: viewport.zoom,
            }}
            transition={{ duration: 0.1 }}
          >
            {/* Grid overlay */}
            <CanvasGrid />

            {/* Canvas components */}
            <AnimatePresence>
              {components.map((component) => (
                <CanvasComponentWrapper
                  key={component.id}
                  component={component}
                  isSelected={selection.selectedIds.includes(component.id)}
                  zoom={viewport.zoom}
                />
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {components.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-white/40"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v8m-4-4h8"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-1">Empty Canvas</p>
                <p className="text-sm">Add components from the sidebar to get started</p>
              </motion.div>
            )}
          </motion.div>

          {/* Drag overlay for smooth visual feedback */}
          <DragOverlay>
            {activeDragComponent && (
              <div
                className="bg-zinc-800 rounded-lg border border-emerald-500 shadow-2xl opacity-80 p-4"
                style={{
                  width: activeDragComponent.position.width,
                  height: activeDragComponent.position.height,
                }}
              >
                {getComponentById(activeDragComponent.componentId) && (
                  <ComponentPreview
                    component={getComponentById(activeDragComponent.componentId)!}
                    customization={activeDragComponent.customization}
                  />
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-zinc-900/90 rounded-lg border border-white/10 text-xs text-white/60">
          Zoom: {Math.round(viewport.zoom * 100)}%
          <span className="text-white/30 ml-2">Scroll to zoom • Alt+drag to pan</span>
        </div>

        {/* Pan indicator */}
        {isPanningActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900/90 rounded-lg border border-white/10 text-xs text-white/60">
            Panning...
          </div>
        )}
      </div>
    </div>
  );
}
