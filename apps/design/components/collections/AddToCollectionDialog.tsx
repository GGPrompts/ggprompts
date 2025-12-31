'use client';

import { useState } from 'react';
import { Collection, SavedComponent } from '@/types/collection';
import { ComponentDefinition } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FolderPlus, Check, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

type AddToCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: ComponentDefinition | null;
  customization: Customization;
  collections: Collection[];
  onAddToCollection: (collectionId: string, component: SavedComponent) => void;
  onCreateCollection: (pendingComponent: SavedComponent) => void;
};

export function AddToCollectionDialog({
  open,
  onOpenChange,
  component,
  customization,
  collections,
  onAddToCollection,
  onCreateCollection,
}: AddToCollectionDialogProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!selectedCollectionId || !component) return;

    const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
    const nextOrder = selectedCollection?.components.length ?? 0;

    const savedComponent: SavedComponent = {
      id: crypto.randomUUID(),
      componentId: component.id,
      customization: { ...customization },
      notes: notes.trim() || undefined,
      order: nextOrder,
    };

    onAddToCollection(selectedCollectionId, savedComponent);
    setSelectedCollectionId(null);
    setNotes('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedCollectionId(null);
    setNotes('');
    onOpenChange(false);
  };

  if (!component) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
          <DialogDescription className="text-white/60">
            Add this customized component to one of your collections.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Component Preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${customization.primaryColor}40, ${customization.secondaryColor}40)`,
              }}
            >
              <Package className="w-6 h-6" style={{ color: customization.primaryColor }} />
            </div>
            <div>
              <h4 className="font-semibold">{component.name}</h4>
              <p className="text-sm text-white/60">
                {customization.primaryColor} • {customization.animation} animation
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Collection Selection */}
          <div className="space-y-2">
            <Label>Select Collection</Label>
            {collections.length > 0 ? (
              <ScrollArea className="h-48 rounded-md border border-white/10">
                <div className="p-2 space-y-1">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollectionId(collection.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors',
                        selectedCollectionId === collection.id
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'hover:bg-white/5'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          selectedCollectionId === collection.id
                            ? 'border-emerald-400 bg-emerald-400'
                            : 'border-white/30'
                        )}
                      >
                        {selectedCollectionId === collection.id && (
                          <Check className="w-3 h-3 text-zinc-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{collection.name}</div>
                        <div
                          className={cn(
                            'text-sm',
                            selectedCollectionId === collection.id
                              ? 'text-emerald-400/70'
                              : 'text-white/50'
                          )}
                        >
                          {collection.components.length} component
                          {collection.components.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-48 rounded-md border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/60 mb-2">No collections yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const pendingComponent: SavedComponent = {
                        id: crypto.randomUUID(),
                        componentId: component.id,
                        customization: { ...customization },
                        notes: notes.trim() || undefined,
                        order: 0,
                      };
                      onCreateCollection(pendingComponent);
                    }}
                    className="border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create Collection
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Create New Collection Button */}
          {collections.length > 0 && (
            <Button
              variant="outline"
              className="w-full border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10"
              onClick={() => {
                const pendingComponent: SavedComponent = {
                  id: crypto.randomUUID(),
                  componentId: component.id,
                  customization: { ...customization },
                  notes: notes.trim() || undefined,
                  order: 0,
                };
                onCreateCollection(pendingComponent);
              }}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create New Collection
            </Button>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this component..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedCollectionId} className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50">
            Save to Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
