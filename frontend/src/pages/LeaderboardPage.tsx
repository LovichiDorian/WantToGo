import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, 
  Medal, 
  Users, 
  Calendar,
  Loader2,
  Crown,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/features/gamification/components/LevelBadge';
import * as leaderboardAPI from '@/lib/api/leaderboard';
import type { LeaderboardEntry, MonthlyChallengeStats } from '@/lib/api/leaderboard';
import { cn } from '@/lib/utils';

type TabType = 'allTime' | 'thisMonth';

export function LeaderboardPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyChallengeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [lb, monthly] = await Promise.all([
        leaderboardAPI.getFriendsLeaderboard(),
        leaderboardAPI.getMonthlyChallengeStats(),
      ]);
      setLeaderboard(lb);
      setMonthlyStats(monthly);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sort based on tab
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (tab === 'thisMonth') {
      return b.xpThisMonth - a.xpThisMonth;
    }
    return b.xp - a.xp;
  });

  // Reassign ranks after sorting
  sortedLeaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  const currentUser = sortedLeaderboard.find(e => e.isCurrentUser);

  return (
    <div className="space-y-6 py-4 pb-24">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-7 h-7 text-amber-500" />
          {t('leaderboard.friendsLeaderboard')}
        </h1>
      </div>

      {/* Monthly Challenge Card */}
      {monthlyStats && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-5 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5" />
              <h2 className="font-semibold">{t('leaderboard.monthlyChallenge')}</h2>
            </div>
            
            <p className="text-white/80 text-sm mb-4">
              {t('leaderboard.challengeDescription')}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">{t('leaderboard.yourRank', { rank: monthlyStats.userRank })}</p>
                <p className="text-2xl font-bold">{monthlyStats.userPlacesThisMonth} {t('leaderboard.placesAdded')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">{t('leaderboard.daysLeft', { days: monthlyStats.daysLeft })}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">
                    {monthlyStats.leaderboard[0]?.placesThisMonth || 0} {t('nav.places')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
        <Button
          variant={tab === 'allTime' ? 'default' : 'ghost'}
          className={cn(
            'flex-1 rounded-lg',
            tab === 'allTime' && 'shadow-md'
          )}
          onClick={() => setTab('allTime')}
        >
          <Trophy className="w-4 h-4 mr-2" />
          {t('leaderboard.allTime')}
        </Button>
        <Button
          variant={tab === 'thisMonth' ? 'default' : 'ghost'}
          className={cn(
            'flex-1 rounded-lg',
            tab === 'thisMonth' && 'shadow-md'
          )}
          onClick={() => setTab('thisMonth')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {t('leaderboard.thisMonth')}
        </Button>
      </div>

      {/* Leaderboard */}
      {sortedLeaderboard.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            {t('leaderboard.noFriendsYet')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Top 3 Podium */}
          {sortedLeaderboard.length >= 3 && (
            <div className="flex justify-center items-end gap-2 mb-6 pt-4">
              {/* 2nd Place */}
              <PodiumCard entry={sortedLeaderboard[1]} position={2} tab={tab} />
              {/* 1st Place */}
              <PodiumCard entry={sortedLeaderboard[0]} position={1} tab={tab} />
              {/* 3rd Place */}
              <PodiumCard entry={sortedLeaderboard[2]} position={3} tab={tab} />
            </div>
          )}

          {/* Rest of the list */}
          <div className="space-y-2">
            {sortedLeaderboard.slice(3).map((entry) => (
              <LeaderboardRow key={entry.userId} entry={entry} tab={tab} />
            ))}
          </div>
        </div>
      )}

      {/* Current User Position (if not in top) */}
      {currentUser && currentUser.rank > 10 && (
        <div className="fixed bottom-20 left-4 right-4 bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-lg p-4">
          <LeaderboardRow entry={currentUser} tab={tab} highlight />
        </div>
      )}
    </div>
  );
}

// Podium Card for top 3
function PodiumCard({ 
  entry, 
  position, 
  tab 
}: { 
  entry: LeaderboardEntry; 
  position: 1 | 2 | 3;
  tab: TabType;
}) {
  const { t } = useTranslation();
  
  const heights = { 1: 'h-28', 2: 'h-20', 3: 'h-16' };
  const widths = { 1: 'w-28', 2: 'w-24', 3: 'w-24' };
  const colors = {
    1: 'bg-gradient-to-t from-amber-500 to-yellow-400',
    2: 'bg-gradient-to-t from-slate-400 to-slate-300',
    3: 'bg-gradient-to-t from-orange-600 to-orange-400',
  };
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className={cn('flex flex-col items-center', position === 1 && 'order-2', position === 2 && 'order-1', position === 3 && 'order-3')}>
      {/* Avatar */}
      <div className={cn(
        'relative rounded-full flex items-center justify-center mb-2',
        position === 1 ? 'w-16 h-16' : 'w-12 h-12',
        entry.isCurrentUser ? 'ring-2 ring-primary ring-offset-2' : ''
      )}>
        <LevelBadge 
          level={entry.level} 
          size={position === 1 ? 'lg' : 'md'} 
          showGlow={position === 1}
        />
        {position === 1 && (
          <Crown className="absolute -top-3 w-6 h-6 text-amber-400" />
        )}
      </div>
      
      {/* Name */}
      <p className={cn(
        'font-semibold truncate max-w-[80px] text-center',
        position === 1 ? 'text-sm' : 'text-xs',
        entry.isCurrentUser && 'text-primary'
      )}>
        {entry.isCurrentUser ? t('leaderboard.you') : entry.name}
      </p>
      
      {/* XP */}
      <p className="text-xs text-muted-foreground">
        {tab === 'thisMonth' ? entry.xpThisMonth : entry.xp} XP
      </p>
      
      {/* Podium */}
      <div className={cn(
        'mt-2 rounded-t-lg flex items-end justify-center',
        widths[position],
        heights[position],
        colors[position]
      )}>
        <span className="text-2xl mb-1">{medals[position]}</span>
      </div>
    </div>
  );
}

// Leaderboard Row
function LeaderboardRow({ 
  entry, 
  tab,
  highlight = false,
}: { 
  entry: LeaderboardEntry; 
  tab: TabType;
  highlight?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl',
      entry.isCurrentUser || highlight 
        ? 'bg-primary/10 border border-primary/20' 
        : 'bg-card border border-border/50',
    )}>
      {/* Rank */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
        entry.rank === 1 && 'bg-amber-500 text-white',
        entry.rank === 2 && 'bg-slate-400 text-white',
        entry.rank === 3 && 'bg-orange-500 text-white',
        entry.rank > 3 && 'bg-muted text-muted-foreground'
      )}>
        {entry.rank <= 3 ? (
          <Medal className="w-4 h-4" />
        ) : (
          `#${entry.rank}`
        )}
      </div>

      {/* Level Badge */}
      <LevelBadge level={entry.level} size="sm" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate',
          entry.isCurrentUser && 'text-primary'
        )}>
          {entry.isCurrentUser ? t('leaderboard.you') : entry.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {entry.placesAdded} {t('leaderboard.placesAdded')} · {entry.placesVisited} {t('leaderboard.placesVisited')}
        </p>
      </div>

      {/* XP */}
      <div className="text-right">
        <p className="font-bold text-primary">
          {(tab === 'thisMonth' ? entry.xpThisMonth : entry.xp).toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">XP</p>
      </div>
    </div>
  );
}
