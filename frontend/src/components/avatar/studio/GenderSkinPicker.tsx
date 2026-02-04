import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { CHARACTER_GENDERS, SKIN_TONES, type CharacterGender } from '../characterConstants';

interface GenderSkinPickerProps {
    selectedGender: CharacterGender;
    selectedSkinTone: string;
    onGenderChange: (gender: CharacterGender) => void;
    onSkinToneChange: (toneId: string) => void;
}

/**
 * GenderSkinPicker - Base character selection
 * Gender buttons + skin tone color grid
 */
export function GenderSkinPicker({
    selectedGender,
    selectedSkinTone,
    onGenderChange,
    onSkinToneChange,
}: GenderSkinPickerProps) {
    return (
        <div className="space-y-6">
            {/* Gender Selection */}
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Silhouette
                </h3>
                <div className="flex gap-3">
                    {CHARACTER_GENDERS.map((gender, index) => (
                        <motion.button
                            key={gender.id}
                            onClick={() => onGenderChange(gender.id)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                'flex-1 py-4 px-3 rounded-2xl',
                                'flex flex-col items-center gap-2',
                                'border-2 transition-all duration-200',
                                selectedGender === gender.id
                                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                                    : 'border-transparent bg-muted/30 hover:bg-muted/50'
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-3xl">{gender.emoji}</span>
                            <span className="text-sm font-medium">
                                {gender.id === 'male' && 'Masculin'}
                                {gender.id === 'female' && 'Féminin'}
                                {gender.id === 'neutral' && 'Neutre'}
                            </span>
                            {selectedGender === gender.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center"
                                >
                                    <Check className="w-3 h-3" />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Skin Tone Selection */}
            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Couleur de peau
                </h3>
                <div className="grid grid-cols-4 gap-3">
                    {SKIN_TONES.map((tone, index) => (
                        <motion.button
                            key={tone.id}
                            onClick={() => onSkinToneChange(tone.id)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                'relative aspect-square rounded-2xl',
                                'border-2 transition-all duration-200',
                                'flex items-center justify-center',
                                'shadow-md hover:shadow-lg',
                                selectedSkinTone === tone.id
                                    ? 'border-primary ring-2 ring-primary/30 scale-110'
                                    : 'border-transparent hover:scale-105'
                            )}
                            style={{
                                background: `linear-gradient(135deg, ${tone.highlight}, ${tone.color}, ${tone.shadow})`
                            }}
                            whileHover={{ scale: selectedSkinTone === tone.id ? 1.1 : 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            title={tone.name}
                        >
                            {selectedSkinTone === tone.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 rounded-full bg-white/90 shadow-lg flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-primary" />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GenderSkinPicker;
