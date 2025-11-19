# Quick Start Guide: Interactive Farm Location Picker

## For Users

### How to Add a Farm with the New Location Picker

1. **Open Add Farm Modal**
   - Navigate to Green Pages → Statistics tab
   - Click the "Add Farm" button

2. **Fill Basic Information**
   - Enter the farm name
   - The interactive map will appear

3. **Select Farm Location (Choose one method)**

   **Method A: Click on Map**
   - Click anywhere on the map where the farm is located
   - A marker will appear at the clicked location
   - Wait a moment while the system fetches the address
   - The address field will automatically populate

   **Method B: Search by Address**
   - Type an address in the "Address" field
   - After 3 characters, suggestions will appear
   - Click on a suggestion from the dropdown
   - The map will automatically update with a marker at that location

   **Method C: Use Current Location**
   - Click the crosshair button (📍) on the top-right of the map
   - Allow location access when prompted
   - The map will center on your current location
   - A marker will be placed and address will be populated

4. **Fine-tune Location**
   - Drag the marker to adjust the exact position
   - The address will update automatically
   - Or manually edit the address field to update the marker

5. **Complete Other Fields**
   - Size (e.g., "2 hectares")
   - Age (e.g., "5 years")
   - Farm Type (e.g., "Vegetable", "Livestock")
   - Upload a farm image
   - Add a description

6. **Submit**
   - Review all information
   - Click "Add Farm"
   - Success! The farm is now added with precise coordinates

## For Developers

### Importing the Component

```typescript
import { LocationMapPicker } from './LocationMapPicker';
```

### Basic Usage

```typescript
const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
const [address, setAddress] = useState('');

<LocationMapPicker
  value={location}
  onChange={setLocation}
  onAddressUpdate={setAddress}
/>
```

### Full Example with Form

```typescript
import { useState } from 'react';
import { LocationMapPicker } from './LocationMapPicker';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';

function FarmForm() {
  const [formData, setFormData] = useState({
    name: '',
    location: null as { lat: number; lng: number } | null,
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location) {
      alert('Please select a location');
      return;
    }

    // Send to backend
    const response = await fetch('/api/farms', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        location: formData.location, // { lat: number, lng: number }
        address: formData.address,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Farm Name"
      />

      <LocationMapPicker
        value={formData.location}
        onChange={(location) => setFormData({ ...formData, location })}
        onAddressUpdate={(address) => setFormData({ ...formData, address })}
        height="400px"
      />

      <AddressAutocomplete
        value={formData.address}
        onChange={(address) => setFormData({ ...formData, address })}
        onSelect={(suggestion) => {
          const lat = parseFloat(suggestion.lat);
          const lng = parseFloat(suggestion.lon);
          setFormData({
            ...formData,
            address: suggestion.display_name,
            location: { lat, lng },
          });
        }}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Props API

```typescript
interface LocationMapPickerProps {
  // Current location value
  value: { lat: number; lng: number } | null;

  // Called when user selects a location
  onChange: (location: { lat: number; lng: number }) => void;

  // Optional: Called when address is fetched from coordinates
  onAddressUpdate?: (address: string) => void;

  // Optional: Custom CSS classes
  className?: string;

  // Optional: Map height (default: '400px')
  height?: string | number;

  // Optional: Initial center [lat, lng] (default: Barangay Talipapa)
  defaultCenter?: [number, number];

  // Optional: Initial zoom level (default: 13)
  defaultZoom?: number;
}
```

### Customization Examples

**Different default location:**

```typescript
<LocationMapPicker
  value={location}
  onChange={setLocation}
  defaultCenter={[14.5995, 120.9842]} // Manila City Hall
  defaultZoom={15}
/>
```

**Custom height:**

```typescript
<LocationMapPicker
  value={location}
  onChange={setLocation}
  height="600px"
/>
```

**Without address auto-fill:**

```typescript
<LocationMapPicker
  value={location}
  onChange={setLocation}
  // Simply don't provide onAddressUpdate
/>
```

### Bi-directional Sync with AddressAutocomplete

```typescript
<AddressAutocomplete
  value={address}
  onChange={setAddress}
  onSelect={(suggestion) => {
    // When user selects an address, update map
    setLocation({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
    setAddress(suggestion.display_name);
  }}
/>
```

## Tips & Best Practices

### For Users

1. **Be Precise**: Zoom in on the map for more accurate placement
2. **Verify Address**: Always check that the auto-filled address is correct
3. **Manual Override**: You can always manually edit the address if needed
4. **Mobile Friendly**: Pinch to zoom, tap to select on mobile devices
5. **Offline Mode**: Map requires internet connection to load tiles

### For Developers

1. **Validation**: Always validate that location is not null before submission
2. **Error Handling**: Wrap in try-catch for network errors
3. **Loading States**: Show loading indicator during submission
4. **Performance**: Component uses debouncing and request cancellation
5. **Accessibility**: Component includes ARIA labels and keyboard support

### Common Issues

**Map not showing:**

- Ensure container has explicit height
- Check that leaflet CSS is imported
- Verify no z-index conflicts

**Address not populating:**

- Check browser console for network errors
- Ensure internet connection is available
- Nominatim API has rate limits (1 req/sec)

**Geolocation not working:**

- Requires HTTPS in production
- User must grant permission
- Fallback to manual selection available

## API Integration

### Backend Expected Format

```json
{
  "name": "Sample Farm",
  "location": {
    "lat": 14.687906,
    "lng": 121.024446
  },
  "address": "123 Sample St, Barangay Talipapa, Quezon City, Philippines"
}
```

### Reverse Geocoding Response

The component uses Nominatim API which returns:

```json
{
  "display_name": "Full address string",
  "lat": "14.687906",
  "lon": "121.024446",
  "address": {
    "road": "Street name",
    "suburb": "Barangay",
    "city": "City",
    "province": "Province",
    "country": "Philippines"
  }
}
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Attribution

This feature uses:

- OpenStreetMap for map tiles
- Nominatim for geocoding
- Leaflet for map rendering

Please maintain attribution as per their licenses.

## Support

For issues or questions:

- Check the detailed README_LOCATION_PICKER.md
- Review component source code
- Test with sample data
- Check browser console for errors
