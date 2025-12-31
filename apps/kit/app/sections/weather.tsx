"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  Sun,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  MapPin,
  Calendar,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Navigation,
  Thermometer,
  Activity,
  Zap,
  CloudHail,
  Snowflake,
  Waves,
  Search,
  Download,
  Layers,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ============================================================================
// TYPES
// ============================================================================

type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "drizzle"
  | "snow"
  | "fog"
  | "thunderstorm"
  | "hail"

type AlertSeverity = "extreme" | "severe" | "moderate" | "minor"
type AlertType = "tornado" | "flood" | "heat" | "winter-storm" | "wind" | "fire"

interface CurrentWeather {
  temperature: number
  feelsLike: number
  condition: WeatherCondition
  description: string
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  visibility: number
  cloudCover: number
  uvIndex: number
  dewPoint: number
  precipitation: number
}

interface HourlyForecast {
  hour: string
  temp: number
  condition: WeatherCondition
  precipChance: number
  windSpeed: number
  humidity: number
}

interface DailyForecast {
  day: string
  highTemp: number
  lowTemp: number
  condition: WeatherCondition
  precipChance: number
  sunrise: string
  sunset: string
  uvIndex: number
}

interface WeatherAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  fullDescription?: string
  affectedAreas: string[]
  startTime: Date
  endTime: Date
  safetyInstructions: string[]
  detailsUrl?: string
}

interface AirQuality {
  aqi: number
  category: "good" | "moderate" | "unhealthy" | "very-unhealthy" | "hazardous"
  pm25: number
  pm10: number
  o3: number
  co: number
  no2: number
  so2: number
  healthRecommendation: string
}

interface HistoricalComparison {
  metric: string
  current: number
  normal: number
  record: number
  unit: string
}

interface GeoLocation {
  latitude: number
  longitude: number
  name: string
}

// Open-Meteo API response types
interface OpenMeteoCurrentWeather {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  precipitation: number
  weather_code: number
  cloud_cover: number
  pressure_msl: number
  wind_speed_10m: number
  wind_direction_10m: number
  is_day: number
}

interface OpenMeteoHourly {
  time: string[]
  temperature_2m: number[]
  relative_humidity_2m: number[]
  precipitation_probability: number[]
  weather_code: number[]
  wind_speed_10m: number[]
  visibility: number[]
  uv_index: number[]
  dew_point_2m: number[]
}

interface OpenMeteoDaily {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
  precipitation_probability_max: number[]
}

interface OpenMeteoResponse {
  current: OpenMeteoCurrentWeather
  hourly: OpenMeteoHourly
  daily: OpenMeteoDaily
}

interface OpenMeteoAirQuality {
  current: {
    us_aqi: number
    pm2_5: number
    pm10: number
    ozone: number
    carbon_monoxide: number
    nitrogen_dioxide: number
    sulphur_dioxide: number
  }
}

interface GeocodingResult {
  results?: Array<{
    name: string
    latitude: number
    longitude: number
    country: string
    admin1?: string
  }>
}

interface RainViewerData {
  radar: {
    past: Array<{ time: number; path: string }>
    nowcast: Array<{ time: number; path: string }>
  }
  host: string
}

// Combined weather data returned by the query
interface WeatherQueryData {
  currentWeather: CurrentWeather
  hourlyForecast: HourlyForecast[]
  dailyForecast: DailyForecast[]
  airQuality: AirQuality
  weatherAlerts: WeatherAlert[]
  isDaytime: boolean
}

// ============================================================================
// WMO WEATHER CODE MAPPING
// ============================================================================

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
const WMO_CODE_MAP: Record<number, { condition: WeatherCondition; description: string }> = {
  0: { condition: "clear", description: "Clear sky" },
  1: { condition: "clear", description: "Mainly clear" },
  2: { condition: "partly-cloudy", description: "Partly cloudy" },
  3: { condition: "cloudy", description: "Overcast" },
  45: { condition: "fog", description: "Foggy" },
  48: { condition: "fog", description: "Depositing rime fog" },
  51: { condition: "drizzle", description: "Light drizzle" },
  53: { condition: "drizzle", description: "Moderate drizzle" },
  55: { condition: "drizzle", description: "Dense drizzle" },
  56: { condition: "drizzle", description: "Light freezing drizzle" },
  57: { condition: "drizzle", description: "Dense freezing drizzle" },
  61: { condition: "rain", description: "Slight rain" },
  63: { condition: "rain", description: "Moderate rain" },
  65: { condition: "rain", description: "Heavy rain" },
  66: { condition: "rain", description: "Light freezing rain" },
  67: { condition: "rain", description: "Heavy freezing rain" },
  71: { condition: "snow", description: "Slight snow fall" },
  73: { condition: "snow", description: "Moderate snow fall" },
  75: { condition: "snow", description: "Heavy snow fall" },
  77: { condition: "snow", description: "Snow grains" },
  80: { condition: "rain", description: "Slight rain showers" },
  81: { condition: "rain", description: "Moderate rain showers" },
  82: { condition: "rain", description: "Violent rain showers" },
  85: { condition: "snow", description: "Slight snow showers" },
  86: { condition: "snow", description: "Heavy snow showers" },
  95: { condition: "thunderstorm", description: "Thunderstorm" },
  96: { condition: "hail", description: "Thunderstorm with slight hail" },
  99: { condition: "hail", description: "Thunderstorm with heavy hail" },
}

const getWeatherFromCode = (code: number): { condition: WeatherCondition; description: string } => {
  return WMO_CODE_MAP[code] || { condition: "partly-cloudy", description: "Unknown" }
}

// ============================================================================
// MOON PHASE CALCULATION
// ============================================================================

type MoonPhase =
  | "new-moon"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full-moon"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent"

const MOON_PHASE_NAMES: Record<MoonPhase, string> = {
  "new-moon": "New Moon",
  "waxing-crescent": "Waxing Crescent",
  "first-quarter": "First Quarter",
  "waxing-gibbous": "Waxing Gibbous",
  "full-moon": "Full Moon",
  "waning-gibbous": "Waning Gibbous",
  "last-quarter": "Last Quarter",
  "waning-crescent": "Waning Crescent",
}

// Calculate moon phase based on date
// Uses the synodic month (~29.53 days) from a known new moon
function getMoonPhase(date: Date = new Date()): { phase: MoonPhase; illumination: number } {
  // Known new moon: January 6, 2000 at 18:14 UTC
  const knownNewMoon = new Date("2000-01-06T18:14:00Z")
  const synodicMonth = 29.53058867 // Average length of synodic month in days

  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const lunarAge = daysSinceNewMoon % synodicMonth
  const normalizedPhase = lunarAge / synodicMonth // 0 to 1

  // Calculate approximate illumination (0 at new moon, 1 at full moon)
  const illumination = Math.abs(Math.cos(normalizedPhase * Math.PI * 2 - Math.PI))

  // Determine phase name (8 phases, each ~3.69 days)
  let phase: MoonPhase
  if (normalizedPhase < 0.0625) phase = "new-moon"
  else if (normalizedPhase < 0.1875) phase = "waxing-crescent"
  else if (normalizedPhase < 0.3125) phase = "first-quarter"
  else if (normalizedPhase < 0.4375) phase = "waxing-gibbous"
  else if (normalizedPhase < 0.5625) phase = "full-moon"
  else if (normalizedPhase < 0.6875) phase = "waning-gibbous"
  else if (normalizedPhase < 0.8125) phase = "last-quarter"
  else if (normalizedPhase < 0.9375) phase = "waning-crescent"
  else phase = "new-moon"

  return { phase, illumination }
}

// Moon phase icon components
const MoonPhaseIcon = ({ phase, className }: { phase: MoonPhase; className?: string }) => {
  // SVG moon icons for each phase
  const iconProps = { className, viewBox: "0 0 24 24", fill: "currentColor" }

  switch (phase) {
    case "new-moon":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case "waxing-crescent":
      return (
        <svg {...iconProps}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 0 1 0-16c-3 2-5 5-5 8s2 6 5 8z" />
        </svg>
      )
    case "first-quarter":
      return (
        <svg {...iconProps}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18V4a8 8 0 0 1 0 16z" />
        </svg>
      )
    case "waxing-gibbous":
      return (
        <svg {...iconProps}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 0 1 0-16c2 2 3 5 3 8s-1 6-3 8z" />
        </svg>
      )
    case "full-moon":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    case "waning-gibbous":
      return (
        <svg {...iconProps}>
          <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 18a8 8 0 0 0 0-16c-2 2-3 5-3 8s1 6 3 8z" />
        </svg>
      )
    case "last-quarter":
      return (
        <svg {...iconProps}>
          <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 18V4a8 8 0 0 0 0 16z" />
        </svg>
      )
    case "waning-crescent":
      return (
        <svg {...iconProps}>
          <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 18a8 8 0 0 0 0-16c3 2 5 5 5 8s-2 6-5 8z" />
        </svg>
      )
  }
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

const DEFAULT_LOCATION: GeoLocation = {
  latitude: 37.7749,
  longitude: -122.4194,
  name: "San Francisco, CA",
}

async function fetchWeatherData(
  lat: number,
  lon: number,
  unit: "fahrenheit" | "celsius" = "fahrenheit"
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
      "visibility",
      "uv_index",
      "dew_point_2m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_probability_max",
    ].join(","),
    temperature_unit: unit,
    wind_speed_unit: unit === "fahrenheit" ? "mph" : "kmh",
    precipitation_unit: unit === "fahrenheit" ? "inch" : "mm",
    timezone: "auto",
    forecast_days: "7",
  })

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!response.ok) throw new Error("Failed to fetch weather data")
  return response.json()
}

async function fetchAirQuality(lat: number, lon: number): Promise<OpenMeteoAirQuality> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: ["us_aqi", "pm2_5", "pm10", "ozone", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide"].join(","),
  })

  const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`)
  if (!response.ok) throw new Error("Failed to fetch air quality data")
  return response.json()
}

async function searchLocation(query: string): Promise<GeoLocation[]> {
  const params = new URLSearchParams({
    name: query,
    count: "5",
    language: "en",
    format: "json",
  })

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`)
  if (!response.ok) throw new Error("Failed to search location")
  const data: GeocodingResult = await response.json()

  if (!data.results) return []

  return data.results.map((r) => ({
    latitude: r.latitude,
    longitude: r.longitude,
    name: r.admin1 ? `${r.name}, ${r.admin1}, ${r.country}` : `${r.name}, ${r.country}`,
  }))
}

// Fetch NWS (National Weather Service) alerts - free for US locations
async function fetchNWSAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
      {
        headers: {
          "User-Agent": "PersonalHomepage/1.0 (weather dashboard)",
          "Accept": "application/geo+json",
        },
      }
    )
    if (!response.ok) return []

    const data = await response.json()
    if (!data.features || data.features.length === 0) return []

    return data.features.map((feature: any, index: number) => {
      const props = feature.properties

      // Map NWS event types to our alert types
      const eventLower = (props.event || "").toLowerCase()
      let alertType: AlertType = "wind"
      if (eventLower.includes("tornado")) alertType = "tornado"
      else if (eventLower.includes("flood")) alertType = "flood"
      else if (eventLower.includes("heat") || eventLower.includes("hot")) alertType = "heat"
      else if (eventLower.includes("winter") || eventLower.includes("snow") || eventLower.includes("ice") || eventLower.includes("freeze") || eventLower.includes("cold")) alertType = "winter-storm"
      else if (eventLower.includes("fire")) alertType = "fire"
      else if (eventLower.includes("wind") || eventLower.includes("gust")) alertType = "wind"

      // Map NWS severity
      let severity: AlertSeverity = "minor"
      const nwsSeverity = (props.severity || "").toLowerCase()
      if (nwsSeverity === "extreme") severity = "extreme"
      else if (nwsSeverity === "severe") severity = "severe"
      else if (nwsSeverity === "moderate") severity = "moderate"

      // Parse affected areas from areaDesc
      const affectedAreas = props.areaDesc
        ? props.areaDesc.split(";").map((a: string) => a.trim()).slice(0, 3)
        : []

      // Extract safety instructions from description or instruction field
      const instructions = props.instruction
        ? props.instruction.split(/[.!]/).filter((s: string) => s.trim().length > 10).slice(0, 3).map((s: string) => s.trim())
        : []

      // Get the alert URL - either from feature.id or construct from props.id
      const alertUrl = feature.id || (props["@id"] ? props["@id"] : null)

      return {
        id: props.id || `nws-alert-${index}`,
        type: alertType,
        severity,
        title: props.event || "Weather Alert",
        description: props.headline || props.description?.slice(0, 200) || "Weather alert in effect",
        fullDescription: props.description || props.headline || "",
        affectedAreas,
        startTime: new Date(props.effective || Date.now()),
        endTime: new Date(props.expires || Date.now() + 86400000),
        safetyInstructions: instructions.length > 0 ? instructions : ["Stay weather aware", "Monitor local news"],
        detailsUrl: alertUrl,
      }
    })
  } catch (error) {
    console.error("Failed to fetch NWS alerts:", error)
    return []
  }
}

// Fetch RainViewer radar data
async function fetchRainViewerData(): Promise<RainViewerData | null> {
  try {
    const response = await fetch("https://api.rainviewer.com/public/weather-maps.json")
    if (!response.ok) throw new Error("Failed to fetch radar data")
    return response.json()
  } catch {
    return null
  }
}

// Convert lat/lon to tile coordinates for zoom level
function latLonToTile(lat: number, lon: number, zoom: number): { x: number; y: number } {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  )
  return { x, y }
}

// Reverse geocoding using Nominatim (OpenStreetMap)
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "WeatherDashboard/1.0", // Required by Nominatim
        },
      }
    )
    if (!response.ok) throw new Error("Reverse geocoding failed")
    const data = await response.json()

    const address = data.address
    if (address) {
      const city = address.city || address.town || address.village || address.municipality
      const state = address.state
      const country = address.country

      if (city && state) return `${city}, ${state}`
      if (city && country) return `${city}, ${country}`
      if (state && country) return `${state}, ${country}`
    }

    return data.display_name?.split(",").slice(0, 2).join(",") || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
  } catch {
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
  }
}

// Helper to check if a given hour is nighttime based on sunrise/sunset
function isHourNighttime(hourStr: string, sunriseStr: string, sunsetStr: string): boolean {
  // Parse hour string like "07:00 AM" or "11:00 PM"
  const parseTime = (str: string): number => {
    const match = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (!match) return 0
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const period = match[3]?.toUpperCase()

    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0

    return hours * 60 + minutes
  }

  const hourTime = parseTime(hourStr)
  const sunriseTime = parseTime(sunriseStr)
  const sunsetTime = parseTime(sunsetStr)

  // Nighttime is before sunrise or after sunset
  return hourTime < sunriseTime || hourTime >= sunsetTime
}

function getAqiCategory(aqi: number): AirQuality["category"] {
  if (aqi <= 50) return "good"
  if (aqi <= 100) return "moderate"
  if (aqi <= 150) return "unhealthy"
  if (aqi <= 200) return "very-unhealthy"
  return "hazardous"
}

function getAqiRecommendation(category: AirQuality["category"]): string {
  switch (category) {
    case "good":
      return "Air quality is satisfactory for most individuals"
    case "moderate":
      return "Unusually sensitive people should consider reducing prolonged outdoor exertion"
    case "unhealthy":
      return "Everyone may begin to experience health effects; sensitive groups should limit outdoor exertion"
    case "very-unhealthy":
      return "Health alert: everyone may experience more serious health effects"
    case "hazardous":
      return "Health warnings of emergency conditions. Everyone is more likely to be affected"
  }
}

// Combined fetch function for useQuery
async function fetchAllWeatherData(
  lat: number,
  lon: number,
  unit: "fahrenheit" | "celsius"
): Promise<WeatherQueryData> {
  // Fetch weather, air quality, and NWS alerts in parallel
  const [weatherData, aqData, alertsData] = await Promise.all([
    fetchWeatherData(lat, lon, unit),
    fetchAirQuality(lat, lon).catch(() => null),
    fetchNWSAlerts(lat, lon).catch(() => []),
  ])

  // Parse current weather
  const current = weatherData.current
  const weatherInfo = getWeatherFromCode(current.weather_code)

  // Find current hour index for UV and visibility
  const now = new Date()
  const currentHourIndex = weatherData.hourly.time.findIndex((t) => {
    const hourDate = new Date(t)
    return hourDate.getHours() === now.getHours() && hourDate.getDate() === now.getDate()
  })

  const currentWeather: CurrentWeather = {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    condition: weatherInfo.condition,
    description: weatherInfo.description,
    humidity: current.relative_humidity_2m,
    pressure: unit === "fahrenheit"
      ? current.pressure_msl * 0.02953
      : current.pressure_msl,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    visibility: currentHourIndex >= 0
      ? unit === "fahrenheit"
        ? weatherData.hourly.visibility[currentHourIndex] / 1609.34
        : weatherData.hourly.visibility[currentHourIndex] / 1000
      : 10,
    cloudCover: current.cloud_cover,
    uvIndex: currentHourIndex >= 0 ? weatherData.hourly.uv_index[currentHourIndex] : 0,
    dewPoint: currentHourIndex >= 0 ? weatherData.hourly.dew_point_2m[currentHourIndex] : 50,
    precipitation: current.precipitation,
  }

  // Parse hourly forecast (next 24 hours)
  const hourlyForecast: HourlyForecast[] = []
  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0
  for (let i = startIndex; i < Math.min(startIndex + 24, weatherData.hourly.time.length); i++) {
    const hourDate = new Date(weatherData.hourly.time[i])
    const hourWeather = getWeatherFromCode(weatherData.hourly.weather_code[i])

    hourlyForecast.push({
      hour: hourDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(weatherData.hourly.temperature_2m[i]),
      condition: hourWeather.condition,
      precipChance: weatherData.hourly.precipitation_probability[i] || 0,
      windSpeed: Math.round(weatherData.hourly.wind_speed_10m[i]),
      humidity: weatherData.hourly.relative_humidity_2m[i],
    })
  }

  // Parse daily forecast
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dailyForecast: DailyForecast[] = weatherData.daily.time.map((date, i) => {
    const dayDate = new Date(date)
    const dayWeather = getWeatherFromCode(weatherData.daily.weather_code[i])
    const isToday = dayDate.toDateString() === now.toDateString()
    const isTomorrow = dayDate.toDateString() === new Date(now.getTime() + 86400000).toDateString()

    return {
      day: isToday ? "Today" : isTomorrow ? "Tomorrow" : days[dayDate.getDay()],
      highTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
      lowTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
      condition: dayWeather.condition,
      precipChance: weatherData.daily.precipitation_probability_max[i] || 0,
      sunrise: new Date(weatherData.daily.sunrise[i]).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      sunset: new Date(weatherData.daily.sunset[i]).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      uvIndex: Math.round(weatherData.daily.uv_index_max[i]),
    }
  })

  // Parse air quality
  let airQuality: AirQuality = {
    aqi: 0,
    category: "good",
    pm25: 0,
    pm10: 0,
    o3: 0,
    co: 0,
    no2: 0,
    so2: 0,
    healthRecommendation: "Air quality data unavailable",
  }

  if (aqData) {
    const aq = aqData.current
    const category = getAqiCategory(aq.us_aqi)
    airQuality = {
      aqi: aq.us_aqi,
      category,
      pm25: aq.pm2_5,
      pm10: aq.pm10,
      o3: aq.ozone,
      co: aq.carbon_monoxide / 1000,
      no2: aq.nitrogen_dioxide,
      so2: aq.sulphur_dioxide,
      healthRecommendation: getAqiRecommendation(category),
    }
  }

  return {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    airQuality,
    weatherAlerts: alertsData,
    isDaytime: current.is_day === 1,
  }
}

// ============================================================================
// MOCK DATA & GENERATORS
// ============================================================================

const WEATHER_ICONS: Record<WeatherCondition, typeof Cloud> = {
  clear: Sun,
  "partly-cloudy": Cloud,
  cloudy: Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  snow: CloudSnow,
  fog: CloudFog,
  thunderstorm: CloudLightning,
  hail: CloudHail,
}

const INITIAL_WEATHER: CurrentWeather = {
  temperature: 68,
  feelsLike: 65,
  condition: "partly-cloudy",
  description: "Partly Cloudy",
  humidity: 72,
  pressure: 30.02,
  windSpeed: 12,
  windDirection: 315,
  visibility: 10,
  cloudCover: 45,
  uvIndex: 6,
  dewPoint: 58,
  precipitation: 0,
}

const generateHourlyForecast = (currentTemp: number): HourlyForecast[] => {
  const hours: HourlyForecast[] = []
  const now = new Date()
  const conditions: WeatherCondition[] = ["clear", "partly-cloudy", "cloudy", "rain"]

  for (let i = 0; i < 24; i++) {
    const hour = new Date(now.getTime() + i * 3600000)
    const tempVariance = Math.sin(i / 24 * Math.PI * 2) * 8 // Temperature varies throughout day
    const temp = currentTemp + tempVariance + (Math.random() - 0.5) * 3

    hours.push({
      hour: hour.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      temp: Number(temp.toFixed(1)),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipChance: Math.floor(Math.random() * 40),
      windSpeed: Math.floor(Math.random() * 15) + 5,
      humidity: Math.floor(Math.random() * 30) + 50,
    })
  }

  return hours
}

const generateDailyForecast = (currentTemp: number): DailyForecast[] => {
  const days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const conditions: WeatherCondition[] = ["clear", "partly-cloudy", "cloudy", "rain", "thunderstorm"]
  const forecast: DailyForecast[] = []

  for (let i = 0; i < 7; i++) {
    const highTemp = currentTemp + (Math.random() - 0.5) * 10 + 3
    const lowTemp = highTemp - (Math.random() * 12 + 8)

    forecast.push({
      day: days[i],
      highTemp: Number(highTemp.toFixed(0)),
      lowTemp: Number(lowTemp.toFixed(0)),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipChance: Math.floor(Math.random() * 60),
      sunrise: "6:42 AM",
      sunset: "7:28 PM",
      uvIndex: Math.floor(Math.random() * 10) + 1,
    })
  }

  return forecast
}


const AIR_QUALITY: AirQuality = {
  aqi: 42,
  category: "good",
  pm25: 8.2,
  pm10: 15.4,
  o3: 28,
  co: 0.3,
  no2: 12,
  so2: 2,
  healthRecommendation: "Air quality is satisfactory for most individuals",
}

const AQI_COLORS: Record<AirQuality["category"], string> = {
  good: "#10b981",
  moderate: "#f59e0b",
  unhealthy: "#ef4444",
  "very-unhealthy": "#9333ea",
  hazardous: "#7c2d12",
}

const HISTORICAL_DATA: HistoricalComparison[] = [
  { metric: "Temperature", current: 68, normal: 64, record: 89, unit: "°F" },
  { metric: "Precipitation", current: 0.12, normal: 0.45, record: 3.2, unit: "in" },
  { metric: "Wind Speed", current: 12, normal: 8, record: 52, unit: "mph" },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WeatherDashboard({
  activeSubItem,
  onSubItemHandled,
  onAlertCountChange
}: {
  activeSubItem?: string | null
  onSubItemHandled?: () => void
  onAlertCountChange?: (count: number) => void
}) {
  // UI state
  const [isLive, setIsLive] = useState(true)
  const [selectedMapLayer, setSelectedMapLayer] = useState<"radar" | "temperature" | "wind" | "clouds">("radar")

  // Handle sub-item navigation (scroll to section)
  useEffect(() => {
    if (activeSubItem) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`weather-${activeSubItem}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        onSubItemHandled?.()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeSubItem, onSubItemHandled])

  // Location state (persisted in localStorage)
  const [geoLocation, setGeoLocation] = useState<GeoLocation>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weather-location")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Invalid JSON, use default
        }
      }
    }
    return DEFAULT_LOCATION
  })
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Radar map state
  const [radarData, setRadarData] = useState<RainViewerData | null>(null)
  const [radarFrameIndex, setRadarFrameIndex] = useState(0)
  const [isRadarPlaying, setIsRadarPlaying] = useState(true)

  // Temperature unit preference (persisted in localStorage)
  const [tempUnit, setTempUnit] = useState<"fahrenheit" | "celsius">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weather-temp-unit")
      if (saved === "celsius" || saved === "fahrenheit") return saved
    }
    return "fahrenheit"
  })

  // Dismissed alerts (persisted in localStorage)
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weather-dismissed-alerts")
      if (saved) {
        try {
          return new Set(JSON.parse(saved))
        } catch {
          // Invalid JSON
        }
      }
    }
    return new Set()
  })

  const dismissAlert = (alertId: string) => {
    setDismissedAlertIds(prev => {
      const next = new Set(prev)
      next.add(alertId)
      return next
    })
  }

  // Persist dismissed alerts
  useEffect(() => {
    localStorage.setItem("weather-dismissed-alerts", JSON.stringify([...dismissedAlertIds]))
  }, [dismissedAlertIds])

  // Persist temperature unit preference
  useEffect(() => {
    localStorage.setItem("weather-temp-unit", tempUnit)
  }, [tempUnit])

  // Persist location preference
  useEffect(() => {
    localStorage.setItem("weather-location", JSON.stringify(geoLocation))
  }, [geoLocation])

  // Weather data query with TanStack Query
  const {
    data: weatherData,
    isLoading,
    error,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ["weather", geoLocation.latitude, geoLocation.longitude, tempUnit],
    queryFn: () => fetchAllWeatherData(geoLocation.latitude, geoLocation.longitude, tempUnit),
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
    refetchInterval: isLive ? 5 * 60 * 1000 : false, // Auto-refetch every 5 min if live
  })

  // Extract data from query result (with fallbacks)
  const currentWeather = weatherData?.currentWeather ?? INITIAL_WEATHER
  const hourlyForecast = weatherData?.hourlyForecast ?? []
  const dailyForecast = weatherData?.dailyForecast ?? []
  const airQuality = weatherData?.airQuality ?? AIR_QUALITY
  const allWeatherAlerts = weatherData?.weatherAlerts ?? []
  const weatherAlerts = allWeatherAlerts.filter(alert => !dismissedAlertIds.has(alert.id))
  const isDaytime = weatherData?.isDaytime ?? true

  // Report alert count to parent for sidebar badge
  useEffect(() => {
    onAlertCountChange?.(weatherAlerts.length)
  }, [weatherAlerts.length, onAlertCountChange])

  // Get user's geolocation on first visit (only if using default location)
  useEffect(() => {
    // Skip if we already have a saved location that's not the default
    const savedLocation = localStorage.getItem("weather-location")
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation)
        // If it's not the default location, don't auto-detect
        if (parsed.latitude !== DEFAULT_LOCATION.latitude ||
            parsed.longitude !== DEFAULT_LOCATION.longitude) {
          return
        }
      } catch {
        // Continue with detection
      }
    }

    if ("geolocation" in navigator) {
      setIsDetectingLocation(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          // Reverse geocode to get location name
          const locationName = await reverseGeocode(latitude, longitude)
          setGeoLocation({
            latitude,
            longitude,
            name: locationName,
          })
          setIsDetectingLocation(false)
        },
        () => {
          // Geolocation denied or failed, keep current location
          console.log("Geolocation not available, using saved/default location")
          setIsDetectingLocation(false)
        }
      )
    }
  }, [])

  // Fetch RainViewer radar data
  useEffect(() => {
    const loadRadarData = async () => {
      const data = await fetchRainViewerData()
      if (data) {
        setRadarData(data)
        // Start at the most recent frame
        setRadarFrameIndex(data.radar.past.length - 1)
      }
    }
    loadRadarData()

    // Refresh radar data every 10 minutes
    const interval = setInterval(loadRadarData, 600000)
    return () => clearInterval(interval)
  }, [])

  // Animate radar frames
  useEffect(() => {
    if (!radarData || !isRadarPlaying || selectedMapLayer !== "radar") return

    const frames = radarData.radar.past
    const interval = setInterval(() => {
      setRadarFrameIndex((prev) => (prev + 1) % frames.length)
    }, 500) // Advance frame every 500ms

    return () => clearInterval(interval)
  }, [radarData, isRadarPlaying, selectedMapLayer])

  // Generate radar tile URL for current location
  const getRadarTileUrl = useMemo(() => {
    if (!radarData || radarData.radar.past.length === 0) return null

    const frame = radarData.radar.past[radarFrameIndex]
    if (!frame) return null

    const zoom = 6 // Zoom level for regional view
    const { x, y } = latLonToTile(geoLocation.latitude, geoLocation.longitude, zoom)

    // Return a 3x3 grid of tiles centered on the location for better coverage
    return {
      center: `${radarData.host}${frame.path}/256/${zoom}/${x}/${y}/2/1_1.png`,
      tiles: [
        `${radarData.host}${frame.path}/256/${zoom}/${x - 1}/${y - 1}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x}/${y - 1}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x + 1}/${y - 1}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x - 1}/${y}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x}/${y}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x + 1}/${y}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x - 1}/${y + 1}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x}/${y + 1}/2/1_1.png`,
        `${radarData.host}${frame.path}/256/${zoom}/${x + 1}/${y + 1}/2/1_1.png`,
      ],
      timestamp: frame.time,
    }
  }, [radarData, radarFrameIndex, geoLocation])

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchLocation(searchQuery)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  // Select a location from search results
  const selectLocation = (loc: GeoLocation) => {
    setGeoLocation(loc)
    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  // Time ago helper
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  // Wind direction name
  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  // Weather icon component - use moon phase icon at night for clear conditions
  const WeatherIcon = WEATHER_ICONS[currentWeather.condition]
  const moonPhaseData = getMoonPhase()

  // Current time
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="p-3 sm:p-4 md:p-6 overflow-x-hidden" data-tabz-section="weather">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground terminal-glow">Live Weather Monitoring</h1>
          <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {geoLocation.name}{isDetectingLocation && " (updating...)"}
            <Separator orientation="vertical" className="h-3 sm:h-4" />
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span suppressHydrationWarning>{currentTime}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Location Search */}
          <div className="relative">
            <div className="flex gap-1">
              <Input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (!e.target.value.trim()) {
                    setShowSearchResults(false)
                    setSearchResults([])
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                className="w-40 sm:w-48 h-8 text-sm"
                data-tabz-input="weather-location"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="h-8 px-2"
                data-tabz-action="search-location"
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="h-3 w-3" />
                  </motion.div>
                ) : (
                  <Search className="h-3 w-3" />
                )}
              </Button>
            </div>
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto" data-tabz-region="location-search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => selectLocation(loc)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors border-b border-border last:border-b-0"
                      data-tabz-action="select-location"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{loc.name}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No locations found. Try a different search.
                  </div>
                )}
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="w-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors border-t border-border"
                >
                  Close
                </button>
              </div>
            )}
          </div>
          {/* Temperature Unit Toggle */}
          <div className="flex items-center rounded-lg border border-border overflow-hidden" data-tabz-control="temp-unit-toggle">
            <button
              onClick={() => setTempUnit("fahrenheit")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                tempUnit === "fahrenheit"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted text-muted-foreground"
              }`}
              data-tabz-action="set-temp-fahrenheit"
            >
              °F
            </button>
            <button
              onClick={() => setTempUnit("celsius")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                tempUnit === "celsius"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted text-muted-foreground"
              }`}
              data-tabz-action="set-temp-celsius"
            >
              °C
            </button>
          </div>
          <Badge variant="outline" className="gap-1 text-xs">
            <Activity className="h-3 w-3" />
            Updated {dataUpdatedAt ? timeAgo(new Date(dataUpdatedAt)) : "..."}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1 sm:gap-2"
            data-tabz-action="refresh-weather"
          >
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-1 sm:gap-2"
            data-tabz-action="toggle-live-updates"
          >
            {isLive ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            {isLive ? "Live" : "Paused"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Card className="border-cyan-500/50 bg-cyan-500/10">
            <CardContent className="pt-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="h-5 w-5 text-cyan-500" />
              </motion.div>
              <p className="text-sm text-cyan-500">Fetching weather data from Open-Meteo...</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{error instanceof Error ? error.message : "Failed to fetch weather data"}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Severe Weather Alerts (from NWS API) */}
      {weatherAlerts.length > 0 && (
        <motion.div
          id="weather-alerts"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 scroll-mt-6"
          data-tabz-region="weather-alerts"
        >
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardContent className="pt-4 space-y-4">
              {weatherAlerts.map((alert) => (
                <div key={alert.id} className="relative" data-tabz-item="weather-alert">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-background/50 z-10"
                    onClick={() => dismissAlert(alert.id)}
                    title="Dismiss alert"
                    data-tabz-action="dismiss-alert"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full text-left flex items-start gap-3 hover:bg-amber-500/10 rounded-lg p-2 -m-2 transition-colors cursor-pointer pr-6" data-tabz-action="view-alert-details">
                        <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-amber-500">{alert.title}</p>
                            <Badge
                              variant={
                                alert.severity === "extreme" || alert.severity === "severe"
                                  ? "destructive"
                                  : "default"
                              }
                              className="capitalize"
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm line-clamp-2">{alert.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span suppressHydrationWarning>
                              Until: {alert.endTime.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                            {alert.affectedAreas.length > 0 && (
                              <span className="truncate max-w-[200px]">Areas: {alert.affectedAreas.join(", ")}</span>
                            )}
                            <span className="text-amber-500 font-medium">Click for details →</span>
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                        <div>
                          <DialogTitle className="text-amber-500">{alert.title}</DialogTitle>
                          <DialogDescription className="sr-only">
                            Weather alert: {alert.title} - Severity: {alert.severity}
                          </DialogDescription>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                alert.severity === "extreme" || alert.severity === "severe"
                                  ? "destructive"
                                  : "default"
                              }
                              className="capitalize"
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {alert.fullDescription || alert.description}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Effective</p>
                          <p className="font-medium" suppressHydrationWarning>
                            {alert.startTime.toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium" suppressHydrationWarning>
                            {alert.endTime.toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>

                      {alert.affectedAreas.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Affected Areas</h4>
                            <p className="text-sm text-muted-foreground">{alert.affectedAreas.join(", ")}</p>
                          </div>
                        </>
                      )}

                      {alert.safetyInstructions.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Safety Instructions</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {alert.safetyInstructions.map((instruction, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-500">•</span>
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      {alert.detailsUrl && (
                        <>
                          <Separator />
                          <div className="flex justify-center">
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={alert.detailsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View on weather.gov
                              </a>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                  </Dialog>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Current Conditions - Large Display */}
      <Card className="glass border-border mb-4 sm:mb-6 w-full" data-tabz-region="current-conditions">
        <CardContent className="pt-6 sm:pt-8">
          <div className="grid gap-6 lg:grid-cols-2 w-full">
            {/* Left: Main Temperature Display */}
            <div className="text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:justify-start">
                <motion.div
                  animate={
                    currentWeather.condition === "clear" && isDaytime
                      ? {
                          // Sunny: smooth rotation
                          rotate: [0, 360],
                          scale: [1, 1.05, 1],
                        }
                      : {
                          // Balatro-style floating effect for moon/other conditions
                          y: [0, -8, 0, -4, 0],
                          rotate: [-2, 2, -1, 1, -2],
                          scale: [1, 1.02, 1, 1.01, 1],
                        }
                  }
                  transition={
                    currentWeather.condition === "clear" && isDaytime
                      ? {
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        }
                      : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  {/* Show moon phase icon at night for clear conditions, otherwise weather icon */}
                  {!isDaytime && currentWeather.condition === "clear" ? (
                    <MoonPhaseIcon
                      phase={moonPhaseData.phase}
                      className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-cyan-500"
                    />
                  ) : (
                    <WeatherIcon className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-cyan-500" />
                  )}
                </motion.div>
                <div>
                  <motion.p
                    key={Math.floor(currentWeather.temperature)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground"
                  >
                    {Math.round(currentWeather.temperature)}°
                  </motion.p>
                  <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-muted-foreground">{currentWeather.description}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6 lg:justify-start">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Feels Like</p>
                  <p className="text-xl sm:text-2xl font-semibold">{Math.round(currentWeather.feelsLike)}°</p>
                </div>
                <Separator orientation="vertical" className="h-10 sm:h-12" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">High / Low</p>
                  <p className="text-xl sm:text-2xl font-semibold">
                    {dailyForecast[0]?.highTemp}° / {dailyForecast[0]?.lowTemp}°
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Weather Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 min-w-0">
              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Humidity</p>
                </div>
                <motion.p
                  key={Math.floor(currentWeather.humidity)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold"
                >
                  {Math.round(currentWeather.humidity)}%
                </motion.p>
                <Progress value={currentWeather.humidity} className="mt-1 sm:mt-2" />
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wind className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Wind</p>
                </div>
                <motion.p
                  key={Math.floor(currentWeather.windSpeed)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold"
                >
                  {Math.round(currentWeather.windSpeed)} {tempUnit === "fahrenheit" ? "mph" : "km/h"}
                </motion.p>
                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                  <Navigation
                    className="h-4 w-4 text-cyan-500"
                    style={{ transform: `rotate(${currentWeather.windDirection}deg)` }}
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">{getWindDirection(currentWeather.windDirection)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Pressure</p>
                </div>
                <motion.p
                  key={currentWeather.pressure.toFixed(2)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold"
                >
                  {tempUnit === "fahrenheit"
                    ? `${currentWeather.pressure.toFixed(2)} in`
                    : `${Math.round(currentWeather.pressure)} hPa`}
                </motion.p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Visibility</p>
                </div>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">
                  {currentWeather.visibility.toFixed(1)} {tempUnit === "fahrenheit" ? "mi" : "km"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sun className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">UV Index</p>
                </div>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">{currentWeather.uvIndex}</p>
                <Badge
                  variant={currentWeather.uvIndex > 7 ? "destructive" : currentWeather.uvIndex > 5 ? "default" : "secondary"}
                  className="mt-1 sm:mt-2 text-xs"
                >
                  {currentWeather.uvIndex > 10
                    ? "Extreme"
                    : currentWeather.uvIndex > 7
                      ? "Very High"
                      : currentWeather.uvIndex > 5
                        ? "High"
                        : currentWeather.uvIndex > 2
                          ? "Moderate"
                          : "Low"}
                </Badge>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cloud className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Cloud Cover</p>
                </div>
                <motion.p
                  key={Math.floor(currentWeather.cloudCover)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold"
                >
                  {Math.round(currentWeather.cloudCover)}%
                </motion.p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div id="weather-forecast" className="grid gap-4 sm:gap-6 lg:grid-cols-3 w-full max-w-full scroll-mt-6" data-tabz-region="weather-forecast">
        {/* Hourly Forecast */}
        <div className="lg:col-span-2 min-w-0">
          <Card className="glass border-border" data-tabz-region="hourly-forecast">
            <CardHeader>
              <CardTitle className="text-lg">Hourly Forecast (24h)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 w-max">
                  {hourlyForecast.map((hour, index) => {
                    const HourIcon = WEATHER_ICONS[hour.condition]
                    // Determine if this hour is nighttime based on sunrise/sunset
                    const todaySunrise = dailyForecast[0]?.sunrise || "6:00 AM"
                    const todaySunset = dailyForecast[0]?.sunset || "6:00 PM"
                    const isNight = isHourNighttime(hour.hour, todaySunrise, todaySunset)
                    const showMoon = isNight && hour.condition === "clear"
                    return (
                      <div
                        key={index}
                        className="flex w-[90px] flex-shrink-0 flex-col items-center rounded-lg border border-border bg-background/50 p-3"
                      >
                        <p className="text-xs font-semibold">{hour.hour}</p>
                        {showMoon ? (
                          <MoonPhaseIcon phase={moonPhaseData.phase} className="my-2 h-6 w-6 text-cyan-500" />
                        ) : (
                          <HourIcon className="my-2 h-6 w-6 text-cyan-500" />
                        )}
                        <p className="text-base font-bold">{Math.round(hour.temp)}°</p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span>{hour.precipChance}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Wind className="h-3 w-3" />
                          <span>{hour.windSpeed}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hourly Chart */}
              <div className="mt-4 sm:mt-6 h-[150px] sm:h-[200px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyForecast} margin={{ left: -15, right: 5 }}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value, index) => {
                        if (index % 4 !== 0) return ""
                        // Convert "07:00 AM" to "7AM"
                        const match = value.match(/^(\d{1,2}):00\s*(AM|PM)$/i)
                        if (match) {
                          const hour = parseInt(match[1], 10)
                          return `${hour}${match[2].toUpperCase()}`
                        }
                        return value
                      }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${value}°`}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [`${value}°`, "Temp"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#tempGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className="glass border-border mt-6" data-tabz-region="daily-forecast">
            <CardHeader>
              <CardTitle className="text-lg">7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyForecast.map((day, index) => {
                  const DayIcon = WEATHER_ICONS[day.condition]
                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-background/50 p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <p className="w-16 sm:w-24 font-semibold text-sm sm:text-base">{day.day}</p>
                          <DayIcon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
                          <p className="hidden md:block w-32 text-sm text-muted-foreground capitalize">{day.condition.replace("-", " ")}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                            <span>{day.precipChance}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                              <span className="font-semibold text-sm sm:text-base">{day.highTemp}°</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                              <span className="font-semibold text-sm sm:text-base">{day.lowTemp}°</span>
                            </div>
                          </div>
                          <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sunrise className="h-3 w-3" />
                              <span>{day.sunrise}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Sunset className="h-3 w-3" />
                              <span>{day.sunset}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6 min-w-0">
          {/* Weather Map */}
          <Card id="weather-radar" className="glass border-border scroll-mt-6" data-tabz-region="weather-radar">
            <CardHeader>
              <CardTitle className="text-lg">Weather Radar</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Live precipitation radar from RainViewer
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] overflow-hidden rounded-lg border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Radar tile grid */}
                {selectedMapLayer === "radar" && getRadarTileUrl ? (
                  <div className="absolute inset-0 flex flex-wrap">
                    {getRadarTileUrl.tiles.map((tileUrl, i) => (
                      <div key={i} className="w-1/3 h-1/3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tileUrl}
                          alt=""
                          className="w-full h-full"
                          style={{ display: "block" }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {radarData ? "No radar data for this area" : "Loading radar data..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Center marker */}
                {getRadarTileUrl && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 border-2 border-white shadow-lg" />
                  </div>
                )}

                {/* Timestamp - bottom right to avoid tile corners */}
                {getRadarTileUrl && (
                  <div className="absolute bottom-2 right-2 z-20 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5 text-[10px] text-white font-mono" suppressHydrationWarning>
                    {new Date(getRadarTileUrl.timestamp * 1000).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}

                {/* Radar legend - bottom left */}
                <div className="absolute bottom-2 left-2 z-20 bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-green-400">Light</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 ml-1" />
                    <span className="text-yellow-400">Med</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1" />
                    <span className="text-red-400">Heavy</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                    className="h-7 px-2"
                    data-tabz-action="toggle-radar-animation"
                  >
                    {isRadarPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <span>
                    {radarData
                      ? `Frame ${radarFrameIndex + 1}/${radarData.radar.past.length}`
                      : "Loading..."}
                  </span>
                </div>
                <a
                  href="https://www.rainviewer.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  RainViewer
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Air Quality */}
          <Card className="glass border-border" data-tabz-region="air-quality">
            <CardHeader>
              <CardTitle className="text-lg">Air Quality Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <motion.p
                  key={Math.floor(airQuality.aqi / 10)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold"
                  style={{ color: AQI_COLORS[airQuality.category] }}
                >
                  {Math.round(airQuality.aqi)}
                </motion.p>
                <Badge
                  variant="outline"
                  className="mt-2 capitalize"
                  style={{ borderColor: AQI_COLORS[airQuality.category] }}
                >
                  {airQuality.category.replace("-", " ")}
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">{airQuality.healthRecommendation}</p>
              </div>

              <div className="relative h-4 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(airQuality.aqi / 500) * 100}%` }}
                  style={{ backgroundColor: AQI_COLORS[airQuality.category] }}
                  className="h-full"
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PM2.5</span>
                  <span className="font-semibold">{airQuality.pm25.toFixed(1)} µg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PM10</span>
                  <span className="font-semibold">{airQuality.pm10.toFixed(1)} µg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">O₃ (Ozone)</span>
                  <span className="font-semibold">{airQuality.o3} ppb</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CO</span>
                  <span className="font-semibold">{airQuality.co.toFixed(1)} ppm</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Comparison */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Historical Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">Current vs Normal vs Record</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {HISTORICAL_DATA.map((data) => (
                  <div key={data.metric}>
                    <div className="mb-2 flex justify-between">
                      <p className="text-sm font-semibold">{data.metric}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-cyan-500">
                          Current: {data.current}
                          {data.unit}
                        </span>
                        <span className="text-muted-foreground">
                          Normal: {data.normal}
                          {data.unit}
                        </span>
                        <span className="text-amber-500">
                          Record: {data.record}
                          {data.unit}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="relative h-full">
                        <div
                          className="absolute h-full bg-cyan-500"
                          style={{ width: `${(data.current / data.record) * 100}%` }}
                        />
                        <div
                          className="absolute h-1 w-1 rounded-full bg-muted-foreground top-0.5"
                          style={{ left: `${(data.normal / data.record) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      {data.current > data.normal ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">
                            +{((data.current - data.normal) / data.normal * 100).toFixed(0)}% above normal
                          </span>
                        </>
                      ) : data.current < data.normal ? (
                        <>
                          <TrendingDown className="h-3 w-3 text-blue-500" />
                          <span className="text-blue-500">
                            {((data.current - data.normal) / data.normal * 100).toFixed(0)}% below normal
                          </span>
                        </>
                      ) : (
                        <>
                          <Minus className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">At normal levels</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Weather Info */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Additional Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dew Point</span>
                  <span className="font-semibold">{Math.round(currentWeather.dewPoint)}°{tempUnit === "fahrenheit" ? "F" : "C"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Moon Phase</span>
                  <div className="flex items-center gap-2">
                    <MoonPhaseIcon phase={moonPhaseData.phase} className="h-4 w-4" />
                    <span className="font-semibold">{MOON_PHASE_NAMES[moonPhaseData.phase]}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precipitation (24h)</span>
                  <span className="font-semibold">
                    {currentWeather.precipitation.toFixed(2)} {tempUnit === "fahrenheit" ? "in" : "mm"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunrise</span>
                  <div className="flex items-center gap-2">
                    <Sunrise className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold">{dailyForecast[0]?.sunrise || "—"}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunset</span>
                  <div className="flex items-center gap-2">
                    <Sunset className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{dailyForecast[0]?.sunset || "—"}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data Source</span>
                  <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-500 hover:text-cyan-400 transition-colors text-xs"
                  >
                    Open-Meteo API
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
