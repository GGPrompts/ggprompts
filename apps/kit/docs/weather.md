# Weather Section

The weather dashboard provides comprehensive weather information with live data from multiple APIs.

## Features

- **Geolocation**: Auto-detects user location (falls back to San Francisco)
- **Temperature unit toggle**: °F/°C switch in header (persisted in localStorage)
- **Live weather data**: Temperature, feels like, humidity, wind, pressure, visibility, UV, cloud cover
- **Weather alerts**: Real alerts from NWS API (US locations only)
- **Hourly forecast**: 24-hour forecast with temperature chart
- **7-day forecast**: Extended daily forecast
- **Air quality**: AQI with pollutant breakdown (PM2.5, PM10, O3, CO)
- **Weather radar**: Live precipitation radar from RainViewer (animated)
- **Historical comparison**: Current vs normal vs record values

## APIs Used

| API | Purpose | Notes |
|-----|---------|-------|
| Open-Meteo | Weather data | Free, no API key |
| Open-Meteo Air Quality | AQI data | Free, no API key |
| NWS (api.weather.gov) | Weather alerts | Free, US only |
| RainViewer | Precipitation radar | Free, global |
| Nominatim | Reverse geocoding | Free, requires User-Agent |

## Weather Icon Animations

- **Sunny/Clear**: Smooth 360° rotation (20s)
- **Other conditions**: Balatro-style floating effect (gentle bob + rotation wobble)

## Data Caching (TanStack Query)

Query key: `["weather", latitude, longitude, tempUnit]`

- **Stale time**: 5 minutes
- **Cache time**: 30 minutes
- **Auto-refetch**: Every 5 minutes when "Live" mode is on

Data persists across tab navigation. See [state-management.md](state-management.md) for details.

## Preferences (localStorage)

### Temperature Unit
Key: `weather-temp-unit`
Values: `"fahrenheit"` | `"celsius"`

Affects: temperature, wind speed, visibility, pressure, precipitation units

### Location
Key: `weather-location`
Value: `{ latitude, longitude, name }`

- Persisted so weather loads instantly on return visits
- Auto-detection only runs on first visit (when using default location)
- Manually searched locations are saved

## File Location

- Section component: `app/sections/weather.tsx`
