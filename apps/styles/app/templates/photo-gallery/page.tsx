"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Folder,
  Grid3x3,
  Heart,
  Image as ImageIcon,
  Info,
  Layers,
  Link2,
  Map,
  MapPin,
  Maximize2,
  Pause,
  Play,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Tag,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  Calendar,
  Aperture,
  Focus,
  Timer,
  Gauge,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// TypeScript Interfaces
interface ExifData {
  camera?: string
  lens?: string
  focalLength?: string
  aperture?: string
  shutter?: string
  iso?: number
}

interface Album {
  id: string
  name: string
  description?: string
  coverPhoto: string
  photoCount: number
  createdAt: string
}

interface Photo {
  id: string
  url: string
  thumbnail: string
  title?: string
  description?: string
  albumId?: string
  uploadDate: string
  takenDate?: string
  width: number
  height: number
  size: number
  isFavorite: boolean
  tags: string[]
  exif?: ExifData
  location?: { lat: number; lng: number; name: string }
}

// Mock Data
const mockAlbums: Album[] = [
  {
    id: "album-1",
    name: "Nature & Landscapes",
    description: "Beautiful outdoor photography",
    coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    photoCount: 24,
    createdAt: "2024-01-15",
  },
  {
    id: "album-2",
    name: "Urban Architecture",
    description: "City skylines and buildings",
    coverPhoto: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400",
    photoCount: 18,
    createdAt: "2024-02-20",
  },
  {
    id: "album-3",
    name: "Portraits",
    description: "People and faces",
    coverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    photoCount: 12,
    createdAt: "2024-03-10",
  },
  {
    id: "album-4",
    name: "Travel",
    description: "Adventures around the world",
    coverPhoto: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400",
    photoCount: 32,
    createdAt: "2024-04-05",
  },
  {
    id: "album-5",
    name: "Wildlife",
    description: "Animals in their habitat",
    coverPhoto: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400",
    photoCount: 15,
    createdAt: "2024-05-12",
  },
  {
    id: "album-6",
    name: "Abstract",
    description: "Creative and artistic shots",
    coverPhoto: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
    photoCount: 9,
    createdAt: "2024-06-01",
  },
]

const mockPhotos: Photo[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    title: "Mountain Sunrise",
    description: "Golden hour light over the alpine peaks",
    albumId: "album-1",
    uploadDate: "2024-12-15",
    takenDate: "2024-12-10",
    width: 4000,
    height: 2667,
    size: 4520000,
    isFavorite: true,
    tags: ["mountains", "sunrise", "landscape", "nature"],
    exif: {
      camera: "Sony A7R IV",
      lens: "24-70mm f/2.8 GM",
      focalLength: "35mm",
      aperture: "f/8",
      shutter: "1/250s",
      iso: 100,
    },
    location: { lat: 46.8182, lng: 8.2275, name: "Swiss Alps, Switzerland" },
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400",
    title: "City Lights",
    description: "Downtown skyline at blue hour",
    albumId: "album-2",
    uploadDate: "2024-12-14",
    takenDate: "2024-12-08",
    width: 3600,
    height: 2400,
    size: 3890000,
    isFavorite: false,
    tags: ["city", "architecture", "night", "skyline"],
    exif: {
      camera: "Canon EOS R5",
      lens: "16-35mm f/2.8L",
      focalLength: "24mm",
      aperture: "f/11",
      shutter: "30s",
      iso: 200,
    },
    location: { lat: 40.7128, lng: -74.006, name: "New York City, USA" },
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    title: "Portrait Study",
    description: "Natural light portrait session",
    albumId: "album-3",
    uploadDate: "2024-12-13",
    takenDate: "2024-12-05",
    width: 3000,
    height: 4000,
    size: 2780000,
    isFavorite: true,
    tags: ["portrait", "people", "studio"],
    exif: {
      camera: "Nikon Z8",
      lens: "85mm f/1.4",
      focalLength: "85mm",
      aperture: "f/1.8",
      shutter: "1/500s",
      iso: 400,
    },
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400",
    title: "Ocean Serenity",
    description: "Calm waters at sunset",
    albumId: "album-4",
    uploadDate: "2024-12-12",
    takenDate: "2024-12-01",
    width: 4200,
    height: 2800,
    size: 5120000,
    isFavorite: false,
    tags: ["ocean", "sunset", "travel", "beach"],
    exif: {
      camera: "Sony A7R IV",
      lens: "70-200mm f/2.8 GM",
      focalLength: "135mm",
      aperture: "f/5.6",
      shutter: "1/1000s",
      iso: 200,
    },
    location: { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" },
  },
  {
    id: "photo-5",
    url: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400",
    title: "Wild Encounter",
    description: "Lion in the African savanna",
    albumId: "album-5",
    uploadDate: "2024-12-11",
    takenDate: "2024-11-28",
    width: 4500,
    height: 3000,
    size: 6200000,
    isFavorite: true,
    tags: ["wildlife", "africa", "lion", "nature"],
    exif: {
      camera: "Canon EOS R5",
      lens: "100-400mm f/4.5-5.6L",
      focalLength: "400mm",
      aperture: "f/5.6",
      shutter: "1/2000s",
      iso: 800,
    },
    location: { lat: -2.3333, lng: 34.8333, name: "Serengeti, Tanzania" },
  },
  {
    id: "photo-6",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
    title: "Abstract Flow",
    description: "Fluid art photography",
    albumId: "album-6",
    uploadDate: "2024-12-10",
    takenDate: "2024-11-25",
    width: 3200,
    height: 3200,
    size: 2340000,
    isFavorite: false,
    tags: ["abstract", "art", "creative", "colors"],
    exif: {
      camera: "Sony A7 III",
      lens: "90mm f/2.8 Macro",
      focalLength: "90mm",
      aperture: "f/4",
      shutter: "1/125s",
      iso: 100,
    },
  },
  {
    id: "photo-7",
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
    title: "Starry Night",
    description: "Mountains under the Milky Way",
    albumId: "album-1",
    uploadDate: "2024-12-09",
    takenDate: "2024-11-20",
    width: 4000,
    height: 2667,
    size: 4890000,
    isFavorite: true,
    tags: ["night", "stars", "mountains", "astrophotography"],
    exif: {
      camera: "Nikon Z8",
      lens: "14-24mm f/2.8",
      focalLength: "14mm",
      aperture: "f/2.8",
      shutter: "20s",
      iso: 3200,
    },
    location: { lat: 45.8326, lng: 6.8652, name: "Mont Blanc, France" },
  },
  {
    id: "photo-8",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
    title: "Street Scene",
    description: "Busy city intersection",
    albumId: "album-2",
    uploadDate: "2024-12-08",
    takenDate: "2024-11-18",
    width: 3800,
    height: 2533,
    size: 3560000,
    isFavorite: false,
    tags: ["street", "city", "urban", "people"],
    exif: {
      camera: "Fujifilm X-T5",
      lens: "23mm f/1.4",
      focalLength: "23mm",
      aperture: "f/2.8",
      shutter: "1/500s",
      iso: 400,
    },
    location: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
  },
  {
    id: "photo-9",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
    title: "Ocean Waves",
    description: "Powerful waves crashing",
    albumId: "album-4",
    uploadDate: "2024-12-07",
    takenDate: "2024-11-15",
    width: 4200,
    height: 2800,
    size: 4780000,
    isFavorite: false,
    tags: ["ocean", "waves", "power", "nature"],
    exif: {
      camera: "Sony A7R IV",
      lens: "24-70mm f/2.8 GM",
      focalLength: "50mm",
      aperture: "f/8",
      shutter: "1/2000s",
      iso: 400,
    },
    location: { lat: 21.2743, lng: -157.8233, name: "Hawaii, USA" },
  },
  {
    id: "photo-10",
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
    title: "Lakeside Reflection",
    description: "Perfect mirror reflection on calm lake",
    albumId: "album-1",
    uploadDate: "2024-12-06",
    takenDate: "2024-11-10",
    width: 4000,
    height: 2667,
    size: 4120000,
    isFavorite: true,
    tags: ["lake", "reflection", "mountains", "calm"],
    exif: {
      camera: "Canon EOS R5",
      lens: "16-35mm f/2.8L",
      focalLength: "20mm",
      aperture: "f/11",
      shutter: "1/60s",
      iso: 100,
    },
    location: { lat: 46.4146, lng: 11.7677, name: "Dolomites, Italy" },
  },
  {
    id: "photo-11",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    title: "Forest Path",
    description: "Sunlight through the trees",
    albumId: "album-1",
    uploadDate: "2024-12-05",
    takenDate: "2024-11-05",
    width: 3600,
    height: 2400,
    size: 3890000,
    isFavorite: false,
    tags: ["forest", "trees", "path", "sunlight"],
    exif: {
      camera: "Nikon Z8",
      lens: "24-70mm f/2.8",
      focalLength: "35mm",
      aperture: "f/5.6",
      shutter: "1/125s",
      iso: 400,
    },
  },
  {
    id: "photo-12",
    url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200",
    thumbnail: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400",
    title: "Eagle in Flight",
    description: "Majestic bird soaring",
    albumId: "album-5",
    uploadDate: "2024-12-04",
    takenDate: "2024-11-01",
    width: 4500,
    height: 3000,
    size: 5670000,
    isFavorite: true,
    tags: ["wildlife", "bird", "eagle", "flight"],
    exif: {
      camera: "Canon EOS R5",
      lens: "600mm f/4L",
      focalLength: "600mm",
      aperture: "f/4",
      shutter: "1/4000s",
      iso: 1600,
    },
    location: { lat: 61.218, lng: -149.9003, name: "Alaska, USA" },
  },
]

// Helper Functions
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function PhotoGallery() {
  // State
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos)
  const [albums] = useState<Album[]>(mockAlbums)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAlbum, setFilterAlbum] = useState<string>("all")
  const [filterFavorites, setFilterFavorites] = useState(false)
  const [slideshowActive, setSlideshowActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState("gallery")
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry")
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      !searchQuery ||
      photo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesAlbum = filterAlbum === "all" || photo.albumId === filterAlbum
    const matchesFavorites = !filterFavorites || photo.isFavorite
    return matchesSearch && matchesAlbum && matchesFavorites
  })

  // Lightbox navigation
  const currentPhotoIndex = selectedPhoto
    ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id)
    : -1

  const goToPrevPhoto = useCallback(() => {
    if (currentPhotoIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentPhotoIndex - 1])
      setZoomLevel(1)
    }
  }, [currentPhotoIndex, filteredPhotos])

  const goToNextPhoto = useCallback(() => {
    if (currentPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentPhotoIndex + 1])
      setZoomLevel(1)
    }
  }, [currentPhotoIndex, filteredPhotos])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      switch (e.key) {
        case "ArrowLeft":
          goToPrevPhoto()
          break
        case "ArrowRight":
          goToNextPhoto()
          break
        case "Escape":
          setLightboxOpen(false)
          setSlideshowActive(false)
          break
        case "+":
        case "=":
          setZoomLevel((z) => Math.min(z + 0.25, 3))
          break
        case "-":
          setZoomLevel((z) => Math.max(z - 0.25, 0.5))
          break
        case "i":
          setShowInfoPanel((s) => !s)
          break
        case " ":
          e.preventDefault()
          setSlideshowActive((s) => !s)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, goToPrevPhoto, goToNextPhoto])

  // Slideshow
  useEffect(() => {
    if (slideshowActive && lightboxOpen) {
      slideshowIntervalRef.current = setInterval(() => {
        if (currentPhotoIndex < filteredPhotos.length - 1) {
          setSelectedPhoto(filteredPhotos[currentPhotoIndex + 1])
          setZoomLevel(1)
        } else {
          setSelectedPhoto(filteredPhotos[0])
          setZoomLevel(1)
        }
      }, 4000)
    } else if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current)
    }

    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current)
      }
    }
  }, [slideshowActive, lightboxOpen, currentPhotoIndex, filteredPhotos])

  // Toggle favorite
  const toggleFavorite = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p))
    )
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null))
    }
  }

  // Open lightbox
  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
    setLightboxOpen(true)
    setZoomLevel(1)
  }

  // Drag and drop upload simulation
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
    simulateUpload()
  }

  const simulateUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setUploadProgress(null), 1000)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Get album for photo
  const getAlbumName = (albumId?: string): string => {
    if (!albumId) return "Uncategorized"
    const album = albums.find((a) => a.id === albumId)
    return album?.name || "Unknown"
  }

  // Stats
  const totalPhotos = photos.length
  const totalFavorites = photos.filter((p) => p.isFavorite).length
  const totalSize = photos.reduce((sum, p) => sum + p.size, 0)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
              Photo Gallery
            </h1>
            <p className="text-muted-foreground mt-2">
              Photography portfolio and image management
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              {totalPhotos} Photos
            </Badge>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-sm px-3 py-1">
              {formatFileSize(totalSize)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Total Photos</p>
              <ImageIcon className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{totalPhotos}</p>
            <p className="text-muted-foreground text-xs mt-1">{albums.length} albums</p>
          </Card>

          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Favorites</p>
              <Heart className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">{totalFavorites}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {((totalFavorites / totalPhotos) * 100).toFixed(0)}% of gallery
            </p>
          </Card>

          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Storage Used</p>
              <Layers className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">
              {formatFileSize(totalSize)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">of 10 GB</p>
          </Card>

          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">With Location</p>
              <MapPin className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">
              {photos.filter((p) => p.location).length}
            </p>
            <p className="text-muted-foreground text-xs mt-1">geotagged photos</p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <TabsList className="glass border-primary/30 w-max md:w-auto">
                  <TabsTrigger value="gallery" className="text-xs sm:text-sm whitespace-nowrap">
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Gallery
                  </TabsTrigger>
                  <TabsTrigger value="albums" className="text-xs sm:text-sm whitespace-nowrap">
                    <Folder className="h-4 w-4 mr-2" />
                    Albums
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="text-xs sm:text-sm whitespace-nowrap">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger value="map" className="text-xs sm:text-sm whitespace-nowrap">
                    <Map className="h-4 w-4 mr-2" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="text-xs sm:text-sm whitespace-nowrap">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Filters */}
              {(activeTab === "gallery" || activeTab === "favorites") && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search photos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 glass border-primary/30 text-foreground"
                    />
                  </div>
                  <Select value={filterAlbum} onValueChange={setFilterAlbum}>
                    <SelectTrigger className="w-[140px] glass border-primary/30">
                      <SelectValue placeholder="All Albums" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Albums</SelectItem>
                      {albums.map((album) => (
                        <SelectItem key={album.id} value={album.id}>
                          {album.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`border-primary/30 ${
                      viewMode === "masonry" ? "bg-primary/20 text-primary" : ""
                    }`}
                    onClick={() => setViewMode("masonry")}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`border-primary/30 ${
                      viewMode === "grid" ? "bg-primary/20 text-primary" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <div
                className={
                  viewMode === "masonry"
                    ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                }
              >
                {filteredPhotos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className={viewMode === "masonry" ? "break-inside-avoid" : ""}
                  >
                    <Card
                      className="glass border-primary/30 overflow-hidden cursor-pointer group"
                      onClick={() => openLightbox(photo)}
                    >
                      <div className="relative">
                        <img
                          src={photo.thumbnail}
                          alt={photo.title || "Photo"}
                          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                            viewMode === "grid" ? "aspect-square" : ""
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-foreground font-medium text-sm truncate">
                            {photo.title || "Untitled"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {getAlbumName(photo.albumId)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(photo.id)
                          }}
                          className="absolute top-2 right-2 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              photo.isFavorite
                                ? "fill-red-500 text-red-500"
                                : "text-foreground"
                            }`}
                          />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No photos found</p>
                </div>
              )}
            </TabsContent>

            {/* Albums Tab */}
            <TabsContent value="albums" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album, idx) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Card
                      className="glass border-primary/30 overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setFilterAlbum(album.id)
                        setActiveTab("gallery")
                      }}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={album.coverPhoto}
                          alt={album.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-foreground font-bold text-lg mb-1">
                            {album.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                            {album.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {album.photoCount} photos
                            </Badge>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(album.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {/* Create Album Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: albums.length * 0.05 }}
                >
                  <Card className="glass border-dashed border-primary/30 aspect-video flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors">
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-primary font-medium">Create Album</p>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              {(() => {
                const favoritePhotos = filteredPhotos.filter((p) => p.isFavorite)
                return favoritePhotos.length > 0 ? (
                  <div
                    className={
                      viewMode === "masonry"
                        ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    }
                  >
                    {favoritePhotos.map((photo, idx) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className={viewMode === "masonry" ? "break-inside-avoid" : ""}
                      >
                        <Card
                          className="glass border-secondary/30 overflow-hidden cursor-pointer group"
                          onClick={() => openLightbox(photo)}
                        >
                          <div className="relative">
                            <img
                              src={photo.thumbnail}
                              alt={photo.title || "Photo"}
                              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                viewMode === "grid" ? "aspect-square" : ""
                              }`}
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-foreground font-medium text-sm truncate">
                                {photo.title || "Untitled"}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No favorites yet</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Click the heart icon on photos to add them to favorites
                    </p>
                  </div>
                )
              })()}
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Photo Locations</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {photos.filter((p) => p.location).length} geotagged photos
                    </p>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="glass-dark border-primary/20 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">Map View</p>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Interactive map showing photo locations. Integrate with your preferred
                      map provider (Mapbox, Google Maps, Leaflet).
                    </p>
                  </div>
                </div>

                {/* Location List */}
                <div className="mt-6 space-y-3">
                  <h4 className="text-foreground font-medium">Photos by Location</h4>
                  {photos
                    .filter((p) => p.location)
                    .map((photo) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-dark border-primary/20 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-colors"
                        onClick={() => openLightbox(photo)}
                      >
                        <img
                          src={photo.thumbnail}
                          alt={photo.title || "Photo"}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium truncate">
                            {photo.title || "Untitled"}
                          </p>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{photo.location?.name}</span>
                          </div>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {photo.location?.lat.toFixed(4)}, {photo.location?.lng.toFixed(4)}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </Card>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-6">Upload Photos</h3>

                {/* Drag Drop Zone */}
                <div
                  className={`glass-dark border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-primary/30 hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload
                    className={`h-16 w-16 mx-auto mb-4 ${
                      isDragging ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <p className="text-foreground font-medium mb-2">
                    Drag and drop your photos here
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    or click to browse files
                  </p>
                  <Button
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                    onClick={simulateUpload}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                  <p className="text-muted-foreground text-xs mt-4">
                    Supports: JPG, PNG, WEBP, HEIC • Max 50MB per file
                  </p>
                </div>

                {/* Upload Progress */}
                {uploadProgress !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 glass-dark border-primary/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-foreground text-sm font-medium">
                        Uploading photos...
                      </p>
                      <span className="text-primary font-mono text-sm">
                        {uploadProgress}%
                      </span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    {uploadProgress === 100 && (
                      <p className="text-primary text-sm mt-2">Upload complete!</p>
                    )}
                  </motion.div>
                )}

                {/* Upload Settings */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-dark border-primary/20 rounded-lg p-4">
                    <h4 className="text-foreground font-medium mb-3">Upload to Album</h4>
                    <Select defaultValue="none">
                      <SelectTrigger className="glass border-primary/30">
                        <SelectValue placeholder="Select album" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Album</SelectItem>
                        {albums.map((album) => (
                          <SelectItem key={album.id} value={album.id}>
                            {album.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="glass-dark border-primary/20 rounded-lg p-4">
                    <h4 className="text-foreground font-medium mb-3">Default Tags</h4>
                    <Input
                      placeholder="Add tags separated by commas..."
                      className="glass border-primary/30 text-foreground"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Lightbox */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-background/95 backdrop-blur-xl border-primary/30">
            {selectedPhoto && (
              <div className="relative w-full h-full flex">
                {/* Main Image Area */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  {/* Navigation Buttons */}
                  {currentPhotoIndex > 0 && (
                    <button
                      onClick={goToPrevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6 text-foreground" />
                    </button>
                  )}
                  {currentPhotoIndex < filteredPhotos.length - 1 && (
                    <button
                      onClick={goToNextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full glass hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6 text-foreground" />
                    </button>
                  )}

                  {/* Image */}
                  <motion.img
                    key={selectedPhoto.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: zoomLevel }}
                    transition={{ duration: 0.3 }}
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title || "Photo"}
                    className="max-w-full max-h-full object-contain cursor-zoom-in"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />

                  {/* Bottom Toolbar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-background/90 to-transparent">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        {currentPhotoIndex + 1} / {filteredPhotos.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="glass border-primary/30 hover:bg-primary/20"
                        onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-foreground text-sm font-mono w-12 text-center">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="glass border-primary/30 hover:bg-primary/20"
                        onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 bg-primary/30 mx-2" />

                      <Button
                        variant="outline"
                        size="icon"
                        className={`glass border-primary/30 hover:bg-primary/20 ${
                          slideshowActive ? "bg-primary/20 text-primary" : ""
                        }`}
                        onClick={() => setSlideshowActive(!slideshowActive)}
                      >
                        {slideshowActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className={`glass border-primary/30 hover:bg-primary/20 ${
                          selectedPhoto.isFavorite ? "text-red-500" : ""
                        }`}
                        onClick={() => toggleFavorite(selectedPhoto.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            selectedPhoto.isFavorite ? "fill-current" : ""
                          }`}
                        />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="glass border-primary/30 hover:bg-primary/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="glass border-primary/30 hover:bg-primary/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 bg-primary/30 mx-2" />

                      <Button
                        variant="outline"
                        size="icon"
                        className={`glass border-primary/30 hover:bg-primary/20 ${
                          showInfoPanel ? "bg-primary/20 text-primary" : ""
                        }`}
                        onClick={() => setShowInfoPanel(!showInfoPanel)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Info Panel */}
                <AnimatePresence>
                  {showInfoPanel && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 320, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full border-l border-primary/30 bg-background/50 backdrop-blur-xl overflow-hidden"
                    >
                      <ScrollArea className="h-full">
                        <div className="p-6 space-y-6">
                          <div>
                            <h3 className="text-foreground font-bold text-lg mb-1">
                              {selectedPhoto.title || "Untitled"}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {selectedPhoto.description || "No description"}
                            </p>
                          </div>

                          <Separator className="bg-primary/30" />

                          {/* Details */}
                          <div className="space-y-3">
                            <h4 className="text-foreground font-medium flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-primary" />
                              Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Album</span>
                                <span className="text-foreground">
                                  {getAlbumName(selectedPhoto.albumId)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Dimensions</span>
                                <span className="text-foreground font-mono">
                                  {selectedPhoto.width} × {selectedPhoto.height}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Size</span>
                                <span className="text-foreground font-mono">
                                  {formatFileSize(selectedPhoto.size)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Uploaded</span>
                                <span className="text-foreground">
                                  {formatDate(selectedPhoto.uploadDate)}
                                </span>
                              </div>
                              {selectedPhoto.takenDate && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Taken</span>
                                  <span className="text-foreground">
                                    {formatDate(selectedPhoto.takenDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* EXIF Data */}
                          {selectedPhoto.exif && (
                            <>
                              <Separator className="bg-primary/30" />
                              <div className="space-y-3">
                                <h4 className="text-foreground font-medium flex items-center gap-2">
                                  <Camera className="h-4 w-4 text-primary" />
                                  Camera Info
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {selectedPhoto.exif.camera && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Camera</span>
                                      <span className="text-foreground">
                                        {selectedPhoto.exif.camera}
                                      </span>
                                    </div>
                                  )}
                                  {selectedPhoto.exif.lens && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Lens</span>
                                      <span className="text-foreground">
                                        {selectedPhoto.exif.lens}
                                      </span>
                                    </div>
                                  )}
                                  {selectedPhoto.exif.focalLength && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground flex items-center gap-1">
                                        <Focus className="h-3 w-3" /> Focal
                                      </span>
                                      <span className="text-foreground font-mono">
                                        {selectedPhoto.exif.focalLength}
                                      </span>
                                    </div>
                                  )}
                                  {selectedPhoto.exif.aperture && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground flex items-center gap-1">
                                        <Aperture className="h-3 w-3" /> Aperture
                                      </span>
                                      <span className="text-foreground font-mono">
                                        {selectedPhoto.exif.aperture}
                                      </span>
                                    </div>
                                  )}
                                  {selectedPhoto.exif.shutter && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground flex items-center gap-1">
                                        <Timer className="h-3 w-3" /> Shutter
                                      </span>
                                      <span className="text-foreground font-mono">
                                        {selectedPhoto.exif.shutter}
                                      </span>
                                    </div>
                                  )}
                                  {selectedPhoto.exif.iso && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground flex items-center gap-1">
                                        <Gauge className="h-3 w-3" /> ISO
                                      </span>
                                      <span className="text-foreground font-mono">
                                        {selectedPhoto.exif.iso}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Location */}
                          {selectedPhoto.location && (
                            <>
                              <Separator className="bg-primary/30" />
                              <div className="space-y-3">
                                <h4 className="text-foreground font-medium flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  Location
                                </h4>
                                <p className="text-foreground text-sm">
                                  {selectedPhoto.location.name}
                                </p>
                                <p className="text-muted-foreground text-xs font-mono">
                                  {selectedPhoto.location.lat.toFixed(4)},{" "}
                                  {selectedPhoto.location.lng.toFixed(4)}
                                </p>
                              </div>
                            </>
                          )}

                          {/* Tags */}
                          {selectedPhoto.tags.length > 0 && (
                            <>
                              <Separator className="bg-primary/30" />
                              <div className="space-y-3">
                                <h4 className="text-foreground font-medium flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-primary" />
                                  Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedPhoto.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      className="bg-primary/20 text-primary border-primary/30"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Actions */}
                          <Separator className="bg-primary/30" />
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start border-primary/30 hover:bg-primary/10"
                            >
                              <Link2 className="h-4 w-4 mr-2" />
                              Copy Link
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-primary/30 hover:bg-primary/10"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Original
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Photo
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Keyboard Shortcuts Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 glass border-primary/30 rounded-full px-4 py-2"
        >
          <span className="text-muted-foreground text-sm font-mono">
            Press <kbd className="px-1 py-0.5 rounded bg-primary/20 text-primary mx-1">?</kbd>{" "}
            for shortcuts
          </span>
        </motion.div>
      </div>
    </div>
  )
}
