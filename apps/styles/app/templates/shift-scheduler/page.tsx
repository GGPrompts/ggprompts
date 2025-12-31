"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Bell,
  Send,
  Copy,
  Trash2,
  Edit3,
  MapPin,
  Coffee,
  Moon,
  Sun,
  Sunrise,
  CalendarOff,
  UserCheck,
  AlertCircle,
  Filter,
  MoreVertical,
  ChevronDown,
} from "lucide-react"
import { Card, Button, Badge, Avatar, AvatarFallback, AvatarImage, ScrollArea, Separator, Progress, Tabs, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Label, Textarea, Popover, PopoverContent, PopoverTrigger, Checkbox } from "@ggprompts/ui"

// TypeScript Interfaces
interface Shift {
  id: string
  employeeId: string
  date: string
  startTime: string
  endTime: string
  role: string
  location?: string
  status: "draft" | "published" | "confirmed"
  notes?: string
  isOpenShift: boolean
}

interface Employee {
  id: string
  name: string
  avatar: string
  roles: string[]
  hoursThisWeek: number
  maxHours: number
  availability: Availability[]
  status: "available" | "busy" | "off"
}

interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
  isPreferred: boolean
}

interface TimeOffRequest {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "denied"
}

interface ShiftTemplate {
  id: string
  name: string
  startTime: string
  endTime: string
  role: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface Conflict {
  id: string
  type: "overtime" | "double-booking" | "availability" | "coverage"
  employeeId?: string
  message: string
  severity: "low" | "medium" | "high"
  date: string
}

// Role colors using CSS variables
const roleColors: Record<string, string> = {
  Manager: "bg-primary/20 text-primary border-primary/30",
  Cashier: "bg-secondary/20 text-secondary border-secondary/30",
  Server: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Cook: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Host: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Barista: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

// Helper functions
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const getShiftDuration = (startTime: string, endTime: string) => {
  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const duration = endMinutes - startMinutes
  return duration / 60
}

const getDayName = (dayIndex: number) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days[dayIndex]
}

const getFullDayName = (dayIndex: number) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayIndex]
}

export default function ShiftSchedulerDashboard() {
  // Current week state
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    return startOfWeek
  })

  // View mode
  const [viewMode, setViewMode] = useState<"week" | "day">("week")
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())

  // Dialog states
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedStartTime, setSelectedStartTime] = useState("09:00")
  const [selectedEndTime, setSelectedEndTime] = useState("17:00")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [shiftNotes, setShiftNotes] = useState("")
  const [isOpenShift, setIsOpenShift] = useState(false)

  // Employees data
  const [employees] = useState<Employee[]>([
    {
      id: "emp-1",
      name: "Sarah Johnson",
      avatar: "",
      roles: ["Manager", "Cashier"],
      hoursThisWeek: 32,
      maxHours: 40,
      status: "available",
      availability: [
        { dayOfWeek: 1, startTime: "08:00", endTime: "20:00", isPreferred: true },
        { dayOfWeek: 2, startTime: "08:00", endTime: "20:00", isPreferred: true },
        { dayOfWeek: 3, startTime: "08:00", endTime: "20:00", isPreferred: true },
        { dayOfWeek: 4, startTime: "08:00", endTime: "20:00", isPreferred: true },
        { dayOfWeek: 5, startTime: "08:00", endTime: "20:00", isPreferred: true },
      ],
    },
    {
      id: "emp-2",
      name: "Michael Chen",
      avatar: "",
      roles: ["Server", "Host"],
      hoursThisWeek: 28,
      maxHours: 40,
      status: "available",
      availability: [
        { dayOfWeek: 0, startTime: "10:00", endTime: "22:00", isPreferred: false },
        { dayOfWeek: 1, startTime: "10:00", endTime: "22:00", isPreferred: true },
        { dayOfWeek: 2, startTime: "10:00", endTime: "22:00", isPreferred: true },
        { dayOfWeek: 4, startTime: "10:00", endTime: "22:00", isPreferred: true },
        { dayOfWeek: 5, startTime: "10:00", endTime: "22:00", isPreferred: true },
        { dayOfWeek: 6, startTime: "10:00", endTime: "22:00", isPreferred: false },
      ],
    },
    {
      id: "emp-3",
      name: "Emily Rodriguez",
      avatar: "",
      roles: ["Cook"],
      hoursThisWeek: 36,
      maxHours: 40,
      status: "busy",
      availability: [
        { dayOfWeek: 1, startTime: "06:00", endTime: "18:00", isPreferred: true },
        { dayOfWeek: 2, startTime: "06:00", endTime: "18:00", isPreferred: true },
        { dayOfWeek: 3, startTime: "06:00", endTime: "18:00", isPreferred: true },
        { dayOfWeek: 4, startTime: "06:00", endTime: "18:00", isPreferred: true },
        { dayOfWeek: 5, startTime: "06:00", endTime: "18:00", isPreferred: true },
      ],
    },
    {
      id: "emp-4",
      name: "David Kim",
      avatar: "",
      roles: ["Barista", "Cashier"],
      hoursThisWeek: 20,
      maxHours: 32,
      status: "available",
      availability: [
        { dayOfWeek: 0, startTime: "07:00", endTime: "15:00", isPreferred: true },
        { dayOfWeek: 1, startTime: "07:00", endTime: "15:00", isPreferred: true },
        { dayOfWeek: 2, startTime: "07:00", endTime: "15:00", isPreferred: true },
        { dayOfWeek: 5, startTime: "07:00", endTime: "15:00", isPreferred: false },
        { dayOfWeek: 6, startTime: "07:00", endTime: "15:00", isPreferred: true },
      ],
    },
    {
      id: "emp-5",
      name: "Jessica Williams",
      avatar: "",
      roles: ["Server"],
      hoursThisWeek: 24,
      maxHours: 40,
      status: "off",
      availability: [
        { dayOfWeek: 3, startTime: "16:00", endTime: "23:00", isPreferred: true },
        { dayOfWeek: 4, startTime: "16:00", endTime: "23:00", isPreferred: true },
        { dayOfWeek: 5, startTime: "16:00", endTime: "23:00", isPreferred: true },
        { dayOfWeek: 6, startTime: "16:00", endTime: "23:00", isPreferred: true },
      ],
    },
    {
      id: "emp-6",
      name: "Alex Thompson",
      avatar: "",
      roles: ["Host", "Server"],
      hoursThisWeek: 16,
      maxHours: 24,
      status: "available",
      availability: [
        { dayOfWeek: 0, startTime: "11:00", endTime: "19:00", isPreferred: true },
        { dayOfWeek: 5, startTime: "17:00", endTime: "23:00", isPreferred: true },
        { dayOfWeek: 6, startTime: "11:00", endTime: "23:00", isPreferred: true },
      ],
    },
  ])

  // Shifts data
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)

    const generateDate = (dayOffset: number) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + dayOffset)
      return date.toISOString().split("T")[0]
    }

    return [
      { id: "s1", employeeId: "emp-1", date: generateDate(1), startTime: "08:00", endTime: "16:00", role: "Manager", location: "Main Floor", status: "published", isOpenShift: false },
      { id: "s2", employeeId: "emp-2", date: generateDate(1), startTime: "11:00", endTime: "19:00", role: "Server", location: "Main Floor", status: "confirmed", isOpenShift: false },
      { id: "s3", employeeId: "emp-3", date: generateDate(1), startTime: "06:00", endTime: "14:00", role: "Cook", location: "Kitchen", status: "confirmed", isOpenShift: false },
      { id: "s4", employeeId: "emp-4", date: generateDate(1), startTime: "07:00", endTime: "13:00", role: "Barista", location: "Coffee Bar", status: "published", isOpenShift: false },
      { id: "s5", employeeId: "emp-1", date: generateDate(2), startTime: "08:00", endTime: "16:00", role: "Manager", location: "Main Floor", status: "published", isOpenShift: false },
      { id: "s6", employeeId: "emp-2", date: generateDate(2), startTime: "16:00", endTime: "22:00", role: "Server", location: "Main Floor", status: "draft", isOpenShift: false },
      { id: "s7", employeeId: "emp-3", date: generateDate(2), startTime: "06:00", endTime: "14:00", role: "Cook", location: "Kitchen", status: "published", isOpenShift: false },
      { id: "s8", employeeId: "emp-4", date: generateDate(2), startTime: "07:00", endTime: "13:00", role: "Barista", location: "Coffee Bar", status: "confirmed", isOpenShift: false },
      { id: "s9", employeeId: "emp-1", date: generateDate(3), startTime: "09:00", endTime: "17:00", role: "Manager", location: "Main Floor", status: "draft", isOpenShift: false },
      { id: "s10", employeeId: "emp-3", date: generateDate(3), startTime: "06:00", endTime: "14:00", role: "Cook", location: "Kitchen", status: "published", isOpenShift: false },
      { id: "s11", employeeId: "emp-5", date: generateDate(3), startTime: "16:00", endTime: "23:00", role: "Server", location: "Main Floor", status: "confirmed", isOpenShift: false },
      { id: "s12", employeeId: "", date: generateDate(3), startTime: "11:00", endTime: "15:00", role: "Host", location: "Entrance", status: "draft", isOpenShift: true },
      { id: "s13", employeeId: "emp-1", date: generateDate(4), startTime: "08:00", endTime: "16:00", role: "Manager", location: "Main Floor", status: "published", isOpenShift: false },
      { id: "s14", employeeId: "emp-2", date: generateDate(4), startTime: "10:00", endTime: "18:00", role: "Server", location: "Main Floor", status: "published", isOpenShift: false },
      { id: "s15", employeeId: "emp-3", date: generateDate(4), startTime: "06:00", endTime: "14:00", role: "Cook", location: "Kitchen", status: "confirmed", isOpenShift: false },
      { id: "s16", employeeId: "emp-5", date: generateDate(4), startTime: "16:00", endTime: "23:00", role: "Server", location: "Main Floor", status: "draft", isOpenShift: false },
      { id: "s17", employeeId: "emp-1", date: generateDate(5), startTime: "08:00", endTime: "16:00", role: "Manager", location: "Main Floor", status: "published", isOpenShift: false },
      { id: "s18", employeeId: "emp-2", date: generateDate(5), startTime: "17:00", endTime: "23:00", role: "Server", location: "Main Floor", status: "draft", isOpenShift: false },
      { id: "s19", employeeId: "emp-3", date: generateDate(5), startTime: "06:00", endTime: "14:00", role: "Cook", location: "Kitchen", status: "published", isOpenShift: false },
      { id: "s20", employeeId: "emp-4", date: generateDate(5), startTime: "07:00", endTime: "13:00", role: "Barista", location: "Coffee Bar", status: "draft", isOpenShift: false },
      { id: "s21", employeeId: "emp-5", date: generateDate(5), startTime: "16:00", endTime: "23:00", role: "Server", location: "Main Floor", status: "published", isOpenShift: false },
      { id: "s22", employeeId: "emp-6", date: generateDate(5), startTime: "17:00", endTime: "23:00", role: "Host", location: "Entrance", status: "draft", isOpenShift: false },
      { id: "s23", employeeId: "", date: generateDate(6), startTime: "10:00", endTime: "18:00", role: "Server", location: "Main Floor", status: "draft", isOpenShift: true },
      { id: "s24", employeeId: "emp-4", date: generateDate(6), startTime: "07:00", endTime: "15:00", role: "Barista", location: "Coffee Bar", status: "published", isOpenShift: false },
      { id: "s25", employeeId: "emp-6", date: generateDate(6), startTime: "11:00", endTime: "19:00", role: "Host", location: "Entrance", status: "confirmed", isOpenShift: false },
      { id: "s26", employeeId: "emp-4", date: generateDate(0), startTime: "07:00", endTime: "15:00", role: "Barista", location: "Coffee Bar", status: "confirmed", isOpenShift: false },
      { id: "s27", employeeId: "emp-6", date: generateDate(0), startTime: "11:00", endTime: "19:00", role: "Server", location: "Main Floor", status: "published", isOpenShift: false },
    ]
  })

  // Time-off requests
  const [timeOffRequests] = useState<TimeOffRequest[]>(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    return [
      {
        id: "to-1",
        employeeId: "emp-5",
        startDate: today.toISOString().split("T")[0],
        endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        reason: "Personal appointment",
        status: "approved",
      },
      {
        id: "to-2",
        employeeId: "emp-2",
        startDate: nextWeek.toISOString().split("T")[0],
        endDate: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        reason: "Vacation",
        status: "pending",
      },
      {
        id: "to-3",
        employeeId: "emp-4",
        startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        reason: "Doctor appointment",
        status: "pending",
      },
    ]
  })

  // Shift templates
  const [shiftTemplates] = useState<ShiftTemplate[]>([
    { id: "tpl-1", name: "Morning", startTime: "06:00", endTime: "14:00", role: "Cook", icon: Sunrise, color: "bg-amber-500/20 text-amber-400" },
    { id: "tpl-2", name: "Day", startTime: "08:00", endTime: "16:00", role: "Manager", icon: Sun, color: "bg-primary/20 text-primary" },
    { id: "tpl-3", name: "Swing", startTime: "14:00", endTime: "22:00", role: "Server", icon: Coffee, color: "bg-blue-500/20 text-blue-400" },
    { id: "tpl-4", name: "Evening", startTime: "16:00", endTime: "23:00", role: "Server", icon: Moon, color: "bg-purple-500/20 text-purple-400" },
  ])

  // Conflicts
  const conflicts = useMemo<Conflict[]>(() => {
    const result: Conflict[] = []

    // Check for overtime
    employees.forEach((emp) => {
      if (emp.hoursThisWeek > emp.maxHours) {
        result.push({
          id: `conflict-overtime-${emp.id}`,
          type: "overtime",
          employeeId: emp.id,
          message: `${emp.name} is over maximum hours (${emp.hoursThisWeek}/${emp.maxHours}h)`,
          severity: "high",
          date: new Date().toISOString().split("T")[0],
        })
      } else if (emp.hoursThisWeek > emp.maxHours - 4) {
        result.push({
          id: `conflict-overtime-warning-${emp.id}`,
          type: "overtime",
          employeeId: emp.id,
          message: `${emp.name} is approaching maximum hours (${emp.hoursThisWeek}/${emp.maxHours}h)`,
          severity: "medium",
          date: new Date().toISOString().split("T")[0],
        })
      }
    })

    // Check for open shifts (coverage gaps)
    shifts.filter((s) => s.isOpenShift).forEach((shift) => {
      result.push({
        id: `conflict-open-${shift.id}`,
        type: "coverage",
        message: `Open ${shift.role} shift on ${shift.date} (${formatTime(shift.startTime)} - ${formatTime(shift.endTime)})`,
        severity: "medium",
        date: shift.date,
      })
    })

    return result
  }, [employees, shifts])

  // Week dates
  const weekDates = useMemo(() => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [currentWeekStart])

  // Navigation
  const navigateWeek = (direction: number) => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + direction * 7)
    setCurrentWeekStart(newStart)
  }

  // Get shifts for a specific day and employee
  const getShiftsForDayEmployee = (date: Date, employeeId: string) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts.filter(
      (s) => s.date === dateStr && s.employeeId === employeeId
    )
  }

  // Get all shifts for a day
  const getShiftsForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return shifts.filter((s) => s.date === dateStr)
  }

  // Get open shifts
  const openShifts = useMemo(() => {
    return shifts.filter((s) => s.isOpenShift)
  }, [shifts])

  // Status badge
  const getStatusBadge = (status: Shift["status"]) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-muted text-muted-foreground border-border text-xs">Draft</Badge>
      case "published":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Published</Badge>
      case "confirmed":
        return <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Confirmed</Badge>
    }
  }

  // Employee status badge
  const getEmployeeStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "available":
        return <span className="w-2 h-2 rounded-full bg-primary" />
      case "busy":
        return <span className="w-2 h-2 rounded-full bg-amber-400" />
      case "off":
        return <span className="w-2 h-2 rounded-full bg-muted-foreground" />
    }
  }

  // Open shift dialog
  const openCreateShiftDialog = (date?: Date, employeeId?: string) => {
    setEditingShift(null)
    setSelectedEmployee(employeeId || "")
    setSelectedDate(date ? date.toISOString().split("T")[0] : weekDates[1].toISOString().split("T")[0])
    setSelectedStartTime("09:00")
    setSelectedEndTime("17:00")
    setSelectedRole("")
    setSelectedLocation("")
    setShiftNotes("")
    setIsOpenShift(!employeeId)
    setShiftDialogOpen(true)
  }

  const openEditShiftDialog = (shift: Shift) => {
    setEditingShift(shift)
    setSelectedEmployee(shift.employeeId)
    setSelectedDate(shift.date)
    setSelectedStartTime(shift.startTime)
    setSelectedEndTime(shift.endTime)
    setSelectedRole(shift.role)
    setSelectedLocation(shift.location || "")
    setShiftNotes(shift.notes || "")
    setIsOpenShift(shift.isOpenShift)
    setShiftDialogOpen(true)
  }

  // Save shift
  const saveShift = () => {
    if (editingShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === editingShift.id
            ? {
                ...s,
                employeeId: selectedEmployee,
                date: selectedDate,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
                role: selectedRole,
                location: selectedLocation,
                notes: shiftNotes,
                isOpenShift: !selectedEmployee,
              }
            : s
        )
      )
    } else {
      const newShift: Shift = {
        id: `s-${Date.now()}`,
        employeeId: selectedEmployee,
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        role: selectedRole,
        location: selectedLocation,
        notes: shiftNotes,
        status: "draft",
        isOpenShift: !selectedEmployee,
      }
      setShifts((prev) => [...prev, newShift])
    }
    setShiftDialogOpen(false)
  }

  // Delete shift
  const deleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId))
  }

  // Apply template
  const applyTemplate = (template: ShiftTemplate) => {
    setSelectedStartTime(template.startTime)
    setSelectedEndTime(template.endTime)
    setSelectedRole(template.role)
  }

  // Publish schedule
  const publishSchedule = () => {
    setShifts((prev) =>
      prev.map((s) => (s.status === "draft" ? { ...s, status: "published" } : s))
    )
  }

  // Stats
  const draftShiftsCount = shifts.filter((s) => s.status === "draft").length
  const totalScheduledHours = shifts.reduce((sum, s) => {
    return sum + getShiftDuration(s.startTime, s.endTime)
  }, 0)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
              Shift Scheduler
            </h1>
            <p className="text-muted-foreground mt-2">
              Employee shift planning and management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Week navigation */}
            <div className="flex items-center gap-2 glass border-border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateWeek(-1)}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono text-foreground px-2 min-w-[160px] text-center">
                {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateWeek(1)}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 glass border-border rounded-lg p-1">
              <Button
                variant={viewMode === "week" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="text-xs"
              >
                Week
              </Button>
              <Button
                variant={viewMode === "day" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="text-xs"
              >
                Day
              </Button>
            </div>

            {draftShiftsCount > 0 && (
              <Button
                onClick={publishSchedule}
                className="bg-primary hover:bg-primary/90"
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Publish</span> ({draftShiftsCount})
              </Button>
            )}

            <Button
              onClick={() => openCreateShiftDialog()}
              className="bg-secondary hover:bg-secondary/90"
              size="sm"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Shift</span>
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
              <p className="text-muted-foreground text-sm">Total Shifts</p>
              <Calendar className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{shifts.length}</p>
            <p className="text-muted-foreground text-xs mt-1">This week</p>
          </Card>

          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Scheduled Hours</p>
              <Clock className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              {totalScheduledHours.toFixed(0)}h
            </p>
            <p className="text-muted-foreground text-xs mt-1">All employees</p>
          </Card>

          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Open Shifts</p>
              <Users className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">{openShifts.length}</p>
            <p className="text-muted-foreground text-xs mt-1">Need coverage</p>
          </Card>

          <Card className="glass border-amber-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Conflicts</p>
              <AlertTriangle className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-3xl font-bold text-amber-400 font-mono">{conflicts.length}</p>
            <p className="text-muted-foreground text-xs mt-1">To resolve</p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid lg:grid-cols-[280px_1fr] gap-6"
        >
          {/* Sidebar - Employee List */}
          <div className="space-y-4">
            <Card className="glass border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Employees</h3>
                <Badge className="bg-muted text-muted-foreground border-border">
                  {employees.length}
                </Badge>
              </div>
              <ScrollArea className="h-[300px] lg:h-[400px]">
                <div className="space-y-2">
                  {employees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-dark border-border/50 rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => openCreateShiftDialog(undefined, employee.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary text-sm">
                            {employee.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {employee.name}
                            </p>
                            {getEmployeeStatusBadge(employee.status)}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {employee.roles.slice(0, 2).map((role) => (
                              <Badge
                                key={role}
                                className={`${roleColors[role] || "bg-muted text-muted-foreground"} text-[10px] px-1.5 py-0`}
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Hours</span>
                          <span className="text-foreground font-mono">
                            {employee.hoursThisWeek}/{employee.maxHours}h
                          </span>
                        </div>
                        <Progress
                          value={(employee.hoursThisWeek / employee.maxHours) * 100}
                          className="h-1.5"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Shift Templates */}
            <Card className="glass border-border p-4">
              <h3 className="font-semibold text-foreground mb-4">Quick Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {shiftTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      className={`${template.color} border-current/30 justify-start gap-2 text-xs`}
                      onClick={() => {
                        openCreateShiftDialog()
                        setTimeout(() => applyTemplate(template), 0)
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {template.name}
                    </Button>
                  )
                })}
              </div>
            </Card>

            {/* Conflicts */}
            {conflicts.length > 0 && (
              <Card className="glass border-amber-500/30 p-4">
                <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alerts
                </h3>
                <ScrollArea className="h-[180px]">
                  <div className="space-y-2">
                    {conflicts.map((conflict) => (
                      <div
                        key={conflict.id}
                        className={`glass-dark rounded-lg p-3 border-l-2 ${
                          conflict.severity === "high"
                            ? "border-red-500"
                            : conflict.severity === "medium"
                            ? "border-amber-500"
                            : "border-blue-500"
                        }`}
                      >
                        <p className="text-xs text-foreground">{conflict.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>

          {/* Main Schedule Grid */}
          <div className="space-y-4">
            <Tabs defaultValue="schedule" className="space-y-4">
              <TabsList className="glass border-border">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="timeoff">Time Off</TabsTrigger>
              </TabsList>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4">
                <Card className="glass border-border overflow-hidden">
                  {viewMode === "week" ? (
                    // Week View
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        {/* Day Headers */}
                        <div className="grid grid-cols-8 border-b border-border">
                          <div className="p-3 text-sm font-medium text-muted-foreground">
                            Employee
                          </div>
                          {weekDates.map((date, idx) => {
                            const isToday = date.toDateString() === new Date().toDateString()
                            return (
                              <div
                                key={idx}
                                className={`p-3 text-center border-l border-border ${
                                  isToday ? "bg-primary/10" : ""
                                }`}
                              >
                                <p className="text-xs text-muted-foreground">
                                  {getDayName(date.getDay())}
                                </p>
                                <p
                                  className={`text-sm font-mono ${
                                    isToday ? "text-primary font-bold" : "text-foreground"
                                  }`}
                                >
                                  {date.getDate()}
                                </p>
                              </div>
                            )
                          })}
                        </div>

                        {/* Employee Rows */}
                        {employees.map((employee) => (
                          <div
                            key={employee.id}
                            className="grid grid-cols-8 border-b border-border/50 hover:bg-muted/5 transition-colors"
                          >
                            <div className="p-3 flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                  {employee.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-foreground truncate">
                                {employee.name.split(" ")[0]}
                              </span>
                            </div>
                            {weekDates.map((date, dayIdx) => {
                              const dayShifts = getShiftsForDayEmployee(date, employee.id)
                              const isToday = date.toDateString() === new Date().toDateString()
                              return (
                                <div
                                  key={dayIdx}
                                  className={`p-2 border-l border-border/50 min-h-[80px] ${
                                    isToday ? "bg-primary/5" : ""
                                  }`}
                                  onClick={() => openCreateShiftDialog(date, employee.id)}
                                >
                                  <div className="space-y-1">
                                    {dayShifts.map((shift) => (
                                      <motion.div
                                        key={shift.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`${
                                          roleColors[shift.role] || "bg-muted text-muted-foreground"
                                        } rounded px-2 py-1.5 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          openEditShiftDialog(shift)
                                        }}
                                      >
                                        <p className="text-[10px] font-medium truncate">
                                          {shift.role}
                                        </p>
                                        <p className="text-[10px] opacity-80 font-mono">
                                          {formatTime(shift.startTime).replace(" ", "")} -{" "}
                                          {formatTime(shift.endTime).replace(" ", "")}
                                        </p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ))}

                        {/* Open Shifts Row */}
                        <div className="grid grid-cols-8 border-b border-border/50 bg-amber-500/5">
                          <div className="p-3 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <Users className="h-4 w-4 text-amber-400" />
                            </div>
                            <span className="text-sm text-amber-400 font-medium">Open</span>
                          </div>
                          {weekDates.map((date, dayIdx) => {
                            const dayOpenShifts = shifts.filter(
                              (s) => s.date === date.toISOString().split("T")[0] && s.isOpenShift
                            )
                            return (
                              <div
                                key={dayIdx}
                                className="p-2 border-l border-border/50 min-h-[80px]"
                              >
                                <div className="space-y-1">
                                  {dayOpenShifts.map((shift) => (
                                    <motion.div
                                      key={shift.id}
                                      className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded px-2 py-1.5 cursor-pointer hover:bg-amber-500/30 transition-colors"
                                      onClick={() => openEditShiftDialog(shift)}
                                    >
                                      <p className="text-[10px] font-medium truncate">
                                        {shift.role}
                                      </p>
                                      <p className="text-[10px] opacity-80 font-mono">
                                        {formatTime(shift.startTime).replace(" ", "")} -{" "}
                                        {formatTime(shift.endTime).replace(" ", "")}
                                      </p>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Day View (Mobile Friendly)
                    <div className="p-4">
                      {/* Day Selector */}
                      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {weekDates.map((date, idx) => {
                          const isToday = date.toDateString() === new Date().toDateString()
                          const isSelected = selectedDay === idx
                          return (
                            <Button
                              key={idx}
                              variant={isSelected ? "secondary" : "outline"}
                              size="sm"
                              className={`flex-shrink-0 ${
                                isToday && !isSelected ? "border-primary" : ""
                              }`}
                              onClick={() => setSelectedDay(idx)}
                            >
                              <div className="text-center">
                                <p className="text-xs">{getDayName(date.getDay())}</p>
                                <p className="font-mono">{date.getDate()}</p>
                              </div>
                            </Button>
                          )
                        })}
                      </div>

                      {/* Day Shifts */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground">
                          {getFullDayName(weekDates[selectedDay].getDay())},{" "}
                          {weekDates[selectedDay].toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-2">
                            {getShiftsForDay(weekDates[selectedDay]).map((shift) => {
                              const employee = employees.find((e) => e.id === shift.employeeId)
                              return (
                                <motion.div
                                  key={shift.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`glass-dark border-border/50 rounded-lg p-4 border-l-4 ${
                                    shift.isOpenShift
                                      ? "border-l-amber-500"
                                      : `border-l-primary`
                                  }`}
                                  onClick={() => openEditShiftDialog(shift)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                      {shift.isOpenShift ? (
                                        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                          <Users className="h-5 w-5 text-amber-400" />
                                        </div>
                                      ) : (
                                        <Avatar className="h-10 w-10">
                                          <AvatarFallback className="bg-primary/20 text-primary">
                                            {employee?.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                      <div>
                                        <p className="font-medium text-foreground">
                                          {shift.isOpenShift ? "Open Shift" : employee?.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge className={`${roleColors[shift.role]} text-xs`}>
                                            {shift.role}
                                          </Badge>
                                          {getStatusBadge(shift.status)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-mono text-foreground">
                                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {getShiftDuration(shift.startTime, shift.endTime)}h
                                      </p>
                                    </div>
                                  </div>
                                  {shift.location && (
                                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      {shift.location}
                                    </div>
                                  )}
                                </motion.div>
                              )
                            })}
                            {getShiftsForDay(weekDates[selectedDay]).length === 0 && (
                              <div className="text-center py-12 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No shifts scheduled</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-4"
                                  onClick={() => openCreateShiftDialog(weekDates[selectedDay])}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Shift
                                </Button>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-4">
                <Card className="glass border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Employee Availability
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                      {/* Headers */}
                      <div className="grid grid-cols-8 gap-2 mb-4">
                        <div className="text-sm text-muted-foreground">Employee</div>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-sm text-muted-foreground text-center">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Rows */}
                      {employees.map((employee) => (
                        <div key={employee.id} className="grid grid-cols-8 gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {employee.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-foreground truncate">
                              {employee.name.split(" ")[0]}
                            </span>
                          </div>
                          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                            const avail = employee.availability.find((a) => a.dayOfWeek === day)
                            return (
                              <div
                                key={day}
                                className={`text-center py-2 rounded text-xs ${
                                  avail
                                    ? avail.isPreferred
                                      ? "bg-primary/20 text-primary"
                                      : "bg-secondary/20 text-secondary"
                                    : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {avail ? (
                                  <span className="font-mono">
                                    {avail.startTime.slice(0, 5)}-{avail.endTime.slice(0, 5)}
                                  </span>
                                ) : (
                                  "Off"
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
                      <span className="text-xs text-muted-foreground">Preferred</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-secondary/20 border border-secondary/30" />
                      <span className="text-xs text-muted-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-muted/50 border border-border" />
                      <span className="text-xs text-muted-foreground">Unavailable</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Time Off Tab */}
              <TabsContent value="timeoff" className="space-y-4">
                <Card className="glass border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Time-Off Requests</h3>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {timeOffRequests.filter((r) => r.status === "pending").length} Pending
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {timeOffRequests.map((request) => {
                      const employee = employees.find((e) => e.id === request.employeeId)
                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass-dark border-border/50 rounded-lg p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {employee?.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{employee?.name}</p>
                                <p className="text-sm text-muted-foreground">{request.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-mono text-foreground">
                                  {new Date(request.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {new Date(request.endDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <Badge
                                className={
                                  request.status === "approved"
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : request.status === "pending"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                              {request.status === "pending" && (
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-primary hover:bg-primary/20"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-400 hover:bg-red-500/20"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}

                    {timeOffRequests.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No time-off requests</p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* Shift Dialog */}
      <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
        <DialogContent className="glass border-border sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingShift ? "Edit Shift" : "Create Shift"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Quick Templates */}
            {!editingShift && (
              <div>
                <Label className="text-muted-foreground text-xs mb-2 block">Quick Templates</Label>
                <div className="grid grid-cols-4 gap-2">
                  {shiftTemplates.map((template) => {
                    const Icon = template.icon
                    return (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        className={`${template.color} border-current/30 justify-center`}
                        onClick={() => applyTemplate(template)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            <Separator className="bg-border" />

            {/* Employee Select */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee" className="text-foreground">
                  Employee
                </Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="glass-dark border-border mt-1.5">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    <SelectItem value="">Open Shift</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role" className="text-foreground">
                  Role
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="glass-dark border-border mt-1.5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="glass border-border">
                    {Object.keys(roleColors).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-foreground">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass-dark border-border mt-1.5"
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-foreground">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  className="glass-dark border-border mt-1.5 font-mono"
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-foreground">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className="glass-dark border-border mt-1.5 font-mono"
                />
              </div>
            </div>

            {/* Duration display */}
            <div className="glass-dark border-border rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Shift Duration</span>
              <span className="text-sm font-mono text-primary">
                {getShiftDuration(selectedStartTime, selectedEndTime).toFixed(1)} hours
              </span>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-foreground">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Main Floor, Kitchen"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="glass-dark border-border mt-1.5"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Optional notes..."
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                className="glass-dark border-border mt-1.5 min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {editingShift && (
              <Button
                variant="destructive"
                onClick={() => {
                  deleteShift(editingShift.id)
                  setShiftDialogOpen(false)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setShiftDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveShift} className="bg-primary hover:bg-primary/90">
              {editingShift ? "Save Changes" : "Create Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
