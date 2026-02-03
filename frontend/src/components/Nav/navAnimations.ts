import type { Variants } from 'framer-motion';

/**
 * Navigation Animation Variants - WantToGo 2026
 * Framer Motion variants for ultra-smooth nav animations
 */

// Tab switch animation with slide + blur + scale
export const tabVariants: Variants = {
    initial: {
        y: 20,
        opacity: 0,
        scale: 0.95
    },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    },
    exit: {
        y: -20,
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: 'easeIn'
        }
    }
};

// Active indicator magnetic follow
export const indicatorVariants: Variants = {
    initial: { scale: 0 },
    animate: {
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30
        }
    }
};

// AI button float + breathe animation
export const aiButtonVariants: Variants = {
    initial: {
        scale: 0,
        opacity: 0
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.2
        }
    },
    hover: {
        scale: 1.1,
        y: -4,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 20
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1
        }
    }
};

// Navigation bar entrance
export const navBarVariants: Variants = {
    initial: {
        y: 100,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 25,
            delay: 0.1
        }
    }
};

// Icon animation on active
export const iconVariants: Variants = {
    inactive: {
        scale: 1,
        rotate: 0
    },
    active: {
        scale: 1.15,
        transition: {
            type: 'spring',
            stiffness: 400
        }
    }
};

// Compass spin for map icon
export const compassSpinVariants: Variants = {
    inactive: { rotate: 0 },
    active: {
        rotate: 360,
        transition: {
            duration: 0.6,
            ease: 'easeOut'
        }
    }
};

// Settings gear rotation
export const gearRotateVariants: Variants = {
    inactive: { rotate: 0 },
    active: {
        rotate: 90,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    }
};

// Chat panel slide up
export const chatPanelVariants: Variants = {
    hidden: {
        y: '100%',
        opacity: 0.5
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        y: '100%',
        opacity: 0.5,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
};

// Message bubble animation
export const bubbleVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.9
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25
        }
    }
};

// Typing indicator
export const typingVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 }
    }
};

// Globe pulse for AI button
export const globePulseVariants: Variants = {
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};
