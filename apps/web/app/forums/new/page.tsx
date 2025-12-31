import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreatePostForm } from '@/components/forums/CreatePostForm'
import { Badge } from '@ggprompts/ui'
import { MessageSquare } from 'lucide-react'

export default async function NewPostPage() {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?returnTo=/forums/new')
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
              <MessageSquare className="w-3 h-3 mr-1" />
              New Discussion
            </Badge>

            <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
              <span className="gradient-text-theme animate-gradient">
                Start a Discussion
              </span>
            </h1>

            <p className="text-muted-foreground max-w-md mx-auto">
              Share your thoughts, ask questions, or showcase your projects with the community.
            </p>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Form Section */}
      <section className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-xl p-6 md:p-8 border border-border/50">
              <CreatePostForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
