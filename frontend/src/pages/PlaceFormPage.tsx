import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Crosshair, 
  Camera, 
  ImagePlus, 
  X, 
  Loader2,
  Calendar,
  FileText,
  MapIcon,
  CheckCircle2,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import { useGeolocation } from '@/features/map/hooks/useGeolocation';
import { LocationPicker } from '@/features/map/components/LocationPicker';
import { PhotoCapture } from '@/features/photos/components/PhotoCapture';
import { PlaceAutocomplete } from '@/components/PlaceAutocomplete';
import { cn } from '@/lib/utils';

interface PlaceFormData {
  name: string;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  tripDate: string;
}

/**
 * Modern Add/Edit place form page
 */
export function PlaceFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { places, createPlace, updatePlace, isLoading } = usePlaces();
  const { getCurrentPosition, isLoading: geoLoading, error: geoError } = useGeolocation();
  
  const isEditing = Boolean(id);
  const existingPlace = isEditing ? places.find((p) => p.id === id) : undefined;

  const [formData, setFormData] = useState<PlaceFormData>({
    name: '',
    notes: '',
    latitude: null,
    longitude: null,
    address: '',
    tripDate: '',
  });
  const [photos, setPhotos] = useState<{ id: string; blob?: Blob; url: string }[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; location?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form with existing place data
  useEffect(() => {
    if (existingPlace) {
      setFormData({
        name: existingPlace.name,
        notes: existingPlace.notes || '',
        latitude: existingPlace.latitude,
        longitude: existingPlace.longitude,
        address: existingPlace.address || '',
        tripDate: existingPlace.tripDate 
          ? new Date(existingPlace.tripDate).toISOString().split('T')[0] 
          : '',
      });
      if (existingPlace.photos) {
        setPhotos(
          existingPlace.photos.map((p) => ({
            id: p.id,
            url: p.filename || '',
          }))
        );
      }
    }
  }, [existingPlace]);

  const handleInputChange = (field: keyof PlaceFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleGetCurrentLocation = async () => {
    const position = await getCurrentPosition();
    if (position) {
      setFormData((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
      setErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address || prev.address,
    }));
    setShowLocationPicker(false);
    setErrors((prev) => ({ ...prev, location: undefined }));
  };

  const handlePhotoCapture = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const photoId = `temp-${Date.now()}`;
    setPhotos((prev) => [...prev, { id: photoId, blob, url }]);
    setShowPhotoCapture(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const photoId = `temp-${Date.now()}-${Math.random()}`;
        setPhotos((prev) => [...prev, { id: photoId, blob: file, url }]);
      }
    });
    event.target.value = '';
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId);
      if (photo?.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
      }
      return prev.filter((p) => p.id !== photoId);
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; location?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    if (formData.latitude === null || formData.longitude === null) {
      newErrors.location = t('validation.locationRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const placeData = {
        name: formData.name.trim(),
        notes: formData.notes.trim() || undefined,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        address: formData.address.trim() || undefined,
        tripDate: formData.tripDate || undefined,
      };

      if (isEditing && id) {
        await updatePlace(id, placeData);
        navigate(`/place/${id}`);
      } else {
        await createPlace(placeData);
        navigate('/map');
      }
    } catch (error) {
      console.error('Failed to save place:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasLocation = formData.latitude !== null && formData.longitude !== null;

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="flex-shrink-0 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? t('places.editPlace') : t('places.addNew')}
        </h1>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Name Field with Autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            {t('places.name')} <span className="text-destructive">*</span>
          </Label>
          <PlaceAutocomplete
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            onSelect={(place) => {
              handleInputChange('name', place.name);
              handleInputChange('latitude', place.latitude);
              handleInputChange('longitude', place.longitude);
              handleInputChange('address', place.fullName);
              setErrors((prev) => ({ ...prev, location: undefined }));
            }}
            placeholder={t('places.namePlaceholder')}
            className={cn(errors.name && "[&_input]:ring-2 [&_input]:ring-destructive/50")}
          />
          <p className="text-xs text-muted-foreground">
            Tapez pour rechercher et sélectionner un lieu
          </p>
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Location Field */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t('places.location')} <span className="text-destructive">*</span>
          </Label>
          
          {hasLocation ? (
            <div className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/15 to-green-500/5 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {formData.latitude!.toFixed(6)}, {formData.longitude!.toFixed(6)}
                  </p>
                  {formData.address && (
                    <p className="text-sm font-medium mt-0.5 truncate">{formData.address}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLocationPicker(true)}
                  className="rounded-xl"
                >
                  {t('common.edit')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2 h-12 rounded-xl"
                  onClick={handleGetCurrentLocation}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Crosshair className="h-4 w-4" />
                  )}
                  {t('places.useCurrentLocation')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 h-12 rounded-xl"
                  onClick={() => setShowLocationPicker(true)}
                >
                  <MapIcon className="h-4 w-4" />
                </Button>
              </div>
              {geoError && (
                <p className="text-sm text-destructive">{geoError}</p>
              )}
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">{t('places.address')}</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder={t('places.addressPlaceholder')}
            className="h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        {/* Trip Date Field */}
        <div className="space-y-2">
          <Label htmlFor="tripDate" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {t('places.plannedDate')}
          </Label>
          <Input
            id="tripDate"
            type="date"
            value={formData.tripDate}
            onChange={(e) => handleInputChange('tripDate', e.target.value)}
            className="h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>

        {/* Notes Field */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {t('places.notes')}
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder={t('places.notesPlaceholder')}
            rows={4}
            className="rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20 resize-none"
          />
        </div>

        {/* Photos Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('places.photos')}</Label>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 group"
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
            
            {/* Add photo buttons */}
            <button
              type="button"
              onClick={() => setShowPhotoCapture(true)}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs">{t('places.camera')}</span>
            </button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs">{t('places.gallery')}</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full h-14 rounded-xl text-base font-medium gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('common.loading')}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              {t('common.save')}
            </>
          )}
        </Button>
      </div>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          initialLat={formData.latitude}
          initialLng={formData.longitude}
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <PhotoCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowPhotoCapture(false)}
        />
      )}
    </div>
  );
}
