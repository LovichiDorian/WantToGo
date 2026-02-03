import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, Map, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabButton } from './TabButton';
import { FloatingAIGlobe } from './FloatingAIGlobe';
import { navBarVariants } from './navAnimations';

interface WantToGoBottomNavProps {
    onAIClick: () => void;
    className?: string;
}

/**
 * WantToGoBottomNav - Main bottom navigation component
 * 
 * Features:
 * - 4 main tabs: Home, Map, Friends, Profile
 * - Floating AI globe button elevated above nav
 * - Glassmorphism background with backdrop-blur
 * - Safe area support for iOS notch
 * - Framer Motion animations
 * - i18n support
 */
export function WantToGoBottomNav({ onAIClick, className }: WantToGoBottomNavProps) {
    const { t } = useTranslation();

    const tabs = [
        {
            id: 'home',
            to: '/',
            icon: Home,
            label: t('nav.home')
        },
        {
            id: 'map',
            to: '/map',
            icon: Map,
            label: t('nav.map'),
            isMapTab: true
        },
        {
            id: 'friends',
            to: '/friends',
            icon: Users,
            label: t('nav.friends')
        },
        {
            id: 'profile',
            to: '/profile',
            icon: User,
            label: t('nav.profile')
        }
    ];

    return (
        <motion.nav
            variants={navBarVariants}
            initial="initial"
            animate="animate"
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50',
                'nav-safe-area',
                className
            )}
        >
            {/* Navigation container with glassmorphism */}
            <div className={cn(
                'mx-3 mb-2 rounded-3xl',
                'glass-nav',
                'shadow-2xl shadow-black/20',
                'border border-white/10'
            )}>
                <div className="flex h-[72px] items-center justify-around px-2 relative">
                    {/* Left tabs: Home, Map */}
                    <div className="flex items-center gap-1">
                        {tabs.slice(0, 2).map((tab) => (
                            <TabButton
                                key={tab.id}
                                to={tab.to}
                                icon={tab.icon}
                                label={tab.label}
                                isMapTab={tab.isMapTab}
                            />
                        ))}
                    </div>

                    {/* Center: Floating AI Globe */}
                    <FloatingAIGlobe onClick={onAIClick} hasNewFeature />

                    {/* Right tabs: Friends, Profile */}
                    <div className="flex items-center gap-1">
                        {tabs.slice(2).map((tab) => (
                            <TabButton
                                key={tab.id}
                                to={tab.to}
                                icon={tab.icon}
                                label={tab.label}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Settings quick access - hidden for now, accessible via Profile */}
            {/* Can be enabled as a buried menu item */}
        </motion.nav>
    );
}

export { TabButton } from './TabButton';
export { FloatingAIGlobe } from './FloatingAIGlobe';
