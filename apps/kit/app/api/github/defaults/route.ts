import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export interface GitHubDefaultsResponse {
  token: string | null
  repo: string | null
  isDev: boolean
}

export async function GET() {
  const isDev = process.env.NODE_ENV === "development"

  const response: GitHubDefaultsResponse = {
    // Only expose token in development mode for security
    token: isDev ? (process.env.GITHUB_DEFAULT_TOKEN || null) : null,
    repo: process.env.GITHUB_DEFAULT_REPO || null,
    isDev,
  }

  return NextResponse.json(response)
}
