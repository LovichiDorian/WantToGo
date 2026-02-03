import { cn } from '@/lib/utils';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export function LevelBadge({ level, size = 'md', className, showGlow = false }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  // Level tiers for different colors
  const getLevelColor = (lvl: number) => {
    if (lvl >= 50) return 'from-amber-400 to-yellow-500 shadow-amber-500/50'; // Gold
    if (lvl >= 30) return 'from-purple-400 to-violet-500 shadow-purple-500/50'; // Purple
    if (lvl >= 20) return 'from-cyan-400 to-blue-500 shadow-cyan-500/50'; // Diamond
    if (lvl >= 10) return 'from-emerald-400 to-green-500 shadow-emerald-500/50'; // Emerald
    if (lvl >= 5) return 'from-orange-400 to-amber-500 shadow-orange-500/50'; // Bronze
    return 'from-slate-400 to-gray-500 shadow-slate-500/50'; // Starter
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white',
        sizeClasses[size],
        getLevelColor(level),
        showGlow && 'shadow-lg',
        className
      )}
    >
      <span>{level}</span>
      
      {/* Decorative ring for high levels */}
      {level >= 10 && (
        <div className="absolute inset-0 rounded-full border-2 border-white/30" />
      )}
      
      {/* Star for level 50+ */}
      {level >= 50 && (
        <span className="absolute -top-1 -right-1 text-xs">⭐</span>
      )}
    </div>
  );
}
