"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  Sun,
  Moon,
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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea, Progress, Separator, Input } from "@ggprompts/ui"
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
  affectedAreas: string[]
  startTime: Date
  endTime: Date
  safetyInstructions: string[]
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
// API FUNCTIONS
// ============================================================================

const DEFAULT_LOCATION: GeoLocation = {
  latitude: 37.7749,
  longitude: -122.4194,
  name: "San Francisco, CA",
}

async function fetchWeatherData(lat: number, lon: number): Promise<OpenMeteoResponse> {
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
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
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

const WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: "alert-1",
    type: "wind",
    severity: "moderate",
    title: "Wind Advisory",
    description: "Strong winds expected with gusts up to 45 mph",
    affectedAreas: ["San Francisco", "Oakland", "Berkeley"],
    startTime: new Date(Date.now() + 3600000),
    endTime: new Date(Date.now() + 21600000),
    safetyInstructions: [
      "Secure outdoor objects",
      "Avoid parking under trees",
      "Drive with caution",
    ],
  },
]

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

export default function LiveWeatherDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>(INITIAL_WEATHER)
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([])
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([])
  const [airQuality, setAirQuality] = useState<AirQuality>(AIR_QUALITY)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [geoLocation, setGeoLocation] = useState<GeoLocation>(DEFAULT_LOCATION)
  const [selectedMapLayer, setSelectedMapLayer] = useState<"radar" | "temperature" | "wind" | "clouds">("radar")
  const [isDaytime, setIsDaytime] = useState(true)
  const [radarAnimation, setRadarAnimation] = useState(0)

  // New state for API integration
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Radar map state
  const [radarData, setRadarData] = useState<RainViewerData | null>(null)
  const [radarFrameIndex, setRadarFrameIndex] = useState(0)
  const [isRadarPlaying, setIsRadarPlaying] = useState(true)

  // Fetch weather data from Open-Meteo API
  const fetchAllWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch weather and air quality in parallel
      const [weatherData, aqData] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchAirQuality(lat, lon).catch(() => null), // Air quality is optional
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

      setCurrentWeather({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        condition: weatherInfo.condition,
        description: weatherInfo.description,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl * 0.02953, // Convert hPa to inHg
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        visibility: currentHourIndex >= 0 ? weatherData.hourly.visibility[currentHourIndex] / 1609.34 : 10, // Convert m to miles
        cloudCover: current.cloud_cover,
        uvIndex: currentHourIndex >= 0 ? weatherData.hourly.uv_index[currentHourIndex] : 0,
        dewPoint: currentHourIndex >= 0 ? weatherData.hourly.dew_point_2m[currentHourIndex] : 50,
        precipitation: current.precipitation,
      })

      setIsDaytime(current.is_day === 1)

      // Parse hourly forecast (next 24 hours)
      const hourlyData: HourlyForecast[] = []
      const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0
      for (let i = startIndex; i < Math.min(startIndex + 24, weatherData.hourly.time.length); i++) {
        const hourDate = new Date(weatherData.hourly.time[i])
        const hourWeather = getWeatherFromCode(weatherData.hourly.weather_code[i])

        hourlyData.push({
          hour: hourDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          temp: Math.round(weatherData.hourly.temperature_2m[i]),
          condition: hourWeather.condition,
          precipChance: weatherData.hourly.precipitation_probability[i] || 0,
          windSpeed: Math.round(weatherData.hourly.wind_speed_10m[i]),
          humidity: weatherData.hourly.relative_humidity_2m[i],
        })
      }
      setHourlyForecast(hourlyData)

      // Parse daily forecast
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const dailyData: DailyForecast[] = weatherData.daily.time.map((date, i) => {
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
      setDailyForecast(dailyData)

      // Parse air quality if available
      if (aqData) {
        const aq = aqData.current
        const category = getAqiCategory(aq.us_aqi)
        setAirQuality({
          aqi: aq.us_aqi,
          category,
          pm25: aq.pm2_5,
          pm10: aq.pm10,
          o3: aq.ozone,
          co: aq.carbon_monoxide / 1000, // Convert µg/m³ to ppm (approximate)
          no2: aq.nitrogen_dioxide,
          so2: aq.sulphur_dioxide,
          healthRecommendation: getAqiRecommendation(category),
        })
      }

      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
      console.error("Weather fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get user's geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
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
        },
        () => {
          // Geolocation denied or failed, use default location
          console.log("Geolocation not available, using default location")
        }
      )
    }
  }, [])

  // Fetch weather data when location changes
  useEffect(() => {
    fetchAllWeatherData(geoLocation.latitude, geoLocation.longitude)
  }, [geoLocation])

  // Auto-refresh weather data when live mode is enabled
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      fetchAllWeatherData(geoLocation.latitude, geoLocation.longitude)
      setRadarAnimation((prev) => (prev + 1) % 100)
    }, 300000) // Refresh every 5 minutes (300000ms)

    return () => clearInterval(interval)
  }, [isLive, geoLocation])

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

  // Weather icon component
  const WeatherIcon = WEATHER_ICONS[currentWeather.condition]

  // Current time
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Live Weather Monitoring</h1>
          <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {geoLocation.name}
            <Separator orientation="vertical" className="h-3 sm:h-4" />
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            {currentTime}
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
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="h-8 px-2"
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
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => selectLocation(loc)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors border-b border-border last:border-b-0"
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
          <Badge variant="outline" className="gap-1 text-xs">
            <Activity className="h-3 w-3" />
            Updated {timeAgo(lastUpdate)}
          </Badge>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-1 sm:gap-2"
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
          <Card className="border-secondary/50 bg-secondary/10">
            <CardContent className="pt-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="h-5 w-5 text-secondary" />
              </motion.div>
              <p className="text-sm text-secondary">Fetching weather data from Open-Meteo...</p>
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
                <p className="text-sm text-red-500">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAllWeatherData(geoLocation.latitude, geoLocation.longitude)}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Severe Weather Alerts */}
      {WEATHER_ALERTS.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardContent className="pt-4">
              {WEATHER_ALERTS.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
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
                    <p className="mt-1 text-sm">{alert.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Starts: {alert.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span>
                        Ends: {alert.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span>Areas: {alert.affectedAreas.join(", ")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Current Conditions - Large Display */}
      <Card className="glass border-border mb-4 sm:mb-6 w-full">
        <CardContent className="pt-6 sm:pt-8">
          <div className="grid gap-6 lg:grid-cols-2 w-full">
            {/* Left: Main Temperature Display */}
            <div className="text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:justify-start">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: currentWeather.condition === "clear" ? [0, 360] : 0,
                  }}
                  transition={{
                    duration: currentWeather.condition === "clear" ? 20 : 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <WeatherIcon className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 text-secondary" />
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
                  {Math.round(currentWeather.windSpeed)} mph
                </motion.p>
                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                  <Navigation
                    className="h-4 w-4 text-secondary"
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
                  {currentWeather.pressure.toFixed(2)} in
                </motion.p>
              </div>

              <div className="rounded-lg border border-border bg-background/50 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Visibility</p>
                </div>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">{currentWeather.visibility} mi</p>
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

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 w-full max-w-full">
        {/* Hourly Forecast */}
        <div className="lg:col-span-2 min-w-0">
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Hourly Forecast (24h)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 w-max">
                  {hourlyForecast.map((hour, index) => {
                    const HourIcon = WEATHER_ICONS[hour.condition]
                    return (
                      <div
                        key={index}
                        className="flex w-[90px] flex-shrink-0 flex-col items-center rounded-lg border border-border bg-background/50 p-3"
                      >
                        <p className="text-xs font-semibold">{hour.hour}</p>
                        <HourIcon className="my-2 h-6 w-6 text-secondary" />
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
                  <AreaChart data={hourlyForecast}>
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
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value, index) => (index % 4 === 0 ? value : "")}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}°`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: number) => [`${value}°F`, "Temperature"]}
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
          <Card className="glass border-border mt-6">
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
                          <DayIcon className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
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
          {/* Air Quality */}
          <Card className="glass border-border">
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

          {/* Weather Map */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg">Weather Radar</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Live precipitation radar from RainViewer
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] overflow-hidden rounded-lg border border-border bg-slate-900">
                {/* Radar tile grid */}
                {selectedMapLayer === "radar" && getRadarTileUrl ? (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {getRadarTileUrl.tiles.map((tileUrl, i) => (
                      <div key={i} className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tileUrl}
                          alt=""
                          className="w-full h-full object-cover opacity-80"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    ))}
                    {/* Center marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-3 h-3 rounded-full bg-secondary border-2 border-white shadow-lg" />
                    </div>
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

                {/* Radar legend */}
                <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400">Light</span>
                    <div className="w-2 h-2 rounded-full bg-yellow-500 ml-2" />
                    <span className="text-yellow-400">Moderate</span>
                    <div className="w-2 h-2 rounded-full bg-red-500 ml-2" />
                    <span className="text-red-400">Heavy</span>
                  </div>
                </div>

                {/* Timestamp */}
                {getRadarTileUrl && (
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1 text-xs text-white">
                    {new Date(getRadarTileUrl.timestamp * 1000).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                    className="h-7 px-2"
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
                  className="text-secondary hover:text-secondary transition-colors"
                >
                  RainViewer
                </a>
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
                        <span className="text-secondary">
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
                          className="absolute h-full bg-secondary"
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
                  <span className="font-semibold">{Math.round(currentWeather.dewPoint)}°F</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Moon Phase</span>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span className="font-semibold">Waning Crescent</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precipitation (24h)</span>
                  <span className="font-semibold">{currentWeather.precipitation.toFixed(2)} in</span>
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
                    className="text-secondary hover:text-secondary/80 transition-colors text-xs"
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
