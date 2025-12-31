import Link from 'next/link'
import {
  Terminal,
  ArrowRight,
  Copy,
  Zap,
  Layout,
  MousePointer,
  Github,
  ExternalLink,
  Chrome,
  Check,
  Sparkles,
} from 'lucide-react'
import { Badge, Button } from '@ggprompts/ui'
import { TabzChromeStatus } from './TabzChromeStatus'

const features = [
  {
    icon: Terminal,
    title: 'AI Terminal Sidebar',
    description:
      'Chrome sidebar with multiple terminal sessions. Run Claude, Codex, or any CLI tool directly in your browser.',
  },
  {
    icon: MousePointer,
    title: 'One-Click Prompts',
    description:
      'Send prompts from GGPrompts directly to your terminal. No more copy-paste - just click and run.',
  },
  {
    icon: Layout,
    title: 'Session Management',
    description:
      'Name, organize, and switch between terminal sessions. Perfect for multi-project workflows.',
  },
  {
    icon: Zap,
    title: 'YOLO Mode',
    description:
      'Run Claude with --dangerously-skip-permissions for rapid iteration. Toggle on/off per session.',
  },
]

const steps = [
  {
    step: 1,
    title: 'Install TabzChrome',
    description: 'Clone the repo and run the extension locally, or install from Chrome Web Store.',
    action: (
      <Button variant="outline" size="sm" asChild>
        <a
          href="https://github.com/GGPrompts/TabzChrome"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-4 w-4 mr-2" />
          View on GitHub
        </a>
      </Button>
    ),
  },
  {
    step: 2,
    title: 'Start the Backend',
    description:
      'Run the TabzChrome backend server. It spawns and manages your terminal sessions.',
    code: 'cd tabz-chrome && npm run server',
  },
  {
    step: 3,
    title: 'Open the Sidebar',
    description:
      'Click the TabzChrome extension icon to open the sidebar. Your terminals appear right next to any webpage.',
  },
  {
    step: 4,
    title: 'Send Prompts',
    description:
      'Browse GGPrompts and click "Send to Terminal" on any prompt. It opens in a new TabzChrome session.',
  },
]

export default function TabzChromePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
          <Chrome className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal Integration</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">TabzChrome Integration</h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Send prompts from GGPrompts directly to your terminal. One click opens an AI session with
          your prompt pre-loaded.
        </p>

        <TabzChromeStatus />

        <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
          <Button size="lg" asChild>
            <a
              href="https://github.com/GGPrompts/TabzChrome"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5 mr-2" />
              Get TabzChrome
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/prompts">
              <Sparkles className="h-5 w-5 mr-2" />
              Browse Prompts
            </Link>
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="glass border-border/50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-2 text-center">How It Works</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
          GGPrompts works perfectly standalone. TabzChrome is a power-user enhancement that removes
          the copy-paste step.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without TabzChrome */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Copy className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Without TabzChrome</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">1.</span>
                <span>Find a prompt on GGPrompts</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">2.</span>
                <span>Click Copy to copy to clipboard</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">3.</span>
                <span>Open your terminal</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">4.</span>
                <span>
                  Type <code className="font-mono bg-muted px-1 rounded">claude -p</code> and paste
                </span>
              </div>
            </div>
          </div>

          {/* With TabzChrome */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">With TabzChrome</h3>
              <Badge variant="secondary" className="text-xs">
                Faster
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-primary">1.</span>
                <span>Find a prompt on GGPrompts</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>
                  Click <strong>Send to Terminal</strong> - Done!
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              TabzChrome opens a new terminal session with Claude and your prompt, right in your
              browser sidebar.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">TabzChrome Features</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Steps */}
      <div className="glass border-border/50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Setup Guide</h2>

        <div className="space-y-6 max-w-2xl mx-auto">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold">
                {step.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                {step.code && (
                  <code className="block text-sm font-mono bg-muted/50 p-3 rounded-lg">
                    {step.code}
                  </code>
                )}
                {step.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Section */}
      <div className="glass border-border/50 rounded-2xl p-8 mb-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Try It Now</h2>
            <p className="text-muted-foreground mb-6">
              If you have TabzChrome running, you can test the integration right here. Click the
              button below to spawn a new terminal session.
            </p>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/prompts">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Browse Prompts
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                Look for the <Terminal className="h-4 w-4 inline" /> button
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 aspect-video rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Terminal className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Demo preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4">Resources</h2>
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <a
            href="https://github.com/GGPrompts/TabzChrome"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub Repository
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/GGPrompts/TabzChrome/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Report Issues
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
