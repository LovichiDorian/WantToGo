import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getAvatarBase, type AvatarData } from './avatarConstants';

interface AvatarBaseProps {
    avatar: AvatarData;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showAccessory?: boolean;
}

const sizeClasses = {
    xs: 'w-8 h-8 text-lg',
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-5xl',
};

const borderSizes = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
    xl: 'border-4',
};

/**
 * AvatarBase - Core avatar display component
 * Renders avatar emoji with color background and optional accessory
 */
export function AvatarBase({
    avatar,
    size = 'md',
    className,
    showAccessory = true,
}: AvatarBaseProps) {
    const baseData = getAvatarBase(avatar.base);
    const emoji = baseData?.emoji || '🧳';

    return (
        <div
            className={cn(
                'relative rounded-full flex items-center justify-center',
                'shadow-lg transition-all duration-300',
                sizeClasses[size],
                borderSizes[size],
                'border-white/50',
                className
            )}
            style={{
                backgroundColor: avatar.color,
                boxShadow: `0 0 20px ${avatar.color}40`,
            }}
        >
            {/* Background gradient overlay */}
            {avatar.background && (
                <div
                    className={cn(
                        'absolute inset-0 rounded-full opacity-30',
                        `bg-gradient-to-br ${avatar.background}`
                    )}
                />
            )}

            {/* Main emoji */}
            <span className="relative z-10 select-none">{emoji}</span>

            {/* Accessory badge */}
            {showAccessory && avatar.accessory && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                        'absolute -bottom-1 -right-1 z-20',
                        'bg-white rounded-full shadow-md',
                        'flex items-center justify-center',
                        size === 'xs' || size === 'sm' ? 'w-4 h-4 text-xs' : 'w-6 h-6 text-sm'
                    )}
                >
                    {avatar.accessory === 'lunettes' && '👓'}
                    {avatar.accessory === 'chapeau' && '🎩'}
                    {avatar.accessory === 'casquette' && '🧢'}
                    {avatar.accessory === 'sac' && '🎒'}
                    {avatar.accessory === 'camera' && '📷'}
                    {avatar.accessory === 'headphones' && '🎧'}
                    {avatar.accessory === 'sunglasses' && '🕶️'}
                    {avatar.accessory === 'crown' && '👑'}
                </motion.div>
            )}
        </div>
    );
}

export default AvatarBase;
