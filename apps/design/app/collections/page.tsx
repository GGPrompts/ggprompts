'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollectionStore } from '@/lib/stores/collection-store';
import { Collection } from '@/types/collection';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { CreateCollectionDialog } from '@/components/collections/CreateCollectionDialog';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Sparkles, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CollectionsPage() {
  const { toast } = useToast();
  const {
    collections,
    addCollection,
    updateCollection,
    removeCollection,
    duplicateCollection,
    getAllTags,
  } = useCollectionStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  const allTags = getAllTags();

  const handleCreateCollection = (data: {
    name: string;
    description: string;
    tags: string[];
  }) => {
    if (editingCollection) {
      updateCollection(editingCollection.id, data);
      toast({
        title: 'Collection updated',
        description: `"${data.name}" has been updated.`,
      });
      setEditingCollection(null);
    } else {
      const newCollection: Collection = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        tags: data.tags,
        components: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addCollection(newCollection);
      toast({
        title: 'Collection created',
        description: `"${data.name}" has been created.`,
      });
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setCreateDialogOpen(true);
  };

  const handleDuplicate = (collection: Collection) => {
    const newCollection = duplicateCollection(collection.id);
    if (newCollection) {
      toast({
        title: 'Collection duplicated',
        description: `"${newCollection.name}" has been created.`,
      });
    }
  };

  const handleDelete = (collection: Collection) => {
    setDeletingCollection(collection);
  };

  const confirmDelete = () => {
    if (deletingCollection) {
      removeCollection(deletingCollection.id);
      toast({
        title: 'Collection deleted',
        description: `"${deletingCollection.name}" has been deleted.`,
      });
      setDeletingCollection(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-white/10 flex items-center justify-between px-3 md:px-4 bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/10 px-2 md:px-3">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm md:text-base">design2prompt</span>
            <span className="text-white/60 hidden md:inline">/ Collections</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/studio">
            <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10 px-2 md:px-3">
              <Sparkles className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">Open Studio</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold">Collections</h1>
              <p className="text-white/60 text-sm md:text-base truncate">
                Organize your customized components
              </p>
            </div>
          </div>

          {/* Collections Grid */}
          <CollectionGrid
            collections={collections}
            allTags={allTags}
            onCreateNew={() => {
              setEditingCollection(null);
              setCreateDialogOpen(true);
            }}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </motion.div>
      </main>

      {/* Create/Edit Dialog */}
      <CreateCollectionDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditingCollection(null);
        }}
        onSubmit={handleCreateCollection}
        existingTags={allTags}
        editingCollection={editingCollection}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCollection}
        onOpenChange={(open) => !open && setDeletingCollection(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCollection?.name}"? This will
              permanently remove the collection and all its saved components. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
