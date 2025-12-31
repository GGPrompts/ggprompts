// ============================================================================
// STOCK API TYPES
// ============================================================================

// Finnhub quote response
export interface FinnhubQuote {
  c: number   // Current price
  d: number   // Change
  dp: number  // Percent change
  h: number   // High price of the day
  l: number   // Low price of the day
  o: number   // Open price of the day
  pc: number  // Previous close price
  t: number   // Timestamp
}

// Finnhub company profile
export interface FinnhubProfile {
  country: string
  currency: string
  exchange: string
  finnhubIndustry: string
  ipo: string
  logo: string
  marketCapitalization: number
  name: string
  phone: string
  shareOutstanding: number
  ticker: string
  weburl: string
}

// Finnhub basic financials (for P/E, 52-week high/low, etc.)
export interface FinnhubMetrics {
  "52WeekHigh": number
  "52WeekLow": number
  "52WeekHighDate": string
  "52WeekLowDate": string
  peBasicExclExtraTTM: number
  peExclExtraAnnual: number
  pbAnnual: number
  dividendYieldIndicatedAnnual: number
  epsBasicExclExtraItemsTTM: number
  marketCapitalization: number
  "10DayAverageTradingVolume": number
}

// Normalized stock data for our app
export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  volume: number
  marketCap: string
  pe: number | null
  week52High: number | null
  week52Low: number | null
  avgVolume: number | null
  timestamp: number
}

// Historical candle data
export interface StockCandle {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// API response types
export interface QuoteResponse {
  quotes: StockQuote[]
  fetchedAt: string
  errors?: { symbol: string; error: string }[]
}

export interface HistoryResponse {
  symbol: string
  candles: StockCandle[]
  fetchedAt: string
}

// ============================================================================
// PAPER TRADING TYPES
// ============================================================================

export interface Position {
  symbol: string
  shares: number
  avgCost: number
  currentPrice?: number
  currentValue?: number
  gainLoss?: number
  gainLossPercent?: number
}

export interface Transaction {
  id: string
  type: "buy" | "sell"
  symbol: string
  shares: number
  price: number
  total: number
  timestamp: string
}

export interface Portfolio {
  cash: number
  positions: Position[]
  transactions: Transaction[]
  watchlist: string[]
  createdAt: string
  updatedAt: string
}

// Default starting portfolio
export const DEFAULT_PORTFOLIO: Portfolio = {
  cash: 100000,
  positions: [],
  transactions: [],
  watchlist: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Popular stocks for default watchlist
export const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ORCL", name: "Oracle Corporation" },
]
