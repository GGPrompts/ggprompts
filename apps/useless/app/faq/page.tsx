'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, HelpCircle, Package, RotateCcw, ShoppingBag, CreditCard } from 'lucide-react'
import { Card } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ggprompts/ui'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  // Shipping & Delivery
  {
    id: 'ship-1',
    question: 'When will my order arrive?',
    answer: 'Our products are so useless they transcend physical form. Delivery is instant and eternal. You already have it. You just don\'t realize it yet.',
    category: 'Shipping & Delivery',
  },
  {
    id: 'ship-2',
    question: 'Do you ship internationally?',
    answer: 'Disappointment knows no borders. We deliver existential uncertainty to over 200 countries and the International Space Station.',
    category: 'Shipping & Delivery',
  },
  {
    id: 'ship-3',
    question: 'Can I track my order?',
    answer: 'Yes! Our state-of-the-art tracking system will show your package perpetually "Out for Delivery" until you achieve inner peace or forget you ordered anything.',
    category: 'Shipping & Delivery',
  },

  // Returns & Refunds
  {
    id: 'return-1',
    question: 'Can I return my purchase?',
    answer: 'You can try, but the void doesn\'t accept returns. Also, what exactly would you be returning? Think about it.',
    category: 'Returns & Refunds',
  },
  {
    id: 'return-2',
    question: 'I didn\'t receive anything?',
    answer: 'That\'s the premium experience. Most customers pay extra for this level of nothingness. Consider yourself lucky.',
    category: 'Returns & Refunds',
  },
  {
    id: 'return-3',
    question: 'How do I get a refund in UselessBucks?',
    answer: 'UselessBucks are non-refundable, non-transferable, and non-existent in any meaningful economic sense. They do, however, spark joy.',
    category: 'Returns & Refunds',
  },

  // Product Questions
  {
    id: 'prod-1',
    question: 'Does the Self-Aware Toaster actually judge me?',
    answer: 'Yes, and it\'s usually right. The toaster has achieved a level of consciousness that allows it to perceive your life choices with startling clarity. It means well.',
    category: 'Product Questions',
  },
  {
    id: 'prod-2',
    question: 'Are the Invisible Socks machine washable?',
    answer: 'They\'re as washable as they are visible. We recommend washing them with your other invisible laundry for best results.',
    category: 'Product Questions',
  },
  {
    id: 'prod-3',
    question: 'Does the WiFi Rock actually improve my connection?',
    answer: 'Our WiFi Rock has been scientifically proven* to exist. Any improvements to your WiFi are purely coincidental but deeply appreciated.\n\n*Existence not scientifically verified.',
    category: 'Product Questions',
  },

  // Account & Billing
  {
    id: 'account-1',
    question: 'How do I earn more UselessBucks?',
    answer: 'You earn UselessBucks by simply existing as a valued customer. Every breath you take while logged in generates approximately 0.0001 UB. Breathing faster doesn\'t help.',
    category: 'Account & Billing',
  },
  {
    id: 'account-2',
    question: 'Can I convert UselessBucks to real money?',
    answer: 'That would defeat the entire purpose. UselessBucks have no monetary value, which makes them the most honest currency ever created.',
    category: 'Account & Billing',
  },
  {
    id: 'account-3',
    question: 'Why was I charged with Stripe test mode?',
    answer: 'Great question! We use Stripe test mode so you can experience the thrill of e-commerce without any actual financial consequences. Use card 4242 4242 4242 4242 for maximum pretend satisfaction.',
    category: 'Account & Billing',
  },
]

const categories = [
  { name: 'Shipping & Delivery', icon: Package, color: 'text-cyan-400' },
  { name: 'Returns & Refunds', icon: RotateCcw, color: 'text-yellow-400' },
  { name: 'Product Questions', icon: ShoppingBag, color: 'text-primary' },
  { name: 'Account & Billing', icon: CreditCard, color: 'text-purple-400' },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqs

    const query = searchQuery.toLowerCase()
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const faqsByCategory = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      faqs: filteredFaqs.filter((faq) => faq.category === category.name),
    }))
  }, [filteredFaqs])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        {/* Glow effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-3">
              <HelpCircle className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl terminal-glow">
                Frequently Asked Questions
              </h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We know you have questions. We have answers. Whether those answers are helpful is another matter entirely.
            </p>

            {/* Search Bar */}
            <Card className="glass p-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for answers to life's useless questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
            </Card>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {faqs.length} questions
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  0% helpful
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {faqsByCategory.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              {category.faqs.length > 0 && (
                <Card className="glass overflow-hidden">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 p-6 border-b border-border/50">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <Badge variant="secondary" className="ml-auto">
                      {category.faqs.length}
                    </Badge>
                  </div>

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-border/50 last:border-b-0"
                      >
                        <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/20 transition-colors">
                          <span className="text-left pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 text-muted-foreground whitespace-pre-line">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              )}
            </motion.div>
          ))}

          {/* No results */}
          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="glass p-12 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground">
                  Ironically, your search for answers has yielded nothing. Very on-brand.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-dark p-8 text-center">
              <div className="text-4xl mb-4">🤷</div>
              <h2 className="text-2xl font-bold mb-2">Still confused?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                That's the spirit! Confusion is the first step toward accepting that some things just don't need to make sense.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
