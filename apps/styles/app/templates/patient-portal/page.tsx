"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  CalendarDays,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Droplets,
  FileText,
  Heart,
  Hospital,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  Phone,
  Pill,
  Plus,
  RefreshCw,
  Scale,
  Send,
  Stethoscope,
  TestTube,
  TrendingDown,
  TrendingUp,
  User,
  Video,
  Wallet,
} from "lucide-react"
import { Card, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Progress, Separator, ScrollArea, Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@ggprompts/ui"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// TypeScript Interfaces
interface Patient {
  id: string
  name: string
  dateOfBirth: string
  memberId: string
  primaryCareProvider: string
  insurancePlan: string
  avatar?: string
}

interface Appointment {
  id: string
  provider: string
  specialty: string
  dateTime: string
  location: string
  type: "in-person" | "telehealth"
  status: "scheduled" | "completed" | "cancelled"
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  refillsRemaining: number
  pharmacy: string
  prescribedBy: string
  lastFilled: string
}

interface TestResult {
  id: string
  testName: string
  value: number
  unit: string
  normalRange: { min: number; max: number }
  date: string
  status: "normal" | "abnormal" | "critical"
}

interface Message {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  unread: boolean
  category: "provider" | "billing" | "appointment" | "general"
}

interface MedicalRecord {
  id: string
  date: string
  provider: string
  type: string
  diagnosis: string
  notes: string
  followUp?: string
}

interface BillingItem {
  id: string
  date: string
  description: string
  amount: number
  status: "paid" | "pending" | "overdue"
  dueDate?: string
}

interface HealthMetric {
  date: string
  systolic?: number
  diastolic?: number
  weight?: number
  glucose?: number
  heartRate?: number
}

export default function PatientPortal() {
  // Patient Data
  const [patient] = useState<Patient>({
    id: "PT-001",
    name: "Sarah Johnson",
    dateOfBirth: "1985-03-15",
    memberId: "MEM-2024-78542",
    primaryCareProvider: "Dr. Emily Chen",
    insurancePlan: "Blue Cross Premium PPO",
  })

  // Appointments
  const [appointments] = useState<Appointment[]>([
    {
      id: "APT-001",
      provider: "Dr. Emily Chen",
      specialty: "Primary Care",
      dateTime: "2025-01-02T10:30:00",
      location: "Main Medical Center, Suite 200",
      type: "in-person",
      status: "scheduled",
    },
    {
      id: "APT-002",
      provider: "Dr. James Wilson",
      specialty: "Cardiology",
      dateTime: "2025-01-08T14:00:00",
      location: "Telehealth",
      type: "telehealth",
      status: "scheduled",
    },
    {
      id: "APT-003",
      provider: "Dr. Lisa Park",
      specialty: "Dermatology",
      dateTime: "2024-12-20T09:00:00",
      location: "Specialty Clinic, Floor 3",
      type: "in-person",
      status: "completed",
    },
    {
      id: "APT-004",
      provider: "Dr. Emily Chen",
      specialty: "Primary Care",
      dateTime: "2024-11-15T11:00:00",
      location: "Main Medical Center, Suite 200",
      type: "in-person",
      status: "completed",
    },
  ])

  // Prescriptions
  const [prescriptions] = useState<Prescription[]>([
    {
      id: "RX-001",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      refillsRemaining: 3,
      pharmacy: "CVS Pharmacy - Main St",
      prescribedBy: "Dr. Emily Chen",
      lastFilled: "2024-12-01",
    },
    {
      id: "RX-002",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily with meals",
      refillsRemaining: 5,
      pharmacy: "CVS Pharmacy - Main St",
      prescribedBy: "Dr. Emily Chen",
      lastFilled: "2024-12-10",
    },
    {
      id: "RX-003",
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      refillsRemaining: 0,
      pharmacy: "CVS Pharmacy - Main St",
      prescribedBy: "Dr. James Wilson",
      lastFilled: "2024-11-15",
    },
    {
      id: "RX-004",
      medication: "Vitamin D3",
      dosage: "2000 IU",
      frequency: "Once daily",
      refillsRemaining: 6,
      pharmacy: "CVS Pharmacy - Main St",
      prescribedBy: "Dr. Emily Chen",
      lastFilled: "2024-12-15",
    },
  ])

  // Test Results
  const [testResults] = useState<TestResult[]>([
    {
      id: "TR-001",
      testName: "Hemoglobin A1C",
      value: 6.2,
      unit: "%",
      normalRange: { min: 4.0, max: 5.6 },
      date: "2024-12-15",
      status: "abnormal",
    },
    {
      id: "TR-002",
      testName: "Total Cholesterol",
      value: 185,
      unit: "mg/dL",
      normalRange: { min: 0, max: 200 },
      date: "2024-12-15",
      status: "normal",
    },
    {
      id: "TR-003",
      testName: "LDL Cholesterol",
      value: 110,
      unit: "mg/dL",
      normalRange: { min: 0, max: 100 },
      date: "2024-12-15",
      status: "abnormal",
    },
    {
      id: "TR-004",
      testName: "HDL Cholesterol",
      value: 55,
      unit: "mg/dL",
      normalRange: { min: 40, max: 60 },
      date: "2024-12-15",
      status: "normal",
    },
    {
      id: "TR-005",
      testName: "Fasting Glucose",
      value: 105,
      unit: "mg/dL",
      normalRange: { min: 70, max: 100 },
      date: "2024-12-15",
      status: "abnormal",
    },
    {
      id: "TR-006",
      testName: "Creatinine",
      value: 0.9,
      unit: "mg/dL",
      normalRange: { min: 0.6, max: 1.2 },
      date: "2024-12-15",
      status: "normal",
    },
  ])

  // Messages
  const [messages] = useState<Message[]>([
    {
      id: "MSG-001",
      from: "Dr. Emily Chen",
      subject: "Lab Results Available",
      preview: "Your recent lab results are now available. Overall, things look good with a few areas we should discuss...",
      timestamp: "2024-12-26T14:30:00",
      unread: true,
      category: "provider",
    },
    {
      id: "MSG-002",
      from: "Appointment Reminder",
      subject: "Upcoming Appointment - Jan 2",
      preview: "This is a reminder for your appointment with Dr. Emily Chen on January 2nd at 10:30 AM...",
      timestamp: "2024-12-25T09:00:00",
      unread: true,
      category: "appointment",
    },
    {
      id: "MSG-003",
      from: "Billing Department",
      subject: "Statement Ready",
      preview: "Your December statement is ready to view. Please review your account balance...",
      timestamp: "2024-12-20T11:15:00",
      unread: false,
      category: "billing",
    },
    {
      id: "MSG-004",
      from: "Dr. James Wilson",
      subject: "Follow-up on Cardiology Visit",
      preview: "Thank you for your visit last month. I wanted to follow up on our discussion about...",
      timestamp: "2024-12-18T16:45:00",
      unread: false,
      category: "provider",
    },
  ])

  // Medical Records
  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: "MR-001",
      date: "2024-12-20",
      provider: "Dr. Lisa Park",
      type: "Dermatology Consultation",
      diagnosis: "Mild eczema, bilateral arms",
      notes: "Prescribed topical corticosteroid cream. Advised to use fragrance-free moisturizers and avoid hot showers.",
      followUp: "Return in 4 weeks if no improvement",
    },
    {
      id: "MR-002",
      date: "2024-11-15",
      provider: "Dr. Emily Chen",
      type: "Annual Physical Examination",
      diagnosis: "Pre-diabetes, Hyperlipidemia, Essential hypertension (controlled)",
      notes: "Blood pressure stable on current medication. A1C slightly elevated at 6.2%. Discussed dietary modifications and increased physical activity. Continue current medications.",
      followUp: "Repeat A1C in 3 months",
    },
    {
      id: "MR-003",
      date: "2024-10-05",
      provider: "Dr. James Wilson",
      type: "Cardiology Follow-up",
      diagnosis: "Mild left ventricular hypertrophy",
      notes: "Echo shows stable findings. Continue blood pressure management. Patient tolerating Lisinopril well with no side effects reported.",
      followUp: "Annual follow-up recommended",
    },
  ])

  // Billing
  const [billingItems] = useState<BillingItem[]>([
    {
      id: "BILL-001",
      date: "2024-12-20",
      description: "Dermatology Consultation - Dr. Park",
      amount: 45.00,
      status: "pending",
      dueDate: "2025-01-20",
    },
    {
      id: "BILL-002",
      date: "2024-11-15",
      description: "Annual Physical - Dr. Chen",
      amount: 0.00,
      status: "paid",
    },
    {
      id: "BILL-003",
      date: "2024-10-05",
      description: "Cardiology Follow-up - Dr. Wilson",
      amount: 75.00,
      status: "paid",
    },
  ])

  // Health Metrics
  const [healthMetrics] = useState<HealthMetric[]>([
    { date: "Nov 1", systolic: 138, diastolic: 88, weight: 172, glucose: 118, heartRate: 78 },
    { date: "Nov 8", systolic: 135, diastolic: 86, weight: 171, glucose: 112, heartRate: 76 },
    { date: "Nov 15", systolic: 132, diastolic: 84, weight: 170, glucose: 108, heartRate: 74 },
    { date: "Nov 22", systolic: 130, diastolic: 82, weight: 169, glucose: 105, heartRate: 72 },
    { date: "Nov 29", systolic: 128, diastolic: 80, weight: 168, glucose: 102, heartRate: 71 },
    { date: "Dec 6", systolic: 126, diastolic: 78, weight: 167, glucose: 98, heartRate: 70 },
    { date: "Dec 13", systolic: 125, diastolic: 78, weight: 166, glucose: 95, heartRate: 69 },
    { date: "Dec 20", systolic: 124, diastolic: 76, weight: 165, glucose: 92, heartRate: 68 },
  ])

  // Computed values
  const upcomingAppointments = appointments.filter(a => a.status === "scheduled")
  const unreadMessages = messages.filter(m => m.unread).length
  const pendingBalance = billingItems.filter(b => b.status === "pending").reduce((sum, b) => sum + b.amount, 0)
  const refillsNeeded = prescriptions.filter(p => p.refillsRemaining === 0).length

  // Status badge helper
  const getTestResultBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Normal</Badge>
      case "abnormal":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Abnormal</Badge>
      case "critical":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
    }
  }

  const getAppointmentTypeBadge = (type: Appointment["type"]) => {
    switch (type) {
      case "in-person":
        return <Badge className="bg-secondary/20 text-secondary border-secondary/30">In-Person</Badge>
      case "telehealth":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Telehealth</Badge>
    }
  }

  const getBillingStatusBadge = (status: BillingItem["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Overdue</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const latestMetric = healthMetrics[healthMetrics.length - 1]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent terminal-glow">
              Patient Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {patient.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              Member ID: {patient.memberId}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
            >
              <Bell className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadMessages > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {unreadMessages}
                </span>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="glass border-primary/30 p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Upcoming Visits</p>
              <Calendar className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary font-mono">
              {upcomingAppointments.length}
            </p>
            <p className="text-muted-foreground text-xs mt-1">Next: Jan 2</p>
          </Card>

          <Card className="glass border-secondary/30 p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Messages</p>
              <MessageSquare className="h-5 w-5 text-secondary/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-secondary font-mono">
              {unreadMessages}
            </p>
            <p className="text-muted-foreground text-xs mt-1">unread messages</p>
          </Card>

          <Card className="glass border-amber-500/30 p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Balance Due</p>
              <Wallet className="h-5 w-5 text-amber-400/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-amber-400 font-mono">
              ${pendingBalance.toFixed(2)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">due Jan 20</p>
          </Card>

          <Card className="glass border-red-500/30 p-4 md:p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Refills Needed</p>
              <Pill className="h-5 w-5 text-red-400/50" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-red-400 font-mono">
              {refillsNeeded}
            </p>
            <p className="text-muted-foreground text-xs mt-1">medications</p>
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
                <TabsTrigger value="appointments" className="text-xs sm:text-sm whitespace-nowrap">Appointments</TabsTrigger>
                <TabsTrigger value="records" className="text-xs sm:text-sm whitespace-nowrap">Records</TabsTrigger>
                <TabsTrigger value="prescriptions" className="text-xs sm:text-sm whitespace-nowrap">Prescriptions</TabsTrigger>
                <TabsTrigger value="results" className="text-xs sm:text-sm whitespace-nowrap">Test Results</TabsTrigger>
                <TabsTrigger value="messages" className="text-xs sm:text-sm whitespace-nowrap">Messages</TabsTrigger>
                <TabsTrigger value="billing" className="text-xs sm:text-sm whitespace-nowrap">Billing</TabsTrigger>
                <TabsTrigger value="health" className="text-xs sm:text-sm whitespace-nowrap">Health Metrics</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Patient Info Card */}
                <Card className="glass border-primary/30 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-muted-foreground text-sm">DOB: {formatDate(patient.dateOfBirth)}</p>
                    </div>
                  </div>
                  <Separator className="bg-primary/20 mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary/50" />
                      <span className="text-muted-foreground text-sm">PCP:</span>
                      <span className="text-foreground text-sm">{patient.primaryCareProvider}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary/50" />
                      <span className="text-muted-foreground text-sm">Insurance:</span>
                      <span className="text-foreground text-sm">{patient.insurancePlan}</span>
                    </div>
                  </div>
                </Card>

                {/* Next Appointment */}
                <Card className="glass border-secondary/30 p-6">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Next Appointment</h3>
                  {upcomingAppointments[0] && (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-foreground font-medium">{upcomingAppointments[0].provider}</p>
                          <p className="text-muted-foreground text-sm">{upcomingAppointments[0].specialty}</p>
                        </div>
                        {getAppointmentTypeBadge(upcomingAppointments[0].type)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-secondary/50" />
                          <span className="text-foreground">{formatDateTime(upcomingAppointments[0].dateTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-secondary/50" />
                          <span className="text-foreground">{upcomingAppointments[0].location}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30">
                        <Video className="h-4 w-4 mr-2" />
                        Check In
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Quick Health Snapshot */}
                <Card className="glass border-blue-500/30 p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4">Health Snapshot</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-muted-foreground text-sm">Blood Pressure</span>
                      </div>
                      <span className="text-foreground font-mono text-sm">
                        {latestMetric.systolic}/{latestMetric.diastolic}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground text-sm">Heart Rate</span>
                      </div>
                      <span className="text-foreground font-mono text-sm">{latestMetric.heartRate} bpm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-blue-400" />
                        <span className="text-muted-foreground text-sm">Weight</span>
                      </div>
                      <span className="text-foreground font-mono text-sm">{latestMetric.weight} lbs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-amber-400" />
                        <span className="text-muted-foreground text-sm">Glucose</span>
                      </div>
                      <span className="text-foreground font-mono text-sm">{latestMetric.glucose} mg/dL</span>
                    </div>
                    <Separator className="bg-blue-500/20" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-primary" />
                      <span>BP trending down 11% this month</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {messages.slice(0, 3).map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-primary/20 rounded-lg p-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${msg.unread ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        <div>
                          <p className="text-foreground text-sm font-medium">{msg.subject}</p>
                          <p className="text-muted-foreground text-xs">{msg.from}</p>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(msg.timestamp)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-primary">Your Appointments</h3>
                <Button className="w-full sm:w-auto bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Upcoming */}
                <Card className="glass border-secondary/30 p-6">
                  <h4 className="text-secondary font-semibold mb-4">Upcoming</h4>
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === "scheduled").map((apt, idx) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-secondary/20 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-foreground font-medium">{apt.provider}</p>
                            <p className="text-muted-foreground text-sm">{apt.specialty}</p>
                          </div>
                          {getAppointmentTypeBadge(apt.type)}
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-secondary/50" />
                            <span className="text-foreground">{formatDateTime(apt.dateTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-secondary/50" />
                            <span className="text-foreground">{apt.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-muted-foreground/30 text-foreground hover:bg-muted/20">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Past */}
                <Card className="glass border-muted-foreground/30 p-6">
                  <h4 className="text-muted-foreground font-semibold mb-4">Past Appointments</h4>
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === "completed").map((apt, idx) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-muted-foreground/20 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-foreground font-medium">{apt.provider}</p>
                            <p className="text-muted-foreground text-sm">{apt.specialty}</p>
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/30">Completed</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{formatDateTime(apt.dateTime)}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Medical Records Tab */}
            <TabsContent value="records" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">Medical Records</h3>
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Download All</span>
                  </Button>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {medicalRecords.map((record, idx) => (
                    <AccordionItem
                      key={record.id}
                      value={record.id}
                      className="glass-dark border-primary/20 rounded-lg px-4 data-[state=open]:border-primary/40"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-left">
                          <span className="text-foreground font-medium">{record.type}</span>
                          <span className="text-muted-foreground text-sm">{record.provider}</span>
                          <span className="text-muted-foreground text-xs">{formatDate(record.date)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-2">
                          <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Diagnosis</p>
                            <p className="text-foreground text-sm">{record.diagnosis}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-foreground text-sm">{record.notes}</p>
                          </div>
                          {record.followUp && (
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Follow-up</p>
                              <p className="text-secondary text-sm">{record.followUp}</p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">Active Prescriptions</h3>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    {prescriptions.length} Medications
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {prescriptions.map((rx, idx) => (
                    <motion.div
                      key={rx.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`glass-dark rounded-lg p-4 border-l-4 ${
                        rx.refillsRemaining === 0
                          ? "border-l-red-500"
                          : rx.refillsRemaining <= 2
                          ? "border-l-amber-500"
                          : "border-l-primary"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-foreground font-semibold">{rx.medication}</p>
                          <p className="text-muted-foreground text-sm">{rx.dosage} - {rx.frequency}</p>
                        </div>
                        <Pill className={`h-5 w-5 ${
                          rx.refillsRemaining === 0
                            ? "text-red-400"
                            : "text-primary/50"
                        }`} />
                      </div>
                      <Separator className="bg-primary/10 mb-3" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Refills remaining</span>
                          <span className={`font-mono ${
                            rx.refillsRemaining === 0
                              ? "text-red-400"
                              : rx.refillsRemaining <= 2
                              ? "text-amber-400"
                              : "text-primary"
                          }`}>
                            {rx.refillsRemaining}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pharmacy</span>
                          <span className="text-foreground">{rx.pharmacy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last filled</span>
                          <span className="text-foreground">{formatDate(rx.lastFilled)}</span>
                        </div>
                      </div>
                      {rx.refillsRemaining === 0 && (
                        <Button className="w-full mt-4 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Request Refill
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Test Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Test Results</h3>
                    <p className="text-muted-foreground text-sm">Latest labs from {formatDate(testResults[0]?.date || "")}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10">
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Download PDF</span>
                  </Button>
                </div>
                <div className="space-y-3">
                  {testResults.map((result, idx) => {
                    const isInRange = result.value >= result.normalRange.min && result.value <= result.normalRange.max
                    const percentage = Math.min(
                      100,
                      Math.max(
                        0,
                        ((result.value - result.normalRange.min) / (result.normalRange.max - result.normalRange.min)) * 100
                      )
                    )

                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark border-primary/20 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <TestTube className={`h-5 w-5 ${
                              result.status === "normal"
                                ? "text-primary"
                                : result.status === "abnormal"
                                ? "text-amber-400"
                                : "text-red-400"
                            }`} />
                            <div>
                              <p className="text-foreground font-medium">{result.testName}</p>
                              <p className="text-muted-foreground text-xs">
                                Normal range: {result.normalRange.min} - {result.normalRange.max} {result.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-lg ${
                              result.status === "normal"
                                ? "text-primary"
                                : result.status === "abnormal"
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}>
                              {result.value} {result.unit}
                            </span>
                            {getTestResultBadge(result.status)}
                          </div>
                        </div>
                        <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-primary/30 rounded-full"
                            style={{ width: "100%" }}
                          />
                          <div
                            className={`absolute top-0 h-full w-2 rounded-full ${
                              result.status === "normal"
                                ? "bg-primary"
                                : result.status === "abnormal"
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                            style={{ left: `calc(${Math.min(98, Math.max(2, percentage))}% - 4px)` }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">Secure Messages</h3>
                  <Button className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
                    <Send className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Message</span>
                  </Button>
                </div>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`glass-dark rounded-lg p-4 cursor-pointer hover:border-primary/40 transition-colors ${
                          msg.unread ? "border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              msg.category === "provider"
                                ? "bg-primary/20"
                                : msg.category === "billing"
                                ? "bg-amber-500/20"
                                : "bg-secondary/20"
                            }`}>
                              {msg.category === "provider" ? (
                                <Stethoscope className="h-5 w-5 text-primary" />
                              ) : msg.category === "billing" ? (
                                <CreditCard className="h-5 w-5 text-amber-400" />
                              ) : (
                                <Bell className="h-5 w-5 text-secondary" />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${msg.unread ? "text-foreground" : "text-muted-foreground"}`}>
                                {msg.from}
                              </p>
                              <p className={`text-sm ${msg.unread ? "text-foreground" : "text-muted-foreground"}`}>
                                {msg.subject}
                              </p>
                            </div>
                          </div>
                          <span className="text-muted-foreground text-xs whitespace-nowrap">
                            {formatDate(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 ml-13">
                          {msg.preview}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="glass border-amber-500/30 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-sm">Outstanding Balance</p>
                    <Wallet className="h-5 w-5 text-amber-400/50" />
                  </div>
                  <p className="text-3xl font-bold text-amber-400 font-mono">${pendingBalance.toFixed(2)}</p>
                  <Button className="w-full mt-4 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </Card>

                <Card className="glass border-primary/30 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-sm">Total Paid (2024)</p>
                    <Wallet className="h-5 w-5 text-primary/50" />
                  </div>
                  <p className="text-3xl font-bold text-primary font-mono">$1,247.00</p>
                  <p className="text-muted-foreground text-xs mt-2">12 transactions</p>
                </Card>

                <Card className="glass border-secondary/30 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-sm">Insurance Covered</p>
                    <CreditCard className="h-5 w-5 text-secondary/50" />
                  </div>
                  <p className="text-3xl font-bold text-secondary font-mono">$8,432.00</p>
                  <p className="text-muted-foreground text-xs mt-2">This year</p>
                </Card>
              </div>

              <Card className="glass border-primary/30 p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Billing History</h3>
                <div className="space-y-3">
                  {billingItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="glass-dark border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-foreground font-medium">{item.description}</p>
                        <p className="text-muted-foreground text-sm">{formatDate(item.date)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-lg ${
                          item.status === "paid"
                            ? "text-muted-foreground"
                            : "text-amber-400"
                        }`}>
                          ${item.amount.toFixed(2)}
                        </span>
                        {getBillingStatusBadge(item.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Health Metrics Tab */}
            <TabsContent value="health" className="space-y-6">
              {/* Blood Pressure Chart */}
              <Card className="glass border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Blood Pressure Trends</h3>
                    <p className="text-muted-foreground text-sm">Last 8 weeks</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-primary" />
                    <span className="text-primary text-sm">-11% improvement</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={healthMetrics}>
                    <defs>
                      <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--primary) / 0.5)"
                      tick={{ fill: "hsl(var(--foreground) / 0.6)", fontSize: 12 }}
                    />
                    <YAxis
                      domain={[60, 160]}
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
                    />
                    <Area
                      type="monotone"
                      dataKey="systolic"
                      stroke="hsl(var(--primary))"
                      fill="url(#systolicGradient)"
                      strokeWidth={2}
                      name="Systolic"
                    />
                    <Area
                      type="monotone"
                      dataKey="diastolic"
                      stroke="hsl(var(--secondary))"
                      fill="url(#diastolicGradient)"
                      strokeWidth={2}
                      name="Diastolic"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Weight Chart */}
                <Card className="glass border-blue-500/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-blue-400 font-semibold">Weight</h4>
                      <p className="text-muted-foreground text-sm">Goal: 160 lbs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-mono text-2xl">{latestMetric.weight}</p>
                      <p className="text-muted-foreground text-xs">lbs</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={healthMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                      <XAxis dataKey="date" hide />
                      <YAxis domain={[155, 175]} hide />
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
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(199 89% 48%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <Progress value={((172 - latestMetric.weight!) / (172 - 160)) * 100} className="h-2 mt-4" />
                  <p className="text-muted-foreground text-xs mt-2 text-center">
                    {172 - latestMetric.weight!} lbs lost, {latestMetric.weight! - 160} lbs to go
                  </p>
                </Card>

                {/* Glucose Chart */}
                <Card className="glass border-amber-500/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-amber-400 font-semibold">Blood Glucose</h4>
                      <p className="text-muted-foreground text-sm">Target: &lt;100 mg/dL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-mono text-2xl">{latestMetric.glucose}</p>
                      <p className="text-muted-foreground text-xs">mg/dL</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={healthMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                      <XAxis dataKey="date" hide />
                      <YAxis domain={[80, 130]} hide />
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
                        type="monotone"
                        dataKey="glucose"
                        stroke="hsl(45 93% 47%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <TrendingDown className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground text-sm">22% decrease over 8 weeks</span>
                  </div>
                </Card>
              </div>

              {/* Log New Reading */}
              <Card className="glass border-secondary/30 p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Log New Reading</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 border-primary/30 text-primary hover:bg-primary/10">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">Blood Pressure</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    <Scale className="h-6 w-6" />
                    <span className="text-sm">Weight</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                    <Droplets className="h-6 w-6" />
                    <span className="text-sm">Glucose</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Heart Rate</span>
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-primary/20"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Hospital className="h-4 w-4" />
            <span>HealthCare Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">1-800-HEALTH</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Support</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
