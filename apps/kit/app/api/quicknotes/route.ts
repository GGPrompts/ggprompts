import { NextRequest, NextResponse } from "next/server"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { homedir } from "os"

export const dynamic = "force-dynamic"

const CONFIG_DIR = join(homedir(), ".config", "homepage")
const NOTES_FILE = join(CONFIG_DIR, "quicknotes.json")

// ============================================================================
// TYPES
// ============================================================================

export interface QuickNote {
  id: string
  project: string // "general" | "personal" | repo name
  text: string
  createdAt: string
  updatedAt?: string
}

interface NotesData {
  version: number
  notes: QuickNote[]
}

// ============================================================================
// HELPERS
// ============================================================================

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

function readNotes(): NotesData {
  ensureConfigDir()

  if (!existsSync(NOTES_FILE)) {
    return { version: 1, notes: [] }
  }

  try {
    const content = readFileSync(NOTES_FILE, "utf-8")
    return JSON.parse(content)
  } catch {
    return { version: 1, notes: [] }
  }
}

function writeNotes(data: NotesData) {
  ensureConfigDir()
  writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2), "utf-8")
}

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// HANDLERS
// ============================================================================

// GET - fetch all notes
export async function GET() {
  try {
    const data = readNotes()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read notes"
    console.error("Error reading notes:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST - add a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { project, text } = body

    if (!text?.trim()) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 })
    }

    const data = readNotes()
    const newNote: QuickNote = {
      id: generateId(),
      project: project || "general",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    data.notes.unshift(newNote) // Add to beginning
    writeNotes(data)

    return NextResponse.json({ note: newNote })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add note"
    console.error("Error adding note:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT - update a note
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, project, text } = body

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    const data = readNotes()
    const noteIndex = data.notes.findIndex((n) => n.id === id)

    if (noteIndex === -1) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    const updatedNote: QuickNote = {
      ...data.notes[noteIndex],
      ...(project !== undefined && { project }),
      ...(text !== undefined && { text: text.trim() }),
      updatedAt: new Date().toISOString(),
    }

    data.notes[noteIndex] = updatedNote
    writeNotes(data)

    return NextResponse.json({ note: updatedNote })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update note"
    console.error("Error updating note:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE - remove a note
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    const data = readNotes()
    const noteIndex = data.notes.findIndex((n) => n.id === id)

    if (noteIndex === -1) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    data.notes.splice(noteIndex, 1)
    writeNotes(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete note"
    console.error("Error deleting note:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
