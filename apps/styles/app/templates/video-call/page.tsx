"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Camera,
  CameraOff,
  ChevronDown,
  Copy,
  Hand,
  Heart,
  Laugh,
  Link2,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  MoreHorizontal,
  Phone,
  Pin,
  Plus,
  Disc,
  Search,
  Send,
  Settings,
  ThumbsUp,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// TypeScript Interfaces
interface Participant {
  id: string
  name: string
  avatar?: string
  isMuted: boolean
  isVideoOn: boolean
  isHost: boolean
  isScreenSharing: boolean
  isHandRaised: boolean
  isSpeaking: boolean
}

interface Meeting {
  id: string
  title: string
  hostId: string
  startTime: string
  participants: Participant[]
  isRecording: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "reaction"
}

interface MeetingSettings {
  audioDevice: string
  videoDevice: string
  virtualBackground: string
  noiseSuppression: boolean
}

interface Reaction {
  id: string
  emoji: string
  participantName: string
  timestamp: number
}

export default function VideoCallPage() {
  // Meeting State
  const [meeting] = useState<Meeting>({
    id: "meet-abc-123-xyz",
    title: "Weekly Team Standup",
    hostId: "user-1",
    startTime: new Date(Date.now() - 1000 * 60 * 23).toISOString(),
    participants: [],
    isRecording: true,
  })

  // Participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "user-1",
      name: "You",
      avatar: undefined,
      isMuted: false,
      isVideoOn: true,
      isHost: true,
      isScreenSharing: false,
      isHandRaised: false,
      isSpeaking: false,
    },
    {
      id: "user-2",
      name: "Sarah Chen",
      avatar: undefined,
      isMuted: false,
      isVideoOn: true,
      isHost: false,
      isScreenSharing: false,
      isHandRaised: false,
      isSpeaking: true,
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      avatar: undefined,
      isMuted: true,
      isVideoOn: true,
      isHost: false,
      isScreenSharing: false,
      isHandRaised: true,
      isSpeaking: false,
    },
    {
      id: "user-4",
      name: "Emily Davis",
      avatar: undefined,
      isMuted: false,
      isVideoOn: false,
      isHost: false,
      isScreenSharing: false,
      isHandRaised: false,
      isSpeaking: false,
    },
    {
      id: "user-5",
      name: "Alex Rivera",
      avatar: undefined,
      isMuted: true,
      isVideoOn: true,
      isHost: false,
      isScreenSharing: false,
      isHandRaised: false,
      isSpeaking: false,
    },
    {
      id: "user-6",
      name: "Jordan Lee",
      avatar: undefined,
      isMuted: false,
      isVideoOn: true,
      isHost: false,
      isScreenSharing: true,
      isHandRaised: false,
      isSpeaking: false,
    },
  ])

  // Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      senderId: "user-2",
      senderName: "Sarah Chen",
      content: "Good morning everyone!",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      type: "text",
    },
    {
      id: "msg-2",
      senderId: "user-3",
      senderName: "Mike Johnson",
      content: "Morning! Ready to discuss the Q4 roadmap?",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      type: "text",
    },
    {
      id: "msg-3",
      senderId: "user-4",
      senderName: "Emily Davis",
      content: "Yes! I have some updates on the design system.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      type: "text",
    },
    {
      id: "msg-4",
      senderId: "user-6",
      senderName: "Jordan Lee",
      content: "Let me share my screen with the latest mockups",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      type: "text",
    },
  ])

  // UI State
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [spotlightParticipant, setSpotlightParticipant] = useState<string | null>("user-6")
  const [newMessage, setNewMessage] = useState("")
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [elapsedTime, setElapsedTime] = useState("23:45")
  const [viewMode, setViewMode] = useState<"grid" | "spotlight">("spotlight")

  // Settings
  const [settings, setSettings] = useState<MeetingSettings>({
    audioDevice: "default",
    videoDevice: "default",
    virtualBackground: "none",
    noiseSuppression: true,
  })

  // Elapsed time counter
  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(meeting.startTime).getTime()
      const now = Date.now()
      const diff = now - start
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setElapsedTime(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [meeting.startTime])

  // Simulate speaking indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: p.id === "user-2" ? Math.random() > 0.3 : Math.random() > 0.9,
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user-1",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    }
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  // Send reaction
  const sendReaction = (emoji: string) => {
    const reaction: Reaction = {
      id: `reaction-${Date.now()}`,
      emoji,
      participantName: "You",
      timestamp: Date.now(),
    }
    setReactions((prev) => [...prev, reaction])
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id))
    }, 3000)
  }

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get grid columns based on participant count
  const getGridCols = (count: number) => {
    if (count <= 1) return "grid-cols-1"
    if (count <= 2) return "grid-cols-1 md:grid-cols-2"
    if (count <= 4) return "grid-cols-2"
    if (count <= 6) return "grid-cols-2 md:grid-cols-3"
    if (count <= 9) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  }

  // Reaction emojis
  const reactionEmojis = [
    { emoji: "👍", label: "Thumbs up" },
    { emoji: "👏", label: "Clap" },
    { emoji: "😂", label: "Laugh" },
    { emoji: "❤️", label: "Heart" },
    { emoji: "✋", label: "Raise hand" },
    { emoji: "🎉", label: "Celebrate" },
  ]

  // Video tile component
  const VideoTile = ({
    participant,
    isLarge = false,
    isSelf = false,
  }: {
    participant: Participant
    isLarge?: boolean
    isSelf?: boolean
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative rounded-xl overflow-hidden ${
        isLarge ? "aspect-video" : "aspect-video"
      } ${
        participant.isSpeaking
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : ""
      } ${isSelf ? "glass border-primary/30" : "glass-dark border-muted/30"}`}
    >
      {/* Video placeholder */}
      {participant.isVideoOn ? (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
          <Avatar className={isLarge ? "h-24 w-24" : "h-16 w-16"}>
            <AvatarImage src={participant.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-xl">
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
          <Avatar className={isLarge ? "h-24 w-24" : "h-16 w-16"}>
            <AvatarFallback className="bg-muted text-muted-foreground text-xl">
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Screen sharing indicator */}
      {participant.isScreenSharing && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
          <Monitor className="h-12 w-12 text-primary mb-2" />
          <span className="text-sm text-foreground font-medium">
            {participant.name} is sharing
          </span>
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium text-foreground truncate max-w-[120px] md:max-w-[200px]">
              {participant.name}
              {participant.isHost && (
                <Badge className="ml-2 bg-primary/20 text-primary border-primary/30 text-[10px]">
                  Host
                </Badge>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {participant.isHandRaised && (
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Hand className="h-4 w-4 text-amber-400" />
              </motion.div>
            )}
            {participant.isMuted ? (
              <MicOff className="h-4 w-4 text-red-400" />
            ) : (
              participant.isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Volume2 className="h-4 w-4 text-primary" />
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Pin button */}
      {!isSelf && (
        <button
          onClick={() =>
            setSpotlightParticipant(
              spotlightParticipant === participant.id ? null : participant.id
            )
          }
          className="absolute top-2 right-2 p-1.5 rounded-full glass opacity-0 group-hover:opacity-100 hover:bg-primary/20 transition-all"
        >
          <Pin
            className={`h-3 w-3 ${
              spotlightParticipant === participant.id
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      )}
    </motion.div>
  )

  const spotlightedParticipant = participants.find(
    (p) => p.id === spotlightParticipant
  )
  const otherParticipants = participants.filter(
    (p) => p.id !== spotlightParticipant && p.id !== "user-1"
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-b border-border/30 px-4 py-3 flex items-center justify-between z-10"
        >
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm md:text-lg font-semibold text-foreground truncate max-w-[150px] md:max-w-none">
                {meeting.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{elapsedTime}</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="hidden sm:inline">{meeting.id}</span>
              </div>
            </div>
            {meeting.isRecording && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1 hidden sm:flex">
                <Disc className="h-3 w-3 animate-pulse" />
                Recording
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass border-border/30 text-muted-foreground hover:text-foreground"
                  onClick={() => navigator.clipboard.writeText(meeting.id)}
                >
                  <Copy className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Copy Link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy meeting link</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              size="sm"
              className="glass border-border/30"
              onClick={() => setViewMode(viewMode === "grid" ? "spotlight" : "grid")}
            >
              {viewMode === "grid" ? "Spotlight" : "Grid"}
            </Button>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Area */}
          <div className="flex-1 p-2 md:p-4 flex flex-col gap-2 md:gap-4">
            {viewMode === "spotlight" && spotlightedParticipant ? (
              <>
                {/* Spotlight View */}
                <div className="flex-1 min-h-0">
                  <VideoTile participant={spotlightedParticipant} isLarge />
                </div>

                {/* Thumbnail Strip */}
                <ScrollArea className="w-full">
                  <div className="flex gap-2 pb-2">
                    {otherParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="w-32 md:w-48 flex-shrink-0 group cursor-pointer"
                        onClick={() => setSpotlightParticipant(participant.id)}
                      >
                        <VideoTile participant={participant} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              /* Grid View */
              <div
                className={`flex-1 grid ${getGridCols(
                  participants.length
                )} gap-2 md:gap-4 auto-rows-fr`}
              >
                {participants.map((participant) => (
                  <div key={participant.id} className="group">
                    <VideoTile
                      participant={participant}
                      isSelf={participant.id === "user-1"}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Self Preview (when in spotlight mode) */}
            {viewMode === "spotlight" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-24 right-4 md:bottom-28 md:right-8 w-32 md:w-48 z-20"
              >
                <VideoTile
                  participant={participants[0]}
                  isSelf
                />
              </motion.div>
            )}
          </div>

          {/* Chat Sidebar (Desktop) */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:flex flex-col glass-dark border-l border-border/30"
              >
                <div className="p-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">In-call messages</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowChat(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${
                          msg.senderId === "user-1" ? "ml-8" : "mr-8"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.senderId !== "user-1" && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                {getInitials(msg.senderName)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              msg.senderId === "user-1"
                                ? "bg-primary/20 text-foreground ml-auto"
                                : "glass text-foreground"
                            }`}
                          >
                            {msg.senderId !== "user-1" && (
                              <p className="text-xs text-muted-foreground mb-1">
                                {msg.senderName}
                              </p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/30">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Send a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="glass border-border/30 text-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                      size="icon"
                      onClick={sendMessage}
                      className="bg-primary hover:bg-primary/80 text-primary-foreground"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Participants Sidebar (Desktop) */}
          <AnimatePresence>
            {showParticipants && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:flex flex-col glass-dark border-l border-border/30"
              >
                <div className="p-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">
                    Participants ({participants.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowParticipants(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg glass hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-sm">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {participant.name}
                              {participant.isHost && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  (Host)
                                </span>
                              )}
                            </p>
                            {participant.isScreenSharing && (
                              <p className="text-xs text-secondary">
                                Presenting
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {participant.isHandRaised && (
                            <Hand className="h-4 w-4 text-amber-400" />
                          )}
                          {participant.isMuted ? (
                            <MicOff className="h-4 w-4 text-red-400" />
                          ) : (
                            <Mic className="h-4 w-4 text-muted-foreground" />
                          )}
                          {participant.isVideoOn ? (
                            <Camera className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CameraOff className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    className="w-full glass border-border/30 text-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Invite People
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Reactions */}
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-30">
          <AnimatePresence>
            {reactions.map((reaction) => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.5 }}
                className="text-4xl"
              >
                {reaction.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-t border-border/30 px-4 py-3 flex items-center justify-center gap-2 md:gap-4 z-20"
        >
          {/* Mute */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className={
                  isMuted
                    ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                    : "glass border-border/30 text-foreground hover:bg-primary/10"
                }
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
          </Tooltip>

          {/* Video */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={!isVideoOn ? "destructive" : "outline"}
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={
                  !isVideoOn
                    ? "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                    : "glass border-border/30 text-foreground hover:bg-primary/10"
                }
              >
                {isVideoOn ? (
                  <Camera className="h-5 w-5" />
                ) : (
                  <CameraOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVideoOn ? "Turn off camera" : "Turn on camera"}
            </TooltipContent>
          </Tooltip>

          {/* Screen Share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="icon"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={
                  isScreenSharing
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "glass border-border/30 text-foreground hover:bg-primary/10"
                }
              >
                {isScreenSharing ? (
                  <MonitorOff className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isScreenSharing ? "Stop sharing" : "Share screen"}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8 hidden md:block" />

          {/* Reactions */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="glass border-border/30 text-foreground hover:bg-primary/10"
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className="glass border-border/30 w-auto p-2"
            >
              <div className="flex gap-1">
                {reactionEmojis.map(({ emoji, label }) => (
                  <Tooltip key={emoji}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => sendReaction(emoji)}
                        className="text-xl hover:bg-primary/10"
                      >
                        {emoji}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Chat */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showChat ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  setShowChat(!showChat)
                  setShowParticipants(false)
                }}
                className={
                  showChat
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "glass border-border/30 text-foreground hover:bg-primary/10"
                }
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat</TooltipContent>
          </Tooltip>

          {/* Participants */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showParticipants ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  setShowParticipants(!showParticipants)
                  setShowChat(false)
                }}
                className={
                  showParticipants
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "glass border-border/30 text-foreground hover:bg-primary/10"
                }
              >
                <Users className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Participants</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8 hidden md:block" />

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="glass border-border/30 text-foreground hover:bg-primary/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          {/* Leave Call */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6"
              >
                <Phone className="h-5 w-5 rotate-135" />
                <span className="ml-2 hidden md:inline">Leave</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Leave call</TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Mobile Chat Sheet */}
        <Sheet open={showChat} onOpenChange={setShowChat}>
          <SheetContent side="bottom" className="md:hidden glass-dark border-border/30 h-[70vh]">
            <SheetHeader>
              <SheetTitle className="text-foreground">In-call messages</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 py-4 h-[calc(70vh-140px)]">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${msg.senderId === "user-1" ? "ml-8" : "mr-8"}`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.senderId !== "user-1" && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/20 text-primary">
                            {getInitials(msg.senderName)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg p-3 ${
                          msg.senderId === "user-1"
                            ? "bg-primary/20 text-foreground ml-auto"
                            : "glass text-foreground"
                        }`}
                      >
                        {msg.senderId !== "user-1" && (
                          <p className="text-xs text-muted-foreground mb-1">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <div className="pt-4 border-t border-border/30">
              <div className="flex gap-2">
                <Input
                  placeholder="Send a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="glass border-border/30 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Participants Sheet */}
        <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
          <SheetContent side="bottom" className="md:hidden glass-dark border-border/30 h-[70vh]">
            <SheetHeader>
              <SheetTitle className="text-foreground">
                Participants ({participants.length})
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 py-4 h-[calc(70vh-140px)]">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg glass"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {participant.name}
                          {participant.isHost && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (Host)
                            </span>
                          )}
                        </p>
                        {participant.isScreenSharing && (
                          <p className="text-xs text-secondary">Presenting</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.isHandRaised && (
                        <Hand className="h-4 w-4 text-amber-400" />
                      )}
                      {participant.isMuted ? (
                        <MicOff className="h-4 w-4 text-red-400" />
                      ) : (
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      )}
                      {participant.isVideoOn ? (
                        <Camera className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <CameraOff className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <div className="pt-4 border-t border-border/30">
              <Button
                variant="outline"
                className="w-full glass border-border/30 text-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite People
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Settings Sheet */}
        <Sheet open={showSettings} onOpenChange={setShowSettings}>
          <SheetContent className="glass-dark border-border/30">
            <SheetHeader>
              <SheetTitle className="text-foreground">Settings</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              {/* Audio Device */}
              <div className="space-y-2">
                <Label className="text-foreground">Microphone</Label>
                <Select
                  value={settings.audioDevice}
                  onValueChange={(v) =>
                    setSettings({ ...settings, audioDevice: v })
                  }
                >
                  <SelectTrigger className="glass border-border/30 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-border/30">
                    <SelectItem value="default">Default Microphone</SelectItem>
                    <SelectItem value="headset">Headset Microphone</SelectItem>
                    <SelectItem value="webcam">Webcam Microphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Video Device */}
              <div className="space-y-2">
                <Label className="text-foreground">Camera</Label>
                <Select
                  value={settings.videoDevice}
                  onValueChange={(v) =>
                    setSettings({ ...settings, videoDevice: v })
                  }
                >
                  <SelectTrigger className="glass border-border/30 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-border/30">
                    <SelectItem value="default">Default Camera</SelectItem>
                    <SelectItem value="webcam">HD Webcam</SelectItem>
                    <SelectItem value="external">External Camera</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Virtual Background */}
              <div className="space-y-2">
                <Label className="text-foreground">Virtual Background</Label>
                <Select
                  value={settings.virtualBackground}
                  onValueChange={(v) =>
                    setSettings({ ...settings, virtualBackground: v })
                  }
                >
                  <SelectTrigger className="glass border-border/30 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-border/30">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="blur">Blur</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-border/30" />

              {/* Noise Suppression */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Noise Suppression</Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce background noise
                  </p>
                </div>
                <Switch
                  checked={settings.noiseSuppression}
                  onCheckedChange={(v) =>
                    setSettings({ ...settings, noiseSuppression: v })
                  }
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  )
}
