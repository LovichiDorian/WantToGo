import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Map, List, Plus, Settings, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OfflineBanner } from '@/features/offline/components/OfflineBanner';
import { UpdatePrompt } from '@/features/pwa/components/UpdatePrompt';
import { useServiceWorker } from '@/features/pwa/hooks/useServiceWorker';
import { InstallPrompt } from '@/features/pwa/components/InstallPrompt';

/**
 * Main application layout with floating header and bottom navigation
 * Optimized for map-first experience
 */
export function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

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
          <InstallPrompt />
        </div>
      </header>

      {/* Main content - full height for map, padded for other pages */}
      <main 
        className={cn(
          "flex-1",
          isMapPage 
            ? "fixed inset-0 top-14 bottom-20" 
            : "pt-14 pb-20 px-4 max-w-screen-xl mx-auto w-full"
        )}
      >
        <Outlet />
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-3 mb-3 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/50 shadow-xl shadow-black/5">
          <div className="flex h-16 items-center justify-between px-6 relative">
            {/* Left side: Map and Places */}
            <div className="flex items-center gap-6">
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Map className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t('nav.map')}</span>
              </NavLink>
              <NavLink
                to="/places"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <List className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t('nav.places')}</span>
              </NavLink>
            </div>

            {/* Center: Add button (elevated) */}
            <NavLink
              to="/add"
              className="absolute left-1/2 -translate-x-1/2 -top-5 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
            >
              <Plus className="h-7 w-7" />
            </NavLink>

            {/* Right side: Settings */}
            <div className="flex items-center gap-6">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <Settings className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t('nav.settings')}</span>
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
