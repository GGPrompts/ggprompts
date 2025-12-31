'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { BorderTrail } from '@/components/ui/border-trail';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import {
  Terminal,
  Code2,
  GitBranch,
  Cpu,
  Database,
  Zap,
  Package,
  Layers,
  Server,
  FileCode,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Download,
  Play,
  GitFork,
  Star,
  TrendingUp,
  Shield,
  Gauge,
  Activity
} from 'lucide-react';

// Mock data for demonstration
const projectData = {
  title: "Neural Terminal Engine",
  subtitle: "High-Performance TUI Framework with GPU Acceleration",
  description: "A next-generation terminal user interface framework that leverages WebGPU for hardware-accelerated rendering and achieves 120fps in complex terminal applications.",
  version: "2.3.1",
  license: "MIT",
  stars: 4523,
  forks: 342,

  techStack: {
    primary: ["Rust", "WebGPU", "TypeScript"],
    secondary: ["WebAssembly", "React", "Node.js"],
    tools: ["Cargo", "wasm-pack", "esbuild", "Docker"]
  },

  performance: {
    renderTime: 8.3,
    memoryUsage: 45,
    cpuUsage: 12,
    fps: 120,
    loadTime: 0.8,
    bundleSize: 284
  },

  benchmarks: [
    { name: "Render 10k items", value: 8.3, unit: "ms", baseline: 45, better: true },
    { name: "Scroll performance", value: 120, unit: "fps", baseline: 60, better: true },
    { name: "Memory footprint", value: 45, unit: "MB", baseline: 120, better: true },
    { name: "Initial load", value: 0.8, unit: "s", baseline: 2.1, better: true },
    { name: "Bundle size", value: 284, unit: "KB", baseline: 890, better: true },
    { name: "CPU usage idle", value: 0.2, unit: "%", baseline: 3.5, better: true }
  ],

  architecture: {
    layers: [
      { name: "Application Layer", description: "User applications and TUI components" },
      { name: "Framework API", description: "High-level abstractions and component library" },
      { name: "Rendering Engine", description: "WebGPU-accelerated rendering pipeline" },
      { name: "Event System", description: "Async event handling and state management" },
      { name: "Platform Abstraction", description: "Cross-platform terminal and input handling" }
    ]
  },

  apiEndpoints: [
    { method: "GET", path: "/api/render", description: "Retrieve current render state", status: "stable" },
    { method: "POST", path: "/api/update", description: "Push state updates", status: "stable" },
    { method: "WS", path: "/api/stream", description: "Real-time event stream", status: "beta" },
    { method: "GET", path: "/api/metrics", description: "Performance metrics", status: "stable" },
    { method: "POST", path: "/api/compile", description: "Compile TUI components", status: "experimental" }
  ],

  dependencies: {
    runtime: [
      { name: "tokio", version: "1.35.0", description: "Async runtime" },
      { name: "wgpu", version: "0.18.0", description: "WebGPU implementation" },
      { name: "crossterm", version: "0.27.0", description: "Cross-platform terminal control" }
    ],
    dev: [
      { name: "criterion", version: "0.5.1", description: "Benchmarking framework" },
      { name: "proptest", version: "1.4.0", description: "Property-based testing" }
    ]
  },

  codeExamples: {
    quickStart: `# Clone the repository
git clone https://github.com/yourusername/neural-terminal-engine
cd neural-terminal-engine

# Install Rust and dependencies
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install wasm-pack

# Build the project
cargo build --release

# Run the example
cargo run --example demo`,

    basicUsage: `use neural_terminal::{App, Component, render};

#[derive(Component)]
struct MyApp {
    counter: u32,
}

impl App for MyApp {
    fn update(&mut self, event: Event) -> Command {
        match event {
            Event::Key(KeyCode::Char('+'))) => {
                self.counter += 1;
                Command::Render
            }
            _ => Command::None
        }
    }

    fn view(&self) -> Element {
        div()
            .class("terminal-container")
            .child(
                text(format!("Counter: {}", self.counter))
                    .style(Style::Bold | Style::Cyan)
            )
    }
}

fn main() {
    render::<MyApp>()?;
}`,

    advancedFeature: `// GPU-accelerated particle system
use neural_terminal::gpu::{ParticleSystem, Shader};

let mut particles = ParticleSystem::new(10000);

particles.set_shader(Shader::load("shaders/plasma.wgsl")?);
particles.set_physics(PhysicsConfig {
    gravity: vec3(0.0, -9.8, 0.0),
    damping: 0.99,
    collision: true,
});

// Update loop runs at 120fps on GPU
app.add_system(move |ctx| {
    particles.update(ctx.delta_time());
    particles.render(ctx.framebuffer());
});`,

    testingExample: `#[cfg(test)]
mod tests {
    use super::*;
    use neural_terminal::test_utils::*;

    #[test]
    fn test_render_performance() {
        let mut app = TestApp::new();
        let start = Instant::now();

        // Render 10,000 items
        for i in 0..10000 {
            app.add_item(Item::new(i));
        }
        app.render();

        let elapsed = start.elapsed();
        assert!(elapsed.as_millis() < 10,
                "Rendering took {}ms, expected <10ms",
                elapsed.as_millis());
    }

    #[proptest]
    fn test_state_consistency(
        #[strategy(0..1000)] item_count: usize,
        #[strategy(any_events())] events: Vec<Event>
    ) {
        let mut app = create_app(item_count);
        for event in events {
            app.handle_event(event);
            prop_assert!(app.validate_state());
        }
    }
}`
  },

  optimization: {
    techniques: [
      {
        name: "Zero-copy rendering",
        description: "Direct GPU memory mapping eliminates data copies",
        impact: "+45% render performance"
      },
      {
        name: "Incremental computation",
        description: "Only recompute changed portions of the UI tree",
        impact: "-72% CPU usage"
      },
      {
        name: "SIMD text processing",
        description: "Vectorized UTF-8 processing using AVX2/NEON",
        impact: "+3x text throughput"
      },
      {
        name: "Async event batching",
        description: "Batch multiple events per frame for efficiency",
        impact: "-60% input latency"
      }
    ]
  }
};

export default function ProjectTechnicalPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>("all");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="min-h-screen relative">
      <SpaceBackground speed={0.3} opacity={0.8} />
      <ScrollProgress className="top-0 z-50" />

      {/* Navigation Header */}
      <div className="sticky top-0 z-40 w-full border-b border-border/40 glass-dark backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="#architecture" className="font-mono">
                  Architecture
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#performance" className="font-mono">
                  Performance
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#api" className="font-mono">
                  API
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#quickstart" className="font-mono">
                  Quick Start
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#code" className="font-mono">
                  Code
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#deployment" className="font-mono">
                  Deployment
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 glass rounded-lg border-glow">
              <Terminal className="h-8 w-8 text-primary" />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-mono">v{projectData.version}</Badge>
              <Badge className="font-mono">{projectData.license}</Badge>
              <Badge variant="secondary" className="font-mono">Production Ready</Badge>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-mono font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {projectData.title}
          </h1>

          <p className="text-xl text-foreground/80 mb-8 font-mono">
            {projectData.subtitle}
          </p>

          <p className="text-lg text-muted-foreground mb-8 max-w-4xl">
            {projectData.description}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-mono text-sm">{projectData.stars.toLocaleString()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>GitHub Stars</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                    <GitFork className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm">{projectData.forks}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Forks</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm">{projectData.performance.fps} FPS</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Maximum Frame Rate</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                    <Zap className="h-4 w-4 text-secondary" />
                    <span className="font-mono text-sm">{projectData.performance.renderTime}ms</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Render Time (10k items)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {/* Quick Start / Fork & Run Section */}
        <motion.section
          id="quickstart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="glass-dark border-glow overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-mono text-2xl">Fork & Run</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="font-mono">
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork
                  </Button>
                  <Button size="sm" className="font-mono">
                    <Download className="h-4 w-4 mr-2" />
                    Clone
                  </Button>
                </div>
              </div>
              <CardDescription>Get started in under 60 seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 bg-background/50 rounded-lg border border-border/50 overflow-x-auto">
                  <code className="text-sm font-mono text-primary">
                    {projectData.codeExamples.quickStart}
                  </code>
                </pre>
                <button
                  onClick={() => copyToClipboard(projectData.codeExamples.quickStart, 'quickstart')}
                  className="absolute top-2 right-2 p-2 glass rounded-lg hover:scale-110 transition-transform"
                >
                  {copiedCode === 'quickstart' ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Alert className="border-primary/50 bg-primary/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-mono">System Requirements</AlertTitle>
                  <AlertDescription>
                    Rust 1.75+, Node.js 18+, GPU with WebGPU support
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Architecture Section */}
        <motion.section
          id="architecture"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            System Architecture
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Architecture Layers */}
            <Card className="glass-dark border-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle className="font-mono">Architecture Layers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.architecture.layers.map((layer, index) => (
                    <motion.div
                      key={layer.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="p-4 glass rounded-lg hover:scale-[1.02] transition-transform">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-mono text-sm font-semibold text-primary">
                            {layer.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            Layer {projectData.architecture.layers.length - index}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {layer.description}
                        </p>
                      </div>
                      {index < projectData.architecture.layers.length - 1 && (
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 z-10">
                          <ArrowRight className="h-4 w-4 text-primary/50 rotate-90" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="glass-dark border-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="font-mono">Technology Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-mono text-sm text-primary mb-3">Core Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {projectData.techStack.primary.map(tech => (
                        <Badge key={tech} className="font-mono">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-mono text-sm text-secondary mb-3">Supporting Tech</h4>
                    <div className="flex flex-wrap gap-2">
                      {projectData.techStack.secondary.map(tech => (
                        <Badge key={tech} variant="secondary" className="font-mono">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-mono text-sm text-muted-foreground mb-3">Build Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {projectData.techStack.tools.map(tool => (
                        <Badge key={tool} variant="outline" className="font-mono">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Performance Section */}
        <motion.section
          id="performance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Performance Metrics
          </h2>

          {/* Performance Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-dark border-glow relative overflow-hidden">
              <BorderTrail />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-lg">Render Speed</CardTitle>
                  <Activity className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-mono font-bold text-primary">
                    {projectData.performance.fps} FPS
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">Maximum achievable</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-glow relative overflow-hidden">
              <BorderTrail />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-lg">Memory Usage</CardTitle>
                  <Database className="h-5 w-5 text-secondary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-mono font-bold text-secondary">
                    {projectData.performance.memoryUsage} MB
                  </div>
                  <Progress value={projectData.performance.memoryUsage} className="h-2" />
                  <p className="text-xs text-muted-foreground">Average runtime</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-glow relative overflow-hidden">
              <BorderTrail />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-lg">Bundle Size</CardTitle>
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-mono font-bold text-primary">
                    {projectData.performance.bundleSize} KB
                  </div>
                  <Progress value={30} className="h-2" />
                  <p className="text-xs text-muted-foreground">Gzipped</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benchmarks Table */}
          <Card className="glass-dark border-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="font-mono">Benchmark Results</CardTitle>
                </div>
                <ToggleGroup
                  type="single"
                  value={selectedBenchmark}
                  onValueChange={setSelectedBenchmark}
                >
                  <ToggleGroupItem value="all" className="font-mono text-xs">All</ToggleGroupItem>
                  <ToggleGroupItem value="better" className="font-mono text-xs">Improvements</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono">Metric</TableHead>
                    <TableHead className="font-mono text-right">Value</TableHead>
                    <TableHead className="font-mono text-right">Baseline</TableHead>
                    <TableHead className="font-mono text-right">Improvement</TableHead>
                    <TableHead className="font-mono">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectData.benchmarks
                    .filter(b => selectedBenchmark === 'all' || b.better)
                    .map((benchmark) => {
                      const improvement = Math.round(((benchmark.baseline - benchmark.value) / benchmark.baseline) * 100);
                      return (
                        <TableRow key={benchmark.name}>
                          <TableCell className="font-mono">{benchmark.name}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-primary">
                            {benchmark.value} {benchmark.unit}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {benchmark.baseline} {benchmark.unit}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {benchmark.better ? (
                              <span className="text-primary">
                                {improvement > 0 ? `+${improvement}%` : `${Math.abs(improvement)}%`}
                              </span>
                            ) : (
                              <span className="text-red-500">-{improvement}%</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {benchmark.better ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.section>

        {/* API Documentation */}
        <motion.section
          id="api"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            API Documentation
          </h2>

          <Card className="glass-dark border-glow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle className="font-mono">REST & WebSocket Endpoints</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectData.apiEndpoints.map((endpoint) => (
                  <div key={endpoint.path} className="p-4 glass rounded-lg hover:scale-[1.01] transition-transform">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'secondary' : 'outline'}
                          className="font-mono"
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono text-primary">
                          {endpoint.path}
                        </code>
                      </div>
                      <Badge
                        variant={endpoint.status === 'stable' ? 'default' : endpoint.status === 'beta' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {endpoint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {endpoint.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Code Examples */}
        <motion.section
          id="code"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Code Examples
          </h2>

          <Tabs defaultValue="basic" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
              <TabsList className="grid w-max md:w-auto grid-cols-3">
                <TabsTrigger value="basic" className="font-mono text-xs sm:text-sm whitespace-nowrap">Basic Usage</TabsTrigger>
                <TabsTrigger value="advanced" className="font-mono text-xs sm:text-sm whitespace-nowrap">Advanced</TabsTrigger>
                <TabsTrigger value="testing" className="font-mono text-xs sm:text-sm whitespace-nowrap">Testing</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic">
              <Card className="glass-dark border-glow">
                <CardHeader>
                  <CardTitle className="font-mono">Basic Component Setup</CardTitle>
                  <CardDescription>Simple counter application with event handling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <ScrollArea className="h-96 w-full rounded-lg">
                      <pre className="p-4 bg-background/50 rounded-lg border border-border/50">
                        <code className="text-sm font-mono text-primary">
                          {projectData.codeExamples.basicUsage}
                        </code>
                      </pre>
                    </ScrollArea>
                    <button
                      onClick={() => copyToClipboard(projectData.codeExamples.basicUsage, 'basic')}
                      className="absolute top-2 right-2 p-2 glass rounded-lg hover:scale-110 transition-transform"
                    >
                      {copiedCode === 'basic' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="glass-dark border-glow">
                <CardHeader>
                  <CardTitle className="font-mono">GPU-Accelerated Rendering</CardTitle>
                  <CardDescription>WebGPU particle system with physics simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <ScrollArea className="h-96 w-full rounded-lg">
                      <pre className="p-4 bg-background/50 rounded-lg border border-border/50">
                        <code className="text-sm font-mono text-primary">
                          {projectData.codeExamples.advancedFeature}
                        </code>
                      </pre>
                    </ScrollArea>
                    <button
                      onClick={() => copyToClipboard(projectData.codeExamples.advancedFeature, 'advanced')}
                      className="absolute top-2 right-2 p-2 glass rounded-lg hover:scale-110 transition-transform"
                    >
                      {copiedCode === 'advanced' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing">
              <Card className="glass-dark border-glow">
                <CardHeader>
                  <CardTitle className="font-mono">Testing & Benchmarks</CardTitle>
                  <CardDescription>Property-based testing and performance benchmarks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <ScrollArea className="h-96 w-full rounded-lg">
                      <pre className="p-4 bg-background/50 rounded-lg border border-border/50">
                        <code className="text-sm font-mono text-primary">
                          {projectData.codeExamples.testingExample}
                        </code>
                      </pre>
                    </ScrollArea>
                    <button
                      onClick={() => copyToClipboard(projectData.codeExamples.testingExample, 'testing')}
                      className="absolute top-2 right-2 p-2 glass rounded-lg hover:scale-110 transition-transform"
                    >
                      {copiedCode === 'testing' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Technical Decisions */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Technical Decisions & Trade-offs
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="webgpu" className="glass-dark rounded-lg border-glow">
              <AccordionTrigger className="font-mono px-6 hover:no-underline">
                Why WebGPU over WebGL?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    WebGPU provides significant performance improvements and modern GPU features that are essential for our rendering pipeline:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Compute shaders for parallel text processing</li>
                    <li>Better multi-threading support with Web Workers</li>
                    <li>Lower CPU overhead with command buffers</li>
                    <li>Native support for indirect drawing</li>
                  </ul>
                  <Alert className="border-primary/50 bg-primary/5 mt-4">
                    <AlertTitle className="font-mono">Performance Impact</AlertTitle>
                    <AlertDescription>
                      WebGPU delivers 3-5x better performance for complex UI rendering compared to WebGL 2.0
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rust" className="glass-dark rounded-lg border-glow">
              <AccordionTrigger className="font-mono px-6 hover:no-underline">
                Rust + WASM Architecture
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The core engine is written in Rust and compiled to WebAssembly for several reasons:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Memory safety without garbage collection overhead</li>
                    <li>Predictable performance characteristics</li>
                    <li>Easy integration with native GPU APIs</li>
                    <li>Smaller bundle sizes compared to JavaScript engines</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="async" className="glass-dark rounded-lg border-glow">
              <AccordionTrigger className="font-mono px-6 hover:no-underline">
                Async Event System Design
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Our event system uses Tokio for async runtime management, enabling:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Non-blocking I/O for terminal operations</li>
                    <li>Efficient event batching and coalescing</li>
                    <li>Concurrent state updates without locks</li>
                    <li>Smooth 120fps rendering without frame drops</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>

        {/* Dependencies & Requirements */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Dependencies & Requirements
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="glass-dark border-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="font-mono">Runtime Dependencies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.dependencies.runtime.map(dep => (
                    <div key={dep.name} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <span className="font-mono text-sm font-semibold text-primary">{dep.name}</span>
                        <p className="text-xs text-muted-foreground">{dep.description}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {dep.version}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-secondary" />
                  <CardTitle className="font-mono">Dev Dependencies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectData.dependencies.dev.map(dep => (
                    <div key={dep.name} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <span className="font-mono text-sm font-semibold text-secondary">{dep.name}</span>
                        <p className="text-xs text-muted-foreground">{dep.description}</p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {dep.version}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Performance Optimizations */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Performance Optimizations
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {projectData.optimization.techniques.map((technique, index) => (
              <motion.div
                key={technique.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-dark border-glow h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-mono text-lg">{technique.name}</CardTitle>
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {technique.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-mono text-primary">
                        {technique.impact}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Deployment Section */}
        <motion.section
          id="deployment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-mono font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Build & Deployment
          </h2>

          <Card className="glass-dark border-glow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-primary" />
                <CardTitle className="font-mono">Production Build Instructions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="docker" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="docker" className="font-mono">Docker</TabsTrigger>
                  <TabsTrigger value="binary" className="font-mono">Binary</TabsTrigger>
                  <TabsTrigger value="source" className="font-mono">From Source</TabsTrigger>
                </TabsList>

                <TabsContent value="docker">
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <code className="text-sm font-mono text-primary">
                        {`# Build Docker image
docker build -t neural-terminal:latest .

# Run container with GPU support
docker run --gpus all -p 8080:8080 neural-terminal:latest

# Or use docker-compose
docker-compose up -d`}
                      </code>
                    </div>
                    <Alert className="border-secondary/50 bg-secondary/5">
                      <AlertTitle className="font-mono">GPU Support</AlertTitle>
                      <AlertDescription>
                        Requires NVIDIA Container Toolkit for GPU acceleration
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                <TabsContent value="binary">
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <code className="text-sm font-mono text-primary">
                        {`# Download latest release
curl -L https://github.com/user/neural-terminal/releases/latest/download/neural-terminal-linux-x64.tar.gz | tar xz

# Run the binary
./neural-terminal --port 8080 --gpu-enabled`}
                      </code>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="source">
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                      <code className="text-sm font-mono text-primary">
                        {`# Build from source with optimizations
cargo build --release --features gpu,simd

# Run with production config
RUST_LOG=info ./target/release/neural-terminal`}
                      </code>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Alert className="border-primary/50 bg-primary/5">
                  <Gauge className="h-4 w-4" />
                  <AlertTitle className="font-mono">Monitoring</AlertTitle>
                  <AlertDescription>
                    Prometheus metrics available at /metrics
                  </AlertDescription>
                </Alert>

                <Alert className="border-secondary/50 bg-secondary/5">
                  <Shield className="h-4 w-4" />
                  <AlertTitle className="font-mono">Security</AlertTitle>
                  <AlertDescription>
                    TLS 1.3 enabled by default
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button size="lg" className="font-mono">
            <GitBranch className="h-5 w-5 mr-2" />
            View on GitHub
          </Button>
          <Button size="lg" variant="outline" className="font-mono">
            <FileCode className="h-5 w-5 mr-2" />
            API Reference
          </Button>
          <Button size="lg" variant="outline" className="font-mono">
            <ExternalLink className="h-5 w-5 mr-2" />
            Live Demo
          </Button>
        </motion.div>
      </div>
    </main>
  );
}