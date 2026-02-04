import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Check } from 'lucide-react';
import {
    AVATAR_BACKGROUNDS,
    getBackgroundsByCategory,
    type AvatarBackground
} from '../avatarConstants';

interface BackgroundPickerProps {
    selectedBackground: string | null;
    userLevel: number;
    onSelect: (backgroundId: string | null) => void;
}

type BackgroundCategory = 'all' | 'cities' | 'nature' | 'landmarks' | 'abstract';

const CATEGORY_EMOJIS: Record<BackgroundCategory, string> = {
    all: '✨',
    cities: '🏙️',
    nature: '🌲',
    landmarks: '🗼',
    abstract: '🌀',
};

const CATEGORY_LABELS: Record<BackgroundCategory, string> = {
    all: 'Tout',
    cities: 'Villes',
    nature: 'Nature',
    landmarks: 'Monuments',
    abstract: 'Abstract',
};

/**
 * BackgroundPicker - 25 background options with category filtering
 */
export function BackgroundPicker({
    selectedBackground,
    userLevel,
    onSelect,
}: BackgroundPickerProps) {
    const [category, setCategory] = useState<BackgroundCategory>('all');

    const filteredBackgrounds = category === 'all'
        ? AVATAR_BACKGROUNDS
        : getBackgroundsByCategory(category as AvatarBackground['category']);

    const categories: BackgroundCategory[] = ['all', 'cities', 'nature', 'landmarks', 'abstract'];

    return (
        <div className="space-y-4">
            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                    <motion.button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap',
                            'transition-all',
                            category === cat
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{CATEGORY_EMOJIS[cat]}</span>
                        <span>{CATEGORY_LABELS[cat]}</span>
                    </motion.button>
                ))}
            </div>

            {/* None option */}
            <motion.button
                onClick={() => onSelect(null)}
                className={cn(
                    'w-full py-3 px-4 rounded-xl text-sm font-medium',
                    'transition-all border-2',
                    selectedBackground === null
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50'
                )}
                whileTap={{ scale: 0.98 }}
            >
                🚫 Pas de fond
            </motion.button>

            {/* Backgrounds grid */}
            <div className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto scrollbar-hide">
                {filteredBackgrounds.map((bg, index) => {
                    const isUnlocked = userLevel >= bg.levelRequired;
                    const isSelected = selectedBackground === bg.id;

                    return (
                        <motion.button
                            key={bg.id}
                            onClick={() => isUnlocked && onSelect(bg.id)}
                            disabled={!isUnlocked}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className={cn(
                                'relative aspect-video rounded-xl overflow-hidden',
                                'transition-all duration-200',
                                'border-2',
                                isSelected && isUnlocked
                                    ? 'border-white ring-2 ring-primary scale-105 shadow-lg'
                                    : isUnlocked
                                        ? 'border-transparent hover:scale-105 hover:shadow-md'
                                        : 'border-transparent opacity-60 cursor-not-allowed'
                            )}
                            whileHover={isUnlocked ? { scale: 1.08 } : undefined}
                            whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                        >
                            {/* Gradient background */}
                            <div
                                className={cn(
                                    'absolute inset-0 bg-gradient-to-br',
                                    bg.gradient
                                )}
                            />

                            {/* Label */}
                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                                <span className="text-[10px] font-medium text-white">
                                    Niv.{bg.levelRequired}
                                </span>
                            </div>

                            {/* Lock overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <Lock className="w-4 h-4 text-white mb-1" />
                                    <span className="text-[10px] text-white font-medium">
                                        Niv. {bg.levelRequired}
                                    </span>
                                </div>
                            )}

                            {/* Selected indicator */}
                            {isSelected && isUnlocked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
                                >
                                    <Check className="w-3 h-3" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Count indicator */}
            <p className="text-xs text-center text-muted-foreground">
                {filteredBackgrounds.filter(b => userLevel >= b.levelRequired).length}/{filteredBackgrounds.length} débloqués
            </p>
        </div>
    );
}

export default BackgroundPicker;
