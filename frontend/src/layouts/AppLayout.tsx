import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OfflineBanner } from '@/features/offline/components/OfflineBanner';
import { UpdatePrompt } from '@/features/pwa/components/UpdatePrompt';
import { useServiceWorker } from '@/features/pwa/hooks/useServiceWorker';
import { InstallPrompt } from '@/features/pwa/components/InstallPrompt';
import { useGamification } from '@/features/gamification/context/GamificationContext';
import { LevelBadge } from '@/components/gamification';
import { WantToGoBottomNav } from '@/components/Nav';
import { AIChatPanel } from '@/components/AI';

/**
 * WantToGo 2.0 - Main App Layout
 * Mobile-first with glassmorphism navigation and AI chatbot
 */
export function AppLayout() {
  useTranslation();
  const location = useLocation();
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const { profile } = useGamification();
  const stats = profile ? { level: profile.level, xp: profile.xp } : null;

  // AI Chat Panel state
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

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
            ? "fixed inset-0 top-0 bottom-24"
            : isHomePage
              ? "pb-28"
              : "pt-14 pb-28 px-4 max-w-screen-xl mx-auto w-full"
        )}
      >
        <Outlet />
      </main>

      {/* Modern Bottom Navigation - WantToGo 2026 */}
      <WantToGoBottomNav
        onAIClick={() => setIsAIChatOpen(true)}
      />

      {/* AI Chat Panel - Slide-up */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Offline banner */}
      <OfflineBanner />
    </div>
  );
}
