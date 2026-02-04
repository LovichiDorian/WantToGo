import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Palette, Check, Lock } from 'lucide-react';
import {
    AVATAR_COLORS,
    AVATAR_GRADIENTS,
    type AvatarGradient
} from '../avatarConstants';

interface ColorStudioProps {
    selectedColor: string;
    selectedSecondaryColor?: string | null;
    customHex?: string | null;
    userLevel: number;
    onColorChange: (primary: string, secondary?: string | null) => void;
    onCustomHexChange: (hex: string | null) => void;
}

type ColorTab = 'solid' | 'gradient' | 'custom';

/**
 * ColorStudio - Color customization with gradients and hex picker
 */
export function ColorStudio({
    selectedColor,
    selectedSecondaryColor,
    customHex,
    userLevel,
    onColorChange,
    onCustomHexChange,
}: ColorStudioProps) {
    const [activeTab, setActiveTab] = useState<ColorTab>('solid');
    const [hexInput, setHexInput] = useState(customHex || '');

    const handleGradientSelect = (gradient: AvatarGradient) => {
        onColorChange(gradient.from, gradient.to);
    };

    const handleSolidSelect = (hex: string) => {
        onColorChange(hex, null);
    };

    const handleCustomHex = () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
            onCustomHexChange(hexInput);
            onColorChange(hexInput, null);
        }
    };

    const tabs: { id: ColorTab; label: string; icon: string }[] = [
        { id: 'solid', label: 'Uni', icon: '🎨' },
        { id: 'gradient', label: 'Dégradé', icon: '🌈' },
        { id: 'custom', label: 'Custom', icon: '✨' },
    ];

    return (
        <div className="space-y-4">
            {/* Tab switcher */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                            'flex items-center justify-center gap-1.5',
                            activeTab === tab.id
                                ? 'bg-white dark:bg-gray-800 shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Solid colors grid */}
            {activeTab === 'solid' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-6 gap-2"
                >
                    {AVATAR_COLORS.map((color, index) => {
                        const isSelected = selectedColor === color.hex && !selectedSecondaryColor;
                        return (
                            <motion.button
                                key={color.id}
                                onClick={() => handleSolidSelect(color.hex)}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className={cn(
                                    'aspect-square rounded-xl transition-all',
                                    'border-2',
                                    isSelected
                                        ? 'border-white ring-2 ring-offset-2 ring-primary scale-110'
                                        : 'border-transparent hover:scale-110'
                                )}
                                style={{ backgroundColor: color.hex }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSelected && (
                                    <Check className="w-4 h-4 text-white mx-auto" />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            )}

            {/* Gradients grid */}
            {activeTab === 'gradient' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-4 gap-2"
                >
                    {AVATAR_GRADIENTS.map((gradient, index) => {
                        const isUnlocked = userLevel >= gradient.levelRequired;
                        const isSelected = selectedColor === gradient.from && selectedSecondaryColor === gradient.to;

                        return (
                            <motion.button
                                key={gradient.id}
                                onClick={() => isUnlocked && handleGradientSelect(gradient)}
                                disabled={!isUnlocked}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className={cn(
                                    'relative aspect-square rounded-xl transition-all',
                                    'border-2',
                                    isSelected && isUnlocked
                                        ? 'border-white ring-2 ring-offset-2 ring-primary scale-105'
                                        : isUnlocked
                                            ? 'border-transparent hover:scale-105'
                                            : 'border-transparent opacity-60 cursor-not-allowed'
                                )}
                                style={{
                                    background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                                }}
                                whileHover={isUnlocked ? { scale: 1.1 } : undefined}
                                whileTap={isUnlocked ? { scale: 0.95 } : undefined}
                            >
                                {isSelected && isUnlocked && (
                                    <Check className="w-4 h-4 text-white mx-auto" />
                                )}
                                {!isUnlocked && (
                                    <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                                        <Lock className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            )}

            {/* Custom hex picker */}
            {activeTab === 'custom' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/50"
                            style={{ backgroundColor: hexInput || selectedColor }}
                        />
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Code couleur HEX
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={hexInput}
                                    onChange={(e) => setHexInput(e.target.value)}
                                    placeholder="#3B82F6"
                                    className={cn(
                                        'flex-1 px-3 py-2 rounded-xl',
                                        'bg-muted/50 border border-border',
                                        'text-sm font-mono',
                                        'focus:outline-none focus:ring-2 focus:ring-primary'
                                    )}
                                    maxLength={7}
                                />
                                <motion.button
                                    onClick={handleCustomHex}
                                    disabled={!/^#[0-9A-Fa-f]{6}$/.test(hexInput)}
                                    className={cn(
                                        'px-4 py-2 rounded-xl',
                                        'bg-primary text-white',
                                        'disabled:opacity-50 disabled:cursor-not-allowed'
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Palette className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Color input for native picker */}
                    <div className="relative">
                        <input
                            type="color"
                            value={hexInput || selectedColor}
                            onChange={(e) => {
                                setHexInput(e.target.value);
                                onCustomHexChange(e.target.value);
                                onColorChange(e.target.value, null);
                            }}
                            className="w-full h-12 rounded-xl cursor-pointer border-0"
                        />
                        <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-white/20" />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default ColorStudio;
