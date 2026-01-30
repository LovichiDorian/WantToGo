import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Search, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import { SyncStatus } from '@/features/offline/components/SyncStatus';
import { useSync } from '@/features/offline/hooks/useSync';
import { TravelStats } from '@/components/TravelStats';
import { getPlaceThumbnailUrl } from '@/lib/utils/placeImage';
import { useState, useMemo } from 'react';

interface Place {
  id: string;
  name: string;
  address?: string | null;
  notes?: string | null;
  latitude: number;
  longitude: number;
  tripDate?: Date | string | null;
  photos?: { id: string; filename?: string }[];
  createdAt: Date | string;
}

// Modern place card component with background image
function PlaceListItem({ place, onClick }: { place: Place; onClick: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const formattedDate = place.tripDate 
    ? new Date(place.tripDate).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  // Get image URL from photos or generate from place name
  const imageUrl = place.photos?.[0]?.filename || getPlaceThumbnailUrl(place.name);

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group relative h-32"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageError && (
          <img 
            src={imageUrl}
            alt=""
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        {/* Fallback gradient if image fails */}
        {(imageError || !imageLoaded) && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-lg truncate drop-shadow-md group-hover:text-primary-foreground transition-colors">
            {place.name}
          </h3>
          
          {place.address && (
            <p className="text-sm text-white/80 truncate mt-0.5 drop-shadow">
              <MapPin className="h-3 w-3 inline-block mr-1" />
              {place.address}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {formattedDate ? (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Calendar className="h-3 w-3 text-white" />
              <span className="text-xs text-white font-medium">{formattedDate}</span>
            </div>
          ) : (
            <div />
          )}
          
          {/* Arrow indicator */}
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * Places list page with modern card design
 */
export function PlacesListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { places, isLoading } = usePlaces();
  const { syncState, pendingCount } = useSync();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter places based on search query
  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places;
    
    const query = searchQuery.toLowerCase();
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.address?.toLowerCase().includes(query) ||
        place.notes?.toLowerCase().includes(query)
    );
  }, [places, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('places.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {places.length} {places.length === 1 ? 'lieu' : 'lieux'}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/add')} 
          size="sm" 
          className="gap-2 rounded-xl shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('places.addNew')}</span>
        </Button>
      </div>

      {/* Search bar */}
      {places.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('places.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
      )}

      {/* Travel Statistics */}
      <TravelStats places={places} />

      {/* Sync status */}
      <SyncStatus syncState={syncState} pendingCount={pendingCount} />

      {/* Places list */}
      {filteredPlaces.length > 0 ? (
        <div className="grid gap-3">
          {filteredPlaces.map((place) => (
            <PlaceListItem
              key={place.id}
              place={place}
              onClick={() => navigate(`/place/${place.id}`)}
            />
          ))}
        </div>
      ) : places.length > 0 ? (
        // No search results
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">{t('places.noSearchResults')}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Essayez avec d'autres mots-clés
          </p>
        </div>
      ) : (
        // Empty state
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-5">
            <MapPin className="h-9 w-9 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('places.noPlaces')}</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">{t('places.noPlacesDescription')}</p>
          <Button onClick={() => navigate('/add')} className="gap-2 mt-6 rounded-xl">
            <Plus className="h-4 w-4" />
            {t('places.addNew')}
          </Button>
        </div>
      )}
    </div>
  );
}
