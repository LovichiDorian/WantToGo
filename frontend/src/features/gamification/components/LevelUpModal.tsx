import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LevelBadge } from './LevelBadge';

interface LevelUpModalProps {
  newLevel: number;
  open: boolean;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, open, onClose }: LevelUpModalProps) {
  const { t } = useTranslation();
  const hasPlayedConfetti = useRef(false);

  useEffect(() => {
    if (open && !hasPlayedConfetti.current) {
      hasPlayedConfetti.current = true;
      
      // Blue and orange confetti
      const colors = ['#3b82f6', '#f97316', '#fbbf24', '#10b981', '#ffffff'];
      
      // Big celebration for level up
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }

    if (!open) {
      hasPlayedConfetti.current = false;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">{t('gamification.levelUp')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-6">
          {/* Level badge with glow effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <LevelBadge level={newLevel} size="xl" showGlow className="relative animate-bounce" />
          </div>

          {/* Celebration icon */}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
            <TrendingUp className="w-8 h-8 text-green-500" />
            <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            {t('gamification.levelUp')}
          </h2>

          {/* Message */}
          <p className="text-xl text-foreground mb-6">
            {t('gamification.levelUpMessage', { level: newLevel })}
          </p>

          {/* Motivational text based on level */}
          <p className="text-sm text-muted-foreground mb-4">
            {newLevel >= 50 && '🌟 You are a legendary explorer!'}
            {newLevel >= 30 && newLevel < 50 && '🗺️ Master traveler status achieved!'}
            {newLevel >= 20 && newLevel < 30 && '✈️ Your journey continues!'}
            {newLevel >= 10 && newLevel < 20 && '🎒 Keep exploring the world!'}
            {newLevel < 10 && '🚀 Your adventure is just beginning!'}
          </p>
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
