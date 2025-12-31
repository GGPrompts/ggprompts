"use client"

import * as React from "react"
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: unknown
  className?: string
  defaultExpanded?: boolean
  expandDepth?: number
}

interface JsonNodeProps {
  keyName?: string
  value: unknown
  depth: number
  expandDepth: number
  isLast: boolean
}

// Determine the type of a JSON value
function getValueType(value: unknown): "string" | "number" | "boolean" | "null" | "array" | "object" {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  return typeof value as "string" | "number" | "boolean" | "object"
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
      title="Copy JSON"
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )
}

// Collapsible wrapper for objects and arrays
function CollapsibleNode({
  keyName,
  value,
  depth,
  expandDepth,
  isLast,
  type,
}: JsonNodeProps & { type: "array" | "object" }) {
  const [expanded, setExpanded] = React.useState(depth < expandDepth)
  const isArray = type === "array"
  const items = isArray ? (value as unknown[]) : Object.entries(value as Record<string, unknown>)
  const isEmpty = items.length === 0
  const bracketOpen = isArray ? "[" : "{"
  const bracketClose = isArray ? "]" : "}"

  // Empty object/array
  if (isEmpty) {
    return (
      <div className="flex items-center">
        {keyName !== undefined && (
          <>
            <span className="json-key">{`"${keyName}"`}</span>
            <span className="json-punctuation">: </span>
          </>
        )}
        <span className="json-bracket">{bracketOpen}{bracketClose}</span>
        {!isLast && <span className="json-punctuation">,</span>}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center hover:bg-primary/10 rounded -ml-5 pl-1 pr-1"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {keyName !== undefined && (
          <>
            <span className="json-key">{`"${keyName}"`}</span>
            <span className="json-punctuation">: </span>
          </>
        )}
        <span className="json-bracket">{bracketOpen}</span>
        {!expanded && (
          <>
            <span className="json-collapsed text-muted-foreground text-xs mx-1">
              {isArray ? `${items.length} items` : `${items.length} keys`}
            </span>
            <span className="json-bracket">{bracketClose}</span>
            {!isLast && <span className="json-punctuation">,</span>}
          </>
        )}
      </div>
      {expanded && (
        <>
          <div className="ml-5 border-l border-border/30 pl-3">
            {isArray
              ? (items as unknown[]).map((item, index) => (
                  <JsonNode
                    key={index}
                    value={item}
                    depth={depth + 1}
                    expandDepth={expandDepth}
                    isLast={index === items.length - 1}
                  />
                ))
              : (items as [string, unknown][]).map(([key, val], index) => (
                  <JsonNode
                    key={key}
                    keyName={key}
                    value={val}
                    depth={depth + 1}
                    expandDepth={expandDepth}
                    isLast={index === items.length - 1}
                  />
                ))}
          </div>
          <div className="flex">
            <span className="json-bracket">{bracketClose}</span>
            {!isLast && <span className="json-punctuation">,</span>}
          </div>
        </>
      )}
    </div>
  )
}

// Render a single JSON node
function JsonNode({ keyName, value, depth, expandDepth, isLast }: JsonNodeProps) {
  const type = getValueType(value)

  // Handle objects and arrays
  if (type === "object" || type === "array") {
    return (
      <CollapsibleNode
        keyName={keyName}
        value={value}
        depth={depth}
        expandDepth={expandDepth}
        isLast={isLast}
        type={type}
      />
    )
  }

  // Render primitive values
  const renderValue = () => {
    switch (type) {
      case "string":
        return <span className="json-string">{`"${value}"`}</span>
      case "number":
        return <span className="json-number">{String(value)}</span>
      case "boolean":
        return <span className="json-boolean">{String(value)}</span>
      case "null":
        return <span className="json-null">null</span>
      default:
        return <span>{String(value)}</span>
    }
  }

  return (
    <div className="flex items-center flex-wrap">
      {keyName !== undefined && (
        <>
          <span className="json-key">{`"${keyName}"`}</span>
          <span className="json-punctuation">: </span>
        </>
      )}
      {renderValue()}
      {!isLast && <span className="json-punctuation">,</span>}
    </div>
  )
}

// Main component
export function JsonViewer({ data, className, defaultExpanded = true, expandDepth = 2 }: JsonViewerProps) {
  // Try to parse if string
  const parsedData = React.useMemo(() => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data)
      } catch {
        return data
      }
    }
    return data
  }, [data])

  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(parsedData, null, 2)
    } catch {
      return String(data)
    }
  }, [parsedData, data])

  // If it's just a string that couldn't be parsed, show it as-is
  if (typeof parsedData === "string") {
    return (
      <div className={cn("relative group", className)}>
        <CopyButton text={parsedData} />
        <pre className="json-viewer text-sm font-mono whitespace-pre-wrap break-words">
          {parsedData}
        </pre>
      </div>
    )
  }

  return (
    <div className={cn("relative group", className)}>
      <CopyButton text={jsonString} />
      <div className="json-viewer text-sm font-mono pl-5">
        <JsonNode
          value={parsedData}
          depth={0}
          expandDepth={defaultExpanded ? expandDepth : 0}
          isLast={true}
        />
      </div>
    </div>
  )
}
