'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { useTheme } from '@/components/ThemeProvider';
import { useBackground, type BackgroundTone } from '@/components/BackgroundProvider';
import { BackgroundMediaSettings } from '@/components/BackgroundMediaSettings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { BorderTrail } from '@/components/ui/border-trail';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Code2, Eye, FileText, Layout, Monitor, Palette, Terminal, User, Zap, ArrowRight,
  CheckCircle2, Sparkles, Grid3x3, Clock, Layers, Activity, AlertCircle, Wrench,
  ShoppingCart, CreditCard, Lock, Users, TrendingUp, Package, FileCode, Briefcase,
  Award, BookOpen, Rss, Mail, Search, MapPin, Compass, Rocket, Target, Gift, MessageSquare,
  UserPlus, PlayCircle, ListChecks, Trophy, Calendar, Bot, Brain, Database, Cloud,
  DollarSign, Server, BarChart3, Settings, Shield, Wand2, LayoutGrid, PaintBucket,
  // New icons for 30 additional templates
  HeartPulse, Wallet, Truck, Warehouse, Video, Music, Headphones, Image, Film,
  GitBranch, ScrollText, Flag, Webhook, GraduationCap, Building2, UtensilsCrossed,
  Plane, Receipt, Inbox, Handshake, FileEdit, CalendarDays, Route, PackageSearch,
  Dumbbell, Bitcoin, Car, Phone
} from 'lucide-react';

// Category consolidation mapping - 9 major categories
const categoryGroups = {
  dashboards: {
    name: 'Dashboards & Analytics',
    categories: ['dashboards', 'specialized_dashboards'],
    icon: <BarChart3 className="h-5 w-5" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  devtools: {
    name: 'Developer Tools',
    categories: ['devtools'],
    icon: <Code2 className="h-5 w-5" />,
    gradient: 'from-emerald-500 to-teal-500'
  },
  ecommerce: {
    name: 'E-Commerce',
    categories: ['ecommerce'],
    icon: <ShoppingCart className="h-5 w-5" />,
    gradient: 'from-green-500 to-emerald-500'
  },
  business: {
    name: 'Business & SaaS',
    categories: ['saas', 'onboarding', 'social', 'gaming', 'compliance'],
    icon: <Briefcase className="h-5 w-5" />,
    gradient: 'from-indigo-500 to-blue-500'
  },
  auth_billing: {
    name: 'Auth & Billing',
    categories: ['auth', 'billing'],
    icon: <Lock className="h-5 w-5" />,
    gradient: 'from-purple-500 to-violet-500'
  },
  marketing: {
    name: 'Marketing & Landing',
    categories: ['marketing', 'landing', 'launch'],
    icon: <TrendingUp className="h-5 w-5" />,
    gradient: 'from-orange-500 to-amber-500'
  },
  content: {
    name: 'Content & Media',
    categories: ['blog', 'portfolio', 'projects', 'resumes', 'media'],
    icon: <FileText className="h-5 w-5" />,
    gradient: 'from-pink-500 to-rose-500'
  },
  tools: {
    name: 'Forms & Email',
    categories: ['forms', 'email'],
    icon: <Wrench className="h-5 w-5" />,
    gradient: 'from-cyan-500 to-blue-500'
  },
  operations: {
    name: 'Operations & Monitoring',
    categories: ['monitoring', 'utility'],
    icon: <Activity className="h-5 w-5" />,
    gradient: 'from-red-500 to-orange-500'
  }
};

// Template metadata - 116 templates across 22 categories
const templates = {
  saas: [
    {
      id: 'roadmap',
      name: 'Product Roadmap',
      path: '/templates/roadmap',
      description: 'Interactive roadmap with timeline, voting system, and feature tracking',
      icon: <MapPin className="h-5 w-5" />,
      features: ['Timeline View', 'Upvoting', '30+ Features', 'Status Filters', 'Feature Details'],
      bestFor: 'Product planning, feature requests, transparency',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'help-center',
      name: 'Help Center',
      path: '/templates/help-center',
      description: 'Comprehensive help hub with categories, articles, FAQs, and videos',
      icon: <Compass className="h-5 w-5" />,
      features: ['9 Categories', '20+ Articles', 'Video Tutorials', 'FAQ Accordion', 'Search'],
      bestFor: 'Customer support, knowledge bases, self-service',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'api-reference',
      name: 'API Reference',
      path: '/templates/api-reference',
      description: 'Complete API docs with code examples, playground, and error reference',
      icon: <Code2 className="h-5 w-5" />,
      features: ['9+ Endpoints', 'Multi-language', 'Copy Code', 'Try it Out', 'Error Codes'],
      bestFor: 'API documentation, developer tools, technical docs',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 10, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'community',
      name: 'Community Forum',
      path: '/templates/community',
      description: 'Discussion forum with categories, voting, leaderboard, and trending topics',
      icon: <MessageSquare className="h-5 w-5" />,
      features: ['8 Categories', '20+ Discussions', 'Upvoting', 'Leaderboard', 'Tag System'],
      bestFor: 'Community forums, discussion boards, Q&A platforms',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'affiliates',
      name: 'Affiliate Program',
      path: '/templates/affiliates',
      description: 'Affiliate program page with calculator, tiers, testimonials, and resources',
      icon: <Gift className="h-5 w-5" />,
      features: ['5 Commission Tiers', 'Earnings Calculator', 'Success Stories', 'Resources', 'FAQ'],
      bestFor: 'Affiliate programs, referral systems, partner portals',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'course-platform',
      name: 'Course Platform',
      path: '/templates/course-platform',
      description: 'LMS course viewer with video lessons, quizzes, and progress tracking',
      icon: <GraduationCap className="h-5 w-5" />,
      features: ['Video Lessons', 'Quizzes', 'Progress Tracking', 'Certificates', 'Discussion'],
      bestFor: 'Online courses, e-learning, training platforms',
      color: 'from-indigo-500 to-purple-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'job-board',
      name: 'Job Board',
      path: '/templates/job-board',
      description: 'Recruiting job listings with search, filters, and applications',
      icon: <Briefcase className="h-5 w-5" />,
      features: ['Job Search', 'Advanced Filters', 'Applications', 'Company Profiles', 'Saved Jobs'],
      bestFor: 'Job boards, recruiting platforms, career sites',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'deal-pipeline',
      name: 'Deal Pipeline',
      path: '/templates/deal-pipeline',
      description: 'Sales CRM pipeline with drag-and-drop deals and analytics',
      icon: <Handshake className="h-5 w-5" />,
      features: ['Pipeline Stages', 'Drag & Drop', 'Deal Details', 'Analytics', 'Team View'],
      bestFor: 'Sales CRM, deal tracking, revenue management',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 11, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'contact-management',
      name: 'Contact Management',
      path: '/templates/contact-management',
      description: 'CRM contacts and companies with activity timeline and tags',
      icon: <Users className="h-5 w-5" />,
      features: ['Contact List', 'Company Profiles', 'Activity Timeline', 'Tags', 'Import/Export'],
      bestFor: 'CRM systems, contact databases, relationship management',
      color: 'from-violet-500 to-indigo-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'notion-workspace',
      name: 'Notion Workspace',
      path: '/templates/notion-workspace',
      description: 'Notes and document editor with blocks, databases, and collaboration',
      icon: <FileEdit className="h-5 w-5" />,
      features: ['Block Editor', 'Page Hierarchy', 'Databases', 'Templates', 'Collaboration'],
      bestFor: 'Note-taking, wikis, documentation, knowledge bases',
      color: 'from-gray-500 to-slate-600',
      preview: { sections: 12, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'calendar-scheduler',
      name: 'Calendar Scheduler',
      path: '/templates/calendar-scheduler',
      description: 'Event calendar with scheduling, reminders, and team availability',
      icon: <CalendarDays className="h-5 w-5" />,
      features: ['Month/Week/Day View', 'Event Creation', 'Reminders', 'Team Calendar', 'Integrations'],
      bestFor: 'Scheduling apps, calendar tools, meeting planners',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'shift-scheduler',
      name: 'Shift Scheduler',
      path: '/templates/shift-scheduler',
      description: 'Employee shift planning with availability and swap requests',
      icon: <Clock className="h-5 w-5" />,
      features: ['Shift Calendar', 'Employee Availability', 'Swap Requests', 'Overtime Tracking', 'Reports'],
      bestFor: 'HR, workforce management, retail scheduling',
      color: 'from-orange-500 to-amber-500',
      preview: { sections: 11, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'delivery-route',
      name: 'Delivery Route',
      path: '/templates/delivery-route',
      description: 'Driver route optimization with stops, map, and delivery tracking',
      icon: <Route className="h-5 w-5" />,
      features: ['Route Map', 'Stop List', 'Optimization', 'Live Tracking', 'Proof of Delivery'],
      bestFor: 'Delivery apps, logistics, field service',
      color: 'from-green-500 to-teal-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'email-inbox',
      name: 'Email Inbox',
      path: '/templates/email-inbox',
      description: 'Email client interface with folders, compose, and search',
      icon: <Inbox className="h-5 w-5" />,
      features: ['Inbox/Folders', 'Compose', 'Search', 'Labels', 'Attachments'],
      bestFor: 'Email clients, messaging apps, communication platforms',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'video-call',
      name: 'Video Call',
      path: '/templates/video-call',
      description: 'Video conferencing room with participants, chat, and controls',
      icon: <Video className="h-5 w-5" />,
      features: ['Video Grid', 'Screen Share', 'Chat', 'Reactions', 'Recording'],
      bestFor: 'Video conferencing, virtual meetings, webinars',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    }
  ],

  onboarding: [
    {
      id: 'product-tour',
      name: 'Product Tour',
      path: '/templates/product-tour',
      description: 'Interactive spotlight tour with 8 steps and keyboard navigation',
      icon: <Compass className="h-5 w-5" />,
      features: ['8 Tour Steps', 'Spotlight Effect', 'Keyboard Nav', 'Skip/Restart', 'Progress Bar'],
      bestFor: 'User onboarding, feature introduction, first-time experience',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'setup-wizard',
      name: 'Setup Wizard',
      path: '/templates/setup-wizard',
      description: '7-step setup wizard with forms, team management, and integrations',
      icon: <Rocket className="h-5 w-5" />,
      features: ['7 Steps', 'Form Validation', 'Team Setup', 'Integrations', 'Review Page'],
      bestFor: 'Account setup, configuration wizards, initial setup',
      color: 'from-indigo-500 to-purple-500',
      preview: { sections: 11, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'onboarding-checklist',
      name: 'Onboarding Checklist',
      path: '/templates/onboarding-checklist',
      description: '12-item checklist with progress ring, milestones, and achievements',
      icon: <ListChecks className="h-5 w-5" />,
      features: ['12 Tasks', 'Progress Ring', 'Milestones', 'Achievements', 'Expand/Collapse'],
      bestFor: 'Task tracking, onboarding flows, progress visualization',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'welcome-series',
      name: 'Welcome Series',
      path: '/templates/welcome-series',
      description: '7-day welcome series with emails, videos, tips, and achievements',
      icon: <Mail className="h-5 w-5" />,
      features: ['7-Day Series', 'Email Previews', 'Video Tutorials', 'Achievements', 'Resources'],
      bestFor: 'Email campaigns, educational content, drip campaigns',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ],

  social: [
    {
      id: 'social-feed',
      name: 'Social Feed',
      path: '/templates/social-feed',
      description: 'Social media feed with posts, comments, polls, and trending topics',
      icon: <Activity className="h-5 w-5" />,
      features: ['Post Composer', '25+ Posts', 'Like/Comment/Share', 'Polls', 'Trending'],
      bestFor: 'Social platforms, activity feeds, community engagement',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'user-directory',
      name: 'User Directory',
      path: '/templates/user-directory',
      description: 'Searchable user directory with filters, grid/list views, and profiles',
      icon: <UserPlus className="h-5 w-5" />,
      features: ['35+ Users', 'Grid/List View', 'Advanced Filters', 'Follow System', 'User Profiles'],
      bestFor: 'Member directories, team pages, user discovery',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 7, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard',
      path: '/templates/leaderboard',
      description: 'Top 100 leaderboard with podium, rankings, badges, and sparklines',
      icon: <Trophy className="h-5 w-5" />,
      features: ['Top 100', 'Podium Display', 'Rank Changes', 'Badges', 'Sparklines'],
      bestFor: 'Gamification, competitions, achievement tracking',
      color: 'from-yellow-500 to-orange-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    }
  ],
  ecommerce: [
    {
      id: 'product-detail',
      name: 'Product Detail',
      path: '/templates/product-detail',
      description: 'Complete product page with image gallery, variants, reviews, and related products',
      icon: <Package className="h-5 w-5" />,
      features: ['Image Gallery', 'Variant Selector', 'Reviews', 'Related Products', 'Wishlist'],
      bestFor: 'E-commerce stores, product catalogs, online shops',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'cart',
      name: 'Shopping Cart',
      path: '/templates/cart',
      description: 'Full-featured cart with quantity controls, coupons, and recommendations',
      icon: <ShoppingCart className="h-5 w-5" />,
      features: ['Quantity Controls', 'Coupon Codes', 'Save for Later', 'Shipping Calculator', 'Recommendations'],
      bestFor: 'E-commerce checkout flows, shopping experiences',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 6, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'checkout',
      name: 'Checkout Flow',
      path: '/templates/checkout',
      description: 'Multi-step checkout with shipping, payment, and order review',
      icon: <CreditCard className="h-5 w-5" />,
      features: ['Multi-Step', 'Address Forms', 'Payment Methods', 'Guest Checkout', 'Order Summary'],
      bestFor: 'E-commerce checkout, payment flows, order processing',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'product-listing',
      name: 'Product Listing',
      path: '/templates/product-listing',
      description: 'Advanced product grid with filters, sorting, and quick view',
      icon: <Grid3x3 className="h-5 w-5" />,
      features: ['Grid/List View', 'Advanced Filters', 'Sort Options', 'Quick View', 'Pagination'],
      bestFor: 'Product catalogs, search results, category pages',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 7, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'product-comparison',
      name: 'Product Comparison',
      path: '/templates/product-comparison',
      description: 'Side-by-side product comparison with feature matrix and value analysis',
      icon: <Layers className="h-5 w-5" />,
      features: ['Side-by-Side', 'Feature Matrix', 'Highlight Differences', 'Value Score', 'Export'],
      bestFor: 'Product comparisons, decision support, feature analysis',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 5, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'order-confirmation',
      name: 'Order Confirmation',
      path: '/templates/order-confirmation',
      description: 'Success page with order details, tracking, and next steps',
      icon: <CheckCircle2 className="h-5 w-5" />,
      features: ['Success Animation', 'Order Timeline', 'Tracking', 'Invoice Download', 'Recommendations'],
      bestFor: 'Order confirmations, success pages, post-purchase',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: 'order-tracking',
      name: 'Order Tracking',
      path: '/templates/order-tracking',
      description: 'Package tracking with delivery status, map, and notifications',
      icon: <PackageSearch className="h-5 w-5" />,
      features: ['Status Timeline', 'Live Map', 'Delivery ETA', 'Notifications', 'Delivery History'],
      bestFor: 'Shipping tracking, delivery apps, logistics',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'restaurant-menu',
      name: 'Restaurant Menu',
      path: '/templates/restaurant-menu',
      description: 'Digital menu with categories, dietary filters, and ordering',
      icon: <UtensilsCrossed className="h-5 w-5" />,
      features: ['Menu Categories', 'Dietary Filters', 'Add to Cart', 'Item Details', 'Special Offers'],
      bestFor: 'Restaurants, food ordering, digital menus',
      color: 'from-orange-500 to-red-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'property-listing',
      name: 'Property Listing',
      path: '/templates/property-listing',
      description: 'Real estate listings with search, filters, and property details',
      icon: <Building2 className="h-5 w-5" />,
      features: ['Property Search', 'Map View', 'Advanced Filters', 'Virtual Tours', 'Agent Contact'],
      bestFor: 'Real estate, property rentals, home buying',
      color: 'from-teal-500 to-cyan-500',
      preview: { sections: 11, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'booking-flow',
      name: 'Booking Flow',
      path: '/templates/booking-flow',
      description: 'Travel booking wizard with dates, guests, and payment',
      icon: <Plane className="h-5 w-5" />,
      features: ['Date Picker', 'Guest Selection', 'Room Options', 'Add-ons', 'Payment Integration'],
      bestFor: 'Hotels, travel booking, reservations',
      color: 'from-sky-500 to-blue-500',
      preview: { sections: 12, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ],

  auth: [
    {
      id: 'login',
      name: 'Login',
      path: '/templates/login',
      description: 'Beautiful login page with social auth and password recovery',
      icon: <Lock className="h-5 w-5" />,
      features: ['Social Login', 'Remember Me', 'Password Toggle', 'Error States', 'Loading States'],
      bestFor: 'User authentication, app logins, secure access',
      color: 'from-indigo-500 to-blue-500',
      preview: { sections: 4, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'signup',
      name: 'Sign Up',
      path: '/templates/signup',
      description: 'Multi-step registration with profile setup and preferences',
      icon: <User className="h-5 w-5" />,
      features: ['Multi-Step', 'Password Strength', 'Username Check', 'Profile Upload', 'Preferences'],
      bestFor: 'User registration, account creation, onboarding',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'password-reset',
      name: 'Password Reset',
      path: '/templates/password-reset',
      description: 'Three-state password reset flow with email verification',
      icon: <Wrench className="h-5 w-5" />,
      features: ['Three States', 'Email Validation', 'Expiration Timer', 'Requirements', 'Security Tips'],
      bestFor: 'Password recovery, account security, reset flows',
      color: 'from-cyan-500 to-teal-500',
      preview: { sections: 6, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: '2fa-setup',
      name: 'Two-Factor Auth',
      path: '/templates/2fa-setup',
      description: 'Complete 2FA setup with QR codes and backup codes',
      icon: <Lock className="h-5 w-5" />,
      features: ['QR Code', 'Backup Codes', 'SMS Option', 'Device Management', 'Verification'],
      bestFor: 'Security setup, 2FA configuration, account protection',
      color: 'from-red-500 to-orange-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'email-verification',
      name: 'Email Verification',
      path: '/templates/email-verification',
      description: 'Email verification with code input and resend functionality',
      icon: <Mail className="h-5 w-5" />,
      features: ['Code Input', 'Countdown Timer', 'Resend Email', 'Auto-Verify', 'Help Section'],
      bestFor: 'Email verification, account activation, security',
      color: 'from-yellow-500 to-orange-500',
      preview: { sections: 5, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    }
  ],

  marketing: [
    {
      id: 'features',
      name: 'Features Grid',
      path: '/templates/features',
      description: 'Comprehensive feature showcase with categories and comparisons',
      icon: <Grid3x3 className="h-5 w-5" />,
      features: ['20+ Features', 'Category Tabs', 'Detail Modals', 'Use Cases', 'Comparison'],
      bestFor: 'Product features, capability showcases, marketing pages',
      color: 'from-primary to-secondary',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'integrations',
      name: 'Integrations',
      path: '/templates/integrations',
      description: 'Integration marketplace with search, filters, and details',
      icon: <Package className="h-5 w-5" />,
      features: ['25+ Integrations', 'Search & Filter', 'Coming Soon', 'Detail Modal', 'Request Form'],
      bestFor: 'Integration marketplaces, API platforms, partnerships',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 7, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'comparison',
      name: 'Competitor Comparison',
      path: '/templates/comparison',
      description: 'Side-by-side competitor comparison with feature matrix',
      icon: <Layers className="h-5 w-5" />,
      features: ['4 Competitors', '25+ Features', 'Sticky Header', 'Highlighting', 'Category Filter'],
      bestFor: 'Competitive analysis, feature comparisons, sales pages',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 6, animations: 'Medium', interactivity: 'High', dataVisualization: 'High' }
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      path: '/templates/testimonials',
      description: 'Customer testimonials with video, ratings, and case studies',
      icon: <Users className="h-5 w-5" />,
      features: ['12+ Testimonials', 'Video Section', 'Industry Filter', 'Case Studies', 'Metrics'],
      bestFor: 'Social proof, customer stories, trust building',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 8, animations: 'High', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: 'about',
      name: 'About/Company',
      path: '/templates/about',
      description: 'Company story with timeline, team, values, and culture',
      icon: <Briefcase className="h-5 w-5" />,
      features: ['Timeline', '12+ Team Members', 'Values', 'Culture Photos', 'Investors'],
      bestFor: 'About pages, company profiles, team showcases',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Medium', dataVisualization: 'Low' }
    },
    {
      id: 'press-kit',
      name: 'Press Kit',
      path: '/templates/press-kit',
      description: 'Brand assets, logos, press releases, and media coverage',
      icon: <FileText className="h-5 w-5" />,
      features: ['6 Logo Variants', 'Color Palette', 'Typography', 'Press Releases', 'Media Coverage'],
      bestFor: 'Press kits, brand guidelines, media resources',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 9, animations: 'Medium', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'careers',
      name: 'Careers',
      path: '/templates/careers',
      description: 'Job listings with search, filters, benefits, and application process',
      icon: <Award className="h-5 w-5" />,
      features: ['12+ Jobs', 'Search & Filter', '9 Benefits', 'Hiring Process', 'Job Details'],
      bestFor: 'Career pages, job boards, recruiting',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'security',
      name: 'Security/Trust',
      path: '/templates/security',
      description: 'Security features, compliance, certifications, and bug bounty',
      icon: <Lock className="h-5 w-5" />,
      features: ['12+ Features', '6 Certifications', 'Security Practices', 'Bug Bounty', 'Incident History'],
      bestFor: 'Security pages, trust centers, compliance documentation',
      color: 'from-red-500 to-orange-500',
      preview: { sections: 9, animations: 'Medium', interactivity: 'Medium', dataVisualization: 'High' }
    }
  ],

  monitoring: [
    {
      id: 'status-page',
      name: 'Status Page',
      path: '/templates/status-page',
      description: 'System status overview with uptime history and incident tracking',
      icon: <Activity className="h-5 w-5" />,
      features: ['10+ Services', 'Uptime Charts', 'Incident Timeline', 'Subscribe', 'Status Filters'],
      bestFor: 'System status pages, uptime monitoring, service health',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'High', dataVisualization: 'Very High' }
    },
    {
      id: 'uptime-monitor',
      name: 'Uptime Monitor',
      path: '/templates/uptime-monitor',
      description: 'Comprehensive monitoring dashboard with charts and alerts',
      icon: <Monitor className="h-5 w-5" />,
      features: ['15+ Monitors', 'Uptime Charts', 'Response Time', 'Alert Settings', 'Performance Metrics'],
      bestFor: 'Monitoring dashboards, uptime tracking, DevOps tools',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'incident-report',
      name: 'Incident Report',
      path: '/templates/incident-report',
      description: 'Detailed postmortem with timeline, root cause, and prevention',
      icon: <AlertCircle className="h-5 w-5" />,
      features: ['Timeline', 'Impact Charts', 'Root Cause', 'Resolution Steps', 'Related Incidents'],
      bestFor: 'Incident reports, postmortems, RCA documentation',
      color: 'from-red-500 to-orange-500',
      preview: { sections: 9, animations: 'High', interactivity: 'High', dataVisualization: 'Very High' }
    },
    {
      id: 'maintenance',
      name: 'Maintenance Page',
      path: '/templates/maintenance',
      description: 'Scheduled maintenance notice with countdown and progress tracking',
      icon: <Wrench className="h-5 w-5" />,
      features: ['Countdown Timer', 'Progress Tracker', 'Status Updates', 'Affected Services', 'Subscribe'],
      bestFor: 'Maintenance pages, planned downtime, service updates',
      color: 'from-yellow-500 to-orange-500',
      preview: { sections: 7, animations: 'Very High', interactivity: 'Medium', dataVisualization: 'High' }
    }
  ],

  blog: [
    {
      id: 'author-profile',
      name: 'Author Profile',
      path: '/templates/author-profile',
      description: 'Author page with bio, articles, stats, and achievements',
      icon: <User className="h-5 w-5" />,
      features: ['35+ Articles', 'Search & Filter', 'Expertise Tags', 'Activity Timeline', 'Achievements'],
      bestFor: 'Author profiles, writer pages, contributor showcases',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'category',
      name: 'Category Page',
      path: '/templates/category',
      description: 'Category hub with featured articles, subcategories, and tags',
      icon: <Grid3x3 className="h-5 w-5" />,
      features: ['Featured Carousel', '35+ Articles', 'Subcategories', 'Grid/List View', 'Popular Tags'],
      bestFor: 'Category pages, content hubs, topic organization',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'tag',
      name: 'Tag Page',
      path: '/templates/tag',
      description: 'Tag page with cloud visualization and related content',
      icon: <Sparkles className="h-5 w-5" />,
      features: ['Tag Cloud', '35+ Articles', 'Related Tags', 'Top Contributors', 'Follow Tag'],
      bestFor: 'Tag pages, topic exploration, content discovery',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 7, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'archive',
      name: 'Archive',
      path: '/templates/archive',
      description: 'Complete archive with timeline, calendar heatmap, and statistics',
      icon: <Clock className="h-5 w-5" />,
      features: ['Timeline View', 'Calendar Heatmap', '300+ Articles', 'Statistics Dashboard', 'Export'],
      bestFor: 'Blog archives, content timelines, historical views',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      path: '/templates/newsletter',
      description: 'Newsletter hub with subscription, past issues, and preferences',
      icon: <Mail className="h-5 w-5" />,
      features: ['Subscribe Form', '30+ Past Issues', 'Topic Selection', 'Referral Program', 'Sample Content'],
      bestFor: 'Newsletter pages, email marketing, subscriptions',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'resources',
      name: 'Resources Hub',
      path: '/templates/resources',
      description: 'Resource library with categories, filters, and curated collections',
      icon: <BookOpen className="h-5 w-5" />,
      features: ['35+ Resources', '6 Categories', 'Search & Filter', 'Collections', 'Download Tracking'],
      bestFor: 'Resource hubs, learning centers, asset libraries',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ],

  portfolio: [
    {
      id: 'portfolio-minimal',
      name: 'Minimal Portfolio',
      path: '/templates/portfolio-minimal',
      description: 'Clean, minimalist portfolio with focus on typography and whitespace',
      icon: <Layout className="h-5 w-5" />,
      features: ['Large Typography', 'Hover Reveals', 'Skills Grid', 'Contact Form', 'Monochrome Option'],
      bestFor: 'Designers, minimalist portfolios, creative professionals',
      color: 'from-gray-500 to-slate-500',
      preview: { sections: 6, animations: 'Medium', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'portfolio-bento',
      name: 'Bento Grid Portfolio',
      path: '/templates/portfolio-bento',
      description: 'Modern bento grid layout with variable-sized cards',
      icon: <Grid3x3 className="h-5 w-5" />,
      features: ['Masonry Grid', 'GitHub Activity', 'Testimonials', 'Skills Progress', 'Rearrangeable'],
      bestFor: 'Modern portfolios, creative showcases, interactive designs',
      color: 'from-primary to-secondary',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'portfolio-magazine',
      name: 'Magazine Portfolio',
      path: '/templates/portfolio-magazine',
      description: 'Editorial magazine layout with large images and typography',
      icon: <FileText className="h-5 w-5" />,
      features: ['Editorial Layout', 'Featured Hero', 'Multi-Column', 'Pull Quotes', 'Reading Time'],
      bestFor: 'Editorial portfolios, writers, content creators',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 8, animations: 'High', interactivity: 'High', dataVisualization: 'Low' }
    }
  ],

  projects: [
    {
      id: 'case-study',
      name: 'Case Study',
      path: '/templates/case-study',
      description: 'Deep project analysis with timeline, before/after comparison, and results metrics',
      icon: <FileText className="h-5 w-5" />,
      features: ['Timeline Process', 'Before/After Slider', 'Animated Counters', 'Image Gallery', 'Video Section'],
      bestFor: 'Client projects, portfolios, success stories',
      color: 'from-primary to-primary',
      preview: { sections: 11, animations: 'Very High', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: 'api-docs',
      name: 'API Documentation',
      path: '/templates/api-docs',
      description: 'Interactive API documentation with code examples and live playground',
      icon: <Code2 className="h-5 w-5" />,
      features: ['Interactive Playground', 'Multi-language Examples', 'Rate Limiting', 'Status Codes', 'Version Selector'],
      bestFor: 'Developer tools, APIs, technical documentation',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 9, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'blog-post',
      name: 'Blog/Article',
      path: '/templates/blog-post',
      description: 'Technical blog with MDX support, TOC, and syntax highlighting',
      icon: <FileText className="h-5 w-5" />,
      features: ['Table of Contents', 'Code Highlighting', 'Copy Code', 'Social Share', 'Related Articles'],
      bestFor: 'Technical blogs, documentation, tutorials',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 8, animations: 'Medium', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'project-case-study',
      name: 'Project Case Study',
      path: '/templates/project-case-study',
      description: 'Complete case study with metrics, tech stack, timeline & testimonials',
      icon: <Briefcase className="h-5 w-5" />,
      features: ['Project metrics dashboard', 'Tabbed content (Overview/Technical/Features/Gallery/Timeline)', 'Challenge-solution framework', 'Carousel gallery', 'Contributor showcase'],
      bestFor: 'Detailed project breakdowns, portfolio showcases, client presentations',
      color: 'from-blue-500 to-purple-500',
      preview: { sections: 8, animations: 'High', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: 'project-dashboard',
      name: 'Project Dashboard',
      path: '/templates/project-dashboard',
      description: 'Gantt chart, task list, team overview & milestone tracking dashboard',
      icon: <Activity className="h-5 w-5" />,
      features: ['Interactive Gantt chart with zoom', 'Task hierarchy with subtasks', 'Team workload monitoring', 'Real-time activity feed', 'Upcoming deadlines & blockers'],
      bestFor: 'Project managers, team leads, agile workflows, sprint planning',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'project-technical',
      name: 'Project Technical',
      path: '/templates/project-technical',
      description: 'Architecture, API docs, performance metrics, code examples & deployment',
      icon: <Terminal className="h-5 w-5" />,
      features: ['System architecture layers', 'Benchmark comparison table', 'Code examples with copy', 'API endpoint documentation', 'Deployment instructions'],
      bestFor: 'Technical documentation, developer onboarding, open source projects',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 10, animations: 'Medium', interactivity: 'Medium', dataVisualization: 'Medium' }
    },
    {
      id: 'project-visual',
      name: 'Project Visual',
      path: '/templates/project-visual',
      description: 'Visual showcase with masonry gallery, before/after, animations & demos',
      icon: <Sparkles className="h-5 w-5" />,
      features: ['3D floating card effects', 'Masonry image gallery', 'Before/after comparison sliders', 'Animated statistics counters', 'Design system showcase'],
      bestFor: 'Design portfolios, UI/UX showcases, visual projects, creative work',
      color: 'from-pink-500 to-purple-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    }
  ],

  dashboards: [
    {
      id: 'dashboard',
      name: 'Analytics Dashboard',
      path: '/templates/dashboard',
      description: 'Comprehensive analytics dashboard with charts, metrics, and real-time data',
      icon: <BarChart3 className="h-5 w-5" />,
      features: ['9+ chart types (area, bar, line, pie, radial, scatter, funnel)', 'Real-time activity tracking with live updates', 'Performance metrics table with tabs', 'Activity heatmap visualization', 'Extended metrics grid with 6 additional KPIs'],
      bestFor: 'Analytics platforms, business intelligence tools, SaaS metrics dashboards, data visualization applications',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 12, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'admin-dashboard',
      name: 'Admin Dashboard',
      path: '/templates/admin-dashboard',
      description: 'Full-featured admin panel with user management, content, and analytics',
      icon: <Settings className="h-5 w-5" />,
      features: ['Collapsible sidebar navigation (desktop & mobile)', 'Advanced data tables with TanStack Table (sorting, filtering, pagination)', 'User management with bulk actions', 'Content management with status tracking', 'System settings with quick actions'],
      bestFor: 'Admin panels, CMS platforms, user management systems, internal tools, enterprise dashboards',
      color: 'from-slate-500 to-zinc-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'user-profile',
      name: 'User Profile',
      path: '/templates/user-profile',
      description: 'GitHub-style profile with contribution graph, achievements, and privacy controls',
      icon: <User className="h-5 w-5" />,
      features: ['Contribution Graph', 'Activity Timeline', 'Achievements', 'Skills Endorsements', 'Privacy Controls'],
      bestFor: 'User profiles, developer portfolios, social platforms',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 11, animations: 'Very High', interactivity: 'High', dataVisualization: 'Very High' }
    },
    {
      id: 'ai-agent-dashboard',
      name: 'AI Agent Orchestration',
      path: '/templates/ai-agent-dashboard',
      description: 'Multi-agent system monitoring with live task streams and cost tracking',
      icon: <Bot className="h-5 w-5" />,
      features: ['8 specialized AI agents with health metrics', 'Real-time task execution stream', 'Tool usage analytics with 6 categories', 'Agent network communication graph', 'Cost breakdown and optimization recommendations'],
      bestFor: 'Multi-agent AI systems, agent orchestration platforms, AI workflow automation',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 7, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'llm-training-dashboard',
      name: 'LLM Training Monitor',
      path: '/templates/llm-training-dashboard',
      description: 'Real-time training metrics, GPU cluster monitoring, and loss curves',
      icon: <Brain className="h-5 w-5" />,
      features: ['Live training loss and validation curves', '8-GPU cluster monitoring with temps', 'Learning rate schedule visualization', 'Checkpoint management system', 'Cost tracking with hourly burn rate'],
      bestFor: 'LLM training operations, ML research teams, model fine-tuning workflows',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 5, animations: 'High', interactivity: 'High', dataVisualization: 'Very High' }
    },
    {
      id: 'ml-model-performance',
      name: 'ML Model Performance',
      path: '/templates/ml-model-performance',
      description: 'A/B testing, confusion matrix, ROC curves, and error analysis',
      icon: <Target className="h-5 w-5" />,
      features: ['A/B test comparison with statistical significance', 'Interactive confusion matrix (3-class)', 'ROC and Precision-Recall curves', 'Feature importance with SHAP values', 'Misclassification examples with confidence'],
      bestFor: 'Model evaluation, A/B testing ML models, classification performance analysis',
      color: 'from-emerald-500 to-blue-500',
      preview: { sections: 6, animations: 'Medium', interactivity: 'High', dataVisualization: 'Very High' }
    },
    {
      id: 'vector-db-dashboard',
      name: 'Vector Database Monitor',
      path: '/templates/vector-db-dashboard',
      description: 'Embedding quality, search performance, similarity distributions',
      icon: <Database className="h-5 w-5" />,
      features: ['2.4M vectors across 3 namespaces', 'Search latency and QPS monitoring', 'Similarity score distribution analysis', 'Embedding quality metrics (coverage, drift)', 'Index health with fragmentation tracking'],
      bestFor: 'RAG applications, semantic search systems, vector database operations',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 5, animations: 'High', interactivity: 'Medium', dataVisualization: 'Very High' }
    },
    {
      id: 'iot-sensor-dashboard',
      name: 'IoT Sensor Dashboard',
      path: '/templates/iot-sensor-dashboard',
      description: 'Real-time environmental monitoring with 18 sensor types and alerts',
      icon: <Activity className="h-5 w-5" />,
      features: ['Multi-zone sensor monitoring', 'Live threshold alerts', 'Anomaly detection ML', 'Environmental controls', 'Grid/Map/Chart views'],
      bestFor: 'Smart buildings, industrial IoT, environmental monitoring, facility management',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 7, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'live-weather-dashboard',
      name: 'Live Weather Dashboard',
      path: '/templates/live-weather-dashboard',
      description: 'Comprehensive weather monitoring with forecasts and air quality',
      icon: <Cloud className="h-5 w-5" />,
      features: ['24h hourly forecast', '7-day forecast', 'Air quality index', 'Weather alerts', 'Historical comparison'],
      bestFor: 'Weather apps, outdoor planning, agriculture, aviation, smart city platforms',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Medium', dataVisualization: 'Very High' }
    },
    {
      id: 'social-analytics-dashboard',
      name: 'Social Analytics Dashboard',
      path: '/templates/social-analytics-dashboard',
      description: 'Multi-platform social media insights with engagement tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      features: ['Live activity feed', 'Trending topics tracking', 'Sentiment analysis', 'Competitor benchmarking', 'Audience demographics'],
      bestFor: 'Social media managers, marketing agencies, influencers, brand monitoring',
      color: 'from-pink-500 to-purple-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'stock-trading-dashboard',
      name: 'Stock Trading Dashboard',
      path: '/templates/stock-trading-dashboard',
      description: 'Professional trading platform with live order book and execution',
      icon: <DollarSign className="h-5 w-5" />,
      features: ['Real-time price charts', 'Live order book', 'Trade execution panel', 'Portfolio tracking', 'Market news feed'],
      bestFor: 'Trading platforms, fintech apps, investment tools, stock analysis services',
      color: 'from-emerald-500 to-green-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'kubernetes-dashboard',
      name: 'Kubernetes Dashboard',
      path: '/templates/kubernetes-dashboard',
      description: 'Container orchestration monitoring with real-time cluster metrics',
      icon: <Server className="h-5 w-5" />,
      features: ['Multi-cluster management', 'Real-time pod monitoring', 'Node health tracking', 'Live event stream', 'Security policy scanning'],
      bestFor: 'DevOps teams managing Kubernetes clusters, monitoring container health and resource usage',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 7, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'terraform-dashboard',
      name: 'Terraform Dashboard',
      path: '/templates/terraform-dashboard',
      description: 'Infrastructure as Code management with state tracking and cost analysis',
      icon: <Wrench className="h-5 w-5" />,
      features: ['Multi-cloud resource tracking', 'Drift detection', 'Cost analysis by provider', 'Deployment history', 'Security scanning'],
      bestFor: 'Infrastructure engineers managing Terraform deployments across AWS, Azure, and GCP',
      color: 'from-purple-500 to-indigo-500',
      preview: { sections: 5, animations: 'High', interactivity: 'Very High', dataVisualization: 'Very High' }
    }
  ],

  specialized_dashboards: [
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      path: '/templates/analytics-dashboard',
      description: 'Comprehensive analytics with funnels, cohort retention, and geographic data',
      icon: <TrendingUp className="h-5 w-5" />,
      features: ['15+ KPIs', 'Acquisition Funnel', 'Cohort Heatmap', 'Geo Distribution', 'Real-time'],
      bestFor: 'Product analytics, user behavior, conversion tracking',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'sales-dashboard',
      name: 'Sales Dashboard',
      path: '/templates/sales-dashboard',
      description: 'Sales pipeline, revenue forecasts, leaderboard, and commission tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      features: ['Pipeline Stages', 'Win/Loss', 'Forecasts', 'Leaderboard', 'CAC/LTV'],
      bestFor: 'Sales teams, CRM analytics, revenue tracking',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'devops-dashboard',
      name: 'DevOps Dashboard',
      path: '/templates/devops-dashboard',
      description: 'Server health, deployments, error monitoring, and infrastructure costs',
      icon: <Activity className="h-5 w-5" />,
      features: ['Server Health', 'Deployments', 'Error Monitoring', 'Git Activity', 'API Performance'],
      bestFor: 'DevOps teams, infrastructure monitoring, SRE',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'finance-dashboard',
      name: 'Finance Dashboard',
      path: '/templates/finance-dashboard',
      description: 'Revenue, expenses, cash flow, invoices, and financial projections',
      icon: <TrendingUp className="h-5 w-5" />,
      features: ['Cash Flow', 'P&L', 'AR Aging', 'Projections', 'Budget vs Actual'],
      bestFor: 'Financial reporting, accounting, CFO dashboards',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'marketing-dashboard',
      name: 'Marketing Dashboard',
      path: '/templates/marketing-dashboard',
      description: 'Campaign performance, ROI, attribution, and channel analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      features: ['Campaign ROI', 'Attribution', 'Funnel', 'Social Analytics', 'Lead Gen'],
      bestFor: 'Marketing teams, campaign tracking, growth analytics',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'support-dashboard',
      name: 'Support Dashboard',
      path: '/templates/support-dashboard',
      description: 'Ticket volume, response times, CSAT, and agent performance',
      icon: <Users className="h-5 w-5" />,
      features: ['Ticket Volume', 'SLA Tracking', 'CSAT', 'Agent Performance', 'Channel Distribution'],
      bestFor: 'Support teams, customer service, helpdesk analytics',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'patient-portal',
      name: 'Patient Portal',
      path: '/templates/patient-portal',
      description: 'Healthcare patient dashboard with appointments, records, and prescriptions',
      icon: <HeartPulse className="h-5 w-5" />,
      features: ['Appointments', 'Medical Records', 'Prescriptions', 'Lab Results', 'Messages'],
      bestFor: 'Healthcare apps, patient management, medical portals',
      color: 'from-red-500 to-rose-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'fitness-tracker',
      name: 'Fitness Tracker',
      path: '/templates/fitness-tracker',
      description: 'Workout and health dashboard with activity tracking and goals',
      icon: <Dumbbell className="h-5 w-5" />,
      features: ['Workout Logs', 'Activity Rings', 'Goal Tracking', 'Progress Charts', 'Achievements'],
      bestFor: 'Fitness apps, health tracking, wellness platforms',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'wallet-dashboard',
      name: 'Crypto Wallet',
      path: '/templates/wallet-dashboard',
      description: 'Cryptocurrency wallet with portfolio tracking and transactions',
      icon: <Bitcoin className="h-5 w-5" />,
      features: ['Portfolio Value', 'Asset List', 'Transactions', 'Price Charts', 'Send/Receive'],
      bestFor: 'Crypto wallets, DeFi apps, trading platforms',
      color: 'from-amber-500 to-yellow-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'fleet-dashboard',
      name: 'Fleet Dashboard',
      path: '/templates/fleet-dashboard',
      description: 'Vehicle fleet management with GPS tracking and maintenance',
      icon: <Car className="h-5 w-5" />,
      features: ['Live Tracking', 'Vehicle Status', 'Maintenance Alerts', 'Driver Management', 'Route History'],
      bestFor: 'Fleet management, logistics, transportation companies',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 12, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'inventory-management',
      name: 'Inventory Management',
      path: '/templates/inventory-management',
      description: 'Warehouse inventory dashboard with stock levels and orders',
      icon: <Warehouse className="h-5 w-5" />,
      features: ['Stock Levels', 'Low Stock Alerts', 'Order Management', 'Suppliers', 'Reports'],
      bestFor: 'Warehouses, retail inventory, supply chain',
      color: 'from-indigo-500 to-purple-500',
      preview: { sections: 11, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    }
  ],

  billing: [
    {
      id: 'billing-history',
      name: 'Billing History',
      path: '/templates/billing-history',
      description: 'Invoice history with filters, spending charts, and payment management',
      icon: <CreditCard className="h-5 w-5" />,
      features: ['30+ Invoices', 'Status Filters', 'Spending Chart', 'Auto-pay', 'PDF Download'],
      bestFor: 'Subscription billing, invoice management, payment history',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'subscription-management',
      name: 'Subscription Management',
      path: '/templates/subscription-management',
      description: 'Plan comparison, upgrades, add-ons, and usage tracking',
      icon: <Package className="h-5 w-5" />,
      features: ['4 Plan Tiers', '10+ Add-ons', 'Usage Tracking', 'Billing Cycle', 'Plan History'],
      bestFor: 'SaaS subscriptions, plan management, billing cycles',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'invoice-detail',
      name: 'Invoice Detail',
      path: '/templates/invoice-detail',
      description: 'Detailed invoice with line items, payment info, and export options',
      icon: <FileText className="h-5 w-5" />,
      features: ['Line Items', 'Payment Method', 'PDF Export', 'Email Invoice', 'Payment History'],
      bestFor: 'Invoice viewing, payment receipts, billing details',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 7, animations: 'Medium', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'usage-metering',
      name: 'Usage & Metering',
      path: '/templates/usage-metering',
      description: 'Real-time usage tracking with alerts, charts, and cost projections',
      icon: <Activity className="h-5 w-5" />,
      features: ['Real-time Usage', 'Peak Times', 'Cost Projection', 'Alerts', 'Feature Breakdown'],
      bestFor: 'Usage-based billing, API metering, resource tracking',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'payment-methods',
      name: 'Payment Methods',
      path: '/templates/payment-methods',
      description: 'Manage cards, payment methods, billing addresses, and auto-pay',
      icon: <CreditCard className="h-5 w-5" />,
      features: ['Card Management', 'Add Card', 'Auto-pay', 'Security Badges', 'Payment History'],
      bestFor: 'Payment management, card storage, billing preferences',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'expense-tracker',
      name: 'Expense Tracker',
      path: '/templates/expense-tracker',
      description: 'Personal and business expense tracking with categories and reports',
      icon: <Receipt className="h-5 w-5" />,
      features: ['Expense Logging', 'Categories', 'Receipt Upload', 'Reports', 'Budgets'],
      bestFor: 'Expense management, budget tracking, financial apps',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'invoice-generator',
      name: 'Invoice Generator',
      path: '/templates/invoice-generator',
      description: 'Create and send invoices with line items, tax, and templates',
      icon: <FileText className="h-5 w-5" />,
      features: ['Invoice Builder', 'Line Items', 'Tax Calculation', 'Templates', 'Send & Track'],
      bestFor: 'Freelancers, small business, invoicing apps',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ],

  launch: [
    {
      id: 'waitlist',
      name: 'Waitlist/Coming Soon',
      path: '/templates/waitlist',
      description: 'Countdown timer, email capture, referral system, and social proof',
      icon: <Clock className="h-5 w-5" />,
      features: ['Countdown Timer', 'Email Capture', 'Referral System', 'Exit Intent', 'FAQ'],
      bestFor: 'Pre-launch pages, waitlist building, coming soon',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 7, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      path: '/templates/product-launch',
      description: 'Launch announcement with offer, testimonials, and early bird pricing',
      icon: <Rocket className="h-5 w-5" />,
      features: ['Launch Offer', 'Product Hunt', 'Beta Testimonials', 'Feature Showcase', 'Press Mentions'],
      bestFor: 'Product launches, announcement pages, launch day',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: 'landing-app',
      name: 'App Landing Page',
      path: '/templates/landing-app',
      description: 'App-focused landing with store badges, screenshots, and reviews',
      icon: <Monitor className="h-5 w-5" />,
      features: ['App Store Badges', 'Screenshots', 'Feature Grid', 'Testimonials', 'Security Badges'],
      bestFor: 'Mobile apps, app downloads, app marketing',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'landing-agency',
      name: 'Agency Landing Page',
      path: '/templates/landing-agency',
      description: 'Agency portfolio with services, case studies, and team showcase',
      icon: <Briefcase className="h-5 w-5" />,
      features: ['Services Grid', 'Portfolio', 'Case Studies', 'Team Section', 'Process Timeline'],
      bestFor: 'Agencies, consultancies, service businesses',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'squeeze-page',
      name: 'Squeeze Page',
      path: '/templates/squeeze-page',
      description: 'High-conversion single-focus landing with minimal distractions',
      icon: <Target className="h-5 w-5" />,
      features: ['Single Focus', 'Exit Intent', 'Trust Signals', 'Urgency', 'Minimal Form'],
      bestFor: 'Lead generation, opt-in pages, high-conversion funnels',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 5, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    }
  ],

  forms: [
    {
      id: 'form-builder',
      name: 'Form Builder',
      path: '/templates/form-builder',
      description: 'Drag-and-drop form creator with conditional logic and 16 field types',
      icon: <FileCode className="h-5 w-5" />,
      features: ['Drag & Drop', '16 Field Types', 'Conditional Logic', 'Templates', 'Export JSON'],
      bestFor: 'Form creation, surveys, data collection tools',
      color: 'from-blue-500 to-indigo-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'survey-builder',
      name: 'Survey Builder',
      path: '/templates/survey-builder',
      description: 'Professional survey creator with 9 question types and logic jumps',
      icon: <ListChecks className="h-5 w-5" />,
      features: ['9 Question Types', 'Logic Jumps', 'Templates', 'Preview Mode', 'Randomization'],
      bestFor: 'Surveys, feedback forms, research tools',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 7, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'quiz-builder',
      name: 'Quiz Builder',
      path: '/templates/quiz-builder',
      description: 'Interactive quiz creator with scoring, timer, and certificates',
      icon: <Award className="h-5 w-5" />,
      features: ['6 Question Types', 'Scoring System', 'Timer', 'Certificates', 'Leaderboard'],
      bestFor: 'Quizzes, assessments, educational tools',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'event-registration',
      name: 'Event Registration',
      path: '/templates/event-registration',
      description: '8-step registration wizard with tickets, add-ons, and QR codes',
      icon: <Calendar className="h-5 w-5" />,
      features: ['8-Step Wizard', 'Ticket Types', 'Add-ons', 'QR Code', 'Calendar Invite'],
      bestFor: 'Event registration, conference booking, ticket sales',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 11, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ],

  email: [
    {
      id: 'email-transactional',
      name: 'Transactional Emails',
      path: '/templates/email-transactional',
      description: '10 transactional email templates with variable editor and export',
      icon: <Mail className="h-5 w-5" />,
      features: ['10 Templates', 'Variable Editor', 'HTML Export', 'Test Email', 'Mobile Preview'],
      bestFor: 'Transactional emails, automated messages, receipts',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 8, animations: 'Medium', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'email-marketing',
      name: 'Marketing Emails',
      path: '/templates/email-marketing',
      description: '8 marketing templates with spam checker and A/B testing',
      icon: <Mail className="h-5 w-5" />,
      features: ['8 Templates', 'Spam Checker', 'A/B Testing', 'Client Preview', 'Personalization'],
      bestFor: 'Marketing emails, newsletters, campaigns',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'email-campaign-builder',
      name: 'Email Campaign Builder',
      path: '/templates/email-campaign-builder',
      description: 'Drag-and-drop email builder with scheduling and segmentation',
      icon: <FileCode className="h-5 w-5" />,
      features: ['Drag & Drop', '8 Block Types', 'Scheduling', 'Segmentation', 'Checklist'],
      bestFor: 'Email campaigns, newsletter creation, marketing automation',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'email-analytics',
      name: 'Email Analytics',
      path: '/templates/email-analytics',
      description: 'Campaign analytics with open rates, clicks, and engagement tracking',
      icon: <TrendingUp className="h-5 w-5" />,
      features: ['Campaign Table', 'Open/Click Rates', 'Geo Distribution', 'Time Analysis', 'Export'],
      bestFor: 'Email analytics, campaign tracking, deliverability',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 12, animations: 'High', interactivity: 'Very High', dataVisualization: 'Very High' }
    }
  ],

  landing: [
    {
      id: 'saas-landing',
      name: 'SaaS Landing Page',
      path: '/templates/saas-landing',
      description: 'High-converting SaaS landing page with pricing, testimonials, and CTAs',
      icon: <Zap className="h-5 w-5" />,
      features: ['Animated Hero', 'Pricing Cards', 'Testimonial Carousel', 'FAQ Accordion', 'Newsletter Form'],
      bestFor: 'SaaS products, startups, subscription services',
      color: 'from-primary to-secondary',
      preview: { sections: 14, animations: 'Very High', interactivity: 'High', dataVisualization: 'High' }
    },
    {
      id: 'pricing',
      name: 'Pricing Page',
      path: '/templates/pricing',
      description: 'Advanced pricing comparison with toggle, matrix table, and testimonials',
      icon: <Sparkles className="h-5 w-5" />,
      features: ['Monthly/Annual Toggle', 'Feature Matrix', '3D Card Hover', 'Currency Selector', 'FAQ Section'],
      bestFor: 'SaaS pricing, subscription plans, service tiers',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'contact-hub',
      name: 'Contact Hub',
      path: '/templates/contact-hub',
      description: 'Multi-channel contact center with calendar booking and live chat',
      icon: <User className="h-5 w-5" />,
      features: ['Calendar Booking', 'Contact Form', 'Live Chat', 'Response Times', 'Emergency Contact'],
      bestFor: 'Business contact, support centers, booking systems',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'landing-portfolio',
      name: 'Portfolio Landing Page',
      path: '/templates/landing-portfolio',
      description: 'Professional portfolio landing with hero, projects, about, and contact sections',
      icon: <Briefcase className="h-5 w-5" />,
      features: ['Hero Section', 'Featured Projects', 'About/Bio', 'Contact Form', 'Template Gallery Link'],
      bestFor: 'Developer portfolios, freelancer sites, personal branding, showcasing projects',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 5, animations: 'High', interactivity: 'Medium', dataVisualization: 'Low' }
    }
  ],

  resumes: [
    {
      id: 'timeline',
      name: 'Timeline/Resume',
      path: '/templates/timeline',
      description: 'Career progression with interactive timeline, skills matrix, and testimonials',
      icon: <Clock className="h-5 w-5" />,
      features: ['Interactive Timeline', 'Skills Progress', 'Testimonials', 'PDF Export', 'Certifications'],
      bestFor: 'Professional applications, tech roles, career showcase',
      color: 'from-primary to-secondary',
      preview: { sections: 12, animations: 'Very High', interactivity: 'High', dataVisualization: 'Very High' }
    },
    {
      id: 'team',
      name: 'Team/About Us',
      path: '/templates/team',
      description: 'Company culture page with team grid, values, and timeline',
      icon: <User className="h-5 w-5" />,
      features: ['Team Grid', 'Company Timeline', 'Values Section', 'Office Gallery', 'Open Positions'],
      bestFor: 'Company pages, startup teams, agency portfolios',
      color: 'from-indigo-500 to-purple-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Medium', dataVisualization: 'Medium' }
    },
    {
      id: 'resume-bento',
      name: 'Resume Bento',
      path: '/templates/resume-bento',
      description: 'Modern bento grid layout with live stats, activity feed & tech stack',
      icon: <LayoutGrid className="h-5 w-5" />,
      features: ['Animated stat counters', 'GitHub contribution graph', 'Real-time activity feed', 'Tech stack progress bars', '50 project showcase grid'],
      bestFor: 'Modern resumes, developer portfolios, personal dashboards',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 15, animations: 'Very High', interactivity: 'Medium', dataVisualization: 'High' }
    },
    {
      id: 'resume-terminal',
      name: 'Resume Terminal',
      path: '/templates/resume-terminal',
      description: 'Interactive terminal emulation with 20+ commands & easter eggs',
      icon: <Terminal className="h-5 w-5" />,
      features: ['Full terminal emulation', 'Command history navigation', 'Tab auto-complete', 'File system navigation', 'Matrix effect & easter eggs'],
      bestFor: 'Developer portfolios, CLI enthusiasts, unique resume presentations',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 1, animations: 'High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'resume-timeline',
      name: 'Resume Timeline',
      path: '/templates/resume-timeline',
      description: 'Professional timeline resume with skills matrix & achievement badges',
      icon: <Calendar className="h-5 w-5" />,
      features: ['Visual career timeline', 'Skills proficiency matrix', 'Achievement badges', 'Featured projects grid', 'Certifications display'],
      bestFor: 'Traditional resumes, career progression visualization, job applications',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 7, animations: 'High', interactivity: 'Medium', dataVisualization: 'Medium' }
    }
  ],

  utility: [
    {
      id: 'changelog',
      name: 'Changelog',
      path: '/templates/changelog',
      description: 'Version history with timeline, release notes, and migration guides',
      icon: <FileText className="h-5 w-5" />,
      features: ['Version Timeline', 'Code Examples', 'Search/Filter', 'Subscription Options', 'Download Links'],
      bestFor: 'Product updates, release notes, version tracking',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 9, animations: 'Medium', interactivity: 'High', dataVisualization: 'Low' }
    },
    {
      id: 'settings',
      name: 'Settings Page',
      path: '/templates/settings',
      description: 'Comprehensive settings with appearance, privacy, API keys, and integrations',
      icon: <Layout className="h-5 w-5" />,
      features: ['Theme Selector', 'Privacy Controls', 'API Keys', 'Webhooks', 'Session Management'],
      bestFor: 'App settings, user preferences, configuration panels',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 9, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'search-results',
      name: 'Search Results',
      path: '/templates/search-results',
      description: 'Advanced search with filters, pagination, and code highlighting',
      icon: <Search className="h-5 w-5" />,
      features: ['Advanced Filters', 'Code Search', 'Pagination', 'Search History', 'Grid/List View'],
      bestFor: 'Search interfaces, content discovery, documentation search',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 8, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'docs-hub',
      name: 'Documentation Hub',
      path: '/templates/docs-hub',
      description: 'Central documentation portal with categories, search, and examples',
      icon: <FileText className="h-5 w-5" />,
      features: ['Category Grid', 'Doc Tree', 'Version Selector', 'Interactive Examples', 'Multi-language'],
      bestFor: 'Documentation sites, help centers, knowledge bases',
      color: 'from-primary to-secondary',
      preview: { sections: 12, animations: 'High', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: '404',
      name: '404 Error',
      path: '/templates/404',
      description: 'Interactive terminal-themed 404 page with ASCII art and commands',
      icon: <Terminal className="h-5 w-5" />,
      features: ['ASCII Art', 'Glitch Effect', 'Terminal Commands', 'Matrix Background', 'Auto Redirect'],
      bestFor: 'Error pages, not found pages, creative 404s',
      color: 'from-red-500 to-orange-500',
      preview: { sections: 4, animations: 'Very High', interactivity: 'Interactive', dataVisualization: 'Low' }
    },
    {
      id: '500',
      name: '500 Error',
      path: '/templates/500',
      description: 'Kernel panic themed 500 error with system diagnostics',
      icon: <Terminal className="h-5 w-5" />,
      features: ['Kernel Panic', 'System Logs', 'Memory Dump', 'Recovery Terminal', 'Scanlines Effect'],
      bestFor: 'Server errors, system failures, technical error pages',
      color: 'from-red-600 to-red-500',
      preview: { sections: 4, animations: 'Very High', interactivity: 'Interactive', dataVisualization: 'Low' }
    }
  ],

  devtools: [
    {
      id: 'api-playground',
      name: 'API Playground',
      path: '/templates/api-playground',
      description: 'Test and debug REST APIs with live requests and responses',
      icon: <Code2 className="h-5 w-5" />,
      features: ['Multi-method requests', 'Environment variables', 'Code generation', 'Request collections', 'Authentication support'],
      bestFor: 'API testing, debugging endpoints, generating client code, managing collections',
      color: 'from-cyan-500 to-emerald-500',
      preview: { sections: 8, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'cron-builder',
      name: 'Cron Expression Builder',
      path: '/templates/cron-builder',
      description: 'Build and visualize cron schedules with platform-specific code',
      icon: <Clock className="h-5 w-5" />,
      features: ['Visual cron builder', 'Next 10 executions preview', 'Platform code generation', '15+ preset templates', 'Human-readable descriptions'],
      bestFor: 'Scheduling tasks, automating workflows, DevOps engineers, system administrators',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 7, animations: 'Medium', interactivity: 'High', dataVisualization: 'Medium' }
    },
    {
      id: 'data-viz-studio',
      name: 'Data Visualization Studio',
      path: '/templates/data-viz-studio',
      description: 'Create interactive charts with live preview and code export',
      icon: <BarChart3 className="h-5 w-5" />,
      features: ['7 chart types', '8 color schemes', 'Live data preview', 'React/HTML code export', 'JSON data import'],
      bestFor: 'Data analysts, dashboard builders, creating reports, visualizing metrics',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 6, animations: 'High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'prompt-studio',
      name: 'Prompt Engineering Studio',
      path: '/templates/prompt-studio',
      description: 'Test, optimize, and evaluate AI prompts across models',
      icon: <Brain className="h-5 w-5" />,
      features: ['Multi-model testing', 'A/B testing variants', 'Performance metrics', 'Version history', 'Code export (Python/JS/cURL)'],
      bestFor: 'AI developers, prompt engineers, optimizing LLM responses, cost analysis',
      color: 'from-emerald-500 to-purple-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester & Builder',
      path: '/templates/regex-tester',
      description: 'Test and debug regular expressions with live pattern matching',
      icon: <Search className="h-5 w-5" />,
      features: ['Live pattern matching', '12+ pattern library', 'Replace mode', 'Multi-language code gen', 'Match explanations'],
      bestFor: 'Developers, data validation, text processing, learning regex patterns',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 5, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'claude-component-studio',
      name: 'Claude Component Studio',
      path: '/templates/claude-component-studio',
      description: 'Visual builder that generates perfect Claude prompts for components',
      icon: <Wand2 className="h-5 w-5" />,
      features: ['50+ component templates', 'Visual customization', 'Claude prompt generation', '6 framework support', 'Live preview'],
      bestFor: 'UI developers, rapid prototyping, component design, prompt engineering',
      color: 'from-purple-500 to-pink-500',
      preview: { sections: 6, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'db-schema-designer',
      name: 'Database Schema Designer',
      path: '/templates/db-schema-designer',
      description: 'Visual database design tool with drag-and-drop and SQL generation',
      icon: <Database className="h-5 w-5" />,
      features: ['Visual schema design', 'Drag-and-drop tables', 'Relationship mapping', 'Multi-dialect SQL export', 'JSON schema export'],
      bestFor: 'Database architects and developers designing and documenting database schemas',
      color: 'from-emerald-500 to-teal-500',
      preview: { sections: 3, animations: 'Medium', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'sprint-board',
      name: 'Sprint Board',
      path: '/templates/sprint-board',
      description: 'Agile sprint management with burndown charts and velocity tracking',
      icon: <Target className="h-5 w-5" />,
      features: ['Drag-and-drop story cards', 'Burndown chart visualization', 'Velocity tracking', 'Team capacity planning', 'Story point estimation'],
      bestFor: 'Scrum teams tracking sprints, managing user stories, and monitoring team velocity',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 4, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Very High' }
    },
    {
      id: 'kanban-board',
      name: 'Kanban Board',
      path: '/templates/kanban-board',
      description: 'Project management with drag-and-drop cards and advanced filtering',
      icon: <LayoutGrid className="h-5 w-5" />,
      features: ['Drag-and-drop cards', 'WIP limits', 'Advanced filtering', 'Priority management', 'Team member assignments'],
      bestFor: 'Teams using Kanban methodology to visualize workflow and manage work in progress',
      color: 'from-pink-500 to-rose-500',
      preview: { sections: 1, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'chat-helpbot',
      name: 'Chat Helpbot',
      path: '/templates/chat-helpbot',
      description: 'Advanced AI chat interface with streaming, sessions, markdown, code highlighting, and widget mode',
      icon: <Bot className="h-5 w-5" />,
      features: ['Streaming responses', 'Conversation sessions', 'Code highlighting', 'Widget mode', 'Export chat', 'Message actions', 'Settings panel', 'Keyboard shortcuts'],
      bestFor: 'AI chatbots, customer support, coding assistants, documentation helpers, interactive help systems',
      color: 'from-emerald-500 to-cyan-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'git-dashboard',
      name: 'Git Dashboard',
      path: '/templates/git-dashboard',
      description: 'GitHub-style repository overview with commits, branches, and activity',
      icon: <GitBranch className="h-5 w-5" />,
      features: ['Commit History', 'Branch Management', 'Pull Requests', 'Contributors', 'Activity Graph'],
      bestFor: 'Git clients, code hosting platforms, developer tools',
      color: 'from-gray-500 to-slate-500',
      preview: { sections: 10, animations: 'High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'log-viewer',
      name: 'Log Viewer',
      path: '/templates/log-viewer',
      description: 'Real-time log streaming with filtering, search, and highlighting',
      icon: <ScrollText className="h-5 w-5" />,
      features: ['Live Streaming', 'Log Levels', 'Search & Filter', 'Regex Support', 'Export Logs'],
      bestFor: 'DevOps, debugging, server monitoring, application logs',
      color: 'from-emerald-500 to-green-500',
      preview: { sections: 8, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'feature-flags',
      name: 'Feature Flags',
      path: '/templates/feature-flags',
      description: 'Feature flag management with environments, targeting, and rollouts',
      icon: <Flag className="h-5 w-5" />,
      features: ['Flag Management', 'Environment Configs', 'User Targeting', 'Percentage Rollouts', 'Audit Logs'],
      bestFor: 'Feature management, A/B testing, gradual rollouts',
      color: 'from-violet-500 to-purple-500',
      preview: { sections: 9, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'webhook-inspector',
      name: 'Webhook Inspector',
      path: '/templates/webhook-inspector',
      description: 'Webhook testing and debugging with request inspection and replay',
      icon: <Webhook className="h-5 w-5" />,
      features: ['Request Capture', 'Payload Inspector', 'Headers View', 'Replay Requests', 'Response Mocking'],
      bestFor: 'API development, webhook testing, integration debugging',
      color: 'from-orange-500 to-red-500',
      preview: { sections: 8, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ],

  gaming: [
    {
      id: 'gaming-leaderboard',
      name: 'Gaming Leaderboard',
      path: '/templates/gaming-leaderboard',
      description: 'Real-time competitive leaderboard with live matches and player stats',
      icon: <Trophy className="h-5 w-5" />,
      features: ['Live rank updates with animated transitions', 'Top 3 podium display with medals', 'Real-time match spectating (8 live matches)', 'Player stats cards with achievements', 'Season progress tracking with rewards'],
      bestFor: 'Gaming platforms, esports tournaments, competitive apps, skill-based ranking systems',
      color: 'from-amber-500 to-orange-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    }
  ],

  compliance: [
    {
      id: 'nist-compliance',
      name: 'NIST Compliance Dashboard',
      path: '/templates/nist-compliance',
      description: 'Enterprise compliance monitoring for NIST 800-53 and FedRAMP frameworks',
      icon: <Shield className="h-5 w-5" />,
      features: ['17 control families with expandable controls', 'Risk heat map visualization', 'POAM (Plan of Action & Milestones) tracking', 'Audit history with trend analysis', 'Evidence management for each control'],
      bestFor: 'Government contractors, FedRAMP compliance, cybersecurity teams, audit management, enterprise security',
      color: 'from-cyan-500 to-blue-500',
      preview: { sections: 14, animations: 'High', interactivity: 'Very High', dataVisualization: 'Very High' }
    }
  ],

  media: [
    {
      id: 'video-player',
      name: 'Video Player',
      path: '/templates/video-player',
      description: 'Streaming video interface with playlist, chapters, and quality options',
      icon: <PlayCircle className="h-5 w-5" />,
      features: ['Video Player', 'Playlist', 'Chapters', 'Quality Selector', 'Picture-in-Picture'],
      bestFor: 'Streaming platforms, video hosting, media players',
      color: 'from-red-500 to-rose-500',
      preview: { sections: 10, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'music-player',
      name: 'Music Player',
      path: '/templates/music-player',
      description: 'Spotify-style music app with playlists, queue, and visualizer',
      icon: <Music className="h-5 w-5" />,
      features: ['Now Playing', 'Playlists', 'Queue', 'Lyrics', 'Visualizer'],
      bestFor: 'Music streaming, audio players, podcast apps',
      color: 'from-green-500 to-emerald-500',
      preview: { sections: 11, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'High' }
    },
    {
      id: 'podcast-app',
      name: 'Podcast App',
      path: '/templates/podcast-app',
      description: 'Podcast player and discovery with subscriptions and episodes',
      icon: <Headphones className="h-5 w-5" />,
      features: ['Episode Player', 'Subscriptions', 'Discovery', 'Downloads', 'Playback Speed'],
      bestFor: 'Podcast platforms, audio content, learning apps',
      color: 'from-purple-500 to-violet-500',
      preview: { sections: 12, animations: 'High', interactivity: 'Very High', dataVisualization: 'Medium' }
    },
    {
      id: 'photo-gallery',
      name: 'Photo Gallery',
      path: '/templates/photo-gallery',
      description: 'Image gallery with lightbox, albums, and slideshow',
      icon: <Image className="h-5 w-5" />,
      features: ['Grid View', 'Lightbox', 'Albums', 'Slideshow', 'EXIF Data'],
      bestFor: 'Photo galleries, portfolios, image hosting',
      color: 'from-blue-500 to-cyan-500',
      preview: { sections: 9, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Low' }
    },
    {
      id: 'media-library',
      name: 'Media Library',
      path: '/templates/media-library',
      description: 'Netflix-style content library with categories and watchlists',
      icon: <Film className="h-5 w-5" />,
      features: ['Content Grid', 'Categories', 'Watchlist', 'Continue Watching', 'Recommendations'],
      bestFor: 'Streaming services, media libraries, content platforms',
      color: 'from-red-500 to-orange-500',
      preview: { sections: 12, animations: 'Very High', interactivity: 'Very High', dataVisualization: 'Medium' }
    }
  ]
};

// Calculate total count
const totalTemplates = Object.values(templates).reduce((sum, category) => sum + category.length, 0);

// Helper to get template count for a category group
const getCategoryGroupCount = (groupKey: string) => {
  const group = categoryGroups[groupKey as keyof typeof categoryGroups];
  return group.categories.reduce((sum, cat) => {
    return sum + (templates[cat as keyof typeof templates]?.length || 0);
  }, 0);
};

// Helper to get all templates for a category group
const getCategoryGroupTemplates = (groupKey: string) => {
  const group = categoryGroups[groupKey as keyof typeof categoryGroups];
  return group.categories.flatMap(cat => templates[cat as keyof typeof templates] || []);
};

// Preview card component
function TemplateCard({ template, type }: { template: any; type: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="glass-dark border-glow h-full relative overflow-hidden group flex flex-col">
        {isHovered && <BorderTrail />}

        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${template.color}`} />

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${template.color} bg-opacity-20`}>
                {template.icon}
              </div>
              <div>
                <CardTitle className="font-mono text-xl transition-colors duration-300 group-hover:text-primary">
                  {template.name}
                </CardTitle>
                <CardDescription className="mt-1">{template.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 flex-1">
          {/* Features */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono uppercase">Features</p>
            <div className="flex flex-wrap gap-1">
              {template.features.map((feature: string) => (
                <Badge key={feature} variant="outline" className="text-xs font-mono">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-mono uppercase">Best For</p>
            <p className="text-sm text-foreground/80">{template.bestFor}</p>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(template.preview).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-mono text-primary">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="mt-auto">
          <Link href={template.path} className="w-full">
            <Button variant="outline" className="w-full gap-2 border-primary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Component version: 2.0 - Cache-busted build
export default function TemplateShowcase() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const { background, setBackground, backgroundTone, setBackgroundTone, backgroundTones } = useBackground();

  // Background tone labels for the dropdown
  const toneLabels: Record<BackgroundTone, string> = {
    'charcoal': 'Charcoal',
    'deep-purple': 'Deep Purple',
    'pure-black': 'Pure Black',
    'light': 'Light',
    'ocean': 'Ocean',
    'sunset': 'Sunset',
    'forest': 'Forest',
    'midnight': 'Midnight',
    'neon-dark': 'Neon Dark',
    'slate': 'Slate',
  };

  // Toggle category selection
  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryKey)) {
        return prev.filter(k => k !== categoryKey);
      } else {
        return [...prev, categoryKey];
      }
    });
  };

  // Check if showing all (no categories selected)
  const showingAll = selectedCategories.length === 0;

  // Filter templates based on search
  const filterTemplates = (categoryTemplates: any[]) => {
    if (!searchQuery) return categoryTemplates;
    return categoryTemplates.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bestFor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <main className="min-h-screen relative">
      <ScrollProgress className="top-0 z-50" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[140px] h-7 font-mono text-sm glass border-primary/30">
                  <Palette className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  <SelectItem value="terminal">Terminal</SelectItem>
                  <SelectItem value="amber">Amber</SelectItem>
                  <SelectItem value="carbon">Carbon</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="sunset">Sunset</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="midnight">Midnight</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={backgroundTone} onValueChange={setBackgroundTone}>
                <SelectTrigger className="w-[140px] h-7 font-mono text-sm glass border-primary/30">
                  <PaintBucket className="h-3 w-3 mr-1" />
                  <SelectValue>{toneLabels[backgroundTone]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="font-mono">
                  {backgroundTones.map((tone) => (
                    <SelectItem key={tone} value={tone}>{toneLabels[tone]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={background} onValueChange={setBackground}>
                <SelectTrigger className="w-[140px] h-7 font-mono text-sm glass border-primary/30">
                  <Layers className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="mesh">Mesh</SelectItem>
                  <SelectItem value="textured">Textured</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="stars">Stars</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>

              <BackgroundMediaSettings />
            </div>

            <h1 className="text-6xl md:text-8xl font-mono font-bold relative">
              <span className="gradient-text-theme terminal-glow animate-gradient">
                Ultimate Template Gallery
              </span>
            </h1>

            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              A comprehensive collection of {totalTemplates} production-ready templates across 9 major categories.
              Dashboards, dev tools, e-commerce, business, auth & billing, marketing, content, forms & email, and operations —
              all with glassmorphism design and support for 10 beautiful themes.
            </p>

            <p className="text-sm text-muted-foreground mt-4">
              Click any category below to filter templates
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto pt-4">
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-dark border-primary/30"
              />
            </div>

            {/* Category Stats - Multi-Select Filters */}
            <div className="pt-8 space-y-4">
              {/* Row 1 */}
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                {Object.entries(categoryGroups).slice(0, 5).map(([key, group]) => {
                  const isSelected = selectedCategories.includes(key);
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(key)}
                      className={`text-center cursor-pointer group relative ${
                        isSelected ? 'ring-2 ring-primary/50 rounded-lg p-2 -m-2' : ''
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 absolute -top-1 -right-1 text-primary" />
                      )}
                      <p className={`text-4xl font-mono font-bold bg-gradient-to-br ${group.gradient} text-transparent bg-clip-text transition-all group-hover:scale-110 ${
                        isSelected ? 'scale-110' : ''
                      }`}>
                        {getCategoryGroupCount(key)}
                      </p>
                      <p className={`text-sm ${isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'} group-hover:text-foreground transition-colors flex items-center gap-1 justify-center`}>
                        {group.icon}
                        {group.name}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                {Object.entries(categoryGroups).slice(5).map(([key, group]) => {
                  const isSelected = selectedCategories.includes(key);
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(key)}
                      className={`text-center cursor-pointer group relative ${
                        isSelected ? 'ring-2 ring-primary/50 rounded-lg p-2 -m-2' : ''
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 absolute -top-1 -right-1 text-primary" />
                      )}
                      <p className={`text-4xl font-mono font-bold bg-gradient-to-br ${group.gradient} text-transparent bg-clip-text transition-all group-hover:scale-110 ${
                        isSelected ? 'scale-110' : ''
                      }`}>
                        {getCategoryGroupCount(key)}
                      </p>
                      <p className={`text-sm ${isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'} group-hover:text-foreground transition-colors flex items-center gap-1 justify-center`}>
                        {group.icon}
                        {group.name}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected count hint */}
              {selectedCategories.length > 0 && (
                <p className="text-sm text-center text-primary font-mono">
                  {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected - Click to toggle
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {Object.entries(categoryGroups).map(([groupKey, group]) => {
              // Show category if: no filters (showing all) OR category is selected
              if (!showingAll && !selectedCategories.includes(groupKey)) return null;

              const groupTemplates = getCategoryGroupTemplates(groupKey);
              const filteredGroupTemplates = filterTemplates(groupTemplates);

              // Only show groups that have templates after filtering
              if (filteredGroupTemplates.length === 0) return null;

              return (
                <div key={groupKey}>
                  <h2 className="text-3xl font-mono font-bold mb-6 flex items-center gap-3">
                    <span className={`bg-gradient-to-r ${group.gradient} text-transparent bg-clip-text terminal-glow animate-gradient-slow`}>
                      {group.name}
                    </span>
                    <span className="text-sm text-muted-foreground font-normal">
                      ({filteredGroupTemplates.length})
                    </span>
                  </h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    {filteredGroupTemplates.map((template: any) => (
                      <TemplateCard key={template.id} template={template} type={groupKey} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mt-20 space-y-8">
            <h2 className="text-4xl font-mono font-bold text-center">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text terminal-glow animate-gradient">
                Why These Templates?
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-dark border-glow">
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="font-mono">Production Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">
                    Every template is fully functional, polished, and ready to use in production. No placeholders or incomplete features.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-dark border-glow">
                <CardHeader>
                  <Palette className="h-8 w-8 text-secondary mb-2" />
                  <CardTitle className="font-mono">10 Beautiful Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">
                    All templates work flawlessly across Terminal, Amber, Carbon, Light, Ocean, Sunset, Forest, Midnight, Neon, and Slate themes.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-dark border-glow">
                <CardHeader>
                  <Zap className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle className="font-mono">Rich Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">
                    Glassmorphism, Framer Motion animations, shadcn/ui components, and smooth transitions throughout.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <Card className="glass-dark border-glow max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-mono font-bold mb-4 text-primary">Start Building Today</h3>
                <p className="text-foreground/80 mb-6">
                  {totalTemplates} professionally designed templates ready to customize. Browse by category or search to find exactly what you need.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/styleguide">
                      View Components
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Browse All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
