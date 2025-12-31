'use client';

import { ComponentDefinition } from '@/lib/component-registry';
import { Customization } from '@/types/customization';
import {
  // Cards
  GlassCard,
  FloatingCard,
  NeonCard,
  ProfileCard,
  ProductCard,
  BlogCard,
  PricingCardAlt,
  TeamMemberCard,
  // Buttons
  GradientButton,
  NeomorphicButton,
  ParticleButton,
  OutlineButton,
  IconButton,
  SplitButton,
  LoadingButton,
  PillButton,
  AnimatedBorderButton,
  // Badges
  StatusBadge,
  NotificationBadge,
  // Forms
  AnimatedInput,
  FloatingLabelInput,
  SearchCommand,
  SelectDropdown,
  CheckboxGroup,
  RadioGroup,
  ToggleSwitch,
  RangeSlider,
  TagInput,
  PasswordInput,
  OTPInput,
  DatePickerInput,
  FileUpload,
  TextareaAutosize,
  FormCard,
  // Navigation
  GlassNav,
  CommandPalette,
  BreadcrumbNav,
  TabsNav,
  PaginationNav,
  SidebarNav,
  MobileMenuNav,
  // Effects
  GlowButton,
  MagneticElement,
  RevealOnScroll,
  TypewriterText,
  CursorFollow,
  ParallaxScroll,
  // Data Display
  StatCard,
  MetricTile,
  ProgressRing,
  AreaChart,
  BarChart,
  DonutChart,
  SparklineCard,
  ActivityFeed,
  DataTable,
  KPICard,
  CounterCard,
  HeatmapCell,
  TimelineVertical,
  // Headers
  StickyHeader,
  CenteredHeader,
  TransparentHeader,
  MegaMenuHeader,
  // Footers
  MultiColumnFooter,
  MinimalFooter,
  CTAFooter,
  SocialFooter,
  // Heroes
  GradientHero,
  BentoHero,
  TerminalHero,
  VideoHero,
  // Modals
  GlassModal,
  SlideDrawer,
  ConfirmDialog,
  ImageLightbox,
  CommandModal,
  BottomSheet,
  // Feedback
  ToastNotification,
  AlertBanner,
  ProgressLoader,
  SuccessState,
  // Pricing
  PricingCard,
  FeatureGrid,
  // Testimonials
  TestimonialCard,
  QuoteCard,
  // Auth
  LoginCard,
  SignupCard,
  // Marketing
  CTASection,
  FeatureShowcase,
  LogoCloud,
  TrustBadges,
  StatsCounter,
  ComparisonTable,
  FAQAccordion,
  NewsletterSignup,
  AnnouncementBanner,
  SocialProof,
} from '@/components/component-previews';
import { Settings } from 'lucide-react';

type ComponentPreviewProps = {
  component: ComponentDefinition | null;
  customization: Customization;
  textContent?: Record<string, string>;
};

export function ComponentPreview({ component, customization, textContent }: ComponentPreviewProps) {
  if (!component) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Settings className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No Component Selected</p>
        <p className="text-sm opacity-70">Select a component from the library to preview</p>
      </div>
    );
  }

  // Render the appropriate preview based on component ID
  switch (component.id) {
    // Cards
    case 'glass-card':
      return <GlassCard customization={customization} textContent={textContent} />;
    case 'floating-card':
      return <FloatingCard customization={customization} />;
    case 'neon-card':
      return <NeonCard customization={customization} />;
    case 'profile-card':
      return <ProfileCard customization={customization} textContent={textContent} />;
    case 'product-card':
      return <ProductCard customization={customization} textContent={textContent} />;
    case 'blog-card':
      return <BlogCard customization={customization} textContent={textContent} />;
    case 'pricing-card-alt':
      return <PricingCardAlt customization={customization} />;
    case 'team-member-card':
      return <TeamMemberCard customization={customization} />;

    // Buttons
    case 'gradient-btn':
      return <GradientButton customization={customization} textContent={textContent} />;
    case 'neo-btn':
      return <NeomorphicButton customization={customization} textContent={textContent} />;
    case 'particle-btn':
      return <ParticleButton customization={customization} />;
    case 'outline-btn':
      return <OutlineButton customization={customization} textContent={textContent} />;
    case 'icon-btn':
      return <IconButton customization={customization} />;
    case 'split-btn':
      return <SplitButton customization={customization} />;
    case 'loading-btn':
      return <LoadingButton customization={customization} />;
    case 'pill-btn':
      return <PillButton customization={customization} />;
    case 'animated-border-btn':
      return <AnimatedBorderButton customization={customization} />;

    // Badges
    case 'status-badge':
      return <StatusBadge customization={customization} />;
    case 'notification-badge':
      return <NotificationBadge customization={customization} />;

    // Forms
    case 'animated-input':
      return <AnimatedInput customization={customization} />;
    case 'floating-label-input':
      return <FloatingLabelInput customization={customization} />;
    case 'search-command':
      return <SearchCommand customization={customization} />;
    case 'select-dropdown':
      return <SelectDropdown customization={customization} />;
    case 'checkbox-group':
      return <CheckboxGroup customization={customization} />;
    case 'radio-group':
      return <RadioGroup customization={customization} />;
    case 'toggle-switch':
      return <ToggleSwitch customization={customization} />;
    case 'range-slider':
      return <RangeSlider customization={customization} />;
    case 'tag-input':
      return <TagInput customization={customization} />;
    case 'password-input':
      return <PasswordInput customization={customization} />;
    case 'otp-input':
      return <OTPInput customization={customization} />;
    case 'date-picker-input':
      return <DatePickerInput customization={customization} />;
    case 'file-upload':
      return <FileUpload customization={customization} />;
    case 'textarea-autosize':
      return <TextareaAutosize customization={customization} />;
    case 'form-card':
      return <FormCard customization={customization} />;

    // Navigation
    case 'glass-nav':
      return <GlassNav customization={customization} />;
    case 'command-palette':
      return <CommandPalette customization={customization} />;
    case 'breadcrumb-nav':
      return <BreadcrumbNav customization={customization} />;
    case 'tabs-nav':
      return <TabsNav customization={customization} />;
    case 'pagination-nav':
      return <PaginationNav customization={customization} />;
    case 'sidebar-nav':
      return <SidebarNav customization={customization} />;
    case 'mobile-menu-nav':
      return <MobileMenuNav customization={customization} />;

    // Effects
    case 'glow-button':
      return <GlowButton customization={customization} />;
    case 'magnetic-element':
      return <MagneticElement customization={customization} />;
    case 'reveal-on-scroll':
      return <RevealOnScroll customization={customization} />;
    case 'typewriter-text':
      return <TypewriterText customization={customization} />;
    case 'cursor-follow':
      return <CursorFollow customization={customization} />;
    case 'parallax-scroll':
      return <ParallaxScroll customization={customization} />;

    // Data Display
    case 'stat-card':
      return <StatCard customization={customization} />;
    case 'metric-tile':
      return <MetricTile customization={customization} />;
    case 'progress-ring':
      return <ProgressRing customization={customization} />;
    case 'area-chart':
      return <AreaChart customization={customization} />;
    case 'bar-chart':
      return <BarChart customization={customization} />;
    case 'donut-chart':
      return <DonutChart customization={customization} />;
    case 'sparkline-card':
      return <SparklineCard customization={customization} />;
    case 'activity-feed':
      return <ActivityFeed customization={customization} />;
    case 'data-table':
      return <DataTable customization={customization} />;
    case 'kpi-card':
      return <KPICard customization={customization} />;
    case 'counter-card':
      return <CounterCard customization={customization} />;
    case 'heatmap-cell':
      return <HeatmapCell customization={customization} />;
    case 'timeline-vertical':
      return <TimelineVertical customization={customization} />;

    // Headers
    case 'sticky-header':
      return <StickyHeader customization={customization} />;
    case 'centered-header':
      return <CenteredHeader customization={customization} />;
    case 'transparent-header':
      return <TransparentHeader customization={customization} />;
    case 'mega-menu-header':
      return <MegaMenuHeader customization={customization} />;

    // Footers
    case 'multi-column-footer':
      return <MultiColumnFooter customization={customization} />;
    case 'minimal-footer':
      return <MinimalFooter customization={customization} />;
    case 'cta-footer':
      return <CTAFooter customization={customization} />;
    case 'social-footer':
      return <SocialFooter customization={customization} />;

    // Heroes
    case 'gradient-hero':
      return <GradientHero customization={customization} textContent={textContent} />;
    case 'bento-hero':
      return <BentoHero customization={customization} />;
    case 'terminal-hero':
      return <TerminalHero customization={customization} />;
    case 'video-hero':
      return <VideoHero customization={customization} />;

    // Modals
    case 'glass-modal':
      return <GlassModal customization={customization} />;
    case 'slide-drawer':
      return <SlideDrawer customization={customization} />;
    case 'confirm-dialog':
      return <ConfirmDialog customization={customization} />;
    case 'image-lightbox':
      return <ImageLightbox customization={customization} />;
    case 'command-modal':
      return <CommandModal customization={customization} />;
    case 'bottom-sheet':
      return <BottomSheet customization={customization} />;

    // Feedback
    case 'toast-notification':
      return <ToastNotification customization={customization} />;
    case 'alert-banner':
      return <AlertBanner customization={customization} />;
    case 'progress-loader':
      return <ProgressLoader customization={customization} />;
    case 'success-state':
      return <SuccessState customization={customization} />;

    // Pricing
    case 'pricing-card':
      return <PricingCard customization={customization} textContent={textContent} />;
    case 'feature-grid':
      return <FeatureGrid customization={customization} />;

    // Testimonials
    case 'testimonial-card':
      return <TestimonialCard customization={customization} />;
    case 'quote-card':
      return <QuoteCard customization={customization} />;

    // Auth
    case 'login-card':
      return <LoginCard customization={customization} />;
    case 'signup-card':
      return <SignupCard customization={customization} />;

    // Marketing
    case 'cta-section':
      return <CTASection customization={customization} textContent={textContent} />;
    case 'feature-showcase':
      return <FeatureShowcase customization={customization} />;
    case 'logo-cloud':
      return <LogoCloud customization={customization} />;
    case 'trust-badges':
      return <TrustBadges customization={customization} />;
    case 'stats-counter':
      return <StatsCounter customization={customization} />;
    case 'comparison-table':
      return <ComparisonTable customization={customization} />;
    case 'faq-accordion':
      return <FAQAccordion customization={customization} />;
    case 'newsletter-signup':
      return <NewsletterSignup customization={customization} />;
    case 'announcement-banner':
      return <AnnouncementBanner customization={customization} />;
    case 'social-proof':
      return <SocialProof customization={customization} />;

    // Default fallback for any unhandled components
    default:
      return (
        <div
          className="p-6 rounded-lg border text-center max-w-sm"
          style={{
            backgroundColor: `${customization.primaryColor}20`,
            borderColor: customization.primaryColor,
            borderRadius: `${customization.borderRadius}px`,
            color: customization.textColor,
          }}
        >
          <h3 className="text-xl font-bold mb-2">{component.name}</h3>
          <p className="opacity-80 text-sm">{component.description}</p>
          <p className="mt-4 text-xs opacity-50">Preview coming soon</p>
        </div>
      );
  }
}
