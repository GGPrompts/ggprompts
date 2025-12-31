"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  Award,
  Bike,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Mountain,
  Play,
  Plus,
  Scale,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Waves,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
} from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"

// TypeScript Interfaces
interface Exercise {
  name: string
  sets: { reps: number; weight?: number; duration?: number }[]
  restTime: number
}

interface Workout {
  id: string
  type: "strength" | "cardio" | "hiit" | "yoga" | "cycling" | "running" | "swimming"
  name: string
  date: string
  duration: number
  caloriesBurned: number
  exercises?: Exercise[]
  notes?: string
  heartRateAvg?: number
}

interface DailyStats {
  date: string
  day: string
  steps: number
  caloriesBurned: number
  activeMinutes: number
  workoutsCompleted: number
  goalProgress: number
}

interface Goal {
  id: string
  type: "daily" | "weekly"
  metric: "steps" | "calories" | "workouts" | "active-minutes"
  target: number
  current: number
  icon: any
  color: string
}

interface BodyMetric {
  date: string
  weight: number
  bodyFat?: number
  muscle?: number
}

interface PersonalRecord {
  id: string
  exercise: string
  value: string
  date: string
  improvement: string
  category: "strength" | "cardio" | "endurance"
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  unlockedAt?: string
  progress?: number
  color: string
}

interface WorkoutPlan {
  id: string
  day: string
  type: string
  name: string
  duration: number
  completed: boolean
}

export default function FitnessTracker() {
  // Today's Stats
  const [todayStats] = useState({
    steps: 8432,
    stepsGoal: 10000,
    calories: 2847,
    caloriesGoal: 3000,
    activeMinutes: 45,
    activeMinutesGoal: 60,
    workoutsCompleted: 1,
    workoutsGoal: 1,
    currentStreak: 12,
    heartRate: 72,
    sleepHours: 7.5,
  })

  // Weekly Activity Data
  const [weeklyActivity] = useState<DailyStats[]>([
    { date: "2024-01-15", day: "Mon", steps: 9234, caloriesBurned: 2890, activeMinutes: 52, workoutsCompleted: 1, goalProgress: 92 },
    { date: "2024-01-16", day: "Tue", steps: 7856, caloriesBurned: 2654, activeMinutes: 38, workoutsCompleted: 1, goalProgress: 78 },
    { date: "2024-01-17", day: "Wed", steps: 11234, caloriesBurned: 3102, activeMinutes: 65, workoutsCompleted: 2, goalProgress: 100 },
    { date: "2024-01-18", day: "Thu", steps: 6543, caloriesBurned: 2456, activeMinutes: 30, workoutsCompleted: 0, goalProgress: 65 },
    { date: "2024-01-19", day: "Fri", steps: 10876, caloriesBurned: 3045, activeMinutes: 58, workoutsCompleted: 1, goalProgress: 95 },
    { date: "2024-01-20", day: "Sat", steps: 12456, caloriesBurned: 3287, activeMinutes: 72, workoutsCompleted: 2, goalProgress: 100 },
    { date: "2024-01-21", day: "Sun", steps: 8432, caloriesBurned: 2847, activeMinutes: 45, workoutsCompleted: 1, goalProgress: 84 },
  ])

  // Recent Workouts
  const [workouts] = useState<Workout[]>([
    {
      id: "w1",
      type: "strength",
      name: "Upper Body Power",
      date: "2024-01-21",
      duration: 58,
      caloriesBurned: 420,
      heartRateAvg: 135,
      exercises: [
        { name: "Bench Press", sets: [{ reps: 8, weight: 185 }, { reps: 8, weight: 185 }, { reps: 6, weight: 195 }, { reps: 6, weight: 195 }], restTime: 90 },
        { name: "Overhead Press", sets: [{ reps: 10, weight: 95 }, { reps: 10, weight: 95 }, { reps: 8, weight: 105 }], restTime: 60 },
        { name: "Dumbbell Rows", sets: [{ reps: 12, weight: 60 }, { reps: 12, weight: 60 }, { reps: 10, weight: 65 }], restTime: 60 },
        { name: "Lateral Raises", sets: [{ reps: 15, weight: 20 }, { reps: 15, weight: 20 }, { reps: 12, weight: 25 }], restTime: 45 },
      ],
      notes: "Felt strong today. Increased bench weight.",
    },
    {
      id: "w2",
      type: "running",
      name: "Morning Run",
      date: "2024-01-20",
      duration: 35,
      caloriesBurned: 380,
      heartRateAvg: 152,
      notes: "5K in 28:15 - new personal best!",
    },
    {
      id: "w3",
      type: "hiit",
      name: "HIIT Circuit",
      date: "2024-01-20",
      duration: 25,
      caloriesBurned: 320,
      heartRateAvg: 165,
    },
    {
      id: "w4",
      type: "yoga",
      name: "Morning Yoga Flow",
      date: "2024-01-19",
      duration: 45,
      caloriesBurned: 150,
      heartRateAvg: 95,
    },
    {
      id: "w5",
      type: "cycling",
      name: "Evening Ride",
      date: "2024-01-18",
      duration: 60,
      caloriesBurned: 520,
      heartRateAvg: 142,
    },
  ])

  // Goals
  const [goals] = useState<Goal[]>([
    { id: "g1", type: "daily", metric: "steps", target: 10000, current: 8432, icon: Footprints, color: "hsl(var(--primary))" },
    { id: "g2", type: "daily", metric: "calories", target: 3000, current: 2847, icon: Flame, color: "hsl(var(--secondary))" },
    { id: "g3", type: "daily", metric: "active-minutes", target: 60, current: 45, icon: Timer, color: "hsl(199 89% 48%)" },
    { id: "g4", type: "weekly", metric: "workouts", target: 5, current: 4, icon: Dumbbell, color: "hsl(var(--accent))" },
  ])

  // Body Metrics
  const [bodyMetrics] = useState<BodyMetric[]>([
    { date: "Dec 1", weight: 185, bodyFat: 18.5, muscle: 42.1 },
    { date: "Dec 8", weight: 184, bodyFat: 18.2, muscle: 42.3 },
    { date: "Dec 15", weight: 183, bodyFat: 17.8, muscle: 42.5 },
    { date: "Dec 22", weight: 182, bodyFat: 17.5, muscle: 42.8 },
    { date: "Dec 29", weight: 181, bodyFat: 17.2, muscle: 43.0 },
    { date: "Jan 5", weight: 180, bodyFat: 16.9, muscle: 43.2 },
    { date: "Jan 12", weight: 179, bodyFat: 16.5, muscle: 43.5 },
    { date: "Jan 19", weight: 178, bodyFat: 16.2, muscle: 43.8 },
  ])

  // Personal Records
  const [personalRecords] = useState<PersonalRecord[]>([
    { id: "pr1", exercise: "Bench Press", value: "225 lbs", date: "Jan 15", improvement: "+10 lbs", category: "strength" },
    { id: "pr2", exercise: "5K Run", value: "28:15", date: "Jan 20", improvement: "-1:23", category: "cardio" },
    { id: "pr3", exercise: "Deadlift", value: "315 lbs", date: "Jan 10", improvement: "+15 lbs", category: "strength" },
    { id: "pr4", exercise: "Plank Hold", value: "3:45", date: "Jan 18", improvement: "+30s", category: "endurance" },
    { id: "pr5", exercise: "Squat", value: "275 lbs", date: "Jan 12", improvement: "+20 lbs", category: "strength" },
    { id: "pr6", exercise: "10K Run", value: "58:32", date: "Jan 8", improvement: "-2:15", category: "cardio" },
  ])

  // Achievements
  const [achievements] = useState<Achievement[]>([
    { id: "a1", name: "Early Bird", description: "Complete 10 morning workouts", icon: Sparkles, unlockedAt: "Jan 15", color: "hsl(var(--primary))" },
    { id: "a2", name: "Streak Master", description: "Maintain a 7-day streak", icon: Flame, unlockedAt: "Jan 12", color: "hsl(var(--secondary))" },
    { id: "a3", name: "Iron Will", description: "Lift 10,000 total lbs", icon: Dumbbell, unlockedAt: "Jan 18", color: "hsl(var(--accent))" },
    { id: "a4", name: "Marathon Prep", description: "Run 50 miles total", icon: Footprints, progress: 78, color: "hsl(199 89% 48%)" },
    { id: "a5", name: "Centurion", description: "Complete 100 workouts", icon: Trophy, progress: 64, color: "hsl(212 90% 52%)" },
    { id: "a6", name: "Consistency King", description: "30-day streak", icon: Award, progress: 40, color: "hsl(225 73% 57%)" },
  ])

  // Weekly Plan
  const [weeklyPlan] = useState<WorkoutPlan[]>([
    { id: "p1", day: "Monday", type: "strength", name: "Push Day", duration: 60, completed: true },
    { id: "p2", day: "Tuesday", type: "cardio", name: "5K Run", duration: 35, completed: true },
    { id: "p3", day: "Wednesday", type: "strength", name: "Pull Day", duration: 60, completed: true },
    { id: "p4", day: "Thursday", type: "yoga", name: "Recovery Yoga", duration: 45, completed: false },
    { id: "p5", day: "Friday", type: "strength", name: "Leg Day", duration: 60, completed: false },
    { id: "p6", day: "Saturday", type: "hiit", name: "HIIT Circuit", duration: 30, completed: false },
    { id: "p7", day: "Sunday", type: "cardio", name: "Long Run", duration: 60, completed: false },
  ])

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)

  // Animated counters
  const [animatedSteps, setAnimatedSteps] = useState(0)
  const [animatedCalories, setAnimatedCalories] = useState(0)

  useEffect(() => {
    const stepsInterval = setInterval(() => {
      setAnimatedSteps((prev) => {
        if (prev >= todayStats.steps) return todayStats.steps
        return prev + Math.ceil((todayStats.steps - prev) / 10)
      })
    }, 50)

    const caloriesInterval = setInterval(() => {
      setAnimatedCalories((prev) => {
        if (prev >= todayStats.calories) return todayStats.calories
        return prev + Math.ceil((todayStats.calories - prev) / 10)
      })
    }, 50)

    return () => {
      clearInterval(stepsInterval)
      clearInterval(caloriesInterval)
    }
  }, [todayStats.steps, todayStats.calories])

  // Get workout type color and icon
  const getWorkoutTypeInfo = (type: Workout["type"]) => {
    switch (type) {
      case "strength":
        return { icon: Dumbbell, color: "hsl(var(--primary))", bg: "bg-primary/20", border: "border-primary/30", text: "text-primary" }
      case "cardio":
        return { icon: Heart, color: "hsl(var(--secondary))", bg: "bg-secondary/20", border: "border-secondary/30", text: "text-secondary" }
      case "hiit":
        return { icon: Zap, color: "hsl(var(--accent))", bg: "bg-accent/20", border: "border-accent/30", text: "text-accent" }
      case "yoga":
        return { icon: Sparkles, color: "hsl(199 89% 48%)", bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" }
      case "cycling":
        return { icon: Bike, color: "hsl(212 90% 52%)", bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" }
      case "running":
        return { icon: Footprints, color: "hsl(225 73% 57%)", bg: "bg-indigo-500/20", border: "border-indigo-500/30", text: "text-indigo-400" }
      case "swimming":
        return { icon: Waves, color: "hsl(199 89% 48%)", bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400" }
      default:
        return { icon: Activity, color: "hsl(var(--primary))", bg: "bg-primary/20", border: "border-primary/30", text: "text-primary" }
    }
  }

  // Goal progress data for radial chart
  const goalRadialData = goals.map((goal) => ({
    name: goal.metric,
    value: Math.round((goal.current / goal.target) * 100),
    fill: goal.color,
  }))

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
              Fitness Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Your personal health and workout dashboard
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              <Flame className="h-4 w-4 mr-1" />
              {todayStats.currentStreak} Day Streak
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Log Workout</span>
            </Button>
          </div>
        </motion.div>

        {/* Today's Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {/* Steps */}
          <Card className="glass border-primary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Steps</p>
              <Footprints className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-3xl font-bold text-primary font-mono">
              {animatedSteps.toLocaleString()}
            </p>
            <Progress value={(todayStats.steps / todayStats.stepsGoal) * 100} className="h-1.5 mt-2" />
            <p className="text-muted-foreground text-xs mt-1">
              {todayStats.stepsGoal.toLocaleString()} goal
            </p>
          </Card>

          {/* Calories */}
          <Card className="glass border-secondary/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Calories</p>
              <Flame className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-3xl font-bold text-secondary font-mono">
              {animatedCalories.toLocaleString()}
            </p>
            <Progress value={(todayStats.calories / todayStats.caloriesGoal) * 100} className="h-1.5 mt-2" />
            <p className="text-muted-foreground text-xs mt-1">
              {todayStats.caloriesGoal.toLocaleString()} goal
            </p>
          </Card>

          {/* Active Minutes */}
          <Card className="glass border-blue-500/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Active Time</p>
              <Timer className="h-5 w-5 text-blue-400/50" />
            </div>
            <p className="text-3xl font-bold text-blue-400 font-mono">
              {todayStats.activeMinutes}m
            </p>
            <Progress value={(todayStats.activeMinutes / todayStats.activeMinutesGoal) * 100} className="h-1.5 mt-2" />
            <p className="text-muted-foreground text-xs mt-1">
              {todayStats.activeMinutesGoal}m goal
            </p>
          </Card>

          {/* Heart Rate */}
          <Card className="glass border-accent/30 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Heart Rate</p>
              <Heart className="h-5 w-5 text-accent/50" />
            </div>
            <p className="text-3xl font-bold text-accent font-mono">
              {todayStats.heartRate}
            </p>
            <p className="text-muted-foreground text-xs mt-1">bpm resting</p>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="glass border-primary/30 w-max md:w-auto">
                <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="workouts" className="text-xs sm:text-sm whitespace-nowrap">Workouts</TabsTrigger>
                <TabsTrigger value="goals" className="text-xs sm:text-sm whitespace-nowrap">Goals</TabsTrigger>
                <TabsTrigger value="progress" className="text-xs sm:text-sm whitespace-nowrap">Progress</TabsTrigger>
                <TabsTrigger value="records" className="text-xs sm:text-sm whitespace-nowrap">Records</TabsTrigger>
                <TabsTrigger value="achievements" className="text-xs sm:text-sm whitespace-nowrap">Achievements</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <Card className="glass border-primary/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-primary">Weekly Activity</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {weeklyActivity.reduce((sum, d) => sum + d.workoutsCompleted, 0)} workouts
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                        cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                      />
                      <Bar dataKey="activeMinutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Active Minutes" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Quick Start Workout */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">Start Workout</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "strength" as const, name: "Strength" },
                      { type: "running" as const, name: "Running" },
                      { type: "hiit" as const, name: "HIIT" },
                      { type: "yoga" as const, name: "Yoga" },
                      { type: "cycling" as const, name: "Cycling" },
                      { type: "swimming" as const, name: "Swimming" },
                    ].map((workout) => {
                      const info = getWorkoutTypeInfo(workout.type)
                      const Icon = info.icon
                      return (
                        <motion.button
                          key={workout.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`glass-dark ${info.border} rounded-lg p-4 flex flex-col items-center gap-2 transition-colors hover:bg-muted/10`}
                        >
                          <Icon className={`h-6 w-6 ${info.text}`} />
                          <span className="text-foreground text-sm font-medium">{workout.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </Card>
              </div>

              {/* Weekly Plan */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">This Week&apos;s Plan</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Full Schedule
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weeklyPlan.map((plan, idx) => {
                    const info = getWorkoutTypeInfo(plan.type as Workout["type"])
                    const Icon = info.icon
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`glass-dark ${plan.completed ? "border-primary/30" : "border-border/30"} rounded-lg p-4 text-center`}
                      >
                        <p className="text-muted-foreground text-xs mb-2">{plan.day.slice(0, 3)}</p>
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${info.text}`} />
                        <p className="text-foreground text-xs font-medium truncate">{plan.name}</p>
                        <p className="text-muted-foreground text-xs">{plan.duration}m</p>
                        {plan.completed && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mt-2">Done</Badge>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Workouts Tab */}
            <TabsContent value="workouts" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Recent Workouts List */}
                <Card className="glass border-primary/30 p-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-primary">Recent Workouts</h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {workouts.length} this week
                    </Badge>
                  </div>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {workouts.map((workout, idx) => {
                        const info = getWorkoutTypeInfo(workout.type)
                        const Icon = info.icon
                        return (
                          <motion.div
                            key={workout.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            onClick={() => setSelectedWorkout(selectedWorkout?.id === workout.id ? null : workout)}
                            className={`glass-dark ${info.border} rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/10`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`${info.bg} p-2 rounded-lg`}>
                                  <Icon className={`h-5 w-5 ${info.text}`} />
                                </div>
                                <div>
                                  <p className="text-foreground font-medium text-sm">{workout.name}</p>
                                  <p className="text-muted-foreground text-xs">{workout.date}</p>
                                </div>
                              </div>
                              <Badge className={`${info.bg} ${info.text} ${info.border} text-xs`}>
                                {workout.type}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div>
                                <p className="text-muted-foreground text-xs">Duration</p>
                                <p className="text-foreground font-mono text-sm">{workout.duration}m</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Calories</p>
                                <p className="text-secondary font-mono text-sm">{workout.caloriesBurned}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Avg HR</p>
                                <p className="text-accent font-mono text-sm">{workout.heartRateAvg || "-"}</p>
                              </div>
                            </div>

                            {/* Expanded Workout Detail */}
                            <AnimatePresence>
                              {selectedWorkout?.id === workout.id && workout.exercises && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-4 pt-4 border-t border-border/30"
                                >
                                  <p className="text-foreground text-sm font-medium mb-3">Exercises</p>
                                  <div className="space-y-2">
                                    {workout.exercises.map((exercise, exIdx) => (
                                      <div key={exIdx} className="flex items-center justify-between text-sm">
                                        <span className="text-foreground">{exercise.name}</span>
                                        <span className="text-muted-foreground font-mono">
                                          {exercise.sets.length} sets × {exercise.sets[0].reps} reps
                                          {exercise.sets[0].weight && ` @ ${exercise.sets[0].weight}lb`}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  {workout.notes && (
                                    <p className="text-muted-foreground text-xs mt-3 italic">&quot;{workout.notes}&quot;</p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Workout Stats */}
                <div className="space-y-4">
                  <Card className="glass border-secondary/30 p-6">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Weekly Summary</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-sm">Total Workouts</span>
                          <span className="text-foreground font-mono">{workouts.length}</span>
                        </div>
                        <Progress value={(workouts.length / 7) * 100} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-sm">Total Duration</span>
                          <span className="text-foreground font-mono">
                            {workouts.reduce((sum, w) => sum + w.duration, 0)}m
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-sm">Total Calories</span>
                          <span className="text-secondary font-mono">
                            {workouts.reduce((sum, w) => sum + w.caloriesBurned, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass border-accent/30 p-6">
                    <h3 className="text-lg font-semibold text-accent mb-4">Workout Types</h3>
                    <div className="space-y-3">
                      {["strength", "cardio", "hiit", "yoga"].map((type) => {
                        const count = workouts.filter((w) =>
                          type === "cardio" ? ["running", "cycling", "swimming"].includes(w.type) : w.type === type
                        ).length
                        const info = getWorkoutTypeInfo(type as Workout["type"])
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <info.icon className={`h-4 w-4 ${info.text}`} />
                              <span className="text-foreground text-sm capitalize">{type}</span>
                            </div>
                            <Badge className={`${info.bg} ${info.text} ${info.border}`}>{count}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Goal Rings */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">Daily Goals</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {goals.filter(g => g.type === "daily").map((goal, idx) => {
                      const Icon = goal.icon
                      const percentage = Math.round((goal.current / goal.target) * 100)
                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="text-center"
                        >
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="hsl(var(--muted))"
                                strokeWidth="8"
                                fill="none"
                              />
                              <motion.circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke={goal.color}
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: "0 264" }}
                                animate={{ strokeDasharray: `${(percentage / 100) * 264} 264` }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon className="h-6 w-6" style={{ color: goal.color }} />
                            </div>
                          </div>
                          <p className="text-foreground font-mono text-lg">{percentage}%</p>
                          <p className="text-muted-foreground text-xs capitalize">{goal.metric.replace("-", " ")}</p>
                          <p className="text-muted-foreground text-xs">
                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                          </p>
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>

                {/* Weekly Goals */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">Weekly Goals</h3>
                  <div className="space-y-6">
                    {goals.filter(g => g.type === "weekly").map((goal, idx) => {
                      const Icon = goal.icon
                      const percentage = Math.round((goal.current / goal.target) * 100)
                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" style={{ color: goal.color }} />
                              <span className="text-foreground text-sm capitalize">{goal.metric.replace("-", " ")}</span>
                            </div>
                            <span className="text-foreground font-mono text-sm">
                              {goal.current} / {goal.target}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </motion.div>
                      )
                    })}

                    <Separator className="bg-border/30" />

                    <div className="glass-dark border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-primary font-medium text-sm">On Track!</p>
                          <p className="text-muted-foreground text-xs">
                            You&apos;re 80% towards your weekly workout goal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Progress Tab - Body Metrics */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Weight Chart */}
                <Card className="glass border-primary/30 p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-primary mb-6">Body Metrics Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bodyMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={["dataMin - 5", "dataMax + 5"]}
                        stroke="hsl(var(--primary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 50]}
                        stroke="hsl(var(--secondary) / 0.5)"
                        tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                        itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                        name="Weight (lbs)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="muscle"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--secondary))" }}
                        name="Muscle (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Current Stats */}
                <div className="space-y-4">
                  <Card className="glass border-primary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Scale className="h-6 w-6 text-primary" />
                      <Badge className="bg-primary/20 text-primary border-primary/30">-7 lbs</Badge>
                    </div>
                    <p className="text-3xl font-bold text-primary font-mono">178</p>
                    <p className="text-muted-foreground text-sm">lbs current weight</p>
                  </Card>

                  <Card className="glass border-secondary/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30">+1.7%</Badge>
                    </div>
                    <p className="text-3xl font-bold text-secondary font-mono">43.8%</p>
                    <p className="text-muted-foreground text-sm">muscle mass</p>
                  </Card>

                  <Card className="glass border-accent/30 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="h-6 w-6 text-accent" />
                      <Badge className="bg-accent/20 text-accent border-accent/30">-2.3%</Badge>
                    </div>
                    <p className="text-3xl font-bold text-accent font-mono">16.2%</p>
                    <p className="text-muted-foreground text-sm">body fat</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Records Tab */}
            <TabsContent value="records" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">Personal Records</h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {personalRecords.length} PRs
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personalRecords.map((pr, idx) => (
                    <motion.div
                      key={pr.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`glass-dark rounded-lg p-4 border-l-4 ${
                        pr.category === "strength"
                          ? "border-l-primary"
                          : pr.category === "cardio"
                          ? "border-l-secondary"
                          : "border-l-accent"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Trophy className={`h-5 w-5 ${
                          pr.category === "strength"
                            ? "text-primary"
                            : pr.category === "cardio"
                            ? "text-secondary"
                            : "text-accent"
                        }`} />
                        <Badge className={`text-xs ${
                          pr.category === "strength"
                            ? "bg-primary/20 text-primary border-primary/30"
                            : pr.category === "cardio"
                            ? "bg-secondary/20 text-secondary border-secondary/30"
                            : "bg-accent/20 text-accent border-accent/30"
                        }`}>
                          {pr.improvement}
                        </Badge>
                      </div>
                      <p className="text-foreground font-medium text-sm">{pr.exercise}</p>
                      <p className="text-2xl font-bold text-foreground font-mono mt-1">{pr.value}</p>
                      <p className="text-muted-foreground text-xs mt-1">{pr.date}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Unlocked */}
                <Card className="glass border-primary/30 p-6">
                  <h3 className="text-lg font-semibold text-primary mb-6">Unlocked</h3>
                  <div className="space-y-4">
                    {achievements.filter(a => a.unlockedAt).map((achievement, idx) => {
                      const Icon = achievement.icon
                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-primary/20 rounded-lg p-4 flex items-center gap-4"
                        >
                          <div
                            className="p-3 rounded-full"
                            style={{ backgroundColor: `${achievement.color}20` }}
                          >
                            <Icon className="h-6 w-6" style={{ color: achievement.color }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground font-medium text-sm">{achievement.name}</p>
                            <p className="text-muted-foreground text-xs">{achievement.description}</p>
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            {achievement.unlockedAt}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>

                {/* In Progress */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-6">In Progress</h3>
                  <div className="space-y-4">
                    {achievements.filter(a => a.progress !== undefined).map((achievement, idx) => {
                      const Icon = achievement.icon
                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="glass-dark border-secondary/20 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div
                              className="p-3 rounded-full opacity-60"
                              style={{ backgroundColor: `${achievement.color}20` }}
                            >
                              <Icon className="h-6 w-6" style={{ color: achievement.color }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-foreground font-medium text-sm">{achievement.name}</p>
                              <p className="text-muted-foreground text-xs">{achievement.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={achievement.progress} className="flex-1 h-2" />
                            <span className="text-foreground font-mono text-sm">{achievement.progress}%</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Motivation Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 glass border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <span className="text-primary text-sm font-mono">Keep Going!</span>
        </motion.div>
      </div>
    </div>
  )
}
