'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BorderTrail } from '@/components/ui/border-trail';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { TextMorph } from '@/components/ui/text-morph';
import { GlowEffect } from '@/components/ui/glow-effect';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Kbd } from '@/components/ui/kbd';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

export default function StyleGuide() {
  return (
    <main className="min-h-screen py-20 px-4 relative">
      <ScrollProgress className="top-0 z-10" />

      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-50 w-full border-b border-border/40 glass-dark backdrop-blur-xl mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex-wrap gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-mono">Foundations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#typography" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Typography & Colors</div>
                          <p className="text-sm leading-snug text-muted-foreground">Fonts and color palette</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#utilities" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Utility Classes</div>
                          <p className="text-sm leading-snug text-muted-foreground">Custom terminal utilities</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-mono">Buttons & Forms</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#buttons" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Buttons & Badges</div>
                          <p className="text-sm leading-snug text-muted-foreground">All button variants and badges</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#forms" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Form Components</div>
                          <p className="text-sm leading-snug text-muted-foreground">Inputs, selects, checkboxes</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#toggles" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Toggle Components</div>
                          <p className="text-sm leading-snug text-muted-foreground">Toggles and toggle groups</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-mono">Layout</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#cards" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Cards & Containers</div>
                          <p className="text-sm leading-snug text-muted-foreground">Card variants and layouts</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#navigation" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Navigation Components</div>
                          <p className="text-sm leading-snug text-muted-foreground">Tabs, accordion, carousel</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-mono">Interactive</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#interactive" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Interactive Components</div>
                          <p className="text-sm leading-snug text-muted-foreground">Dialogs, drawers, tooltips</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#alerts" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Alerts & Notifications</div>
                          <p className="text-sm leading-snug text-muted-foreground">Alerts and alert dialogs</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#menus" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Menus & Commands</div>
                          <p className="text-sm leading-snug text-muted-foreground">Dropdowns and command palette</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-mono">Data & Media</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#data" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Data Display</div>
                          <p className="text-sm leading-snug text-muted-foreground">Tables, progress, spinners</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#media" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-mono font-medium leading-none">Media & UI Elements</div>
                          <p className="text-sm leading-snug text-muted-foreground">Avatar, keyboard shortcuts</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="#motion" className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-mono font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Motion
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-mono font-bold mb-4 gradient-text-theme">
            Style Guide
          </h1>
          <p className="text-xl text-foreground/80">
            Terminal-themed components for Matt's Portfolio
          </p>
        </div>

        {/* Typography & Colors */}
        <Section title="Typography & Colors" id="typography">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Font Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">JetBrains Mono (Headings)</p>
                  <h2 className="text-4xl font-mono font-bold">The Quick Brown Fox</h2>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Inter (Body)</p>
                  <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Color Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-primary border-2 border-primary/30 shadow-lg shadow-primary/20" />
                  <div>
                    <p className="font-mono text-sm">Primary</p>
                    <p className="text-xs text-muted-foreground">Theme accent color - var(--primary)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-secondary border-2 border-secondary/30 shadow-lg shadow-secondary/20" />
                  <div>
                    <p className="font-mono text-sm">Secondary</p>
                    <p className="text-xs text-muted-foreground">Complementary accent - var(--secondary)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-foreground border border-border" />
                  <div>
                    <p className="font-mono text-sm">Foreground</p>
                    <p className="text-xs text-muted-foreground">Text color - var(--foreground)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-muted border border-border" />
                  <div>
                    <p className="font-mono text-sm">Muted</p>
                    <p className="text-xs text-muted-foreground">Subtle backgrounds - var(--muted)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Buttons & Badges */}
        <Section title="Buttons & Badges" id="buttons">
          <Card className="border-glow">
            <CardHeader>
              <CardTitle className="font-mono">Button Variants</CardTitle>
              <CardDescription>All button styles with terminal theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-mono">Default</p>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-3 font-mono">Glassmorphic Buttons</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-6 py-3 glass rounded-lg hover:scale-105 transition-transform border-glow">
                    Glass Light
                  </button>
                  <button className="px-6 py-3 glass-dark rounded-lg hover:scale-105 transition-transform border-glow">
                    Glass Dark
                  </button>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-3 font-mono">Badge Variants</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge className="font-mono text-xs">Next.js</Badge>
                  <Badge className="font-mono text-xs" variant="secondary">TypeScript</Badge>
                  <Badge className="font-mono text-xs" variant="outline">React</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Cards & Containers */}
        <Section title="Cards & Containers" id="cards">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Standard Card</CardTitle>
                <CardDescription>Default shadcn card styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This uses the standard card component with terminal theme colors.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Action</Button>
              </CardFooter>
            </Card>

            <Card className="glass border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Glass Card</CardTitle>
                <CardDescription>Glassmorphic styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uses the .glass utility for frosted glass effect.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Action</Button>
              </CardFooter>
            </Card>

            <Card className="glass-dark border-glow relative overflow-hidden">
              <BorderTrail />
              <CardHeader>
                <CardTitle className="font-mono">Border Trail</CardTitle>
                <CardDescription>Animated border effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Motion primitive with animated border trail.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">Action</Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="border-glow mt-6">
            <CardHeader>
              <CardTitle className="font-mono">Skeleton Loading States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </Section>

        {/* Forms */}
        <Section title="Form Components" id="forms">
          <Card className="border-glow">
            <CardHeader>
              <CardTitle className="font-mono">Form Elements</CardTitle>
              <CardDescription>Inputs, textareas, checkboxes, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono">Email</Label>
                <Input id="email" type="email" placeholder="matt@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-mono">Message</Label>
                <Textarea id="message" placeholder="Type your message here..." />
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications" className="font-mono">Enable notifications</Label>
              </div>

              <Separator />

              <RadioGroup defaultValue="option1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1" className="font-mono">Option 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2" className="font-mono">Option 2</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit</Button>
            </CardFooter>
          </Card>
        </Section>

        {/* Navigation */}
        <Section title="Navigation Components" id="navigation">
          <Card className="border-glow">
            <CardHeader>
              <CardTitle className="font-mono">Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="font-mono">All</TabsTrigger>
                  <TabsTrigger value="web" className="font-mono">Web Apps</TabsTrigger>
                  <TabsTrigger value="tui" className="font-mono">TUI</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <p className="text-sm text-muted-foreground">All 45 projects displayed here</p>
                </TabsContent>
                <TabsContent value="web" className="space-y-4">
                  <p className="text-sm text-muted-foreground">6-7 Vercel-deployed web apps</p>
                </TabsContent>
                <TabsContent value="tui" className="space-y-4">
                  <p className="text-sm text-muted-foreground">Terminal User Interface projects</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-glow mt-6">
            <CardHeader>
              <CardTitle className="font-mono">Accordion</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-mono">What is this portfolio built with?</AccordionTrigger>
                  <AccordionContent>
                    Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and shadcn/ui components.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-mono">What are TUI projects?</AccordionTrigger>
                  <AccordionContent>
                    Terminal User Interface applications built with Bubbletea and Lipgloss in Go.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-mono">How many projects?</AccordionTrigger>
                  <AccordionContent>
                    45 projects built over 6 months with Claude's assistance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-glow mt-6">
            <CardHeader>
              <CardTitle className="font-mono">Carousel</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card className="border-glow">
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-mono font-semibold">
                              {index + 1}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          <Card className="border-glow mt-6">
            <CardHeader>
              <CardTitle className="font-mono">Scroll Area</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 w-full rounded-md border border-border p-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="py-2 font-mono text-sm">
                    Project {i + 1}: Terminal Chat Application
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </Section>

        {/* Interactive Components */}
        <Section title="Interactive Components" id="interactive">
          <Card className="border-glow">
            <CardHeader>
              <CardTitle className="font-mono">Dialogs & Overlays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent className="glass-overlay border-glow">
                    <DialogHeader>
                      <DialogTitle className="font-mono">Project Details</DialogTitle>
                      <DialogDescription>
                        View more information about this project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        This is a glassmorphic dialog with terminal theme styling.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button>View Live Demo</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full">Open Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent className="glass-overlay border-glow">
                    <DrawerHeader>
                      <DrawerTitle className="font-mono">Project Gallery</DrawerTitle>
                      <DrawerDescription>Browse through screenshots</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">Drawer content goes here</p>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="w-full">Hover for Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass-overlay border-glow">
                      <p className="font-mono">Tech Stack: Next.js</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline" className="w-full">Hover Card</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="glass-overlay border-glow w-80">
                    <div className="space-y-2">
                      <h4 className="font-mono font-semibold">Terminal Chat App</h4>
                      <p className="text-sm text-muted-foreground">
                        A real-time chat application built with Bubbletea and WebSockets.
                      </p>
                      <div className="flex gap-2">
                        <Badge className="font-mono text-xs">Go</Badge>
                        <Badge className="font-mono text-xs">Bubbletea</Badge>
                        <Badge className="font-mono text-xs">WebSocket</Badge>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full col-span-2">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="glass-overlay border-glow">
                    <div className="space-y-2">
                      <h4 className="font-mono font-semibold">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start">View Code</Button>
                        <Button variant="ghost" className="w-full justify-start">Live Demo</Button>
                        <Button variant="ghost" className="w-full justify-start">Documentation</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Alerts & Notifications */}
        <Section title="Alerts & Notifications" id="alerts">
          <div className="grid gap-6">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Alerts</CardTitle>
                <CardDescription>Display important messages and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-primary/50 bg-primary/5">
                  <AlertTitle className="font-mono">Info</AlertTitle>
                  <AlertDescription>
                    This is an informational alert with terminal styling.
                  </AlertDescription>
                </Alert>

                <Alert className="border-destructive/50 bg-destructive/5">
                  <AlertTitle className="font-mono text-destructive">Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>

                <Alert className="border-secondary/50 bg-secondary/5">
                  <AlertTitle className="font-mono text-secondary">Success</AlertTitle>
                  <AlertDescription>
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Alert Dialog</CardTitle>
                <CardDescription>Modal dialogs for confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Project</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-overlay border-glow">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-mono">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Data Display */}
        <Section title="Data Display" id="data">
          <div className="grid gap-6">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Table</CardTitle>
                <CardDescription>Display structured data in rows and columns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption className="font-mono">Recent Projects</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono">Name</TableHead>
                      <TableHead className="font-mono">Stack</TableHead>
                      <TableHead className="font-mono">Status</TableHead>
                      <TableHead className="font-mono text-right">Stars</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">Terminal Chat</TableCell>
                      <TableCell>Go, Bubbletea</TableCell>
                      <TableCell><Badge>Completed</Badge></TableCell>
                      <TableCell className="text-right">127</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">Task Manager</TableCell>
                      <TableCell>Next.js, TypeScript</TableCell>
                      <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                      <TableCell className="text-right">89</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">API Gateway</TableCell>
                      <TableCell>Rust, Actix</TableCell>
                      <TableCell><Badge variant="outline">In Progress</Badge></TableCell>
                      <TableCell className="text-right">45</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-glow">
                <CardHeader>
                  <CardTitle className="font-mono">Progress</CardTitle>
                  <CardDescription>Show completion status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-mono">Next.js</span>
                      <span className="text-muted-foreground">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-mono">TypeScript</span>
                      <span className="text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-mono">Go</span>
                      <span className="text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-glow">
                <CardHeader>
                  <CardTitle className="font-mono">Spinner</CardTitle>
                  <CardDescription>Loading indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" />
                    <span className="text-sm text-muted-foreground font-mono">Small</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Spinner />
                    <span className="text-sm text-muted-foreground font-mono">Default</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Spinner size="lg" />
                    <span className="text-sm text-muted-foreground font-mono">Large</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        {/* Media & UI Elements */}
        <Section title="Media & UI Elements" id="media">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Avatar</CardTitle>
                <CardDescription>Display user or project images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="border-glow">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                    <AvatarFallback className="bg-primary/20 font-mono">MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-mono text-sm font-semibold">Matt C</p>
                    <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8 border-glow">
                    <AvatarFallback className="bg-primary/20 font-mono text-xs">SM</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10 border-glow">
                    <AvatarFallback className="bg-secondary/20 font-mono text-sm">MD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-12 w-12 border-glow">
                    <AvatarFallback className="bg-primary/20 font-mono">LG</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Keyboard Keys</CardTitle>
                <CardDescription>Display keyboard shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open command palette</span>
                  <div className="flex gap-1">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Save file</span>
                  <div className="flex gap-1">
                    <Kbd>Ctrl</Kbd>
                    <Kbd>S</Kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Copy selection</span>
                  <div className="flex gap-1">
                    <Kbd>⌘</Kbd>
                    <Kbd>C</Kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Menus & Commands */}
        <Section title="Menus & Commands" id="menus">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Dropdown Menu</CardTitle>
                <CardDescription>Contextual action menus</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Project Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-overlay border-glow">
                    <DropdownMenuLabel className="font-mono">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="font-mono">View Details</DropdownMenuItem>
                    <DropdownMenuItem className="font-mono">Edit Project</DropdownMenuItem>
                    <DropdownMenuItem className="font-mono">Clone Repository</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="font-mono text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Command Palette</CardTitle>
                <CardDescription>Terminal-style command interface</CardDescription>
              </CardHeader>
              <CardContent>
                <Command className="glass-overlay border border-border rounded-lg">
                  <CommandInput placeholder="Type a command or search..." className="font-mono" />
                  <CommandList>
                    <CommandEmpty className="font-mono">No results found.</CommandEmpty>
                    <CommandGroup heading="Projects">
                      <CommandItem className="font-mono">
                        Terminal Chat
                        <CommandShortcut>⌘1</CommandShortcut>
                      </CommandItem>
                      <CommandItem className="font-mono">
                        Task Manager
                        <CommandShortcut>⌘2</CommandShortcut>
                      </CommandItem>
                      <CommandItem className="font-mono">
                        API Gateway
                        <CommandShortcut>⌘3</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                      <CommandItem className="font-mono">View All Projects</CommandItem>
                      <CommandItem className="font-mono">Contact Me</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Toggle Components */}
        <Section title="Toggle Components" id="toggles">
          <Card className="border-glow">
            <CardHeader>
              <CardTitle className="font-mono">Toggles</CardTitle>
              <CardDescription>Single and grouped toggle buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-mono">Single Toggle</p>
                <Toggle className="font-mono">Dark Mode</Toggle>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-3 font-mono">Toggle Group</p>
                <ToggleGroup type="single" defaultValue="all" className="justify-start">
                  <ToggleGroupItem value="all" className="font-mono">All</ToggleGroupItem>
                  <ToggleGroupItem value="web" className="font-mono">Web</ToggleGroupItem>
                  <ToggleGroupItem value="tui" className="font-mono">TUI</ToggleGroupItem>
                  <ToggleGroupItem value="api" className="font-mono">API</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-3 font-mono">Multiple Selection</p>
                <ToggleGroup type="multiple" className="justify-start">
                  <ToggleGroupItem value="nextjs" className="font-mono">Next.js</ToggleGroupItem>
                  <ToggleGroupItem value="typescript" className="font-mono">TypeScript</ToggleGroupItem>
                  <ToggleGroupItem value="go" className="font-mono">Go</ToggleGroupItem>
                  <ToggleGroupItem value="rust" className="font-mono">Rust</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Motion Primitives */}
        <Section title="Motion Primitives" id="motion">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">
                  <TextMorph className="terminal-glow">Text Morph Effect</TextMorph>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Smooth text morphing animation for dynamic content changes.
                </p>
              </CardContent>
            </Card>

            <CursorGlowCard />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <FloatingCard />

            <Card className="border-glow">
              <CardHeader>
                <CardTitle className="font-mono">Usage Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-mono text-primary mb-1">Floating Cards</p>
                  <p className="text-xs text-muted-foreground">
                    Subtle continuous animation (4-6px range, 4s duration) with enhanced hover effect
                  </p>
                </div>
                <div>
                  <p className="text-sm font-mono text-primary mb-1">Cursor Glow</p>
                  <p className="text-xs text-muted-foreground">
                    Interactive radial gradient that follows mouse position
                  </p>
                </div>
                <div>
                  <p className="text-sm font-mono text-primary mb-1">Text Morph</p>
                  <p className="text-xs text-muted-foreground">
                    Smooth character-by-character transitions for dynamic text
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-glow mt-6">
            <CardHeader>
              <CardTitle className="font-mono">Animated Background</CardTitle>
              <CardDescription>Smooth background transitions on hover</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 p-4 bg-background rounded-lg border border-border/50">
                <AnimatedBackground
                  className="rounded-lg bg-primary border-2 border-primary/60 shadow-lg shadow-primary/20"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.3,
                  }}
                  enableHover
                >
                  <button data-id="1" className="relative z-10 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-colors text-muted-foreground hover:text-background">
                    Next.js
                  </button>
                  <button data-id="2" className="relative z-10 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-colors text-muted-foreground hover:text-background">
                    TypeScript
                  </button>
                  <button data-id="3" className="relative z-10 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-colors text-muted-foreground hover:text-background">
                    Tailwind
                  </button>
                  <button data-id="4" className="relative z-10 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-colors text-muted-foreground hover:text-background">
                    Framer
                  </button>
                </AnimatedBackground>
              </div>
              <p className="text-sm text-muted-foreground">
                Hover over the technology buttons above to see a smooth animated background that follows your selection.
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* Utility Classes */}
        <Section title="Utility Classes" id="utilities">
          <Card className="border-glow">
            <CardHeader>
              <CardTitle className="font-mono">Custom Utilities</CardTitle>
              <CardDescription>Terminal-themed utility classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2 font-mono">.glass</p>
                <div className="glass p-6 rounded-lg">
                  <p className="font-mono">Light glassmorphic background with blur</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2 font-mono">.glass-dark</p>
                <div className="glass-dark p-6 rounded-lg">
                  <p className="font-mono">Dark glassmorphic background with blur</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2 font-mono">.terminal-glow</p>
                <h3 className="text-3xl font-mono font-bold terminal-glow">
                  Terminal Phosphor Glow Effect
                </h3>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2 font-mono">.border-glow</p>
                <div className="border-glow border border-border p-6 rounded-lg">
                  <p className="font-mono">Glowing cyan border effect</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Footer */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground font-mono mb-2">
            Style Guide for Matt's Portfolio • Terminal Theme
          </p>
          <p className="text-xs text-muted-foreground font-mono mb-4">
            40+ shadcn/ui components styled with terminal aesthetics
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="font-mono text-xs">Next.js 15</Badge>
            <Badge className="font-mono text-xs">TypeScript</Badge>
            <Badge className="font-mono text-xs">Tailwind CSS</Badge>
            <Badge className="font-mono text-xs">shadcn/ui</Badge>
            <Badge className="font-mono text-xs">Motion Primitives</Badge>
            <Badge className="font-mono text-xs" variant="outline">40+ Components</Badge>
          </div>
        </div>
      </div>
    </main>
  );
}

// Section wrapper component
function Section({
  title,
  id,
  children
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-20">
      <h2 className="text-4xl font-mono font-bold mb-8 gradient-text-theme">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Cursor glow card component
function CursorGlowCard() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Card
      className="glass-dark border-glow relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-300 animate-pulse"
          style={{
            width: '300px',
            height: '300px',
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.2) 30%, transparent 70%)',
            opacity: isHovering ? 1 : 0,
          }}
        />
      )}
      <CardHeader className="relative z-10">
        <CardTitle className="font-mono">Glow Effect</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-sm text-muted-foreground">
          Interactive glow that follows your cursor - very terminal-esque!
        </p>
      </CardContent>
    </Card>
  );
}

// Floating card component (Balatro-style)
function FloatingCard() {
  return (
    <motion.div
      animate={{
        y: [-5, 5, -5],
        x: [-2, 2, -2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }}
      whileHover={{
        y: -12,
        scale: 1.03,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
    >
      <Card className="glass-dark border-glow relative overflow-hidden" style={{ perspective: 1000 }}>
        <CardHeader>
          <CardTitle className="font-mono">Floating Effect</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Balatro-style subtle floating animation with multi-axis movement.
          </p>
          <div className="space-y-1 text-xs text-muted-foreground font-mono">
            <div className="flex justify-between">
              <span>Y-axis:</span>
              <span className="text-primary">±5px</span>
            </div>
            <div className="flex justify-between">
              <span>X-axis:</span>
              <span className="text-primary">±2px</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="text-primary">4s</span>
            </div>
            <div className="flex justify-between">
              <span>Hover:</span>
              <span className="text-secondary">Enhanced ↑</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
