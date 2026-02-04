import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Sparkles,
    Palette,
    Crown,
    Image,
    Wand2,
    Save,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import {
    LiveAvatarPreview,
    BaseStyleGrid,
    ColorStudio,
    AccessoryPicker,
    BackgroundPicker,
    AnimationPreview,
} from '@/components/avatars/studio';
import {
    type AvatarData,
    DEFAULT_AVATAR,
    AVATAR_STUDIO_CONFIG
} from '@/components/avatars/avatarConstants';

type StudioTab = 'base' | 'colors' | 'accessories' | 'backgrounds' | 'animations';

const TABS: { id: StudioTab; icon: typeof Sparkles; labelKey: string; emoji: string }[] = [
    { id: 'base', icon: Crown, labelKey: 'avatarStudio.tabs.base', emoji: '👤' },
    { id: 'colors', icon: Palette, labelKey: 'avatarStudio.tabs.colors', emoji: '🎨' },
    { id: 'accessories', icon: Sparkles, labelKey: 'avatarStudio.tabs.accessories', emoji: '✨' },
    { id: 'backgrounds', icon: Image, labelKey: 'avatarStudio.tabs.backgrounds', emoji: '🖼️' },
    { id: 'animations', icon: Wand2, labelKey: 'avatarStudio.tabs.animations', emoji: '🎬' },
];

/**
 * AvatarStudio - Full screen avatar customization page
 * 5 tabs: Base, Colors, Accessories, Backgrounds, Animations
 */
export function AvatarStudio() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<StudioTab>('base');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Avatar state
    const [avatar, setAvatar] = useState<AvatarData>({
        base: user?.avatarBase || DEFAULT_AVATAR.base,
        color: user?.avatarColor || DEFAULT_AVATAR.color,
        secondaryColor: null,
        customHex: null,
        accessory: user?.avatarAccessory || DEFAULT_AVATAR.accessory,
        background: user?.avatarBackground || DEFAULT_AVATAR.background,
        animation: user?.avatarAnimation || DEFAULT_AVATAR.animation,
    });

    const userLevel = user?.level || 1;
    const monthlyChangesLeft = 5; // TODO: Track from backend

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: API call to save avatar
            // await updateUserAvatar(avatar);

            // Simulate save
            await new Promise(resolve => setTimeout(resolve, 800));

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Failed to save avatar:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Update handlers
    const updateBase = (baseId: string) => {
        setAvatar(prev => ({ ...prev, base: baseId }));
    };

    const updateColors = (primary: string, secondary?: string | null) => {
        setAvatar(prev => ({ ...prev, color: primary, secondaryColor: secondary }));
    };

    const updateCustomHex = (hex: string | null) => {
        setAvatar(prev => ({ ...prev, customHex: hex }));
    };

    const updateAccessory = (accessoryId: string | null) => {
        setAvatar(prev => ({ ...prev, accessory: accessoryId }));
    };

    const updateBackground = (backgroundId: string | null) => {
        setAvatar(prev => ({ ...prev, background: backgroundId }));
    };

    const updateAnimation = (animationId: string | null) => {
        setAvatar(prev => ({ ...prev, animation: animationId }));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'base':
                return (
                    <BaseStyleGrid
                        selectedBase={avatar.base}
                        userLevel={userLevel}
                        color={avatar.color}
                        onSelect={updateBase}
                    />
                );
            case 'colors':
                return (
                    <ColorStudio
                        selectedColor={avatar.color}
                        selectedSecondaryColor={avatar.secondaryColor}
                        customHex={avatar.customHex}
                        userLevel={userLevel}
                        onColorChange={updateColors}
                        onCustomHexChange={updateCustomHex}
                    />
                );
            case 'accessories':
                return (
                    <AccessoryPicker
                        selectedAccessory={avatar.accessory || null}
                        userLevel={userLevel}
                        onSelect={updateAccessory}
                    />
                );
            case 'backgrounds':
                return (
                    <BackgroundPicker
                        selectedBackground={avatar.background || null}
                        userLevel={userLevel}
                        onSelect={updateBackground}
                    />
                );
            case 'animations':
                return (
                    <AnimationPreview
                        selectedAnimation={avatar.animation || null}
                        userLevel={userLevel}
                        onSelect={updateAnimation}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="sticky top-0 z-20 glass-light backdrop-blur-xl border-b border-white/20 dark:border-white/5">
                <div className="flex items-center justify-between p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold">
                        {t('avatarStudio.title', 'Studio Avatar')}
                    </h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            {/* Preview Section (40%) */}
            <div className="relative py-8 px-6">
                {/* Background glow */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${avatar.color}40 0%, transparent 70%)`,
                    }}
                />

                <motion.div
                    className="relative flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <LiveAvatarPreview
                        avatar={avatar}
                        size="xl"
                        animate={true}
                    />

                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-sm text-muted-foreground">
                            Niveau {userLevel}
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-[73px] z-10 px-4 pb-4">
                <div className="flex gap-1.5 p-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 shadow-lg overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex-1 min-w-[60px] flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl text-xs font-medium',
                                    'transition-all duration-200',
                                    isActive
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                                )}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-base">{tab.emoji}</span>
                                <span className="hidden sm:block">
                                    {t(tab.labelKey, tab.id)}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 pb-32">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5 shadow-lg p-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderTabContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-safe bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900">
                <div className="max-w-lg mx-auto space-y-2">
                    <motion.button
                        onClick={handleSave}
                        disabled={isSaving || saveSuccess}
                        className={cn(
                            'w-full py-4 px-6 rounded-2xl font-bold text-lg',
                            'flex items-center justify-center gap-3',
                            'transition-all duration-300',
                            'shadow-xl',
                            saveSuccess
                                ? 'bg-green-500 text-white'
                                : 'gradient-primary text-white hover:shadow-2xl'
                        )}
                        whileHover={!isSaving && !saveSuccess ? { scale: 1.02 } : undefined}
                        whileTap={!isSaving && !saveSuccess ? { scale: 0.98 } : undefined}
                    >
                        {isSaving ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Sparkles className="h-5 w-5" />
                                </motion.div>
                                <span>Sauvegarde...</span>
                            </>
                        ) : saveSuccess ? (
                            <>
                                <Check className="h-5 w-5" />
                                <span>Sauvegardé ! +{AVATAR_STUDIO_CONFIG.saveXpReward} XP</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>💾 Sauvegarder</span>
                                <span className="text-white/80 text-sm">
                                    +{AVATAR_STUDIO_CONFIG.saveXpReward} XP
                                </span>
                            </>
                        )}
                    </motion.button>

                    <p className="text-xs text-center text-muted-foreground">
                        Visible par tes amis • {monthlyChangesLeft}/{AVATAR_STUDIO_CONFIG.maxMonthlyChanges} changements ce mois
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AvatarStudio;
