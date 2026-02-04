import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { AVATAR_BASES } from '../avatarConstants';

interface BaseStyleGridProps {
    selectedBase: string;
    userLevel: number;
    color: string;
    onSelect: (baseId: string) => void;
}

/**
 * BaseStyleGrid - Grid of 15 avatar base style cards
 * Shows emoji with color background and level lock overlay for locked items
 */
export function BaseStyleGrid({
    selectedBase,
    userLevel,
    color,
    onSelect,
}: BaseStyleGridProps) {
    return (
        <div className="grid grid-cols-3 gap-3 p-2">
            {AVATAR_BASES.map((base, index) => {
                const isUnlocked = userLevel >= base.levelRequired;
                const isSelected = selectedBase === base.id;

                return (
                    <motion.button
                        key={base.id}
                        onClick={() => isUnlocked && onSelect(base.id)}
                        disabled={!isUnlocked}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03, type: 'spring', stiffness: 300 }}
                        className={cn(
                            'relative aspect-square rounded-2xl flex flex-col items-center justify-center',
                            'transition-all duration-200',
                            'border-2',
                            isSelected && isUnlocked
                                ? 'border-primary ring-2 ring-primary/30 scale-105 shadow-lg'
                                : isUnlocked
                                    ? 'border-transparent hover:border-primary/50 hover:scale-105 hover:shadow-md'
                                    : 'border-transparent opacity-60 cursor-not-allowed'
                        )}
                        style={{
                            backgroundColor: isUnlocked ? `${color}15` : 'transparent',
                        }}
                        whileHover={isUnlocked ? { scale: 1.08 } : undefined}
                        whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                    >
                        {/* Avatar emoji circle */}
                        <div
                            className={cn(
                                'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                                'shadow-md transition-all duration-200',
                                isSelected && 'shadow-lg ring-2 ring-white/50'
                            )}
                            style={{
                                backgroundColor: color,
                                opacity: isUnlocked ? 1 : 0.4,
                            }}
                        >
                            {base.emoji}
                        </div>

                        {/* Level indicator */}
                        <span className={cn(
                            'text-[10px] mt-2 font-medium',
                            isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/50'
                        )}>
                            Niv. {base.levelRequired}
                        </span>

                        {/* Lock overlay */}
                        {!isUnlocked && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={cn(
                                    'absolute inset-0 rounded-2xl',
                                    'bg-black/40 backdrop-blur-sm',
                                    'flex flex-col items-center justify-center',
                                    'text-white'
                                )}
                            >
                                <Lock className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium">Niv. {base.levelRequired}</span>
                            </motion.div>
                        )}

                        {/* Selected indicator */}
                        {isSelected && isUnlocked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                    'absolute -top-1 -right-1',
                                    'w-6 h-6 rounded-full',
                                    'bg-primary text-white',
                                    'flex items-center justify-center',
                                    'text-xs font-bold shadow-lg'
                                )}
                            >
                                ✓
                            </motion.div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}

export default BaseStyleGrid;
