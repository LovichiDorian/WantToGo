import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    SKIN_TONES,
    CHARACTER_OUTFITS,
    CHARACTER_ACCESSORIES,
    type CharacterGender,
    type CharacterConfig
} from './characterConstants';

interface ChibiCharacterProps {
    config: CharacterConfig;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    animated?: boolean;
    className?: string;
}

// Get dimensions based on size
const SIZES = {
    sm: { width: 48, height: 64 },
    md: { width: 80, height: 106 },
    lg: { width: 120, height: 160 },
    xl: { width: 180, height: 240 },
};

/**
 * ChibiCharacter - SVG-based mini-character renderer
 * Renders layered SVG with body, skin, outfit, and accessories
 */
export function ChibiCharacter({
    config,
    size = 'md',
    animated = true,
    className
}: ChibiCharacterProps) {
    const { width, height } = SIZES[size];
    const skinTone = SKIN_TONES.find(s => s.id === config.skinTone) || SKIN_TONES[2];
    const outfit = CHARACTER_OUTFITS.find(o => o.id === config.outfit) || CHARACTER_OUTFITS[0];
    const accessories = config.accessories
        .map(id => CHARACTER_ACCESSORIES.find(a => a.id === id))
        .filter(Boolean);

    // Body shape adjustments based on gender
    const bodyShape = getBodyShape(config.gender);

    return (
        <motion.div
            className={cn('relative inline-flex items-center justify-center', className)}
            style={{ width, height }}
            initial={animated ? { y: 0 } : undefined}
            animate={animated ? {
                y: [0, -3, 0],
            } : undefined}
            transition={animated ? {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
            } : undefined}
        >
            <svg
                viewBox="0 0 100 133"
                width={width}
                height={height}
                className="overflow-visible"
            >
                {/* Shadow */}
                <ellipse
                    cx="50"
                    cy="128"
                    rx="25"
                    ry="5"
                    fill="rgba(0,0,0,0.15)"
                />

                {/* Legs */}
                <g className="legs">
                    <rect x="35" y="95" width="12" height="25" rx="6" fill={outfit.colors.secondary} />
                    <rect x="53" y="95" width="12" height="25" rx="6" fill={outfit.colors.secondary} />
                    {/* Shoes */}
                    <ellipse cx="41" cy="120" rx="8" ry="4" fill="#1F2937" />
                    <ellipse cx="59" cy="120" rx="8" ry="4" fill="#1F2937" />
                </g>

                {/* Body/Torso */}
                <g className="body">
                    <path
                        d={bodyShape.torso}
                        fill={outfit.colors.primary}
                    />
                    {/* Outfit detail */}
                    {outfit.colors.accent && (
                        <rect
                            x="42" y="60"
                            width="16" height="4"
                            rx="2"
                            fill={outfit.colors.accent}
                        />
                    )}
                </g>

                {/* Arms */}
                <g className="arms">
                    <path
                        d={bodyShape.leftArm}
                        fill={skinTone.color}
                        stroke={skinTone.shadow}
                        strokeWidth="1"
                    />
                    <path
                        d={bodyShape.rightArm}
                        fill={skinTone.color}
                        stroke={skinTone.shadow}
                        strokeWidth="1"
                    />
                    {/* Sleeves */}
                    <rect x="18" y="55" width="10" height="15" rx="5" fill={outfit.colors.primary} />
                    <rect x="72" y="55" width="10" height="15" rx="5" fill={outfit.colors.primary} />
                </g>

                {/* Head */}
                <g className="head">
                    {/* Hair back */}
                    <ellipse
                        cx="50" cy="28"
                        rx="28" ry="26"
                        fill="#4B3621"
                    />
                    {/* Face */}
                    <ellipse
                        cx="50" cy="30"
                        rx="24" ry="23"
                        fill={skinTone.color}
                    />
                    {/* Face highlight */}
                    <ellipse
                        cx="45" cy="25"
                        rx="8" ry="6"
                        fill={skinTone.highlight}
                        opacity="0.4"
                    />

                    {/* Eyes */}
                    <g className="eyes">
                        <ellipse cx="40" cy="32" rx="4" ry="5" fill="white" />
                        <ellipse cx="60" cy="32" rx="4" ry="5" fill="white" />
                        <circle cx="41" cy="33" r="2.5" fill="#1F2937" />
                        <circle cx="61" cy="33" r="2.5" fill="#1F2937" />
                        {/* Eye highlights */}
                        <circle cx="42" cy="32" r="1" fill="white" />
                        <circle cx="62" cy="32" r="1" fill="white" />
                    </g>

                    {/* Eyebrows */}
                    <path d="M36 26 Q40 24, 44 26" stroke="#4B3621" strokeWidth="1.5" fill="none" />
                    <path d="M56 26 Q60 24, 64 26" stroke="#4B3621" strokeWidth="1.5" fill="none" />

                    {/* Nose */}
                    <ellipse cx="50" cy="38" rx="2" ry="1.5" fill={skinTone.shadow} opacity="0.3" />

                    {/* Mouth - slight smile */}
                    <path
                        d="M45 44 Q50 48, 55 44"
                        stroke="#DB7093"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Blush */}
                    <ellipse cx="34" cy="38" rx="4" ry="2" fill="#FFB6C1" opacity="0.4" />
                    <ellipse cx="66" cy="38" rx="4" ry="2" fill="#FFB6C1" opacity="0.4" />

                    {/* Hair front based on gender */}
                    <path
                        d={getHairStyle(config.gender)}
                        fill="#4B3621"
                    />
                </g>

                {/* Accessories Layer */}
                {accessories.map((accessory, index) => (
                    <g key={accessory!.id} className={`accessory-${accessory!.slot}`}>
                        {renderAccessory(accessory!, index)}
                    </g>
                ))}
            </svg>
        </motion.div>
    );
}

// Body shape definitions based on gender
function getBodyShape(gender: CharacterGender) {
    switch (gender) {
        case 'male':
            return {
                torso: 'M30 55 Q30 95, 35 95 L65 95 Q70 95, 70 55 Q70 50, 50 50 Q30 50, 30 55 Z',
                leftArm: 'M20 55 Q15 65, 18 75 Q20 80, 25 78 Q28 75, 28 65 Q28 55, 25 55 Z',
                rightArm: 'M80 55 Q85 65, 82 75 Q80 80, 75 78 Q72 75, 72 65 Q72 55, 75 55 Z',
            };
        case 'female':
            return {
                torso: 'M32 55 Q28 75, 33 95 L67 95 Q72 75, 68 55 Q68 50, 50 48 Q32 50, 32 55 Z',
                leftArm: 'M22 55 Q17 63, 19 72 Q21 77, 25 75 Q27 72, 27 63 Q27 55, 24 55 Z',
                rightArm: 'M78 55 Q83 63, 81 72 Q79 77, 75 75 Q73 72, 73 63 Q73 55, 76 55 Z',
            };
        default: // neutral
            return {
                torso: 'M31 55 Q29 85, 34 95 L66 95 Q71 85, 69 55 Q69 50, 50 49 Q31 50, 31 55 Z',
                leftArm: 'M21 55 Q16 64, 18 73 Q20 78, 24 76 Q27 73, 27 64 Q27 55, 24 55 Z',
                rightArm: 'M79 55 Q84 64, 82 73 Q80 78, 76 76 Q73 73, 73 64 Q73 55, 76 55 Z',
            };
    }
}

// Hair style based on gender
function getHairStyle(gender: CharacterGender) {
    switch (gender) {
        case 'male':
            // Short spiky hair
            return 'M25 20 Q30 5, 50 8 Q70 5, 75 20 Q72 15, 65 18 Q58 12, 50 15 Q42 12, 35 18 Q28 15, 25 20 Z';
        case 'female':
            // Long wavy hair
            return 'M22 25 Q25 5, 50 5 Q75 5, 78 25 Q80 40, 75 55 Q80 55, 78 70 Q75 70, 70 50 Q50 45, 30 50 Q25 70, 22 70 Q20 55, 25 55 Q20 40, 22 25 Z';
        default:
            // Medium length
            return 'M24 22 Q28 5, 50 6 Q72 5, 76 22 Q78 30, 74 40 Q70 35, 65 38 Q50 32, 35 38 Q30 35, 26 40 Q22 30, 24 22 Z';
    }
}

// Render individual accessories
function renderAccessory(accessory: typeof CHARACTER_ACCESSORIES[0], _index: number) {
    switch (accessory.id) {
        case 'sunglasses':
        case 'aviator':
            return (
                <>
                    <rect x="32" y="28" width="16" height="10" rx="3" fill="#1F2937" opacity="0.9" />
                    <rect x="52" y="28" width="16" height="10" rx="3" fill="#1F2937" opacity="0.9" />
                    <line x1="48" y1="32" x2="52" y2="32" stroke="#1F2937" strokeWidth="2" />
                </>
            );
        case 'cap':
        case 'beanie':
            return (
                <path
                    d="M25 18 Q30 8, 50 8 Q70 8, 75 18 Q75 22, 50 25 Q25 22, 25 18 Z"
                    fill="#3B82F6"
                />
            );
        case 'camera':
        case 'camera_pro':
            return (
                <rect x="40" y="55" width="20" height="12" rx="2" fill="#374151" />
            );
        case 'backpack_small':
        case 'backpack_large':
            return (
                <rect x="30" y="52" width="15" height="20" rx="3" fill="#059669" />
            );
        case 'headphones':
            return (
                <>
                    <path d="M28 20 Q28 10, 50 10 Q72 10, 72 20" stroke="#374151" strokeWidth="4" fill="none" />
                    <ellipse cx="28" cy="28" rx="5" ry="8" fill="#374151" />
                    <ellipse cx="72" cy="28" rx="5" ry="8" fill="#374151" />
                </>
            );
        case 'coffee':
            return (
                <g transform="translate(75, 70)">
                    <rect x="0" y="0" width="10" height="12" rx="2" fill="#FFF" stroke="#94A3B8" />
                    <ellipse cx="5" cy="0" rx="5" ry="2" fill="#6F4E37" />
                </g>
            );
        default:
            return null;
    }
}

export default ChibiCharacter;
