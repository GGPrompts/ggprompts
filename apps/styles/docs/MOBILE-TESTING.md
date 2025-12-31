# Mobile UI Testing Tracker

## Status Legend
- **Needs Retest** - Updated, deploy to Vercel and retest
- **Perfect** - Tested and confirmed working on mobile
- **Issues Found** - Problems identified, not yet fixed

---

## Needs Retest (Updated)

| Template | Fixes Applied | Date |
|----------|---------------|------|
| admin-dashboard | Scrollable TabsList | 2025-12-08 |
| affiliates | Scrollable TabsList | 2025-12-08 |
| ai-agent-dashboard | Scrollable TabsList, header buttons | 2025-12-08 |
| analytics-dashboard | Scrollable charts, responsive header/tabs | 2025-12-08 |
| api-playground | Scrollable TabsList | 2025-12-08 |
| claude-component-studio | Scrollable TabsList | 2025-12-08 |
| cron-builder | Scrollable TabsList | 2025-12-08 |
| devops-dashboard | Header buttons, server health legend | 2025-12-08 |
| docs-hub | Scrollable TabsList | 2025-12-08 |
| finance-dashboard | Header buttons, invoices section header/table | 2025-12-08 |
| iot-sensor-dashboard | Header buttons | 2025-12-08 |
| kubernetes-dashboard | Scrollable TabsList | 2025-12-08 |
| leaderboard | Scrollable TabsList | 2025-12-08 |
| llm-training-dashboard | Scrollable TabsList, header buttons | 2025-12-08 |
| maintenance | Scrollable TabsList | 2025-12-08 |
| marketing-dashboard | Header buttons | 2025-12-08 |
| ml-model-performance | Scrollable TabsList | 2025-12-08 |
| project-case-study | Scrollable TabsList | 2025-12-08 |
| project-technical | Scrollable TabsList | 2025-12-08 |
| prompt-studio | Scrollable TabsList | 2025-12-08 |
| regex-tester | Scrollable TabsList | 2025-12-08 |
| sales-dashboard | Sales rep cards, active deals table/header | 2025-12-08 |
| search-results | Scrollable TabsList | 2025-12-08 |
| social-analytics-dashboard | Header, charts, trending topics, sentiment | 2025-12-08 |
| sprint-board | Scrollable TabsList | 2025-12-08 |
| stock-trading-dashboard | Header buttons | 2025-12-08 |
| support-dashboard | Header buttons | 2025-12-08 |
| terraform-dashboard | Scrollable TabsList, workspace selector, header buttons | 2025-12-08 |
| timeline | Scrollable TabsList | 2025-12-08 |
| usage-metering | Scrollable TabsList | 2025-12-08 |
| user-profile | Scrollable TabsList | 2025-12-08 |
| vector-db-dashboard | Scrollable TabsList, responsive header buttons | 2025-12-08 |

---

## Perfect (Confirmed Working)

| Template | Tested Date | Notes |
|----------|-------------|-------|
| | | |

---

## Issues Found (Not Yet Fixed)

| Template | Issues | Reported |
|----------|--------|----------|
| | | |

---

## Common Patterns Fixed

These patterns are being applied across templates:

1. **TabsList overflow** - Wrap in `overflow-x-auto` div with `w-max` on TabsList
2. **Chart overflow** - Wrap ResponsiveContainer in scrollable div with `min-w-[Xpx]`
3. **Header buttons** - Use `flex-wrap`, hide text on mobile (icon-only)
4. **Complex card layouts** - Stack vertically on mobile with `flex-col sm:flex-row`
