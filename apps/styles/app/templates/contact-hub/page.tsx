'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Send,
  Upload,
  Globe,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Users,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Wifi,
  Video,
  FileText,
  HelpCircle,
  Bell,
  Sparkles,
  Heart,
  User,
  Building,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Contact methods data
const contactMethods = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email',
    description: 'Get a response within 24 hours',
    primary: 'hello@example.com',
    secondary: 'support@example.com',
    color: 'from-primary/20 to-secondary/20',
    glow: 'group-hover:shadow-primary/20'
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone & WhatsApp',
    description: 'Mon-Fri 9AM-6PM EST',
    primary: '+1 (555) 123-4567',
    secondary: 'WhatsApp Available',
    color: 'from-secondary/20 to-secondary/20',
    glow: 'group-hover:shadow-secondary/20'
  },
  {
    id: 'github',
    icon: Github,
    title: 'GitHub',
    description: 'Check out my projects',
    primary: '@username',
    secondary: '500+ contributions',
    color: 'from-primary/20 to-primary/20',
    glow: 'group-hover:shadow-primary/20'
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Professional network',
    primary: 'in/username',
    secondary: 'Connect with me',
    color: 'from-secondary/20 to-secondary/20',
    glow: 'group-hover:shadow-secondary/20'
  },
  {
    id: 'twitter',
    icon: Twitter,
    title: 'Twitter / X',
    description: 'Latest updates',
    primary: '@username',
    secondary: 'Daily insights',
    color: 'from-secondary/20 to-secondary/20',
    glow: 'group-hover:shadow-secondary/20'
  },
  {
    id: 'location',
    icon: MapPin,
    title: 'Office Location',
    description: 'Visit us in person',
    primary: 'San Francisco, CA',
    secondary: 'Available for meetings',
    color: 'from-primary/20 to-primary/20',
    glow: 'group-hover:shadow-primary/20'
  }
];

// Time slots for booking
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// FAQ data
const faqItems = [
  {
    id: 'response-time',
    question: 'What is your typical response time?',
    answer: 'We typically respond to emails within 24 hours during business days. Phone calls are answered immediately during office hours (9AM-6PM EST, Mon-Fri). For urgent matters, please use the emergency contact option.'
  },
  {
    id: 'meeting-schedule',
    question: 'How do I schedule a meeting?',
    answer: 'Use our calendar booking widget to select an available time slot. You can choose between 15, 30, or 60-minute meetings. Once booked, you\'ll receive a confirmation email with a video call link.'
  },
  {
    id: 'support-hours',
    question: 'What are your support hours?',
    answer: 'Our regular support hours are Monday through Friday, 9AM to 6PM EST. We also offer limited weekend support for premium clients. Check the response time section for channel-specific availability.'
  },
  {
    id: 'preferred-contact',
    question: 'What\'s the best way to reach you?',
    answer: 'For general inquiries, email is best. For urgent technical issues, use the live chat or phone. For project discussions, schedule a video call through our booking system.'
  },
  {
    id: 'international',
    question: 'Do you work with international clients?',
    answer: 'Yes! We work with clients worldwide. Our team can accommodate different time zones for calls and meetings. We use video conferencing for remote consultations.'
  }
];

// Response times by channel
const responseTimes = [
  { channel: 'Email', time: '< 24 hours', availability: 'Always', priority: 'Medium' },
  { channel: 'Phone', time: 'Immediate', availability: '9AM-6PM EST', priority: 'High' },
  { channel: 'Live Chat', time: '< 2 minutes', availability: 'Business hours', priority: 'High' },
  { channel: 'Social Media', time: '< 48 hours', availability: 'Varies', priority: 'Low' },
  { channel: 'Contact Form', time: '< 24 hours', availability: 'Always', priority: 'Medium' },
  { channel: 'Emergency', time: '< 1 hour', availability: '24/7', priority: 'Critical' }
];

export default function ContactHubTemplate() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('30');
  const [messageLength, setMessageLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [newsletter, setNewsletter] = useState({
    email: '',
    frequency: 'weekly'
  });
  const [showChat, setShowChat] = useState(false);

  // Simulate typing indicator
  useEffect(() => {
    if (messageLength > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [messageLength]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen text-foreground relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-300" />
        </div>

        {/* Terminal Grid Background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Hero Section */}
            <motion.section variants={itemVariants} className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <div className="glass rounded-2xl p-8 border border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                  <div className="relative space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-4">
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Contact Hub
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                      Multiple ways to connect. Choose your preferred channel and let's start a conversation.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <Badge variant="outline" className="border-primary/30">
                        <Wifi className="w-3 h-3 mr-1" />
                        Available Now
                      </Badge>
                      <Badge variant="outline" className="border-secondary/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Avg. Response: 2 hours
                      </Badge>
                      <Badge variant="outline" className="border-primary/30">
                        <Star className="w-3 h-3 mr-1" />
                        4.9/5 Rating
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* Contact Methods Grid */}
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold terminal-glow">Choose Your Channel</h2>
                <p className="text-muted-foreground">Select the best way to reach us based on your needs</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02, translateY: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={cn(
                        "glass border-white/10 h-full group cursor-pointer transition-all duration-300",
                        "hover:border-primary/30 hover:shadow-2xl",
                        method.glow
                      )}>
                        <CardContent className="p-6">
                          <div className={cn(
                            "rounded-xl p-4 mb-4 bg-gradient-to-br",
                            method.color
                          )}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                          <div className="space-y-1">
                            <p className="text-sm font-mono text-primary">{method.primary}</p>
                            <p className="text-xs text-muted-foreground">{method.secondary}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Main Contact Form & Calendar Booking */}
            <motion.section variants={itemVariants}>
              <Tabs defaultValue="form" className="space-y-6">
                <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 glass">
                  <TabsTrigger value="form" className="data-[state=active]:bg-primary/20">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="data-[state=active]:bg-secondary/20">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Meeting
                  </TabsTrigger>
                </TabsList>

                {/* Contact Form Tab */}
                <TabsContent value="form">
                  <Card className="glass border-white/10 max-w-3xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        Send Us a Message
                      </CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you as soon as possible
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="glass-dark border-white/10 focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="glass-dark border-white/10 focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            placeholder="Acme Corp"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="glass-dark border-white/10 focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">
                            Subject <span className="text-red-500">*</span>
                          </Label>
                          <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                            <SelectTrigger className="glass-dark border-white/10">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent className="glass-dark border-white/10">
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="sales">Sales & Pricing</SelectItem>
                              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {messageLength}/500 characters
                          </span>
                        </div>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={6}
                          maxLength={500}
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({...formData, message: e.target.value});
                            setMessageLength(e.target.value.length);
                          }}
                          className="glass-dark border-white/10 focus:border-primary/50 resize-none"
                        />
                        {isTyping && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <MessageCircle className="w-3 h-3" />
                            </motion.div>
                            Someone is typing...
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Attachments</Label>
                        <div className="glass-dark border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drop files here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Maximum file size: 10MB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            We'll respond within 24 hours
                          </span>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary">
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Calendar Booking Tab */}
                <TabsContent value="calendar">
                  <Card className="glass border-white/10 max-w-4xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-secondary" />
                        Schedule a Meeting
                      </CardTitle>
                      <CardDescription>
                        Select a date, time, and duration for your meeting
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Meeting Duration */}
                      <div className="space-y-3">
                        <Label>Meeting Duration</Label>
                        <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
                          <div className="grid grid-cols-3 gap-4">
                            <label className="relative cursor-pointer">
                              <RadioGroupItem value="15" className="sr-only" />
                              <div className={cn(
                                "glass-dark border rounded-lg p-4 text-center transition-all",
                                selectedDuration === "15"
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-white/10 hover:border-white/20"
                              )}>
                                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                                <p className="font-semibold">15 min</p>
                                <p className="text-xs text-muted-foreground">Quick chat</p>
                              </div>
                            </label>
                            <label className="relative cursor-pointer">
                              <RadioGroupItem value="30" className="sr-only" />
                              <div className={cn(
                                "glass-dark border rounded-lg p-4 text-center transition-all",
                                selectedDuration === "30"
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-white/10 hover:border-white/20"
                              )}>
                                <Video className="w-5 h-5 mx-auto mb-2 text-secondary" />
                                <p className="font-semibold">30 min</p>
                                <p className="text-xs text-muted-foreground">Standard meeting</p>
                              </div>
                            </label>
                            <label className="relative cursor-pointer">
                              <RadioGroupItem value="60" className="sr-only" />
                              <div className={cn(
                                "glass-dark border rounded-lg p-4 text-center transition-all",
                                selectedDuration === "60"
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-white/10 hover:border-white/20"
                              )}>
                                <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                                <p className="font-semibold">60 min</p>
                                <p className="text-xs text-muted-foreground">Deep dive</p>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Calendar Mock */}
                      <div className="space-y-3">
                        <Label>Select Date</Label>
                        <div className="glass-dark rounded-lg p-2 sm:p-4 border border-white/10">
                          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2 sm:mb-4">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                              <div key={i} className="text-xs text-muted-foreground font-semibold">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {Array.from({ length: 30 }, (_, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedDate(`2025-01-${i + 1}`)}
                                className={cn(
                                  "aspect-square rounded-lg flex items-center justify-center text-sm transition-all",
                                  "hover:bg-white/10 hover:border-primary/30",
                                  selectedDate === `2025-01-${i + 1}`
                                    ? "bg-primary/20 border border-primary/50 text-primary"
                                    : "glass-dark border border-white/5"
                                )}
                                disabled={i % 7 === 0 || i % 7 === 6} // Disable weekends
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Available Times (EST)</Label>
                          <Select defaultValue="est">
                            <SelectTrigger className="w-32 glass-dark border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-dark border-white/10">
                              <SelectItem value="est">EST</SelectItem>
                              <SelectItem value="pst">PST</SelectItem>
                              <SelectItem value="cst">CST</SelectItem>
                              <SelectItem value="gmt">GMT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "px-4 py-2 rounded-lg text-sm transition-all",
                                "hover:bg-white/10 hover:border-primary/30",
                                selectedTime === time
                                  ? "bg-primary/20 border border-primary/50 text-primary"
                                  : "glass-dark border border-white/10"
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Booking Summary */}
                      {selectedDate && selectedTime && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass rounded-lg p-4 border border-primary/30 bg-primary/5"
                        >
                          <h4 className="font-semibold mb-2 text-primary">Booking Summary</h4>
                          <div className="space-y-1 text-sm">
                            <p>Date: {selectedDate}</p>
                            <p>Time: {selectedTime} EST</p>
                            <p>Duration: {selectedDuration} minutes</p>
                            <p>Meeting Type: Video Call (Link will be sent via email)</p>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-secondary" />
                          <span className="text-xs text-muted-foreground">
                            Calendar invite will be sent
                          </span>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-secondary to-secondary hover:from-secondary hover:to-secondary"
                          disabled={!selectedDate || !selectedTime}
                        >
                          Book Meeting
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.section>

            {/* Response Times & Office Hours */}
            <motion.section variants={itemVariants} className="grid md:grid-cols-2 gap-8">
              {/* Response Times */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Response Time Expectations
                  </CardTitle>
                  <CardDescription>
                    Average response times by communication channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responseTimes.map((item) => (
                      <div key={item.channel} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.channel}</p>
                          <p className="text-xs text-muted-foreground">{item.availability}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              "border",
                              item.priority === 'Critical' && "border-red-500/30 text-red-400",
                              item.priority === 'High' && "border-primary/30 text-primary",
                              item.priority === 'Medium' && "border-secondary/30 text-secondary",
                              item.priority === 'Low' && "border-gray-500/30 text-gray-400"
                            )}
                          >
                            {item.priority}
                          </Badge>
                          <span className="text-sm font-mono text-primary">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-secondary" />
                    Office Hours & Availability
                  </CardTitle>
                  <CardDescription>
                    When our team is available for immediate response
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-sm font-mono text-primary">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-sm font-mono text-amber-400">10:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-sm font-mono text-gray-400">Closed</span>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Holiday Schedule 2025</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">New Year's Day</span>
                        <Badge variant="outline" className="border-red-500/30 text-red-400">Closed</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Memorial Day</span>
                        <Badge variant="outline" className="border-red-500/30 text-red-400">Closed</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Independence Day</span>
                        <Badge variant="outline" className="border-red-500/30 text-red-400">Closed</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark rounded-lg p-3 border border-primary/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm text-primary">Currently Open</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* FAQ Section */}
            <motion.section variants={itemVariants} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold terminal-glow">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Quick answers to common questions</p>
              </div>

              <Card className="glass border-white/10 max-w-3xl mx-auto">
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqItems.map((item) => (
                      <AccordionItem key={item.id} value={item.id} className="border-white/10">
                        <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors">
                          <div className="flex items-center gap-3 text-left">
                            <HelpCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                            {item.question}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pl-8">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.section>

            {/* Newsletter & Emergency Contact */}
            <motion.section variants={itemVariants} className="grid md:grid-cols-2 gap-8">
              {/* Newsletter */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Newsletter Subscription
                  </CardTitle>
                  <CardDescription>
                    Stay updated with our latest news and insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsletter-email">Email Address</Label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="your@email.com"
                      value={newsletter.email}
                      onChange={(e) => setNewsletter({...newsletter, email: e.target.value})}
                      className="glass-dark border-white/10 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <RadioGroup value={newsletter.frequency} onValueChange={(value) => setNewsletter({...newsletter, frequency: value})}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly" className="cursor-pointer">Weekly Digest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer">Monthly Summary</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="important" id="important" />
                        <Label htmlFor="important" className="cursor-pointer">Important Updates Only</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox id="newsletter-consent" className="mt-1" />
                    <Label htmlFor="newsletter-consent" className="text-xs text-muted-foreground cursor-pointer">
                      I agree to receive newsletter emails and understand I can unsubscribe at any time
                    </Label>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary">
                    Subscribe
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="glass border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Emergency Contact
                  </CardTitle>
                  <CardDescription>
                    For critical issues requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="glass-dark rounded-lg p-4 border border-red-500/30 bg-red-500/5">
                    <p className="text-sm font-semibold mb-2 text-red-400">24/7 Emergency Hotline</p>
                    <p className="text-2xl font-mono font-bold text-white">+1 (555) 911-2345</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Available 24/7 for critical production issues
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold">When to use emergency contact:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Production system is down</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Security breach or vulnerability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Data loss or corruption</span>
                      </li>
                    </ul>
                  </div>

                  <Button variant="destructive" className="w-full">
                    Call Emergency Line
                    <Phone className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.section>
          </motion.div>
        </div>

        {/* Live Chat Widget (Floating) */}
        <AnimatePresence>
          {showChat ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-4 right-4 z-50 w-80"
            >
              <Card className="glass border-primary/30 shadow-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <CardTitle className="text-base">Live Chat</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowChat(false)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="glass-dark rounded-lg p-3 text-sm">
                    <p className="text-primary">Support Agent</p>
                    <p className="text-muted-foreground">Hi! How can I help you today?</p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      className="glass-dark border-white/10 text-sm"
                    />
                    <Button size="sm" className="bg-primary hover:bg-primary">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowChat(true)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl flex items-center justify-center border border-white/20 hover:shadow-primary/30 transition-shadow"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}