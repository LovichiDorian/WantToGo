import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  Compass, 
  Map, 
  Globe, 
  Mountain, 
  Crown, 
  Sparkles,
  Star,
  Trophy
} from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  animate?: boolean;
  className?: string;
}

interface LevelInfo {
  name: string;
  nameKey: string;
  icon: typeof Compass;
  color: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
}

const getLevelInfo = (level: number): LevelInfo => {
  if (level >= 50) {
    return {
      name: 'Legend',
      nameKey: 'levels.legend',
      icon: Crown,
      color: 'text-purple-400',
      bgGradient: 'from-purple-600 via-pink-500 to-purple-600',
      borderColor: 'border-purple-400/50',
      glowColor: 'shadow-purple-500/50',
    };
  }
  if (level >= 25) {
    return {
      name: 'Master',
      nameKey: 'levels.master',
      icon: Trophy,
      color: 'text-amber-400',
      bgGradient: 'from-amber-500 via-yellow-400 to-amber-500',
      borderColor: 'border-amber-400/50',
      glowColor: 'shadow-amber-500/50',
    };
  }
  if (level >= 15) {
    return {
      name: 'Expert',
      nameKey: 'levels.expert',
      icon: Star,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500 via-teal-400 to-emerald-500',
      borderColor: 'border-emerald-400/50',
      glowColor: 'shadow-emerald-500/50',
    };
  }
  if (level >= 10) {
    return {
      name: 'Adventurer',
      nameKey: 'levels.adventurer',
      icon: Mountain,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500 via-cyan-400 to-blue-500',
      borderColor: 'border-blue-400/50',
      glowColor: 'shadow-blue-500/50',
    };
  }
  if (level >= 5) {
    return {
      name: 'Traveler',
      nameKey: 'levels.traveler',
      icon: Globe,
      color: 'text-sky-400',
      bgGradient: 'from-sky-500 via-blue-400 to-sky-500',
      borderColor: 'border-sky-400/50',
      glowColor: 'shadow-sky-500/50',
    };
  }
  if (level >= 3) {
    return {
      name: 'Wanderer',
      nameKey: 'levels.wanderer',
      icon: Map,
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-500 via-violet-400 to-indigo-500',
      borderColor: 'border-indigo-400/50',
      glowColor: 'shadow-indigo-500/50',
    };
  }
  return {
    name: 'Explorer',
    nameKey: 'levels.explorer',
    icon: Compass,
    color: 'text-slate-400',
    bgGradient: 'from-slate-500 via-gray-400 to-slate-500',
    borderColor: 'border-slate-400/50',
    glowColor: 'shadow-slate-500/50',
  };
};

const sizeConfig = {
  sm: {
    container: 'h-7 px-2.5 gap-1.5',
    icon: 'w-3.5 h-3.5',
    text: 'text-xs',
    level: 'text-xs',
  },
  md: {
    container: 'h-9 px-3 gap-2',
    icon: 'w-4 h-4',
    text: 'text-sm',
    level: 'text-sm',
  },
  lg: {
    container: 'h-11 px-4 gap-2.5',
    icon: 'w-5 h-5',
    text: 'text-base',
    level: 'text-base',
  },
  xl: {
    container: 'h-14 px-5 gap-3',
    icon: 'w-6 h-6',
    text: 'text-lg',
    level: 'text-lg',
  },
};

export function LevelBadge({
  level,
  size = 'md',
  showName = true,
  animate = true,
  className,
}: LevelBadgeProps) {
  const { t } = useTranslation();
  const config = sizeConfig[size];
  const levelInfo = getLevelInfo(level);
  const Icon = levelInfo.icon;

  const isEpic = level >= 15;
  const isLegendary = level >= 25;

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center rounded-full',
        'glass-strong border',
        levelInfo.borderColor,
        config.container,
        className
      )}
      whileHover={animate ? { scale: 1.05 } : undefined}
      whileTap={animate ? { scale: 0.98 } : undefined}
    >
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 rounded-full opacity-10 bg-gradient-to-r',
          levelInfo.bgGradient
        )}
      />

      {/* Shimmer effect for epic+ levels */}
      {isEpic && animate && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={false}
        >
          <motion.div
            className={cn(
              'absolute inset-0 bg-gradient-to-r opacity-30',
              levelInfo.bgGradient
            )}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* Icon */}
      <motion.div
        className="relative"
        animate={
          isLegendary && animate
            ? {
                rotate: [0, 5, -5, 0],
              }
            : undefined
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Icon className={cn(config.icon, levelInfo.color)} />
        
        {/* Sparkle effect for legendary */}
        {isLegendary && animate && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-2 h-2 text-yellow-400" />
          </motion.div>
        )}
      </motion.div>

      {/* Level number */}
      <span className={cn(config.level, 'font-bold', levelInfo.color)}>
        {level}
      </span>

      {/* Level name */}
      {showName && (
        <span className={cn(config.text, 'font-medium text-foreground')}>
          {t(levelInfo.nameKey)}
        </span>
      )}

      {/* Glow effect */}
      {isEpic && (
        <div
          className={cn(
            'absolute inset-0 rounded-full shadow-lg -z-10',
            levelInfo.glowColor
          )}
        />
      )}
    </motion.div>
  );
}

export default LevelBadge;
