import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPToastProps {
  xp: number;
  source: string;
  bonus?: number;
  className?: string;
}

export function XPToast({ xp, source, bonus, className }: XPToastProps) {
  const { t } = useTranslation();

  const getSourceText = (src: string) => {
    switch (src) {
      case 'place_added':
        return t('gamification.xpSources.placeAdded');
      case 'photo_added':
        return t('gamification.xpSources.photoAdded');
      case 'place_visited':
        return t('gamification.xpSources.placeVisited');
      case 'visited_nearby':
        return t('gamification.xpSources.visitedNearby');
      case 'friend_invited':
        return t('gamification.xpSources.friendInvited');
      case 'achievement_unlocked':
        return t('gamification.xpSources.achievementUnlocked');
      default:
        return src;
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-xl shadow-lg',
        'animate-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
        <Sparkles className="w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <p className="font-bold text-lg">
          {t('gamification.xpEarned', { xp })}
          {bonus && bonus > 0 && (
            <span className="text-yellow-300 ml-1">
              (+{bonus} bonus!)
            </span>
          )}
        </p>
        <p className="text-sm text-white/80">
          {getSourceText(source)}
        </p>
      </div>
    </div>
  );
}

// Simpler inline version
export function XPBadge({ xp, className }: { xp: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full',
        'bg-gradient-to-r from-blue-500 to-orange-500 text-white',
        'animate-in zoom-in duration-300',
        className
      )}
    >
      <Sparkles className="w-3 h-3" />
      +{xp} XP
    </span>
  );
}
