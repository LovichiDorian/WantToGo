import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { X, Check, Crosshair, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '../hooks/useGeolocation';
import 'leaflet/dist/leaflet.css';

// Custom draggable marker icon
const markerIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path fill="#3b82f6" d="M16 0C7.163 0 0 7.163 0 16c0 12 16 32 16 32s16-20 16-32C32 7.163 24.837 0 16 0z"/>
      <circle cx="16" cy="16" r="8" fill="white"/>
      <circle cx="16" cy="16" r="4" fill="#3b82f6"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

interface LocationPickerProps {
  initialLat: number | null;
  initialLng: number | null;
  onSelect: (lat: number, lng: number, address?: string) => void;
  onClose: () => void;
}

// Map click handler component
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Draggable marker component
function DraggableMarker({
  position,
  onPositionChange,
}: {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useCallback((marker: L.Marker | null) => {
    if (marker) {
      marker.on('dragend', () => {
        const latlng = marker.getLatLng();
        onPositionChange(latlng.lat, latlng.lng);
      });
    }
  }, [onPositionChange]);

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={true}
      ref={markerRef}
    />
  );
}

/**
 * Full-screen location picker with draggable marker
 */
export function LocationPicker({
  initialLat,
  initialLng,
  onSelect,
  onClose,
}: LocationPickerProps) {
  const { t } = useTranslation();
  const { getCurrentPosition, isLoading: geoLoading } = useGeolocation();
  
  const [position, setPosition] = useState<[number, number]>(
    initialLat !== null && initialLng !== null
      ? [initialLat, initialLng]
      : [48.8566, 2.3522] // Default to Paris
  );
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Reverse geocoding to get address from coordinates
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WantToGo/1.0',
          },
        }
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Failed to fetch address:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  // Update position when it changes
  const handlePositionChange = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    fetchAddress(lat, lng);
  }, [fetchAddress]);

  // Get current location
  const handleUseCurrentLocation = async () => {
    const pos = await getCurrentPosition();
    if (pos) {
      handlePositionChange(pos.coords.latitude, pos.coords.longitude);
    }
  };

  // Fetch address on mount if we have initial coordinates
  useEffect(() => {
    if (initialLat !== null && initialLng !== null) {
      fetchAddress(initialLat, initialLng);
    }
  }, [initialLat, initialLng, fetchAddress]);

  const handleConfirm = () => {
    onSelect(position[0], position[1], address || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{t('map.selectLocation')}</h2>
              <p className="text-xs text-muted-foreground">{t('map.dragToAdjust')}</p>
            </div>
          </div>
          <Button onClick={handleConfirm} size="sm" className="gap-2">
            <Check className="h-4 w-4" />
            {t('common.confirm')}
          </Button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} onPositionChange={handlePositionChange} />
        <MapClickHandler onLocationChange={handlePositionChange} />
      </MapContainer>

      {/* Current location button */}
      <div className="absolute bottom-24 right-4 z-[1000]">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleUseCurrentLocation}
          disabled={geoLoading}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          {geoLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Crosshair className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Address display */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div className="bg-background/95 backdrop-blur rounded-lg border px-4 py-3 shadow-lg">
          <p className="text-sm font-medium">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
          {isLoadingAddress ? (
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          ) : address ? (
            <p className="text-sm text-muted-foreground line-clamp-2">{address}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
