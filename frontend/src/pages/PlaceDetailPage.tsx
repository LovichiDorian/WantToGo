import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Cloud, 
  CloudOff, 
  Edit, 
  Trash2, 
  Navigation, 
  Loader2,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import { getPlaceHeroUrl } from '@/lib/utils/placeImage';
import { useState, useMemo } from 'react';

/**
 * Modern place detail page with card-based layout
 */
export function PlaceDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { places, deletePlace, isLoading } = usePlaces();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const place = useMemo(() => places.find((p) => p.id === id), [places, id]);

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await deletePlace(id);
      navigate('/places');
    } catch (error) {
      console.error('Failed to delete place:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const openInMaps = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">{t('places.notFound')}</p>
        <Button onClick={() => navigate('/places')} variant="outline" className="mt-4">
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

  const isPending = place.syncStatus === 'pending';
  
  // Get image URL from photos or generate from place name
  const heroImageUrl = place.photos?.[0]?.filename || getPlaceHeroUrl(place.name);

  return (
    <div className="space-y-6 -mx-4 -mt-4">
      {/* Hero Image Section */}
      <div className="relative h-56 overflow-hidden">
        {/* Background Image */}
        <img 
          src={heroImageUrl}
          alt={place.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 animate-pulse" />
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
        
        {/* Sync status badge */}
        <div className="absolute top-4 right-4">
          {isPending ? (
            <div className="flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
              <CloudOff className="h-4 w-4 text-white" />
              <span className="text-xs font-medium text-white">Hors ligne</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Cloud className="h-4 w-4 text-white" />
              <span className="text-xs font-medium text-white">Synchronisé</span>
            </div>
          )}
        </div>
        
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

      {/* User Photos Gallery (if any) */}
      {place.photos && place.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4">
          {place.photos.map((photo, index) => (
            <div
              key={photo.id}
              className="w-24 h-24 rounded-xl bg-muted flex-shrink-0 overflow-hidden shadow-sm"
            >
              <img
                src={photo.filename}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Info Cards */}
      <div className="space-y-3 px-4">
        {/* Location Card */}
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-500" />
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
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-purple-500" />
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
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-amber-500" />
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
      </div>

      {/* Pending sync notice */}
      {isPending && (
        <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl p-3 text-sm text-center mx-4">
          <CloudOff className="h-4 w-4 inline-block mr-2" />
          {t('places.savedOffline')}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 px-4 pb-4">
        <Button
          variant="outline"
          className="flex-1 gap-2 h-12 rounded-xl"
          onClick={() => navigate(`/edit/${place.id}`)}
        >
          <Edit className="h-4 w-4" />
          {t('common.edit')}
        </Button>
        <Button
          variant="destructive"
          className="flex-1 gap-2 h-12 rounded-xl"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          {t('common.delete')}
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('places.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('places.deleteConfirmDescription', { name: place.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? t('common.loading') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
