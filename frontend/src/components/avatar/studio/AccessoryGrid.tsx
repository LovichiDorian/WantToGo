import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Check, X } from 'lucide-react';
import {
    CHARACTER_ACCESSORIES,
    type Accessory,
    type AccessoryCategory
} from '../characterConstants';

interface AccessoryGridProps {
    selectedAccessories: string[];
    userLevel: number;
    onToggle: (accessoryId: string) => void;
}

const ACCESSORY_CATEGORIES: { id: AccessoryCategory; label: string; emoji: string }[] = [
    { id: 'bags', label: 'Sacs', emoji: '🎒' },
    { id: 'headwear', label: 'Chapeaux', emoji: '🧢' },
    { id: 'eyewear', label: 'Lunettes', emoji: '🕶️' },
    { id: 'tech', label: 'Tech', emoji: '📷' },
    { id: 'other', label: 'Autres', emoji: '🗺️' },
];

/**
 * AccessoryGrid - Travel accessory selection with multi-select
 */
export function AccessoryGrid({
    selectedAccessories,
    userLevel,
    onToggle,
}: AccessoryGridProps) {
    const [activeCategory, setActiveCategory] = useState<AccessoryCategory | 'all'>('all');

    const filteredAccessories = activeCategory === 'all'
        ? CHARACTER_ACCESSORIES
        : CHARACTER_ACCESSORIES.filter(a => a.category === activeCategory);

    const unlockedCount = CHARACTER_ACCESSORIES.filter(a => a.levelRequired <= userLevel).length;

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {unlockedCount}/{CHARACTER_ACCESSORIES.length} accessoires
                </p>
                <p className="text-sm text-muted-foreground">
                    {selectedAccessories.length} équipé(s)
                </p>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                <CategoryTab
                    active={activeCategory === 'all'}
                    onClick={() => setActiveCategory('all')}
                    emoji="✨"
                    label="Tous"
                />
                {ACCESSORY_CATEGORIES.map(cat => (
                    <CategoryTab
                        key={cat.id}
                        active={activeCategory === cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        emoji={cat.emoji}
                        label={cat.label}
                    />
                ))}
            </div>

            {/* Accessory grid */}
            <div className="grid grid-cols-3 gap-3">
                {filteredAccessories.map((accessory, index) => (
                    <AccessoryCard
                        key={accessory.id}
                        accessory={accessory}
                        isSelected={selectedAccessories.includes(accessory.id)}
                        isUnlocked={userLevel >= accessory.levelRequired}
                        onToggle={() => onToggle(accessory.id)}
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

function AccessoryCard({
    accessory,
    isSelected,
    isUnlocked,
    onToggle,
    index,
}: {
    accessory: Accessory;
    isSelected: boolean;
    isUnlocked: boolean;
    onToggle: () => void;
    index: number;
}) {
    return (
        <motion.button
            onClick={() => isUnlocked && onToggle()}
            disabled={!isUnlocked}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
                'relative aspect-square rounded-2xl',
                'flex flex-col items-center justify-center gap-1',
                'border-2 transition-all duration-200',
                isSelected && isUnlocked
                    ? 'border-primary bg-primary/15 shadow-lg'
                    : isUnlocked
                        ? 'border-transparent bg-muted/30 hover:bg-muted/50 hover:shadow-md'
                        : 'border-transparent bg-muted/20 opacity-60 cursor-not-allowed'
            )}
            whileHover={isUnlocked ? { scale: 1.05 } : undefined}
            whileTap={isUnlocked ? { scale: 0.95 } : undefined}
        >
            {/* Emoji */}
            <span className="text-2xl">{accessory.emoji}</span>

            {/* Name */}
            <span className="text-[10px] font-medium text-center px-1 truncate w-full">
                {accessory.name}
            </span>

            {/* Level */}
            <span className="text-[9px] text-muted-foreground">
                Niv. {accessory.levelRequired}
            </span>

            {/* Lock overlay */}
            {!isUnlocked && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Lock className="w-4 h-4 text-white mb-0.5" />
                    <span className="text-[10px] text-white font-medium">
                        Niv. {accessory.levelRequired}
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

            {/* Remove button when selected */}
            {isSelected && isUnlocked && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                >
                    <X className="w-3 h-3" />
                </motion.div>
            )}
        </motion.button>
    );
}

export default AccessoryGrid;
