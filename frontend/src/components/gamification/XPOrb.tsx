import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface XPOrbProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-16 h-16',
    ring: 56,
    stroke: 4,
    text: 'text-xs',
    levelText: 'text-[10px]',
  },
  md: {
    container: 'w-24 h-24',
    ring: 88,
    stroke: 5,
    text: 'text-sm',
    levelText: 'text-xs',
  },
  lg: {
    container: 'w-32 h-32',
    ring: 120,
    stroke: 6,
    text: 'text-lg',
    levelText: 'text-sm',
  },
  xl: {
    container: 'w-40 h-40',
    ring: 152,
    stroke: 8,
    text: 'text-xl',
    levelText: 'text-base',
  },
};

export function XPOrb({
  currentXP,
  nextLevelXP,
  level,
  size = 'lg',
  showLevel = true,
  animate = true,
  className,
}: XPOrbProps) {
  const { t } = useTranslation();
  const config = sizeConfig[size];
  
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100);
  const radius = (config.ring - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      {/* Glow effect behind */}
      <motion.div
        className="absolute inset-0 rounded-full gradient-xp opacity-30 blur-xl"
        animate={animate ? {
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        } : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main container */}
      <motion.div
        className={cn(
          config.container,
          'relative rounded-full glass-strong',
          'flex items-center justify-center',
          'shadow-2xl'
        )}
        animate={animate ? { rotate: 360 } : undefined}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Background gradient orb */}
        <div className="absolute inset-2 rounded-full gradient-xp opacity-20" />

        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.ring}
          height={config.ring}
          viewBox={`0 0 ${config.ring} ${config.ring}`}
        >
          {/* Background track */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-muted/30"
          />
          
          {/* Progress arc */}
          <motion.circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="url(#xpGradient)"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content (counter-rotate to stay upright) */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          animate={animate ? { rotate: -360 } : undefined}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {showLevel && (
            <motion.div
              className={cn(
                config.levelText,
                'font-bold text-gradient-xp uppercase tracking-wider'
              )}
              key={level}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {t('gamification.level', { level })}
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentXP}
              className={cn(config.text, 'font-bold text-foreground')}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentXP.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          
          <div className={cn(config.levelText, 'text-muted-foreground')}>
            / {nextLevelXP.toLocaleString()} XP
          </div>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {animate && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full gradient-xp"
              animate={{
                y: [-20, -40, -20],
                x: [0, (i - 1) * 15, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default XPOrb;
