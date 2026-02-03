import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  CheckCircle2, 
  Camera, 
  UserPlus, 
  Trophy, 
  TrendingUp,
  Loader2,
  RefreshCw,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/features/gamification/components/LevelBadge';
import * as activitiesAPI from '@/lib/api/activities';
import type { Activity, ActivitiesResponse } from '@/lib/api/activities';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  type?: 'friends' | 'personal';
  limit?: number;
  className?: string;
}

export function ActivityFeed({ type = 'friends', limit = 20, className }: ActivityFeedProps) {
  const { t, i18n } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const isEnglish = i18n.language === 'en';

  const loadActivities = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response: ActivitiesResponse = type === 'friends'
        ? await activitiesAPI.getFriendsActivities(limit, refresh ? undefined : cursor)
        : await activitiesAPI.getMyActivities(limit, refresh ? undefined : cursor);
      
      if (refresh) {
        setActivities(response.items);
      } else {
        setActivities(prev => [...prev, ...response.items]);
      }
      setHasMore(response.hasMore);
      setCursor(response.nextCursor);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [type, limit, cursor]);

  useEffect(() => {
    loadActivities(true);
  }, [type]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('feed.justNow');
    if (diffMins < 60) return t('feed.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('feed.hoursAgo', { count: diffHours });
    return t('feed.daysAgo', { count: diffDays });
  };

  if (isLoading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">{t('feed.noActivity')}</p>
        <p className="text-sm text-muted-foreground/70">{t('feed.noActivityDescription')}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadActivities(true)}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          {t('friends.refresh')}
        </Button>
      </div>

      {/* Activities */}
      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            timeAgo={getTimeAgo(activity.createdAt)}
            isEnglish={isEnglish}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <Button
          variant="ghost"
          onClick={() => loadActivities(false)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {t('common.viewMore')}
        </Button>
      )}
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  activity,
  timeAgo,
  isEnglish,
}: {
  activity: Activity;
  timeAgo: string;
  isEnglish: boolean;
}) {
  const { t } = useTranslation();
  const metadata = activity.metadata as Record<string, string | number>;

  const getActivityIcon = () => {
    switch (activity.type) {
      case 'place_added':
        return <MapPin className="w-4 h-4" />;
      case 'place_visited':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'photo_added':
        return <Camera className="w-4 h-4" />;
      case 'friend_added':
        return <UserPlus className="w-4 h-4" />;
      case 'achievement_unlocked':
        return <Trophy className="w-4 h-4" />;
      case 'level_up':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'place_added':
        return 'bg-blue-500/10 text-blue-500';
      case 'place_visited':
        return 'bg-green-500/10 text-green-500';
      case 'photo_added':
        return 'bg-purple-500/10 text-purple-500';
      case 'friend_added':
        return 'bg-orange-500/10 text-orange-500';
      case 'achievement_unlocked':
        return 'bg-amber-500/10 text-amber-500';
      case 'level_up':
        return 'bg-gradient-to-br from-blue-500/10 to-orange-500/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getActivityText = () => {
    const userName = activity.userName || activity.user?.name || activity.user?.email?.split('@')[0] || 'User';
    
    switch (activity.type) {
      case 'place_added':
        return t('feed.placeAdded', { name: userName, place: metadata.placeName });
      case 'place_visited':
        return t('feed.placeVisited', { name: userName, place: metadata.placeName });
      case 'photo_added':
        return t('feed.photoAdded', { name: userName, place: metadata.placeName });
      case 'achievement_unlocked':
        return t('feed.achievementUnlocked', { 
          name: userName, 
          achievement: isEnglish ? metadata.achievementName : metadata.achievementName 
        });
      case 'level_up':
        return t('feed.levelUp', { name: userName, level: metadata.newLevel });
      default:
        return `${userName} did something`;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
      {/* Icon */}
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        getActivityColor()
      )}>
        {getActivityIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {getActivityText()}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {activity.xpEarned > 0 && (
            <span className="text-xs font-medium text-primary">
              +{activity.xpEarned} XP
            </span>
          )}
        </div>
      </div>

      {/* User Level Badge (for friend activities) */}
      {activity.user?.level && (
        <LevelBadge level={activity.user.level} size="sm" />
      )}
    </div>
  );
}
