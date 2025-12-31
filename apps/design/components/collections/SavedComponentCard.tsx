'use client';

import { motion } from 'framer-motion';
import { SavedComponent } from '@/types/collection';
import { getComponentById } from '@/lib/component-registry';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Package, MoreVertical, Eye, Copy, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type SavedComponentCardProps = {
  savedComponent: SavedComponent;
  onView: (savedComponent: SavedComponent) => void;
  onCopySettings: (savedComponent: SavedComponent) => void;
  onDelete: (savedComponent: SavedComponent) => void;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
};

export function SavedComponentCard({
  savedComponent,
  onView,
  onCopySettings,
  onDelete,
  isDragging,
  dragHandleProps,
}: SavedComponentCardProps) {
  const componentDef = getComponentById(savedComponent.componentId);

  if (!componentDef) {
    return (
      <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
        <p className="text-sm text-destructive">
          Component "{savedComponent.componentId}" not found
        </p>
      </div>
    );
  }

  const { customization } = savedComponent;

  return (
    <motion.div
      layout
      className={cn(
        'group relative bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden transition-all',
        isDragging && 'shadow-lg ring-2 ring-emerald-500'
      )}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-white/40" />
        </div>
      )}

      {/* Preview Thumbnail */}
      <div
        className="h-24 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${customization.primaryColor}30, ${customization.secondaryColor}30)`,
        }}
      >
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: `${customization.primaryColor}40`,
            border: `2px solid ${customization.primaryColor}60`,
            borderRadius: `${customization.borderRadius}px`,
          }}
        >
          <Package className="w-8 h-8" style={{ color: customization.primaryColor }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm truncate">{componentDef.name}</h4>
            <p className="text-xs text-white/50 truncate">
              {componentDef.category}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(savedComponent)}>
                <Eye className="w-4 h-4 mr-2" />
                View in Studio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopySettings(savedComponent)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(savedComponent)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Color Preview */}
        <div className="flex gap-1">
          <div
            className="w-4 h-4 rounded-full border border-white/20"
            style={{ backgroundColor: customization.primaryColor }}
            title={`Primary: ${customization.primaryColor}`}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/20"
            style={{ backgroundColor: customization.secondaryColor }}
            title={`Secondary: ${customization.secondaryColor}`}
          />
          <div
            className="w-4 h-4 rounded-full border border-white/20"
            style={{ backgroundColor: customization.backgroundColor }}
            title={`Background: ${customization.backgroundColor}`}
          />
        </div>

        {/* Notes */}
        {savedComponent.notes && (
          <p className="text-xs text-white/50 mt-2 line-clamp-2">
            {savedComponent.notes}
          </p>
        )}
      </div>
    </motion.div>
  );
}
