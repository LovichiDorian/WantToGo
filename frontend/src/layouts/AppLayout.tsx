import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  Plus, 
  MapPin, 
  Users, 
  Trophy, 
  User, 
  Home,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OfflineBanner } from '@/features/offline/components/OfflineBanner';
import { UpdatePrompt } from '@/features/pwa/components/UpdatePrompt';
import { useServiceWorker } from '@/features/pwa/hooks/useServiceWorker';
import { InstallPrompt } from '@/features/pwa/components/InstallPrompt';
import { useGamification } from '@/features/gamification/context/GamificationContext';
import { LevelBadge } from '@/components/gamification';

/**
 * WantToGo 2.0 - Main App Layout
 * Mobile-first with glassmorphism navigation
 */
export function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const { profile } = useGamification();
  const stats = profile ? { level: profile.level, xp: profile.xp } : null;

  const isMapPage = location.pathname === '/map';
  const isHomePage = location.pathname === '/';
  const isFullscreenPage = isMapPage;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Update prompt banner */}
      <UpdatePrompt isUpdateAvailable={isUpdateAvailable} onUpdate={updateServiceWorker} />

      {/* Floating Header - transparent on map/home */}
      <AnimatePresence>
        {!isFullscreenPage && (
          <motion.header 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
              isHomePage 
                ? "bg-transparent" 
                : "glass-strong border-b border-white/10"
            )}
          >
            <div className="flex h-14 items-center justify-between px-4 max-w-screen-xl mx-auto">
              <NavLink to="/" className="flex items-center gap-2.5 group">
                <motion.div 
                  className="flex items-center justify-center w-10 h-10 rounded-2xl gradient-primary shadow-lg glow-sm"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    WantToGo
                  </h1>
                </div>
              </NavLink>
              
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
                  {stats ? (
                    <LevelBadge level={stats.level} size="sm" showName={false} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </NavLink>
                
                <InstallPrompt />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Map page header - minimal */}
      {isFullscreenPage && (
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="flex h-14 items-center justify-between px-4 max-w-screen-xl mx-auto">
            <NavLink 
              to="/" 
              className="pointer-events-auto glass-strong rounded-2xl p-2 shadow-lg"
            >
              <motion.div 
                className="flex items-center justify-center w-8 h-8 rounded-xl gradient-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MapPin className="h-4 w-4 text-white" />
              </motion.div>
            </NavLink>
            
            <NavLink
              to="/profile"
              className="pointer-events-auto glass-strong rounded-2xl p-2 shadow-lg"
            >
              {stats ? (
                <LevelBadge level={stats.level} size="sm" showName={false} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </NavLink>
          </div>
        </header>
      )}

      {/* Main content */}
      <main 
        className={cn(
          "flex-1",
          isFullscreenPage 
            ? "fixed inset-0 top-0 bottom-20" 
            : isHomePage
            ? "pb-20"
            : "pt-14 pb-20 px-4 max-w-screen-xl mx-auto w-full"
        )}
      >
        <Outlet />
      </main>

      {/* Modern Bottom Navigation - Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-3 mb-3 rounded-3xl glass-strong shadow-2xl shadow-black/10 border border-white/20">
          <div className="flex h-16 items-center justify-between px-1 relative">
            {/* Left: Home, Map */}
            <div className="flex items-center gap-1">
              <NavItem to="/" icon={Home} label={t('nav.home')} />
              <NavItem to="/map" icon={Map} label={t('nav.map')} />
            </div>
            
            {/* Center: Add button (elevated) */}
            <div className="relative -mt-8">
              <NavLink to="/add">
                <motion.div
                  className="flex items-center justify-center w-14 h-14 gradient-primary text-white rounded-2xl shadow-lg shadow-primary/40"
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                </motion.div>
              </NavLink>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl gradient-primary opacity-40 blur-xl -z-10" />
            </div>

            {/* Right: Assistant, Friends, Leaderboard */}
            <div className="flex items-center gap-1">
              <NavItem 
                to="/assistant" 
                icon={Sparkles} 
                label={t('nav.assistant')} 
                accentColor="text-violet-500"
              />
              <NavItem to="/friends" icon={Users} label={t('nav.friends')} />
              <NavItem 
                to="/leaderboard" 
                icon={Trophy} 
                label={t('nav.leaderboard')} 
                accentColor="text-amber-500"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Offline banner */}
      <OfflineBanner />
    </div>
  );
}

// Navigation Item Component
interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  accentColor?: string;
}

function NavItem({ to, icon: Icon, label, accentColor }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-xl transition-all duration-200',
          'min-w-[48px]',
          isActive
            ? accentColor || 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <motion.div
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
          <span className="text-[9px] font-medium leading-tight">{label}</span>
          {isActive && (
            <motion.div
              layoutId="nav-indicator"
              className={cn(
                "absolute bottom-1.5 w-1 h-1 rounded-full",
                accentColor === "text-violet-500" ? "bg-violet-500" :
                accentColor === "text-amber-500" ? "bg-amber-500" :
                "bg-primary"
              )}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
