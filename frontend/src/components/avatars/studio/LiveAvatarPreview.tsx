import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    type AvatarData,
    getAvatarBase,
    getAvatarBackground,
    getAvatarAccessory
} from '../avatarConstants';

interface LiveAvatarPreviewProps {
    avatar: AvatarData;
    size?: 'md' | 'lg' | 'xl';
    animate?: boolean;
    className?: string;
}

// Animation variants based on avatar.animation
const getAnimationVariants = (animationType: string | null): Variants => {
    switch (animationType) {
        case 'pulse':
            return {
                animate: {
                    scale: [1, 1.05, 1],
                    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'bounce':
            return {
                animate: {
                    y: [0, -8, 0],
                    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'spin':
            return {
                animate: {
                    rotateY: [0, 360],
                    transition: { duration: 3, repeat: Infinity, ease: 'linear' }
                }
            };
        case 'wiggle':
            return {
                animate: {
                    rotate: [-3, 3, -3],
                    transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'float':
            return {
                animate: {
                    y: [0, -6, 0],
                    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'wave':
            return {
                animate: {
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'glow':
            return {
                animate: {
                    filter: ['brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))',
                        'brightness(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.5))',
                        'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))'],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'sparkle':
            return {
                animate: {
                    opacity: [1, 0.8, 1],
                    scale: [1, 1.03, 1],
                    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'fire':
            return {
                animate: {
                    scale: [1, 1.02, 0.98, 1],
                    transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        case 'legendary':
            return {
                animate: {
                    scale: [1, 1.08, 1],
                    rotateY: [0, 180, 360],
                    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }
            };
        default:
            return { animate: {} };
    }
};

const sizeClasses = {
    md: 'w-24 h-24 text-4xl',
    lg: 'w-36 h-36 text-5xl',
    xl: 'w-48 h-48 text-6xl',
};

const accessorySizes = {
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl',
    xl: 'w-12 h-12 text-2xl',
};

/**
 * LiveAvatarPreview - Real-time 3D avatar preview with all customizations
 */
export function LiveAvatarPreview({
    avatar,
    size = 'lg',
    animate = true,
    className,
}: LiveAvatarPreviewProps) {
    const baseData = getAvatarBase(avatar.base);
    const bgData = avatar.background ? getAvatarBackground(avatar.background) : null;
    const accessoryData = avatar.accessory ? getAvatarAccessory(avatar.accessory) : null;

    const emoji = baseData?.emoji || '🧳';
    const animationVariants = animate ? getAnimationVariants(avatar.animation || null) : { animate: {} };

    // Build gradient background
    const backgroundStyle = avatar.secondaryColor
        ? `linear-gradient(135deg, ${avatar.color}, ${avatar.secondaryColor})`
        : avatar.color;

    return (
        <motion.div
            className={cn(
                'relative flex items-center justify-center',
                className
            )}
            style={{ perspective: '1000px' }}
        >
            {/* Glow effect */}
            <motion.div
                className={cn(
                    'absolute rounded-full blur-2xl opacity-40',
                    sizeClasses[size]
                )}
                style={{
                    background: backgroundStyle,
                    transform: 'scale(1.3)',
                }}
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Main avatar container */}
            <motion.div
                className={cn(
                    'relative rounded-full flex items-center justify-center',
                    'border-4 border-white/50 shadow-2xl',
                    sizeClasses[size]
                )}
                style={{
                    background: backgroundStyle,
                    boxShadow: `0 0 40px ${avatar.color}40, 0 20px 60px rgba(0,0,0,0.3)`,
                    transformStyle: 'preserve-3d',
                }}
                variants={animationVariants}
                animate="animate"
                whileHover={{ scale: 1.05 }}
            >
                {/* Background gradient overlay if set */}
                {bgData && (
                    <div
                        className={cn(
                            'absolute inset-0 rounded-full opacity-40',
                            `bg-gradient-to-br ${bgData.gradient}`
                        )}
                    />
                )}

                {/* Inner ring glow */}
                <div
                    className="absolute inset-1 rounded-full"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                    }}
                />

                {/* Main emoji */}
                <span
                    className="relative z-10 select-none drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                >
                    {emoji}
                </span>
            </motion.div>

            {/* Accessory badge */}
            {accessoryData && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn(
                        'absolute z-20',
                        'bg-white dark:bg-gray-800 rounded-full shadow-xl',
                        'flex items-center justify-center',
                        'border-2 border-white/80',
                        accessorySizes[size],
                        size === 'xl' ? '-bottom-2 -right-2' : '-bottom-1 -right-1'
                    )}
                    style={{
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    }}
                >
                    {accessoryData.emoji}
                </motion.div>
            )}

            {/* Sparkle effects for premium animations */}
            {avatar.animation === 'sparkle' || avatar.animation === 'legendary' ? (
                <>
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                            style={{
                                top: `${20 + i * 25}%`,
                                left: `${-5 + i * 50}%`,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                y: [0, -20, -40],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </>
            ) : null}
        </motion.div>
    );
}

export default LiveAvatarPreview;
