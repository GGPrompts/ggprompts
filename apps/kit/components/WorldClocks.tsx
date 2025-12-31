"use client"

import * as React from "react"
import { Clock, Plus, X, Settings2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

// ============================================================================
// TIMEZONE DATA
// ============================================================================

interface TimezoneInfo {
  id: string
  label: string
  city: string
  offset: string
}

const POPULAR_TIMEZONES: TimezoneInfo[] = [
  { id: "UTC", label: "UTC", city: "UTC", offset: "UTC+0" },
  { id: "America/New_York", label: "Eastern", city: "New York", offset: "EST/EDT" },
  { id: "America/Chicago", label: "Central", city: "Chicago", offset: "CST/CDT" },
  { id: "America/Denver", label: "Mountain", city: "Denver", offset: "MST/MDT" },
  { id: "America/Los_Angeles", label: "Pacific", city: "Los Angeles", offset: "PST/PDT" },
  { id: "America/Anchorage", label: "Alaska", city: "Anchorage", offset: "AKST/AKDT" },
  { id: "Pacific/Honolulu", label: "Hawaii", city: "Honolulu", offset: "HST" },
  { id: "Europe/London", label: "UK", city: "London", offset: "GMT/BST" },
  { id: "Europe/Paris", label: "Central Europe", city: "Paris", offset: "CET/CEST" },
  { id: "Europe/Berlin", label: "Germany", city: "Berlin", offset: "CET/CEST" },
  { id: "Europe/Moscow", label: "Moscow", city: "Moscow", offset: "MSK" },
  { id: "Asia/Dubai", label: "Gulf", city: "Dubai", offset: "GST" },
  { id: "Asia/Kolkata", label: "India", city: "Mumbai", offset: "IST" },
  { id: "Asia/Singapore", label: "Singapore", city: "Singapore", offset: "SGT" },
  { id: "Asia/Shanghai", label: "China", city: "Shanghai", offset: "CST" },
  { id: "Asia/Tokyo", label: "Japan", city: "Tokyo", offset: "JST" },
  { id: "Asia/Seoul", label: "Korea", city: "Seoul", offset: "KST" },
  { id: "Australia/Sydney", label: "Australia East", city: "Sydney", offset: "AEST/AEDT" },
  { id: "Australia/Perth", label: "Australia West", city: "Perth", offset: "AWST" },
  { id: "Pacific/Auckland", label: "New Zealand", city: "Auckland", offset: "NZST/NZDT" },
  { id: "America/Sao_Paulo", label: "Brazil", city: "São Paulo", offset: "BRT" },
]

const STORAGE_KEY = "world-clocks"

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatTime(timezone: string): string {
  try {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } catch {
    return "--:--"
  }
}

function formatDate(timezone: string): string {
  try {
    return new Date().toLocaleDateString("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  } catch {
    return ""
  }
}

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

function loadSavedTimezones(): string[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Invalid JSON
  }
  // Default: local + a couple common ones
  const local = getLocalTimezone()
  const defaults = ["America/New_York", "Europe/London", "Asia/Tokyo"]
  return [local, ...defaults.filter((tz) => tz !== local)].slice(0, 4)
}

function saveTimezones(timezones: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones))
}

// ============================================================================
// CLOCK DISPLAY COMPONENT
// ============================================================================

function ClockDisplay({
  timezone,
  onRemove,
  isLocal,
}: {
  timezone: string
  onRemove?: () => void
  isLocal?: boolean
}) {
  const [time, setTime] = React.useState(formatTime(timezone))
  const [date, setDate] = React.useState(formatDate(timezone))

  const tzInfo = POPULAR_TIMEZONES.find((tz) => tz.id === timezone)
  const displayName = tzInfo?.city || timezone.split("/").pop()?.replace(/_/g, " ") || timezone

  // Update time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(timezone))
      setDate(formatDate(timezone))
    }, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  return (
    <div className="group relative flex flex-col items-center p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors min-w-[100px]">
      {/* Remove button */}
      {onRemove && !isLocal && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-red-500/20 hover:text-red-400"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* City name */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        {isLocal && <Globe className="h-3 w-3" />}
        <span className="truncate max-w-[80px]">{displayName}</span>
      </div>

      {/* Time */}
      <div className="text-xl font-mono font-semibold text-foreground" suppressHydrationWarning>
        {time}
      </div>

      {/* Date */}
      <div className="text-xs text-muted-foreground" suppressHydrationWarning>
        {date}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function WorldClocks() {
  const [timezones, setTimezones] = React.useState<string[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [selectedTz, setSelectedTz] = React.useState("")
  const localTz = React.useMemo(() => getLocalTimezone(), [])

  // Load saved timezones
  React.useEffect(() => {
    setTimezones(loadSavedTimezones())
    setIsLoaded(true)
  }, [])

  // Save when timezones change
  React.useEffect(() => {
    if (isLoaded) {
      saveTimezones(timezones)
    }
  }, [timezones, isLoaded])

  const addTimezone = () => {
    if (selectedTz && !timezones.includes(selectedTz)) {
      setTimezones((prev) => [...prev, selectedTz])
      setSelectedTz("")
    }
  }

  const removeTimezone = (tz: string) => {
    setTimezones((prev) => prev.filter((t) => t !== tz))
  }

  // Filter out already-added timezones from the select
  const availableTimezones = POPULAR_TIMEZONES.filter(
    (tz) => !timezones.includes(tz.id)
  )

  if (!isLoaded) {
    return (
      <Card className="glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">World Clocks</h3>
        </div>
        <div className="animate-pulse flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 w-24 bg-muted/20 rounded-lg" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">World Clocks</h3>
        </div>

        {/* Add timezone popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 glass border-white/10" align="end">
            <div className="space-y-3">
              <h4 className="font-medium">Add Timezone</h4>
              <div className="flex gap-2">
                <Select value={selectedTz} onValueChange={setSelectedTz}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimezones.map((tz) => (
                      <SelectItem key={tz.id} value={tz.id}>
                        {tz.city} ({tz.offset})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" onClick={addTimezone} disabled={!selectedTz}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the X on a clock to remove it. Your local timezone cannot be removed.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Clocks grid */}
      <div className="flex flex-wrap gap-2">
        {timezones.map((tz) => (
          <ClockDisplay
            key={tz}
            timezone={tz}
            onRemove={() => removeTimezone(tz)}
            isLocal={tz === localTz}
          />
        ))}
        {timezones.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">
            No clocks configured. Click the settings icon to add timezones.
          </p>
        )}
      </div>
    </Card>
  )
}
