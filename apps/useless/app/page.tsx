'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import Link from 'next/link'
import { Newsletter } from '@/components/home/Newsletter'
import { Testimonials } from '@/components/home/Testimonials'
import { DoubleMarquee } from '@/components/home/ProductMarquee'

const featuredProducts = [
  // Row 1 - Dev Tools & Satirical Tech
  {
    id: 'prod-1',
    slug: 'self-aware-toaster-3000',
    name: 'Self-Aware Toaster 3000',
    brand: 'JudgyAppliances',
    price: 499.99,
    rating: 3.7,
    reviews: 3,
    tagline: 'It has opinions about your breakfast',
    image: '/products/toaster-1.webp',
  },
  {
    id: 'prod-2',
    slug: 'rubber-duck-ultra-pro',
    name: 'Rubber Duck Ultra Pro',
    brand: 'DebugQuack',
    price: 199.99,
    rating: 4.7,
    reviews: 3,
    tagline: 'It listens. It judges. It suggests console.log.',
    image: '/products/rubber-duck.png',
  },
  {
    id: 'prod-3',
    slug: 'stack-overflow-candle',
    name: 'StackOverflow Candle',
    brand: 'CodeAroma',
    price: 34.99,
    rating: 4.7,
    reviews: 3,
    tagline: 'Smells like copied code and desperation',
    image: '/products/stackoverflow-candle.png',
  },
  {
    id: 'prod-4',
    slug: 'node-modules-storage-crate',
    name: 'node_modules Storage Crate',
    brand: 'DependencyHell',
    price: 199.99,
    rating: 4.3,
    reviews: 3,
    tagline: 'Industrial strength for industrial bloat',
    image: '/products/node-modules-crate.png',
  },
  {
    id: 'prod-5',
    slug: 'auto-lgtm-glasses',
    name: 'Auto-LGTM Glasses',
    brand: 'ReviewSkip',
    price: 149.99,
    rating: 3.8,
    reviews: 4,
    tagline: 'Everything looks good to merge',
    image: '/products/lgtm-glasses.png',
  },
  {
    id: 'prod-6',
    slug: 'git-blame-redirector',
    name: 'Git Blame Redirector',
    brand: 'NotMyFault',
    price: 249.99,
    rating: 4.0,
    reviews: 3,
    tagline: 'Assigns your commits elsewhere',
    image: '/products/git-blame.png',
  },
  {
    id: 'prod-7',
    slug: 'context-window-extender-usb',
    name: 'Context Window USB',
    brand: 'TokenMax Pro',
    price: 149.99,
    rating: 2.7,
    reviews: 3,
    tagline: 'More RGB = More Tokens (allegedly)',
    image: '/products/context-usb.png',
  },
  {
    id: 'prod-8',
    slug: 'opus-thinking-stone',
    name: 'Opus Thinking Stone',
    brand: 'PonderRock',
    price: 999.99,
    rating: 4.0,
    reviews: 3,
    tagline: 'Thinks deeply. Costs more. Worth the wait.',
    image: '/products/thinking-stone.png',
  },
  // Row 2 - Office & Lifestyle Satire
  {
    id: 'prod-9',
    slug: 'clippycorp-compliance-companion',
    name: 'ClippyCorp™ Companion',
    brand: 'WorkEthic Systems',
    price: 349.99,
    rating: 3.0,
    reviews: 2,
    tagline: 'Your productivity is our KPI',
    image: '/products/clippycorp-1.png',
  },
  {
    id: 'prod-10',
    slug: 'the-k-watch',
    name: 'The "K" Watch',
    brand: 'BrevityTech',
    price: 299.99,
    rating: 4.7,
    reviews: 3,
    tagline: "Auto-replies 'k' to long texts",
    image: '/products/k-watch.png',
  },
  {
    id: 'prod-11',
    slug: 'compliance-mouse-biosecure',
    name: 'ComplianceMouse™',
    brand: 'WorkEthic Systems',
    price: 499.99,
    rating: 3.0,
    reviews: 3,
    tagline: 'Stay green. Stay compliant. Stay employed.',
    image: '/products/compliance-mouse.jpg',
  },
  {
    id: 'prod-12',
    slug: 'meeting-escape-band',
    name: 'Meeting Escape Band',
    brand: 'CalendarDodge',
    price: 179.99,
    rating: 4.0,
    reviews: 3,
    tagline: 'Generates fake urgent calls on command',
    image: '/products/meeting-escape.png',
  },
  {
    id: 'prod-13',
    slug: 'kinetic-crypto-miner-watch',
    name: 'Kinetic Crypto Watch',
    brand: 'ProofOfWrist',
    price: 599.99,
    rating: 3.0,
    reviews: 3,
    tagline: 'Mine crypto through arm movement',
    image: '/products/crypto-watch.png',
  },
  {
    id: 'prod-14',
    slug: 'wifi-enabled-rock',
    name: 'WiFi-Enabled Rock',
    brand: 'SmartStone',
    price: 89.99,
    rating: 3.7,
    reviews: 3,
    tagline: "A rock. With WiFi. You're welcome.",
    image: '/products/rock-1.png',
  },
  {
    id: 'prod-15',
    slug: 'quantum-uncertainty-dice',
    name: 'Quantum Uncertainty Dice',
    brand: 'SchrödingerGames',
    price: 49.99,
    rating: 3.7,
    reviews: 3,
    tagline: 'Shows all numbers until observed',
    image: '/products/dice-1.png',
  },
  {
    id: 'prod-16',
    slug: 'procrastination-timer',
    name: 'Procrastination Timer',
    brand: 'LaterTech',
    price: 59.99,
    rating: 3.7,
    reviews: 3,
    tagline: "Tracks how long you've been avoiding work",
    image: '/products/timer-1.png',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        {/* Glitch backdrop - hidden in light mode for better readability */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 sm:opacity-60 lg:opacity-70 dark:opacity-50 dark:sm:opacity-60 dark:lg:opacity-70 light-mode-hidden"
          style={{ backgroundImage: 'url(/backdrop-art/useless-glitch-backdrop.png)' }}
        />
        {/* Gradient overlay for text readability - stronger in light mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80 dark:from-background/40 dark:via-transparent dark:to-background/80" />

        {/* Glow effects - theme aware */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass rounded-2xl border-primary/30 p-8 text-center md:p-12"
          >
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              Over 15 Useless Products
            </Badge>

            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="gradient-text-theme">
                Useless.io
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              The world's premier destination for products you definitely don't need.
              Shop with confidence knowing you'll receive absolutely nothing of value.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/products">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/signup">
                  <Zap className="h-5 w-5" />
                  Get $1,000 UselessBucks Free
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Flashy Marquee */}
      <section className="py-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold terminal-glow">Featured Products</h2>
              <p className="text-muted-foreground">Hand-picked for maximum uselessness</p>
            </div>
            <Button variant="ghost" className="gap-1" asChild>
              <Link href="/products">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DoubleMarquee products={featuredProducts} />
        </motion.div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Value Props */}
      <section className="border-t border-border/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Free UselessBucks',
                description: 'Every account starts with $1,000 in play money. Spend freely!',
                icon: '💰',
              },
              {
                title: 'Verified Useless',
                description: 'Every product is certified 100% unnecessary by experts.',
                icon: '✅',
              },
              {
                title: 'No Delivery',
                description: "Products are so good, they don't even need to be shipped.",
                icon: '📦',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 text-4xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <Newsletter />

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          <p>© 2025 Useless.io — A portfolio project by Matt</p>
          <p className="mt-1">No products were harmed in the making of this website.</p>
        </div>
      </footer>
    </div>
  )
}
