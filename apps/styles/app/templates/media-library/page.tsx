"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Plus,
  Info,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Clock,
  Star,
  Calendar,
  Users,
  Volume2,
  VolumeX,
  ThumbsUp,
  ChevronDown,
  Film,
  Tv,
  Sparkles,
  TrendingUp,
  Heart,
  Filter,
} from "lucide-react"
import { Card, Button, Badge, Dialog, DialogContent, DialogTitle, Tabs, TabsContent, TabsList, TabsTrigger, Progress, ScrollArea, ScrollBar, Input, Separator } from "@ggprompts/ui"

// TypeScript Interfaces
interface Episode {
  number: number
  title: string
  description: string
  duration: number
  thumbnail: string
}

interface Season {
  number: number
  episodes: Episode[]
}

interface Content {
  id: string
  title: string
  type: "movie" | "series"
  poster: string
  backdrop: string
  description: string
  releaseYear: number
  rating: string
  duration?: number
  seasons?: Season[]
  genres: string[]
  cast: string[]
  isInMyList: boolean
  progress?: { season: number; episode: number; percent: number }
  matchScore?: number
}

interface ContentRow {
  title: string
  items: Content[]
  type: "standard" | "top10" | "continue"
}

// Mock Data
const generateEpisodes = (count: number): Episode[] =>
  Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    title: `Episode ${i + 1}: ${["The Beginning", "Rising Tension", "Discovery", "Revelation", "Climax", "Resolution", "New Horizons", "Dark Secrets", "Turning Point", "Finale"][i % 10]}`,
    description: "When unexpected events unfold, our characters must navigate through challenges that will change everything they know.",
    duration: Math.floor(Math.random() * 20) + 40,
    thumbnail: `/api/placeholder/320/180`,
  }))

const generateSeasons = (count: number): Season[] =>
  Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    episodes: generateEpisodes(Math.floor(Math.random() * 5) + 8),
  }))

const mockContent: Content[] = [
  {
    id: "1",
    title: "Cosmic Odyssey",
    type: "series",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "In a distant future where humanity has colonized the stars, a crew of unlikely heroes embarks on an epic journey across the galaxy to uncover the truth behind an ancient alien civilization.",
    releaseYear: 2024,
    rating: "TV-MA",
    seasons: generateSeasons(3),
    genres: ["Sci-Fi", "Adventure", "Drama"],
    cast: ["Alex Rivera", "Sarah Chen", "Marcus Drake", "Elena Voss"],
    isInMyList: true,
    progress: { season: 2, episode: 5, percent: 45 },
    matchScore: 98,
  },
  {
    id: "2",
    title: "The Last Detective",
    type: "movie",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "A burned-out detective takes on one final case that will challenge everything he thought he knew about justice, truth, and redemption.",
    releaseYear: 2024,
    rating: "R",
    duration: 142,
    genres: ["Thriller", "Mystery", "Crime"],
    cast: ["James Morrison", "Linda Park", "Tom Reyes"],
    isInMyList: false,
    matchScore: 95,
  },
  {
    id: "3",
    title: "Neon Dreams",
    type: "series",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "In a cyberpunk metropolis where reality and virtual worlds collide, a young hacker discovers a conspiracy that threatens the fabric of existence itself.",
    releaseYear: 2023,
    rating: "TV-14",
    seasons: generateSeasons(2),
    genres: ["Sci-Fi", "Action", "Cyberpunk"],
    cast: ["Yuki Tanaka", "David Kim", "Rachel Stone"],
    isInMyList: true,
    progress: { season: 1, episode: 8, percent: 72 },
    matchScore: 92,
  },
  {
    id: "4",
    title: "Whispers in the Dark",
    type: "movie",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "A family moves into an old Victorian mansion, only to discover that some secrets are better left buried in the shadows.",
    releaseYear: 2024,
    rating: "PG-13",
    duration: 118,
    genres: ["Horror", "Thriller", "Supernatural"],
    cast: ["Emma Stone", "Michael B. Jordan", "Zoe Kravitz"],
    isInMyList: false,
    matchScore: 88,
  },
  {
    id: "5",
    title: "The Crown's Shadow",
    type: "series",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "In medieval Europe, political intrigue and forbidden romance intertwine as rival houses vie for control of a fractured kingdom.",
    releaseYear: 2023,
    rating: "TV-MA",
    seasons: generateSeasons(4),
    genres: ["Drama", "Historical", "Fantasy"],
    cast: ["Helena Bonham Carter", "Kit Harington", "Emilia Clarke"],
    isInMyList: false,
    matchScore: 96,
  },
  {
    id: "6",
    title: "Velocity",
    type: "movie",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "An underground street racing champion must outrun the law and criminal syndicates in a high-octane chase across three continents.",
    releaseYear: 2024,
    rating: "PG-13",
    duration: 128,
    genres: ["Action", "Thriller", "Crime"],
    cast: ["Vin Diesel", "Gal Gadot", "Jason Statham"],
    isInMyList: true,
    progress: { season: 1, episode: 1, percent: 30 },
    matchScore: 85,
  },
  {
    id: "7",
    title: "The Algorithm",
    type: "series",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "A tech startup's revolutionary AI begins to exhibit disturbing behaviors, leading its creators down a rabbit hole of ethical dilemmas and existential threats.",
    releaseYear: 2024,
    rating: "TV-14",
    seasons: generateSeasons(1),
    genres: ["Sci-Fi", "Thriller", "Tech"],
    cast: ["Oscar Isaac", "Tessa Thompson", "John Boyega"],
    isInMyList: false,
    matchScore: 94,
  },
  {
    id: "8",
    title: "Eternal Summer",
    type: "movie",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "A heartfelt coming-of-age story about four friends navigating their last summer together before college changes everything.",
    releaseYear: 2023,
    rating: "PG-13",
    duration: 112,
    genres: ["Drama", "Romance", "Coming-of-Age"],
    cast: ["Timothée Chalamet", "Zendaya", "Florence Pugh"],
    isInMyList: true,
    matchScore: 91,
  },
  {
    id: "9",
    title: "Arctic Station",
    type: "series",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "Scientists at a remote Arctic research station face an unknown entity that emerges from the melting permafrost, threatening all of humanity.",
    releaseYear: 2024,
    rating: "TV-MA",
    seasons: generateSeasons(2),
    genres: ["Horror", "Sci-Fi", "Thriller"],
    cast: ["Joel Kinnaman", "Noomi Rapace", "Alexander Skarsgård"],
    isInMyList: false,
    matchScore: 89,
  },
  {
    id: "10",
    title: "The Inheritance",
    type: "movie",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "When a wealthy patriarch dies under mysterious circumstances, his estranged family gathers for the reading of his will, only to find themselves trapped in a deadly game.",
    releaseYear: 2024,
    rating: "R",
    duration: 135,
    genres: ["Mystery", "Thriller", "Drama"],
    cast: ["Daniel Craig", "Ana de Armas", "Chris Evans"],
    isInMyList: false,
    matchScore: 97,
  },
  {
    id: "11",
    title: "Quantum Break",
    type: "movie",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "A physicist discovers a way to manipulate time, but his experiments attract the attention of powerful forces who will stop at nothing to control this power.",
    releaseYear: 2024,
    rating: "PG-13",
    duration: 148,
    genres: ["Sci-Fi", "Action", "Thriller"],
    cast: ["Tom Holland", "Robert Downey Jr.", "Scarlett Johansson"],
    isInMyList: true,
    matchScore: 93,
  },
  {
    id: "12",
    title: "Street Food Stories",
    type: "series",
    poster: "/api/placeholder/200/300",
    backdrop: "/api/placeholder/1920/1080",
    description: "A culinary journey through the world's most vibrant street food scenes, exploring the stories behind the vendors and their legendary dishes.",
    releaseYear: 2023,
    rating: "TV-G",
    seasons: generateSeasons(3),
    genres: ["Documentary", "Food", "Travel"],
    cast: ["Host: Anthony Bourdain Jr."],
    isInMyList: false,
    matchScore: 87,
  },
]

// Content Rows
const contentRows: ContentRow[] = [
  {
    title: "Continue Watching",
    type: "continue",
    items: mockContent.filter((c) => c.progress),
  },
  {
    title: "Top 10 in Your Country Today",
    type: "top10",
    items: mockContent.slice(0, 10),
  },
  {
    title: "Trending Now",
    type: "standard",
    items: [...mockContent].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)),
  },
  {
    title: "Sci-Fi & Fantasy",
    type: "standard",
    items: mockContent.filter((c) => c.genres.some((g) => ["Sci-Fi", "Fantasy"].includes(g))),
  },
  {
    title: "Critically Acclaimed",
    type: "standard",
    items: mockContent.filter((c) => (c.matchScore || 0) > 90),
  },
  {
    title: "Action & Thriller",
    type: "standard",
    items: mockContent.filter((c) => c.genres.some((g) => ["Action", "Thriller"].includes(g))),
  },
  {
    title: "New Releases",
    type: "standard",
    items: mockContent.filter((c) => c.releaseYear === 2024),
  },
]

// Content Card Component
function ContentCard({
  content,
  index,
  type,
  onSelect,
  onToggleList,
}: {
  content: Content
  index?: number
  type: "standard" | "top10" | "continue"
  onSelect: (content: Content) => void
  onToggleList: (id: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative flex-shrink-0 cursor-pointer ${
        type === "top10" ? "w-32 md:w-40" : "w-36 md:w-48"
      }`}
      style={{ zIndex: isHovered ? 20 : 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.2 }}
    >
      {type === "top10" && index !== undefined && (
        <div className="absolute -left-4 md:-left-6 bottom-0 z-10">
          <span
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text"
            style={{
              WebkitTextStroke: "2px hsl(var(--primary))",
            }}
          >
            {index + 1}
          </span>
        </div>
      )}

      <Card
        className={`glass overflow-hidden transition-all duration-200 ${type === "top10" ? "ml-4 md:ml-6" : ""} ${isHovered ? "border-primary/50 shadow-lg shadow-primary/20" : ""}`}
        onClick={() => onSelect(content)}
      >
        <div className="relative aspect-[2/3]">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-12 w-12 text-muted-foreground/30" />
          </div>

          {type === "continue" && content.progress && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress
                value={content.progress.percent}
                className="h-1 rounded-none"
              />
            </div>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 p-3 flex flex-col justify-end"
              >
                <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
                  {content.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="text-primary">{content.matchScore}% Match</span>
                  <span>{content.releaseYear}</span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {content.rating}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {content.description}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(content)
                    }}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleList(content.id)
                    }}
                  >
                    {content.isInMyList ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(content)
                    }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {type === "continue" && content.progress && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          S{content.progress.season}:E{content.progress.episode}
        </p>
      )}
    </motion.div>
  )
}

// Content Row Component
function ContentRowComponent({
  row,
  onSelectContent,
  onToggleList,
}: {
  row: ContentRow
  onSelectContent: (content: Content) => void
  onToggleList: (id: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0)
      setShowRightArrow(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
      )
    }
  }

  useEffect(() => {
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener("scroll", handleScroll)
      handleScroll()
      return () => ref.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="relative group">
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1 px-4 md:px-12">
        {row.title}
      </h2>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-4 bottom-8 z-30 w-12 bg-gradient-to-r from-background to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {row.items.map((content, index) => (
            <ContentCard
              key={content.id}
              content={content}
              index={index}
              type={row.type}
              onSelect={onSelectContent}
              onToggleList={onToggleList}
            />
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-4 bottom-8 z-30 w-12 bg-gradient-to-l from-background to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8 text-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}

// Content Detail Modal
function ContentDetailModal({
  content,
  isOpen,
  onClose,
  onToggleList,
}: {
  content: Content | null
  isOpen: boolean
  onClose: () => void
  onToggleList: (id: string) => void
}) {
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [isMuted, setIsMuted] = useState(true)

  if (!content) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-background border-border overflow-hidden max-h-[90vh]">
        <DialogTitle className="sr-only">{content.title}</DialogTitle>
        <ScrollArea className="max-h-[90vh]">
          {/* Hero Section */}
          <div className="relative h-64 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="h-24 w-24 text-muted-foreground/20" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 rounded-full bg-background/50 hover:bg-background/80"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            <div className="absolute bottom-8 left-6 md:left-10 right-6 md:right-10">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {content.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Button className="gap-2">
                  <Play className="h-5 w-5" />
                  <span className="hidden sm:inline">Play</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => onToggleList(content.id)}
                >
                  {content.isInMyList ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="hidden sm:inline">In My List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span className="hidden sm:inline">My List</span>
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Info */}
          <div className="p-6 md:p-10 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-primary font-semibold">
                    {content.matchScore}% Match
                  </span>
                  <span className="text-muted-foreground">{content.releaseYear}</span>
                  <Badge variant="outline">{content.rating}</Badge>
                  {content.type === "movie" && content.duration && (
                    <span className="text-muted-foreground">
                      {Math.floor(content.duration / 60)}h {content.duration % 60}m
                    </span>
                  )}
                  {content.type === "series" && content.seasons && (
                    <span className="text-muted-foreground">
                      {content.seasons.length} Season{content.seasons.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <p className="text-foreground leading-relaxed">{content.description}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Cast: </span>
                  <span className="text-foreground">{content.cast.join(", ")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Genres: </span>
                  <span className="text-foreground">{content.genres.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Episodes Section (for series) */}
            {content.type === "series" && content.seasons && (
              <div className="space-y-4">
                <Separator className="bg-border/50" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="text-xl font-semibold text-foreground">Episodes</h3>
                  <Tabs
                    value={selectedSeason.toString()}
                    onValueChange={(v) => setSelectedSeason(parseInt(v))}
                  >
                    <TabsList className="glass">
                      {content.seasons.map((season) => (
                        <TabsTrigger
                          key={season.number}
                          value={season.number.toString()}
                        >
                          Season {season.number}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-3">
                  {content.seasons
                    .find((s) => s.number === selectedSeason)
                    ?.episodes.map((episode) => (
                      <Card
                        key={episode.number}
                        className="glass p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative w-full sm:w-32 aspect-video sm:aspect-auto sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-foreground">
                                {episode.number}. {episode.title}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {episode.duration}m
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {episode.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* More Like This */}
            <div className="space-y-4">
              <Separator className="bg-border/50" />
              <h3 className="text-xl font-semibold text-foreground">More Like This</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mockContent
                  .filter((c) => c.id !== content.id)
                  .slice(0, 6)
                  .map((item) => (
                    <Card
                      key={item.id}
                      className="glass overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <div className="relative aspect-video">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-primary">
                            {item.matchScore}% Match
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.releaseYear}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// Main Component
export default function MediaLibrary() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [myList, setMyList] = useState<string[]>(
    mockContent.filter((c) => c.isInMyList).map((c) => c.id)
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "movies" | "series">("all")
  const [heroContent] = useState(mockContent[0])

  const toggleMyList = (id: string) => {
    setMyList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectContent = (content: Content) => {
    setSelectedContent({
      ...content,
      isInMyList: myList.includes(content.id),
    })
    setIsDetailOpen(true)
  }

  const filteredContent = mockContent.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "movies" && content.type === "movie") ||
      (activeFilter === "series" && content.type === "series")
    return matchesSearch && matchesFilter
  })

  const updatedRows = contentRows.map((row) => ({
    ...row,
    items: row.items.map((item) => ({
      ...item,
      isInMyList: myList.includes(item.id),
    })),
  }))

  const myListContent = mockContent
    .filter((c) => myList.includes(c.id))
    .map((c) => ({ ...c, isInMyList: true }))

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent"
      >
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          <div className="flex items-center gap-6 md:gap-8">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StreamX
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <button className="text-foreground hover:text-primary transition-colors">
                Home
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                TV Shows
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Movies
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                New & Popular
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                My List
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                >
                  <Input
                    autoFocus
                    placeholder="Titles, people, genres"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 md:w-64 bg-background/80 border-border"
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Hero Banner */}
      <section className="relative h-[70vh] md:h-[85vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-32 w-32 text-muted-foreground/10" />
        </div>

        <div className="absolute bottom-20 md:bottom-32 left-4 md:left-12 right-4 md:right-12 max-w-2xl z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              #1 in TV Shows Today
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              {heroContent.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 line-clamp-3">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => handleSelectContent(heroContent)}
              >
                <Play className="h-5 w-5" />
                Play
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => handleSelectContent(heroContent)}
              >
                <Info className="h-5 w-5" />
                More Info
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      <AnimatePresence>
        {searchQuery && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 md:px-12 py-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Search Results for "{searchQuery}"
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Tabs
                  value={activeFilter}
                  onValueChange={(v) => setActiveFilter(v as typeof activeFilter)}
                >
                  <TabsList className="glass">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="movies">
                      <Film className="h-3 w-3 mr-1" />
                      Movies
                    </TabsTrigger>
                    <TabsTrigger value="series">
                      <Tv className="h-3 w-3 mr-1" />
                      Series
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {filteredContent.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {filteredContent.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={{ ...content, isInMyList: myList.includes(content.id) }}
                    type="standard"
                    onSelect={handleSelectContent}
                    onToggleList={toggleMyList}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No results found</p>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Content Rows */}
      {!searchQuery && (
        <section className="relative -mt-32 md:-mt-48 pb-12 space-y-6 md:space-y-8">
          {updatedRows.map((row, idx) => (
            <motion.div
              key={row.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ContentRowComponent
                row={row}
                onSelectContent={handleSelectContent}
                onToggleList={toggleMyList}
              />
            </motion.div>
          ))}

          {/* My List */}
          {myListContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: updatedRows.length * 0.1 }}
            >
              <ContentRowComponent
                row={{
                  title: "My List",
                  type: "standard",
                  items: myListContent,
                }}
                onSelectContent={handleSelectContent}
                onToggleList={toggleMyList}
              />
            </motion.div>
          )}
        </section>
      )}

      {/* Categories Section */}
      {!searchQuery && (
        <section className="px-4 md:px-12 py-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Browse by Genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Action",
              "Comedy",
              "Drama",
              "Horror",
              "Sci-Fi",
              "Romance",
              "Thriller",
              "Documentary",
              "Fantasy",
              "Animation",
              "Crime",
              "Mystery",
            ].map((genre) => (
              <Card
                key={genre}
                className="glass p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <p className="text-foreground font-medium text-center group-hover:text-primary transition-colors">
                  {genre}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Content Detail Modal */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onToggleList={toggleMyList}
      />

      {/* Footer */}
      <footer className="px-4 md:px-12 py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Press</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Terms of Use</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Cookie Preferences</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">My Account</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Gift Cards</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Redeem</li>
              </ul>
            </div>
          </div>
          <Separator className="bg-border/50 mb-6" />
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} StreamX. All rights reserved. This is a demo template.
          </p>
        </div>
      </footer>
    </div>
  )
}
