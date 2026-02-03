import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { X, Mic, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIHeaderProps {
    onClose: () => void;
    isListening?: boolean;
    onVoiceToggle?: () => void;
}

/**
 * AIHeader - Chat panel header with globe avatar
 * Features:
 * - 3D globe avatar with spinning animation
 * - Title with gradient text
 * - Close button with slide-out animation
 * - Voice input toggle button
 */
export function AIHeader({ onClose, isListening = false, onVoiceToggle }: AIHeaderProps) {
    const { t } = useTranslation();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex items-center justify-between px-5 py-4',
                'border-b border-white/10',
                'bg-gradient-to-b from-white/5 to-transparent'
            )}
        >
            {/* Left: Avatar + Title */}
            <div className="flex items-center gap-3">
                {/* Globe Avatar */}
                <motion.div
                    className={cn(
                        'flex items-center justify-center',
                        'w-10 h-10 rounded-2xl',
                        'bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600',
                        'shadow-lg shadow-violet-500/20'
                    )}
                    animate={{
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    <Globe className="h-5 w-5 text-white spin-slow" />
                </motion.div>

                {/* Title */}
                <div>
                    <h2 className="text-lg font-bold text-gradient">
                        {t('aiChat.title', 'AI Game Master')}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {t('assistant.poweredBy', 'Powered by AI')}
                    </p>
                </div>
            </div>

            {/* Right: Voice + Close */}
            <div className="flex items-center gap-2">
                {/* Voice Toggle */}
                {onVoiceToggle && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onVoiceToggle}
                        className={cn(
                            'p-2.5 rounded-xl transition-colors',
                            isListening
                                ? 'bg-red-500/20 text-red-400 voice-recording'
                                : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                        )}
                        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                        <Mic className="h-5 w-5" />
                    </motion.button>
                )}

                {/* Close Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={cn(
                        'p-2.5 rounded-xl',
                        'bg-white/5 text-muted-foreground',
                        'hover:text-foreground hover:bg-white/10',
                        'transition-colors'
                    )}
                    aria-label="Close chat"
                >
                    <X className="h-5 w-5" />
                </motion.button>
            </div>
        </motion.header>
    );
}
