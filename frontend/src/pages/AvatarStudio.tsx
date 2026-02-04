import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Sparkles,
    User,
    Shirt,
    Backpack,
    Check,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/AuthContext';
import { useGamification } from '@/features/gamification/context/GamificationContext';

// Chibi character components
import { ChibiCharacter } from '@/components/avatar/ChibiCharacter';
import {
    GenderSkinPicker,
    OutfitGrid,
    AccessoryGrid
} from '@/components/avatar/studio';
import {
    DEFAULT_CHARACTER,
    type CharacterConfig,
    type CharacterGender
} from '@/components/avatar/characterConstants';

type TabId = 'base' | 'outfits' | 'accessories';

const TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'base', icon: User, label: 'Base' },
    { id: 'outfits', icon: Shirt, label: 'Tenues' },
    { id: 'accessories', icon: Backpack, label: 'Accessoires' },
];

/**
 * AvatarStudio - Chibi character customization page
 */
export function AvatarStudio() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile } = useGamification();

    const [activeTab, setActiveTab] = useState<TabId>('base');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Character configuration state
    const [config, setConfig] = useState<CharacterConfig>(DEFAULT_CHARACTER);

    // User level for unlocking
    const userLevel = profile?.level || 1;

    // Load user's saved character on mount
    useEffect(() => {
        if (user) {
            // TODO: Load from user profile/API
            // For now, use defaults
        }
    }, [user]);

    // Handlers
    const handleGenderChange = (gender: CharacterGender) => {
        setConfig(prev => ({ ...prev, gender }));
        setSaved(false);
    };

    const handleSkinToneChange = (skinTone: string) => {
        setConfig(prev => ({ ...prev, skinTone }));
        setSaved(false);
    };

    const handleOutfitChange = (outfit: string) => {
        setConfig(prev => ({ ...prev, outfit }));
        setSaved(false);
    };

    const handleAccessoryToggle = (accessoryId: string) => {
        setConfig(prev => {
            const accessories = prev.accessories.includes(accessoryId)
                ? prev.accessories.filter(id => id !== accessoryId)
                : [...prev.accessories, accessoryId];
            return { ...prev, accessories };
        });
        setSaved(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: API call to save character config
        await new Promise(resolve => setTimeout(resolve, 800));
        setSaved(true);
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Fixed Header */}
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="text-center">
                        <h1 className="font-bold text-lg">Mon Personnage</h1>
                        <p className="text-xs text-muted-foreground">Personnalise ton avatar</p>
                    </div>

                    <Button
                        variant={saved ? "outline" : "default"}
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving || saved}
                        className="rounded-xl gap-1.5"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving ? 'Sauvegarde...' : saved ? 'Sauvegardé' : 'Sauvegarder'}
                    </Button>
                </div>
            </motion.header>

            {/* Content with padding for header */}
            <div className="pt-20 pb-32">
                {/* Character Preview Hero */}
                <motion.section
                    className="relative py-8 px-4 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-transparent" />

                    {/* Glow effect */}
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-30"
                        style={{ backgroundColor: '#3B82F6' }}
                    />

                    {/* Character */}
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            key={`${config.gender}-${config.skinTone}-${config.outfit}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <ChibiCharacter
                                config={config}
                                size="xl"
                                animated
                            />
                        </motion.div>

                        {/* Level badge */}
                        <motion.div
                            className="mt-4 flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Niveau {userLevel}</span>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Tab Navigation */}
                <div className="px-4 mb-4">
                    <div className="flex gap-2 bg-muted/30 backdrop-blur-sm rounded-2xl p-1.5">
                        {TABS.map(tab => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl',
                                    'transition-all duration-200',
                                    activeTab === tab.id
                                        ? 'bg-background shadow-md text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                                whileTap={{ scale: 0.98 }}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-4"
                        >
                            {activeTab === 'base' && (
                                <GenderSkinPicker
                                    selectedGender={config.gender}
                                    selectedSkinTone={config.skinTone}
                                    onGenderChange={handleGenderChange}
                                    onSkinToneChange={handleSkinToneChange}
                                />
                            )}

                            {activeTab === 'outfits' && (
                                <OutfitGrid
                                    selectedOutfit={config.outfit}
                                    userLevel={userLevel}
                                    onSelect={handleOutfitChange}
                                />
                            )}

                            {activeTab === 'accessories' && (
                                <AccessoryGrid
                                    selectedAccessories={config.accessories}
                                    userLevel={userLevel}
                                    onToggle={handleAccessoryToggle}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* XP Reward Indicator */}
            <motion.div
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-xl flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold text-white">
                        Sauvegarde = +100 XP
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

export default AvatarStudio;
