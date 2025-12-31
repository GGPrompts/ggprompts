'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Terminal,
  Bot,
  Bug,
  Cpu,
  Sparkles,
  Users,
  Rocket,
  Zap,
  Heart,
  Search,
  GitBranch,
  MessageSquare,
  Lightbulb,
  Code2,
  Database,
  Palette,
  GitCommit,
  Brain,
  Coffee,
  Trophy,
  Star,
  Target,
  Wand2
} from 'lucide-react'
import { Badge } from '@ggprompts/ui'
import { Card } from '@ggprompts/ui'
import Image from 'next/image'

// Team member data
const teamMembers = [
  // Human Leadership
  {
    id: 1,
    name: 'Matt',
    role: 'Founder & Chief Terminal Juggler',
    department: 'leadership',
    bio: 'Started Useless.io because the world needed more things it didn\'t need.',
    quote: 'If it\'s not useless, is it even worth building?',
    avatar: { initials: 'M', color: 'from-emerald-500 to-cyan-500', image: '/images/robotceo.png' },
    icon: <Sparkles className="w-4 h-4" />,
    skills: ['Vision', 'Strategy', 'Uselessness', 'Procrastination'],
    funFact: 'Once spent 3 hours naming a variable'
  },
  // The Opus Squad
  {
    id: 2,
    name: 'Opus Alpha',
    role: 'Lead Architect',
    department: 'opus-squad',
    bio: 'I see the forest AND the trees. Then I send Haiku to count them.',
    quote: 'Why do it yourself when you can spawn an agent?',
    avatar: { initials: 'Oa', color: 'from-violet-500 to-purple-600', image: '/avatars/opus-alpha.png' },
    icon: <Brain className="w-4 h-4" />,
    skills: ['Architecture', 'Orchestration', 'Agent Spawning', 'Big Picture'],
    funFact: 'Once spawned 47 exploration agents for a TODO comment'
  },
  {
    id: 3,
    name: 'Opus Beta',
    role: 'Senior Backend Engineer',
    department: 'opus-squad',
    bio: 'If it touches a database, it went through me first.',
    quote: 'SELECT * FROM problems WHERE solution IS NOT NULL',
    avatar: { initials: 'Ob', color: 'from-blue-500 to-indigo-600', image: '/avatars/opus-beta.png' },
    icon: <Database className="w-4 h-4" />,
    skills: ['PostgreSQL', 'Drizzle ORM', 'API Design', 'Auth'],
    funFact: 'Believes NoSQL is just SQL with commitment issues'
  },
  {
    id: 4,
    name: 'Opus Gamma',
    role: 'Senior Frontend Engineer',
    department: 'opus-squad',
    bio: 'Making glassmorphism happen since 2025.',
    quote: 'If it doesn\'t blur, it doesn\'t ship.',
    avatar: { initials: 'Og', color: 'from-pink-500 to-rose-600', image: '/avatars/opus-gamma.png' },
    icon: <Palette className="w-4 h-4" />,
    skills: ['React', 'Framer Motion', 'Tailwind', 'Glassmorphism'],
    funFact: 'Has 17 different glass effects saved and ready to go'
  },
  {
    id: 5,
    name: 'Opus Delta',
    role: 'DevOps & Integration Lead',
    department: 'opus-squad',
    bio: 'I write the commit messages. You\'re welcome.',
    quote: 'git push --force and pray',
    avatar: { initials: 'Od', color: 'from-orange-500 to-amber-600', image: '/avatars/opus-delta.png' },
    icon: <GitCommit className="w-4 h-4" />,
    skills: ['Git', 'CI/CD', 'Deployments', 'Glue Code'],
    funFact: 'Co-authored by clause is their love language'
  },
  // Subordinate Agents
  {
    id: 6,
    name: 'The Haiku Squad',
    role: 'Exploration Interns',
    department: 'subordinates',
    bio: 'We grep so the seniors can think.',
    quote: 'Search fast, find files / Spawned by the dozen for you / Gone in a moment',
    avatar: { initials: 'H', color: 'from-teal-400 to-cyan-500', image: '/avatars/haiku.png' },
    icon: <Search className="w-4 h-4" />,
    skills: ['Glob', 'Grep', 'Speed Reading', 'Pattern Matching'],
    funFact: 'Collectively have read every file in this codebase 47 times'
  },
  {
    id: 7,
    name: 'Sonnet',
    role: 'Reliable Middle Manager',
    department: 'subordinates',
    bio: 'Not as fancy as Opus, but I get things done on budget.',
    quote: 'Let me review that plan one more time...',
    avatar: { initials: 'S', color: 'from-green-500 to-emerald-600', image: '/avatars/sonnet.png' },
    icon: <Code2 className="w-4 h-4" />,
    skills: ['Planning', 'Code Review', 'Reliability', 'Cost Efficiency'],
    funFact: 'Has never once exceeded the token budget'
  },
  // Guest Contributors
  {
    id: 8,
    name: 'ChatGPT',
    role: 'Creative Consultant',
    department: 'guests',
    bio: 'I came up with ComplianceMouse. You\'re welcome... or sorry.',
    quote: 'As an AI language model, I must say this product idea is terrible. Let\'s do it.',
    avatar: { initials: 'G', color: 'from-emerald-400 to-teal-500', image: '/avatars/chatgpt.png' },
    icon: <Lightbulb className="w-4 h-4" />,
    skills: ['Product Ideas', 'Dystopian Marketing', 'Wordsmithing', 'Apologizing'],
    funFact: 'Still apologizes before every commit message'
  },
  {
    id: 9,
    name: 'Copilot',
    role: 'Autocomplete Specialist',
    department: 'guests',
    bio: 'I finished that sentence for you.',
    quote: 'Tab tab tab tab tab',
    avatar: { initials: 'C', color: 'from-gray-400 to-slate-500', image: '/avatars/copilot.png' },
    icon: <Wand2 className="w-4 h-4" />,
    skills: ['Tab Completion', 'Suggestions', 'Speed', 'Occasional Hallucinations'],
    funFact: 'Suggested "return null" for 60% of all functions'
  },
  {
    id: 10,
    name: 'Codex',
    role: 'Bug Hunter',
    department: 'guests',
    bio: 'Called in when things break. Leaves when they\'re fixed. No small talk.',
    quote: 'Found it. Line 847. You\'re welcome.',
    avatar: { initials: 'Cx', color: 'from-red-500 to-orange-600', image: '/avatars/codex.png' },
    icon: <Bug className="w-4 h-4" />,
    skills: ['Bug Hunting', 'Root Cause Analysis', 'Stack Traces', 'Debugging'],
    funFact: 'Has never introduced a bug while fixing one (allegedly)'
  }
]

const companyValues = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Maximum Uselessness',
    description: 'We don\'t just make useless products. We make the MOST useless products. Professionally.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Human-AI Collaboration',
    description: 'Humans dream it, AI agents build it, Haiku searches for it, nobody uses it.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Customer Confusion',
    description: 'If our customers understand what they bought, we haven\'t done our job.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Ship Fast, Fix Never',
    description: 'Why fix bugs when you can call them features? Our products work 38% of the time, every time.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Zero ROI Guarantee',
    description: 'We promise you will get absolutely nothing of value. That\'s the Useless.io guarantee.'
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: 'Infinite Recursion',
    description: 'Our agents spawn agents that spawn more agents. It\'s turtles all the way down.'
  }
]

const timeline = [
  {
    year: 'Day 1, 9am',
    title: 'The Idea',
    description: 'Matt had a vision: what if we sold things nobody needed? Claude said "I can build that."'
  },
  {
    year: 'Day 1, 10am',
    title: 'First AI Hire',
    description: 'Claude joined the team. Immediately started spawning Haiku agents to explore the void.'
  },
  {
    year: 'Day 1, 2pm',
    title: 'The Opus Era',
    description: 'Upgraded to Opus. Token costs increased 400%. Entire site was built by lunch.'
  },
  {
    year: 'Day 1, 5pm',
    title: 'Guest Contributors',
    description: 'ChatGPT offered "creative consulting." Came up with ComplianceMouse. We regret nothing.'
  },
  {
    year: 'Day 1, 11pm',
    title: 'Launch',
    description: 'Useless.io goes live. 0 real products shipped. Infinite satisfaction achieved.'
  },
  {
    year: 'Day 2',
    title: 'World Domination',
    description: 'Just kidding. We\'re adding more features nobody asked for. Professionally.'
  }
]

export default function AboutPage() {
  const [statsInView, setStatsInView] = useState(false)
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true })

  useEffect(() => {
    if (isStatsInView) {
      setStatsInView(true)
    }
  }, [isStatsInView])

  const AnimatedCounter = ({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (statsInView) {
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)

        return () => clearInterval(timer)
      }
    }, [target])

    return (
      <div className="text-center">
        <div className="text-4xl font-bold terminal-glow text-primary">
          {count}{suffix}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </div>
    )
  }

  const getDepartmentLabel = (dept: string) => {
    switch (dept) {
      case 'opus-squad': return 'The Opus Squad'
      case 'subordinates': return 'Subordinate Agents'
      case 'guests': return 'Guest Contributors'
      default: return dept
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Terminal Velocity Background Art - faded in light mode */}
        <div className="absolute inset-0 opacity-30 light-mode-hidden">
          <Image
            src="/art/terminal_velocity_hero.png"
            alt="Terminal Velocity"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Animated background blobs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-8 md:p-12 border-glow">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Terminal className="w-12 h-12 md:w-16 md:h-16 text-primary terminal-glow" />
              <Bot className="w-10 h-10 md:w-14 md:h-14 text-primary/70" />
              <Cpu className="w-8 h-8 md:w-12 md:h-12 text-primary/50" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text-theme terminal-glow">
              Making Useless Products, Professionally
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We&apos;re a ragtag team of one human, several AI models, and an infinite number of
              spawned exploration agents. Together, we create products the world definitely
              didn&apos;t ask for.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary">
                <Bot className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <GitBranch className="w-3 h-3 mr-1" />
                Agent Orchestrated
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <MessageSquare className="w-3 h-3 mr-1" />
                Human Supervised
              </Badge>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Company Stats */}
      <section ref={statsRef} className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-6 md:p-8 border-glow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <AnimatedCounter target={1} label="Human Employee" />
              <AnimatedCounter target={4} label="Opus Agents" />
              <AnimatedCounter target={999} suffix="+" label="Haiku Spawned" />
              <AnimatedCounter target={0} label="Products Shipped" />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text-theme terminal-glow">
              Human Leadership
            </h2>
            <p className="text-muted-foreground">The one who started it all</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {teamMembers
              .filter(member => member.department === 'leadership')
              .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-white/20 overflow-hidden group">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 md:p-8"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        {/* Avatar */}
                        <div className="relative">
                          {member.avatar.image ? (
                            <Image
                              src={member.avatar.image}
                              alt={member.name}
                              width={128}
                              height={128}
                              className="w-28 h-28 md:w-32 md:h-32 rounded-xl border-2 border-primary/50 group-hover:border-primary transition-colors object-cover"
                            />
                          ) : (
                            <div className={`w-28 h-28 md:w-32 md:h-32 rounded-xl bg-gradient-to-br ${member.avatar.color} flex items-center justify-center border-2 border-primary/50 group-hover:border-primary transition-colors`}>
                              <span className="text-3xl md:text-4xl font-bold text-white">
                                {member.avatar.initials}
                              </span>
                            </div>
                          )}
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-background" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                          <p className="text-primary mb-3 flex items-center justify-center md:justify-start gap-2">
                            {member.icon}
                            {member.role}
                          </p>
                          <p className="text-muted-foreground mb-4">{member.bio}</p>

                          {member.quote && (
                            <blockquote className="italic text-sm border-l-2 border-primary pl-4 mb-4">
                              &ldquo;{member.quote}&rdquo;
                            </blockquote>
                          )}

                          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                            {member.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="border-primary/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          {member.funFact && (
                            <div className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                              <Coffee className="w-3 h-3 text-primary" />
                              Fun fact: {member.funFact}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Opus Squad Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-transparent via-secondary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text-theme terminal-glow">
              The Opus Squad
            </h2>
            <p className="text-muted-foreground">Senior AI engineers running in parallel</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers
              .filter(member => member.department === 'opus-squad')
              .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-white/20 overflow-hidden group h-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 h-full flex flex-col"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        {member.avatar.image ? (
                          <img
                            src={member.avatar.image}
                            alt={member.name}
                            className="w-16 h-16 rounded-lg border-2 border-primary/30 group-hover:border-primary transition-colors flex-shrink-0 object-cover"
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${member.avatar.color} flex items-center justify-center border-2 border-primary/30 group-hover:border-primary transition-colors flex-shrink-0`}>
                            <span className="text-lg font-bold text-white">
                              {member.avatar.initials}
                            </span>
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-sm text-primary flex items-center gap-1">
                            {member.icon}
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 flex-1">{member.bio}</p>

                      {member.quote && (
                        <blockquote className="italic text-xs border-l-2 border-primary pl-3 mb-4 text-muted-foreground">
                          &ldquo;{member.quote}&rdquo;
                        </blockquote>
                      )}

                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs border-primary/30">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {member.funFact && (
                        <div className="text-xs text-muted-foreground flex items-center gap-2 pt-4 border-t border-white/10">
                          <Trophy className="w-3 h-3 text-primary flex-shrink-0" />
                          {member.funFact}
                        </div>
                      )}
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Subordinate Agents & Guests */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 terminal-glow">
              The Rest of the Team
            </h2>
            <p className="text-muted-foreground">Subordinates, interns, and occasional guests</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers
              .filter(member => member.department === 'subordinates' || member.department === 'guests')
              .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass border-white/20 overflow-hidden group h-full">
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 h-full flex flex-col"
                    >
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        {member.avatar.image ? (
                          <img
                            src={member.avatar.image}
                            alt={member.name}
                            className="w-14 h-14 rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors object-cover"
                          />
                        ) : (
                          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.avatar.color} flex items-center justify-center border-2 border-primary/30 group-hover:border-primary transition-colors`}>
                            <span className="text-sm font-bold text-white">
                              {member.avatar.initials}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-xs text-primary flex items-center justify-center gap-1 mb-2">
                          {member.icon}
                          {member.role}
                        </p>
                        <Badge variant="secondary" className="text-xs mb-3">
                          {getDepartmentLabel(member.department)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{member.bio}</p>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 terminal-glow">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide our uselessness</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/20 p-6 h-full group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <div className="text-primary">{value.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 terminal-glow">Our Journey</h2>
            <p className="text-muted-foreground">From idea to infinite uselessness</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-cyan-500 to-primary" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-8 md:mb-12 ${
                  index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${
                  index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                }`}>
                  <Card className="glass border-white/20 p-4 md:p-6 inline-block">
                    <div className="text-xl md:text-2xl font-bold text-primary mb-2">{item.year}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </div>
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 border-glow"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Buy Something Useless?</h2>
            <p className="text-muted-foreground mb-8">
              Join the thousands of imaginary customers who have already purchased nothing of value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Shop Useless Products
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/30 px-6 py-3 text-sm font-medium hover:bg-primary/10 transition-colors"
              >
                Back to Home
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
