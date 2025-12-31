'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ComponentLibrary } from '@/components/studio/ComponentLibrary';
import { CustomizationPanel } from '@/components/studio/CustomizationPanel';
import { LivePreview } from '@/components/studio/LivePreview';
import { ExportMenu } from '@/components/studio/ExportMenu';
import { AddToCollectionDialog } from '@/components/collections/AddToCollectionDialog';
import { CreateCollectionDialog } from '@/components/collections/CreateCollectionDialog';
import { ComponentDefinition, getComponentById } from '@/lib/component-registry';
import { defaultCustomization } from '@/types/customization';
import { Collection, SavedComponent } from '@/types/collection';
import { useCollectionStore } from '@/lib/stores/collection-store';
import { useCustomizationStore } from '@/lib/stores/customization-store';
import { Button } from '@/components/ui/button';
import { MobileDrawer, MobileDrawerHeader, MobileDrawerContent } from '@/components/ui/mobile-drawer';
import { useIsMobile, useIsTablet } from '@/lib/hooks';
import {
  ArrowLeft,
  Sparkles,
  FolderPlus,
  FolderOpen,
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function StudioPage() {
  return (
    <Suspense fallback={<StudioLoading />}>
      <StudioContent />
    </Suspense>
  );
}

function StudioLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
        <span className="text-lg font-medium text-white">Loading Studio...</span>
      </div>
    </div>
  );
}

function StudioContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const {
    collections,
    addCollection,
    addComponentToCollection,
    getAllTags,
  } = useCollectionStore();

  // Use Zustand store for customization (persists theme across component switches)
  const {
    selectedComponent,
    customization,
    setComponent,
    updateCustomization,
    resetCustomization,
  } = useCustomizationStore();

  const [showExport, setShowExport] = useState(false);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);
  // Track pending component to add after collection creation
  const [pendingComponentForCollection, setPendingComponentForCollection] = useState<SavedComponent | null>(null);

  // Mobile responsive state
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close sidebars on mobile/tablet
  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
      setRightSidebarOpen(false);
    } else if (isTablet) {
      setRightSidebarOpen(false);
      setLeftSidebarOpen(true);
    } else {
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  // Handle URL params for loading component from collection
  useEffect(() => {
    const componentId = searchParams.get('component');
    const customizationParam = searchParams.get('customization');

    if (componentId) {
      const component = getComponentById(componentId);
      if (component) {
        // Set the component (this preserves global theme settings)
        setComponent(component);

        // If there's a full customization in URL params, apply it (overrides theme)
        if (customizationParam) {
          try {
            const parsedCustomization = JSON.parse(decodeURIComponent(customizationParam));
            updateCustomization(parsedCustomization);
          } catch {
            // Invalid JSON, just use component defaults (already applied by setComponent)
          }
        }
      }
    }
  }, [searchParams, setComponent, updateCustomization]);

  // Use store's setComponent - preserves global theme settings
  const handleSelectComponent = (component: ComponentDefinition) => {
    setComponent(component);
  };

  // Use store's updateCustomization
  const handleUpdateCustomization = updateCustomization;

  // Use store's resetCustomization (keeps globals, resets component-specific)
  const handleResetCustomization = resetCustomization;

  const handleAddToCollection = (collectionId: string, component: SavedComponent) => {
    addComponentToCollection(collectionId, component);
    toast({
      title: 'Component saved',
      description: 'Component has been added to your collection.',
    });
  };

  const handleCreateCollection = (data: {
    name: string;
    description: string;
    tags: string[];
  }) => {
    const newCollectionId = crypto.randomUUID();
    const newCollection: Collection = {
      id: newCollectionId,
      name: data.name,
      description: data.description,
      tags: data.tags,
      components: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addCollection(newCollection);
    setCreateCollectionOpen(false);

    // If there's a pending component, add it to the newly created collection
    if (pendingComponentForCollection) {
      addComponentToCollection(newCollectionId, pendingComponentForCollection);
      setPendingComponentForCollection(null);
      toast({
        title: 'Collection created & component saved',
        description: `"${data.name}" has been created with your component.`,
      });
    } else {
      toast({
        title: 'Collection created',
        description: `"${data.name}" has been created. You can now save components to it.`,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-3 md:px-4 bg-zinc-900/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile menu toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}

          {/* Left sidebar toggle (tablet/desktop) */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="text-white/80 hover:text-white hover:bg-white/10"
              title={leftSidebarOpen ? 'Hide components' : 'Show components'}
            >
              {leftSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </Button>
          )}

          <Link href="/" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm md:text-base">design2prompt</span>
            <span className="text-white/60 hidden md:inline">/ Studio</span>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/collections">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
              <FolderOpen className="w-4 h-4" />
              Collections
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddToCollectionOpen(true)}
            disabled={!selectedComponent}
            className="gap-2 border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:text-white/50"
          >
            <FolderPlus className="w-4 h-4" />
            Save to Collection
          </Button>
          <Button
            onClick={() => setShowExport(!showExport)}
            className={showExport
              ? "gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
              : "gap-2 border border-white/20 bg-transparent text-white hover:text-white hover:bg-white/10"
            }
          >
            <Sparkles className="w-4 h-4" />
            {showExport ? 'Hide Export' : 'Generate Prompt'}
          </Button>
          {/* Right sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="text-white/70 hover:text-white hover:bg-white/10"
            title={rightSidebarOpen ? 'Hide customization' : 'Show customization'}
          >
            {rightSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile/Tablet actions */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowExport(!showExport)}
            className={showExport
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-white/70 hover:text-white hover:bg-white/10"
            }
          >
            <Sparkles className="w-5 h-5" />
          </Button>
          {/* Right sidebar toggle (customization) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="text-white/70 hover:text-white hover:bg-white/10"
            title={rightSidebarOpen ? 'Hide customization' : 'Show customization'}
          >
            {rightSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Left Drawer - Component Library */}
        {isMobile && (
          <MobileDrawer
            isOpen={leftSidebarOpen}
            onClose={() => setLeftSidebarOpen(false)}
            side="left"
            width="w-72"
          >
            <MobileDrawerHeader>
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">Components</span>
            </MobileDrawerHeader>
            <MobileDrawerContent>
              <ComponentLibrary
                selectedComponent={selectedComponent}
                onSelectComponent={(component) => {
                  handleSelectComponent(component);
                  setLeftSidebarOpen(false);
                }}
              />
            </MobileDrawerContent>
          </MobileDrawer>
        )}

        {/* Mobile Right Drawer - Customization Panel */}
        {isMobile && (
          <MobileDrawer
            isOpen={rightSidebarOpen}
            onClose={() => setRightSidebarOpen(false)}
            side="right"
            width="w-80"
          >
            <MobileDrawerContent>
              <CustomizationPanel
                customization={customization}
                selectedComponent={selectedComponent}
                onUpdateCustomization={handleUpdateCustomization}
              />
            </MobileDrawerContent>
          </MobileDrawer>
        )}

        {/* Mobile Menu Drawer - Navigation & Actions */}
        {isMobile && (
          <MobileDrawer
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            side="left"
            width="w-64"
          >
            <MobileDrawerHeader>
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">Menu</span>
            </MobileDrawerHeader>
            <MobileDrawerContent className="p-4 space-y-2">
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full justify-start gap-2 text-white/70 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/collections" className="block">
                <Button variant="ghost" className="w-full justify-start gap-2 text-white/70 hover:text-white">
                  <FolderOpen className="w-4 h-4" />
                  Collections
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-white/70 hover:text-white"
                onClick={() => {
                  setLeftSidebarOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <PanelLeft className="w-4 h-4" />
                Browse Components
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-white/70 hover:text-white"
                onClick={() => {
                  setAddToCollectionOpen(true);
                  setMobileMenuOpen(false);
                }}
                disabled={!selectedComponent}
              >
                <FolderPlus className="w-4 h-4" />
                Save to Collection
              </Button>
            </MobileDrawerContent>
          </MobileDrawer>
        )}

        {/* Desktop/Tablet Left Sidebar - Component Library */}
        {!isMobile && (
          <AnimatePresence>
            {leftSidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 288, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-72 h-full">
                  <ComponentLibrary
                    selectedComponent={selectedComponent}
                    onSelectComponent={handleSelectComponent}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}

        {/* Center - Live Preview */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className={showExport ? 'flex-1 min-h-0' : 'h-full'}>
            <LivePreview
              component={selectedComponent}
              customization={customization}
              onResetCustomization={handleResetCustomization}
            />
          </div>

          {/* Export Panel (shown when toggled) */}
          <AnimatePresence>
            {showExport && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isMobile ? 200 : 320, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <ExportMenu
                  component={selectedComponent}
                  customization={customization}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Desktop/Tablet Right Sidebar - Customization Panel */}
        {!isMobile && (
          <AnimatePresence>
            {rightSidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-80 h-full">
                  <CustomizationPanel
                    customization={customization}
                    selectedComponent={selectedComponent}
                    onUpdateCustomization={handleUpdateCustomization}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Add to Collection Dialog */}
      <AddToCollectionDialog
        open={addToCollectionOpen}
        onOpenChange={setAddToCollectionOpen}
        component={selectedComponent}
        customization={customization}
        collections={collections}
        onAddToCollection={handleAddToCollection}
        onCreateCollection={(pendingComponent) => {
          setPendingComponentForCollection(pendingComponent);
          setAddToCollectionOpen(false);
          setCreateCollectionOpen(true);
        }}
      />

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={createCollectionOpen}
        onOpenChange={setCreateCollectionOpen}
        onSubmit={handleCreateCollection}
        existingTags={getAllTags()}
      />
    </div>
  );
}
