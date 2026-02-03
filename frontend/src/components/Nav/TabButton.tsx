import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { iconVariants, compassSpinVariants } from './navAnimations';

interface TabButtonProps {
    to: string;
    icon: LucideIcon;
    label: string;
    accentColor?: string;
    isMapTab?: boolean;
}

/**
 * TabButton - Individual navigation tab with animations
 * Features:
 * - Scale animation on active
 * - Glow effect when selected
 * - Compass spin for map tab
 * - Touch scale feedback
 */
export function TabButton({
    to,
    icon: Icon,
    label,
    accentColor,
    isMapTab = false
}: TabButtonProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200',
                    'min-w-[56px] relative touch-scale',
                    isActive
                        ? cn(
                            accentColor || 'text-primary',
                            'bg-white/5'
                        )
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )
            }
        >
            {({ isActive }) => (
                <>
                    <motion.div
                        variants={isMapTab ? compassSpinVariants : iconVariants}
                        animate={isActive ? 'active' : 'inactive'}
                        className="relative"
                    >
                        <Icon
                            className={cn(
                                'h-5 w-5 transition-all duration-200',
                                isActive && 'drop-shadow-[0_0_8px_currentColor]'
                            )}
                        />
                        {/* Active glow */}
                        {isActive && (
                            <motion.div
                                layoutId="tab-glow"
                                className={cn(
                                    'absolute inset-0 rounded-full blur-lg opacity-50',
                                    accentColor === 'text-violet-500' ? 'bg-violet-500' :
                                        accentColor === 'text-amber-500' ? 'bg-amber-500' :
                                            'bg-primary'
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.div>

                    <span
                        className={cn(
                            'text-[10px] font-medium leading-tight transition-all duration-200',
                            isActive && 'font-semibold'
                        )}
                    >
                        {label}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                        <motion.div
                            layoutId="nav-active-indicator"
                            className={cn(
                                'absolute -bottom-0.5 w-1 h-1 rounded-full',
                                accentColor === 'text-violet-500' ? 'bg-violet-500' :
                                    accentColor === 'text-amber-500' ? 'bg-amber-500' :
                                        'bg-primary'
                            )}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}
