import { NextRequest, NextResponse } from "next/server"
import {
  FinnhubQuote,
  FinnhubProfile,
  FinnhubMetrics,
  StockQuote,
  QuoteResponse,
  POPULAR_STOCKS,
} from "./types"

export const dynamic = "force-dynamic"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

// Cache for company profiles (rarely change)
const profileCache = new Map<string, { profile: FinnhubProfile; timestamp: number }>()
const PROFILE_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Cache for metrics (P/E, 52-week, etc.)
const metricsCache = new Map<string, { metrics: FinnhubMetrics; timestamp: number }>()
const METRICS_CACHE_TTL = 60 * 60 * 1000 // 1 hour

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`
  if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`
  if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`
  return marketCap.toString()
}

async function fetchQuote(symbol: string): Promise<FinnhubQuote | null> {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    )
    if (!response.ok) return null
    const data = await response.json()
    // Finnhub returns empty object for invalid symbols
    if (!data.c && data.c !== 0) return null
    return data
  } catch {
    return null
  }
}

async function fetchProfile(symbol: string): Promise<FinnhubProfile | null> {
  // Check cache first
  const cached = profileCache.get(symbol)
  if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_TTL) {
    return cached.profile
  }

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )
    if (!response.ok) return null
    const data = await response.json()
    if (!data.name) return null

    profileCache.set(symbol, { profile: data, timestamp: Date.now() })
    return data
  } catch {
    return null
  }
}

async function fetchMetrics(symbol: string): Promise<FinnhubMetrics | null> {
  // Check cache first
  const cached = metricsCache.get(symbol)
  if (cached && Date.now() - cached.timestamp < METRICS_CACHE_TTL) {
    return cached.metrics
  }

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    if (!response.ok) return null
    const data = await response.json()
    if (!data.metric) return null

    metricsCache.set(symbol, { metrics: data.metric, timestamp: Date.now() })
    return data.metric
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  if (!FINNHUB_API_KEY) {
    return NextResponse.json(
      { error: "Finnhub API key not configured. Add FINNHUB_API_KEY to .env.local" },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const symbolsParam = searchParams.get("symbols")
  const includeMetrics = searchParams.get("metrics") !== "false"

  // Parse symbols or use default watchlist
  const symbols = symbolsParam
    ? symbolsParam.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
    : POPULAR_STOCKS.map((s) => s.symbol).slice(0, 8)

  if (symbols.length === 0) {
    return NextResponse.json({ error: "No symbols specified" }, { status: 400 })
  }

  // Limit to 20 symbols per request to respect rate limits
  const limitedSymbols = symbols.slice(0, 20)

  const quotes: StockQuote[] = []
  const errors: { symbol: string; error: string }[] = []

  // Fetch all quotes in parallel
  await Promise.all(
    limitedSymbols.map(async (symbol) => {
      try {
        // Fetch quote (required)
        const quote = await fetchQuote(symbol)
        if (!quote) {
          errors.push({ symbol, error: "Quote not found" })
          return
        }

        // Fetch profile for name (use cached if available)
        const profile = await fetchProfile(symbol)
        const name = profile?.name || POPULAR_STOCKS.find((s) => s.symbol === symbol)?.name || symbol

        // Fetch metrics for P/E, 52-week, etc. (optional)
        let metrics: FinnhubMetrics | null = null
        if (includeMetrics) {
          metrics = await fetchMetrics(symbol)
        }

        const stockQuote: StockQuote = {
          symbol,
          name,
          price: quote.c,
          change: quote.d,
          changePercent: quote.dp,
          high: quote.h,
          low: quote.l,
          open: quote.o,
          previousClose: quote.pc,
          volume: 0, // Finnhub quote doesn't include volume, would need separate call
          marketCap: profile?.marketCapitalization
            ? formatMarketCap(profile.marketCapitalization * 1e6) // Finnhub returns in millions
            : "N/A",
          pe: metrics?.peBasicExclExtraTTM || null,
          week52High: metrics?.["52WeekHigh"] || null,
          week52Low: metrics?.["52WeekLow"] || null,
          avgVolume: metrics?.["10DayAverageTradingVolume"]
            ? metrics["10DayAverageTradingVolume"] * 1e6
            : null,
          timestamp: quote.t * 1000,
        }

        quotes.push(stockQuote)
      } catch (e) {
        errors.push({ symbol, error: e instanceof Error ? e.message : "Unknown error" })
      }
    })
  )

  // Sort by original order
  quotes.sort((a, b) => limitedSymbols.indexOf(a.symbol) - limitedSymbols.indexOf(b.symbol))

  const response: QuoteResponse = {
    quotes,
    fetchedAt: new Date().toISOString(),
    ...(errors.length > 0 && { errors }),
  }

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
