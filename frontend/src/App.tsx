import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLayout } from '@/layouts/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { PlacesListPage } from '@/pages/PlacesListPage';
import { PlaceDetailPage } from '@/pages/PlaceDetailPage';
import { FriendPlaceDetailPage } from '@/pages/FriendPlaceDetailPage';
import { PlaceFormPage } from '@/pages/PlaceFormPage';
import { MapPage } from '@/pages/MapPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { FriendsPage } from '@/pages/FriendsPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { TripsPage } from '@/pages/TripsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

import { Toaster } from '@/components/ui/toaster';
import { SplashScreen, OnboardingFlow } from '@/components/onboarding';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { GamificationProvider } from '@/features/gamification/context/GamificationContext';
import { Loader2 } from 'lucide-react';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  },
};

// Animated page wrapper
function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-white" />
          <p className="text-white/70 text-sm">Loading your adventures...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public route - redirects to app if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Animated routes component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><AnimatedPage><LoginPage /></AnimatedPage></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><AnimatedPage><RegisterPage /></AnimatedPage></PublicRoute>} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="map" element={<AnimatedPage><MapPage /></AnimatedPage>} />
          <Route path="places" element={<AnimatedPage><PlacesListPage /></AnimatedPage>} />
          <Route path="place/:id" element={<AnimatedPage><PlaceDetailPage /></AnimatedPage>} />
          <Route path="friend/:friendId/place/:placeId" element={<AnimatedPage><FriendPlaceDetailPage /></AnimatedPage>} />
          <Route path="add" element={<AnimatedPage><PlaceFormPage /></AnimatedPage>} />
          <Route path="edit/:id" element={<AnimatedPage><PlaceFormPage /></AnimatedPage>} />
          <Route path="friends" element={<AnimatedPage><FriendsPage /></AnimatedPage>} />
          <Route path="assistant" element={<AnimatedPage><AssistantPage /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><SettingsPage /></AnimatedPage>} />
          <Route path="profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
          <Route path="leaderboard" element={<AnimatedPage><LeaderboardPage /></AnimatedPage>} />
          <Route path="trips" element={<AnimatedPage><TripsPage /></AnimatedPage>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

// Main App component with splash & onboarding
function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('wanttogo_onboarding_complete');
    
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('wanttogo_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} duration={2000} />
      )}

      {/* Onboarding Flow (after splash, before main app) */}
      {!showSplash && showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* Main App */}
      {!showSplash && !showOnboarding && (
        <AnimatedRoutes />
      )}

      {/* Global Toast */}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <AppContent />
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
