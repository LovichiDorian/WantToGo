import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface BadgeCardProps {
  code: string;
  icon: string;
  nameKey: string;
  descriptionKey: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-16 h-16',
    icon: 'text-2xl',
    badge: 'w-12 h-12',
  },
  md: {
    container: 'w-20 h-20',
    icon: 'text-3xl',
    badge: 'w-14 h-14',
  },
  lg: {
    container: 'w-24 h-24',
    icon: 'text-4xl',
    badge: 'w-16 h-16',
  },
};

export function BadgeCard({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  code: _code,
  icon,
  nameKey,
  descriptionKey,
  xpReward,
  unlocked,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unlockedAt: _unlockedAt,
  progress,
  size = 'md',
  onClick,
  className,
}: BadgeCardProps) {
  const { t } = useTranslation();
  const config = sizeConfig[size];

  const progressPercent = progress
    ? Math.min((progress.current / progress.target) * 100, 100)
    : 0;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1',
        config.container,
        'group cursor-pointer',
        className
      )}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={unlocked ? { scale: 0, rotate: -180 } : { opacity: 0.8 }}
      animate={unlocked ? { scale: 1, rotate: 0 } : { opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Badge container */}
      <div
        className={cn(
          config.badge,
          'relative rounded-2xl flex items-center justify-center',
          unlocked
            ? 'glass-strong shadow-lg'
            : 'glass opacity-60'
        )}
      >
        {/* Gradient background for unlocked */}
        {unlocked && (
          <>
            <motion.div
              className="absolute inset-0 rounded-2xl gradient-gold opacity-20"
              animate={{
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </>
        )}

        {/* Icon */}
        <span
          className={cn(
            config.icon,
            unlocked ? '' : 'grayscale opacity-50'
          )}
        >
          {icon}
        </span>

        {/* Lock overlay for locked badges */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Checkmark for unlocked */}
        {unlocked && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>

      {/* Progress bar for locked badges */}
      {!unlocked && progress && (
        <div className="w-full px-1">
          <Progress value={progressPercent} className="h-1" />
          <p className="text-[10px] text-muted-foreground text-center mt-0.5">
            {progress.current}/{progress.target}
          </p>
        </div>
      )}

      {/* Tooltip on hover (shown below) */}
      <motion.div
        className={cn(
          'absolute -bottom-16 left-1/2 -translate-x-1/2 z-50',
          'glass-strong rounded-lg p-2 min-w-[140px]',
          'opacity-0 group-hover:opacity-100 pointer-events-none',
          'transition-opacity duration-200'
        )}
      >
        <p className="text-xs font-semibold text-foreground text-center">
          {t(nameKey)}
        </p>
        <p className="text-[10px] text-muted-foreground text-center mt-0.5">
          {t(descriptionKey)}
        </p>
        {unlocked ? (
          <p className="text-[10px] text-green-500 text-center mt-1 font-medium">
            +{xpReward} XP ✓
          </p>
        ) : (
          <p className="text-[10px] text-primary text-center mt-1 font-medium">
            +{xpReward} XP
          </p>
        )}
      </motion.div>
    </motion.button>
  );
}

// Badge grid component for collections
interface BadgeGridProps {
  badges: Array<{
    code: string;
    icon: string;
    nameKey: string;
    descriptionKey: string;
    xpReward: number;
    unlocked: boolean;
    unlockedAt?: string;
    progress?: { current: number; target: number };
  }>;
  size?: 'sm' | 'md' | 'lg';
  onBadgeClick?: (code: string) => void;
  className?: string;
}

export function BadgeGrid({
  badges,
  size = 'md',
  onBadgeClick,
  className,
}: BadgeGridProps) {
  // Sort: unlocked first, then by progress
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    
    const aProgress = a.progress ? a.progress.current / a.progress.target : 0;
    const bProgress = b.progress ? b.progress.current / b.progress.target : 0;
    return bProgress - aProgress;
  });

  return (
    <div
      className={cn(
        'grid gap-3',
        size === 'sm'
          ? 'grid-cols-5'
          : size === 'md'
          ? 'grid-cols-4 sm:grid-cols-5'
          : 'grid-cols-3 sm:grid-cols-4',
        className
      )}
    >
      {sortedBadges.map((badge, index) => (
        <motion.div
          key={badge.code}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <BadgeCard
            {...badge}
            size={size}
            onClick={() => onBadgeClick?.(badge.code)}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default BadgeCard;
