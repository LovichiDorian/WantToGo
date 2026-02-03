import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    variant?: 'default' | 'strong' | 'centered' | 'light';
    hover?: boolean;
    className?: string;
}

/**
 * Premium glassmorphism card component for 2026 design system
 * Automatically adapts to light/dark mode
 */
export function GlassCard({
    children,
    variant = 'default',
    hover = true,
    className,
    ...props
}: GlassCardProps) {
    const baseClasses = cn(
        'rounded-3xl p-6 transition-all duration-300',
        {
            'glass-card': variant === 'default',
            'glass-strong': variant === 'strong',
            'glass-card-centered': variant === 'centered',
            'glass-light': variant === 'light',
        },
        className
    );

    if (!hover) {
        return (
            <motion.div className={baseClasses} {...props}>
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            className={baseClasses}
            whileHover={{
                scale: 1.01,
                y: -2,
            }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default GlassCard;
