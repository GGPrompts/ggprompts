"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { FolderGit2, RotateCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/AuthProvider"
import {
  mergeProjects,
  type Project,
  type GitHubRepo,
  type LocalProject,
} from "@/lib/projects"
import ProjectOverview from "@/components/projects/ProjectOverview"
import ProjectCommands from "@/components/projects/ProjectCommands"
import ProjectKanban from "@/components/projects/ProjectKanban"
import ProjectLinks from "@/components/projects/ProjectLinks"
import ProjectSourceControl from "@/components/projects/ProjectSourceControl"

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user, getGitHubToken } = useAuth()

  // Fetch GitHub repos
  const { data: githubData, isLoading: githubLoading } = useQuery({
    queryKey: ["projects-github"],
    queryFn: async () => {
      const token = await getGitHubToken()
      if (!token) return { repos: [] as GitHubRepo[], count: 0 }

      const res = await fetch("/api/projects/github", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to fetch repos")
      }
      return res.json() as Promise<{ repos: GitHubRepo[]; count: number }>
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  // Fetch local projects
  const { data: localData, isLoading: localLoading } = useQuery({
    queryKey: ["projects-local"],
    queryFn: async () => {
      const res = await fetch("/api/projects/local")
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to scan projects")
      }
      return res.json() as Promise<{ projects: LocalProject[]; count: number }>
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  // Merge and find the project
  const project = React.useMemo(() => {
    const projects = mergeProjects(githubData?.repos || [], localData?.projects || [])
    return projects.find((p) => p.slug === slug)
  }, [githubData?.repos, localData?.projects, slug])

  const isLoading = githubLoading || localLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RotateCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <FolderGit2 className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p>The project "{slug}" could not be found.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="source-control">Source Control</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="source-control">
          <ProjectSourceControl project={project} />
        </TabsContent>

        <TabsContent value="commands">
          <ProjectCommands project={project} />
        </TabsContent>

        <TabsContent value="kanban">
          <ProjectKanban project={project} />
        </TabsContent>

        <TabsContent value="links">
          <ProjectLinks project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
