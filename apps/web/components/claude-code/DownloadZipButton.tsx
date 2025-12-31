'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface DownloadZipButtonProps {
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function DownloadZipButton({
  size = 'default',
  variant = 'outline'
}: DownloadZipButtonProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)

    try {
      const response = await fetch('/claude-code/download-zip')

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `claude-code-toolkit-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setDownloaded(true)
      toast.success('Toolkit downloaded! Extract to use with Claude Code.')

      setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleDownload}
      disabled={downloading}
      className="gap-2"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : downloaded ? (
        <>
          <Check className="h-4 w-4" />
          Downloaded!
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download ZIP
        </>
      )}
    </Button>
  )
}
