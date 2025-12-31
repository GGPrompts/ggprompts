# AI/ML Dashboard Suite - Build Prompts for Claude.ai

## CONTEXT
I'm building a portfolio website with 101 production-ready Next.js templates. I need you to create **5 cutting-edge AI/ML monitoring and development dashboards** that showcase understanding of modern AI/ML operations, LLM development, and model monitoring.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion (3D animations)
- Recharts (for data visualization)
- shadcn/ui components
- Glassmorphism design (terminal theme with emerald/cyan glow)

**File Location:** `/home/matt/projects/portfolio-style-guides/app/templates/[template-name]/page.tsx`

**Design System:**
- **Theme**: Terminal-inspired with emerald/cyan accents on dark slate
- **Glassmorphism**: Use `.glass` utility class (frosted glass effect)
- **Animations**: Framer Motion for live updates, smooth transitions
- **Icons**: lucide-react
- **Components**: Use shadcn/ui (Button, Card, Badge, Tabs, Dialog, Table, Progress, etc.)

---

## TEMPLATE 1: LLM TRAINING DASHBOARD

### Requirements
Create a comprehensive LLM training monitoring dashboard at `/app/templates/llm-training-dashboard/page.tsx`

**Core Features:**

1. **Training Overview:**
   - Model name (e.g., "GPT-4-Turbo-Finetune-v2")
   - Training status (Initializing/Running/Paused/Completed/Failed)
   - Epoch progress (e.g., "Epoch 3/10 - 45% complete")
   - Time elapsed, estimated time remaining
   - Total tokens processed
   - Cost tracker (compute hours × GPU cost)

2. **Loss Curves:**
   - Training loss vs validation loss (dual line chart)
   - Perplexity over time
   - Learning rate schedule visualization
   - Gradient norm tracking
   - Zoom/pan controls
   - Export chart data

3. **GPU Utilization:**
   - 8x GPU cluster visualization
   - Per-GPU utilization (0-100%)
   - Memory usage (VRAM used/total)
   - Temperature monitoring (with warnings >80°C)
   - Power consumption (watts)
   - Compute efficiency score

4. **Training Metrics:**
   - Throughput (tokens/second)
   - Batch size and micro-batch optimization
   - Gradient accumulation steps
   - Data loading speed
   - Model parallelism efficiency
   - Communication overhead (DDP/FSDP)

5. **Hyperparameters Panel:**
   - Learning rate: 5e-5 (AdamW optimizer)
   - Batch size: 512 (effective)
   - Context length: 8192 tokens
   - Warmup steps, decay schedule
   - Weight decay, gradient clipping
   - Edit and restart training

6. **Dataset Info:**
   - Training samples: 1.2M
   - Validation samples: 50K
   - Data distribution (by domain/language)
   - Token distribution histogram
   - Data quality metrics

7. **Checkpoints & Snapshots:**
   - Checkpoint history (every N steps)
   - Model size on disk
   - Best checkpoint indicator
   - Download/restore controls
   - Automatic checkpoint strategy

8. **Alerts & Anomalies:**
   - Loss spikes detected
   - Gradient explosions/vanishing
   - OOM (Out of Memory) warnings
   - Data loading bottlenecks
   - Suggested interventions

**Mock Data:**
- Model: "Claude-3-Finetune-Legal-v1" (7B parameters)
- Training on 8x A100 80GB GPUs
- Epoch 4/10, 62% complete
- Training loss: 2.341 → 1.876 (improving)
- Validation loss: 2.523 → 2.104
- Throughput: 3,842 tokens/sec
- GPU utilization: 85-92% across cluster
- ETA: 18 hours 23 minutes

**Design Notes:**
- Loss curves use gradient fills (emerald to cyan)
- GPU cards with live animated usage bars
- Critical alerts pulse with amber/red glow
- Checkpoint timeline with visual snapshots
- Real-time updates every 2 seconds (simulated)

---

## TEMPLATE 2: ML MODEL PERFORMANCE DASHBOARD

### Requirements
Create a model evaluation and A/B testing dashboard at `/app/templates/ml-model-performance/page.tsx`

**Core Features:**

1. **Model Comparison:**
   - A/B test between 2-4 models
   - Model cards (name, version, deployed date)
   - Overall accuracy/F1/AUC comparison
   - Latency (p50, p95, p99)
   - Cost per inference
   - Traffic split (e.g., Model A: 80%, Model B: 20%)

2. **Confusion Matrix:**
   - Interactive heatmap for classification
   - True Positives, False Positives, etc.
   - Class-level precision/recall
   - Click to drill down into misclassifications
   - Multi-class support (up to 10 classes)

3. **ROC/PR Curves:**
   - ROC curve with AUC score
   - Precision-Recall curve
   - Multiple models overlaid
   - Threshold selector
   - Optimal threshold recommendation

4. **Performance Metrics:**
   - Accuracy, Precision, Recall, F1-Score
   - MAE, MSE, RMSE (for regression)
   - Cohen's Kappa
   - Matthews Correlation Coefficient
   - Balanced accuracy (for imbalanced datasets)

5. **Feature Importance:**
   - SHAP values visualization
   - Permutation importance
   - Top 20 features ranked
   - Feature interaction effects
   - Partial dependence plots

6. **Error Analysis:**
   - Error distribution by class
   - Error clusters (similar failures)
   - Hardest samples to classify
   - Bias/fairness metrics
   - Slicing by subgroups

7. **Prediction Distribution:**
   - Confidence score histogram
   - Calibration curve
   - Prediction drift over time
   - Class imbalance visualization

8. **A/B Test Results:**
   - Statistical significance (p-value)
   - Confidence intervals
   - Winner declaration
   - Sample size required
   - Rollout recommendation

**Mock Data:**
- Model A: "sentiment-classifier-v3.2" (92.4% accuracy)
- Model B: "sentiment-classifier-v4.0" (93.1% accuracy)
- Classes: Positive, Negative, Neutral
- 50,000 test samples
- AUC: 0.956 (Model A) vs 0.961 (Model B)
- p50 latency: 12ms vs 15ms
- Cost: $0.002 vs $0.003 per 1K inferences

**Design Notes:**
- Confusion matrix with color gradient (emerald=high, red=low)
- ROC curve with shaded AUC area
- Feature importance horizontal bars
- Model comparison cards with winner badge
- Statistical significance indicators

---

## TEMPLATE 3: AI AGENT ORCHESTRATION DASHBOARD

### Requirements
Create a multi-agent system monitoring dashboard at `/app/templates/ai-agent-dashboard/page.tsx`

**Core Features:**

1. **Agent Fleet Overview:**
   - 5-10 specialized agents (Research, Code, Writer, Analyst, etc.)
   - Agent status (Idle/Busy/Error/Offline)
   - Tasks queued per agent
   - Success rate (last 24h)
   - Average task duration
   - Agent health scores

2. **Live Task Stream:**
   - Real-time task feed (scrolling list)
   - Task type, assigned agent, status
   - Execution timeline
   - Resource consumption
   - Logs/output preview
   - Retry/cancel controls

3. **Agent Communication Graph:**
   - Visual node graph showing agent interactions
   - Nodes = agents, Edges = messages/handoffs
   - Message frequency (edge thickness)
   - Data flow direction
   - Click node to see agent details

4. **Tool Usage Analytics:**
   - Tools available (Web Search, Code Execution, Database Query, etc.)
   - Tool call frequency (bar chart)
   - Success vs failure rate per tool
   - Average execution time
   - Cost per tool call
   - Most-used tool chains

5. **Conversation Context:**
   - Active conversations (multi-turn)
   - Context window usage (tokens)
   - Memory retrieval count
   - Context compression stats
   - Long-term memory hits

6. **Performance Metrics:**
   - Total tasks completed (24h/7d/30d)
   - Average completion time
   - First-response time
   - Agent utilization %
   - Concurrent task capacity
   - Queue depth

7. **Error & Retry Analysis:**
   - Failed tasks breakdown
   - Error categories (timeout, hallucination, rate limit, etc.)
   - Retry success rate
   - Fallback agent invocations
   - Circuit breaker status

8. **Cost Tracking:**
   - Total spend (LLM API calls)
   - Cost per agent
   - Cost per task type
   - Budget alerts
   - Optimization recommendations

**Mock Data:**
- 8 agents: Research, Code, Writer, Analyst, QA, Summarizer, Translator, Moderator
- 1,247 tasks completed today
- 23 tasks in queue
- Average completion: 8.3 seconds
- Tool calls: 3,842 (Web: 45%, Code: 30%, DB: 15%, Other: 10%)
- Success rate: 94.2%
- Total cost today: $47.23

**Design Notes:**
- Agent cards with status indicators (green=idle, blue=busy, red=error)
- Live task stream with fade-in animation
- Interactive agent graph (force-directed layout)
- Tool usage radial chart
- Cost sparklines per agent

---

## TEMPLATE 4: VECTOR DATABASE MONITORING

### Requirements
Create a vector database and embedding quality dashboard at `/app/templates/vector-db-dashboard/page.tsx`

**Core Features:**

1. **Database Overview:**
   - Vector DB type (Pinecone, Weaviate, Qdrant, Chroma)
   - Total vectors stored (e.g., 2.4M)
   - Index size on disk (GB)
   - Dimensions per vector (e.g., 1536 for OpenAI)
   - Metadata fields
   - Last updated timestamp

2. **Embedding Model Info:**
   - Model name (e.g., "text-embedding-ada-002")
   - Embedding dimensions
   - Max input tokens
   - Cost per 1K tokens
   - Embedding speed (vectors/sec)

3. **Search Performance:**
   - Average query latency (ms)
   - Queries per second (QPS)
   - Top-k retrieval accuracy
   - Recall@10 metrics
   - Search cache hit rate
   - Index refresh frequency

4. **Similarity Distribution:**
   - Histogram of similarity scores
   - Distance metrics (cosine, euclidean, dot product)
   - Threshold recommendations
   - Outlier detection
   - Cluster density visualization

5. **Embedding Quality Metrics:**
   - Embedding coverage (% of documents embedded)
   - Duplicate detection (near-duplicates)
   - Embedding drift over time
   - Semantic coherence score
   - Cross-encoder re-ranking stats

6. **Index Health:**
   - Index fragmentation
   - Rebuild/optimize status
   - Shard distribution
   - Replication factor
   - Consistency checks

7. **Query Analytics:**
   - Top 20 most common queries
   - Query patterns (semantic vs keyword)
   - Zero-result queries
   - Query latency heatmap (by hour)
   - Search result diversity

8. **Namespace/Collection Stats:**
   - Multiple namespaces (e.g., "docs", "code", "chat-history")
   - Vectors per namespace
   - Query volume per namespace
   - Namespace-specific performance
   - Access patterns

**Mock Data:**
- Vector DB: Pinecone (serverless)
- 2.4M vectors (1536 dimensions)
- Embedding model: text-embedding-3-small
- Average query latency: 42ms
- Recall@10: 0.94
- Index size: 18.7 GB
- 3 namespaces: documentation (1.2M), codebase (800K), chat (400K)
- QPS: 127

**Design Notes:**
- Similarity score distribution histogram
- Latency heatmap (time of day vs query speed)
- Namespace cards with vector counts
- Query pattern pie chart
- Real-time QPS graph

---

## TEMPLATE 5: PROMPT ENGINEERING STUDIO

### Requirements
Create an interactive prompt testing and optimization platform at `/app/templates/prompt-studio/page.tsx`

**Core Features:**

1. **Prompt Editor:**
   - Multi-line text editor with syntax highlighting
   - Variable insertion {{variable_name}}
   - Template library (pre-built prompts)
   - Version history (git-like diff view)
   - Save/load prompts
   - Export to code (Python, JS, cURL)

2. **Model Selector:**
   - Model dropdown (GPT-4, Claude-3, Gemini, Llama, etc.)
   - Model parameters:
     - Temperature (0.0 - 2.0 slider)
     - Max tokens (0 - 4096)
     - Top-p, Top-k
     - Frequency/presence penalty
     - Stop sequences
   - Cost calculator (tokens × price)

3. **Multi-Response Testing:**
   - Generate N responses (1-10)
   - Side-by-side comparison
   - Response quality voting (thumbs up/down)
   - Average response time
   - Token usage per response
   - Consistency analysis

4. **Response Metrics:**
   - Response length (characters, words, tokens)
   - Sentiment analysis
   - Readability score (Flesch-Kincaid)
   - JSON validity check
   - Custom regex validation
   - Format compliance

5. **A/B Prompt Testing:**
   - Compare 2-4 prompt variants
   - Statistical significance
   - Winner selection criteria
   - Auto-generate variations
   - Randomized testing

6. **Evaluation Criteria:**
   - Custom rubrics (accuracy, tone, format, etc.)
   - Score 1-10 per criterion
   - Weighted average
   - Pass/fail threshold
   - Automated scoring (LLM-as-judge)

7. **Prompt Optimization:**
   - Suggestions to improve clarity
   - Token reduction recommendations
   - Chain-of-thought integration
   - Few-shot example insertion
   - System message optimization

8. **Cost & Performance Tracking:**
   - Total tokens used (input + output)
   - Cost per test run
   - Cumulative spend
   - Average latency
   - Rate limit tracking
   - Budget alerts

9. **History & Analytics:**
   - Test run history (last 100)
   - Performance trends
   - Best-performing prompts
   - Version comparison
   - Export test data (CSV/JSON)

**Mock Data:**
- Active prompt: "You are a helpful AI assistant..."
- Model: gpt-4-turbo-preview
- Temperature: 0.7, Max tokens: 2048
- 5 test responses generated
- Average latency: 3.2s
- Total tokens: 8,432 (input: 1,200, output: 7,232)
- Cost: $0.14
- Quality score: 8.4/10

**Design Notes:**
- Code editor with syntax highlighting (Monaco-style)
- Response cards in grid layout
- Slider controls for temperature/tokens
- Cost displayed in real-time
- Version diff view (git-style)
- Export buttons for various formats

---

## IMPORTANT GUIDELINES

### File Structure
Each template should be a single `page.tsx` file:
```tsx
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { /* icons */ } from "lucide-react"
import { /* shadcn components */ } from "@/components/ui/*"
import { /* recharts */ } from "recharts"

export default function TemplateName() {
  // State and logic
  // Mock data generators
  // Simulated real-time updates
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Template content */}
    </div>
  )
}
```

### Glassmorphism Classes
```css
.glass {
  background: rgba(16, 185, 129, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.1),
    inset 0 0 20px rgba(16, 185, 129, 0.02);
}

.terminal-glow {
  text-shadow:
    0 0 10px rgba(16, 185, 129, 0.5),
    0 0 20px rgba(16, 185, 129, 0.3);
}
```

### Chart Types (Recharts)
```tsx
import { LineChart, AreaChart, BarChart, PieChart, RadarChart,
         ScatterChart, ComposedChart } from "recharts"
import { Line, Area, Bar, Pie, Radar, Scatter, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Use emerald/cyan gradients
<defs>
  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.8}/>
    <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0}/>
  </linearGradient>
</defs>
```

### Real-Time Simulation
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Update metrics every 2-5 seconds
    setMetrics(prev => ({
      ...prev,
      value: prev.value + Math.random() * 10
    }))
  }, 2000)
  return () => clearInterval(interval)
}, [])
```

### Color Coding
- **Healthy/Success**: Emerald (`text-emerald-500`)
- **Warning**: Amber (`text-amber-500`)
- **Critical/Error**: Red (`text-red-500`)
- **Info**: Cyan (`text-cyan-500`)
- **Neutral**: Slate (`text-slate-400`)

---

## TASK FOR YOU

**Please create all 5 templates** in separate code blocks, following:
1. All TypeScript types defined
2. Realistic AI/ML mock data
3. Live update simulations with useEffect
4. Interactive charts using Recharts
5. Glassmorphic design with terminal theme
6. Smooth Framer Motion animations
7. Responsive layout (mobile-first)
8. Comments explaining AI/ML concepts

**Start with Template 1 (LLM Training), then Template 2 (Model Performance), then Template 3 (AI Agent), then Template 4 (Vector DB), then Template 5 (Prompt Studio).**

Each template should be 1200-1800 lines of production-quality code. Make them showcase DEEP AI/ML knowledge!

### Pro Tips:
- Add tooltips explaining technical terms (e.g., "AUC = Area Under Curve")
- Use monospace fonts for model names, metrics
- Add "Export Data" or "Download Report" buttons
- Show relative timestamps ("Updated 3s ago")
- Include realistic model names (GPT-4, Claude-3, etc.)
- Add loading states and live update indicators
