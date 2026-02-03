import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  multiplier: number;
  isActiveToday: boolean;
  size?: 'sm' | 'md' | 'lg';
  showMultiplier?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'h-8 px-3 gap-1.5',
    icon: 'w-4 h-4',
    text: 'text-sm',
    multiplier: 'text-xs px-1.5 py-0.5',
  },
  md: {
    container: 'h-10 px-4 gap-2',
    icon: 'w-5 h-5',
    text: 'text-base',
    multiplier: 'text-xs px-2 py-0.5',
  },
  lg: {
    container: 'h-14 px-5 gap-3',
    icon: 'w-7 h-7',
    text: 'text-xl',
    multiplier: 'text-sm px-2.5 py-1',
  },
};

export function StreakCounter({
  streak,
  multiplier,
  isActiveToday,
  size = 'md',
  showMultiplier = true,
  className,
}: StreakCounterProps) {
  const { t } = useTranslation();
  const config = sizeConfig[size];

  const isOnFire = streak >= 3;
  const isEpic = streak >= 7;
  const isLegendary = streak >= 30;

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center rounded-full',
        'glass-strong',
        isActiveToday ? 'glow-streak' : 'opacity-75',
        config.container,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient for active streaks */}
      {isOnFire && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full opacity-20',
            isLegendary
              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
              : isEpic
              ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'
              : 'gradient-streak'
          )}
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Flame icon */}
      <div className="relative">
        <motion.div
          animate={
            isOnFire
              ? {
                  scale: [1, 1.1, 1],
                  rotate: [-3, 3, -3],
                }
              : undefined
          }
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Flame
            className={cn(
              config.icon,
              isLegendary
                ? 'text-purple-500'
                : isEpic
                ? 'text-orange-500'
                : isOnFire
                ? 'text-orange-400'
                : 'text-muted-foreground'
            )}
            fill={isOnFire ? 'currentColor' : 'none'}
          />
        </motion.div>

        {/* Spark particles for active streaks */}
        {isOnFire && isActiveToday && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  'absolute w-1 h-1 rounded-full',
                  isLegendary
                    ? 'bg-purple-400'
                    : isEpic
                    ? 'bg-orange-400'
                    : 'bg-yellow-400'
                )}
                style={{
                  left: '50%',
                  top: '0%',
                }}
                animate={{
                  y: [-5, -15],
                  x: [(i - 1) * 5, (i - 1) * 8],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Streak number */}
      <AnimatePresence mode="wait">
        <motion.span
          key={streak}
          className={cn(
            config.text,
            'font-bold',
            isLegendary
              ? 'text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'
              : isEpic
              ? 'text-orange-500'
              : isOnFire
              ? 'text-orange-400'
              : 'text-muted-foreground'
          )}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          {streak}
        </motion.span>
      </AnimatePresence>

      <span className={cn(config.text, 'text-muted-foreground font-medium')}>
        {t('streak.days', { count: streak })}
      </span>

      {/* Multiplier badge */}
      {showMultiplier && multiplier > 1 && (
        <motion.div
          className={cn(
            config.multiplier,
            'rounded-full font-bold flex items-center gap-0.5',
            isLegendary
              ? 'bg-purple-500/20 text-purple-400'
              : isEpic
              ? 'bg-orange-500/20 text-orange-400'
              : 'bg-yellow-500/20 text-yellow-500'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          <Zap className="w-3 h-3" fill="currentColor" />
          x{multiplier}
        </motion.div>
      )}

      {/* "Not active" indicator */}
      {!isActiveToday && streak > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export default StreakCounter;
