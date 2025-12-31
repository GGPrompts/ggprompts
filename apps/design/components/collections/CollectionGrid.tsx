'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collection } from '@/types/collection';
import { CollectionCard } from './CollectionCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FolderPlus, Tag, X } from 'lucide-react';

type CollectionGridProps = {
  collections: Collection[];
  allTags: string[];
  onCreateNew: () => void;
  onEdit: (collection: Collection) => void;
  onDuplicate: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
};

export function CollectionGrid({
  collections,
  allTags,
  onCreateNew,
  onEdit,
  onDuplicate,
  onDelete,
}: CollectionGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      searchQuery === '' ||
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => collection.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <Button onClick={onCreateNew} className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
          <FolderPlus className="w-4 h-4" />
          New Collection
        </Button>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-white/40" />
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {(searchQuery || selectedTags.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Collections Grid */}
      {filteredCollections.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((collection) => (
              <motion.div
                key={collection.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <CollectionCard
                  collection={collection}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          hasFilters={searchQuery !== '' || selectedTags.length > 0}
          onCreateNew={onCreateNew}
          onClearFilters={clearFilters}
        />
      )}
    </div>
  );
}

type EmptyStateProps = {
  hasFilters: boolean;
  onCreateNew: () => void;
  onClearFilters: () => void;
};

function EmptyState({ hasFilters, onCreateNew, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
        <FolderPlus className="w-10 h-10 text-white/40" />
      </div>

      {hasFilters ? (
        <>
          <h3 className="text-xl font-semibold mb-2">No collections found</h3>
          <p className="text-white/60 text-center mb-6 max-w-md">
            No collections match your current filters. Try adjusting your search or
            clearing the filters.
          </p>
          <Button variant="outline" onClick={onClearFilters} className="border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10">
            Clear Filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">Create your first collection</h3>
          <p className="text-white/60 text-center mb-6 max-w-md">
            Collections help you organize customized components by project, theme, or
            purpose. Start by creating your first collection.
          </p>
          <Button onClick={onCreateNew} className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
            <FolderPlus className="w-4 h-4" />
            Create Collection
          </Button>
        </>
      )}
    </motion.div>
  );
}
