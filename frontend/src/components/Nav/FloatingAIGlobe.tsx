import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiButtonVariants, globePulseVariants } from './navAnimations';

interface FloatingAIGlobeProps {
    onClick: () => void;
    hasNewFeature?: boolean;
}

/**
 * FloatingAIGlobe - Floating AI trigger button
 * Features:
 * - 3D-style globe with gradient
 * - Breathing glow animation
 * - "NEW" badge that fades after first click
 * - Float animation
 */
export function FloatingAIGlobe({ onClick, hasNewFeature = false }: FloatingAIGlobeProps) {
    const [showNewBadge, setShowNewBadge] = useState(false);

    useEffect(() => {
        // Check if user has seen the AI feature
        const hasSeenAI = localStorage.getItem('wanttogo_ai_seen');
        if (!hasSeenAI && hasNewFeature) {
            setShowNewBadge(true);
        }
    }, [hasNewFeature]);

    const handleClick = () => {
        // Mark as seen
        if (showNewBadge) {
            localStorage.setItem('wanttogo_ai_seen', 'true');
            setShowNewBadge(false);
        }
        onClick();
    };

    return (
        <motion.button
            variants={aiButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            onClick={handleClick}
            className={cn(
                'relative flex items-center justify-center',
                'w-14 h-14 rounded-2xl',
                'bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600',
                'shadow-lg shadow-violet-500/30',
                '-mt-8', // Elevate above nav
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
            )}
            aria-label="Open AI Assistant"
        >
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 opacity-40 blur-xl -z-10" />

            {/* Globe icon with animation */}
            <motion.div
                variants={globePulseVariants}
                animate="animate"
                className="float-gentle"
            >
                <Globe className="h-7 w-7 text-white spin-slow" />
            </motion.div>

            {/* Inner shine effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none" />

            {/* NEW badge */}
            {showNewBadge && (
                <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="badge-new"
                >
                    NEW
                </motion.span>
            )}

            {/* Breathing glow ring */}
            <div className="absolute inset-0 rounded-2xl breathe opacity-50 pointer-events-none"
                style={{
                    background: 'transparent',
                    boxShadow: '0 0 20px rgba(124, 58, 237, 0.5), 0 0 40px rgba(14, 165, 233, 0.3)'
                }}
            />
        </motion.button>
    );
}
