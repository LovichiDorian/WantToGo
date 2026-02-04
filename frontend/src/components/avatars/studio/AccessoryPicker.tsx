import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Check } from 'lucide-react';
import {
    AVATAR_ACCESSORIES,
    getAccessoriesByCategory,
    type AvatarAccessory
} from '../avatarConstants';

interface AccessoryPickerProps {
    selectedAccessory: string | null;
    userLevel: number;
    onSelect: (accessoryId: string | null) => void;
}

type AccessoryCategory = 'all' | 'glasses' | 'hats' | 'bags' | 'pets' | 'other';

const CATEGORY_EMOJIS: Record<AccessoryCategory, string> = {
    all: '✨',
    glasses: '👓',
    hats: '🎩',
    bags: '🎒',
    pets: '🐕',
    other: '⭐',
};

const CATEGORY_LABELS: Record<AccessoryCategory, string> = {
    all: 'Tout',
    glasses: 'Lunettes',
    hats: 'Chapeaux',
    bags: 'Sacs',
    pets: 'Mascottes',
    other: 'Autres',
};

/**
 * AccessoryPicker - 35 accessory items with category filtering
 */
export function AccessoryPicker({
    selectedAccessory,
    userLevel,
    onSelect,
}: AccessoryPickerProps) {
    const [category, setCategory] = useState<AccessoryCategory>('all');

    const filteredAccessories = category === 'all'
        ? AVATAR_ACCESSORIES
        : getAccessoriesByCategory(category as AvatarAccessory['category']);

    const categories: AccessoryCategory[] = ['all', 'glasses', 'hats', 'bags', 'pets', 'other'];

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
                    selectedAccessory === null
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50'
                )}
                whileTap={{ scale: 0.98 }}
            >
                🚫 Aucun accessoire
            </motion.button>

            {/* Accessories grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto scrollbar-hide">
                {filteredAccessories.map((accessory, index) => {
                    const isUnlocked = userLevel >= accessory.levelRequired;
                    const isSelected = selectedAccessory === accessory.id;

                    return (
                        <motion.button
                            key={accessory.id}
                            onClick={() => isUnlocked && onSelect(accessory.id)}
                            disabled={!isUnlocked}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className={cn(
                                'relative aspect-square rounded-xl flex flex-col items-center justify-center',
                                'transition-all duration-200',
                                'border-2',
                                isSelected && isUnlocked
                                    ? 'border-primary bg-primary/15 scale-105 shadow-md'
                                    : isUnlocked
                                        ? 'border-transparent bg-muted/30 hover:bg-muted/50 hover:scale-105'
                                        : 'border-transparent bg-muted/20 opacity-60 cursor-not-allowed'
                            )}
                            whileHover={isUnlocked ? { scale: 1.1 } : undefined}
                            whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                        >
                            {/* Emoji */}
                            <span className="text-2xl">{accessory.emoji}</span>

                            {/* Lock overlay */}
                            {!isUnlocked && (
                                <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <Lock className="w-3 h-3 text-white mb-0.5" />
                                    <span className="text-[9px] text-white font-medium">
                                        {accessory.levelRequired}
                                    </span>
                                </div>
                            )}

                            {/* Selected indicator */}
                            {isSelected && isUnlocked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
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
                {filteredAccessories.filter(a => userLevel >= a.levelRequired).length}/{filteredAccessories.length} débloqués
            </p>
        </div>
    );
}

export default AccessoryPicker;
