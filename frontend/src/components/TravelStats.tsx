import { useMemo } from 'react';
import { MapPin, Calendar, Globe, TrendingUp, Plane, Clock } from 'lucide-react';
import type { Place } from '@/lib/types';

interface TravelStatsProps {
  places: Place[];
}

export function TravelStats({ places }: TravelStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    
    // Count places with future trip dates
    const upcomingTrips = places.filter(p => {
      if (!p.tripDate) return false;
      return new Date(p.tripDate) > now;
    }).length;
    
    // Count places with past trip dates (visited)
    const visitedPlaces = places.filter(p => {
      if (!p.tripDate) return false;
      return new Date(p.tripDate) <= now;
    }).length;
    
    // Count unique countries (from address)
    const countries = new Set<string>();
    places.forEach(p => {
      if (p.address) {
        // Try to extract country from address (last part)
        const parts = p.address.split(',').map(s => s.trim());
        if (parts.length > 0) {
          countries.add(parts[parts.length - 1]);
        }
      }
    });
    
    // Next trip
    const nextTrip = places
      .filter(p => p.tripDate && new Date(p.tripDate) > now)
      .sort((a, b) => new Date(a.tripDate!).getTime() - new Date(b.tripDate!).getTime())[0];
    
    const daysUntilNextTrip = nextTrip?.tripDate 
      ? Math.ceil((new Date(nextTrip.tripDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    return {
      totalPlaces: places.length,
      upcomingTrips,
      visitedPlaces,
      wishlist: places.filter(p => !p.tripDate).length,
      countries: countries.size,
      nextTrip,
      daysUntilNextTrip,
    };
  }, [places]);

  if (places.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={MapPin}
          label="Lieux"
          value={stats.totalPlaces}
          color="blue"
        />
        <StatCard
          icon={Calendar}
          label="Voyages prévus"
          value={stats.upcomingTrips}
          color="violet"
        />
        <StatCard
          icon={TrendingUp}
          label="Visités"
          value={stats.visitedPlaces}
          color="green"
        />
        <StatCard
          icon={Globe}
          label="Destinations"
          value={stats.countries}
          color="amber"
        />
      </div>

      {/* Next Trip Banner */}
      {stats.nextTrip && stats.daysUntilNextTrip !== null && (
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Prochain voyage</p>
              <p className="font-semibold text-lg">{stats.nextTrip.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-bold text-xl">{stats.daysUntilNextTrip}</span>
              </div>
              <p className="text-xs text-muted-foreground">jours</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: typeof MapPin; 
  label: string; 
  value: number; 
  color: 'blue' | 'violet' | 'green' | 'amber';
}) {
  const colorClasses = {
    blue: 'from-blue-500/15 to-blue-500/5 text-blue-500',
    violet: 'from-violet-500/15 to-violet-500/5 text-violet-500',
    green: 'from-green-500/15 to-green-500/5 text-green-500',
    amber: 'from-amber-500/15 to-amber-500/5 text-amber-500',
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${colorClasses[color].split(' ').pop()}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
