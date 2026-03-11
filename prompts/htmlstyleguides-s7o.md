# Create Rust language tech guide

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-s7o` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-11 13:21:17 |
| **Updated** | 2026-02-11 14:27:09 |

## Description

Build a comprehensive pure HTML tech guide for Rust. This guide should cover ownership/borrowing, lifetimes, traits, pattern matching, error handling (Result/Option), async/await, cargo, testing, and the broader ecosystem.

Workflow (context-aware to avoid hitting limits):
1. Launch 3-4 Sonnet subagents in parallel to research different Rust topic areas (ownership/borrowing/lifetimes, traits/generics/patterns, async/tokio/ecosystem, cargo/testing/tooling)
2. Gather and consolidate research results
3. Use 4-5 sequential Opus subagents to build the guide section by section, each writing a portion of the HTML page
4. Assemble final rust.html and add to techguides/index.html

## Worker Prompt & Notes

## Context7 Research Findings

### Latest Rust Features to Cover
- **Edition 2024** - latest edition features and defaults
- **Async/await** - `async fn` desugars to `impl Future<Output=T>`, async traits now stable
- **`let-else`** statements - pattern matching with early return: `let Some(x) = val else { return; };`
- **Error propagation** - `?` operator patterns, `From` trait for error conversion
- **Pattern matching** - exhaustive match on Option/Result, nested patterns
- **Ownership/borrowing** - core Rust concepts with practical examples

### Key Code Patterns (from context7)
- Error propagation: `File::open("file.txt")?` with Result return types
- Match on Option: `match x { None => None, Some(i) => Some(i + 1) }`
- Async desugaring: `async fn foo() -> User` == `fn foo() -> impl Future<Output = User>`
- let-else for clean early returns with pattern destructuring

### Style Recommendations (unused styles that fit Rust)
1. **copper-verdigris** - Literally about oxidation/patina; perfect thematic match for Rust (the name!)
2. **neo-void** - Dark, bold, structural; reflects systems-level and low-level memory programming
3. **constructivism** - Sharp, structural, purposeful; reflects Rust's precision and safety-focused design
