"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Copy,
  Check,
  BookOpen,
  Code2,
  Replace,
  Star,
  Info,
  AlertCircle,
  CheckCircle,
  Sparkles,
  History,
  Download,
  Upload,
  Regex,
  FileText,
  Lightbulb,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Types
interface RegexMatch {
  fullMatch: string
  index: number
  groups: string[]
  namedGroups?: Record<string, string>
}

interface RegexPattern {
  name: string
  pattern: string
  description: string
  category: string
  flags?: string
}

// Common regex patterns library
const PATTERN_LIBRARY: RegexPattern[] = [
  {
    name: "Email Address",
    pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
    description: "Validates standard email addresses",
    category: "Validation",
    flags: "i",
  },
  {
    name: "URL",
    pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    description: "Matches HTTP and HTTPS URLs",
    category: "Validation",
  },
  {
    name: "Phone Number (US)",
    pattern: "^(\\+1)?[-.]?\\(?([0-9]{3})\\)?[-.]?([0-9]{3})[-.]?([0-9]{4})$",
    description: "US phone numbers with various formats",
    category: "Validation",
  },
  {
    name: "Date (YYYY-MM-DD)",
    pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
    description: "ISO 8601 date format",
    category: "Date/Time",
  },
  {
    name: "Date (MM/DD/YYYY)",
    pattern: "^(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}$",
    description: "US date format",
    category: "Date/Time",
  },
  {
    name: "Credit Card",
    pattern: "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$",
    description: "Visa, MasterCard, and Amex",
    category: "Finance",
  },
  {
    name: "IPv4 Address",
    pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    description: "Standard IPv4 address",
    category: "Network",
  },
  {
    name: "IPv6 Address",
    pattern: "^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$",
    description: "Standard IPv6 address",
    category: "Network",
  },
  {
    name: "Hex Color",
    pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
    description: "Hex color codes (#RGB or #RRGGBB)",
    category: "Web",
  },
  {
    name: "Username",
    pattern: "^[a-zA-Z0-9_-]{3,16}$",
    description: "Alphanumeric username (3-16 chars)",
    category: "Validation",
  },
  {
    name: "Strong Password",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    description: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special",
    category: "Security",
  },
  {
    name: "HTML Tag",
    pattern: "<\\/?[\\w\\s]*>|<.+[\\W]>",
    description: "Matches HTML tags",
    category: "Web",
  },
]

// Sample test strings
const SAMPLE_STRINGS: Record<string, string> = {
  emails: `john.doe@example.com
jane_smith123@test.co.uk
admin@subdomain.example.org
invalid@email
user+tag@domain.com
bad-email@
@nodomain.com`,

  urls: `https://www.example.com
http://subdomain.test.org/path?query=1
https://example.com:8080/api/v1/users
invalid://wrong
www.missing-protocol.com
https://valid.site/path#anchor`,

  phones: `+1 (555) 123-4567
555-123-4567
5551234567
+15551234567
(555) 123 4567
555.123.4567
invalid-phone`,

  dates: `2024-01-15
2024-12-31
2024-02-30
01/15/2024
12/31/2024
13/45/2024
2024-1-5`,

  ips: `192.168.1.1
10.0.0.255
172.16.0.1
256.1.1.1
192.168.1
127.0.0.1`,

  mixed: `Contact us at support@example.com or visit https://example.com
Call +1-555-123-4567 for assistance
Server IP: 192.168.1.100
Valid until: 2024-12-31
Color: #FF5733`,
}

export default function RegexTester() {
  // State
  const [pattern, setPattern] = useState("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
  const [testString, setTestString] = useState(SAMPLE_STRINGS.emails)
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
  })
  const [replaceMode, setReplaceMode] = useState(false)
  const [replaceString, setReplaceString] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [codeLanguage, setCodeLanguage] = useState("javascript")
  const [history, setHistory] = useState<string[]>([])
  const [showExplanation, setShowExplanation] = useState(false)

  // Calculate matches
  const { matches, error, replaced } = useMemo(() => {
    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join("")

      const regex = new RegExp(pattern, flagString)
      const matchResults: RegexMatch[] = []

      if (flags.g) {
        // Global flag - find all matches
        let match
        while ((match = regex.exec(testString)) !== null) {
          matchResults.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          })
          // Prevent infinite loop on zero-width matches
          if (match.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        // Single match
        const match = regex.exec(testString)
        if (match) {
          matchResults.push({
            fullMatch: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          })
        }
      }

      // Calculate replacement
      let replacedText = ""
      if (replaceMode && replaceString) {
        replacedText = testString.replace(regex, replaceString)
      }

      return { matches: matchResults, error: null, replaced: replacedText }
    } catch (e) {
      return { matches: [], error: (e as Error).message, replaced: "" }
    }
  }, [pattern, testString, flags, replaceMode, replaceString])

  // Save to history
  useEffect(() => {
    if (pattern && !error) {
      setHistory(prev => {
        const newHistory = [pattern, ...prev.filter(p => p !== pattern)]
        return newHistory.slice(0, 20)
      })
    }
  }, [pattern, error])

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Load pattern from library
  const loadPattern = (libPattern: RegexPattern) => {
    setPattern(libPattern.pattern)
    if (libPattern.flags) {
      const newFlags = { g: false, i: false, m: false, s: false, u: false }
      libPattern.flags.split("").forEach(flag => {
        if (flag in newFlags) newFlags[flag as keyof typeof newFlags] = true
      })
      setFlags(newFlags)
    }
  }

  // Load sample string
  const loadSample = (key: string) => {
    setTestString(SAMPLE_STRINGS[key as keyof typeof SAMPLE_STRINGS] || "")
  }

  // Generate code
  const generateCode = (lang: string): string => {
    const flagString = Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag]) => flag)
      .join("")

    if (lang === "javascript") {
      return `const regex = /${pattern}/${flagString}
const text = ${JSON.stringify(testString)}

// Test if pattern matches
const isMatch = regex.test(text)

// Get all matches
const matches = text.match(regex)
console.log(matches)

// Find and replace
const replaced = text.replace(regex, '${replaceString}')`
    }

    if (lang === "python") {
      const pythonFlags = []
      if (flags.i) pythonFlags.push("re.IGNORECASE")
      if (flags.m) pythonFlags.push("re.MULTILINE")
      if (flags.s) pythonFlags.push("re.DOTALL")

      return `import re

pattern = r'${pattern}'${pythonFlags.length > 0 ? `\nflags = ${pythonFlags.join(" | ")}` : ""}
text = """${testString}"""

# Test if pattern matches
is_match = re.search(pattern, text${pythonFlags.length > 0 ? ", flags" : ""})

# Find all matches
matches = re.findall(pattern, text${pythonFlags.length > 0 ? ", flags" : ""})
print(matches)

# Find and replace
replaced = re.sub(pattern, '${replaceString}', text${pythonFlags.length > 0 ? ", flags" : ""})`
    }

    if (lang === "java") {
      return `import java.util.regex.*;

String pattern = "${pattern}";
String text = "${testString.replace(/\n/g, "\\n")}";

Pattern p = Pattern.compile(pattern${flags.i ? ", Pattern.CASE_INSENSITIVE" : ""});
Matcher m = p.matcher(text);

// Find all matches
while (m.find()) {
    System.out.println(m.group());
}

// Find and replace
String replaced = m.replaceAll("${replaceString}");`
    }

    return "// Select a language"
  }

  // Explain pattern (simplified)
  const explainPattern = (): string[] => {
    const explanations: string[] = []

    if (pattern.startsWith("^")) explanations.push("^ - Start of string/line")
    if (pattern.endsWith("$")) explanations.push("$ - End of string/line")
    if (pattern.includes("\\d")) explanations.push("\\d - Any digit (0-9)")
    if (pattern.includes("\\w")) explanations.push("\\w - Any word character (a-z, A-Z, 0-9, _)")
    if (pattern.includes("\\s")) explanations.push("\\s - Any whitespace character")
    if (pattern.includes("\\b")) explanations.push("\\b - Word boundary")
    if (pattern.includes("+")) explanations.push("+ - One or more of the preceding")
    if (pattern.includes("*")) explanations.push("* - Zero or more of the preceding")
    if (pattern.includes("?")) explanations.push("? - Zero or one of the preceding")
    if (pattern.includes("[")) explanations.push("[...] - Character class/set")
    if (pattern.includes("(")) explanations.push("(...) - Capture group")
    if (pattern.includes("|")) explanations.push("| - Alternation (OR)")
    if (pattern.includes("{")) explanations.push("{n,m} - Quantifier (n to m repetitions)")

    return explanations
  }

  // Render highlighted test string
  const renderHighlightedText = () => {
    if (!testString) return null
    if (matches.length === 0) return <span>{testString}</span>

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    matches.forEach((match, i) => {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="text-slate-400">
            {testString.substring(lastIndex, match.index)}
          </span>
        )
      }

      // Match itself
      parts.push(
        <span
          key={`match-${i}`}
          className={`bg-primary/20 border-b-2 border-primary cursor-pointer hover:bg-primary/30 ${
            selectedMatch === i ? "bg-primary/40" : ""
          }`}
          onClick={() => setSelectedMatch(selectedMatch === i ? null : i)}
        >
          {match.fullMatch}
        </span>
      )

      lastIndex = match.index + match.fullMatch.length
    })

    // Remaining text
    if (lastIndex < testString.length) {
      parts.push(
        <span key="text-end" className="text-muted-foreground">
          {testString.substring(lastIndex)}
        </span>
      )
    }

    return <>{parts}</>
  }

  const categories = [...new Set(PATTERN_LIBRARY.map(p => p.category))]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Search className="w-12 h-12 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Regex Tester & Builder</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test, learn, and debug regular expressions with live feedback
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className={error ? "border-red-500/30 text-red-400" : "border-primary/30 text-primary"}>
              {error ? <AlertCircle className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
              {error ? "Invalid pattern" : `${matches.length} ${matches.length === 1 ? "match" : "matches"}`}
            </Badge>
            <Badge variant="outline" className="border-secondary/30 text-secondary">
              {Object.entries(flags).filter(([_, v]) => v).map(([k]) => k).join("").toUpperCase() || "No flags"}
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Pattern Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="glass border-white/10 p-4">
              <Tabs defaultValue="library">
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <TabsList className="grid w-max md:w-full grid-cols-2 mb-4">
                    <TabsTrigger value="library" className="text-xs sm:text-sm whitespace-nowrap">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Library
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-xs sm:text-sm whitespace-nowrap">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="library" className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Sample Test Strings</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(SAMPLE_STRINGS).map(key => (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => loadSample(key)}
                          className="text-xs capitalize"
                        >
                          {key}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {categories.map(category => (
                      <div key={category} className="space-y-1">
                        <h4 className="text-xs font-semibold text-primary mt-4 mb-2">
                          {category}
                        </h4>
                        {PATTERN_LIBRARY.filter(p => p.category === category).map(libPattern => (
                          <Button
                            key={libPattern.name}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => loadPattern(libPattern)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs truncate">{libPattern.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{libPattern.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-2 max-h-[600px] overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      No pattern history yet
                    </div>
                  ) : (
                    history.map((histPattern, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start font-mono text-xs h-auto py-2"
                        onClick={() => setPattern(histPattern)}
                      >
                        <span className="truncate">{histPattern}</span>
                      </Button>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Center & Right - Tester */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Pattern Input */}
            <Card className="glass border-white/10 p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Regular Expression</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExplanation(!showExplanation)}
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        {showExplanation ? "Hide" : "Explain"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pattern)}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-2xl">/</span>
                    <Input
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className={`flex-1 font-mono ${error ? "border-red-500/50" : ""}`}
                      placeholder="Enter regex pattern..."
                    />
                    <span className="text-primary text-2xl">/</span>
                    <div className="flex items-center gap-1">
                      {Object.entries(flags).map(([flag, enabled]) => (
                        <button
                          key={flag}
                          onClick={() => setFlags(prev => ({ ...prev, [flag]: !enabled }))}
                          className={`w-8 h-8 rounded border font-mono text-sm ${
                            enabled
                              ? "bg-primary/20 border-primary text-primary"
                              : "border-white/10 text-muted-foreground hover:border-white/20"
                          }`}
                        >
                          {flag}
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border border-secondary/20 rounded-lg p-3 bg-secondary/5"
                    >
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          {explainPattern().length > 0 ? (
                            explainPattern().map((exp, i) => (
                              <p key={i} className="text-xs text-secondary font-mono">
                                {exp}
                              </p>
                            ))
                          ) : (
                            <p className="text-xs text-secondary">
                              Pattern explanation will appear here
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Replace Mode */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={replaceMode} onCheckedChange={setReplaceMode} />
                    <Label>Replace Mode</Label>
                  </div>
                  {replaceMode && (
                    <Input
                      value={replaceString}
                      onChange={(e) => setReplaceString(e.target.value)}
                      placeholder="Replacement string..."
                      className="flex-1 font-mono text-sm"
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* Test String */}
            <Card className="glass border-white/10 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Test String</Label>
                  <Badge variant="outline">
                    {testString.length} characters
                  </Badge>
                </div>
                <Textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="font-mono text-sm h-32"
                  placeholder="Enter text to test against..."
                />
              </div>
            </Card>

            {/* Results */}
            <Card className="glass border-white/10 p-6">
              <Tabs defaultValue="matches">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="matches">
                      Matches ({matches.length})
                    </TabsTrigger>
                    {replaceMode && (
                      <TabsTrigger value="replaced">
                        <Replace className="w-4 h-4 mr-2" />
                        Replaced
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="code">
                      <Code2 className="w-4 h-4 mr-2" />
                      Code
                    </TabsTrigger>
                  </TabsList>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      matches.map(m => m.fullMatch).join("\n")
                    )}
                    disabled={matches.length === 0}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy All
                  </Button>
                </div>

                {/* Matches Tab */}
                <TabsContent value="matches" className="space-y-4">
                  {/* Highlighted Text */}
                  <div className="border border-white/10 rounded-lg p-4 bg-muted/50 min-h-32">
                    <div className="font-mono text-sm whitespace-pre-wrap">
                      {renderHighlightedText()}
                    </div>
                  </div>

                  {/* Match Details */}
                  {matches.length > 0 && (
                    <div className="space-y-2">
                      <Label>Match Details</Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {matches.map((match, i) => (
                          <div
                            key={i}
                            className={`border border-white/10 rounded-lg p-3 cursor-pointer transition-colors ${
                              selectedMatch === i ? "bg-primary/10 border-primary/30" : "hover:bg-white/5"
                            }`}
                            onClick={() => setSelectedMatch(selectedMatch === i ? null : i)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                Match {i + 1}
                              </Badge>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Index: {match.index}</span>
                                <span>•</span>
                                <span>Length: {match.fullMatch.length}</span>
                              </div>
                            </div>
                            <div className="font-mono text-sm text-primary mb-2">
                              {match.fullMatch}
                            </div>
                            {match.groups.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Capture Groups:</p>
                                {match.groups.map((group, gi) => (
                                  <div key={gi} className="flex items-center gap-2 text-xs">
                                    <Badge variant="outline" className="text-xs">
                                      ${gi + 1}
                                    </Badge>
                                    <span className="font-mono text-secondary">{group}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matches.length === 0 && !error && (
                    <div className="text-center text-muted-foreground py-12">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No matches found</p>
                      <p className="text-sm mt-1">Try a different pattern or test string</p>
                    </div>
                  )}
                </TabsContent>

                {/* Replaced Tab */}
                {replaceMode && (
                  <TabsContent value="replaced">
                    <div className="border border-white/10 rounded-lg p-4 bg-muted/50 min-h-32">
                      <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                        {replaced || testString}
                      </pre>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        {matches.length} replacement{matches.length !== 1 ? "s" : ""} made
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(replaced)}
                        disabled={!replaced}
                      >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy Result
                      </Button>
                    </div>
                  </TabsContent>
                )}

                {/* Code Tab */}
                <TabsContent value="code" className="space-y-4">
                  <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <pre className="bg-muted border border-white/10 rounded-lg p-4 overflow-x-auto">
                      <code className="text-primary text-sm font-mono">
                        {generateCode(codeLanguage)}
                      </code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generateCode(codeLanguage))}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
