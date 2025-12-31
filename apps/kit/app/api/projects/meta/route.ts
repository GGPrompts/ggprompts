import { NextRequest, NextResponse } from "next/server"
import { getFile, saveFile, type GitHubError } from "@/lib/github"

export const dynamic = "force-dynamic"

const META_FILE = "projects-meta.json"

// Default empty metadata structure
const DEFAULT_META = {
  version: 1,
  projects: {},
  updatedAt: new Date().toISOString(),
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const token = authHeader?.replace("Bearer ", "")
  const repo = request.nextUrl.searchParams.get("repo")

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    )
  }

  if (!repo) {
    return NextResponse.json(
      { error: "Repository parameter required" },
      { status: 400 }
    )
  }

  try {
    const result = await getFile(token, repo, META_FILE)
    const data = JSON.parse(result.content)
    return NextResponse.json({ data, sha: result.sha })
  } catch (err) {
    const githubError = err as GitHubError
    if (githubError.status === 404) {
      // File doesn't exist yet, return default structure
      return NextResponse.json({ data: DEFAULT_META, sha: null })
    }
    console.error("Error fetching projects meta:", githubError)
    return NextResponse.json(
      { error: githubError.message || "Failed to fetch project metadata" },
      { status: githubError.status || 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const token = authHeader?.replace("Bearer ", "")
  const repo = request.nextUrl.searchParams.get("repo")

  if (!token) {
    return NextResponse.json(
      { error: "Authorization token required" },
      { status: 401 }
    )
  }

  if (!repo) {
    return NextResponse.json(
      { error: "Repository parameter required" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const { data, sha } = body

    if (!data) {
      return NextResponse.json(
        { error: "Data is required" },
        { status: 400 }
      )
    }

    // Ensure version and updatedAt are set
    const metaToSave = {
      ...data,
      version: data.version || 1,
      updatedAt: new Date().toISOString(),
    }

    const content = JSON.stringify(metaToSave, null, 2)
    const result = await saveFile(
      token,
      repo,
      META_FILE,
      content,
      sha,
      "Update project metadata"
    )

    return NextResponse.json({ sha: result.sha, data: metaToSave })
  } catch (err) {
    const githubError = err as GitHubError
    console.error("Error saving projects meta:", githubError)

    // Handle conflict (file was modified)
    if (githubError.status === 409) {
      return NextResponse.json(
        { error: "Conflict: file was modified. Please refresh and try again." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: githubError.message || "Failed to save project metadata" },
      { status: githubError.status || 500 }
    )
  }
}
