/**
 * About Section Component
 * Complete, production-ready about section using portfolio content data
 * Showcases Matt M.'s journey from Program Analyst to Full Stack Prompt Engineer
 */

'use client';

import { about, pullQuotes } from '@/lib/portfolio-data';
import { motion } from 'framer-motion';
import { Card, Badge, Separator } from '@ggprompts/ui';

export function AboutSection() {
  // Split content into paragraphs
  const paragraphs = about.content.split('\n\n').filter(p => p.trim());

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold terminal-glow mb-4">
            {about.title}
          </h2>
          <Separator className="w-32 mx-auto bg-primary/50" />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          <StatCard
            number={about.stats.monthsLearning}
            label="Months Learning"
            icon="⏱️"
          />
          <StatCard
            number={`${about.stats.projectsCompleted}+`}
            label="Projects Shipped"
            icon="🚀"
            highlight
          />
          <StatCard
            text={about.stats.primaryTool}
            label="Development Partner"
            icon="🤖"
          />
          <StatCard
            text="Full Stack"
            label="Engineer Type"
            icon="⚡"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass-dark p-8">
              <div className="space-y-6">
                {paragraphs.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="text-lg text-foreground/90 leading-relaxed"
                  >
                    {/* Parse markdown bold */}
                    {paragraph.split('**').map((part, j) => (
                      j % 2 === 0 ? (
                        part
                      ) : (
                        <strong key={j} className="text-primary font-bold">
                          {part}
                        </strong>
                      )
                    ))}
                  </motion.p>
                ))}
              </div>

              {/* Key Takeaway */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-8 border-t border-primary/20"
              >
                <blockquote className="text-xl text-primary italic font-semibold terminal-glow">
                  "{pullQuotes[0]}"
                </blockquote>
              </motion.div>
            </Card>
          </motion.div>

          {/* Sidebar (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Background Card */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">
                Background
              </h3>
              <div className="space-y-4">
                <InfoItem
                  label="Previous Role"
                  value={about.stats.previousRole}
                />
                <InfoItem
                  label="Years in IT"
                  value="16+"
                />
                <InfoItem
                  label="First Code"
                  value="May 2024"
                />
                <InfoItem
                  label="Gaming Rank"
                  value="Top 10 Global"
                />
              </div>
            </Card>

            {/* Philosophy Card */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">
                Development Philosophy
              </h3>
              <div className="space-y-3">
                <Badge variant="outline" className="w-full justify-start border-primary/40">
                  AI-Assisted Development
                </Badge>
                <Badge variant="outline" className="w-full justify-start border-primary/40">
                  Terminal-First Workflow
                </Badge>
                <Badge variant="outline" className="w-full justify-start border-primary/40">
                  Strategic Architecture
                </Badge>
                <Badge variant="outline" className="w-full justify-start border-primary/40">
                  Rapid Prototyping
                </Badge>
              </div>
            </Card>

            {/* Interests Card */}
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">
                Technical Interests
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">▸</span>
                  <span>Terminal UIs (Go/Bubbletea)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">▸</span>
                  <span>Browser-based IDEs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">▸</span>
                  <span>Real-time collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">▸</span>
                  <span>Power user tools</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Pull Quotes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pullQuotes.slice(1, 3).map((quote, idx) => (
              <Card key={idx} className="glass-dark p-6">
                <blockquote className="text-lg font-semibold text-primary/90 italic">
                  "{quote}"
                </blockquote>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  number,
  text,
  label,
  icon,
  highlight = false,
}: {
  number?: number | string;
  text?: string;
  label: string;
  icon?: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      transition={{ duration: 0.2 }}
      style={{ perspective: 1000 }}
    >
      <Card className={`p-6 text-center h-full ${highlight ? 'border-glow' : 'glass'}`}>
        {icon && (
          <div className="text-3xl mb-2">{icon}</div>
        )}
        <div className={`text-3xl font-bold mb-2 ${highlight ? 'terminal-glow' : 'text-primary'}`}>
          {number || text}
        </div>
        <div className="text-sm text-foreground/60 font-medium">
          {label}
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Info Item Component
 */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-foreground/50 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-foreground font-semibold">
        {value}
      </div>
    </div>
  );
}
