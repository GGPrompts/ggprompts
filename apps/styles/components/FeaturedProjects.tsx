'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { featuredProjects } from '@/lib/projects-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ExternalLink, Github, Star, GitFork, Terminal, Globe } from 'lucide-react';

export function FeaturedProjects() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="projects" className="container mx-auto px-4 py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-mono font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text terminal-glow">
            Featured Projects
          </span>
        </h2>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          From AI cost optimization to terminal file managers—
          <br />
          production-ready tools built with Claude Code
        </p>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {featuredProjects.map((project) => (
          <motion.div key={project.id} variants={item}>
            <Card className="glass border-white/10 h-full flex flex-col group hover:border-primary/30 transition-all duration-300">
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-mono font-bold text-primary group-hover:terminal-glow transition-all">
                      {project.name}
                    </h3>
                    {project.category === 'TUI Application' && (
                      <Terminal className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    )}
                    {project.category === 'Web Application' && (
                      <Globe className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm font-mono text-emerald-400 mb-3">
                    {project.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-foreground/70 mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {project.highlights.slice(0, 3).map((highlight, i) => (
                        <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                          <span className="text-primary mt-1">▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs border-primary/30">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 5 && (
                      <Badge variant="outline" className="text-xs border-primary/20">
                        +{project.techStack.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats & Links */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    {/* GitHub Stats */}
                    {project.stats && (
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        {project.stats.stars !== undefined && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {project.stats.stars}
                          </div>
                        )}
                        {project.stats.forks !== undefined && (
                          <div className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            {project.stats.forks}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {project.links.map((link, i) => (
                        <Link
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 glass-dark rounded hover:scale-110 transition-transform"
                        >
                          {link.type === 'github' && <Github className="w-4 h-4" />}
                          {link.type === 'demo' && <ExternalLink className="w-4 h-4" />}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Projects Link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12"
      >
        <Link href="https://github.com/GGPrompts" target="_blank" rel="noopener noreferrer">
          <button className="px-8 py-4 glass rounded-lg hover:scale-105 transition-all border-glow font-mono">
            View All 45+ Projects on GitHub →
          </button>
        </Link>
      </motion.div>
    </section>
  );
}
