import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PublicProfileView } from './PublicProfileView'
import type { PublicProfile, RecentPrompt, RecentPost } from '@/lib/types'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return {
    title: `@${username} - GGPrompts`,
    description: `View ${username}'s public profile on GGPrompts`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // Fetch public profile using the RPC function
  const { data: profileData, error: profileError } = await supabase
    .rpc('get_public_profile', { target_username: username })

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    notFound()
  }

  if (!profileData || profileData.length === 0) {
    notFound()
  }

  const profile = profileData[0] as PublicProfile

  // Fetch recent activity if privacy settings allow
  let recentPrompts: RecentPrompt[] = []
  let recentPosts: RecentPost[] = []

  if (profile.privacy_settings?.show_recent_activity) {
    // Fetch recent prompts
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id, title, category, like_count, usage_count, created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (prompts) {
      recentPrompts = prompts as RecentPrompt[]
    }

    // Fetch recent forum posts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, forum_id, created_at, forums(name)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (posts) {
      recentPosts = posts as unknown as RecentPost[]
    }
  }

  return (
    <PublicProfileView
      profile={profile}
      recentPrompts={recentPrompts}
      recentPosts={recentPosts}
    />
  )
}
