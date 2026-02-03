import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plane, 
  Plus, 
  Users, 
  MapPin,
  Lock,
  Unlock,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PremiumBanner } from '@/features/premium/components/PremiumBanner';
import * as tripsAPI from '@/lib/api/trips';
import type { Trip, TripsResponse } from '@/lib/api/trips';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export function TripsPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [tripsData, setTripsData] = useState<TripsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [newTripName, setNewTripName] = useState({ en: '', fr: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEnglish = i18n.language === 'en';

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await tripsAPI.getTrips();
      setTripsData(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    if (!newTripName.en.trim() || !newTripName.fr.trim()) return;
    
    setIsSubmitting(true);
    try {
      await tripsAPI.createTrip({
        nameEn: newTripName.en.trim(),
        nameFr: newTripName.fr.trim(),
      });
      toast({
        title: isEnglish ? 'Trip created!' : 'Voyage créé !',
        description: isEnglish ? 'Start adding places to your trip.' : 'Commencez à ajouter des lieux.',
      });
      setCreateDialogOpen(false);
      setNewTripName({ en: '', fr: '' });
      loadTrips();
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: t('errors.generic'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!selectedTrip) return;
    
    setIsSubmitting(true);
    try {
      await tripsAPI.deleteTrip(selectedTrip.id);
      toast({
        title: isEnglish ? 'Trip deleted' : 'Voyage supprimé',
      });
      setDeleteDialogOpen(false);
      setSelectedTrip(null);
      loadTrips();
    } catch (err) {
      toast({
        title: t('errors.generic'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canCreateTrip = tripsData?.limits.isPremium || 
    (tripsData?.limits.current ?? 0) < (tripsData?.limits.max ?? 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plane className="w-7 h-7 text-primary" />
          {t('trips.myTrips')}
        </h1>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          disabled={!canCreateTrip}
          className="rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('trips.createTrip')}
        </Button>
      </div>

      {/* Trip Limit Info */}
      {tripsData && !tripsData.limits.isPremium && (
        <div className="text-sm text-muted-foreground">
          {t('trips.freeLimit', {
            current: tripsData.limits.current,
            max: tripsData.limits.max,
          })}
        </div>
      )}

      {/* Premium Banner for unlimited trips */}
      {tripsData && !tripsData.limits.isPremium && tripsData.limits.current >= (tripsData.limits.max ?? 3) && (
        <PremiumBanner
          featureKey="unlimited_trips"
          title={t('trips.unlimitedTrips')}
          description={t('trips.unlimitedTripsDescription')}
        />
      )}

      {/* Trips List */}
      {tripsData?.trips.length === 0 ? (
        <div className="text-center py-16">
          <Plane className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold mb-2">{t('trips.noTrips')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('trips.noTripsDescription')}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} disabled={!canCreateTrip}>
            <Plus className="w-4 h-4 mr-2" />
            {t('trips.createTrip')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tripsData?.trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isEnglish={isEnglish}
              onEdit={() => {
                // Navigate to trip detail/edit
                // For now, just show toast
                toast({ title: t('common.comingSoon') });
              }}
              onDelete={() => {
                setSelectedTrip(trip);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Create Trip Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('trips.createTrip')}</DialogTitle>
            <DialogDescription>
              {isEnglish 
                ? 'Create a new collaborative trip with your friends.'
                : 'Créez un nouveau voyage collaboratif avec vos amis.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trip-name-en">
                {t('trips.tripName')} (English)
              </Label>
              <Input
                id="trip-name-en"
                placeholder={t('trips.tripNamePlaceholder')}
                value={newTripName.en}
                onChange={(e) => setNewTripName({ ...newTripName, en: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-name-fr">
                {t('trips.tripName')} (Français)
              </Label>
              <Input
                id="trip-name-fr"
                placeholder="Vacances d'été 2026"
                value={newTripName.fr}
                onChange={(e) => setNewTripName({ ...newTripName, fr: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCreateTrip}
              disabled={!newTripName.en.trim() || !newTripName.fr.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('trips.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('trips.deleteConfirmDescription', {
                name: selectedTrip ? (isEnglish ? selectedTrip.nameEn : selectedTrip.nameFr) : '',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTrip}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('common.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Trip Card Component
function TripCard({
  trip,
  isEnglish,
  onEdit,
  onDelete,
}: {
  trip: Trip;
  isEnglish: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const name = isEnglish ? trip.nameEn : trip.nameFr;
  const placesCount = trip._count?.places ?? trip.places?.length ?? 0;
  const isOwner = trip.userRole === 'owner';

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Cover Image or Gradient */}
      <div className={cn(
        'h-24 relative',
        trip.coverImage 
          ? '' 
          : 'bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400'
      )}>
        {trip.coverImage && (
          <img 
            src={trip.coverImage} 
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Visibility Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            trip.isPublic 
              ? 'bg-green-500/20 text-green-200' 
              : 'bg-slate-500/20 text-slate-200'
          )}>
            {trip.isPublic ? (
              <Unlock className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {trip.isPublic ? t('trips.public') : t('trips.private')}
          </span>
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('trips.editTrip')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('trips.deleteTrip')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg truncate">{name}</h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {t('trips.places', { count: placesCount })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {trip.members.length}
            </span>
          </div>

          {/* Role Badge */}
          {trip.userRole && (
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              trip.userRole === 'owner' && 'bg-amber-500/10 text-amber-600',
              trip.userRole === 'editor' && 'bg-blue-500/10 text-blue-600',
              trip.userRole === 'member' && 'bg-slate-500/10 text-slate-600'
            )}>
              {trip.userRole === 'owner' && <Crown className="w-3 h-3" />}
              {t(`trips.${trip.userRole}`)}
            </span>
          )}
        </div>

        {/* Members Preview */}
        {trip.members.length > 0 && (
          <div className="flex -space-x-2 mt-3">
            {trip.members.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                title={member.user.name || member.user.email}
              >
                {(member.user.name || member.user.email)[0].toUpperCase()}
              </div>
            ))}
            {trip.members.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                +{trip.members.length - 5}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
