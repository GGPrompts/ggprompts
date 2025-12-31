"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Library,
  Home,
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  Music,
  Disc3,
  Mic2,
  Radio,
  ChevronLeft,
  ChevronRight,
  X,
  GripVertical,
  ExternalLink,
  User,
  PlayCircle,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// TypeScript Interfaces
interface Artist {
  id: string
  name: string
  image: string
  followers: number
  monthlyListeners: number
}

interface Album {
  id: string
  title: string
  artist: Artist
  cover: string
  releaseDate: string
  type: "album" | "single" | "ep"
}

interface Track {
  id: string
  title: string
  artist: Artist
  album: Album
  duration: number
  isLiked: boolean
  isExplicit: boolean
  plays: number
}

interface Playlist {
  id: string
  name: string
  description?: string
  cover: string
  owner: string
  tracks: Track[]
  isPublic: boolean
  followers: number
}

interface NowPlaying {
  track: Track
  isPlaying: boolean
  progress: number
  volume: number
  repeat: "off" | "all" | "one"
  shuffle: boolean
  isMuted: boolean
}

// Mock Data
const mockArtists: Artist[] = [
  { id: "artist-1", name: "The Midnight", image: "/api/placeholder/200/200", followers: 1250000, monthlyListeners: 3200000 },
  { id: "artist-2", name: "FM-84", image: "/api/placeholder/200/200", followers: 890000, monthlyListeners: 2100000 },
  { id: "artist-3", name: "Gunship", image: "/api/placeholder/200/200", followers: 720000, monthlyListeners: 1800000 },
  { id: "artist-4", name: "Timecop1983", image: "/api/placeholder/200/200", followers: 450000, monthlyListeners: 980000 },
  { id: "artist-5", name: "NINA", image: "/api/placeholder/200/200", followers: 380000, monthlyListeners: 760000 },
]

const mockAlbums: Album[] = [
  { id: "album-1", title: "Endless Summer", artist: mockArtists[0], cover: "/api/placeholder/300/300", releaseDate: "2016-07-08", type: "album" },
  { id: "album-2", title: "Nocturnal", artist: mockArtists[0], cover: "/api/placeholder/300/300", releaseDate: "2017-09-15", type: "album" },
  { id: "album-3", title: "Atlas", artist: mockArtists[1], cover: "/api/placeholder/300/300", releaseDate: "2016-06-24", type: "album" },
  { id: "album-4", title: "Dark All Day", artist: mockArtists[2], cover: "/api/placeholder/300/300", releaseDate: "2018-10-05", type: "album" },
  { id: "album-5", title: "Night Drive", artist: mockArtists[3], cover: "/api/placeholder/300/300", releaseDate: "2017-03-10", type: "album" },
]

const mockTracks: Track[] = [
  { id: "track-1", title: "Sunset", artist: mockArtists[0], album: mockAlbums[0], duration: 245, isLiked: true, isExplicit: false, plays: 45200000 },
  { id: "track-2", title: "Days of Thunder", artist: mockArtists[0], album: mockAlbums[0], duration: 312, isLiked: true, isExplicit: false, plays: 38100000 },
  { id: "track-3", title: "Gloria", artist: mockArtists[0], album: mockAlbums[1], duration: 287, isLiked: false, isExplicit: false, plays: 52300000 },
  { id: "track-4", title: "Los Angeles", artist: mockArtists[0], album: mockAlbums[1], duration: 265, isLiked: true, isExplicit: false, plays: 41800000 },
  { id: "track-5", title: "Running in the Night", artist: mockArtists[1], album: mockAlbums[2], duration: 298, isLiked: true, isExplicit: false, plays: 89400000 },
  { id: "track-6", title: "Arcade Summer", artist: mockArtists[1], album: mockAlbums[2], duration: 234, isLiked: false, isExplicit: false, plays: 28700000 },
  { id: "track-7", title: "Tech Noir", artist: mockArtists[2], album: mockAlbums[3], duration: 356, isLiked: true, isExplicit: true, plays: 67200000 },
  { id: "track-8", title: "Dark All Day", artist: mockArtists[2], album: mockAlbums[3], duration: 324, isLiked: false, isExplicit: false, plays: 31500000 },
  { id: "track-9", title: "On the Run", artist: mockArtists[3], album: mockAlbums[4], duration: 276, isLiked: true, isExplicit: false, plays: 19800000 },
  { id: "track-10", title: "Neon Lights", artist: mockArtists[3], album: mockAlbums[4], duration: 245, isLiked: false, isExplicit: false, plays: 15600000 },
]

const mockPlaylists: Playlist[] = [
  { id: "playlist-1", name: "Synthwave Essentials", description: "The best of synthwave and retrowave", cover: "/api/placeholder/300/300", owner: "You", tracks: mockTracks.slice(0, 6), isPublic: true, followers: 125000 },
  { id: "playlist-2", name: "Night Drive", description: "Perfect for late night drives", cover: "/api/placeholder/300/300", owner: "You", tracks: mockTracks.slice(2, 8), isPublic: true, followers: 89000 },
  { id: "playlist-3", name: "Chill Retrowave", description: "Relaxing synthwave vibes", cover: "/api/placeholder/300/300", owner: "You", tracks: mockTracks.slice(4, 10), isPublic: false, followers: 0 },
  { id: "playlist-4", name: "Workout Synth", description: "High energy synthwave", cover: "/api/placeholder/300/300", owner: "You", tracks: mockTracks.slice(0, 5), isPublic: true, followers: 45000 },
]

const genres = [
  { name: "Synthwave", color: "hsl(var(--primary))" },
  { name: "Retrowave", color: "hsl(var(--secondary))" },
  { name: "Darksynth", color: "hsl(280 70% 50%)" },
  { name: "Outrun", color: "hsl(340 70% 50%)" },
  { name: "Chillwave", color: "hsl(200 70% 50%)" },
  { name: "Vaporwave", color: "hsl(300 70% 50%)" },
]

export default function MusicPlayer() {
  // Navigation state
  const [activeView, setActiveView] = useState<"home" | "search" | "library" | "playlist" | "album" | "artist">("home")
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Player state
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    track: mockTracks[0],
    isPlaying: false,
    progress: 35,
    volume: 75,
    repeat: "off",
    shuffle: false,
    isMuted: false,
  })

  // Queue state
  const [queue, setQueue] = useState<Track[]>(mockTracks.slice(1, 6))
  const [showQueue, setShowQueue] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])

  // Mobile state
  const [showMobilePlayer, setShowMobilePlayer] = useState(false)

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (nowPlaying.isPlaying) {
      interval = setInterval(() => {
        setNowPlaying((prev) => {
          const newProgress = prev.progress + (100 / prev.track.duration)
          if (newProgress >= 100) {
            // Auto advance to next track
            if (queue.length > 0) {
              const nextTrack = queue[0]
              setQueue((q) => q.slice(1))
              return { ...prev, track: nextTrack, progress: 0 }
            }
            return { ...prev, isPlaying: false, progress: 0 }
          }
          return { ...prev, progress: newProgress }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [nowPlaying.isPlaying, queue])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = mockTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.album.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format plays count
  const formatPlays = (plays: number) => {
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
    if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`
    return plays.toString()
  }

  // Player controls
  const togglePlay = () => setNowPlaying((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  const toggleShuffle = () => setNowPlaying((prev) => ({ ...prev, shuffle: !prev.shuffle }))
  const toggleRepeat = () => {
    setNowPlaying((prev) => ({
      ...prev,
      repeat: prev.repeat === "off" ? "all" : prev.repeat === "all" ? "one" : "off",
    }))
  }
  const toggleMute = () => setNowPlaying((prev) => ({ ...prev, isMuted: !prev.isMuted }))
  const toggleLike = (trackId: string) => {
    if (nowPlaying.track.id === trackId) {
      setNowPlaying((prev) => ({
        ...prev,
        track: { ...prev.track, isLiked: !prev.track.isLiked },
      }))
    }
  }

  const playTrack = (track: Track) => {
    setNowPlaying((prev) => ({ ...prev, track, isPlaying: true, progress: 0 }))
  }

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track])
  }

  const skipNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0]
      setQueue((q) => q.slice(1))
      setNowPlaying((prev) => ({ ...prev, track: nextTrack, progress: 0 }))
    }
  }

  const skipPrevious = () => {
    if (nowPlaying.progress > 10) {
      setNowPlaying((prev) => ({ ...prev, progress: 0 }))
    }
  }

  // Get volume icon
  const getVolumeIcon = () => {
    if (nowPlaying.isMuted || nowPlaying.volume === 0) return VolumeX
    if (nowPlaying.volume < 50) return Volume1
    return Volume2
  }
  const VolumeIcon = getVolumeIcon()

  // Render sidebar
  const renderSidebar = () => (
    <aside
      className={`hidden md:flex flex-col glass border-r border-border/30 transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <motion.div
          animate={{ rotate: nowPlaying.isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: nowPlaying.isPlaying ? Infinity : 0, ease: "linear" }}
        >
          <Disc3 className="h-8 w-8 text-primary" />
        </motion.div>
        {!sidebarCollapsed && (
          <span className="text-xl font-bold text-foreground">SynthWave</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 space-y-1">
        <Button
          variant={activeView === "home" ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 ${sidebarCollapsed ? "px-3" : ""}`}
          onClick={() => setActiveView("home")}
        >
          <Home className="h-5 w-5" />
          {!sidebarCollapsed && "Home"}
        </Button>
        <Button
          variant={activeView === "search" ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 ${sidebarCollapsed ? "px-3" : ""}`}
          onClick={() => setActiveView("search")}
        >
          <Search className="h-5 w-5" />
          {!sidebarCollapsed && "Search"}
        </Button>
        <Button
          variant={activeView === "library" ? "secondary" : "ghost"}
          className={`w-full justify-start gap-3 ${sidebarCollapsed ? "px-3" : ""}`}
          onClick={() => setActiveView("library")}
        >
          <Library className="h-5 w-5" />
          {!sidebarCollapsed && "Your Library"}
        </Button>
      </nav>

      <Separator className="bg-border/30 mx-4" />

      {/* Playlists */}
      {!sidebarCollapsed && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Playlists</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-400px)] px-2">
            {mockPlaylists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start text-left text-muted-foreground hover:text-foreground mb-1"
                onClick={() => {
                  setSelectedPlaylist(playlist)
                  setActiveView("playlist")
                }}
              >
                <span className="truncate">{playlist.name}</span>
              </Button>
            ))}
          </ScrollArea>
        </div>
      )}

      {/* Collapse button */}
      <div className="p-4 border-t border-border/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full"
        >
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  )

  // Render home view
  const renderHome = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative glass rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <motion.div
            animate={{ rotate: nowPlaying.isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: nowPlaying.isPlaying ? Infinity : 0, ease: "linear" }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-secondary p-1"
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Disc3 className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </div>
          </motion.div>
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm mb-2">Now Playing</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {nowPlaying.track.title}
            </h2>
            <p className="text-muted-foreground">{nowPlaying.track.artist.name}</p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <Button size="lg" className="gap-2" onClick={togglePlay}>
                {nowPlaying.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {nowPlaying.isPlaying ? "Pause" : "Play"}
              </Button>
              <Button variant="outline" size="icon" onClick={() => toggleLike(nowPlaying.track.id)}>
                <Heart className={`h-5 w-5 ${nowPlaying.track.isLiked ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Playlists */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-4">Featured Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockPlaylists.map((playlist, idx) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card
                className="glass border-border/30 p-4 cursor-pointer group hover:bg-primary/5 transition-colors"
                onClick={() => {
                  setSelectedPlaylist(playlist)
                  setActiveView("playlist")
                }}
              >
                <div className="relative mb-3">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <Music className="h-12 w-12 text-primary/50" />
                  </div>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (playlist.tracks.length > 0) playTrack(playlist.tracks[0])
                    }}
                  >
                    <Play className="h-5 w-5" />
                  </motion.button>
                </div>
                <h4 className="font-semibold text-foreground truncate">{playlist.name}</h4>
                <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Browse by Genre */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-4">Browse by Genre</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre, idx) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="glass border-border/30 p-4 cursor-pointer hover:scale-105 transition-transform"
                style={{ borderLeftColor: genre.color, borderLeftWidth: "3px" }}
              >
                <span className="font-semibold text-foreground">{genre.name}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-4">New Releases</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockAlbums.map((album, idx) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card
                className="glass border-border/30 p-4 cursor-pointer group hover:bg-primary/5 transition-colors"
                onClick={() => {
                  setSelectedAlbum(album)
                  setActiveView("album")
                }}
              >
                <div className="relative mb-3">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center">
                    <Disc3 className="h-10 w-10 text-secondary/50" />
                  </div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-2.5 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      const albumTracks = mockTracks.filter((t) => t.album.id === album.id)
                      if (albumTracks.length > 0) playTrack(albumTracks[0])
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </motion.button>
                </div>
                <h4 className="font-semibold text-foreground truncate text-sm">{album.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{album.artist.name}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {album.type.toUpperCase()}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section>
        <h3 className="text-xl font-bold text-foreground mb-4">Popular Artists</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockArtists.map((artist, idx) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="glass border-border/30 p-4 cursor-pointer hover:bg-primary/5 transition-colors text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-foreground text-2xl">
                    {artist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-foreground truncate text-sm">{artist.name}</h4>
                <p className="text-xs text-muted-foreground">{formatPlays(artist.monthlyListeners)} listeners</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )

  // Render search view
  const renderSearch = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for songs, artists, or albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-lg glass border-border/30"
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {searchResults.length > 0 ? `Results for "${searchQuery}"` : `No results for "${searchQuery}"`}
          </h3>
          {searchResults.length > 0 && (
            <Card className="glass border-border/30">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Album</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Plays</TableHead>
                    <TableHead className="w-20 text-right">
                      <Clock className="h-4 w-4 ml-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((track, idx) => (
                    <TableRow
                      key={track.id}
                      className="border-border/30 cursor-pointer hover:bg-primary/5"
                      onClick={() => playTrack(track)}
                    >
                      <TableCell className="font-mono text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary/50" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-2">
                              {track.title}
                              {track.isExplicit && (
                                <Badge variant="outline" className="text-xs px-1">E</Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">{track.artist.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {track.album.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                        {formatPlays(track.plays)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatTime(track.duration)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      {/* Browse All (when no search) */}
      {!searchQuery && (
        <section>
          <h3 className="text-xl font-bold text-foreground mb-4">Browse All</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {genres.map((genre, idx) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card
                  className="glass border-border/30 p-6 cursor-pointer hover:scale-105 transition-transform aspect-square flex items-end"
                  style={{ background: `linear-gradient(135deg, ${genre.color}20, ${genre.color}10)` }}
                >
                  <span className="font-bold text-foreground text-lg">{genre.name}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )

  // Render library view
  const renderLibrary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Library</h2>
        <Button variant="outline" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass border-border/30 p-4 flex items-center gap-4 cursor-pointer hover:bg-primary/5 transition-colors">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Liked Songs</h3>
            <p className="text-sm text-muted-foreground">{mockTracks.filter((t) => t.isLiked).length} songs</p>
          </div>
        </Card>
        <Card className="glass border-border/30 p-4 flex items-center gap-4 cursor-pointer hover:bg-primary/5 transition-colors">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Radio className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Episodes</h3>
            <p className="text-sm text-muted-foreground">12 episodes</p>
          </div>
        </Card>
      </div>

      {/* Playlists Grid */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockPlaylists.map((playlist, idx) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card
                className="glass border-border/30 p-4 cursor-pointer group hover:bg-primary/5 transition-colors"
                onClick={() => {
                  setSelectedPlaylist(playlist)
                  setActiveView("playlist")
                }}
              >
                <div className="relative mb-3">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <ListMusic className="h-12 w-12 text-primary/50" />
                  </div>
                  <motion.button
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (playlist.tracks.length > 0) playTrack(playlist.tracks[0])
                    }}
                  >
                    <Play className="h-5 w-5" />
                  </motion.button>
                </div>
                <h4 className="font-semibold text-foreground truncate">{playlist.name}</h4>
                <p className="text-sm text-muted-foreground">{playlist.tracks.length} tracks</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section>
        <h3 className="text-lg font-semibold text-foreground mb-4">Artists</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mockArtists.slice(0, 6).map((artist, idx) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="glass border-border/30 p-4 cursor-pointer hover:bg-primary/5 transition-colors text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-foreground text-xl">
                    {artist.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-foreground truncate text-sm">{artist.name}</h4>
                <p className="text-xs text-muted-foreground">Artist</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )

  // Render playlist view
  const renderPlaylist = () => {
    if (!selectedPlaylist) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 glass rounded-xl p-6">
          <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shadow-xl">
            <ListMusic className="h-20 w-20 text-primary/50" />
          </div>
          <div className="text-center md:text-left flex-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Playlist</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{selectedPlaylist.name}</h1>
            {selectedPlaylist.description && (
              <p className="text-muted-foreground mt-2">{selectedPlaylist.description}</p>
            )}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{selectedPlaylist.owner}</span>
              <span>•</span>
              <span>{selectedPlaylist.tracks.length} songs</span>
              {selectedPlaylist.followers > 0 && (
                <>
                  <span>•</span>
                  <span>{formatPlays(selectedPlaylist.followers)} followers</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 gap-2"
            onClick={() => {
              if (selectedPlaylist.tracks.length > 0) {
                playTrack(selectedPlaylist.tracks[0])
                setQueue(selectedPlaylist.tracks.slice(1))
              }
            }}
          >
            <Play className="h-5 w-5" />
            Play
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Track List */}
        <Card className="glass border-border/30">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Album</TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-20 text-right">
                  <Clock className="h-4 w-4 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedPlaylist.tracks.map((track, idx) => (
                <TableRow
                  key={track.id}
                  className={`border-border/30 cursor-pointer hover:bg-primary/5 ${
                    nowPlaying.track.id === track.id ? "bg-primary/10" : ""
                  }`}
                  onClick={() => playTrack(track)}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    {nowPlaying.track.id === track.id && nowPlaying.isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 text-primary"
                      >
                        <Volume2 className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      idx + 1
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                        <Music className="h-4 w-4 text-primary/50" />
                      </div>
                      <div>
                        <p className={`font-medium flex items-center gap-2 ${
                          nowPlaying.track.id === track.id ? "text-primary" : "text-foreground"
                        }`}>
                          {track.title}
                          {track.isExplicit && (
                            <Badge variant="outline" className="text-xs px-1">E</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{track.artist.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {track.album.title}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(track.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${track.isLiked ? "fill-primary text-primary" : ""}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTime(track.duration)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }

  // Render album view
  const renderAlbum = () => {
    if (!selectedAlbum) return null
    const albumTracks = mockTracks.filter((t) => t.album.id === selectedAlbum.id)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 glass rounded-xl p-6">
          <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center shadow-xl">
            <Disc3 className="h-20 w-20 text-secondary/50" />
          </div>
          <div className="text-center md:text-left flex-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {selectedAlbum.type}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{selectedAlbum.title}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-sm text-muted-foreground">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary/20 text-xs">
                  {selectedAlbum.artist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-foreground">{selectedAlbum.artist.name}</span>
              <span>•</span>
              <span>{new Date(selectedAlbum.releaseDate).getFullYear()}</span>
              <span>•</span>
              <span>{albumTracks.length} songs</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 gap-2"
            onClick={() => {
              if (albumTracks.length > 0) {
                playTrack(albumTracks[0])
                setQueue(albumTracks.slice(1))
              }
            }}
          >
            <Play className="h-5 w-5" />
            Play
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Track List */}
        <Card className="glass border-border/30">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell text-right">Plays</TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-20 text-right">
                  <Clock className="h-4 w-4 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {albumTracks.map((track, idx) => (
                <TableRow
                  key={track.id}
                  className={`border-border/30 cursor-pointer hover:bg-primary/5 ${
                    nowPlaying.track.id === track.id ? "bg-primary/10" : ""
                  }`}
                  onClick={() => playTrack(track)}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    {nowPlaying.track.id === track.id && nowPlaying.isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 text-primary"
                      >
                        <Volume2 className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      idx + 1
                    )}
                  </TableCell>
                  <TableCell>
                    <p className={`font-medium flex items-center gap-2 ${
                      nowPlaying.track.id === track.id ? "text-primary" : "text-foreground"
                    }`}>
                      {track.title}
                      {track.isExplicit && (
                        <Badge variant="outline" className="text-xs px-1">E</Badge>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                    {formatPlays(track.plays)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(track.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${track.isLiked ? "fill-primary text-primary" : ""}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatTime(track.duration)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }

  // Render queue panel
  const renderQueue = () => (
    <AnimatePresence>
      {showQueue && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed right-0 top-0 bottom-24 w-80 glass border-l border-border/30 z-40"
        >
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Queue</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowQueue(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-4">
              {/* Now Playing */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Now Playing</p>
                <div className="glass-dark rounded-lg p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <Music className="h-5 w-5 text-primary/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{nowPlaying.track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{nowPlaying.track.artist.name}</p>
                  </div>
                </div>
              </div>

              {/* Up Next */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Up Next ({queue.length})</p>
                <div className="space-y-2">
                  {queue.map((track, idx) => (
                    <motion.div
                      key={`${track.id}-${idx}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-dark rounded-lg p-3 flex items-center gap-3 group cursor-pointer hover:bg-primary/5"
                      onClick={() => playTrack(track)}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Music className="h-4 w-4 text-primary/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist.name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
                    </motion.div>
                  ))}
                  {queue.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Queue is empty</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Render now playing bar (desktop)
  const renderNowPlayingBar = () => (
    <div className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-border/30 z-50 hidden md:flex items-center px-4">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-0">
        <motion.div
          animate={{ rotate: nowPlaying.isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: nowPlaying.isPlaying ? Infinity : 0, ease: "linear" }}
          className="w-14 h-14 rounded bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center flex-shrink-0"
        >
          <Disc3 className="h-7 w-7 text-primary/50" />
        </motion.div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{nowPlaying.track.title}</p>
          <p className="text-sm text-muted-foreground truncate">{nowPlaying.track.artist.name}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => toggleLike(nowPlaying.track.id)}
        >
          <Heart className={`h-5 w-5 ${nowPlaying.track.isLiked ? "fill-primary text-primary" : ""}`} />
        </Button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className={nowPlaying.shuffle ? "text-primary" : "text-muted-foreground"}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={skipPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={togglePlay}
          >
            {nowPlaying.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={skipNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={nowPlaying.repeat !== "off" ? "text-primary" : "text-muted-foreground"}
            onClick={toggleRepeat}
          >
            {nowPlaying.repeat === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime((nowPlaying.progress / 100) * nowPlaying.track.duration)}
          </span>
          <Slider
            value={[nowPlaying.progress]}
            max={100}
            step={0.1}
            onValueChange={([value]) => setNowPlaying((prev) => ({ ...prev, progress: value }))}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(nowPlaying.track.duration)}
          </span>
        </div>
      </div>

      {/* Volume & Extra Controls */}
      <div className="flex items-center justify-end gap-2 w-1/4">
        <Button variant="ghost" size="icon" onClick={() => setShowLyrics(!showLyrics)}>
          <Mic2 className={`h-5 w-5 ${showLyrics ? "text-primary" : ""}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowQueue(!showQueue)}>
          <ListMusic className={`h-5 w-5 ${showQueue ? "text-primary" : ""}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          <VolumeIcon className="h-5 w-5" />
        </Button>
        <Slider
          value={[nowPlaying.isMuted ? 0 : nowPlaying.volume]}
          max={100}
          step={1}
          onValueChange={([value]) => setNowPlaying((prev) => ({ ...prev, volume: value, isMuted: false }))}
          className="w-24"
        />
      </div>
    </div>
  )

  // Render mobile mini player
  const renderMobilePlayer = () => (
    <>
      {/* Mini Player Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 glass border-t border-border/30 p-3 flex items-center gap-3 md:hidden z-50 cursor-pointer"
        onClick={() => setShowMobilePlayer(true)}
      >
        <motion.div
          animate={{ rotate: nowPlaying.isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: nowPlaying.isPlaying ? Infinity : 0, ease: "linear" }}
          className="w-12 h-12 rounded bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center"
        >
          <Disc3 className="h-6 w-6 text-primary/50" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate text-sm">{nowPlaying.track.title}</p>
          <p className="text-xs text-muted-foreground truncate">{nowPlaying.track.artist.name}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
        >
          {nowPlaying.isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>

      {/* Full Mobile Player */}
      <AnimatePresence>
        {showMobilePlayer && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 glass z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setShowMobilePlayer(false)}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <span className="text-sm text-muted-foreground">Now Playing</span>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center p-8">
              <motion.div
                animate={{ rotate: nowPlaying.isPlaying ? 360 : 0 }}
                transition={{ duration: 8, repeat: nowPlaying.isPlaying ? Infinity : 0, ease: "linear" }}
                className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shadow-2xl"
              >
                <div className="w-56 h-56 rounded-full bg-background flex items-center justify-center">
                  <Disc3 className="h-24 w-24 text-primary/50" />
                </div>
              </motion.div>
            </div>

            {/* Track Info & Controls */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">{nowPlaying.track.title}</h2>
                <p className="text-muted-foreground">{nowPlaying.track.artist.name}</p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Slider
                  value={[nowPlaying.progress]}
                  max={100}
                  step={0.1}
                  onValueChange={([value]) => setNowPlaying((prev) => ({ ...prev, progress: value }))}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTime((nowPlaying.progress / 100) * nowPlaying.track.duration)}</span>
                  <span>{formatTime(nowPlaying.track.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className={nowPlaying.shuffle ? "text-primary" : "text-muted-foreground"}
                  onClick={toggleShuffle}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={skipPrevious}>
                  <SkipBack className="h-7 w-7" />
                </Button>
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full"
                  onClick={togglePlay}
                >
                  {nowPlaying.isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={skipNext}>
                  <SkipForward className="h-7 w-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={nowPlaying.repeat !== "off" ? "text-primary" : "text-muted-foreground"}
                  onClick={toggleRepeat}
                >
                  {nowPlaying.repeat === "one" ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
                </Button>
              </div>

              {/* Extra Controls */}
              <div className="flex items-center justify-center gap-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLike(nowPlaying.track.id)}
                >
                  <Heart className={`h-6 w-6 ${nowPlaying.track.isLiked ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <ListMusic className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  // Render main content based on active view
  const renderContent = () => {
    switch (activeView) {
      case "home":
        return renderHome()
      case "search":
        return renderSearch()
      case "library":
        return renderLibrary()
      case "playlist":
        return renderPlaylist()
      case "album":
        return renderAlbum()
      default:
        return renderHome()
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      {renderSidebar()}

      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-28">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 glass border-b border-border/30 p-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <Disc3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">SynthWave</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "search" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setActiveView("search")}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-[72px] left-0 right-0 glass border-t border-border/30 flex items-center justify-around py-2 z-40">
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeView === "home" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveView("home")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeView === "search" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveView("search")}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeView === "library" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveView("library")}
          >
            <Library className="h-5 w-5" />
            <span className="text-xs">Library</span>
          </Button>
        </div>

        {/* Content Area */}
        <ScrollArea className="h-[calc(100vh-72px)] md:h-[calc(100vh-96px)]">
          <div className="p-4 md:p-8">
            {/* Back Button for Detail Views */}
            {(activeView === "playlist" || activeView === "album") && (
              <Button
                variant="ghost"
                className="mb-4 gap-2"
                onClick={() => setActiveView("home")}
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Button>
            )}

            {renderContent()}
          </div>
        </ScrollArea>
      </main>

      {/* Queue Panel */}
      {renderQueue()}

      {/* Now Playing Bar - Desktop */}
      {renderNowPlayingBar()}

      {/* Mobile Player */}
      {renderMobilePlayer()}
    </div>
  )
}
