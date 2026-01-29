import { MapPin, Calendar, Cloud, CloudOff, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Place } from '@/lib/types';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const formattedDate = place.tripDate
    ? new Date(place.tripDate).toLocaleDateString()
    : null;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{place.name}</h3>
              {place.syncStatus === 'pending' ? (
                <CloudOff className="h-4 w-4 text-amber-500 flex-shrink-0" />
              ) : (
                <Cloud className="h-4 w-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            
            {place.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{place.address}</span>
              </p>
            )}
            
            {formattedDate && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{formattedDate}</span>
              </p>
            )}
            
            {place.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {place.notes}
              </p>
            )}
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
        
        {place.photos.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {place.photos.slice(0, 3).map((photo) => (
              <div
                key={photo.id}
                className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden"
              >
                <img
                  src={photo.filename}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {place.photos.length > 3 && (
              <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 flex items-center justify-center text-sm text-muted-foreground">
                +{place.photos.length - 3}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
