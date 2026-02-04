import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Check } from 'lucide-react';
import {
    CHARACTER_OUTFITS,
    type Outfit,
    type OutfitCategory
} from '../characterConstants';

interface OutfitGridProps {
    selectedOutfit: string;
    userLevel: number;
    onSelect: (outfitId: string) => void;
}

const OUTFIT_CATEGORIES: { id: OutfitCategory; label: string; emoji: string }[] = [
    { id: 'casual', label: 'Casual', emoji: '👕' },
    { id: 'adventure', label: 'Aventure', emoji: '🧭' },
    { id: 'beach', label: 'Plage', emoji: '🏖️' },
    { id: 'formal', label: 'Formel', emoji: '💼' },
    { id: 'winter', label: 'Hiver', emoji: '❄️' },
];

/**
 * OutfitGrid - Travel outfit selection with category tabs
 */
export function OutfitGrid({
    selectedOutfit,
    userLevel,
    onSelect,
}: OutfitGridProps) {
    const [activeCategory, setActiveCategory] = useState<OutfitCategory | 'all'>('all');

    const filteredOutfits = activeCategory === 'all'
        ? CHARACTER_OUTFITS
        : CHARACTER_OUTFITS.filter(o => o.category === activeCategory);

    const unlockedCount = CHARACTER_OUTFITS.filter(o => o.levelRequired <= userLevel).length;

    return (
        <div className="space-y-4">
            {/* Stats */}
            <p className="text-sm text-muted-foreground text-center">
                {unlockedCount}/{CHARACTER_OUTFITS.length} tenues débloquées
            </p>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                <CategoryTab
                    active={activeCategory === 'all'}
                    onClick={() => setActiveCategory('all')}
                    emoji="✨"
                    label="Tous"
                />
                {OUTFIT_CATEGORIES.map(cat => (
                    <CategoryTab
                        key={cat.id}
                        active={activeCategory === cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        emoji={cat.emoji}
                        label={cat.label}
                    />
                ))}
            </div>

            {/* Outfit grid */}
            <div className="grid grid-cols-2 gap-3">
                {filteredOutfits.map((outfit, index) => (
                    <OutfitCard
                        key={outfit.id}
                        outfit={outfit}
                        isSelected={selectedOutfit === outfit.id}
                        isUnlocked={userLevel >= outfit.levelRequired}
                        onSelect={() => onSelect(outfit.id)}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
}

function CategoryTab({
    active,
    onClick,
    emoji,
    label
}: {
    active: boolean;
    onClick: () => void;
    emoji: string;
    label: string;
}) {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap',
                'transition-all duration-200',
                active
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/30 hover:bg-muted/50'
            )}
            whileTap={{ scale: 0.95 }}
        >
            <span>{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
        </motion.button>
    );
}

function OutfitCard({
    outfit,
    isSelected,
    isUnlocked,
    onSelect,
    index,
}: {
    outfit: Outfit;
    isSelected: boolean;
    isUnlocked: boolean;
    onSelect: () => void;
    index: number;
}) {
    return (
        <motion.button
            onClick={() => isUnlocked && onSelect()}
            disabled={!isUnlocked}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                'relative p-4 rounded-2xl',
                'flex flex-col items-center gap-2',
                'border-2 transition-all duration-200',
                isSelected && isUnlocked
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : isUnlocked
                        ? 'border-transparent bg-muted/30 hover:bg-muted/50 hover:shadow-md'
                        : 'border-transparent bg-muted/20 opacity-60 cursor-not-allowed'
            )}
            whileHover={isUnlocked ? { scale: 1.02 } : undefined}
            whileTap={isUnlocked ? { scale: 0.98 } : undefined}
        >
            {/* Color preview circles */}
            <div className="flex gap-1 mb-1">
                <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: outfit.colors.primary }}
                />
                <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ backgroundColor: outfit.colors.secondary }}
                />
                {outfit.colors.accent && (
                    <div
                        className="w-8 h-8 rounded-full shadow-md"
                        style={{ backgroundColor: outfit.colors.accent }}
                    />
                )}
            </div>

            {/* Emoji */}
            <span className="text-2xl">{outfit.emoji}</span>

            {/* Name */}
            <span className="text-sm font-medium text-center">
                {outfit.name}
            </span>

            {/* Level requirement */}
            <span className="text-xs text-muted-foreground">
                Niv. {outfit.levelRequired}
            </span>

            {/* Lock overlay */}
            {!isUnlocked && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Lock className="w-5 h-5 text-white mb-1" />
                    <span className="text-xs text-white font-medium">
                        Niv. {outfit.levelRequired}
                    </span>
                </div>
            )}

            {/* Selected indicator */}
            {isSelected && isUnlocked && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
                >
                    <Check className="w-4 h-4" />
                </motion.div>
            )}
        </motion.button>
    );
}

export default OutfitGrid;
