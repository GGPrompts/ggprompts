'use client';

import { useState, useEffect } from 'react';
import { Collection } from '@/types/collection';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type CreateCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string; tags: string[] }) => void;
  existingTags: string[];
  editingCollection?: Collection | null;
};

export function CreateCollectionDialog({
  open,
  onOpenChange,
  onSubmit,
  existingTags,
  editingCollection,
}: CreateCollectionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const isEditing = !!editingCollection;

  useEffect(() => {
    if (editingCollection) {
      setName(editingCollection.name);
      setDescription(editingCollection.description || '');
      setTags(editingCollection.tags);
    } else {
      setName('');
      setDescription('');
      setTags([]);
    }
    setTagInput('');
  }, [editingCollection, open]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), tags });
    onOpenChange(false);
  };

  const suggestedTags = existingTags.filter(
    (tag) => !tags.includes(tag) && tag.includes(tagInput.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Collection' : 'Create New Collection'}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {isEditing
              ? 'Update your collection details.'
              : 'Organize your components into a new collection.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My Collection"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Components for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button type="button" variant="secondary" onClick={handleAddTag} className="bg-white/10 text-white hover:bg-white/20 border-0">
                Add
              </Button>
            </div>

            {/* Suggested tags */}
            {tagInput && suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {suggestedTags.slice(0, 5).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer border-white/20 text-white/70 hover:bg-white/10"
                    onClick={() => {
                      setTags([...tags, tag]);
                      setTagInput('');
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Selected tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 bg-emerald-500/20 text-emerald-400 border-0">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()} className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50">
            {isEditing ? 'Save Changes' : 'Create Collection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
