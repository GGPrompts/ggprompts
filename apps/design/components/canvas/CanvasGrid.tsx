'use client';

import { useCanvasStore, VIEWPORT_DIMENSIONS } from '@/lib/stores/canvas-store';

type CanvasGridProps = {
  className?: string;
};

export function CanvasGrid({ className = '' }: CanvasGridProps) {
  const grid = useCanvasStore((state) => state.grid);
  const viewport = useCanvasStore((state) => state.viewport);
  const viewportDevice = useCanvasStore((state) => state.viewportDevice);

  if (!grid.show) return null;

  const dimensions = VIEWPORT_DIMENSIONS[viewportDevice];
  const gridSize = grid.size;

  // Create SVG pattern for the grid
  const patternId = `canvas-grid-pattern-${gridSize}`;

  return (
    <svg
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    >
      <defs>
        {/* Small grid pattern */}
        <pattern
          id={patternId}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white/10"
          />
        </pattern>
        {/* Large grid pattern (every 5 cells) */}
        <pattern
          id={`${patternId}-large`}
          width={gridSize * 5}
          height={gridSize * 5}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={gridSize * 5}
            height={gridSize * 5}
            fill={`url(#${patternId})`}
          />
          <path
            d={`M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/20"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId}-large)`}
      />
      {/* Center crosshair guides */}
      <line
        x1={dimensions.width / 2}
        y1={0}
        x2={dimensions.width / 2}
        y2={dimensions.height}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="text-emerald-500/30"
      />
      <line
        x1={0}
        y1={dimensions.height / 2}
        x2={dimensions.width}
        y2={dimensions.height / 2}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="text-emerald-500/30"
      />
    </svg>
  );
}
