# Geolocation API

The Geolocation API allows web applications to access a user's geographical coordinates. As a "Powerful Feature," browsers enforce strict security and privacy protocols.

## Security Requirements

- **HTTPS Only**: API won't work on `http://` (except `localhost`)
- **Explicit User Consent**: Browser must show permission prompt
- **Permissions Policy**: iframes need `allow="geolocation"`

## Core Methods

```javascript
// One-shot position request
navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);

// Continuous tracking
const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

// Stop tracking
navigator.geolocation.clearWatch(watchId);
```

## Basic Usage

```javascript
if ('geolocation' in navigator) {
  const options = {
    enableHighAccuracy: true, // Use GPS if available
    timeout: 5000,            // Wait max 5 seconds
    maximumAge: 0             // Don't use cached location
  };

  function success(position) {
    const { latitude, longitude, accuracy } = position.coords;
    console.log(`Location: ${latitude}, ${longitude}`);
    console.log(`Accuracy: ${accuracy} meters`);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
} else {
  console.log('Geolocation not supported');
}
```

## Position Object

```javascript
{
  coords: {
    latitude: 51.5074,        // Decimal degrees
    longitude: -0.1278,       // Decimal degrees
    accuracy: 20,             // Meters
    altitude: 100,            // Meters (may be null)
    altitudeAccuracy: 10,     // Meters (may be null)
    heading: 90,              // Degrees from North (0-360, may be null)
    speed: 5.5                // Meters per second (may be null)
  },
  timestamp: 1640000000000    // Unix timestamp
}
```

## Error Codes

```javascript
function handleError(err) {
  switch (err.code) {
    case 1: // PERMISSION_DENIED
      console.error('User denied location access');
      break;
    case 2: // POSITION_UNAVAILABLE
      console.error('Location information unavailable');
      break;
    case 3: // TIMEOUT
      console.error('Request timed out');
      break;
    default:
      console.error('Unknown error');
  }
}
```

## Real-Time Tracking

```javascript
let watchId = null;

function startTracking() {
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
  };

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, speed, heading } = position.coords;

      console.log(`Updated: ${latitude}, ${longitude}`);

      if (speed) {
        console.log(`Speed: ${speed} m/s`);
      }

      // Update map marker, log distance, etc.
      updateMapMarker(latitude, longitude);
    },
    (error) => {
      console.error('Tracking error:', error.message);
    },
    options
  );
}

function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log('Tracking stopped');
  }
}
```

## Leaflet.js Integration

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<div id="map" style="height: 500px;"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

```javascript
// Initialize map
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker, circle, zoomed;

// Watch position
navigator.geolocation.watchPosition(
  (pos) => {
    const { latitude, longitude, accuracy } = pos.coords;

    // Remove old markers
    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }

    // Add marker for user location
    marker = L.marker([latitude, longitude]).addTo(map);

    // Add accuracy circle
    circle = L.circle([latitude, longitude], {
      radius: accuracy
    }).addTo(map);

    // Auto-center on first fix
    if (!zoomed) {
      zoomed = map.setView([latitude, longitude], 13);
    }
  },
  (err) => {
    console.error('Geolocation error:', err.message);
  },
  { enableHighAccuracy: true }
);
```

## Distance Calculation (Haversine Formula)

Calculate great-circle distance between two coordinates.

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters

  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Usage
const distance = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
console.log(`London to Paris: ${(distance / 1000).toFixed(2)} km`);
```

## Distance Tracker

```javascript
let totalDistance = 0;
let lastCoords = null;

navigator.geolocation.watchPosition((pos) => {
  const { latitude, longitude, accuracy } = pos.coords;

  // Filter out low-accuracy updates
  if (accuracy > 20) return;

  if (lastCoords) {
    const distanceStep = calculateDistance(
      lastCoords.latitude,
      lastCoords.longitude,
      latitude,
      longitude
    );

    // Only count movement > 2 meters (prevents GPS drift)
    if (distanceStep > 2) {
      totalDistance += distanceStep;
      console.log(`Total Distance: ${totalDistance.toFixed(2)}m`);
    }
  }

  lastCoords = { latitude, longitude };
}, error, { enableHighAccuracy: true });
```

## How Browsers Find Location

Browsers use a hierarchy of location sources:

1. **GPS**: Most accurate (±5-10m), slow, battery-intensive
2. **Wi-Fi Triangulation**: Scans nearby SSIDs and signal strengths (±20-50m)
3. **Cell Tower ID**: Uses cellular signals (±100-1000m)
4. **IP GeoIP**: Least accurate (city/region level)

## Options Explained

### enableHighAccuracy

```javascript
{ enableHighAccuracy: true }
```

- `true`: Prefers GPS, waits longer, uses more battery
- `false`: Uses Wi-Fi/cell towers, faster, lower battery usage

**Note**: Doesn't guarantee GPS, just a preference.

### timeout

```javascript
{ timeout: 5000 } // 5 seconds
```

Maximum wait time for position. If exceeded, error callback fires with code 3 (TIMEOUT).

### maximumAge

```javascript
{ maximumAge: 30000 } // 30 seconds
```

Max age of cached position. Browser can return cached location if recent enough.

- `0`: Always get fresh position
- `Infinity`: Use any cached position

## Common Pitfalls

### Silent Failures

On HTTP sites, `navigator.geolocation` may be `undefined` or calls fail without prompt.

**Solution**: Always check for HTTPS

```javascript
if (!window.isSecureContext) {
  console.error('Geolocation requires HTTPS');
}
```

### Accuracy Paradox

`enableHighAccuracy: true` doesn't guarantee GPS. It just signals willingness to wait and use battery.

### Cached Results

High `maximumAge` can return stale locations (10+ minutes old) for moving users.

### Mobile Backgrounding

Mobile browsers (especially Safari iOS) stop `watchPosition` when app is backgrounded.

**Solution**: For continuous tracking, use native mobile app.

## Accuracy Filtering

```javascript
navigator.geolocation.watchPosition((pos) => {
  const { latitude, longitude, accuracy } = pos.coords;

  if (accuracy > 50) {
    console.warn('Position too inaccurate, skipping');
    return;
  }

  // Use high-accuracy position
  updateMarker(latitude, longitude);
});
```

## Permissions Check

```javascript
async function checkGeolocationPermission() {
  if (!('permissions' in navigator)) {
    return 'unavailable';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state; // 'granted', 'denied', or 'prompt'
  } catch (err) {
    return 'unavailable';
  }
}

// Usage
const permission = await checkGeolocationPermission();

if (permission === 'granted') {
  // Can get location without prompt
  startTracking();
} else if (permission === 'denied') {
  // User previously blocked
  showManualLocationInput();
} else {
  // Will prompt when requesting
  requestLocation();
}
```

## Browser Support (2025)

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | Full (v5+) | HTTPS required since v50 |
| **Firefox** | Full (v3.5+) | Uses Google Location Services |
| **Safari** | Full (v5+) | Restrictive on background tracking |
| **Edge** | Full (v12+) | Chromium-based, same as Chrome |
| **Mobile** | Full | Integrated with GPS hardware |

## Related

- [Maps Integration](./maps-integration.md)
- [Permissions API](./permissions.md)
- [Progressive Web Apps](./pwa.md)
