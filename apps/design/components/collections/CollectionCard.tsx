'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Collection } from '@/types/collection';
import { getComponentById } from '@/lib/component-registry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Package, Clock, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';

type CollectionCardProps = {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDuplicate: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

function CollectionThumbnail({ collection }: { collection: Collection }) {
  if (collection.components.length === 0) {
    return (
      <div className="w-full h-32 rounded-t-lg bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
        <Package className="w-10 h-10 text-white/30" />
      </div>
    );
  }

  const firstComponent = collection.components[0];
  const componentDef = getComponentById(firstComponent.componentId);

  return (
    <div
      className="w-full h-32 rounded-t-lg flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${firstComponent.customization.primaryColor}20, ${firstComponent.customization.secondaryColor}20)`,
      }}
    >
      <div className="flex gap-1 scale-75">
        {collection.components.slice(0, 3).map((comp, index) => (
          <div
            key={comp.id}
            className="w-8 h-8 rounded-md"
            style={{
              backgroundColor: `${comp.customization.primaryColor}40`,
              border: `1px solid ${comp.customization.primaryColor}60`,
              transform: `translateX(${-index * 6}px)`,
            }}
          />
        ))}
        {collection.components.length > 3 && (
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-xs font-medium">
            +{collection.components.length - 3}
          </div>
        )}
      </div>
    </div>
  );
}

export function CollectionCard({
  collection,
  onEdit,
  onDuplicate,
  onDelete,
}: CollectionCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/collections/${collection.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div
        onClick={handleCardClick}
        className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
      >
        <CollectionThumbnail collection={collection} />

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold truncate">{collection.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(collection);
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(collection);
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(collection);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {collection.description && (
            <p className="text-sm text-white/60 line-clamp-2 mb-3">
              {collection.description}
            </p>
          )}

          {collection.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {collection.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {collection.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{collection.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {collection.components.length} component
              {collection.components.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(collection.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
