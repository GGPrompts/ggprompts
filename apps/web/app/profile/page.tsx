import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { Prompt, ForumPost, Profile, Component, UserToolkit } from '@/lib/types'

interface ToolkitItemWithComponent extends UserToolkit {
  component: Component
}

interface UserData {
  profile: Profile
  prompts: Prompt[]
  posts: ForumPost[]
  toolkitItems: ToolkitItemWithComponent[]
  stats: {
    promptCount: number
    postCount: number
    totalLikes: number
    toolkitCount: number
  }
}

async function getUserData(userId: string): Promise<UserData | null> {
  const supabase = await createClient()

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError)
    return null
  }

  // Get user's prompts
  const { data: prompts, error: promptsError } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (promptsError) {
    console.error('Error fetching prompts:', promptsError)
  }

  // Get user's forum posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (postsError) {
    console.error('Error fetching posts:', postsError)
  }

  // Get user's toolkit items
  const { data: toolkit, error: toolkitError } = await supabase
    .from('user_toolkit')
    .select(`
      id,
      user_id,
      component_id,
      enabled,
      added_at,
      components (*)
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (toolkitError) {
    console.error('Error fetching toolkit:', toolkitError)
  }

  // Filter out items without valid components and transform
  const toolkitItems = (toolkit || [])
    .filter(item => item.components)
    .map(item => ({
      id: item.id,
      user_id: item.user_id,
      component_id: item.component_id,
      enabled: item.enabled,
      is_forked: true, // Always true now
      added_at: item.added_at,
      component: item.components as unknown as Component
    })) as ToolkitItemWithComponent[]

  // Calculate total likes from user's prompts
  const totalLikes = (prompts || []).reduce((sum, p) => sum + (p.like_count || 0), 0)

  return {
    profile: profile as Profile,
    prompts: (prompts || []) as Prompt[],
    posts: (posts || []) as ForumPost[],
    toolkitItems,
    stats: {
      promptCount: prompts?.length || 0,
      postCount: posts?.length || 0,
      totalLikes,
      toolkitCount: toolkitItems.length
    }
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to home if not authenticated
  if (!user) {
    redirect('/')
  }

  // Get user data
  const userData = await getUserData(user.id)

  if (!userData) {
    redirect('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <ProfileHeader
          profile={userData.profile}
          stats={userData.stats}
          email={user.email}
          userId={user.id}
          oauthAvatarUrl={user.user_metadata?.avatar_url || user.user_metadata?.picture}
          oauthProvider={user.user_metadata?.picture ? 'google' : user.user_metadata?.avatar_url ? 'github' : null}
        />

        {/* Profile Tabs */}
        <div className="mt-8">
          <ProfileTabs
            prompts={userData.prompts}
            posts={userData.posts}
            toolkitItems={userData.toolkitItems}
          />
        </div>
      </div>
    </div>
  )
}
