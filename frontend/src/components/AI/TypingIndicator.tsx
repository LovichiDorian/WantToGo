import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { typingVariants } from '@/components/Nav/navAnimations';

/**
 * TypingIndicator - AI thinking animation
 * Features:
 * - Skeleton shimmer animation
 * - Animated typing dots
 * - Localized thinking text
 */
export function TypingIndicator() {
    const { t } = useTranslation();

    return (
        <motion.div
            variants={typingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex justify-start"
        >
            <div className={cn(
                'chat-bubble-ai px-4 py-3',
                'flex items-center gap-3'
            )}>
                {/* Typing dots */}
                <div className="flex items-center gap-1">
                    <span className="typing-dot w-2 h-2 rounded-full bg-primary/60" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-primary/60" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-primary/60" />
                </div>

                {/* Thinking text */}
                <span className="text-sm text-muted-foreground">
                    {t('aiChat.thinking', 'Finding gems...')}
                </span>
            </div>
        </motion.div>
    );
}
