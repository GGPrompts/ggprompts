import { NextRequest, NextResponse } from 'next/server'
import { syncPluginsToDatabase } from '@/lib/sync-plugins'
import crypto from 'crypto'

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

/**
 * Verify GitHub webhook signature
 * https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
function verifyGitHubSignature(payload: string, signature: string | null): boolean {
  if (!GITHUB_WEBHOOK_SECRET || !signature) {
    return false
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  // Get the raw body for signature verification
  const payload = await request.text()
  const signature = request.headers.get('x-hub-signature-256')
  const event = request.headers.get('x-github-event')

  // Verify webhook signature
  if (!verifyGitHubSignature(payload, signature)) {
    console.error('GitHub webhook signature verification failed')
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }

  // Only process push events
  if (event !== 'push') {
    return NextResponse.json(
      { message: `Ignoring ${event} event` },
      { status: 200 }
    )
  }

  // Parse the payload
  let body: { ref?: string; repository?: { full_name?: string } }
  try {
    body = JSON.parse(payload)
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  // Only sync on pushes to main branch
  if (body.ref !== 'refs/heads/main') {
    return NextResponse.json(
      { message: `Ignoring push to ${body.ref}, only syncing main branch` },
      { status: 200 }
    )
  }

  console.log(`GitHub webhook: Push to main branch of ${body.repository?.full_name}`)

  // Run the sync
  try {
    const result = await syncPluginsToDatabase()

    console.log(`GitHub sync completed: ${result.synced} items synced, ${result.errors} errors`)

    return NextResponse.json({
      success: result.success,
      message: `Synced ${result.synced} components`,
      synced: result.synced,
      errors: result.errors
    })
  } catch (error) {
    console.error('GitHub webhook sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle ping events (GitHub sends this when webhook is first created)
export async function GET() {
  return NextResponse.json({ status: 'GitHub sync webhook is active' })
}
