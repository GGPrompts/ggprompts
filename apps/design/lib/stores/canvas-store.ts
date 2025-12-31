import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { CanvasComponent, CanvasPosition, CanvasLayout } from '@/types/canvas';

// Viewport device types
export type ViewportDevice = 'mobile' | 'tablet' | 'desktop';

// Viewport dimensions for each device
export const VIEWPORT_DIMENSIONS: Record<ViewportDevice, { width: number; height: number }> = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

// Pan/zoom state for canvas navigation
export type ViewportState = {
  x: number; // Pan offset X
  y: number; // Pan offset Y
  zoom: number; // Zoom level (0.25 to 2)
};

// Selection state
export type SelectionState = {
  selectedIds: string[];
  selectionBox: { x: number; y: number; width: number; height: number } | null;
};

type CanvasStore = {
  // Components on canvas
  components: CanvasComponent[];

  // Grid settings
  grid: {
    size: number;
    show: boolean;
    snap: boolean;
  };

  // Alignment guides
  guides: {
    show: boolean;
    positions: number[];
  };

  // Device viewport (mobile/tablet/desktop)
  viewportDevice: ViewportDevice;

  // Pan/zoom state
  viewport: ViewportState;

  // Selection
  selection: SelectionState;

  // Drag state
  isDragging: boolean;
  isPanning: boolean;

  // Max z-index tracker
  maxZIndex: number;

  // Saved layouts
  layouts: CanvasLayout[];
  activeLayoutId: string | null;

  // Component actions
  addComponent: (component: CanvasComponent) => void;
  removeComponent: (id: string) => void;
  updateComponentPosition: (id: string, position: Partial<CanvasPosition>) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  updateComponentText: (id: string, slotKey: string, value: string) => void;
  toggleComponentLock: (id: string) => void;
  toggleComponentVisibility: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // Selection actions
  selectComponent: (id: string, multi?: boolean) => void;
  deselectComponent: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Grid actions
  setGrid: (grid: Partial<CanvasStore['grid']>) => void;
  setGuides: (guides: Partial<CanvasStore['guides']>) => void;

  // Viewport actions
  setViewportDevice: (device: ViewportDevice) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;

  // Drag state actions
  setDragging: (isDragging: boolean) => void;
  setPanning: (isPanning: boolean) => void;

  // Layout actions
  saveLayout: (name: string) => string;
  loadLayout: (id: string) => void;
  deleteLayout: (id: string) => void;

  // Canvas actions
  clearCanvas: () => void;
  getNextZIndex: () => number;

  // Position utilities
  snapToGrid: (position: { x: number; y: number }) => { x: number; y: number };
  screenToCanvas: (screenX: number, screenY: number) => { x: number; y: number };
  canvasToScreen: (canvasX: number, canvasY: number) => { x: number; y: number };
};

// Zoom constraints
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        components: [],
        grid: { size: 20, show: true, snap: true },
        guides: { show: true, positions: [] },
        viewportDevice: 'desktop',
        viewport: { x: 0, y: 0, zoom: 1 },
        selection: { selectedIds: [], selectionBox: null },
        isDragging: false,
        isPanning: false,
        maxZIndex: 0,
        layouts: [],
        activeLayoutId: null,

        // Component actions
        addComponent: (component) =>
          set((state) => {
            const zIndex = state.maxZIndex + 1;
            return {
              components: [
                ...state.components,
                { ...component, position: { ...component.position, zIndex } },
              ],
              maxZIndex: zIndex,
            };
          }),

        removeComponent: (id) =>
          set((state) => ({
            components: state.components.filter((c) => c.id !== id),
            selection: {
              ...state.selection,
              selectedIds: state.selection.selectedIds.filter((sid) => sid !== id),
            },
          })),

        updateComponentPosition: (id, positionUpdates) =>
          set((state) => ({
            components: state.components.map((c) =>
              c.id === id
                ? { ...c, position: { ...c.position, ...positionUpdates } }
                : c
            ),
          })),

        updateComponent: (id, updates) =>
          set((state) => ({
            components: state.components.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          })),

        updateComponentText: (id, slotKey, value) =>
          set((state) => ({
            components: state.components.map((c) =>
              c.id === id
                ? {
                    ...c,
                    textContent: {
                      ...c.textContent,
                      [slotKey]: value,
                    },
                  }
                : c
            ),
          })),

        toggleComponentLock: (id) =>
          set((state) => ({
            components: state.components.map((c) =>
              c.id === id ? { ...c, locked: !c.locked } : c
            ),
          })),

        toggleComponentVisibility: (id) =>
          set((state) => ({
            components: state.components.map((c) =>
              c.id === id ? { ...c, hidden: !c.hidden } : c
            ),
          })),

        bringToFront: (id) =>
          set((state) => {
            const newZIndex = state.maxZIndex + 1;
            return {
              components: state.components.map((c) =>
                c.id === id
                  ? { ...c, position: { ...c.position, zIndex: newZIndex } }
                  : c
              ),
              maxZIndex: newZIndex,
            };
          }),

        sendToBack: (id) =>
          set((state) => {
            const minZIndex = Math.min(
              ...state.components.map((c) => c.position.zIndex)
            );
            return {
              components: state.components.map((c) =>
                c.id === id
                  ? { ...c, position: { ...c.position, zIndex: minZIndex - 1 } }
                  : c
              ),
            };
          }),

        // Selection actions
        selectComponent: (id, multi = false) =>
          set((state) => ({
            selection: {
              ...state.selection,
              selectedIds: multi
                ? state.selection.selectedIds.includes(id)
                  ? state.selection.selectedIds.filter((sid) => sid !== id)
                  : [...state.selection.selectedIds, id]
                : [id],
            },
          })),

        deselectComponent: (id) =>
          set((state) => ({
            selection: {
              ...state.selection,
              selectedIds: state.selection.selectedIds.filter((sid) => sid !== id),
            },
          })),

        clearSelection: () =>
          set((state) => ({
            selection: { ...state.selection, selectedIds: [], selectionBox: null },
          })),

        selectAll: () =>
          set((state) => ({
            selection: {
              ...state.selection,
              selectedIds: state.components
                .filter((c) => !c.locked && !c.hidden)
                .map((c) => c.id),
            },
          })),

        // Grid actions
        setGrid: (gridUpdates) =>
          set((state) => ({
            grid: { ...state.grid, ...gridUpdates },
          })),

        setGuides: (guidesUpdates) =>
          set((state) => ({
            guides: { ...state.guides, ...guidesUpdates },
          })),

        // Viewport actions
        setViewportDevice: (device) => set({ viewportDevice: device }),

        setViewport: (viewportUpdates) =>
          set((state) => ({
            viewport: { ...state.viewport, ...viewportUpdates },
          })),

        resetViewport: () =>
          set({ viewport: { x: 0, y: 0, zoom: 1 } }),

        zoomIn: () =>
          set((state) => ({
            viewport: {
              ...state.viewport,
              zoom: Math.min(state.viewport.zoom + ZOOM_STEP, MAX_ZOOM),
            },
          })),

        zoomOut: () =>
          set((state) => ({
            viewport: {
              ...state.viewport,
              zoom: Math.max(state.viewport.zoom - ZOOM_STEP, MIN_ZOOM),
            },
          })),

        zoomToFit: () => {
          const state = get();
          if (state.components.length === 0) {
            set({ viewport: { x: 0, y: 0, zoom: 1 } });
            return;
          }

          // Calculate bounding box of all components
          const bounds = state.components.reduce(
            (acc, c) => ({
              minX: Math.min(acc.minX, c.position.x),
              minY: Math.min(acc.minY, c.position.y),
              maxX: Math.max(acc.maxX, c.position.x + c.position.width),
              maxY: Math.max(acc.maxY, c.position.y + c.position.height),
            }),
            { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
          );

          const contentWidth = bounds.maxX - bounds.minX;
          const contentHeight = bounds.maxY - bounds.minY;

          // Assume canvas container is roughly window size (adjust as needed)
          const containerWidth = typeof window !== 'undefined' ? window.innerWidth * 0.7 : 1000;
          const containerHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800;

          const padding = 50;
          const scaleX = (containerWidth - padding * 2) / contentWidth;
          const scaleY = (containerHeight - padding * 2) / contentHeight;
          const zoom = Math.min(Math.max(Math.min(scaleX, scaleY), MIN_ZOOM), MAX_ZOOM);

          set({
            viewport: {
              x: -(bounds.minX * zoom) + padding,
              y: -(bounds.minY * zoom) + padding,
              zoom,
            },
          });
        },

        // Drag state actions
        setDragging: (isDragging) => set({ isDragging }),
        setPanning: (isPanning) => set({ isPanning }),

        // Layout actions
        saveLayout: (name) => {
          const state = get();
          const id = `layout-${Date.now()}`;
          const dimensions = VIEWPORT_DIMENSIONS[state.viewportDevice];

          const layout: CanvasLayout = {
            id,
            collectionId: '', // Can be linked to a collection later
            viewport: state.viewportDevice,
            width: dimensions.width,
            height: dimensions.height,
            components: state.components.map((c) => ({ ...c })),
            grid: { ...state.grid },
            guides: { ...state.guides },
          };

          set((s) => ({
            layouts: [...s.layouts, layout],
            activeLayoutId: id,
          }));

          return id;
        },

        loadLayout: (id) =>
          set((state) => {
            const layout = state.layouts.find((l) => l.id === id);
            if (!layout) return state;

            const maxZ = Math.max(0, ...layout.components.map((c) => c.position.zIndex));

            return {
              components: layout.components.map((c) => ({ ...c })),
              grid: { ...layout.grid },
              guides: { ...layout.guides },
              viewportDevice: layout.viewport,
              activeLayoutId: id,
              maxZIndex: maxZ,
              selection: { selectedIds: [], selectionBox: null },
            };
          }),

        deleteLayout: (id) =>
          set((state) => ({
            layouts: state.layouts.filter((l) => l.id !== id),
            activeLayoutId: state.activeLayoutId === id ? null : state.activeLayoutId,
          })),

        // Canvas actions
        clearCanvas: () =>
          set({
            components: [],
            selection: { selectedIds: [], selectionBox: null },
            maxZIndex: 0,
          }),

        getNextZIndex: () => get().maxZIndex + 1,

        // Position utilities
        snapToGrid: (position) => {
          const state = get();
          if (!state.grid.snap) return position;

          const gridSize = state.grid.size;
          return {
            x: Math.round(position.x / gridSize) * gridSize,
            y: Math.round(position.y / gridSize) * gridSize,
          };
        },

        screenToCanvas: (screenX, screenY) => {
          const { viewport } = get();
          return {
            x: (screenX - viewport.x) / viewport.zoom,
            y: (screenY - viewport.y) / viewport.zoom,
          };
        },

        canvasToScreen: (canvasX, canvasY) => {
          const { viewport } = get();
          return {
            x: canvasX * viewport.zoom + viewport.x,
            y: canvasY * viewport.zoom + viewport.y,
          };
        },
      }),
      {
        name: 'design2prompt-canvas',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          components: state.components,
          grid: state.grid,
          guides: state.guides,
          viewportDevice: state.viewportDevice,
          layouts: state.layouts,
          activeLayoutId: state.activeLayoutId,
          maxZIndex: state.maxZIndex,
        }),
      }
    ),
    { name: 'CanvasStore' }
  )
);
