// Chibi Character Avatar System Constants
// Mini-character customization with gender, skin tones, outfits, and accessories

// ==================== GENDER OPTIONS ====================
export type CharacterGender = 'male' | 'female' | 'neutral';

export interface GenderOption {
    id: CharacterGender;
    labelKey: string;
    emoji: string;
}

export const CHARACTER_GENDERS: GenderOption[] = [
    { id: 'male', labelKey: 'avatar.gender.male', emoji: '👨' },
    { id: 'female', labelKey: 'avatar.gender.female', emoji: '👩' },
    { id: 'neutral', labelKey: 'avatar.gender.neutral', emoji: '🧑' },
];

// ==================== SKIN TONES ====================
export interface SkinTone {
    id: string;
    name: string;
    color: string;
    highlight: string;
    shadow: string;
}

export const SKIN_TONES: SkinTone[] = [
    { id: 'tone1', name: 'Porcelain', color: '#FFECD2', highlight: '#FFF5E6', shadow: '#E8D4BD' },
    { id: 'tone2', name: 'Ivory', color: '#FFE0BD', highlight: '#FFEDDA', shadow: '#E8C9A6' },
    { id: 'tone3', name: 'Sand', color: '#F1C27D', highlight: '#FFD89E', shadow: '#D9AA66' },
    { id: 'tone4', name: 'Caramel', color: '#E0A458', highlight: '#F0B76E', shadow: '#C88D42' },
    { id: 'tone5', name: 'Honey', color: '#C68642', highlight: '#D99A56', shadow: '#AD712E' },
    { id: 'tone6', name: 'Bronze', color: '#8D5524', highlight: '#A0673A', shadow: '#754312' },
    { id: 'tone7', name: 'Espresso', color: '#5C3317', highlight: '#6F4428', shadow: '#4A2610' },
    { id: 'tone8', name: 'Ebony', color: '#3B2219', highlight: '#4D3328', shadow: '#2A150F' },
];

// ==================== OUTFITS ====================
export type OutfitCategory = 'casual' | 'adventure' | 'formal' | 'beach' | 'winter';

export interface Outfit {
    id: string;
    name: string;
    labelKey: string;
    category: OutfitCategory;
    levelRequired: number;
    emoji: string;
    colors: {
        primary: string;
        secondary: string;
        accent?: string;
    };
}

export const CHARACTER_OUTFITS: Outfit[] = [
    // Casual - Unlocked early
    {
        id: 'tshirt_jeans',
        name: 'T-Shirt & Jeans',
        labelKey: 'outfit.tshirt_jeans',
        category: 'casual',
        levelRequired: 1,
        emoji: '👕',
        colors: { primary: '#3B82F6', secondary: '#1E3A5F' }
    },
    {
        id: 'hoodie',
        name: 'Hoodie Voyageur',
        labelKey: 'outfit.hoodie',
        category: 'casual',
        levelRequired: 3,
        emoji: '🧥',
        colors: { primary: '#6B7280', secondary: '#374151' }
    },
    {
        id: 'city_trip',
        name: 'City Trip',
        labelKey: 'outfit.city_trip',
        category: 'casual',
        levelRequired: 5,
        emoji: '🏙️',
        colors: { primary: '#1F2937', secondary: '#F3F4F6', accent: '#EF4444' }
    },

    // Adventure - Mid level
    {
        id: 'backpacker',
        name: 'Backpacker',
        labelKey: 'outfit.backpacker',
        category: 'adventure',
        levelRequired: 8,
        emoji: '🎒',
        colors: { primary: '#059669', secondary: '#D1FAE5' }
    },
    {
        id: 'hiking',
        name: 'Randonnée',
        labelKey: 'outfit.hiking',
        category: 'adventure',
        levelRequired: 12,
        emoji: '🥾',
        colors: { primary: '#78350F', secondary: '#FDE68A', accent: '#16A34A' }
    },
    {
        id: 'safari',
        name: 'Safari',
        labelKey: 'outfit.safari',
        category: 'adventure',
        levelRequired: 18,
        emoji: '🦁',
        colors: { primary: '#A16207', secondary: '#FEF3C7' }
    },
    {
        id: 'explorer',
        name: 'Explorateur',
        labelKey: 'outfit.explorer',
        category: 'adventure',
        levelRequired: 25,
        emoji: '🧭',
        colors: { primary: '#713F12', secondary: '#D4A574', accent: '#14532D' }
    },

    // Beach
    {
        id: 'beach',
        name: 'Plage',
        labelKey: 'outfit.beach',
        category: 'beach',
        levelRequired: 10,
        emoji: '🏖️',
        colors: { primary: '#06B6D4', secondary: '#FBBF24' }
    },
    {
        id: 'tropical',
        name: 'Tropical',
        labelKey: 'outfit.tropical',
        category: 'beach',
        levelRequired: 20,
        emoji: '🌴',
        colors: { primary: '#EC4899', secondary: '#34D399', accent: '#FBBF24' }
    },

    // Formal
    {
        id: 'business',
        name: 'Business Trip',
        labelKey: 'outfit.business',
        category: 'formal',
        levelRequired: 15,
        emoji: '💼',
        colors: { primary: '#1E293B', secondary: '#F8FAFC', accent: '#DC2626' }
    },
    {
        id: 'elegant',
        name: 'Élégant',
        labelKey: 'outfit.elegant',
        category: 'formal',
        levelRequired: 30,
        emoji: '✨',
        colors: { primary: '#0F172A', secondary: '#C9A227' }
    },

    // Winter
    {
        id: 'winter',
        name: 'Hiver',
        labelKey: 'outfit.winter',
        category: 'winter',
        levelRequired: 22,
        emoji: '❄️',
        colors: { primary: '#DC2626', secondary: '#FAFAFA', accent: '#16A34A' }
    },
];

// ==================== ACCESSORIES ====================
export type AccessoryCategory = 'bags' | 'headwear' | 'eyewear' | 'tech' | 'other';
export type AccessorySlot = 'head' | 'eyes' | 'hand' | 'back' | 'neck';

export interface Accessory {
    id: string;
    name: string;
    labelKey: string;
    category: AccessoryCategory;
    slot: AccessorySlot;
    levelRequired: number;
    emoji: string;
}

export const CHARACTER_ACCESSORIES: Accessory[] = [
    // Bags
    { id: 'backpack_small', name: 'Petit sac', labelKey: 'accessory.backpack_small', category: 'bags', slot: 'back', levelRequired: 1, emoji: '🎒' },
    { id: 'backpack_large', name: 'Grand sac', labelKey: 'accessory.backpack_large', category: 'bags', slot: 'back', levelRequired: 8, emoji: '🎒' },
    { id: 'suitcase', name: 'Valise', labelKey: 'accessory.suitcase', category: 'bags', slot: 'hand', levelRequired: 5, emoji: '🧳' },
    { id: 'duffel', name: 'Sac de voyage', labelKey: 'accessory.duffel', category: 'bags', slot: 'hand', levelRequired: 12, emoji: '👝' },
    { id: 'messenger', name: 'Sacoche', labelKey: 'accessory.messenger', category: 'bags', slot: 'back', levelRequired: 10, emoji: '👜' },

    // Headwear
    { id: 'cap', name: 'Casquette', labelKey: 'accessory.cap', category: 'headwear', slot: 'head', levelRequired: 2, emoji: '🧢' },
    { id: 'sun_hat', name: 'Chapeau de soleil', labelKey: 'accessory.sun_hat', category: 'headwear', slot: 'head', levelRequired: 6, emoji: '👒' },
    { id: 'beanie', name: 'Bonnet', labelKey: 'accessory.beanie', category: 'headwear', slot: 'head', levelRequired: 4, emoji: '🧶' },
    { id: 'cowboy', name: 'Chapeau cowboy', labelKey: 'accessory.cowboy', category: 'headwear', slot: 'head', levelRequired: 15, emoji: '🤠' },
    { id: 'fedora', name: 'Fedora', labelKey: 'accessory.fedora', category: 'headwear', slot: 'head', levelRequired: 20, emoji: '🎩' },
    { id: 'helmet', name: 'Casque', labelKey: 'accessory.helmet', category: 'headwear', slot: 'head', levelRequired: 25, emoji: '⛑️' },

    // Eyewear
    { id: 'sunglasses', name: 'Lunettes de soleil', labelKey: 'accessory.sunglasses', category: 'eyewear', slot: 'eyes', levelRequired: 3, emoji: '🕶️' },
    { id: 'aviator', name: 'Aviateur', labelKey: 'accessory.aviator', category: 'eyewear', slot: 'eyes', levelRequired: 12, emoji: '🥽' },
    { id: 'glasses', name: 'Lunettes', labelKey: 'accessory.glasses', category: 'eyewear', slot: 'eyes', levelRequired: 1, emoji: '👓' },

    // Tech
    { id: 'camera', name: 'Appareil photo', labelKey: 'accessory.camera', category: 'tech', slot: 'neck', levelRequired: 7, emoji: '📷' },
    { id: 'camera_pro', name: 'Reflex pro', labelKey: 'accessory.camera_pro', category: 'tech', slot: 'neck', levelRequired: 22, emoji: '📸' },
    { id: 'headphones', name: 'Casque audio', labelKey: 'accessory.headphones', category: 'tech', slot: 'head', levelRequired: 9, emoji: '🎧' },
    { id: 'phone', name: 'Smartphone', labelKey: 'accessory.phone', category: 'tech', slot: 'hand', levelRequired: 1, emoji: '📱' },

    // Other
    { id: 'map', name: 'Carte', labelKey: 'accessory.map', category: 'other', slot: 'hand', levelRequired: 4, emoji: '🗺️' },
    { id: 'compass', name: 'Boussole', labelKey: 'accessory.compass', category: 'other', slot: 'hand', levelRequired: 11, emoji: '🧭' },
    { id: 'binoculars', name: 'Jumelles', labelKey: 'accessory.binoculars', category: 'other', slot: 'neck', levelRequired: 14, emoji: '🔭' },
    { id: 'passport', name: 'Passeport', labelKey: 'accessory.passport', category: 'other', slot: 'hand', levelRequired: 5, emoji: '🛂' },
    { id: 'coffee', name: 'Café', labelKey: 'accessory.coffee', category: 'other', slot: 'hand', levelRequired: 2, emoji: '☕' },
    { id: 'flag', name: 'Drapeau', labelKey: 'accessory.flag', category: 'other', slot: 'hand', levelRequired: 30, emoji: '🚩' },
];

// ==================== HELPER FUNCTIONS ====================
export function getUnlockedOutfits(level: number): Outfit[] {
    return CHARACTER_OUTFITS.filter(o => o.levelRequired <= level);
}

export function getUnlockedAccessories(level: number): Accessory[] {
    return CHARACTER_ACCESSORIES.filter(a => a.levelRequired <= level);
}

export function getAccessoriesByCategory(category: AccessoryCategory): Accessory[] {
    return CHARACTER_ACCESSORIES.filter(a => a.category === category);
}

export function getOutfitsByCategory(category: OutfitCategory): Outfit[] {
    return CHARACTER_OUTFITS.filter(o => o.category === category);
}

// ==================== DEFAULT CHARACTER ====================
export interface CharacterConfig {
    gender: CharacterGender;
    skinTone: string;
    outfit: string;
    accessories: string[];
}

export const DEFAULT_CHARACTER: CharacterConfig = {
    gender: 'neutral',
    skinTone: 'tone3',
    outfit: 'tshirt_jeans',
    accessories: [],
};
