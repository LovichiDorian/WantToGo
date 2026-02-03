import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface PrimaryButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    xpReward?: number;
    isLoading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

/**
 * Gamified animated button with XP reward badge
 * Features gradient backgrounds, glow effects, and micro-animations
 */
export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'default',
            xpReward,
            isLoading = false,
            fullWidth = false,
            icon,
            className,
            disabled,
            type = 'button',
            onClick,
        },
        ref
    ) => {
        const baseClasses = cn(
            'relative inline-flex items-center justify-center gap-2',
            'font-semibold rounded-2xl transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            {
                // Sizes
                'h-10 px-4 text-sm': size === 'sm',
                'h-12 px-6 text-base': size === 'default',
                'h-14 px-8 text-lg': size === 'lg',
                // Width
                'w-full': fullWidth,
                // Variants
                'gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-glow':
                    variant === 'primary',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80':
                    variant === 'secondary',
                'bg-transparent hover:bg-muted text-foreground':
                    variant === 'ghost',
                'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground':
                    variant === 'outline',
            },
            className
        );

        return (
            <motion.button
                ref={ref}
                type={type}
                className={baseClasses}
                whileHover={disabled ? undefined : { scale: 1.02 }}
                whileTap={disabled ? undefined : { scale: 0.98 }}
                disabled={disabled || isLoading}
                onClick={onClick}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                        {children}
                        {icon && <span className="ml-1">{icon}</span>}
                        {xpReward && (
                            <motion.span
                                className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.1 }}
                            >
                                <Sparkles className="w-3 h-3" />
                                +{xpReward} XP
                            </motion.span>
                        )}
                    </>
                )}
            </motion.button>
        );
    }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
