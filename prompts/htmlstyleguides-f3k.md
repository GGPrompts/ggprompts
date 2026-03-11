# Create Go language tech guide

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-f3k` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-11 13:21:13 |
| **Updated** | 2026-02-11 14:25:02 |

## Description

Build a comprehensive pure HTML tech guide for Go (Golang). This guide should cover the language fundamentals, concurrency (goroutines/channels), error handling, modules, testing, common patterns, and relevant ecosystem tools like Cobra, Bubbletea (TUIs), and net/http.

Workflow (context-aware to avoid hitting limits):
1. Launch 3-4 Sonnet subagents in parallel to research different Go topic areas (fundamentals, concurrency, ecosystem/frameworks, testing/tooling)
2. Gather and consolidate research results
3. Use 4-5 sequential Opus subagents to build the guide section by section, each writing a portion of the HTML page
4. Assemble final go.html and add to techguides/index.html

## Worker Prompt & Notes

## Context7 Research Findings

### Latest Go Features to Cover
- **Generics** (Go 1.18+) - type parameters, constraints (`comparable`, custom interfaces), type inference
- **Range over functions / iterators** (Go 1.23) - iterator functions with yield pattern
- **Range over integers** (Go 1.22) - `for i := range 10`
- **Structured logging with `slog`** (Go 1.21) - new standard library structured logging
- **Bubbletea v2** - new Init signature returns `(Model, Cmd)`, MVU architecture

### Bubbletea MVU Pattern (from context7)
- Model interface: Init() Cmd, Update(Msg) (Model, Cmd), View() string
- v2 Init returns (Model, Cmd) instead of just Cmd
- Key message handling via tea.KeyMsg with msg.String()

### Style Recommendations (unused styles that fit Go)
1. **atlas-console** - Clean, organized system infrastructure feel; reflects Go's scalable systems role
2. **streamline-moderne** - Efficiency and smooth flow; aligns with Go's simplicity philosophy
3. **bauhaus** - Functional minimalism and systematic design; mirrors Go's 'less is more' approach
