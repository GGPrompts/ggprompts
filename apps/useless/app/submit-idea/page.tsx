'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb,
  Send,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  X,
} from 'lucide-react'
import { Button } from '@ggprompts/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ggprompts/ui'
import { Input } from '@ggprompts/ui'
import { Label } from '@ggprompts/ui'
import { Textarea } from '@ggprompts/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ggprompts/ui'
import { Badge } from '@ggprompts/ui'

const categories = [
  { value: 'useless-tech', label: 'Useless Tech', emoji: '🤖' },
  { value: 'pointless-fashion', label: 'Pointless Fashion', emoji: '👗' },
  { value: 'unnecessary-home', label: 'Unnecessary Home Goods', emoji: '🏠' },
  { value: 'absurd-food', label: 'Absurd Food & Drink', emoji: '🍕' },
  { value: 'workplace-chaos', label: 'Workplace Chaos', emoji: '💼' },
  { value: 'pet-nonsense', label: 'Pet Nonsense', emoji: '🐕' },
]

function SuccessModal({
  isOpen,
  onClose,
  productName,
}: {
  isOpen: boolean
  onClose: () => void
  productName: string
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 mx-4 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <Card className="glass border-primary/30 p-8 text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-4 top-4"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20"
              >
                <CheckCircle className="h-10 w-10 text-primary" />
              </motion.div>

              <h3 className="mb-2 text-2xl font-bold">Terrible Idea Received!</h3>
              <p className="mb-4 text-muted-foreground">
                "{productName}" has been added to our pile of questionable concepts.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Our team of professional procrastinators will review your submission
                and potentially never get back to you.
              </p>

              <Button onClick={onClose} className="w-full">
                Submit Another Bad Idea
              </Button>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function SubmitIdeaPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    productName: '',
    description: '',
    category: '',
    whyUseless: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedProductName, setSubmittedProductName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedProductName(formData.productName)
    setIsSubmitted(true)
    // Reset form
    setFormData({
      name: '',
      email: '',
      productName: '',
      description: '',
      category: '',
      whyUseless: '',
    })
  }

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.productName &&
    formData.description &&
    formData.category &&
    formData.whyUseless

  return (
    <div className="min-h-screen">
      {/* Glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <Lightbulb className="h-10 w-10 text-primary" />
            </div>

            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              Product R&D Department
            </Badge>

            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="gradient-text-theme">
                Submit Your Useless Idea
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Help us waste more of humanity's potential. Your terrible idea could be
              our next bestseller.*
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              *We make no guarantees about actually making anything.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Idea Submission Form
                </CardTitle>
                <CardDescription>
                  Fill in the details below. The worse the idea, the better.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Your Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Nikola Tesla Jr."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="genius@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  {/* Product Name & Category Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productName">
                        Product Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="productName"
                        placeholder="The Procrastination Station 3000"
                        value={formData.productName}
                        onChange={(e) =>
                          setFormData({ ...formData, productName: e.target.value })
                        }
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                        required
                      >
                        <SelectTrigger id="category" aria-required="true">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <span className="mr-2">{cat.emoji}</span>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">
                        Product Description <span className="text-red-400">*</span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {formData.description.length}/500
                      </span>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in vivid, unnecessary detail..."
                      rows={4}
                      maxLength={500}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      aria-required="true"
                    />
                  </div>

                  {/* Why It's Useless */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whyUseless">
                        Why Is It Useless? <span className="text-red-400">*</span>
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {formData.whyUseless.length}/300
                      </span>
                    </div>
                    <Textarea
                      id="whyUseless"
                      placeholder="Convince us this serves absolutely no purpose..."
                      rows={3}
                      maxLength={300}
                      value={formData.whyUseless}
                      onChange={(e) =>
                        setFormData({ ...formData, whyUseless: e.target.value })
                      }
                      required
                      aria-required="true"
                    />
                    <p className="text-xs text-muted-foreground">
                      Pro tip: The more useless, the more likely we'll consider it.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                      📬 We'll probably never respond
                    </p>
                    <Button
                      type="submit"
                      disabled={!isFormValid}
                      className="gap-2"
                    >
                      Submit Terrible Idea
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Card className="glass border-primary/20 p-6">
              <p className="mb-2 font-semibold">Need inspiration?</p>
              <p className="text-sm text-muted-foreground">
                Past winning ideas include: "Bluetooth-enabled houseplant", "AI that only
                gives wrong directions", and "A subscription service for expired coupons".
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        productName={submittedProductName}
      />
    </div>
  )
}
