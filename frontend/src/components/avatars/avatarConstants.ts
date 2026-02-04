/**
 * Avatar System Constants
 * WantToGo 2.0 - 2026 Premium Design
 * Extended with 80+ customization options
 */

// =============================================================================
// AVATAR BASE STYLES (15 options with progressive level unlock)
// =============================================================================

export interface AvatarBase {
    id: string;
    emoji: string;
    nameKey: string;
    levelRequired: number;
}

export const AVATAR_BASES: AvatarBase[] = [
    { id: 'voyageur', emoji: '🧳', nameKey: 'avatarBases.voyageur', levelRequired: 1 },
    { id: 'aventurier', emoji: '🗺️', nameKey: 'avatarBases.aventurier', levelRequired: 3 },
    { id: 'globe_trotteur', emoji: '✈️', nameKey: 'avatarBases.globeTrotteur', levelRequired: 5 },
    { id: 'explorateur', emoji: '🧭', nameKey: 'avatarBases.explorateur', levelRequired: 7 },
    { id: 'local', emoji: '🌍', nameKey: 'avatarBases.local', levelRequired: 10 },
    { id: 'foodie', emoji: '🍴', nameKey: 'avatarBases.foodie', levelRequired: 12 },
    { id: 'photographe', emoji: '📸', nameKey: 'avatarBases.photographe', levelRequired: 15 },
    { id: 'luxe', emoji: '💎', nameKey: 'avatarBases.luxe', levelRequired: 18 },
    { id: 'backpacker', emoji: '🎒', nameKey: 'avatarBases.backpacker', levelRequired: 20 },
    { id: 'city_hopper', emoji: '🏙️', nameKey: 'avatarBases.cityHopper', levelRequired: 25 },
    { id: 'nature_lover', emoji: '🌲', nameKey: 'avatarBases.natureLover', levelRequired: 30 },
    { id: 'night_owl', emoji: '🌙', nameKey: 'avatarBases.nightOwl', levelRequired: 35 },
    { id: 'legende', emoji: '🔥', nameKey: 'avatarBases.legende', levelRequired: 40 },
    { id: 'master', emoji: '⚡', nameKey: 'avatarBases.master', levelRequired: 50 },
    { id: 'hall_of_fame', emoji: '🌟', nameKey: 'avatarBases.hallOfFame', levelRequired: 75 },
];

// =============================================================================
// AVATAR COLORS (24 gradient presets + custom hex support)
// =============================================================================

export interface AvatarColor {
    id: string;
    hex: string;
    name: string;
}

export const AVATAR_COLORS: AvatarColor[] = [
    // Primary palette
    { id: 'blue', hex: '#3B82F6', name: 'Blue' },
    { id: 'purple', hex: '#8B5CF6', name: 'Purple' },
    { id: 'pink', hex: '#EC4899', name: 'Pink' },
    { id: 'red', hex: '#EF4444', name: 'Red' },
    { id: 'orange', hex: '#F97316', name: 'Orange' },
    { id: 'amber', hex: '#F59E0B', name: 'Amber' },
    { id: 'emerald', hex: '#10B981', name: 'Emerald' },
    { id: 'cyan', hex: '#06B6D4', name: 'Cyan' },
    { id: 'indigo', hex: '#6366F1', name: 'Indigo' },
    { id: 'lime', hex: '#84CC16', name: 'Lime' },
    { id: 'teal', hex: '#14B8A6', name: 'Teal' },
    { id: 'slate', hex: '#1F2937', name: 'Slate' },
    // Extended palette
    { id: 'rose', hex: '#F43F5E', name: 'Rose' },
    { id: 'fuchsia', hex: '#D946EF', name: 'Fuchsia' },
    { id: 'violet', hex: '#7C3AED', name: 'Violet' },
    { id: 'sky', hex: '#0EA5E9', name: 'Sky' },
    { id: 'green', hex: '#22C55E', name: 'Green' },
    { id: 'yellow', hex: '#EAB308', name: 'Yellow' },
    { id: 'stone', hex: '#78716C', name: 'Stone' },
    { id: 'zinc', hex: '#71717A', name: 'Zinc' },
    { id: 'coral', hex: '#FF6B6B', name: 'Coral' },
    { id: 'mint', hex: '#4ECDC4', name: 'Mint' },
    { id: 'lavender', hex: '#A78BFA', name: 'Lavender' },
    { id: 'gold', hex: '#FFD700', name: 'Gold' },
];

// Gradient presets (duotone combinations)
export interface AvatarGradient {
    id: string;
    from: string;
    to: string;
    name: string;
    levelRequired: number;
}

export const AVATAR_GRADIENTS: AvatarGradient[] = [
    { id: 'ocean', from: '#3B82F6', to: '#06B6D4', name: 'Ocean', levelRequired: 1 },
    { id: 'sunset', from: '#F97316', to: '#EC4899', name: 'Sunset', levelRequired: 1 },
    { id: 'forest', from: '#10B981', to: '#84CC16', name: 'Forest', levelRequired: 1 },
    { id: 'aurora', from: '#8B5CF6', to: '#06B6D4', name: 'Aurora', levelRequired: 3 },
    { id: 'fire', from: '#EF4444', to: '#F97316', name: 'Fire', levelRequired: 3 },
    { id: 'royal', from: '#6366F1', to: '#8B5CF6', name: 'Royal', levelRequired: 5 },
    { id: 'candy', from: '#EC4899', to: '#F43F5E', name: 'Candy', levelRequired: 5 },
    { id: 'midnight', from: '#1F2937', to: '#6366F1', name: 'Midnight', levelRequired: 7 },
    { id: 'tropical', from: '#14B8A6', to: '#22C55E', name: 'Tropical', levelRequired: 7 },
    { id: 'neon', from: '#D946EF', to: '#0EA5E9', name: 'Neon', levelRequired: 10 },
    { id: 'golden', from: '#F59E0B', to: '#FFD700', name: 'Golden', levelRequired: 10 },
    { id: 'arctic', from: '#0EA5E9', to: '#E0F2FE', name: 'Arctic', levelRequired: 12 },
    { id: 'magma', from: '#EF4444', to: '#7C3AED', name: 'Magma', levelRequired: 12 },
    { id: 'emerald_city', from: '#10B981', to: '#14B8A6', name: 'Emerald City', levelRequired: 15 },
    { id: 'cosmic', from: '#7C3AED', to: '#EC4899', name: 'Cosmic', levelRequired: 15 },
    { id: 'citrus', from: '#EAB308', to: '#84CC16', name: 'Citrus', levelRequired: 18 },
    { id: 'blush', from: '#FCA5A5', to: '#FBBF24', name: 'Blush', levelRequired: 18 },
    { id: 'galaxy', from: '#1F2937', to: '#8B5CF6', name: 'Galaxy', levelRequired: 20 },
    { id: 'rainbow', from: '#EF4444', to: '#8B5CF6', name: 'Rainbow', levelRequired: 25 },
    { id: 'holographic', from: '#06B6D4', to: '#D946EF', name: 'Holographic', levelRequired: 30 },
    { id: 'platinum', from: '#71717A', to: '#E5E7EB', name: 'Platinum', levelRequired: 35 },
    { id: 'obsidian', from: '#000000', to: '#374151', name: 'Obsidian', levelRequired: 40 },
    { id: 'celestial', from: '#FFD700', to: '#8B5CF6', name: 'Celestial', levelRequired: 50 },
    { id: 'legend', from: '#FFD700', to: '#EF4444', name: 'Legend', levelRequired: 75 },
];

// =============================================================================
// ACCESSORIES (35 items with level unlock)
// =============================================================================

export interface AvatarAccessory {
    id: string;
    emoji: string;
    nameKey: string;
    category: 'glasses' | 'hats' | 'bags' | 'pets' | 'other';
    levelRequired: number;
}

export const AVATAR_ACCESSORIES: AvatarAccessory[] = [
    // Glasses (5)
    { id: 'lunettes', emoji: '👓', nameKey: 'accessories.lunettes', category: 'glasses', levelRequired: 5 },
    { id: 'sunglasses', emoji: '🕶️', nameKey: 'accessories.sunglasses', category: 'glasses', levelRequired: 7 },
    { id: 'monocle', emoji: '🧐', nameKey: 'accessories.monocle', category: 'glasses', levelRequired: 15 },
    { id: 'ski_goggles', emoji: '🥽', nameKey: 'accessories.skiGoggles', category: 'glasses', levelRequired: 20 },
    { id: 'vr_headset', emoji: '🥽', nameKey: 'accessories.vrHeadset', category: 'glasses', levelRequired: 35 },

    // Hats (10)
    { id: 'chapeau', emoji: '🎩', nameKey: 'accessories.chapeau', category: 'hats', levelRequired: 5 },
    { id: 'casquette', emoji: '🧢', nameKey: 'accessories.casquette', category: 'hats', levelRequired: 5 },
    { id: 'cowboy', emoji: '🤠', nameKey: 'accessories.cowboy', category: 'hats', levelRequired: 10 },
    { id: 'beret', emoji: '🎨', nameKey: 'accessories.beret', category: 'hats', levelRequired: 12 },
    { id: 'crown', emoji: '👑', nameKey: 'accessories.crown', category: 'hats', levelRequired: 25 },
    { id: 'wizard', emoji: '🧙', nameKey: 'accessories.wizard', category: 'hats', levelRequired: 30 },
    { id: 'party_hat', emoji: '🎉', nameKey: 'accessories.partyHat', category: 'hats', levelRequired: 15 },
    { id: 'santa', emoji: '🎅', nameKey: 'accessories.santa', category: 'hats', levelRequired: 20 },
    { id: 'helmet', emoji: '⛑️', nameKey: 'accessories.helmet', category: 'hats', levelRequired: 18 },
    { id: 'graduation', emoji: '🎓', nameKey: 'accessories.graduation', category: 'hats', levelRequired: 50 },

    // Bags (8)
    { id: 'sac', emoji: '🎒', nameKey: 'accessories.sac', category: 'bags', levelRequired: 3 },
    { id: 'camera', emoji: '📷', nameKey: 'accessories.camera', category: 'bags', levelRequired: 7 },
    { id: 'headphones', emoji: '🎧', nameKey: 'accessories.headphones', category: 'bags', levelRequired: 10 },
    { id: 'briefcase', emoji: '💼', nameKey: 'accessories.briefcase', category: 'bags', levelRequired: 12 },
    { id: 'handbag', emoji: '👜', nameKey: 'accessories.handbag', category: 'bags', levelRequired: 15 },
    { id: 'luggage', emoji: '🧳', nameKey: 'accessories.luggage', category: 'bags', levelRequired: 18 },
    { id: 'shopping', emoji: '🛍️', nameKey: 'accessories.shopping', category: 'bags', levelRequired: 20 },
    { id: 'guitar', emoji: '🎸', nameKey: 'accessories.guitar', category: 'bags', levelRequired: 25 },

    // Pets/Mascots (8)
    { id: 'dog', emoji: '🐕', nameKey: 'accessories.dog', category: 'pets', levelRequired: 10 },
    { id: 'cat', emoji: '🐈', nameKey: 'accessories.cat', category: 'pets', levelRequired: 10 },
    { id: 'parrot', emoji: '🦜', nameKey: 'accessories.parrot', category: 'pets', levelRequired: 15 },
    { id: 'dragon', emoji: '🐉', nameKey: 'accessories.dragon', category: 'pets', levelRequired: 40 },
    { id: 'unicorn', emoji: '🦄', nameKey: 'accessories.unicorn', category: 'pets', levelRequired: 50 },
    { id: 'butterfly', emoji: '🦋', nameKey: 'accessories.butterfly', category: 'pets', levelRequired: 12 },
    { id: 'fish', emoji: '🐠', nameKey: 'accessories.fish', category: 'pets', levelRequired: 8 },
    { id: 'owl', emoji: '🦉', nameKey: 'accessories.owl', category: 'pets', levelRequired: 20 },

    // Other (4)
    { id: 'star', emoji: '⭐', nameKey: 'accessories.star', category: 'other', levelRequired: 5 },
    { id: 'heart', emoji: '❤️', nameKey: 'accessories.heart', category: 'other', levelRequired: 7 },
    { id: 'fire', emoji: '🔥', nameKey: 'accessories.fire', category: 'other', levelRequired: 30 },
    { id: 'diamond', emoji: '💎', nameKey: 'accessories.diamond', category: 'other', levelRequired: 75 },
];

// =============================================================================
// BACKGROUNDS (25 iconic locations & themes)
// =============================================================================

export interface AvatarBackground {
    id: string;
    nameKey: string;
    gradient: string;
    category: 'cities' | 'nature' | 'landmarks' | 'abstract';
    levelRequired: number;
}

export const AVATAR_BACKGROUNDS: AvatarBackground[] = [
    // Cities (8)
    { id: 'paris', nameKey: 'backgrounds.paris', gradient: 'from-blue-400 to-purple-500', category: 'cities', levelRequired: 10 },
    { id: 'tokyo', nameKey: 'backgrounds.tokyo', gradient: 'from-pink-400 to-red-500', category: 'cities', levelRequired: 10 },
    { id: 'nyc', nameKey: 'backgrounds.nyc', gradient: 'from-amber-400 to-orange-500', category: 'cities', levelRequired: 12 },
    { id: 'london', nameKey: 'backgrounds.london', gradient: 'from-slate-400 to-gray-600', category: 'cities', levelRequired: 12 },
    { id: 'dubai', nameKey: 'backgrounds.dubai', gradient: 'from-yellow-400 to-amber-500', category: 'cities', levelRequired: 15 },
    { id: 'sydney', nameKey: 'backgrounds.sydney', gradient: 'from-cyan-400 to-blue-500', category: 'cities', levelRequired: 15 },
    { id: 'rio', nameKey: 'backgrounds.rio', gradient: 'from-green-400 to-yellow-400', category: 'cities', levelRequired: 18 },
    { id: 'singapore', nameKey: 'backgrounds.singapore', gradient: 'from-red-400 to-pink-500', category: 'cities', levelRequired: 20 },

    // Nature (8)
    { id: 'beach', nameKey: 'backgrounds.beach', gradient: 'from-cyan-400 to-blue-500', category: 'nature', levelRequired: 8 },
    { id: 'mountain', nameKey: 'backgrounds.mountain', gradient: 'from-emerald-400 to-teal-600', category: 'nature', levelRequired: 10 },
    { id: 'sunset', nameKey: 'backgrounds.sunset', gradient: 'from-orange-400 to-pink-500', category: 'nature', levelRequired: 12 },
    { id: 'aurora', nameKey: 'backgrounds.aurora', gradient: 'from-green-400 to-purple-600', category: 'nature', levelRequired: 20 },
    { id: 'desert', nameKey: 'backgrounds.desert', gradient: 'from-amber-300 to-orange-500', category: 'nature', levelRequired: 15 },
    { id: 'forest', nameKey: 'backgrounds.forest', gradient: 'from-green-500 to-emerald-700', category: 'nature', levelRequired: 12 },
    { id: 'ocean', nameKey: 'backgrounds.ocean', gradient: 'from-blue-500 to-indigo-700', category: 'nature', levelRequired: 18 },
    { id: 'volcano', nameKey: 'backgrounds.volcano', gradient: 'from-red-600 to-orange-500', category: 'nature', levelRequired: 35 },

    // Landmarks (5)
    { id: 'eiffel', nameKey: 'backgrounds.eiffel', gradient: 'from-blue-300 to-indigo-400', category: 'landmarks', levelRequired: 15 },
    { id: 'colosseum', nameKey: 'backgrounds.colosseum', gradient: 'from-amber-300 to-stone-500', category: 'landmarks', levelRequired: 18 },
    { id: 'pyramids', nameKey: 'backgrounds.pyramids', gradient: 'from-yellow-300 to-amber-600', category: 'landmarks', levelRequired: 20 },
    { id: 'taj_mahal', nameKey: 'backgrounds.tajMahal', gradient: 'from-white to-pink-200', category: 'landmarks', levelRequired: 25 },
    { id: 'great_wall', nameKey: 'backgrounds.greatWall', gradient: 'from-stone-400 to-green-600', category: 'landmarks', levelRequired: 30 },

    // Abstract (4)
    { id: 'galaxy', nameKey: 'backgrounds.galaxy', gradient: 'from-purple-600 to-indigo-900', category: 'abstract', levelRequired: 25 },
    { id: 'neon', nameKey: 'backgrounds.neon', gradient: 'from-fuchsia-500 to-cyan-400', category: 'abstract', levelRequired: 30 },
    { id: 'gold_luxury', nameKey: 'backgrounds.goldLuxury', gradient: 'from-yellow-400 to-amber-600', category: 'abstract', levelRequired: 40 },
    { id: 'holographic', nameKey: 'backgrounds.holographic', gradient: 'from-pink-300 via-purple-300 to-cyan-300', category: 'abstract', levelRequired: 50 },
];

// =============================================================================
// ANIMATIONS (12 motion presets)
// =============================================================================

export interface AvatarAnimation {
    id: string;
    nameKey: string;
    levelRequired: number;
}

export const AVATAR_ANIMATIONS: AvatarAnimation[] = [
    { id: 'none', nameKey: 'animations.none', levelRequired: 1 },
    { id: 'pulse', nameKey: 'animations.pulse', levelRequired: 5 },
    { id: 'bounce', nameKey: 'animations.bounce', levelRequired: 10 },
    { id: 'spin', nameKey: 'animations.spin', levelRequired: 15 },
    { id: 'wiggle', nameKey: 'animations.wiggle', levelRequired: 20 },
    { id: 'float', nameKey: 'animations.float', levelRequired: 25 },
    { id: 'wave', nameKey: 'animations.wave', levelRequired: 30 },
    { id: 'glow', nameKey: 'animations.glow', levelRequired: 35 },
    { id: 'sparkle', nameKey: 'animations.sparkle', levelRequired: 40 },
    { id: 'rainbow', nameKey: 'animations.rainbow', levelRequired: 50 },
    { id: 'fire', nameKey: 'animations.fire', levelRequired: 60 },
    { id: 'legendary', nameKey: 'animations.legendary', levelRequired: 75 },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getAvatarBase(id: string): AvatarBase | undefined {
    return AVATAR_BASES.find(base => base.id === id);
}

export function getAvatarColor(hex: string): AvatarColor | undefined {
    return AVATAR_COLORS.find(color => color.hex === hex);
}

export function getAvatarGradient(id: string): AvatarGradient | undefined {
    return AVATAR_GRADIENTS.find(gradient => gradient.id === id);
}

export function getAvatarAccessory(id: string): AvatarAccessory | undefined {
    return AVATAR_ACCESSORIES.find(acc => acc.id === id);
}

export function getAvatarBackground(id: string): AvatarBackground | undefined {
    return AVATAR_BACKGROUNDS.find(bg => bg.id === id);
}

export function getAvatarAnimation(id: string): AvatarAnimation | undefined {
    return AVATAR_ANIMATIONS.find(anim => anim.id === id);
}

export function isAvatarBaseUnlocked(baseId: string, userLevel: number): boolean {
    const base = getAvatarBase(baseId);
    return base ? userLevel >= base.levelRequired : false;
}

export function getUnlockedBases(userLevel: number): AvatarBase[] {
    return AVATAR_BASES.filter(base => userLevel >= base.levelRequired);
}

export function getUnlockedGradients(userLevel: number): AvatarGradient[] {
    return AVATAR_GRADIENTS.filter(g => userLevel >= g.levelRequired);
}

export function getUnlockedAccessories(userLevel: number): AvatarAccessory[] {
    return AVATAR_ACCESSORIES.filter(acc => userLevel >= acc.levelRequired);
}

export function getUnlockedBackgrounds(userLevel: number): AvatarBackground[] {
    return AVATAR_BACKGROUNDS.filter(bg => userLevel >= bg.levelRequired);
}

export function getUnlockedAnimations(userLevel: number): AvatarAnimation[] {
    return AVATAR_ANIMATIONS.filter(anim => userLevel >= anim.levelRequired);
}

// Filter accessories by category
export function getAccessoriesByCategory(category: AvatarAccessory['category']): AvatarAccessory[] {
    return AVATAR_ACCESSORIES.filter(acc => acc.category === category);
}

// Filter backgrounds by category
export function getBackgroundsByCategory(category: AvatarBackground['category']): AvatarBackground[] {
    return AVATAR_BACKGROUNDS.filter(bg => bg.category === category);
}

// =============================================================================
// DATA STRUCTURES
// =============================================================================

export interface AvatarData {
    base: string;
    color: string;
    secondaryColor?: string | null;
    customHex?: string | null;
    accessory?: string | null;
    background?: string | null;
    animation?: string | null;
}

export const DEFAULT_AVATAR: AvatarData = {
    base: 'voyageur',
    color: '#3B82F6',
    secondaryColor: null,
    customHex: null,
    accessory: null,
    background: null,
    animation: 'none',
};

// Avatar Studio configuration
export const AVATAR_STUDIO_CONFIG = {
    maxMonthlyChanges: 5,
    saveXpReward: 100,
    friendCopyXpReward: 50,
};
