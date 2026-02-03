import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Map, List, Plus, Settings, MapPin, Users, Sparkles, Trophy, User, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OfflineBanner } from '@/features/offline/components/OfflineBanner';
import { UpdatePrompt } from '@/features/pwa/components/UpdatePrompt';
import { useServiceWorker } from '@/features/pwa/hooks/useServiceWorker';
import { InstallPrompt } from '@/features/pwa/components/InstallPrompt';
import { useGamification } from '@/features/gamification/context/GamificationContext';
import { LevelBadge } from '@/features/gamification/components/LevelBadge';

/**
 * Main application layout with floating header and bottom navigation
 * Optimized for map-first experience
 */
export function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const { profile } = useGamification();

  const isMapPage = location.pathname === '/map' || location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Update prompt banner */}
      <UpdatePrompt isUpdateAvailable={isUpdateAvailable} onUpdate={updateServiceWorker} />

      {/* Floating Header - more transparent on map */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isMapPage 
            ? "bg-background/80 backdrop-blur-md border-b border-border/50" 
            : "bg-background/95 backdrop-blur-lg border-b border-border"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-foreground">Wanna Go</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Profile link with level badge */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-2 py-1 rounded-xl transition-all',
                  isActive
                    ? 'bg-primary/10'
                    : 'hover:bg-muted/50'
                )
              }
            >
              {profile ? (
                <LevelBadge level={profile.level} size="sm" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </NavLink>
            
            <InstallPrompt />
          </div>
        </div>
      </header>

      {/* Main content - full height for map, padded for other pages */}
      <main 
        className={cn(
          "flex-1",
          isMapPage 
            ? "fixed inset-0 top-14 bottom-16" 
            : "pt-14 pb-16 px-4 max-w-screen-xl mx-auto w-full"
        )}
      >
        <Outlet />
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-2 mb-2 rounded-xl bg-background/90 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5">
          <div className="flex h-12 items-center justify-between px-3 relative">
            {/* Left side: Map and Places */}
            <div className="flex items-center gap-4">
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Map className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.map')}</span>
              </NavLink>
              <NavLink
                to="/places"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <List className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.places')}</span>
              </NavLink>
            </div>

            {/* Center: Add button (elevated) */}
            <NavLink
              to="/add"
              className="absolute left-1/2 -translate-x-1/2 -top-3 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-full shadow-md shadow-primary/25 hover:scale-105 active:scale-95 transition-transform"
            >
              <Plus className="h-5 w-5" />
            </NavLink>

            {/* Right side: Leaderboard, Trips, Friends, AI, Settings */}
            <div className="flex items-center gap-2">
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-amber-500'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Trophy className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.leaderboard')}</span>
              </NavLink>
              <NavLink
                to="/trips"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-sky-500'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Plane className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.trips')}</span>
              </NavLink>
              <NavLink
                to="/friends"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Users className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.friends')}</span>
              </NavLink>
              <NavLink
                to="/assistant"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-violet-500'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.assistant')}</span>
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Settings className="h-4 w-4" />
                <span className="text-[9px] font-medium">{t('nav.settings')}</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Offline banner */}
      <OfflineBanner />
    </div>
  );
}
