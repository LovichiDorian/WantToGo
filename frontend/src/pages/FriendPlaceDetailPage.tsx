import { useTranslation } from 'react-i18next';
import fallbackCityImg from '@/assets/fallback-city.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Navigation,
  FileText,
  ExternalLink,
  Plus,
  Sparkles,
  Check,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPlaceHeroUrl } from '@/lib/utils/placeImage';
import { cn } from '@/lib/utils';
import type { FriendPlace } from '@/lib/types';

interface LocationState {
  place: FriendPlace;
  friendName: string;
  friendColor: string;
  friendLevel?: number;
  friendAvatar?: {
    base: string;
    color: string;
    accessory?: string | null;
  };
}

// Avatar emoji mapping
const AVATAR_EMOJIS: Record<string, string> = {
  voyageur: '🧳',
  aventurier: '🗺️',
  globe_trotteur: '✈️',
  explorateur: '🧭',
  routard: '🎒',
  nomade: '🏕️',
  vagabond: '🚶',
  pionnier: '⛺',
  decouvreur: '🔭',
  navigateur: '⛵',
  baroudeur: '🏔️',
  marin: '🚢',
  pilote: '🛫',
  champion: '🏆',
  legende: '👑',
};

/**
 * Friend place detail page - enhanced with glassmorphism and gamification
 */
export function FriendPlaceDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isAddingToMap, setIsAddingToMap] = useState(false);
  const [addedToMap, setAddedToMap] = useState(false);

  const place = state?.place;
  const friendName = state?.friendName;
  const friendColor = state?.friendColor || '#3B82F6';
  const friendLevel = state?.friendLevel || 1;
  const friendAvatar = state?.friendAvatar;

  // Set place image
  useEffect(() => {
    if (!place) return;
    setHeroImageUrl(getPlaceHeroUrl(place.name));
  }, [place]);

  const openInMaps = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  const handleAddToMap = async () => {
    setIsAddingToMap(true);
    // TODO: API call to add place to user's map
    await new Promise(resolve => setTimeout(resolve, 800));
    setAddedToMap(true);
    setIsAddingToMap(false);
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

  const displayImageUrl = heroImageUrl || getPlaceHeroUrl(place.name);
  const avatarEmoji = friendAvatar?.base ? AVATAR_EMOJIS[friendAvatar.base] || '🧳' : '🧳';
  const avatarColor = friendAvatar?.color || friendColor;

  return (
    <div className="space-y-4 -mx-4 -mt-4 pb-20">
      {/* Hero Image Section with Friend Avatar */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {/* Background Image */}
        <motion.img
          src={displayImageUrl}
          alt={place.name}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          onError={e => {
            if ((e.target as HTMLImageElement).src.indexOf('fallback-city.jpg') === -1) {
              (e.target as HTMLImageElement).src = fallbackCityImg;
            }
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        {!imageLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ background: `linear-gradient(135deg, ${friendColor}30, ${friendColor}10)` }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Back button - glassmorphism */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Friend Avatar Hero */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-50"
              style={{ backgroundColor: avatarColor }}
            />
            {/* Avatar circle */}
            <div
              className="relative w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 border-white/50 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}dd)`,
                boxShadow: `0 0 20px ${avatarColor}40`
              }}
            >
              {avatarEmoji}
            </div>
            {/* Level badge */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 text-xs font-bold flex items-center justify-center text-yellow-900 border-2 border-white shadow-lg"
            >
              {friendLevel}
            </div>
          </div>
          {/* Friend name badge */}
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-md text-center"
            style={{ backgroundColor: `${avatarColor}80` }}
          >
            {friendName}
          </div>
        </motion.div>

        {/* Title overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{place.name}</h1>
          {place.address && (
            <p className="text-white/80 mt-1 flex items-center gap-1.5 drop-shadow text-sm">
              <MapPin className="h-4 w-4" />
              {place.address}
            </p>
          )}
        </motion.div>
      </div>

      {/* Gamified Add to Map Button */}
      <div className="px-4">
        <motion.button
          onClick={handleAddToMap}
          disabled={isAddingToMap || addedToMap}
          className={cn(
            'w-full py-4 px-6 rounded-2xl font-bold',
            'flex items-center justify-center gap-3',
            'transition-all duration-300',
            'shadow-lg',
            addedToMap
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-xl'
          )}
          whileHover={!isAddingToMap && !addedToMap ? { scale: 1.02 } : undefined}
          whileTap={!isAddingToMap && !addedToMap ? { scale: 0.98 } : undefined}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {isAddingToMap ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                <span>Ajout en cours...</span>
              </motion.div>
            ) : addedToMap ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="h-5 w-5" />
                <span>Ajouté ! +50 XP 🎉</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter à ma carte</span>
                <span className="text-white/70 text-sm ml-1">+50 XP</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Info Cards with glassmorphism */}
      <div className="space-y-3 px-4">
        {/* Location Card */}
        <motion.div
          className="glass-card-centered rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${friendColor}30, ${friendColor}10)` }}
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
        </motion.div>

        {/* Trip Date Card */}
        {formattedDate && (
          <motion.div
            className="glass-card-centered rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${friendColor}30, ${friendColor}10)` }}
              >
                <Calendar className="h-5 w-5" style={{ color: friendColor }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{t('places.plannedDate')}</p>
                <p className="text-sm text-muted-foreground mt-0.5 capitalize">{formattedDate}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notes Card */}
        {place.notes && (
          <motion.div
            className="glass-card-centered rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${friendColor}30, ${friendColor}10)` }}
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
          </motion.div>
        )}

        {/* Premium Friend Card with Avatar */}
        <motion.div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${friendColor}20, ${friendColor}05)`,
            borderColor: `${friendColor}40`,
            borderWidth: 1
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {/* Sparkle decoration */}
          <div className="absolute top-2 right-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>

          <div className="flex items-center gap-3">
            {/* Mini avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-white/50"
              style={{ backgroundColor: avatarColor }}
            >
              {avatarEmoji}
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: friendColor }}>
                {t('friends.placeFrom', { name: friendName })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Niveau {friendLevel} • Explorateur
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
