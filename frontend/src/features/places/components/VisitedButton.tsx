import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Check, MapPin, Loader2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { XPBadge } from '@/features/gamification/components/XPToast';
import { cn } from '@/lib/utils';

interface VisitedButtonProps {
  placeId: string;
  placeName: string;
  isVisited: boolean;
  visitedAt?: string | null;
  latitude: number;
  longitude: number;
  onVisited: (placeId: string, isNearby: boolean) => Promise<{ xpEarned: number; bonusXp: number }>;
  onUndoVisited: (placeId: string) => Promise<void>;
  className?: string;
}

// Distance threshold in meters for "nearby" bonus
const NEARBY_THRESHOLD_METERS = 500;

export function VisitedButton({
  placeId,
  placeName,
  isVisited,
  visitedAt,
  latitude,
  longitude,
  onVisited,
  onUndoVisited,
  className,
}: VisitedButtonProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);
  const isEnglish = i18n.language === 'en';

  // Calculate hours left for undo (24h window)
  useEffect(() => {
    if (isVisited && visitedAt) {
      const visitedTime = new Date(visitedAt).getTime();
      const now = Date.now();
      const msLeft = 24 * 60 * 60 * 1000 - (now - visitedTime);
      const hours = Math.max(0, Math.ceil(msLeft / (60 * 60 * 1000)));
      setHoursLeft(hours > 0 ? hours : null);
    } else {
      setHoursLeft(null);
    }
  }, [isVisited, visitedAt]);

  // Get user location when opening confirm dialog
  useEffect(() => {
    if (confirmDialogOpen && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          
          // Calculate distance
          const distance = calculateDistance(loc.lat, loc.lng, latitude, longitude);
          setIsNearby(distance <= NEARBY_THRESHOLD_METERS);
        },
        () => {
          // Geolocation failed, no bonus
          setUserLocation(null);
          setIsNearby(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [confirmDialogOpen, latitude, longitude, userLocation]);

  const handleMarkVisited = async () => {
    setIsLoading(true);
    try {
      const result = await onVisited(placeId, isNearby);
      
      // Show confetti celebration
      const colors = ['#3b82f6', '#f97316', '#22c55e', '#fbbf24'];
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      toast({
        title: isEnglish ? 'Place visited! 🎉' : 'Lieu visité ! 🎉',
        description: (
          <div className="flex items-center gap-2">
            <XPBadge xp={result.xpEarned} />
            {result.bonusXp > 0 && (
              <span className="text-green-500 text-sm font-medium">
                (+{result.bonusXp} {isEnglish ? 'nearby bonus!' : 'bonus proximité !'})
              </span>
            )}
          </div>
        ),
      });

      setConfirmDialogOpen(false);
    } catch (err) {
      toast({
        title: t('errors.generic'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndoVisited = async () => {
    setIsLoading(true);
    try {
      await onUndoVisited(placeId);
      toast({
        title: isEnglish ? 'Visit undone' : 'Visite annulée',
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: error.message || t('errors.generic'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVisited) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
          <Check className="w-5 h-5" />
          <span className="font-medium">{t('places.visited')}</span>
        </div>
        
        {hoursLeft !== null && hoursLeft > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndoVisited}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Undo2 className="w-4 h-4 mr-1" />
                {t('places.undoVisited', { hours: hoursLeft })}
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setConfirmDialogOpen(true)}
        className={cn(
          'gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white',
          className
        )}
      >
        <Check className="w-5 h-5" />
        {t('places.markVisited')}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              {t('places.visitedConfirmTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('places.visitedConfirmDescription', { xp: 200, name: placeName })}
            </DialogDescription>
          </DialogHeader>

          {/* Nearby Bonus Indicator */}
          {isNearby && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {t('places.visitedWithGeoloc', { bonus: 300 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isEnglish 
                    ? `You're within ${NEARBY_THRESHOLD_METERS}m of this place` 
                    : `Vous êtes à moins de ${NEARBY_THRESHOLD_METERS}m de ce lieu`}
                </p>
              </div>
            </div>
          )}

          {!isNearby && userLocation && (
            <p className="text-sm text-muted-foreground">
              {isEnglish 
                ? 'Visit the location to earn a +300 XP bonus!' 
                : 'Visitez le lieu pour gagner un bonus de +300 XP !'}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
              className="flex-1 rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleMarkVisited}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Check className="w-4 h-4 mr-2" />
              {t('common.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
