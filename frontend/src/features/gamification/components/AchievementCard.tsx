import { useTranslation } from 'react-i18next';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/lib/api/gamification';

interface AchievementCardProps {
  achievement: Achievement;
  compact?: boolean;
  className?: string;
}

export function AchievementCard({ achievement, compact = false, className }: AchievementCardProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  const name = isEnglish ? achievement.nameEn : achievement.nameFr;
  const description = isEnglish ? achievement.descriptionEn : achievement.descriptionFr;

  if (compact) {
    return (
      <div
        className={cn(
          'relative flex items-center gap-3 p-3 rounded-xl border transition-all',
          achievement.unlocked
            ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
            : 'bg-muted/30 border-border/50 opacity-60',
          className
        )}
      >
        <div className={cn(
          'text-3xl flex-shrink-0',
          !achievement.unlocked && 'grayscale'
        )}>
          {achievement.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium truncate',
            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground">
            {achievement.unlocked ? (
              <span className="text-green-500 flex items-center gap-1">
                <Check className="w-3 h-3" /> {t('achievements.unlocked')}
              </span>
            ) : (
              <span>
                {t('achievements.progress', {
                  current: achievement.progress.current,
                  target: achievement.progress.target,
                })}
              </span>
            )}
          </p>
        </div>

        {achievement.unlocked && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              +{achievement.xpReward} XP
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative p-4 rounded-2xl border transition-all',
        achievement.unlocked
          ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 shadow-lg shadow-amber-500/10'
          : 'bg-muted/30 border-border/50',
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        'text-5xl mb-3 transition-all',
        achievement.unlocked ? 'drop-shadow-lg' : 'grayscale opacity-50'
      )}>
        {achievement.icon}
      </div>

      {/* Name */}
      <h3 className={cn(
        'font-semibold mb-1',
        achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {name}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {description}
      </p>

      {/* Progress or Status */}
      {achievement.unlocked ? (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
            <Check className="w-4 h-4" />
            {t('achievements.unlocked')}
          </span>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {t('achievements.rewardXp', { xp: achievement.xpReward })}
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${achievement.progress.percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {t('achievements.progress', {
                current: achievement.progress.current,
                target: achievement.progress.target,
              })}
            </span>
            <span className="text-muted-foreground">
              {t('achievements.rewardXp', { xp: achievement.xpReward })}
            </span>
          </div>
        </div>
      )}

      {/* Unlocked date */}
      {achievement.unlocked && achievement.unlockedAt && (
        <p className="text-xs text-muted-foreground mt-2">
          {t('achievements.unlockedOn', {
            date: new Date(achievement.unlockedAt).toLocaleDateString(
              isEnglish ? 'en-US' : 'fr-FR',
              { day: 'numeric', month: 'short', year: 'numeric' }
            ),
          })}
        </p>
      )}
    </div>
  );
}
