import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AvatarBase } from './AvatarBase';
import { type AvatarData } from './avatarConstants';
import { LevelBadge } from '@/components/gamification';

interface FriendAvatarProps {
    avatar: AvatarData;
    level: number;
    friendColor?: string;
    size?: 'sm' | 'md' | 'lg';
    animate?: boolean;
    showLevel?: boolean;
    className?: string;
    onClick?: () => void;
}

const spinAnimation: Variants = {
    initial: { rotateY: 0 },
    animate: {
        rotateY: 360,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

const glowAnimation: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const sizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
};

/**
 * FriendAvatar - 3D animated avatar for friend displays
 * Features:
 * - Spin animation on mount
 * - Glow effect matching friend color
 * - Level badge overlay
 * - Click interaction
 */
export function FriendAvatar({
    avatar,
    level,
    friendColor,
    size = 'md',
    animate = false,
    showLevel = true,
    className,
    onClick,
}: FriendAvatarProps) {
    const glowColor = friendColor || avatar.color;

    return (
        <motion.div
            className={cn('relative cursor-pointer', className)}
            variants={animate ? spinAnimation : undefined}
            initial={animate ? 'initial' : undefined}
            animate={animate ? 'animate' : undefined}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{ perspective: '1000px' }}
        >
            {/* Glow effect */}
            <motion.div
                className={cn(
                    'absolute inset-0 rounded-full blur-xl opacity-40',
                    size === 'sm' && '-m-1',
                    size === 'md' && '-m-2',
                    size === 'lg' && '-m-3'
                )}
                style={{ backgroundColor: glowColor }}
                variants={glowAnimation}
                initial="initial"
                animate="animate"
            />

            {/* Avatar */}
            <div className="relative">
                <AvatarBase
                    avatar={avatar}
                    size={sizeMap[size]}
                    className={cn(
                        'border-4 shadow-2xl',
                        'border-white/50 dark:border-white/30'
                    )}
                />

                {/* Level badge */}
                {showLevel && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className={cn(
                            'absolute z-30',
                            size === 'sm' && '-bottom-1 -right-1',
                            size === 'md' && '-bottom-2 -right-2',
                            size === 'lg' && '-bottom-2 -right-2'
                        )}
                    >
                        <LevelBadge
                            level={level}
                            size={size === 'lg' ? 'md' : 'sm'}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default FriendAvatar;
