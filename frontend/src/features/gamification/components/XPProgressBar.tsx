import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
  xp: number;
  level: number;
  xpNeeded: number;
  nextLevel: number;
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XPProgressBar({
  xp,
  level,
  xpNeeded,
  nextLevel,
  progress,
  showLabel = true,
  size = 'md',
  className,
}: XPProgressBarProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {t('gamification.level', { level })}
            </span>
            <span className="text-xs text-muted-foreground">
              {xp.toLocaleString()} {t('gamification.xp')}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {t('gamification.xpToNextLevel', { xp: xpNeeded.toLocaleString(), level: nextLevel })}
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-muted rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {t('gamification.progress', { percent: Math.round(progress) })}
        </p>
      )}
    </div>
  );
}
