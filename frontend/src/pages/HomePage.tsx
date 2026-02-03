import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Plus, 
  ChevronRight, 
  Map,
  Trophy,
  Users,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { XPOrb, StreakCounter, LevelBadge, DailyQuestCard, DailyQuestBonusCard } from '@/components/gamification';
import { useStreak, useDailyQuests, useConfetti } from '@/lib/hooks';
import { useGamification } from '@/features/gamification/context/GamificationContext';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

// Stats card component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color,
  onClick 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'glass-card p-4 text-left w-full',
        onClick && 'cursor-pointer'
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-xl', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-green-500">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.button>
  );
}

// Quick action button
function QuickAction({ 
  icon: Icon, 
  label, 
  to, 
  gradient 
}: { 
  icon: React.ElementType;
  label: string;
  to: string;
  gradient: string;
}) {
  return (
    <Link to={to}>
      <motion.div
        className={cn(
          'flex flex-col items-center gap-2 p-4 rounded-2xl',
          'glass hover:shadow-xl transition-shadow'
        )}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={cn('p-3 rounded-xl', gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </motion.div>
    </Link>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useGamification();
  const stats = profile ? {
    xp: profile.xp,
    level: profile.level,
    placesCount: profile.placesCount,
    visitedCount: profile.placesVisitedCount,
  } : null;
  const streak = useStreak();
  const dailyQuests = useDailyQuests();
  const { fireXP } = useConfetti();
  
  const [showWelcome, setShowWelcome] = useState(false);

  // Get user stats
  const xp = stats?.xp ?? 0;
  const level = stats?.level ?? 1;
  const nextLevelXP = (level * 1000) + (level * 500); // Simple progression formula
  const placesCount = stats?.placesCount ?? 0;
  const visitedCount = stats?.visitedCount ?? 0;

  // Check for first visit today
  useEffect(() => {
    const lastVisit = localStorage.getItem('wanttogo_last_home_visit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      setShowWelcome(true);
      localStorage.setItem('wanttogo_last_home_visit', today);
      
      // Record activity for streak
      streak.recordActivity();
      
      setTimeout(() => setShowWelcome(false), 3000);
    }
  }, [streak]);

  const handleClaimBonus = () => {
    const bonus = dailyQuests.claimBonus();
    if (bonus > 0) {
      fireXP(bonus);
    }
  };

  return (
    <div className="min-h-full pb-20">
      {/* Header with gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        
        <div className="relative px-4 pt-safe pt-6 pb-20">
          {/* Welcome message */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-white/70 text-sm">
              {showWelcome ? t('home.welcomeBack') : t('home.greeting')}
            </p>
            <h1 className="text-2xl font-bold text-white">
              {user?.name || t('home.traveler')} 👋
            </h1>
          </motion.div>

          {/* XP & Level Section */}
          <div className="flex items-center justify-center gap-6">
            <XPOrb
              currentXP={xp}
              nextLevelXP={nextLevelXP}
              level={level}
              size="lg"
              animate
            />
            
            <div className="flex flex-col gap-3">
              <LevelBadge level={level} size="lg" showName />
              <StreakCounter
                streak={streak.currentStreak}
                multiplier={streak.multiplier}
                isActiveToday={streak.isActiveToday}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content - overlaps header */}
      <div className="relative -mt-8 px-4 space-y-6">
        {/* Stats cards */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon={MapPin}
            label={t('home.stats.placesAdded')}
            value={placesCount}
            trend="+3"
            color="bg-primary"
            onClick={() => navigate('/places')}
          />
          <StatCard
            icon={Trophy}
            label={t('home.stats.placesVisited')}
            value={visitedCount}
            color="gradient-gold"
            onClick={() => navigate('/places?filter=visited')}
          />
        </motion.div>

        {/* Daily Quests Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('home.dailyQuests')}
            </h2>
            <span className="text-sm text-muted-foreground">
              {dailyQuests.completedCount}/3
            </span>
          </div>

          <div className="space-y-3">
            {dailyQuests.quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <DailyQuestCard quest={quest} />
              </motion.div>
            ))}

            {/* Bonus card */}
            <DailyQuestBonusCard
              completed={dailyQuests.completedCount}
              total={3}
              bonusXP={500}
              canClaim={dailyQuests.canClaimBonus}
              onClaim={handleClaimBonus}
            />
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-3">
            {t('home.quickActions')}
          </h2>
          
          <div className="grid grid-cols-4 gap-3">
            <QuickAction
              icon={Plus}
              label={t('nav.add')}
              to="/add"
              gradient="gradient-primary"
            />
            <QuickAction
              icon={Map}
              label={t('nav.map')}
              to="/map"
              gradient="bg-emerald-500"
            />
            <QuickAction
              icon={Users}
              label={t('nav.friends')}
              to="/friends"
              gradient="bg-purple-500"
            />
            <QuickAction
              icon={Trophy}
              label={t('nav.leaderboard')}
              to="/leaderboard"
              gradient="gradient-gold"
            />
          </div>
        </motion.section>

        {/* Map Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">
              {t('home.yourMap')}
            </h2>
            <Link 
              to="/map" 
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              {t('common.viewMore')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Link to="/map">
            <motion.div
              className="relative h-40 rounded-2xl overflow-hidden glass"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Placeholder map preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Map className="w-12 h-12 text-muted-foreground/50" />
                </div>
                
                {/* Fake pins */}
                <div className="absolute top-1/4 left-1/3">
                  <MapPin className="w-6 h-6 text-primary" fill="currentColor" />
                </div>
                <div className="absolute top-1/2 right-1/4">
                  <MapPin className="w-6 h-6 text-green-500" fill="currentColor" />
                </div>
                <div className="absolute bottom-1/3 left-1/2">
                  <MapPin className="w-6 h-6 text-primary" fill="currentColor" />
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              
              {/* Label */}
              <div className="absolute bottom-4 left-4">
                <p className="text-sm font-medium text-foreground">
                  {placesCount} {t('home.placesOnMap')}
                </p>
              </div>
            </motion.div>
          </Link>
        </motion.section>

        {/* CTA for empty state */}
        {placesCount === 0 && (
          <motion.section
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('home.emptyState.title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('home.emptyState.description')}
            </p>
            <Button
              onClick={() => navigate('/add')}
              className="gradient-primary text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('home.emptyState.cta')}
            </Button>
          </motion.section>
        )}
      </div>
    </div>
  );
}

export default HomePage;
