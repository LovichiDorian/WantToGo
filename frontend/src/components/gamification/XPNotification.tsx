import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface XPNotificationProps {
  amount: number;
  reason?: string;
  multiplier?: number;
  isVisible: boolean;
  onComplete?: () => void;
  position?: 'top' | 'center' | 'bottom';
}

export function XPNotification({
  amount,
  reason,
  multiplier = 1,
  isVisible,
  onComplete,
  position = 'top',
}: XPNotificationProps) {
  const { t } = useTranslation();
  const [displayAmount, setDisplayAmount] = useState(0);
  
  const totalAmount = Math.floor(amount * multiplier);
  const bonusAmount = totalAmount - amount;

  // Animate counter
  useEffect(() => {
    if (!isVisible) {
      setDisplayAmount(0);
      return;
    }

    const duration = 1000;
    const steps = 20;
    const increment = totalAmount / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= totalAmount) {
        setDisplayAmount(totalAmount);
        clearInterval(interval);
      } else {
        setDisplayAmount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible, totalAmount]);

  // Auto-hide after animation
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  const positionClasses = {
    top: 'top-4',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-20',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed left-1/2 -translate-x-1/2 z-[100]',
            positionClasses[position]
          )}
          initial={{ opacity: 0, y: position === 'bottom' ? 50 : -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 50 : -50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div
            className={cn(
              'relative px-6 py-4 rounded-2xl',
              'glass-strong shadow-2xl',
              'glow'
            )}
          >
            {/* Background gradient */}
            <motion.div
              className="absolute inset-0 rounded-2xl gradient-xp opacity-10"
              animate={{
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />

            <div className="relative flex items-center gap-4">
              {/* XP Icon */}
              <motion.div
                className="w-12 h-12 rounded-full gradient-xp flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.3, 0.6, 1],
                }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>

              {/* XP Amount */}
              <div className="text-center">
                <motion.div
                  className="text-3xl font-black text-gradient-xp"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: 3,
                  }}
                >
                  +{displayAmount} XP
                </motion.div>

                {reason && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t(reason)}
                  </p>
                )}
              </div>

              {/* Multiplier badge */}
              {multiplier > 1 && (
                <motion.div
                  className="absolute -top-2 -right-2 px-2 py-1 rounded-full gradient-streak flex items-center gap-1"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <Zap className="w-3 h-3 text-white" fill="white" />
                  <span className="text-xs font-bold text-white">
                    x{multiplier}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Bonus breakdown */}
            {bonusAmount > 0 && (
              <motion.div
                className="mt-2 pt-2 border-t border-border/50 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span>{amount} XP</span>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500 font-medium">+{bonusAmount} bonus</span>
              </motion.div>
            )}

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#0ea5e9' : '#7c3aed',
                  left: `${10 + Math.random() * 80}%`,
                  top: '50%',
                }}
                animate={{
                  y: [0, -30 - Math.random() * 20],
                  x: [(i % 2 === 0 ? -1 : 1) * (Math.random() * 15)],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level up notification
interface LevelUpNotificationProps {
  newLevel: number;
  levelName: string;
  isVisible: boolean;
  onComplete?: () => void;
}

export function LevelUpNotification({
  newLevel,
  levelName,
  isVisible,
  onComplete,
}: LevelUpNotificationProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative p-8 rounded-3xl glass-strong shadow-2xl text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl gradient-gold opacity-30"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            {/* Content */}
            <div className="relative">
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.3, 0.6, 1],
                }}
              >
                🎉
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-foreground mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('gamification.levelUp')}
              </motion.h2>

              <motion.div
                className="text-5xl font-black text-gradient-xp mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                {t('gamification.level', { level: newLevel })}
              </motion.div>

              <motion.p
                className="text-lg text-primary font-semibold"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {levelName}
              </motion.p>
            </div>

            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#fbbf24', '#0ea5e9', '#7c3aed'][i % 3],
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: Math.cos((i * 360) / 12 * (Math.PI / 180)) * 100,
                  y: Math.sin((i * 360) / 12 * (Math.PI / 180)) * 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default XPNotification;
