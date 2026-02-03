import { useTranslation } from 'react-i18next';
import fallbackCityImg from '@/assets/fallback-city.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Navigation, 
  FileText,
  ExternalLink,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPlaceHeroUrl } from '@/lib/utils/placeImage';
import { useState, useEffect } from 'react';
import type { FriendPlace } from '@/lib/types';

interface LocationState {
  place: FriendPlace;
  friendName: string;
  friendColor: string;
}

/**
 * Friend place detail page - read only view
 */
export function FriendPlaceDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  const place = state?.place;
  const friendName = state?.friendName;
  const friendColor = state?.friendColor;

  // Set place image (use generated image based on place name)
  useEffect(() => {
    if (!place) return;
    // Pour les lieux d'amis, on utilise directement une image générée basée sur le nom
    setHeroImageUrl(getPlaceHeroUrl(place.name));
  }, [place]);

  const openInMaps = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  if (!place) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">{t('places.notFound')}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
          {t('common.goBack')}
        </Button>
      </div>
    );
  }

  const formattedDate = place.tripDate
    ? new Date(place.tripDate).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  
  // Use fallback image if API hasn't responded yet
  const displayImageUrl = heroImageUrl || getPlaceHeroUrl(place.name);

  return (
    <div className="space-y-6 -mx-4 -mt-4">
      {/* Hero Image Section */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        {/* Background Image */}
        <img
          src={displayImageUrl}
          alt={place.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={e => {
            if ((e.target as HTMLImageElement).src.indexOf('fallback-city.jpg') === -1) {
              (e.target as HTMLImageElement).src = fallbackCityImg;
            }
          }}
        />
        {!imageLoaded && (
          <div 
            className="absolute inset-0 animate-pulse"
            style={{ background: `linear-gradient(135deg, ${friendColor}30, ${friendColor}10)` }}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 rounded-xl bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {/* Friend badge */}
        {friendName && (
          <div 
            className="absolute top-4 right-4 flex items-center gap-1.5 backdrop-blur-sm rounded-full px-3 py-1.5"
            style={{ backgroundColor: `${friendColor}dd` }}
          >
            <User className="h-4 w-4 text-white" />
            <span className="text-xs font-medium text-white">{friendName}</span>
          </div>
        )}
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{place.name}</h1>
          {place.address && (
            <p className="text-white/80 mt-1 flex items-center gap-1.5 drop-shadow">
              <MapPin className="h-4 w-4" />
              {place.address}
            </p>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-3 px-4">
        {/* Location Card */}
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-start gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${friendColor}20, ${friendColor}08)` }}
            >
              <MapPin className="h-5 w-5" style={{ color: friendColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{t('places.location')}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={openInMaps}
                className="mt-3 gap-2 rounded-xl"
              >
                <Navigation className="h-4 w-4" />
                {t('places.openInMaps')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trip Date Card */}
        {formattedDate && (
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-start gap-3">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${friendColor}20, ${friendColor}08)` }}
              >
                <Calendar className="h-5 w-5" style={{ color: friendColor }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{t('places.plannedDate')}</p>
                <p className="text-sm text-muted-foreground mt-0.5 capitalize">{formattedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes Card */}
        {place.notes && (
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-start gap-3">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${friendColor}20, ${friendColor}08)` }}
              >
                <FileText className="h-5 w-5" style={{ color: friendColor }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-2">{t('places.notes')}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {place.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Friend info card */}
        <div 
          className="rounded-2xl p-4 text-center"
          style={{ background: `linear-gradient(135deg, ${friendColor}15, ${friendColor}05)`, borderColor: `${friendColor}30`, borderWidth: 1 }}
        >
          <p className="text-sm" style={{ color: friendColor }}>
            <User className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
            {t('friends.placeFrom', { name: friendName })}
          </p>
        </div>
      </div>

      {/* Bottom padding for safe area */}
      <div className="h-4" />
    </div>
  );
}
