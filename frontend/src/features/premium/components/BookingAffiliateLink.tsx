import { useTranslation } from 'react-i18next';
import { ExternalLink, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookingAffiliateLinkProps {
  placeName: string;
  latitude: number;
  longitude: number;
  city?: string;
  className?: string;
  variant?: 'button' | 'card';
}

/**
 * Booking.com affiliate link component
 * 
 * To activate affiliate tracking:
 * 1. Sign up for Booking.com Affiliate Partner Programme
 * 2. Get your affiliate ID (aid parameter)
 * 3. Set VITE_BOOKING_AFFILIATE_ID in .env
 * 
 * See README_BOOKING.md for detailed instructions
 */
export function BookingAffiliateLink({
  placeName,
  latitude,
  longitude,
  city,
  className,
  variant = 'button',
}: BookingAffiliateLinkProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  // Get affiliate ID from environment (or use placeholder)
  const affiliateId = import.meta.env.VITE_BOOKING_AFFILIATE_ID || 'PLACEHOLDER';
  
  // Build Booking.com search URL
  // Using coordinates for accuracy, with city fallback
  const searchQuery = city || placeName;
  const bookingUrl = new URL('https://www.booking.com/searchresults.html');
  
  // Set parameters
  bookingUrl.searchParams.set('ss', searchQuery);
  bookingUrl.searchParams.set('latitude', latitude.toFixed(6));
  bookingUrl.searchParams.set('longitude', longitude.toFixed(6));
  bookingUrl.searchParams.set('aid', affiliateId);
  bookingUrl.searchParams.set('lang', isEnglish ? 'en-us' : 'fr');
  
  // Open in new tab for PWA compatibility
  const handleClick = () => {
    window.open(bookingUrl.toString(), '_blank', 'noopener,noreferrer');
  };

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-4',
          'bg-gradient-to-br from-blue-600/10 to-blue-800/10',
          'border border-blue-500/20',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#003580] flex items-center justify-center flex-shrink-0">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {t('booking.findHotelsNear', { place: placeName })}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {t('booking.poweredBy')}
              <span className="text-[#003580] font-medium">Booking.com</span>
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleClick}
            className="rounded-xl bg-[#003580] hover:bg-[#00264d] gap-1"
          >
            {t('booking.findHotels')}
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Affiliate disclosure */}
        <p className="text-[10px] text-muted-foreground/60 mt-2">
          {t('booking.affiliate')}
        </p>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={cn('gap-2 rounded-xl', className)}
    >
      <Hotel className="w-4 h-4 text-[#003580]" />
      {t('places.findHotels')}
      <ExternalLink className="w-3 h-3" />
    </Button>
  );
}
