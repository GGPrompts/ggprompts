import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Simple ZIP file generation without external libraries
// Uses raw ZIP format specification

function createZipEntry(filename: string, content: string): { header: Uint8Array; data: Uint8Array; centralHeader: Uint8Array; offset: number } {
  const encoder = new TextEncoder()
  const filenameBytes = encoder.encode(filename)
  const contentBytes = encoder.encode(content)

  const crc32 = calculateCRC32(contentBytes)
  const date = new Date()
  const dosTime = ((date.getSeconds() >> 1) | (date.getMinutes() << 5) | (date.getHours() << 11)) & 0xFFFF
  const dosDate = ((date.getDate()) | ((date.getMonth() + 1) << 5) | ((date.getFullYear() - 1980) << 9)) & 0xFFFF

  // Local file header
  const header = new Uint8Array(30 + filenameBytes.length)
  const headerView = new DataView(header.buffer)

  headerView.setUint32(0, 0x04034b50, true) // Local file header signature
  headerView.setUint16(4, 20, true) // Version needed
  headerView.setUint16(6, 0, true) // General purpose bit flag
  headerView.setUint16(8, 0, true) // Compression method (stored)
  headerView.setUint16(10, dosTime, true) // Last mod time
  headerView.setUint16(12, dosDate, true) // Last mod date
  headerView.setUint32(14, crc32, true) // CRC-32
  headerView.setUint32(18, contentBytes.length, true) // Compressed size
  headerView.setUint32(22, contentBytes.length, true) // Uncompressed size
  headerView.setUint16(26, filenameBytes.length, true) // Filename length
  headerView.setUint16(28, 0, true) // Extra field length

  header.set(filenameBytes, 30)

  // Central directory header
  const centralHeader = new Uint8Array(46 + filenameBytes.length)
  const centralView = new DataView(centralHeader.buffer)

  centralView.setUint32(0, 0x02014b50, true) // Central directory header signature
  centralView.setUint16(4, 20, true) // Version made by
  centralView.setUint16(6, 20, true) // Version needed
  centralView.setUint16(8, 0, true) // General purpose bit flag
  centralView.setUint16(10, 0, true) // Compression method
  centralView.setUint16(12, dosTime, true) // Last mod time
  centralView.setUint16(14, dosDate, true) // Last mod date
  centralView.setUint32(16, crc32, true) // CRC-32
  centralView.setUint32(20, contentBytes.length, true) // Compressed size
  centralView.setUint32(24, contentBytes.length, true) // Uncompressed size
  centralView.setUint16(28, filenameBytes.length, true) // Filename length
  centralView.setUint16(30, 0, true) // Extra field length
  centralView.setUint16(32, 0, true) // Comment length
  centralView.setUint16(34, 0, true) // Disk number start
  centralView.setUint16(36, 0, true) // Internal file attributes
  centralView.setUint32(38, 0, true) // External file attributes
  // Offset will be set later
  centralView.setUint32(42, 0, true)

  centralHeader.set(filenameBytes, 46)

  return {
    header,
    data: contentBytes,
    centralHeader,
    offset: 0
  }
}

function calculateCRC32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF
  const table = getCRC32Table()

  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF]
  }

  return (crc ^ 0xFFFFFFFF) >>> 0
}

let crc32Table: Uint32Array | null = null

function getCRC32Table(): Uint32Array {
  if (crc32Table) return crc32Table

  crc32Table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    crc32Table[i] = c
  }
  return crc32Table
}

function createZipFile(entries: Array<{ path: string; content: string }>): Uint8Array {
  const zipEntries = entries.map(e => createZipEntry(e.path, e.content))

  // Calculate total size
  let localOffset = 0
  for (const entry of zipEntries) {
    entry.offset = localOffset
    const centralView = new DataView(entry.centralHeader.buffer)
    centralView.setUint32(42, localOffset, true)
    localOffset += entry.header.length + entry.data.length
  }

  const centralDirectoryStart = localOffset
  let centralDirectorySize = 0
  for (const entry of zipEntries) {
    centralDirectorySize += entry.centralHeader.length
  }

  // End of central directory record
  const eocd = new Uint8Array(22)
  const eocdView = new DataView(eocd.buffer)
  eocdView.setUint32(0, 0x06054b50, true) // EOCD signature
  eocdView.setUint16(4, 0, true) // Disk number
  eocdView.setUint16(6, 0, true) // Disk with central directory
  eocdView.setUint16(8, zipEntries.length, true) // Number of entries on disk
  eocdView.setUint16(10, zipEntries.length, true) // Total entries
  eocdView.setUint32(12, centralDirectorySize, true) // Central directory size
  eocdView.setUint32(16, centralDirectoryStart, true) // Central directory offset
  eocdView.setUint16(20, 0, true) // Comment length

  // Combine all parts
  const totalSize = localOffset + centralDirectorySize + 22
  const result = new Uint8Array(totalSize)
  let pos = 0

  for (const entry of zipEntries) {
    result.set(entry.header, pos)
    pos += entry.header.length
    result.set(entry.data, pos)
    pos += entry.data.length
  }

  for (const entry of zipEntries) {
    result.set(entry.centralHeader, pos)
    pos += entry.centralHeader.length
  }

  result.set(eocd, pos)

  return result
}

export async function GET() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch user's enabled toolkit components
  const { data: toolkitItems, error } = await supabase
    .from('user_toolkit')
    .select(`
      component_id,
      enabled,
      components (
        type,
        slug,
        name,
        description,
        files
      )
    `)
    .eq('user_id', user.id)
    .eq('enabled', true)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch toolkit' }, { status: 500 })
  }

  if (!toolkitItems || toolkitItems.length === 0) {
    return NextResponse.json({ error: 'No enabled components in toolkit' }, { status: 400 })
  }

  // Build file entries for ZIP
  const entries: Array<{ path: string; content: string }> = []

  // Add a README
  const readme = `# My Claude Code Toolkit

Downloaded from GGPrompts.com on ${new Date().toISOString().split('T')[0]}

## Contents

${toolkitItems.map(item => {
  const component = item.components as unknown as { type: string; slug: string; name: string; description: string | null }
  return `- **${component.name}** (${component.type}): ${component.description || 'No description'}`
}).join('\n')}

## Installation

1. Copy the \`.claude\` folder to your home directory or project root
2. Restart Claude Code to load the plugins

For more skills and commands, visit https://ggprompts.com/claude-code
`

  entries.push({ path: 'README.md', content: readme })

  // Add each component's files
  for (const item of toolkitItems) {
    const component = item.components as unknown as {
      type: string
      slug: string
      name: string
      files: Array<{ path: string; content: string }>
    }

    const typeFolder = component.type === 'skill' ? 'skills' :
                       component.type === 'command' ? 'commands' :
                       component.type === 'agent' ? 'agents' :
                       component.type === 'hook' ? 'hooks' :
                       component.type === 'mcp' ? 'mcps' : 'other'

    // Add header to each file
    const header = `---
# Managed by GGPrompts - https://ggprompts.com/claude-code
# Component: ${component.name}
# Type: ${component.type}
# Downloaded: ${new Date().toISOString()}
---

`

    if (Array.isArray(component.files) && component.files.length > 0) {
      for (const file of component.files) {
        const basePath = `.claude/${typeFolder}/${component.slug}`
        const fullPath = file.path.startsWith('/') ?
          `${basePath}${file.path}` :
          `${basePath}/${file.path}`

        entries.push({
          path: fullPath,
          content: header + file.content
        })
      }
    } else {
      // Create a default file if no files exist
      const defaultPath = `.claude/${typeFolder}/${component.slug}/${component.type === 'command' ? `${component.slug}.md` : 'SKILL.md'}`
      entries.push({
        path: defaultPath,
        content: header + `# ${component.name}\n\nNo content available.`
      })
    }
  }

  // Generate ZIP
  const zipBuffer = createZipFile(entries)

  // Return as downloadable file
  return new NextResponse(Buffer.from(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="claude-code-toolkit-${new Date().toISOString().split('T')[0]}.zip"`,
      'Content-Length': zipBuffer.length.toString()
    }
  })
}
