# {{PROJECT_NAME}} — Mapping & Geolocation Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Maps Provider:** {{MAPS_PROVIDER}} (Google Maps / Mapbox / Leaflet + OSM)
> **Last Updated:** {{DATE}}

---

## 1. Provider Selection

| Feature | Google Maps | Mapbox | Leaflet + OpenStreetMap | HERE Maps |
|---------|------------|--------|------------------------|-----------|
| **Pricing** | Pay-per-use ($7/1K loads) | Pay-per-use ($5/1K loads) | **Free (open source)** | Pay-per-use |
| **Free tier** | $200/month credit | 50K loads/month | Unlimited | 250K transactions/month |
| **Map quality** | Excellent | Excellent (custom styles) | Good (community data) | Excellent |
| **Customization** | Limited styles | **Fully customizable** | Moderate | Limited |
| **Geocoding** | ✅ ($5/1K) | ✅ ($5/1K) | Nominatim (free, rate limited) | ✅ |
| **Directions/routing** | ✅ ($5-10/1K) | ✅ ($5/1K) | OSRM (free, self-hosted) | ✅ |
| **Street View** | ✅ (unique feature) | ❌ | ❌ | ❌ |
| **Places/POI search** | ✅ (best) | ✅ (limited) | Nominatim | ✅ |
| **Offline maps** | ❌ | ✅ (mobile SDK) | ✅ (tile download) | ✅ |
| **React component** | `@vis.gl/react-google-maps` | `react-map-gl` | `react-leaflet` | HERE React |
| **Bundle size** | ~200KB | ~200KB | ~40KB | ~150KB |

### Decision Matrix

```
Need Street View or Places API?
  ├─ Yes → Google Maps (unique features, best data)
  └─ No
      ├─ Need highly customized map styles?
      │   └─ Yes → Mapbox (Mapbox Studio for custom styles)
      └─ No
          ├─ Budget is critical / open source preference?
          │   └─ Yes → Leaflet + OpenStreetMap (free, lightweight)
          └─ No → Mapbox (best balance of features/price)
```

---

## 2. API Services

### Geocoding (Address → Coordinates)

Convert human-readable addresses to latitude/longitude:

| Provider | Endpoint | Rate Limit | Cost |
|----------|---------|-----------|------|
| Google | Geocoding API | 50 QPS | $5/1K requests |
| Mapbox | Geocoding v6 | 600 req/min | $5/1K requests |
| Nominatim (OSM) | nominatim.openstreetmap.org | 1 req/s | Free |
| Positionstack | positionstack.com | 25K/month (free) | Free tier available |

### Reverse Geocoding (Coordinates → Address)

Convert lat/lng to human-readable address. Same providers, same endpoints.

### Directions / Routing

| Provider | Features | Cost |
|----------|----------|------|
| Google Directions API | Driving, walking, transit, cycling + traffic | $5-10/1K requests |
| Mapbox Directions | Driving, walking, cycling (no transit) | $5/1K requests |
| OSRM (self-hosted) | Driving, walking, cycling | Free (self-hosted) |
| Valhalla (self-hosted) | All modes including transit | Free (self-hosted) |

### Distance Matrix

Calculate travel times between multiple origins and destinations:

| Provider | Max Elements | Cost |
|----------|-------------|------|
| Google Distance Matrix | 25 origins × 25 destinations per request | $5-10/1K elements |
| Mapbox Matrix | 25 × 25 per request | $5/1K elements |

---

## 3. Map Display

### Tile Types

| Type | Description | Best For |
|------|-------------|----------|
| **Raster tiles** | Pre-rendered PNG images | Simple maps, wide compatibility |
| **Vector tiles** | Geometric data rendered on client | Custom styles, smooth zoom, interactive |

### Map Configuration

```
Map Settings:
  Center: [{{DEFAULT_LAT}}, {{DEFAULT_LNG}}]
  Zoom: {{DEFAULT_ZOOM}} (e.g., 12 for city, 5 for country)
  Min Zoom: {{MIN_ZOOM}} (e.g., 2)
  Max Zoom: {{MAX_ZOOM}} (e.g., 18)
  Style: {{MAP_STYLE}} (e.g., streets, satellite, light, dark)
  Controls: zoom, fullscreen, geolocation
  Markers: custom icon from your design system
```

---

## 4. Common Integration Patterns

### Store Locator

```
Flow:
  1. User enters address or uses browser geolocation
  2. Geocode address → lat/lng
  3. Query database for nearby stores (PostGIS ST_DWithin or Haversine formula)
  4. Display results on map with markers
  5. Show list view with distance + directions link
```

### Address Autocomplete

```
Flow:
  1. User types in address field
  2. After 3+ characters, debounce 300ms
  3. Call Places Autocomplete / Mapbox Search API
  4. Display suggestions dropdown
  5. User selects suggestion → geocode to lat/lng
  6. Store structured address components
```

| Provider | API | Session-Based Pricing |
|----------|-----|----------------------|
| Google | Places Autocomplete | $2.83/session (unlimited suggestions within session) |
| Mapbox | Search Box API | Included in search pricing |
| Algolia Places | Algolia Places | Discontinued → use Mapbox or Google |

### Delivery Zone / Geofencing

```
Define zones:
  - GeoJSON polygons for delivery areas
  - Store in database (PostGIS geometry column)
  - Point-in-polygon check: does user's location fall within a delivery zone?
  - Display zones on map as colored overlays
```

---

## 5. Cost Optimization

### Caching Strategies

| Data | Cache TTL | Cache Layer | Savings |
|------|-----------|-------------|---------|
| Geocoding results | Permanent (addresses don't move) | Database | 90%+ of geocoding calls |
| Directions (same origin/dest) | 1 hour (traffic changes) | Redis | 50%+ of directions calls |
| Distance matrix | 1 hour | Redis | 80%+ of matrix calls |
| Map tiles | Browser + CDN (max-age) | CDN | Reduce tile server load |
| Autocomplete (same prefix) | 5 minutes | Application memory | Reduce API calls |

### Request Optimization

1. **Debounce autocomplete:** Wait 300ms after last keystroke before querying
2. **Batch geocoding:** Geocode addresses in bulk during import, not on-the-fly
3. **Cache geocoding results:** Store lat/lng in your database — addresses rarely change
4. **Lazy-load maps:** Don't load map SDK until user scrolls to map section
5. **Static maps for thumbnails:** Use Static Maps API instead of interactive map for previews

---

## 6. Mobile Considerations

### Browser Geolocation API

```
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    // accuracy in meters — may be 10m (GPS) or 1000m+ (IP-based)
  },
  (error) => {
    // Handle: PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT
  },
  {
    enableHighAccuracy: true,  // GPS (slower, more battery)
    timeout: 10000,            // 10 second timeout
    maximumAge: 300000         // Accept cached position up to 5 min old
  }
);
```

### Permission Handling

| State | UI Treatment |
|-------|-------------|
| Not yet asked | "Enable location for better results" button |
| Granted | Auto-detect location, show on map |
| Denied | Manual address entry, explain why location helps |
| Unavailable | Fallback to IP-based geolocation (less accurate) |

---

## 7. Implementation Checklist

- [ ] Maps provider selected and API key configured
- [ ] API key restricted (HTTP referrer restriction for client-side, IP restriction for server-side)
- [ ] Map component rendering with correct default center/zoom
- [ ] Custom markers matching design system
- [ ] Geocoding working (address → coordinates)
- [ ] Address autocomplete with debouncing
- [ ] Geocoding results cached in database
- [ ] Distance/directions working (if needed)
- [ ] Store locator / search by location (if needed)
- [ ] Mobile geolocation with permission handling
- [ ] Map lazy-loaded (not blocking initial page load)
- [ ] Cost monitoring (API usage alerts at 50%, 80% of budget)
- [ ] Rate limiting on geocoding/directions endpoints (prevent abuse)
- [ ] Fallback for map load failure (static image or address list)
