'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Github,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { createClient, AUTH_PROVIDERS } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 15
    if (/[a-z]/.test(pwd)) strength += 15
    if (/[A-Z]/.test(pwd)) strength += 15
    if (/[0-9]/.test(pwd)) strength += 15
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 15
    return Math.min(strength, 100)
  }

  const passwordStrength = calculatePasswordStrength(password)

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return { label: 'Weak', color: 'text-destructive' }
    if (strength < 60) return { label: 'Fair', color: 'text-yellow-500' }
    if (strength < 80) return { label: 'Good', color: 'text-blue-500' }
    return { label: 'Strong', color: 'text-primary' }
  }

  const strengthInfo = getStrengthLabel(passwordStrength)

  // Password requirements
  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(password) },
  ]

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!username) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (passwordStrength < 60) {
      newErrors.password = 'Please choose a stronger password'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setGeneralError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setGeneralError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setGeneralError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? AUTH_PROVIDERS.GOOGLE : AUTH_PROVIDERS.GITHUB,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setGeneralError(error.message)
        setIsLoading(false)
      }
    } catch {
      setGeneralError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold terminal-glow mb-3">Check Your Email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a verification link to <strong className="text-foreground">{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Click the link in your email to verify your account and get started.
          </p>
          <Button asChild variant="outline" className="glass-dark">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Sign Up Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-dark mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold terminal-glow mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join GGPrompts and start creating</p>
          </div>

          {/* General Error */}
          {generalError && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full glass-dark border-border/50 hover:border-primary/50 group"
                onClick={() => handleOAuthSignup('google')}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full glass-dark border-border/50 hover:border-primary/50 group"
                onClick={() => handleOAuthSignup('github')}
                disabled={isLoading}
              >
                <Github className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                Sign up with GitHub
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Or with email
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="promptmaster"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                    setUsername(value)
                    setErrors((prev) => ({ ...prev, username: '' }))
                  }}
                  className={`pl-10 glass-dark ${errors.username ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  className={`pl-10 glass-dark ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: '' }))
                  }}
                  className={`pl-10 pr-10 glass-dark ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                  </div>
                  <Progress value={passwordStrength} className="h-1" />

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1 text-xs ${
                          req.met ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {req.met ? (
                          <Check className="w-3 h-3 shrink-0" />
                        ) : (
                          <X className="w-3 h-3 shrink-0" />
                        )}
                        <span className="truncate">{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                  }}
                  className={`pl-10 pr-10 glass-dark ${
                    errors.confirmPassword ? 'border-destructive' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => {
                    setAcceptTerms(checked as boolean)
                    setErrors((prev) => ({ ...prev, terms: '' }))
                  }}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Account
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
