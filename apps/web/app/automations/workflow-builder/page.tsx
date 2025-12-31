'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Play,
  Plus,
  Trash2,
  GripVertical,
  FileDown,
  Save,
  ChevronDown,
  ChevronUp,
  MousePointer,
  Edit3,
  Camera,
  Clock,
  Code,
  Terminal,
  Globe,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Step action types
type StepAction =
  | 'open_url'
  | 'click'
  | 'fill'
  | 'screenshot'
  | 'wait'
  | 'execute_script'
  | 'send_terminal'

interface WorkflowStep {
  id: string
  action: StepAction
  selector: string
  value: string
  wait: number
}

interface Selector {
  id: string
  description: string
}

const actionConfig: Record<
  StepAction,
  { label: string; icon: React.ElementType; color: string; mcpTool: string }
> = {
  open_url: {
    label: 'Open URL',
    icon: Globe,
    color: 'text-blue-500',
    mcpTool: 'tabz_open_url',
  },
  click: {
    label: 'Click',
    icon: MousePointer,
    color: 'text-green-500',
    mcpTool: 'tabz_click',
  },
  fill: {
    label: 'Fill',
    icon: Edit3,
    color: 'text-purple-500',
    mcpTool: 'tabz_fill',
  },
  screenshot: {
    label: 'Screenshot',
    icon: Camera,
    color: 'text-orange-500',
    mcpTool: 'tabz_screenshot',
  },
  wait: {
    label: 'Wait',
    icon: Clock,
    color: 'text-yellow-500',
    mcpTool: 'sleep',
  },
  execute_script: {
    label: 'Execute Script',
    icon: Code,
    color: 'text-cyan-500',
    mcpTool: 'tabz_execute_script',
  },
  send_terminal: {
    label: 'Send to Terminal',
    icon: Terminal,
    color: 'text-pink-500',
    mcpTool: 'terminal',
  },
}

// Sortable Step Card Component
function SortableStepCard({
  step,
  index,
  onUpdate,
  onDelete,
  onTestStep,
}: {
  step: WorkflowStep
  index: number
  onUpdate: (id: string, updates: Partial<WorkflowStep>) => void
  onDelete: (id: string) => void
  onTestStep: (step: WorkflowStep) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = actionConfig[step.action]
  const Icon = config.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`step-${index}-card`}
      data-testid={`step-${index}-card`}
      className={cn(
        'glass border border-border/50 rounded-lg p-4 mb-3 transition-all',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <Badge variant="outline" className="font-mono">
            Step {index + 1}
          </Badge>
          <div className={cn('flex items-center gap-1.5', config.color)}>
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        </div>
        <button
          id={`step-${index}-delete`}
          data-testid={`step-${index}-delete`}
          onClick={() => onDelete(step.id)}
          className="p-1.5 hover:bg-destructive/10 rounded text-destructive transition-colors"
          aria-label="Delete step"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Action Select */}
      <div className="grid gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Action
          </label>
          <Select
            value={step.action}
            onValueChange={(value) =>
              onUpdate(step.id, { action: value as StepAction })
            }
          >
            <SelectTrigger
              id={`step-${index}-action`}
              data-testid={`step-${index}-action`}
              className="bg-background/50"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(actionConfig).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <cfg.icon className={cn('w-4 h-4', cfg.color)} />
                    {cfg.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector/URL Input */}
        {step.action !== 'wait' && step.action !== 'send_terminal' && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {step.action === 'open_url' ? 'URL' : 'Selector'}
            </label>
            <Input
              id={`step-${index}-selector`}
              data-testid={`step-${index}-selector`}
              placeholder={
                step.action === 'open_url'
                  ? 'https://example.com'
                  : '#btn-submit'
              }
              value={step.selector}
              onChange={(e) => onUpdate(step.id, { selector: e.target.value })}
              className="font-mono text-sm bg-background/50"
            />
          </div>
        )}

        {/* Value Input */}
        {(step.action === 'fill' ||
          step.action === 'execute_script' ||
          step.action === 'send_terminal') && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Value
            </label>
            <Textarea
              id={`step-${index}-value`}
              data-testid={`step-${index}-value`}
              placeholder={
                step.action === 'send_terminal'
                  ? 'Command to send...'
                  : step.action === 'execute_script'
                    ? 'JavaScript code...'
                    : 'Text to fill...'
              }
              value={step.value}
              onChange={(e) => onUpdate(step.id, { value: e.target.value })}
              className="font-mono text-sm bg-background/50 min-h-[60px]"
            />
          </div>
        )}

        {/* Wait Time */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Wait after (ms)
          </label>
          <Input
            id={`step-${index}-wait`}
            data-testid={`step-${index}-wait`}
            type="number"
            placeholder="500"
            value={step.wait || ''}
            onChange={(e) =>
              onUpdate(step.id, { wait: parseInt(e.target.value) || 0 })
            }
            className="font-mono text-sm bg-background/50 w-32"
          />
        </div>
      </div>

      {/* Test Step Button */}
      <div className="mt-4 pt-3 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTestStep(step)}
          className="gap-2"
        >
          <Play className="w-3 h-3" />
          Test Step
        </Button>
      </div>
    </div>
  )
}

// Selectors Panel Component (inline)
function SelectorsPanel({ selectors }: { selectors: Selector[] }) {
  const [isOpen, setIsOpen] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copySelector = useCallback((id: string) => {
    navigator.clipboard.writeText(`#${id}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  return (
    <Card
      id="selectors-panel"
      data-testid="selectors-panel"
      className="glass border-border/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          <span className="font-semibold">Selectors Reference</span>
          <Badge variant="secondary" className="text-xs">
            {selectors.length}
          </Badge>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground my-3">
            All interactive elements on this page with stable selectors for
            TabzChrome MCP automation.
          </p>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {selectors.map((sel) => (
              <div
                key={sel.id}
                className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <code className="text-xs font-mono text-primary">
                    #{sel.id}
                  </code>
                  <p className="text-xs text-muted-foreground truncate">
                    {sel.description}
                  </p>
                </div>
                <button
                  onClick={() => copySelector(sel.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background rounded"
                  aria-label={`Copy selector #${sel.id}`}
                >
                  {copiedId === sel.id ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

// Main Page Component
export default function WorkflowBuilderPage() {
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDesc, setWorkflowDesc] = useState('')
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: 'step-1', action: 'open_url', selector: '', value: '', wait: 500 },
  ])
  const [testResult, setTestResult] = useState<string | null>(null)
  const [exportOutput, setExportOutput] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end for reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }, [])

  // Add new step
  const addStep = useCallback(() => {
    const newId = `step-${Date.now()}`
    setSteps((prev) => [
      ...prev,
      { id: newId, action: 'click', selector: '', value: '', wait: 500 },
    ])
  }, [])

  // Update step
  const updateStep = useCallback(
    (id: string, updates: Partial<WorkflowStep>) => {
      setSteps((prev) =>
        prev.map((step) => (step.id === id ? { ...step, ...updates } : step))
      )
    },
    []
  )

  // Delete step
  const deleteStep = useCallback((id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id))
  }, [])

  // Test individual step
  const testStep = useCallback((step: WorkflowStep) => {
    const config = actionConfig[step.action]
    let command = ''

    switch (step.action) {
      case 'open_url':
        command = `mcp-cli call tabz/tabz_open_url '{"url": "${step.selector}"}'`
        break
      case 'click':
        command = `mcp-cli call tabz/tabz_click '{"selector": "${step.selector}"}'`
        break
      case 'fill':
        command = `mcp-cli call tabz/tabz_fill '{"selector": "${step.selector}", "value": "${step.value}"}'`
        break
      case 'screenshot':
        command = `mcp-cli call tabz/tabz_screenshot '{"selector": "${step.selector}"}'`
        break
      case 'wait':
        command = `sleep ${step.wait / 1000}`
        break
      case 'execute_script':
        command = `mcp-cli call tabz/tabz_execute_script '{"script": "${step.value.replace(/"/g, '\\"')}"}'`
        break
      case 'send_terminal':
        command = `# Send to terminal: ${step.value}`
        break
    }

    setTestResult(`Testing: ${config.label}\n\n${command}`)
  }, [])

  // Test full workflow
  const testWorkflow = useCallback(() => {
    const commands = steps
      .map((step, i) => {
        const config = actionConfig[step.action]
        let cmd = ''

        switch (step.action) {
          case 'open_url':
            cmd = `mcp-cli call tabz/tabz_open_url '{"url": "${step.selector}"}'`
            break
          case 'click':
            cmd = `mcp-cli call tabz/tabz_click '{"selector": "${step.selector}"}'`
            break
          case 'fill':
            cmd = `mcp-cli call tabz/tabz_fill '{"selector": "${step.selector}", "value": "${step.value}"}'`
            break
          case 'screenshot':
            cmd = `mcp-cli call tabz/tabz_screenshot '{"selector": "${step.selector}"}'`
            break
          case 'wait':
            cmd = `sleep ${step.wait / 1000}`
            break
          case 'execute_script':
            cmd = `mcp-cli call tabz/tabz_execute_script '{"script": "${step.value.replace(/"/g, '\\"')}"}'`
            break
          case 'send_terminal':
            cmd = `# Terminal: ${step.value}`
            break
        }

        return `# Step ${i + 1}: ${config.label}\n${cmd}${step.wait > 0 && step.action !== 'wait' ? `\nsleep ${step.wait / 1000}` : ''}`
      })
      .join('\n\n')

    setTestResult(`Workflow Test Commands:\n\n${commands}`)
  }, [steps])

  // Export as .prompty
  const exportPrompty = useCallback(() => {
    const stepsContent = steps
      .map((step, i) => {
        const config = actionConfig[step.action]
        let cmd = ''

        switch (step.action) {
          case 'open_url':
            cmd = `mcp-cli call tabz/tabz_open_url '{"url": "${step.selector}"}'`
            break
          case 'click':
            cmd = `mcp-cli call tabz/tabz_click '{"selector": "${step.selector}"}'`
            break
          case 'fill':
            cmd = `mcp-cli call tabz/tabz_fill '{"selector": "${step.selector}", "value": "${step.value}"}'`
            break
          case 'screenshot':
            cmd = `mcp-cli call tabz/tabz_screenshot '${step.selector ? `{"selector": "${step.selector}"}` : '{}'}'`
            break
          case 'wait':
            cmd = `sleep ${step.wait / 1000}`
            break
          case 'execute_script':
            cmd = `mcp-cli call tabz/tabz_execute_script '{"script": "${step.value.replace(/"/g, '\\"')}"}'`
            break
          case 'send_terminal':
            cmd = `# Send to terminal: ${step.value}`
            break
        }

        const waitLine =
          step.wait > 0 && step.action !== 'wait'
            ? `\nsleep ${step.wait / 1000}`
            : ''

        return `### ${i + 1}. ${config.label}
${cmd}${waitLine}`
      })
      .join('\n\n')

    const promptyContent = `---
name: ${workflowName || 'Untitled Workflow'}
description: ${workflowDesc || 'A custom automation workflow'}
---

## Workflow

${stepsContent}
`

    setExportOutput(promptyContent)
  }, [steps, workflowName, workflowDesc])

  // Save workflow (placeholder)
  const saveWorkflow = useCallback(() => {
    const workflow = {
      name: workflowName,
      description: workflowDesc,
      steps,
      createdAt: new Date().toISOString(),
    }
    console.log('Saving workflow:', workflow)
    setTestResult('Workflow saved! (Check console)')
  }, [workflowName, workflowDesc, steps])

  // Copy prompty to clipboard
  const copyPrompty = useCallback(() => {
    if (exportOutput) {
      navigator.clipboard.writeText(exportOutput)
    }
  }, [exportOutput])

  // Define all page selectors for the panel
  const pageSelectors: Selector[] = [
    { id: 'workflow-name', description: 'Workflow name input field' },
    { id: 'workflow-desc', description: 'Workflow description textarea' },
    { id: 'steps-list', description: 'Sortable step container' },
    ...steps.map((_, i) => [
      { id: `step-${i}-card`, description: `Step ${i + 1} card container` },
      { id: `step-${i}-action`, description: `Step ${i + 1} action select` },
      { id: `step-${i}-selector`, description: `Step ${i + 1} selector input` },
      { id: `step-${i}-value`, description: `Step ${i + 1} value input` },
      { id: `step-${i}-wait`, description: `Step ${i + 1} wait time input` },
      { id: `step-${i}-delete`, description: `Step ${i + 1} delete button` },
    ]).flat(),
    { id: 'btn-add-step', description: 'Add new step button' },
    { id: 'btn-test-workflow', description: 'Test full workflow button' },
    { id: 'btn-export-prompty', description: 'Export as .prompty button' },
    { id: 'btn-save', description: 'Save workflow button' },
    { id: 'selectors-panel', description: 'Selectors reference panel' },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text-theme">Workflow Builder</span>
          </h1>
          <p className="text-muted-foreground">
            Visual editor for creating MCP automation workflows. Drag-and-drop
            steps, configure selectors, and export as .prompty files.
          </p>
        </div>

        {/* Workflow Header */}
        <Card className="glass border-border/50 rounded-xl p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="workflow-name"
                className="text-sm font-medium mb-2 block"
              >
                Workflow Name
              </label>
              <Input
                id="workflow-name"
                data-testid="workflow-name"
                placeholder="My Automation Workflow"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label
                htmlFor="workflow-desc"
                className="text-sm font-medium mb-2 block"
              >
                Description
              </label>
              <Textarea
                id="workflow-desc"
                data-testid="workflow-desc"
                placeholder="Describe what this workflow does..."
                value={workflowDesc}
                onChange={(e) => setWorkflowDesc(e.target.value)}
                className="bg-background/50 min-h-[42px] resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Steps List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Steps</h2>
            <Badge variant="outline">{steps.length} steps</Badge>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div id="steps-list" data-testid="steps-list">
                {steps.map((step, index) => (
                  <SortableStepCard
                    key={step.id}
                    step={step}
                    index={index}
                    onUpdate={updateStep}
                    onDelete={deleteStep}
                    onTestStep={testStep}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Step Button */}
          <Button
            id="btn-add-step"
            data-testid="btn-add-step"
            variant="outline"
            onClick={addStep}
            className="w-full mt-2 border-dashed gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>

        {/* Action Buttons */}
        <Card className="glass border-border/50 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <Button
              id="btn-test-workflow"
              data-testid="btn-test-workflow"
              onClick={testWorkflow}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Test Workflow
            </Button>
            <Button
              id="btn-export-prompty"
              data-testid="btn-export-prompty"
              variant="secondary"
              onClick={exportPrompty}
              className="gap-2"
            >
              <FileDown className="w-4 h-4" />
              Export .prompty
            </Button>
            <Button
              id="btn-save"
              data-testid="btn-save"
              variant="outline"
              onClick={saveWorkflow}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </Card>

        {/* Test Output */}
        {testResult && (
          <Card className="glass border-border/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Test Output</h3>
              <button
                onClick={() => setTestResult(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            <pre className="text-xs font-mono bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
              {testResult}
            </pre>
          </Card>
        )}

        {/* Export Output */}
        {exportOutput && (
          <Card className="glass border-border/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">.prompty Export</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copyPrompty}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <button
                  onClick={() => setExportOutput(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            </div>
            <pre className="text-xs font-mono bg-muted/50 p-3 rounded overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {exportOutput}
            </pre>
          </Card>
        )}

        {/* Selectors Panel */}
        <SelectorsPanel selectors={pageSelectors} />
      </div>
    </div>
  )
}
