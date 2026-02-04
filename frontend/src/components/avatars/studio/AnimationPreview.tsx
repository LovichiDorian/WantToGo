import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Check, Play } from 'lucide-react';
import { AVATAR_ANIMATIONS } from '../avatarConstants';

interface AnimationPreviewProps {
    selectedAnimation: string | null;
    userLevel: number;
    onSelect: (animationId: string | null) => void;
}

// Animation variants for each type
const getAnimationVariants = (type: string) => {
    switch (type) {
        case 'pulse':
            return {
                animate: {
                    scale: [1, 1.1, 1],
                    transition: { duration: 1.5, repeat: Infinity }
                }
            };
        case 'bounce':
            return {
                animate: {
                    y: [0, -10, 0],
                    transition: { duration: 0.6, repeat: Infinity }
                }
            };
        case 'spin':
            return {
                animate: {
                    rotateY: [0, 360],
                    transition: { duration: 2, repeat: Infinity, ease: 'linear' as const }
                }
            };
        case 'wiggle':
            return {
                animate: {
                    rotate: [-5, 5, -5],
                    transition: { duration: 0.5, repeat: Infinity }
                }
            };
        case 'float':
            return {
                animate: {
                    y: [0, -5, 0],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }
                }
            };
        case 'wave':
            return {
                animate: {
                    rotate: [0, 15, -15, 0],
                    transition: { duration: 1, repeat: Infinity }
                }
            };
        case 'glow':
            return {
                animate: {
                    boxShadow: ['0 0 0px #3B82F6', '0 0 20px #3B82F6', '0 0 0px #3B82F6'],
                    transition: { duration: 1.5, repeat: Infinity }
                }
            };
        case 'sparkle':
            return {
                animate: {
                    opacity: [1, 0.7, 1],
                    scale: [1, 1.05, 1],
                    transition: { duration: 0.8, repeat: Infinity }
                }
            };
        case 'rainbow':
            return {
                animate: {
                    background: [
                        'linear-gradient(45deg, #ef4444, #f97316)',
                        'linear-gradient(45deg, #f97316, #eab308)',
                        'linear-gradient(45deg, #eab308, #22c55e)',
                        'linear-gradient(45deg, #22c55e, #3b82f6)',
                        'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                        'linear-gradient(45deg, #8b5cf6, #ef4444)',
                    ],
                    transition: { duration: 3, repeat: Infinity }
                }
            };
        case 'fire':
            return {
                animate: {
                    scale: [1, 1.03, 1],
                    filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
                    transition: { duration: 0.3, repeat: Infinity }
                }
            };
        case 'legendary':
            return {
                animate: {
                    scale: [1, 1.1, 1],
                    rotateY: [0, 180, 360],
                    transition: { duration: 3, repeat: Infinity }
                }
            };
        default:
            return undefined;
    }
};

const ANIMATION_ICONS: Record<string, string> = {
    none: '⏹️',
    pulse: '💓',
    bounce: '⬆️',
    spin: '🔄',
    wiggle: '〰️',
    float: '☁️',
    wave: '👋',
    glow: '✨',
    sparkle: '⭐',
    rainbow: '🌈',
    fire: '🔥',
    legendary: '👑',
};

/**
 * AnimationPreview - 12 animation options with live preview
 */
export function AnimationPreview({
    selectedAnimation,
    userLevel,
    onSelect,
}: AnimationPreviewProps) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
                Sélectionne une animation pour ton avatar
            </p>

            <div className="grid grid-cols-3 gap-3">
                {AVATAR_ANIMATIONS.map((animation, index) => {
                    const isUnlocked = userLevel >= animation.levelRequired;
                    const isSelected = selectedAnimation === animation.id;
                    const variants = getAnimationVariants(animation.id);

                    return (
                        <motion.button
                            key={animation.id}
                            onClick={() => isUnlocked && onSelect(animation.id)}
                            disabled={!isUnlocked}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={cn(
                                'relative p-4 rounded-2xl flex flex-col items-center gap-2',
                                'transition-all duration-200',
                                'border-2',
                                isSelected && isUnlocked
                                    ? 'border-primary bg-primary/10 shadow-lg'
                                    : isUnlocked
                                        ? 'border-transparent bg-muted/30 hover:bg-muted/50 hover:shadow-md'
                                        : 'border-transparent bg-muted/20 opacity-60 cursor-not-allowed'
                            )}
                        >
                            {/* Animated preview circle */}
                            <motion.div
                                className={cn(
                                    'w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70',
                                    'flex items-center justify-center text-xl',
                                    'shadow-md'
                                )}
                                style={{ perspective: '1000px' }}
                                variants={isSelected || !isUnlocked ? undefined : variants}
                                animate={isSelected ? 'animate' : undefined}
                                whileHover={isUnlocked && animation.id !== 'none' ? 'animate' : undefined}
                            >
                                {ANIMATION_ICONS[animation.id]}
                            </motion.div>

                            {/* Label */}
                            <div className="text-center">
                                <p className="text-xs font-medium truncate">
                                    {animation.id === 'none' ? 'Aucune' : animation.id.charAt(0).toUpperCase() + animation.id.slice(1)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Niv. {animation.levelRequired}
                                </p>
                            </div>

                            {/* Lock overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <Lock className="w-4 h-4 text-white mb-1" />
                                    <span className="text-[10px] text-white font-medium">
                                        Niv. {animation.levelRequired}
                                    </span>
                                </div>
                            )}

                            {/* Selected indicator */}
                            {isSelected && isUnlocked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
                                >
                                    <Check className="w-3 h-3" />
                                </motion.div>
                            )}

                            {/* Preview play hint */}
                            {isUnlocked && !isSelected && animation.id !== 'none' && (
                                <div className="absolute bottom-1 right-1">
                                    <Play className="w-3 h-3 text-muted-foreground" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Info */}
            <p className="text-xs text-center text-muted-foreground">
                Survole une animation pour la prévisualiser
            </p>
        </div>
    );
}

export default AnimationPreview;
