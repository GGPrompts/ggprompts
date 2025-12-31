'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectionStore } from '@/lib/stores/collection-store';
import { Collection, SavedComponent } from '@/types/collection';
import { getComponentById } from '@/lib/component-registry';
import { SavedComponentCard } from '@/components/collections/SavedComponentCard';
import { CreateCollectionDialog } from '@/components/collections/CreateCollectionDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  ArrowLeft,
  Sparkles,
  Edit2,
  Package,
  Plus,
  Download,
  FileText,
  Code,
  FileJson,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { generateCollectionPrompt, exportDesignTokens } from '@/lib/ai-targets/claude';

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const {
    getCollection,
    updateCollection,
    removeComponentFromCollection,
    getAllTags,
  } = useCollectionStore();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingComponent, setDeletingComponent] = useState<SavedComponent | null>(null);

  const collectionId = params.id as string;

  useEffect(() => {
    const col = getCollection(collectionId);
    if (col) {
      setCollection(col);
    }
  }, [collectionId, getCollection]);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = useCollectionStore.subscribe((state) => {
      const updated = state.collections.find((c) => c.id === collectionId);
      if (updated) {
        setCollection(updated);
      }
    });
    return unsubscribe;
  }, [collectionId]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Collection not found</h2>
          <p className="text-white/60 mb-4">
            The collection you're looking for doesn't exist.
          </p>
          <Link href="/collections">
            <Button>Back to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEditCollection = (data: {
    name: string;
    description: string;
    tags: string[];
  }) => {
    updateCollection(collection.id, data);
    toast({
      title: 'Collection updated',
      description: 'Your changes have been saved.',
    });
  };

  const handleViewInStudio = (savedComponent: SavedComponent) => {
    const componentDef = getComponentById(savedComponent.componentId);
    if (componentDef) {
      const customizationParam = encodeURIComponent(
        JSON.stringify(savedComponent.customization)
      );
      router.push(
        `/studio?component=${savedComponent.componentId}&customization=${customizationParam}`
      );
    }
  };

  const handleCopySettings = async (savedComponent: SavedComponent) => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(savedComponent.customization, null, 2)
      );
      toast({
        title: 'Settings copied',
        description: 'Component settings copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy settings to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComponent = (savedComponent: SavedComponent) => {
    setDeletingComponent(savedComponent);
  };

  const confirmDeleteComponent = () => {
    if (deletingComponent) {
      removeComponentFromCollection(collection.id, deletingComponent.id);
      toast({
        title: 'Component removed',
        description: 'The component has been removed from this collection.',
      });
      setDeletingComponent(null);
    }
  };

  const handleExportPrompt = async () => {
    try {
      const prompt = generateCollectionPrompt(collection);
      await navigator.clipboard.writeText(prompt);
      toast({
        title: 'Prompt copied',
        description: 'Collection prompt copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to copy prompt to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleExportTokens = async () => {
    try {
      const tokens = exportDesignTokens(collection);
      await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
      toast({
        title: 'Tokens copied',
        description: 'Design tokens copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to copy tokens to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPrompt = () => {
    const prompt = generateCollectionPrompt(collection);
    const blob = new Blob([prompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collection.name.toLowerCase().replace(/\s+/g, '-')}-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Prompt downloaded',
      description: 'Collection prompt saved as markdown file.',
    });
  };

  const sortedComponents = [...collection.components].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-white/10 flex items-center justify-between px-3 md:px-4 bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/collections">
            <Button variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white hover:bg-white/10 px-2 md:px-3">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Collections</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm md:text-base hidden sm:inline">design2prompt</span>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10 px-2 md:px-3">
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPrompt}>
                <FileText className="w-4 h-4 mr-2" />
                Copy as Prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPrompt}>
                <Code className="w-4 h-4 mr-2" />
                Download as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportTokens}>
                <FileJson className="w-4 h-4 mr-2" />
                Export Design Tokens
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/studio">
            <Button size="sm" className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600 px-2 md:px-3">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Component</span>
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
          {/* Collection Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 truncate">{collection.name}</h1>
                {collection.description && (
                  <p className="text-white/60 text-sm md:text-base line-clamp-2">{collection.description}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
                className="gap-2 border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10 self-start flex-shrink-0"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-white/60">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {collection.components.length} component
                {collection.components.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated {formatDate(collection.updatedAt)}
              </span>
            </div>

            {/* Tags */}
            {collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                {collection.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Components Grid */}
          {sortedComponents.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {sortedComponents.map((savedComponent) => (
                  <motion.div
                    key={savedComponent.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <SavedComponentCard
                      savedComponent={savedComponent}
                      onView={handleViewInStudio}
                      onCopySettings={handleCopySettings}
                      onDelete={handleDeleteComponent}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState />
          )}
        </motion.div>
      </main>

      {/* Edit Collection Dialog */}
      <CreateCollectionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditCollection}
        existingTags={getAllTags()}
        editingCollection={collection}
      />

      {/* Delete Component Confirmation */}
      <AlertDialog
        open={!!deletingComponent}
        onOpenChange={(open) => !open && setDeletingComponent(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Component</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this component from the collection? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteComponent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 border border-white/10 rounded-lg bg-white/5"
    >
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-white/40" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No components yet</h3>
      <p className="text-white/60 text-center mb-6 max-w-md">
        Start adding components to this collection from the Studio. Customize a component
        and save it here to build your design system.
      </p>
      <Link href="/studio">
        <Button className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
          Add Component from Studio
        </Button>
      </Link>
    </motion.div>
  );
}
