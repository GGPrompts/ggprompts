import { DailyNews, sampleNewsData } from './types'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'lib/news/data')
const LATEST_FILE = path.join(DATA_DIR, 'latest.json')

/**
 * Load the latest news digest from JSON file
 * Falls back to sampleNewsData if file doesn't exist or is invalid
 */
export function loadLatestNews(): DailyNews {
  try {
    if (fs.existsSync(LATEST_FILE)) {
      const raw = fs.readFileSync(LATEST_FILE, 'utf-8')
      const data = JSON.parse(raw) as DailyNews
      return data
    }
  } catch (error) {
    console.error('Failed to load latest news:', error)
  }
  return sampleNewsData
}

/**
 * Load news for a specific date
 * @param date - ISO date string (YYYY-MM-DD)
 */
export function loadNewsByDate(date: string): DailyNews | null {
  try {
    const filePath = path.join(DATA_DIR, `${date}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(raw) as DailyNews
    }
  } catch (error) {
    console.error(`Failed to load news for ${date}:`, error)
  }
  return null
}

/**
 * Get list of available news dates (for archive navigation)
 */
export function getAvailableDates(): string[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      return []
    }
    const files = fs.readdirSync(DATA_DIR)
    return files
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.json$/))
      .map(f => f.replace('.json', ''))
      .sort()
      .reverse() // Most recent first
  } catch (error) {
    console.error('Failed to get available dates:', error)
    return []
  }
}

/**
 * Save news data to file (for use by the generator)
 * Saves both to dated file and updates latest.json
 */
export function saveNews(news: DailyNews): void {
  const dateFile = path.join(DATA_DIR, `${news.date}.json`)
  const content = JSON.stringify(news, null, 2)

  // Ensure directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // Write dated archive file
  fs.writeFileSync(dateFile, content, 'utf-8')

  // Update latest.json
  fs.writeFileSync(LATEST_FILE, content, 'utf-8')
}
