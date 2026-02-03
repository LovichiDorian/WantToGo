import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Achievement {
  code: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  icon: string;
  xpReward: number;
}

interface AchievementUnlockModalProps {
  achievement: Achievement | null;
  open: boolean;
  onClose: () => void;
}

export function AchievementUnlockModal({ achievement, open, onClose }: AchievementUnlockModalProps) {
  const { t, i18n } = useTranslation();
  const hasPlayedConfetti = useRef(false);
  const isEnglish = i18n.language === 'en';

  useEffect(() => {
    if (open && achievement && !hasPlayedConfetti.current) {
      hasPlayedConfetti.current = true;
      
      // Blue and orange confetti to match brand colors
      const colors = ['#3b82f6', '#f97316', '#fbbf24', '#ffffff'];
      
      // Fire confetti from both sides
      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...opts,
          origin: { y: 0.7 },
          colors,
          particleCount: Math.floor(200 * particleRatio),
        });
      };

      // Multiple bursts for 2 seconds
      fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.2 } });
      fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.8 } });
      
      setTimeout(() => {
        fire(0.2, { spread: 60, origin: { x: 0.5 } });
      }, 250);
      
      setTimeout(() => {
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 0.5 } });
      }, 500);

      setTimeout(() => {
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, origin: { x: 0.5 } });
      }, 1000);
    }

    // Reset flag when modal closes
    if (!open) {
      hasPlayedConfetti.current = false;
    }
  }, [open, achievement]);

  if (!achievement) return null;

  const name = isEnglish ? achievement.nameEn : achievement.nameFr;
  const description = isEnglish ? achievement.descriptionEn : achievement.descriptionFr;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">{t('achievements.newAchievement')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-6">
          {/* Trophy/Badge animation */}
          <div className="relative mb-6">
            <div className="text-7xl animate-bounce drop-shadow-xl">
              {achievement.icon}
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            {t('achievements.newAchievement')}
          </h2>

          {/* Achievement name */}
          <h3 className="text-xl font-semibold mb-2">{name}</h3>

          {/* Description */}
          <p className="text-muted-foreground mb-4">{description}</p>

          {/* XP Reward */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-blue-500/30">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              {t('achievements.rewardXp', { xp: achievement.xpReward })}
            </span>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
        >
          {t('common.close')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
