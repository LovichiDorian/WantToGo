import { motion } from 'framer-motion';
import { Sun, Moon, Laptop, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface ThemeOption {
    value: 'light' | 'dark' | 'system';
    icon: typeof Sun;
    labelKey: string;
}

const themeOptions: ThemeOption[] = [
    { value: 'light', icon: Sun, labelKey: 'settings.light' },
    { value: 'dark', icon: Moon, labelKey: 'settings.dark' },
    { value: 'system', icon: Laptop, labelKey: 'settings.system' },
];

interface ThemeToggleProps {
    showPreview?: boolean;
    showXpReward?: boolean;
}

/**
 * Visual theme selector with live preview cards
 * Includes gamification XP reward on theme change
 */
export function ThemeToggle({ showPreview = true, showXpReward = true }: ThemeToggleProps) {
    const { t } = useTranslation();
    const { theme, setTheme, effectiveTheme } = useTheme();
    const { toast } = useToast();

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        if (newTheme !== theme) {
            setTheme(newTheme);

            if (showXpReward) {
                toast({
                    title: t('settings.themeChanged') || 'Nouveau style ! +50 XP',
                    description: (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-semibold">+50 XP</span>
                        </span>
                    ),
                });
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Theme selector buttons */}
            <div className="flex gap-2">
                {themeOptions.map(({ value, icon: Icon, labelKey }) => (
                    <motion.button
                        key={value}
                        onClick={() => handleThemeChange(value)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl',
                            'text-sm font-medium transition-all duration-200',
                            theme === value
                                ? 'gradient-primary text-white shadow-lg'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{t(labelKey)}</span>
                    </motion.button>
                ))}
            </div>

            {/* Live preview cards */}
            {showPreview && (
                <div className="flex gap-3">
                    {/* Light preview */}
                    <motion.div
                        className={cn(
                            'flex-1 p-4 rounded-2xl border-2 transition-all',
                            'bg-white text-gray-900',
                            effectiveTheme === 'light'
                                ? 'border-primary shadow-glow'
                                : 'border-gray-200'
                        )}
                        animate={{
                            scale: effectiveTheme === 'light' ? 1 : 0.95,
                            opacity: effectiveTheme === 'light' ? 1 : 0.7
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Sun className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium">Light</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="h-2 w-full rounded bg-gray-200" />
                            <div className="h-2 w-2/3 rounded bg-blue-500" />
                            <div className="h-2 w-1/2 rounded bg-gray-100" />
                        </div>
                    </motion.div>

                    {/* Dark preview */}
                    <motion.div
                        className={cn(
                            'flex-1 p-4 rounded-2xl border-2 transition-all',
                            'bg-slate-900 text-white',
                            effectiveTheme === 'dark'
                                ? 'border-primary shadow-glow-purple'
                                : 'border-slate-700'
                        )}
                        animate={{
                            scale: effectiveTheme === 'dark' ? 1 : 0.95,
                            opacity: effectiveTheme === 'dark' ? 1 : 0.7
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-medium">Dark</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="h-2 w-full rounded bg-slate-700" />
                            <div className="h-2 w-2/3 rounded bg-purple-500" />
                            <div className="h-2 w-1/2 rounded bg-slate-800" />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default ThemeToggle;
