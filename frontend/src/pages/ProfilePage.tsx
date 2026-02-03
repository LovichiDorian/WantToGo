import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  CheckCircle2,
  Camera,
  Users,
  Globe,
  Building2,
  Trophy,
  Lock,
  ChevronRight,
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { useGamification } from '@/features/gamification/context/GamificationContext';
import { XPProgressBar } from '@/features/gamification/components/XPProgressBar';
import { LevelBadge } from '@/features/gamification/components/LevelBadge';
import { AchievementCard } from '@/features/gamification/components/AchievementCard';
import { PremiumBanner } from '@/features/premium/components/PremiumBanner';
import * as leaderboardAPI from '@/lib/api/leaderboard';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { profile, achievements, xpProgress, isLoading, refreshProfile, refreshAchievements } = useGamification();
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [topCities, setTopCities] = useState<{ city: string; count: number }[]>([]);
  const isEnglish = i18n.language === 'en';

  useEffect(() => {
    refreshProfile();
    refreshAchievements();

    // Load stats
    leaderboardAPI.getTotalDistance().then(r => setTotalDistance(r.totalDistanceKm)).catch(() => { });
    leaderboardAPI.getTopCities().then(setTopCities).catch(() => { });
  }, [refreshProfile, refreshAchievements]);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6 py-4 pb-24">
      {/* Profile Header - Glassmorphism Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-orange-500/90 p-6 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <LevelBadge level={profile.level} size="sm" showGlow />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {profile.name || user?.email.split('@')[0]}
              </h1>
              <p className="text-white/80 text-sm">
                {t('profile.memberSince', {
                  date: new Date(profile.createdAt).toLocaleDateString(
                    isEnglish ? 'en-US' : 'fr-FR',
                    { month: 'long', year: 'numeric' }
                  ),
                })}
              </p>
            </div>
            {/* Settings Button */}
            <Link
              to="/settings"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* XP Progress */}
          {xpProgress && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-white/80">{t('gamification.totalXp')}</p>
                  <p className="text-3xl font-bold">{profile.xp.toLocaleString()}</p>
                </div>
                <LevelBadge level={profile.level} size="lg" showGlow />
              </div>
              <XPProgressBar
                xp={xpProgress.xp}
                level={xpProgress.level}
                xpNeeded={xpProgress.xpNeeded}
                nextLevel={xpProgress.nextLevel}
                progress={xpProgress.progress}
                showLabel={false}
                size="md"
              />
              <p className="text-sm text-white/80 mt-2 text-center">
                {t('gamification.xpToNextLevel', {
                  xp: xpProgress.xpNeeded.toLocaleString(),
                  level: xpProgress.nextLevel,
                })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Grid */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t('profile.stats')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            icon={MapPin}
            value={profile.placesCount}
            label={t('profile.placesAdded')}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            value={profile.placesVisitedCount}
            label={t('profile.placesVisited')}
            color="green"
          />
          <StatCard
            icon={Camera}
            value={profile.photoCount}
            label={t('profile.photosAdded')}
            color="purple"
          />
          <StatCard
            icon={Users}
            value={profile.friendsCount}
            label={t('profile.friendsCount')}
            color="orange"
          />
          <StatCard
            icon={Globe}
            value={profile.countriesCount}
            label={t('profile.countriesVisited')}
            color="cyan"
          />
          <StatCard
            icon={Building2}
            value={profile.citiesCount}
            label={t('profile.citiesExplored')}
            color="pink"
          />
        </div>
      </section>

      {/* Total Distance */}
      {totalDistance !== null && totalDistance > 0 && (
        <section className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('profile.totalDistance')}</p>
              <p className="text-2xl font-bold">
                {totalDistance.toLocaleString()} {t('profile.km')}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Premium Stats Banner */}
      <PremiumBanner
        featureKey="advanced_stats"
        title={t('profile.advancedStats')}
        description={t('profile.advancedStatsDescription')}
      />

      {/* Top Cities (Premium preview) */}
      {topCities.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">{t('profile.topCities')}</h2>
          <div className="space-y-2">
            {topCities.slice(0, 3).map((city, index) => (
              <div
                key={city.city}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl',
                  index === 0 && 'bg-amber-500/10 border border-amber-500/20',
                  index === 1 && 'bg-slate-500/10 border border-slate-500/20',
                  index === 2 && 'bg-orange-500/10 border border-orange-500/20',
                  index > 2 && 'bg-muted/50'
                )}
              >
                <span className="text-2xl">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{city.city}</p>
                  <p className="text-sm text-muted-foreground">
                    {city.count} {t('friends.places')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {t('achievements.title')}
          </h2>
          <span className="text-sm text-muted-foreground">
            {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>

        {/* Unlocked achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {unlockedAchievements.slice(0, 4).map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                compact
              />
            ))}
          </div>
        )}

        {/* Show more unlocked */}
        {unlockedAchievements.length > 4 && (
          <Button variant="ghost" className="w-full mb-4">
            {t('common.viewMore')} ({unlockedAchievements.length - 4} {t('common.more')})
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}

        {/* Locked achievements (show next ones to unlock) */}
        {lockedAchievements.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t('achievements.locked')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {lockedAchievements
                .sort((a, b) => b.progress.percent - a.progress.percent)
                .slice(0, 4)
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    compact
                  />
                ))}
            </div>
          </>
        )}

        {/* No achievements yet */}
        {achievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('achievements.noAchievements')}</p>
            <p className="text-sm">{t('achievements.noAchievementsDescription')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink';
}) {
  const colorClasses = {
    blue: 'from-blue-500/15 to-blue-500/5 text-blue-500',
    green: 'from-green-500/15 to-green-500/5 text-green-500',
    purple: 'from-purple-500/15 to-purple-500/5 text-purple-500',
    orange: 'from-orange-500/15 to-orange-500/5 text-orange-500',
    cyan: 'from-cyan-500/15 to-cyan-500/5 text-cyan-500',
    pink: 'from-pink-500/15 to-pink-500/5 text-pink-500',
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className={cn(
        'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3',
        colorClasses[color]
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
