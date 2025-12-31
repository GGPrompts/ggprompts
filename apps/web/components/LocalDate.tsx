'use client'

import { useEffect, useState } from 'react'

interface LocalDateProps {
  dateString: string
  className?: string
}

export function LocalDate({ dateString, className }: LocalDateProps) {
  const [formatted, setFormatted] = useState<string>('')

  useEffect(() => {
    const date = new Date(dateString)
    setFormatted(
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    )
  }, [dateString])

  // Show nothing during SSR to avoid hydration mismatch
  if (!formatted) {
    return <span className={className}>...</span>
  }

  return <span className={className}>{formatted}</span>
}
