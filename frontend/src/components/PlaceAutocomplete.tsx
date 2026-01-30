import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

interface PlaceResult {
  id: string;
  name: string;
  fullName: string;
  latitude: number;
  longitude: number;
}

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export function PlaceAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Rechercher un lieu...",
  className,
}: PlaceAutocompleteProps) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search places using Nominatim API (OpenStreetMap - free)
  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr',
          },
        }
      );
      
      const data: NominatimResult[] = await response.json();
      
      const places: PlaceResult[] = data.map((item) => ({
        id: String(item.place_id),
        name: extractPlaceName(item),
        fullName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
      
      setResults(places);
      setIsOpen(places.length > 0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Extract a short name from the result
  function extractPlaceName(item: NominatimResult): string {
    const parts = item.display_name.split(',');
    if (parts.length >= 2) {
      return `${parts[0].trim()}, ${parts[1].trim()}`;
    }
    return parts[0].trim();
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);

    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, searchPlaces]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (place: PlaceResult) => {
    onChange(place.name);
    onSelect(place);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-11 pr-10 h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        {isLoading ? (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {results.map((place, index) => (
            <button
              key={place.id}
              type="button"
              onClick={() => handleSelect(place)}
              className={cn(
                "w-full flex items-start gap-3 p-3 text-left hover:bg-accent transition-colors",
                index === selectedIndex && "bg-accent"
              )}
            >
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium truncate">{place.name}</p>
                <p className="text-sm text-muted-foreground truncate">{place.fullName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
