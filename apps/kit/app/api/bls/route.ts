import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// BLS API v1 (no registration required, 25 queries/day limit)
const BLS_API_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/"

// Cache for BLS data (annual data, cache for 24 hours)
const blsCache = new Map<string, { data: BLSResponse; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Occupation codes for tech jobs (OEWS)
// Format: OEUN + area(6) + industry(6) + occupation(6) + datatype(2)
// Area 000000 = National, Industry 000000 = All, Datatype 04 = Annual Mean Wage
export const TECH_OCCUPATIONS = {
  "software-developers": {
    code: "15-1252",
    name: "Software Developers",
    seriesId: "OEUN000000000000015125204", // Annual mean wage
  },
  "data-scientists": {
    code: "15-2051",
    name: "Data Scientists",
    seriesId: "OEUN000000000000015205104",
  },
  "computer-programmers": {
    code: "15-1251",
    name: "Computer Programmers",
    seriesId: "OEUN000000000000015125104",
  },
  "web-developers": {
    code: "15-1254",
    name: "Web Developers",
    seriesId: "OEUN000000000000015125404",
  },
  "database-admins": {
    code: "15-1242",
    name: "Database Administrators",
    seriesId: "OEUN000000000000015124204",
  },
  "network-architects": {
    code: "15-1241",
    name: "Computer Network Architects",
    seriesId: "OEUN000000000000015124104",
  },
  "info-security": {
    code: "15-1212",
    name: "Information Security Analysts",
    seriesId: "OEUN000000000000015121204",
  },
  "systems-analysts": {
    code: "15-1211",
    name: "Computer Systems Analysts",
    seriesId: "OEUN000000000000015121104",
  },
  "it-managers": {
    code: "11-3021",
    name: "Computer & IS Managers",
    seriesId: "OEUN000000000000011302104",
  },
  "ai-ml-specialists": {
    // Note: BLS doesn't have a specific AI/ML category yet, using Data Scientists as proxy
    code: "15-2051",
    name: "AI/ML Specialists (proxy)",
    seriesId: "OEUN000000000000015205104",
  },
}

interface BLSSeriesData {
  seriesID: string
  data: Array<{
    year: string
    period: string
    periodName: string
    value: string
    footnotes: Array<{ code: string; text: string }>
  }>
}

interface BLSApiResponse {
  status: string
  responseTime: number
  message: string[]
  Results?: {
    series: BLSSeriesData[]
  }
}

interface OccupationData {
  id: string
  code: string
  name: string
  currentSalary: number
  previousSalary: number
  change: number
  changePercent: number
  trend: "up" | "down" | "flat"
  history: Array<{ year: string; salary: number }>
}

interface BLSResponse {
  occupations: OccupationData[]
  fetchedAt: string
  source: string
  note: string
}

function getCacheKey(seriesIds: string[]): string {
  return seriesIds.sort().join(",")
}

async function fetchBLSData(seriesIds: string[]): Promise<BLSApiResponse | null> {
  try {
    const response = await fetch(BLS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seriesid: seriesIds,
        startyear: "2019",
        endyear: "2024",
        catalog: false,
        calculations: false,
        annualaverage: true,
      }),
    })

    if (!response.ok) {
      console.error("BLS API error:", response.status, response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("BLS API fetch error:", error)
    return null
  }
}

function parseOccupationData(
  seriesData: BLSSeriesData,
  occupationInfo: { id: string; code: string; name: string }
): OccupationData | null {
  // Filter for annual data (period A01 for OEWS annual data, or M13 for monthly annual average)
  const annualData = seriesData.data
    .filter((d) => d.period === "A01" || d.period === "M13")
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))

  if (annualData.length === 0) return null

  const currentYear = annualData[0]
  const previousYear = annualData[1]

  const currentSalary = parseInt(currentYear.value.replace(/,/g, ""))
  const previousSalary = previousYear ? parseInt(previousYear.value.replace(/,/g, "")) : currentSalary

  const change = currentSalary - previousSalary
  const changePercent = previousSalary ? ((change / previousSalary) * 100) : 0

  return {
    id: occupationInfo.id,
    code: occupationInfo.code,
    name: occupationInfo.name,
    currentSalary,
    previousSalary,
    change,
    changePercent: Math.round(changePercent * 10) / 10,
    trend: change > 0 ? "up" : change < 0 ? "down" : "flat",
    history: annualData.map((d) => ({
      year: d.year,
      salary: parseInt(d.value.replace(/,/g, "")),
    })).reverse(),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const occupationsParam = searchParams.get("occupations")

  // Determine which occupations to fetch
  let selectedOccupations: string[]
  if (occupationsParam) {
    selectedOccupations = occupationsParam.split(",").filter((o) => o in TECH_OCCUPATIONS)
  } else {
    // Default: top 6 tech occupations
    selectedOccupations = [
      "software-developers",
      "data-scientists",
      "info-security",
      "it-managers",
      "web-developers",
      "systems-analysts",
    ]
  }

  if (selectedOccupations.length === 0) {
    return NextResponse.json({ error: "No valid occupations specified" }, { status: 400 })
  }

  // Get series IDs for selected occupations
  const seriesIds = selectedOccupations.map(
    (o) => TECH_OCCUPATIONS[o as keyof typeof TECH_OCCUPATIONS].seriesId
  )

  // Check cache
  const cacheKey = getCacheKey(seriesIds)
  const cached = blsCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  // Fetch from BLS API
  const blsResponse = await fetchBLSData(seriesIds)

  if (!blsResponse || blsResponse.status !== "REQUEST_SUCCEEDED" || !blsResponse.Results) {
    // Return cached data if available, even if stale
    if (cached) {
      return NextResponse.json({
        ...cached.data,
        note: "Using cached data (BLS API unavailable)",
      })
    }
    return NextResponse.json(
      { error: "Failed to fetch BLS data", messages: blsResponse?.message },
      { status: 500 }
    )
  }

  // Parse the response
  const occupations: OccupationData[] = []
  for (const series of blsResponse.Results.series) {
    // Find matching occupation
    const occupationEntry = Object.entries(TECH_OCCUPATIONS).find(
      ([, info]) => info.seriesId === series.seriesID
    )
    if (occupationEntry) {
      const [id, info] = occupationEntry
      const parsed = parseOccupationData(series, { id, ...info })
      if (parsed) {
        occupations.push(parsed)
      }
    }
  }

  // Sort by current salary descending
  occupations.sort((a, b) => b.currentSalary - a.currentSalary)

  const response: BLSResponse = {
    occupations,
    fetchedAt: new Date().toISOString(),
    source: "U.S. Bureau of Labor Statistics - Occupational Employment and Wage Statistics",
    note: "Annual mean wages for selected occupations. Data updated annually.",
  }

  // Cache the response
  blsCache.set(cacheKey, { data: response, timestamp: Date.now() })

  return NextResponse.json(response)
}
