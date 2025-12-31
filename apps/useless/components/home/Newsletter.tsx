'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, Check, Sparkles } from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Card } from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Checkbox } from '@ggprompts/ui'

const topics = [
  { id: 'products', name: 'New Pointless Products', icon: '🛒' },
  { id: 'regrets', name: 'Customer Regret Stories', icon: '😅' },
  { id: 'deals', name: "Deals You'll Regret Missing", icon: '💸' },
  { id: 'tips', name: 'Useless Life Tips', icon: '💡' },
]

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['products', 'regrets'])
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubscribe = () => {
    if (!email) {
      setError('Please enter your email (we promise to misuse it)')
      return
    }
    if (!validateEmail(email)) {
      setError('That email looks as fake as our products')
      return
    }
    setError('')
    setIsSubscribed(true)
  }

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    )
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-primary/20 overflow-hidden">
            {/* Header gradient */}
            <div className="relative h-24 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail className="h-16 w-16 text-primary/20" />
              </div>
            </div>

            <div className="p-8">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Subscribe to Useless Updates™
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    <span className="gradient-text-theme">
                      Stay Poorly Informed
                    </span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Get weekly reminders of things you don't need. Join thousands of shoppers
                    who regret nothing (because they remember nothing).
                  </p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.div
                      key="subscribe-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Email input */}
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          className="h-12 bg-[hsl(var(--muted))] border-foreground/20 focus:border-primary text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                          aria-label="Email address"
                          aria-describedby={error ? 'email-error' : undefined}
                        />
                        <Button
                          size="lg"
                          onClick={handleSubscribe}
                          className="h-12 px-8 gap-2"
                          disabled={!email}
                        >
                          <Send className="h-4 w-4" />
                          Subscribe
                        </Button>
                      </div>

                      {/* Error message */}
                      {error && (
                        <motion.p
                          id="email-error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-destructive"
                          role="alert"
                        >
                          {error}
                        </motion.p>
                      )}

                      {/* Topic preferences */}
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose your poison (optional):
                        </p>
                        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                          {topics.map((topic) => (
                            <motion.div
                              key={topic.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                className={`p-3 cursor-pointer transition-all ${
                                  selectedTopics.includes(topic.id)
                                    ? 'border-primary bg-primary/10'
                                    : 'border-foreground/20 hover:border-primary/50'
                                }`}
                                onClick={() => toggleTopic(topic.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedTopics.includes(topic.id)}
                                    aria-label={`Subscribe to ${topic.name}`}
                                  />
                                  <div className="flex items-center gap-2 text-sm">
                                    <span>{topic.icon}</span>
                                    <span>{topic.name}</span>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-lg border-2 border-primary/50 bg-primary/10 max-w-md mx-auto"
                    >
                      <Check className="h-12 w-12 mx-auto mb-3 text-primary" />
                      <h3 className="text-xl font-bold mb-2 text-primary">
                        Welcome to the Void!
                      </h3>
                      <p className="text-muted-foreground">
                        Your inbox will never be the same (worse). First useless update arriving soon.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-muted-foreground">
                  100% spam-free.* Unsubscribe whenever you regain consciousness.
                  <br />
                  <span className="opacity-60">*Our definition of spam may vary.</span>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
