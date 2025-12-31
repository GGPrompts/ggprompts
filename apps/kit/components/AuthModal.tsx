"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Shield, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { AUTH_PROVIDERS } from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithProvider } = useAuth()

  const handleSignIn = async (provider: typeof AUTH_PROVIDERS.GITHUB | typeof AUTH_PROVIDERS.GOOGLE) => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithProvider(provider)
      // OAuth will redirect, so we don't need to close the modal
    } catch (err) {
      setError("Failed to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md glass rounded-2xl p-8 shadow-2xl border border-border/50"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold terminal-glow mb-2">Welcome</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to sync your notes and bookmarks with GitHub
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSignIn(AUTH_PROVIDERS.GITHUB)}
              disabled={isLoading}
              className="w-full h-12 bg-[#24292e] hover:bg-[#24292e]/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Github className="h-5 w-5 mr-2" />
              )}
              Continue with GitHub
            </Button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-muted-foreground">
            By signing in, you grant access to sync with your GitHub repositories
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
