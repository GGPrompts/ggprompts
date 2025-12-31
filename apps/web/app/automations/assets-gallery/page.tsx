'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Images,
  Search,
  Filter,
  Trash2,
  Edit3,
  FolderInput,
  FileDown,
  CheckSquare,
  Square,
  X,
  Code2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  GitBranch,
  Music,
  Video,
  Upload,
  Eye,
  MoreVertical,
} from 'lucide-react'
import { Button, Card, Badge } from '@ggprompts/ui'

// Asset types
interface Asset {
  id: string
  name: string
  type: 'image' | 'diagram' | 'audio' | 'video'
  source: 'dalle' | 'midjourney' | 'mermaid' | 'sora' | 'upload'
  path: string
  thumbnail?: string
  createdAt: string
  metadata?: {
    prompt?: string
    dimensions?: string
    duration?: number
  }
}

// Mock assets for demo
const MOCK_ASSETS: Asset[] = [
  {
    id: 'asset-1',
    name: 'Hero Background',
    type: 'image',
    source: 'dalle',
    path: '.prompts/AI_Images/hero-bg.png',
    createdAt: '2024-12-27T10:00:00Z',
    metadata: { prompt: 'Abstract tech gradient background', dimensions: '1920x1080' },
  },
  {
    id: 'asset-2',
    name: 'Auth Flow Diagram',
    type: 'diagram',
    source: 'mermaid',
    path: '.prompts/AI_Diagrams/auth-flow.svg',
    createdAt: '2024-12-26T14:30:00Z',
    metadata: { prompt: 'OAuth authentication sequence diagram' },
  },
  {
    id: 'asset-3',
    name: 'Product Demo Video',
    type: 'video',
    source: 'sora',
    path: '.prompts/AI_Videos/demo.mp4',
    createdAt: '2024-12-25T09:15:00Z',
    metadata: { prompt: 'Product walkthrough animation', duration: 45 },
  },
  {
    id: 'asset-4',
    name: 'Logo Variant',
    type: 'image',
    source: 'midjourney',
    path: '.prompts/AI_Images/logo-v2.png',
    createdAt: '2024-12-24T16:00:00Z',
    metadata: { prompt: 'Minimalist tech logo', dimensions: '512x512' },
  },
  {
    id: 'asset-5',
    name: 'Notification Sound',
    type: 'audio',
    source: 'upload',
    path: '.prompts/audio/notification.mp3',
    createdAt: '2024-12-23T11:00:00Z',
    metadata: { duration: 2 },
  },
  {
    id: 'asset-6',
    name: 'System Architecture',
    type: 'diagram',
    source: 'mermaid',
    path: '.prompts/AI_Diagrams/system-arch.svg',
    createdAt: '2024-12-22T08:45:00Z',
    metadata: { prompt: 'Microservices architecture diagram' },
  },
]

// Filter options
const TYPE_FILTERS = [
  { value: 'all', label: 'All Types', icon: Filter },
  { value: 'image', label: 'Images', icon: ImageIcon },
  { value: 'diagram', label: 'Diagrams', icon: GitBranch },
  { value: 'audio', label: 'Audio', icon: Music },
  { value: 'video', label: 'Video', icon: Video },
]

const SOURCE_FILTERS = [
  { value: 'all', label: 'All Sources' },
  { value: 'dalle', label: 'DALL-E' },
  { value: 'midjourney', label: 'Midjourney' },
  { value: 'mermaid', label: 'Mermaid' },
  { value: 'sora', label: 'Sora' },
  { value: 'upload', label: 'Upload' },
]

// Selectors for TabzChrome automation
const SELECTORS = [
  { id: 'asset-grid', description: 'Main gallery grid containing all asset cards' },
  { id: 'asset-{id}', description: 'Individual asset card (e.g., #asset-1, #asset-2)' },
  { id: 'asset-{id}-select', description: 'Checkbox to select an individual asset' },
  { id: 'filter-type', description: 'Dropdown to filter by type (image, diagram, audio, video)' },
  { id: 'filter-source', description: 'Dropdown to filter by source (dalle, midjourney, etc.)' },
  { id: 'search-assets', description: 'Search input to filter assets by name' },
  { id: 'btn-select-all', description: 'Button to select/deselect all visible assets' },
  { id: 'btn-delete-selected', description: 'Button to delete all selected assets' },
  { id: 'btn-rename', description: 'Button to rename the selected asset' },
  { id: 'btn-move', description: 'Button to move selected assets to a folder' },
  { id: 'btn-insert', description: 'Button to insert selected asset into a project' },
  { id: 'upload-zone', description: 'Drag-and-drop zone for uploading new assets' },
  { id: 'preview-modal', description: 'Modal overlay for full-size asset preview' },
  { id: 'btn-close-preview', description: 'Button to close the preview modal' },
]

// Type icon component
function TypeIcon({ type }: { type: Asset['type'] }) {
  switch (type) {
    case 'image':
      return <ImageIcon className="h-4 w-4" />
    case 'diagram':
      return <GitBranch className="h-4 w-4" />
    case 'audio':
      return <Music className="h-4 w-4" />
    case 'video':
      return <Video className="h-4 w-4" />
    default:
      return <ImageIcon className="h-4 w-4" />
  }
}

// Source badge colors
function getSourceColor(source: Asset['source']) {
  switch (source) {
    case 'dalle':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'midjourney':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    case 'mermaid':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'sora':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'upload':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export default function AssetsGalleryPage() {
  const [assets] = useState<Asset[]>(MOCK_ASSETS)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Filter assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === 'all' || asset.type === typeFilter
      const matchesSource = sourceFilter === 'all' || asset.source === sourceFilter
      return matchesSearch && matchesType && matchesSource
    })
  }, [assets, searchQuery, typeFilter, sourceFilter])

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedAssets.size === filteredAssets.length) {
      setSelectedAssets(new Set())
    } else {
      setSelectedAssets(new Set(filteredAssets.map((a) => a.id)))
    }
  }

  const toggleAssetSelection = (id: string) => {
    const newSelection = new Set(selectedAssets)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedAssets(newSelection)
  }

  // Action handlers (mock implementations)
  const handleDelete = () => {
    alert(`Would delete ${selectedAssets.size} asset(s)`)
    setSelectedAssets(new Set())
  }

  const handleRename = () => {
    if (selectedAssets.size === 1) {
      const assetId = Array.from(selectedAssets)[0]
      const asset = assets.find((a) => a.id === assetId)
      const newName = prompt('Enter new name:', asset?.name)
      if (newName) {
        alert(`Would rename to: ${newName}`)
      }
    }
  }

  const handleMove = () => {
    const folder = prompt('Enter destination folder:', '.prompts/AI_Images/')
    if (folder) {
      alert(`Would move ${selectedAssets.size} asset(s) to: ${folder}`)
    }
  }

  const handleInsert = () => {
    alert(`Would insert ${selectedAssets.size} asset(s) into project`)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    alert(`Would upload ${files.length} file(s): ${files.map((f) => f.name).join(', ')}`)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Automations
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
              <Images className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Assets Gallery</h1>
            <Badge variant="secondary">Automation</Badge>
          </div>

          <p className="text-muted-foreground">
            Browse, organize, and manage AI-generated assets. Supports images, diagrams, audio, and video.
          </p>
        </div>

        {/* Toolbar */}
        <Card className="glass border-border/50 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="search-assets"
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {TYPE_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              <select
                id="filter-source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                {SOURCE_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              id="btn-select-all"
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
              className="gap-2"
            >
              {selectedAssets.size === filteredAssets.length && filteredAssets.length > 0 ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selectedAssets.size > 0 ? `${selectedAssets.size} selected` : 'Select All'}
            </Button>

            <div className="h-6 w-px bg-border/50 hidden sm:block" />

            <Button
              id="btn-delete-selected"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={selectedAssets.size === 0}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>

            <Button
              id="btn-rename"
              variant="outline"
              size="sm"
              onClick={handleRename}
              disabled={selectedAssets.size !== 1}
              className="gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Rename
            </Button>

            <Button
              id="btn-move"
              variant="outline"
              size="sm"
              onClick={handleMove}
              disabled={selectedAssets.size === 0}
              className="gap-2"
            >
              <FolderInput className="h-4 w-4" />
              Move
            </Button>

            <Button
              id="btn-insert"
              variant="outline"
              size="sm"
              onClick={handleInsert}
              disabled={selectedAssets.size === 0}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Insert
            </Button>

            <div className="ml-auto text-sm text-muted-foreground">
              {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
            </div>
          </div>
        </Card>

        {/* Upload Zone */}
        <div
          id="upload-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
            }
          `}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Drag and drop files here, or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Supports images, diagrams, audio, and video files
          </p>
        </div>

        {/* Asset Grid */}
        <div
          id="asset-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              id={`asset-${asset.id.replace('asset-', '')}`}
              className={`
                glass border-border/50 rounded-xl overflow-hidden group transition-all
                ${selectedAssets.has(asset.id) ? 'ring-2 ring-primary' : ''}
              `}
            >
              {/* Thumbnail / Preview */}
              <div
                className="relative aspect-video bg-muted/30 flex items-center justify-center cursor-pointer"
                onClick={() => setPreviewAsset(asset)}
              >
                <TypeIcon type={asset.type} />
                <span className="sr-only">{asset.type} preview</span>

                {/* Selection checkbox */}
                <button
                  id={`asset-${asset.id.replace('asset-', '')}-select`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleAssetSelection(asset.id)
                  }}
                  className="absolute top-2 left-2 p-1 rounded bg-background/80 hover:bg-background transition-colors"
                >
                  {selectedAssets.has(asset.id) ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Preview button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewAsset(asset)
                  }}
                  className="absolute top-2 right-2 p-1 rounded bg-background/80 hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </button>

                {/* Type badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getSourceColor(asset.source)}`}
                  >
                    {asset.source}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{asset.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{asset.path}</p>
                  </div>
                  <button className="p-1 rounded hover:bg-muted/50 transition-colors shrink-0">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <TypeIcon type={asset.type} />
                  <span className="capitalize">{asset.type}</span>
                  <span className="text-border">•</span>
                  <span>{formatDate(asset.createdAt)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredAssets.length === 0 && (
          <Card className="glass border-border/50 rounded-xl p-12 text-center">
            <Images className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">No assets found</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Upload some assets to get started'}
            </p>
          </Card>
        )}

        {/* Preview Modal */}
        {previewAsset && (
          <div
            id="preview-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setPreviewAsset(null)}
          >
            <Card
              className="glass border-border/50 rounded-xl max-w-3xl w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <TypeIcon type={previewAsset.type} />
                  <div>
                    <h3 className="font-medium">{previewAsset.name}</h3>
                    <p className="text-xs text-muted-foreground">{previewAsset.path}</p>
                  </div>
                </div>
                <button
                  id="btn-close-preview"
                  onClick={() => setPreviewAsset(null)}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Preview area */}
              <div className="aspect-video bg-muted/30 flex items-center justify-center">
                <div className="text-center">
                  <TypeIcon type={previewAsset.type} />
                  <p className="text-sm text-muted-foreground mt-2">
                    Preview for {previewAsset.type} files
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-4 border-t border-border/50">
                <h4 className="text-sm font-medium mb-2">Metadata</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{' '}
                    <span className="capitalize">{previewAsset.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>{' '}
                    <span className="capitalize">{previewAsset.source}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>{' '}
                    {formatDate(previewAsset.createdAt)}
                  </div>
                  {previewAsset.metadata?.dimensions && (
                    <div>
                      <span className="text-muted-foreground">Dimensions:</span>{' '}
                      {previewAsset.metadata.dimensions}
                    </div>
                  )}
                  {previewAsset.metadata?.duration !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Duration:</span>{' '}
                      {previewAsset.metadata.duration}s
                    </div>
                  )}
                </div>
                {previewAsset.metadata?.prompt && (
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Prompt:</span>
                    <p className="text-sm mt-1 p-2 rounded-lg bg-muted/30">
                      {previewAsset.metadata.prompt}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Selectors Panel */}
        <Card className="glass border-border/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setSelectorsOpen(!selectorsOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              TabzChrome Selectors
            </h2>
            {selectorsOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {selectorsOpen && (
            <div className="px-6 pb-6">
              <p className="text-sm text-muted-foreground mb-4">
                All interactive elements on this page can be automated via TabzChrome MCP tools.
              </p>
              <div className="grid gap-2">
                {SELECTORS.map((selector) => (
                  <div
                    key={selector.id}
                    className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/30"
                  >
                    <code className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono shrink-0">
                      #{selector.id}
                    </code>
                    <span className="text-sm text-muted-foreground">{selector.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
