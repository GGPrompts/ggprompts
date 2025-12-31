import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreatePromptForm } from '@/components/prompts/CreatePromptForm'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewPromptPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?redirect=/prompts/new')
  }

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Prompts</span>
            </Link>

            <div className="text-center mb-8">
              <Badge
                variant="outline"
                className="mb-4 border-primary/50 text-primary"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Create Prompt
              </Badge>

              <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
                <span className="gradient-text-theme animate-gradient">
                  Share Your Prompt
                </span>
              </h1>

              <p className="text-muted-foreground max-w-xl mx-auto">
                Create a new prompt to share with the community. Add template
                fields to make your prompt customizable.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Form Section */}
      <section className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass border border-border/50 rounded-xl p-6 md:p-8">
              <CreatePromptForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
