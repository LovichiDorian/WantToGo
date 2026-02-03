import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

type ConfettiType = 'xp' | 'levelUp' | 'achievement' | 'streak' | 'visited' | 'basic';

interface ConfettiOptions {
  duration?: number;
  particleCount?: number;
  spread?: number;
}

export function useConfetti() {
  const isAnimating = useRef(false);

  const fire = useCallback((type: ConfettiType = 'basic', options?: ConfettiOptions) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    switch (type) {
      case 'xp':
        // Blue/Purple gradient XP confetti
        confetti({
          ...defaults,
          particleCount: options?.particleCount ?? 50,
          spread: options?.spread ?? 60,
          colors: ['#0ea5e9', '#06b6d4', '#7c3aed', '#a78bfa'],
          shapes: ['circle', 'square'],
          gravity: 0.8,
          scalar: 0.9,
        });
        break;

      case 'levelUp':
        // Epic level up celebration
        const duration = options?.duration ?? 3000;
        const animationEnd = Date.now() + duration;

        const levelUpInterval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(levelUpInterval);
            isAnimating.current = false;
            return;
          }

          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#0ea5e9', '#7c3aed', '#fbbf24'],
            zIndex: 9999,
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#0ea5e9', '#7c3aed', '#fbbf24'],
            zIndex: 9999,
          });
        }, 100);

        // Also fire a big burst in the center
        confetti({
          ...defaults,
          particleCount: 100,
          spread: 100,
          colors: ['#0ea5e9', '#7c3aed', '#fbbf24', '#f97316'],
          origin: { y: 0.6 },
        });
        return; // Don't reset isAnimating, interval handles it

      case 'achievement':
        // Golden badge unlock confetti
        confetti({
          ...defaults,
          particleCount: 80,
          spread: 70,
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
          shapes: ['circle'],
          scalar: 1.2,
        });
        // Star burst
        setTimeout(() => {
          confetti({
            ...defaults,
            particleCount: 30,
            spread: 360,
            startVelocity: 20,
            colors: ['#fbbf24'],
            shapes: ['star'],
            scalar: 1.5,
            origin: { y: 0.5 },
          });
        }, 200);
        break;

      case 'streak':
        // Fire/orange streak confetti
        confetti({
          ...defaults,
          particleCount: 60,
          spread: 50,
          colors: ['#f97316', '#ef4444', '#fbbf24', '#dc2626'],
          shapes: ['circle'],
          gravity: 1,
        });
        break;

      case 'visited':
        // Green success confetti
        confetti({
          ...defaults,
          particleCount: 70,
          spread: 80,
          colors: ['#22c55e', '#10b981', '#34d399', '#6ee7b7'],
          shapes: ['circle', 'square'],
        });
        break;

      default:
        // Basic confetti
        confetti({
          ...defaults,
          particleCount: options?.particleCount ?? 50,
          spread: options?.spread ?? 70,
        });
    }

    setTimeout(() => {
      isAnimating.current = false;
    }, 500);
  }, []);

  const fireXP = useCallback((amount?: number) => {
    const count = amount ? Math.min(Math.floor(amount / 50) + 20, 100) : 50;
    fire('xp', { particleCount: count });
  }, [fire]);

  const fireLevelUp = useCallback(() => {
    fire('levelUp', { duration: 3000 });
  }, [fire]);

  const fireAchievement = useCallback(() => {
    fire('achievement');
  }, [fire]);

  const fireStreak = useCallback(() => {
    fire('streak');
  }, [fire]);

  const fireVisited = useCallback(() => {
    fire('visited');
  }, [fire]);

  const fireBasic = useCallback(() => {
    fire('basic');
  }, [fire]);

  return {
    fire,
    fireXP,
    fireLevelUp,
    fireAchievement,
    fireStreak,
    fireVisited,
    fireBasic,
  };
}

export default useConfetti;
