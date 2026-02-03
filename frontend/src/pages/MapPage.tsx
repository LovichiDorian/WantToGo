import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Navigation, Plus, MapPin, ChevronRight, Loader2, Users, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useGeolocation } from '@/features/map/hooks/useGeolocation';
import type { Friend, FriendPlace } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker for user location with pulsing animation
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="relative">
      <div class="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-500 border-[3px] border-white rounded-full shadow-lg"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom place marker (blue for user's places)
const placeIcon = L.divIcon({
  className: 'place-marker',
  html: `
    <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg border-[3px] border-white transform -translate-x-1/2 -translate-y-1/2">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Create a colored marker icon for friends
function createFriendIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'friend-marker',
    html: `
      <div class="flex items-center justify-center w-9 h-9 rounded-full shadow-lg border-[3px] border-white transform -translate-x-1/2 -translate-y-1/2" style="background: ${color}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// Map controls component
function MapControls({ 
  onRecenter, 
  onAddPlace,
  onToggleFriends,
  hasUserPosition,
  showFriends,
  friendCount
}: { 
  onRecenter: () => void; 
  onAddPlace: () => void;
  onToggleFriends: () => void;
  hasUserPosition: boolean;
  showFriends: boolean;
  friendCount: number;
}) {
  const { t } = useTranslation();

  return (
    <div className="absolute right-4 bottom-28 z-[1000] flex flex-col gap-3">
      {friendCount > 0 && (
        <Button
          size="icon"
          variant="secondary"
          className={`h-12 w-12 rounded-full shadow-lg backdrop-blur-sm border border-border/50 transition-colors ${
            showFriends 
              ? 'bg-purple-500 hover:bg-purple-600 text-white border-purple-400' 
              : 'bg-background/95 hover:bg-background'
          }`}
          onClick={onToggleFriends}
          title={showFriends ? t('friends.hideOnMap') : t('friends.showOnMap')}
        >
          {showFriends ? <UsersRound className="h-5 w-5" /> : <Users className="h-5 w-5" />}
        </Button>
      )}
      {hasUserPosition && (
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:bg-background border border-border/50"
          onClick={onRecenter}
          title={t('map.recenter')}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      )}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        onClick={onAddPlace}
        title={t('nav.add')}
      >
        <Plus className="h-7 w-7" />
      </Button>
    </div>
  );
}

// Component to handle map recenter
function MapController({ 
  position, 
  onRecenterRef 
}: { 
  position: [number, number] | null;
  onRecenterRef: React.MutableRefObject<(() => void) | null>;
}) {
  const map = useMap();

  useEffect(() => {
    onRecenterRef.current = () => {
      if (position) {
        map.flyTo(position, 12, { duration: 1 });
      }
    };
  }, [map, position, onRecenterRef]);

  return null;
}

// Selected place card component
function PlaceCard({ 
  place, 
  onViewDetails,
  friendName,
  friendColor
}: { 
  place: { id: string; name: string; address?: string | null; notes?: string | null };
  onViewDetails?: () => void;
  friendName?: string;
  friendColor?: string;
}) {

  return (
    <div 
      className="absolute left-3 right-3 sm:left-4 sm:right-20 bottom-24 sm:bottom-28 z-[1000] animate-in slide-in-from-bottom-4 duration-300"
      onClick={onViewDetails}
    >
      <div className={`bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-3 sm:p-4 ${onViewDetails ? 'cursor-pointer hover:bg-background active:scale-[0.98]' : ''} transition-all`}>
        <div className="flex items-start gap-3">
          <div 
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
            style={{ 
              background: friendColor 
                ? `linear-gradient(135deg, ${friendColor}30, ${friendColor}15)` 
                : 'linear-gradient(135deg, var(--primary) / 0.2, var(--primary) / 0.1)' 
            }}
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: friendColor || 'var(--primary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            {friendName && (
              <p className="text-xs font-medium mb-0.5" style={{ color: friendColor }}>
                {friendName}
              </p>
            )}
            <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{place.name}</h3>
            {place.address && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">{place.address}</p>
            )}
            {place.notes && (
              <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-1 hidden sm:block">{place.notes}</p>
            )}
          </div>
          {onViewDetails && <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />}
        </div>
      </div>
    </div>
  );
}

// Type for selected item (can be user's place or friend's place)
type SelectedItem = 
  | { type: 'place'; place: { id: string; name: string; address?: string | null; notes?: string | null } }
  | { type: 'friend'; place: FriendPlace; friend: Friend };

/**
 * Full-screen map page showing all places as markers
 * This is the main landing page of the app
 */
export function MapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { places, isLoading } = usePlaces();
  const { friends } = useFriends();
  const { latitude, longitude, getCurrentPosition } = useGeolocation();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [showFriends, setShowFriends] = useState(true);
  const mapRef = useRef<L.Map>(null);
  const recenterRef = useRef<(() => void) | null>(null);

  // Get user location on mount
  useEffect(() => {
    getCurrentPosition();
  }, []);

  // Update user position when geolocation changes
  useEffect(() => {
    if (latitude && longitude) {
      setUserPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Calculate initial center and bounds
  const getInitialPosition = (): { center: [number, number]; zoom: number } => {
    if (userPosition) {
      return { center: userPosition, zoom: 6 };
    }

    if (places.length > 0) {
      const lats = places.map((p) => p.latitude);
      const lngs = places.map((p) => p.longitude);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      return { center: [centerLat, centerLng], zoom: 5 };
    }

    // Default to France/Europe view
    return { center: [46.6, 2.5], zoom: 5 };
  };

  const { center, zoom } = getInitialPosition();

  const handleRecenter = () => {
    recenterRef.current?.();
  };

  const handleAddPlace = () => {
    navigate('/add');
  };

  const handleToggleFriends = () => {
    setShowFriends(!showFriends);
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Full-screen map */}
      <MapContainer
        center={center}
        zoom={zoom}
        className="absolute inset-0 z-0"
        ref={mapRef}
        zoomControl={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        minZoom={2}
        worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        {/* User location marker */}
        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup className="user-popup">
              <div className="font-medium text-sm">{t('map.yourLocation')}</div>
            </Popup>
          </Marker>
        )}

        {/* User's place markers (blue) */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={placeIcon}
            eventHandlers={{
              click: () => setSelectedItem({ type: 'place', place }),
            }}
          />
        ))}

        {/* Friends' place markers (colored by friend) */}
        {showFriends && friends.map((friend) =>
          friend.places.map((place) => (
            <Marker
              key={`${friend.id}-${place.id}`}
              position={[place.latitude, place.longitude]}
              icon={createFriendIcon(friend.color)}
              eventHandlers={{
                click: () => setSelectedItem({ type: 'friend', place, friend }),
              }}
            />
          ))
        )}

        <MapController position={userPosition} onRecenterRef={recenterRef} />
      </MapContainer>

      {/* Map controls */}
      <MapControls 
        onRecenter={handleRecenter}
        onAddPlace={handleAddPlace}
        onToggleFriends={handleToggleFriends}
        hasUserPosition={!!userPosition}
        showFriends={showFriends}
        friendCount={friends.length}
      />

      {/* Selected place card */}
      {selectedItem?.type === 'place' && (
        <PlaceCard
          place={selectedItem.place}
          onViewDetails={() => navigate(`/place/${selectedItem.place.id}`)}
        />
      )}
      {selectedItem?.type === 'friend' && (
        <PlaceCard
          place={selectedItem.place}
          friendName={selectedItem.friend.name}
          friendColor={selectedItem.friend.color}
          onViewDetails={() => navigate(`/friend/${selectedItem.friend.id}/place/${selectedItem.place.id}`, {
            state: {
              place: selectedItem.place,
              friendName: selectedItem.friend.name,
              friendColor: selectedItem.friend.color
            }
          })}
        />
      )}
    </div>
  );
}
