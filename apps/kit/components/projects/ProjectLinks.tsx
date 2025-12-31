"use client"

import * as React from "react"
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  Rocket,
  Palette,
  Server,
  MoreHorizontal,
  Cloud,
  CloudOff,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type Project, type ProjectLink } from "@/lib/projects"
import { useProjectMeta } from "@/hooks/useProjectMeta"

interface ProjectLinksProps {
  project: Project
}

const LINK_TYPES: { id: ProjectLink["type"]; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "docs", label: "Documentation", icon: <FileText className="h-4 w-4" />, color: "text-blue-400" },
  { id: "deploy", label: "Deployment", icon: <Rocket className="h-4 w-4" />, color: "text-emerald-400" },
  { id: "design", label: "Design", icon: <Palette className="h-4 w-4" />, color: "text-purple-400" },
  { id: "api", label: "API", icon: <Server className="h-4 w-4" />, color: "text-amber-400" },
  { id: "other", label: "Other", icon: <LinkIcon className="h-4 w-4" />, color: "text-gray-400" },
]

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ""
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

export default function ProjectLinks({ project }: ProjectLinksProps) {
  const {
    meta,
    isLoading,
    isSyncing,
    syncStatus,
    addLink,
    updateLink,
    deleteLink,
  } = useProjectMeta(project.slug)

  const links = meta.links
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editingLink, setEditingLink] = React.useState<ProjectLink | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<ProjectLink | null>(null)

  // Form state
  const [formName, setFormName] = React.useState("")
  const [formUrl, setFormUrl] = React.useState("")
  const [formType, setFormType] = React.useState<ProjectLink["type"]>("other")
  const [formIcon, setFormIcon] = React.useState("")

  const resetForm = () => {
    setFormName("")
    setFormUrl("")
    setFormType("other")
    setFormIcon("")
    setEditingLink(null)
  }

  const handleAddLink = () => {
    addLink({
      name: formName,
      url: formUrl.startsWith("http") ? formUrl : `https://${formUrl}`,
      type: formType,
      icon: formIcon || undefined,
    })
    resetForm()
    setAddDialogOpen(false)
  }

  const handleUpdateLink = () => {
    if (!editingLink) return
    updateLink(editingLink.id, {
      name: formName,
      url: formUrl.startsWith("http") ? formUrl : `https://${formUrl}`,
      type: formType,
      icon: formIcon || undefined,
    })
    resetForm()
    setAddDialogOpen(false)
  }

  const handleDeleteLink = (linkId: string) => {
    deleteLink(linkId)
    setDeleteConfirm(null)
  }

  const openEditDialog = (link: ProjectLink) => {
    setEditingLink(link)
    setFormName(link.name)
    setFormUrl(link.url)
    setFormType(link.type)
    setFormIcon(link.icon || "")
    setAddDialogOpen(true)
  }

  const getLinkTypeInfo = (type: ProjectLink["type"]) => {
    return LINK_TYPES.find((t) => t.id === type) || LINK_TYPES[4]
  }

  const handleQuickAdd = (name: string, url: string, type: ProjectLink["type"]) => {
    addLink({ name, url, type })
  }

  // Sync status icon
  const SyncStatusIcon = () => {
    switch (syncStatus) {
      case "synced":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Cloud className="h-4 w-4 text-emerald-500" />
              </TooltipTrigger>
              <TooltipContent>Links synced to GitHub</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "syncing":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              </TooltipTrigger>
              <TooltipContent>Syncing...</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "error":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </TooltipTrigger>
              <TooltipContent>Sync error</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "offline":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudOff className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Offline (stored locally)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Links</h2>
          <p className="text-sm text-muted-foreground">
            Project-related bookmarks and resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SyncStatusIcon />
          <Button size="sm" onClick={() => { resetForm(); setAddDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Links Grid */}
      {links.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const typeInfo = getLinkTypeInfo(link.type)
            return (
              <Card key={link.id} className="glass group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="h-10 w-10 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                      {link.icon ? (
                        <span className="text-xl">{link.icon}</span>
                      ) : (
                        <img
                          src={getFaviconUrl(link.url)}
                          alt=""
                          className="h-6 w-6"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.parentElement!.innerHTML = `<span class="${typeInfo.color}">${typeInfo.icon}</span>`
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary flex items-center gap-1 group/link"
                      >
                        <span className="truncate">{link.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 flex-shrink-0" />
                      </a>
                      <p className="text-xs text-muted-foreground truncate">
                        {getDomain(link.url)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={typeInfo.color}>{typeInfo.icon}</span>
                        <span className="text-xs text-muted-foreground">{typeInfo.label}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Link
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(link)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteConfirm(link)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="glass rounded-lg p-8 text-center text-muted-foreground">
          <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No links yet</p>
          <p className="text-sm mt-1">
            Add links to documentation, deployments, designs, and more
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => { resetForm(); setAddDialogOpen(true) }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first link
          </Button>
        </div>
      )}

      {/* Quick Add Suggestions */}
      {links.length === 0 && project.github && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Add
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd("GitHub Issues", `${project.github!.html_url}/issues`, "other")}
                disabled={isSyncing}
              >
                GitHub Issues
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd("Pull Requests", `${project.github!.html_url}/pulls`, "other")}
                disabled={isSyncing}
              >
                Pull Requests
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd("Actions", `${project.github!.html_url}/actions`, "deploy")}
                disabled={isSyncing}
              >
                Actions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Link Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setAddDialogOpen(open) }}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Link" : "Add Link"}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? "Update this link"
                : "Add a link related to this project"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Documentation"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">URL</label>
              <Input
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://docs.example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Type</label>
              <Select value={formType} onValueChange={(v) => setFormType(v as ProjectLink["type"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LINK_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <span className={type.color}>{type.icon}</span>
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Icon (optional emoji)
              </label>
              <Input
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="📚"
                className="w-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setAddDialogOpen(false) }}>
              Cancel
            </Button>
            <Button
              onClick={editingLink ? handleUpdateLink : handleAddLink}
              disabled={!formName || !formUrl || isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingLink ? (
                "Save Changes"
              ) : (
                "Add Link"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeleteLink(deleteConfirm.id)}
              disabled={isSyncing}
            >
              {isSyncing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
