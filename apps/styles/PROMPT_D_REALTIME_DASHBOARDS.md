# Real-Time Data Dashboard Suite - Build Prompts for Claude.ai

## CONTEXT
I'm building a portfolio website with 101 production-ready Next.js templates. I need you to create **5 real-time streaming data dashboards** that showcase live data visualization, websocket simulation, and dynamic updates.

**Tech Stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion (3D animations, live updates)
- Recharts (for charts)
- shadcn/ui components
- Glassmorphism design (terminal theme with emerald/cyan glow)

**File Location:** `/home/matt/projects/portfolio-style-guides/app/templates/[template-name]/page.tsx`

**Design System:**
- **Theme**: Terminal-inspired with emerald/cyan accents on dark slate
- **Glassmorphism**: Use `.glass` utility class (frosted glass effect)
- **Animations**: Framer Motion for real-time updates, number countups
- **Icons**: lucide-react
- **Components**: Use shadcn/ui (Button, Card, Badge, Tabs, Dialog, Table, Progress, etc.)

---

## TEMPLATE 1: STOCK TRADING DASHBOARD

### Requirements
Create a real-time stock trading dashboard at `/app/templates/stock-trading-dashboard/page.tsx`

**Core Features:**

1. **Portfolio Overview:**
   - Total portfolio value (animated counter)
   - Day's gain/loss ($ and %)
   - Available cash
   - Buying power
   - Portfolio performance chart (30-day trend)

2. **Watchlist:**
   - 10-15 stocks with live prices
   - Ticker symbol, company name
   - Current price, change ($, %)
   - Sparkline (mini chart, last 24h)
   - Color-coded (green=up, red=down)
   - Add/remove stocks
   - Sort by gainers/losers

3. **Live Price Chart:**
   - Candlestick or line chart
   - 1D, 5D, 1M, 6M, 1Y, 5Y views
   - Volume bars below
   - Moving averages (MA50, MA200)
   - Real-time price updates (simulated)
   - Crosshair with value tooltip

4. **Order Book:**
   - Live bid/ask spread
   - Top 10 bids (green)
   - Top 10 asks (red)
   - Order depth visualization
   - Last trade price
   - Market depth chart

5. **Recent Trades:**
   - Scrolling feed of executed trades
   - Time, price, volume
   - Buy/sell indicator
   - Aggregate volume
   - Trade direction arrows

6. **Trading Panel:**
   - Buy/Sell tabs
   - Order type (Market, Limit, Stop)
   - Quantity input
   - Price input (for limit orders)
   - Order preview
   - Place order button (non-functional, just UI)

7. **Market Stats:**
   - Market status (Open/Closed/Pre-market)
   - Opening price, high, low
   - Previous close
   - 52-week high/low
   - Average volume
   - Market cap, P/E ratio

8. **Alerts & News:**
   - Price alerts (above/below threshold)
   - Breaking news feed
   - Earnings calendar
   - Dividend notifications

**Mock Data:**
- Portfolio value: $142,384.23 (+$2,843.11 / +2.04%)
- Stocks: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META, NFLX, etc.
- Live price updates every 1-2 seconds
- Bid-ask spread: $175.32 / $175.35
- Recent trades scrolling in real-time

**Design Notes:**
- Price changes flash green/red on update
- Animated number countup for portfolio value
- Candlestick chart with emerald/red colors
- Order book depth visualization
- Sparklines with gradient fills

---

## TEMPLATE 2: IOT SENSOR DASHBOARD

### Requirements
Create an IoT sensor monitoring dashboard at `/app/templates/iot-sensor-dashboard/page.tsx`

**Core Features:**

1. **Sensor Grid:**
   - 12-20 sensors displayed as cards
   - Sensor type icon (temperature, humidity, pressure, motion, etc.)
   - Current reading (big number)
   - Unit (°C, %, kPa, etc.)
   - Status (Online/Offline/Warning/Critical)
   - Last updated (relative time)
   - Mini trend chart

2. **Live Time Series Charts:**
   - Multi-line chart with 4-6 sensors
   - Real-time data streaming in
   - Auto-scroll (last 100 data points)
   - Toggle sensors on/off
   - Y-axis auto-scaling
   - Zoom/pan controls

3. **Sensor Map:**
   - Floor plan or facility layout
   - Sensor locations pinned
   - Color-coded by status
   - Hover for current reading
   - Click to focus on sensor
   - Heat map overlay (temperature zones)

4. **Alerts & Thresholds:**
   - Active alerts panel
   - Alert severity (Critical/Warning/Info)
   - Threshold violations
   - Alert history timeline
   - Acknowledge/dismiss controls
   - Alert sound toggle

5. **Anomaly Detection:**
   - ML-detected anomalies
   - Outlier sensors highlighted
   - Anomaly score (0-100)
   - Pattern deviation indicators
   - Suggested investigations

6. **Environmental Controls:**
   - HVAC system status
   - Target temperature settings
   - Fan speed controls
   - Humidity controls
   - Energy consumption

7. **Historical Data:**
   - Date range selector
   - Aggregation (hourly, daily, weekly)
   - Export data (CSV, JSON)
   - Comparison with past periods
   - Statistical summary (min, max, avg, std dev)

8. **Device Health:**
   - Battery levels (for wireless sensors)
   - Signal strength (WiFi/cellular)
   - Firmware version
   - Last maintenance date
   - Calibration status

**Mock Data:**
- 18 sensors across 3 zones
- Temperature sensors: 18-24°C
- Humidity: 45-65%
- Pressure: 1010-1015 hPa
- Motion sensors: 0/1 (binary)
- 3 active alerts (2 warnings, 1 critical)
- Update frequency: 5 seconds

**Design Notes:**
- Sensor cards with glassmorphic design
- Critical sensors pulse with red glow
- Live charts with smooth animations
- Heat map uses gradient overlay
- Alert badges with notification count

---

## TEMPLATE 3: SOCIAL MEDIA ANALYTICS

### Requirements
Create a real-time social media analytics dashboard at `/app/templates/social-analytics-dashboard/page.tsx`

**Core Features:**

1. **Real-Time Metrics:**
   - Followers count (live counter)
   - Engagement rate (%)
   - Impressions (today)
   - Clicks, shares, saves
   - Growth rate (vs yesterday)
   - Animated number countups

2. **Live Activity Feed:**
   - New posts, likes, comments streaming in
   - User avatar, action type
   - Post preview
   - Engagement count
   - Time ago (updated live)
   - Filter by platform (Twitter, Instagram, LinkedIn, etc.)

3. **Trending Topics:**
   - Top 10 hashtags (live updates)
   - Hashtag frequency chart
   - Sentiment analysis (positive/negative/neutral)
   - Related keywords
   - Trend momentum (rising/falling)
   - Geography heatmap

4. **Engagement Timeline:**
   - Hourly engagement chart (24h)
   - Peak activity hours
   - Day-over-day comparison
   - Engagement by post type (image, video, text, link)
   - Optimal posting times

5. **Audience Demographics:**
   - Age distribution (pie chart)
   - Gender breakdown
   - Top locations (map/list)
   - Language preferences
   - Device types (mobile/desktop/tablet)
   - Interest categories

6. **Top Performing Posts:**
   - Grid of highest engagement posts
   - Engagement metrics (likes, comments, shares)
   - Reach and impressions
   - Post thumbnail/preview
   - Posted date
   - Platform icon

7. **Competitor Comparison:**
   - 3-5 competitors
   - Follower count comparison
   - Engagement rate comparison
   - Share of voice (%)
   - Growth velocity
   - Content frequency

8. **Sentiment Analysis:**
   - Overall sentiment score (-100 to +100)
   - Sentiment over time chart
   - Positive vs negative mentions
   - Common complaints/praise
   - Word cloud of frequent terms

**Mock Data:**
- Total followers: 284,392 (+1,247 today)
- Engagement rate: 4.8% (+0.3%)
- Impressions: 1.2M (today)
- Trending hashtag: #AI (12.3K mentions)
- Top post: 45K likes, 2.3K comments, 8.9K shares
- Sentiment: +67 (positive)

**Design Notes:**
- Live counter animations for follower growth
- Activity feed with fade-in animations
- Sentiment gauge with color gradient
- Platform icons (Twitter/X, Instagram, LinkedIn)
- Trending topics word cloud
- Competitor cards with comparison arrows

---

## TEMPLATE 4: GAMING LEADERBOARD

### Requirements
Create a real-time gaming leaderboard dashboard at `/app/templates/gaming-leaderboard/page.tsx`

**Core Features:**

1. **Live Leaderboard:**
   - Top 100 players ranked
   - Player rank, username, avatar
   - Current score/points
   - Rank change indicator (↑↓)
   - Level/tier badge
   - Real-time rank updates
   - Highlight current user
   - Podium display (top 3)

2. **Player Stats:**
   - Total games played
   - Win/loss record
   - Win rate (%)
   - Average score
   - Best score
   - Current streak
   - Achievements unlocked
   - Play time (hours)

3. **Match History:**
   - Recent 20 matches
   - Match result (Win/Loss/Draw)
   - Score, opponent
   - Duration
   - Game mode
   - Rewards earned
   - Replay button

4. **Live Matches:**
   - Ongoing matches display
   - Players in match
   - Current scores
   - Time elapsed
   - Spectate button
   - Match updates every few seconds

5. **Tournament Bracket:**
   - Visual bracket tree
   - Round progression
   - Match results
   - Next match schedule
   - Prize pool distribution
   - Elimination status

6. **Global Stats:**
   - Total players online
   - Matches in progress
   - Matches completed today
   - Average match duration
   - Most popular game mode
   - Server status

7. **Achievement Showcase:**
   - Rare achievements
   - Achievement rarity (%)
   - Recently unlocked
   - Progress toward next achievement
   - Achievement icons
   - Unlock conditions

8. **Season Progress:**
   - Current season end date
   - Season rank
   - Season pass tiers
   - Rewards unlocked/locked
   - Progress bars
   - Next tier preview

**Mock Data:**
- Top player: "xX_ProGamer_Xx" (245,892 points)
- Current user: Rank #47 (↑3 from yesterday)
- Win rate: 62.4% (287 wins, 173 losses)
- Matches today: 1,247 active, 4,829 completed
- Season 8 ends in 14 days, 6 hours

**Design Notes:**
- Podium visualization for top 3 (gold/silver/bronze)
- Rank changes with animated arrows
- Live match updates with pulse effect
- Tournament bracket with connecting lines
- Achievement badges with rarity glow
- Season progress bar with milestones

---

## TEMPLATE 5: LIVE WEATHER MONITORING

### Requirements
Create a real-time weather monitoring dashboard at `/app/templates/live-weather-dashboard/page.tsx`

**Core Features:**

1. **Current Conditions:**
   - Large temperature display
   - "Feels like" temperature
   - Weather icon (animated)
   - Conditions description
   - Location, local time
   - Last updated timestamp

2. **Hourly Forecast:**
   - Next 24 hours
   - Hourly temp, conditions
   - Precipitation chance (%)
   - Wind speed, direction
   - Humidity, visibility
   - Scrollable timeline

3. **7-Day Forecast:**
   - Daily cards
   - High/low temps
   - Conditions icon
   - Precipitation probability
   - Sunrise/sunset times
   - UV index

4. **Live Weather Map:**
   - Radar overlay (precipitation)
   - Temperature heat map
   - Wind direction arrows
   - Storm tracking
   - Layer toggles (clouds, rain, snow, wind)
   - Zoom/pan controls
   - Animation timeline

5. **Severe Weather Alerts:**
   - Active alerts panel
   - Alert type (tornado, flood, heat, etc.)
   - Severity (Extreme/Severe/Moderate/Minor)
   - Affected areas
   - Start/end time
   - Alert description
   - Safety instructions

6. **Air Quality Index:**
   - AQI value (0-500)
   - AQI category (Good/Moderate/Unhealthy/etc.)
   - Pollutant levels (PM2.5, PM10, O3, CO, etc.)
   - Health recommendations
   - AQI trend chart
   - Color-coded scale

7. **Weather Metrics:**
   - Barometric pressure
   - Dew point
   - Humidity (%)
   - Wind speed/gusts
   - Visibility (miles/km)
   - Cloud cover (%)
   - Moon phase

8. **Historical Comparison:**
   - Temperature vs normal
   - Precipitation deficit/surplus
   - Record high/low for today
   - Year-over-year comparison
   - Climate trends

**Mock Data:**
- Location: San Francisco, CA
- Current: 68°F, Partly Cloudy
- Feels like: 65°F
- Humidity: 72%
- Wind: 12 mph NW
- Pressure: 30.02 in
- UV Index: 6 (High)
- 1 active alert: "Wind Advisory"
- AQI: 42 (Good)

**Design Notes:**
- Animated weather icons (sun, clouds, rain)
- Temperature with large display font
- Hourly forecast with horizontal scroll
- Weather map with layer toggles
- Alert banners with severity colors
- AQI gauge with color gradient (green→yellow→red)
- Wind compass visualization

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
  // Real-time update simulation
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Template content */}
    </div>
  )
}
```

### Real-Time Updates
```tsx
// Simulate live data streaming
useEffect(() => {
  const interval = setInterval(() => {
    setData(prev => {
      const newPoint = generateNewDataPoint()
      return [...prev.slice(-99), newPoint] // Keep last 100 points
    })
  }, 2000) // Update every 2 seconds

  return () => clearInterval(interval)
}, [])
```

### Animated Number Countup
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  key={value} // Trigger animation on value change
>
  {value.toLocaleString()}
</motion.div>
```

### Flash on Change
```tsx
<motion.div
  animate={{
    backgroundColor: isIncreasing ?
      'rgba(16, 185, 129, 0.2)' :
      'rgba(239, 68, 68, 0.2)'
  }}
  transition={{ duration: 0.3 }}
>
  {value}
</motion.div>
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

### Color Coding
- **Increase/Positive**: Emerald (`text-emerald-500`)
- **Decrease/Negative**: Red (`text-red-500`)
- **Neutral**: Slate (`text-slate-400`)
- **Warning**: Amber (`text-amber-500`)
- **Info**: Cyan (`text-cyan-500`)

---

## TASK FOR YOU

**Please create all 5 templates** in separate code blocks, following:
1. All TypeScript types defined
2. Realistic real-time mock data
3. Live update simulations (setInterval, useEffect)
4. Animated transitions for data changes
5. Interactive charts using Recharts
6. Glassmorphic design with terminal theme
7. Smooth Framer Motion animations
8. Responsive layout (mobile-first)
9. Comments explaining real-time concepts

**Start with Template 1 (Stock Trading), then Template 2 (IoT Sensors), then Template 3 (Social Analytics), then Template 4 (Gaming Leaderboard), then Template 5 (Live Weather).**

Each template should be 1200-1800 lines of production-quality code. Make them feel ALIVE with real-time updates!

### Pro Tips:
- Add "Last updated 3s ago" timestamps that count up
- Flash elements on data change (green/red)
- Smooth number countup animations
- Scrolling/auto-updating feeds
- Loading skeleton states
- Connection status indicator ("Live", "Connected")
- Pause/resume auto-update button
