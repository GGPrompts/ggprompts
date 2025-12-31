import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SpaceBackground } from '@/components/SpaceBackground';
import { AboutSection } from '@/components/AboutSection';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ContactSection } from '@/components/ContactSection';
import { HeroSection } from '@/components/HeroSection';

export const metadata: Metadata = {
  title: 'Matt M. | Full Stack Prompt Engineer',
  description: 'From zero coding experience to 45+ production projects in 6 months. Full Stack Prompt Engineer specializing in terminal UIs, browser-based dev tools, and AI-assisted development.',
};

export default function PortfolioHome() {
  return (
    <main className="min-h-screen relative">
      <SpaceBackground speed={0.5} opacity={1} />

      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Projects */}
        <FeaturedProjects />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Link to Template Gallery */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="glass rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-mono font-bold text-primary mb-4">
              Explore the Template Library
            </h2>
            <p className="text-foreground/80 mb-6">
              Want to see the 16 production-ready templates used to build this portfolio?
            </p>
            <Link href="/templates">
              <button className="px-6 py-3 glass-dark rounded-lg hover:scale-105 transition-transform border-glow">
                View Template Gallery
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
