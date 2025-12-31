import { NextResponse } from "next/server"
import { execSync } from "child_process"
import { readdirSync, statSync, existsSync, readFileSync } from "fs"
import { join } from "path"
import { homedir } from "os"
import type { LocalProject } from "@/lib/projects"
import { detectTechStack } from "@/lib/projects"

export const dynamic = "force-dynamic"

const PROJECTS_DIR = join(homedir(), "projects")

function getGitInfo(projectPath: string): LocalProject["git"] | null {
  const gitDir = join(projectPath, ".git")
  if (!existsSync(gitDir)) return null

  try {
    // Check if repo has any commits
    let hasCommits = true
    try {
      execSync("git rev-parse HEAD", {
        cwd: projectPath,
        encoding: "utf-8",
        timeout: 5000,
        stdio: ["pipe", "pipe", "pipe"],
      })
    } catch {
      hasCommits = false
    }

    // Get current branch (or default branch name for empty repos)
    let branch = "main"
    if (hasCommits) {
      branch = execSync("git rev-parse --abbrev-ref HEAD", {
        cwd: projectPath,
        encoding: "utf-8",
        timeout: 5000,
      }).trim()
    } else {
      // For repos with no commits, try to get the default branch from config
      try {
        const defaultBranch = execSync("git config init.defaultBranch", {
          cwd: projectPath,
          encoding: "utf-8",
          timeout: 5000,
          stdio: ["pipe", "pipe", "pipe"],
        }).trim()
        if (defaultBranch) branch = defaultBranch
      } catch {
        // Use "main" as fallback
      }
    }

    // Get remote URL
    let remoteUrl: string | undefined
    try {
      remoteUrl = execSync("git remote get-url origin", {
        cwd: projectPath,
        encoding: "utf-8",
        timeout: 5000,
      }).trim()
    } catch {
      // No remote configured
    }

    // Get status (clean/dirty/untracked)
    let status: "clean" | "dirty" | "untracked" = hasCommits ? "clean" : "untracked"
    try {
      const statusOutput = execSync("git status --porcelain", {
        cwd: projectPath,
        encoding: "utf-8",
        timeout: 5000,
      }).trim()
      if (statusOutput.length > 0) {
        // Check if only untracked files
        const lines = statusOutput.split("\n")
        const hasModified = lines.some((line) => !line.startsWith("??"))
        status = hasModified ? "dirty" : "untracked"
      }
    } catch {
      // Ignore status errors
    }

    // Get ahead/behind counts (only if repo has commits)
    let ahead = 0
    let behind = 0
    if (hasCommits) {
      try {
        const trackingBranch = execSync(`git rev-parse --abbrev-ref ${branch}@{upstream}`, {
          cwd: projectPath,
          encoding: "utf-8",
          timeout: 5000,
          stdio: ["pipe", "pipe", "pipe"],
        }).trim()

        if (trackingBranch) {
          const countOutput = execSync(`git rev-list --left-right --count ${branch}...${trackingBranch}`, {
            cwd: projectPath,
            encoding: "utf-8",
            timeout: 5000,
          }).trim()
          const [a, b] = countOutput.split(/\s+/).map(Number)
          ahead = a || 0
          behind = b || 0
        }
      } catch {
        // No upstream or error getting counts
      }
    }

    return { branch, remoteUrl, status, ahead, behind }
  } catch (error) {
    console.error(`Error getting git info for ${projectPath}:`, error)
    return null
  }
}

function getProjectDescription(projectPath: string, files: string[]): string | undefined {
  // Try package.json first
  if (files.includes("package.json")) {
    try {
      const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"))
      if (pkg.description) return pkg.description
    } catch {
      // Ignore parse errors
    }
  }

  // Try README
  const readmeFile = files.find((f) =>
    ["README.md", "readme.md", "README", "readme.txt", "README.txt"].includes(f)
  )
  if (readmeFile) {
    try {
      const content = readFileSync(join(projectPath, readmeFile), "utf-8")
      // Get first non-empty, non-heading line
      const lines = content.split("\n")
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("!") && trimmed.length > 10) {
          return trimmed.slice(0, 200)
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return undefined
}

function getScripts(projectPath: string, files: string[]): string[] | undefined {
  if (!files.includes("package.json")) return undefined

  try {
    const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"))
    if (pkg.scripts) {
      return Object.keys(pkg.scripts)
    }
  } catch {
    // Ignore parse errors
  }

  return undefined
}

function scanProject(projectPath: string, name: string): LocalProject | null {
  try {
    const stat = statSync(projectPath)
    if (!stat.isDirectory()) return null

    const files = readdirSync(projectPath)

    // Skip if it's not a real project (no meaningful files)
    const hasProjectFiles = files.some((f) =>
      [
        "package.json",
        "go.mod",
        "Cargo.toml",
        "pyproject.toml",
        "requirements.txt",
        ".git",
        "Makefile",
        "CMakeLists.txt",
      ].includes(f)
    )
    if (!hasProjectFiles) return null

    const git = getGitInfo(projectPath)
    const description = getProjectDescription(projectPath, files)
    const techStack = detectTechStack(files)
    const scripts = getScripts(projectPath, files)

    return {
      name,
      path: projectPath,
      description,
      techStack,
      git,
      lastModified: stat.mtime.toISOString(),
      scripts,
    }
  } catch (error) {
    console.error(`Error scanning project ${projectPath}:`, error)
    return null
  }
}

export async function GET() {
  // Check if projects directory exists
  if (!existsSync(PROJECTS_DIR)) {
    return NextResponse.json({
      projects: [],
      error: `Projects directory not found: ${PROJECTS_DIR}`,
    })
  }

  try {
    const entries = readdirSync(PROJECTS_DIR)
    const projects: LocalProject[] = []

    for (const entry of entries) {
      // Skip hidden directories
      if (entry.startsWith(".")) continue

      const projectPath = join(PROJECTS_DIR, entry)
      const project = scanProject(projectPath, entry)

      if (project) {
        projects.push(project)
      }
    }

    // Sort by last modified
    projects.sort((a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )

    return NextResponse.json({ projects, count: projects.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to scan projects"
    console.error("Local scan error:", message)
    return NextResponse.json(
      { error: message, projects: [] },
      { status: 500 }
    )
  }
}
