'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  PanelLeftClose,
  PanelLeft,
  Download,
  Save,
  Layers,
  Folder,
  Library,
  FolderOpen,
} from 'lucide-react';
import { Canvas, ComponentLibrarySidebar, CollectionsSidebar } from '@/components/canvas';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { useCollectionStore } from '@/lib/stores/collection-store';
import { cn } from '@/lib/utils';

type SidebarTab = 'library' | 'collections';

export default function CanvasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('library');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');

  const { saveLayout, layouts, loadLayout, deleteLayout, components } = useCanvasStore();
  const { collections } = useCollectionStore();

  const totalSavedComponents = collections.reduce((acc, c) => acc + c.components.length, 0);

  const handleSaveLayout = () => {
    if (!layoutName.trim()) return;
    saveLayout(layoutName);
    setLayoutName('');
    setShowSaveDialog(false);
  };

  const handleExport = () => {
    // Generate export data
    const exportData = {
      components: components.map((c) => ({
        id: c.componentId,
        name: c.componentId,
        position: c.position,
        customization: c.customization,
      })),
      timestamp: new Date().toISOString(),
    };

    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-layout-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-semibold">Canvas Mode</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </button>

          {/* Saved layouts dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Saved layouts"
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm">Layouts</span>
              {layouts.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded">
                  {layouts.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1 w-64 bg-zinc-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                {layouts.length === 0 ? (
                  <p className="text-xs text-white/40 text-center py-4">
                    No saved layouts yet
                  </p>
                ) : (
                  <div className="space-y-1">
                    {layouts.map((layout) => (
                      <div
                        key={layout.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                      >
                        <button
                          onClick={() => loadLayout(layout.id)}
                          className="flex-1 text-left text-sm text-white/80 hover:text-white"
                        >
                          {layout.id.replace('layout-', 'Layout ')}
                        </button>
                        <button
                          onClick={() => deleteLayout(layout.id)}
                          className="p-1 text-white/40 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={() => setShowSaveDialog(true)}
            disabled={components.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save Layout</span>
          </button>

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={components.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with tabs */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex flex-col bg-zinc-900/95 border-r border-white/10"
            >
              {/* Tab switcher */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setSidebarTab('library')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                    sidebarTab === 'library'
                      ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Library className="w-4 h-4" />
                  <span>Library</span>
                </button>
                <button
                  onClick={() => setSidebarTab('collections')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    sidebarTab === 'collections'
                      ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Saved</span>
                  {totalSavedComponents > 0 && (
                    <span className="absolute top-2 right-3 px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full">
                      {totalSavedComponents}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-hidden">
                {sidebarTab === 'library' ? (
                  <ComponentLibrarySidebar className="border-r-0" />
                ) : (
                  <CollectionsSidebar className="border-r-0" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas */}
        <div className="flex-1">
          <Canvas onExport={handleExport} onSaveLayout={() => setShowSaveDialog(true)} />
        </div>
      </div>

      {/* Save layout dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Save Layout</h2>
              <p className="text-white/60 text-sm mb-4">
                Give your layout a name to save it for later use.
              </p>

              <input
                type="text"
                placeholder="Layout name..."
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveLayout()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 mb-4"
                autoFocus
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLayout}
                  disabled={!layoutName.trim()}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Layout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
