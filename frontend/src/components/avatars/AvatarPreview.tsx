import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { type AvatarBase as AvatarBaseType } from './avatarConstants';

interface AvatarPreviewProps {
    base: AvatarBaseType;
    color: string;
    isSelected: boolean;
    isUnlocked: boolean;
    userLevel: number;
    onSelect: () => void;
}

/**
 * AvatarPreview - Grid item for avatar picker
 * Shows emoji with lock overlay if level requirement not met
 */
export function AvatarPreview({
    base,
    color,
    isSelected,
    isUnlocked,
    onSelect,
}: AvatarPreviewProps) {
    return (
        <motion.button
            onClick={isUnlocked ? onSelect : undefined}
            disabled={!isUnlocked}
            className={cn(
                'relative w-16 h-16 rounded-2xl flex items-center justify-center',
                'transition-all duration-200',
                'border-2',
                isSelected
                    ? 'border-primary ring-2 ring-primary/30 scale-105'
                    : isUnlocked
                        ? 'border-transparent hover:border-primary/50 hover:scale-105'
                        : 'border-transparent opacity-60 cursor-not-allowed',
                isUnlocked && !isSelected && 'hover:shadow-lg'
            )}
            style={{
                backgroundColor: isUnlocked ? `${color}20` : 'transparent',
            }}
            whileHover={isUnlocked ? { scale: 1.08 } : undefined}
            whileTap={isUnlocked ? { scale: 0.95 } : undefined}
        >
            {/* Avatar emoji */}
            <div
                className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                    'shadow-md transition-all duration-200',
                    isSelected && 'shadow-lg'
                )}
                style={{
                    backgroundColor: color,
                    opacity: isUnlocked ? 1 : 0.4,
                }}
            >
                {base.emoji}
            </div>

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
                    <Lock className="w-4 h-4 mb-1" />
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
                        'w-5 h-5 rounded-full',
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
}

export default AvatarPreview;
