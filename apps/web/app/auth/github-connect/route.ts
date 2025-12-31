import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GitHub Connect Callback Handler
 *
 * This handles the OAuth callback after a user connects their GitHub account
 * with the `repo` scope for syncing their toolkit.
 *
 * Supports two flows:
 * 1. linkIdentity flow - Links GitHub to existing account (preserves session)
 * 2. signInWithOAuth flow - For users already signed in with GitHub (refreshes token)
 *
 * Both flows:
 * 1. Complete the OAuth exchange
 * 2. Capture the provider_token from the session
 * 3. Store it in user_github_sync table
 * 4. Redirect to settings or toolkit page
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/settings?tab=github'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors from GitHub
  if (error) {
    console.error('GitHub OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/settings?tab=github&error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  const supabase = await createClient()

  // First, check if user is already authenticated
  const { data: { user: existingUser } } = await supabase.auth.getUser()

  if (code) {
    // Exchange the code for a session
    // When initiated via linkIdentity, this links rather than replaces the session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('GitHub code exchange error:', exchangeError)
      return NextResponse.redirect(
        `${origin}/settings?tab=github&error=${encodeURIComponent('Failed to connect GitHub: ' + exchangeError.message)}`
      )
    }

    // Get the provider token from the exchange result
    let providerToken = data.session?.provider_token

    // If no provider token in exchange result, try getting fresh session
    if (!providerToken) {
      const { data: sessionData } = await supabase.auth.getSession()
      providerToken = sessionData.session?.provider_token
    }

    if (!providerToken) {
      console.error('No provider token in session after exchange')
      return NextResponse.redirect(
        `${origin}/settings?tab=github&error=${encodeURIComponent('GitHub did not provide access token. Try using a Personal Access Token instead.')}`
      )
    }

    // Get the user - should be the same user if linkIdentity was used
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(`${origin}/login?redirect=/settings`)
    }

    // Verify the user is the same (linkIdentity should preserve this)
    if (existingUser && existingUser.id !== user.id) {
      console.warn('User ID changed after OAuth exchange - this should not happen with linkIdentity')
    }

    // Get GitHub username from the token
    let githubUsername: string | null = null
    try {
      const ghResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${providerToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts'
        }
      })
      if (ghResponse.ok) {
        const ghUser = await ghResponse.json()
        githubUsername = ghUser.login
      }
    } catch (e) {
      console.error('Failed to fetch GitHub username:', e)
    }

    // Fallback to user metadata if API call failed
    if (!githubUsername) {
      githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username || null
    }

    // Store the token in user_github_sync table
    const { error: upsertError } = await supabase
      .from('user_github_sync')
      .upsert({
        user_id: user.id,
        github_token_encrypted: providerToken,
        repo_name: 'my-gg-plugins',
        repo_full_name: githubUsername ? `${githubUsername}/my-gg-plugins` : null,
        sync_status: null,
        sync_error: null
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      console.error('Failed to store GitHub token:', upsertError)
      return NextResponse.redirect(
        `${origin}/settings?tab=github&error=${encodeURIComponent('Failed to save GitHub connection')}`
      )
    }

    // Success! Redirect to the next page
    const redirectUrl = new URL(next, origin)
    redirectUrl.searchParams.set('github_connected', 'true')
    return NextResponse.redirect(redirectUrl.toString())
  }

  // No code provided - check if we already have a session with provider_token
  // This can happen if Supabase handled the exchange automatically
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.provider_token && existingUser) {
    const providerToken = sessionData.session.provider_token

    // Get GitHub username
    let githubUsername: string | null = null
    try {
      const ghResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${providerToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GGPrompts'
        }
      })
      if (ghResponse.ok) {
        const ghUser = await ghResponse.json()
        githubUsername = ghUser.login
      }
    } catch (e) {
      console.error('Failed to fetch GitHub username:', e)
    }

    // Store the token
    const { error: upsertError } = await supabase
      .from('user_github_sync')
      .upsert({
        user_id: existingUser.id,
        github_token_encrypted: providerToken,
        repo_name: 'my-gg-plugins',
        repo_full_name: githubUsername ? `${githubUsername}/my-gg-plugins` : null,
        sync_status: null,
        sync_error: null
      }, {
        onConflict: 'user_id'
      })

    if (!upsertError) {
      const redirectUrl = new URL(next, origin)
      redirectUrl.searchParams.set('github_connected', 'true')
      return NextResponse.redirect(redirectUrl.toString())
    }
  }

  // No code and no existing provider token
  return NextResponse.redirect(`${origin}/settings?tab=github&error=${encodeURIComponent('No authorization code provided')}`)
}
