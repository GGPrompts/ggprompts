'use client';

import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Magnet,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Save,
  Trash2,
  Download,
} from 'lucide-react';
import { useCanvasStore, ViewportDevice, VIEWPORT_DIMENSIONS } from '@/lib/stores/canvas-store';
import { cn } from '@/lib/utils';

type CanvasToolbarProps = {
  onExport?: () => void;
  onSaveLayout?: () => void;
};

const viewportIcons: Record<ViewportDevice, React.ReactNode> = {
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
  desktop: <Monitor className="w-4 h-4" />,
};

export function CanvasToolbar({ onExport, onSaveLayout }: CanvasToolbarProps) {
  const {
    viewport,
    viewportDevice,
    grid,
    components,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetViewport,
    setGrid,
    setViewportDevice,
    clearCanvas,
  } = useCanvasStore();

  const zoomPercentage = Math.round(viewport.zoom * 100);
  const dimensions = VIEWPORT_DIMENSIONS[viewportDevice];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 p-2 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl"
    >
      {/* Viewport device selector */}
      <div className="flex items-center gap-1 border-r border-white/10 pr-2">
        {(['mobile', 'tablet', 'desktop'] as ViewportDevice[]).map((device) => (
          <button
            key={device}
            onClick={() => setViewportDevice(device)}
            className={cn(
              'p-2 rounded-lg transition-all',
              viewportDevice === device
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            )}
            title={`${device} (${VIEWPORT_DIMENSIONS[device].width}x${VIEWPORT_DIMENSIONS[device].height})`}
          >
            {viewportIcons[device]}
          </button>
        ))}
        <span className="text-xs text-white/40 ml-1">
          {dimensions.width}x{dimensions.height}
        </span>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 border-r border-white/10 pr-2">
        <button
          onClick={zoomOut}
          disabled={viewport.zoom <= 0.25}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-16 text-center">
          <span className="text-sm font-mono text-white/80">{zoomPercentage}%</span>
        </div>

        <button
          onClick={zoomIn}
          disabled={viewport.zoom >= 2}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={zoomToFit}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Zoom to fit"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={resetViewport}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Reset viewport"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid controls */}
      <div className="flex items-center gap-1 border-r border-white/10 pr-2">
        <button
          onClick={() => setGrid({ show: !grid.show })}
          className={cn(
            'p-2 rounded-lg transition-all',
            grid.show
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
          title={grid.show ? 'Hide grid' : 'Show grid'}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setGrid({ snap: !grid.snap })}
          className={cn(
            'p-2 rounded-lg transition-all',
            grid.snap
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          )}
          title={grid.snap ? 'Disable snap to grid' : 'Enable snap to grid'}
        >
          <Magnet className="w-4 h-4" />
        </button>

        {/* Grid size selector */}
        <select
          value={grid.size}
          onChange={(e) => setGrid({ size: Number(e.target.value) })}
          className="bg-transparent text-white/60 text-xs px-1 py-1 rounded border border-white/10 focus:outline-none focus:border-emerald-500"
          title="Grid size"
        >
          <option value="10" className="bg-zinc-900">10px</option>
          <option value="20" className="bg-zinc-900">20px</option>
          <option value="40" className="bg-zinc-900">40px</option>
          <option value="50" className="bg-zinc-900">50px</option>
        </select>
      </div>

      {/* Canvas actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSaveLayout}
          disabled={components.length === 0}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Save layout"
        >
          <Save className="w-4 h-4" />
        </button>

        <button
          onClick={onExport}
          disabled={components.length === 0}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Export layout"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={clearCanvas}
          disabled={components.length === 0}
          className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Clear canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Component count */}
      <div className="ml-2 px-2 py-1 bg-white/5 rounded-lg">
        <span className="text-xs text-white/50">
          {components.length} component{components.length !== 1 ? 's' : ''}
        </span>
      </div>
    </motion.div>
  );
}
