import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

interface SearchResult {
  symbol: string
  name: string
  type: string
  exchange: string
}

export async function GET(request: NextRequest) {
  if (!FINNHUB_API_KEY) {
    return NextResponse.json(
      { error: "Finnhub API key not configured" },
      { status: 500 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.trim()

  if (!query || query.length < 1) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search stocks" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Filter to only US stocks (common stocks on major exchanges)
    const results: SearchResult[] = (data.result || [])
      .filter((item: { type: string; symbol: string }) =>
        item.type === "Common Stock" &&
        !item.symbol.includes(".") // Exclude foreign listings like AAPL.MX
      )
      .slice(0, 10) // Limit to 10 results
      .map((item: { symbol: string; description: string; type: string; displaySymbol: string }) => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type,
        exchange: item.displaySymbol?.split(":")[0] || "US",
      }))

    return NextResponse.json(
      { results, query },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    )
  } catch (error) {
    console.error("Error searching stocks:", error)
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    )
  }
}
