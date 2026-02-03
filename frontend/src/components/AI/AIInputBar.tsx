import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Sparkles, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface AIInputBarProps {
    onSend: (message: string) => void;
    onSurprise?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

/**
 * AIInputBar - Chat input bar
 * Features:
 * - Auto-grow textarea
 * - Send button with loading state
 * - Voice input button with pulse animation
 * - Magic wand "Surprise me!" button
 * - Keyboard submit support
 */
export function AIInputBar({ onSend, onSurprise, isLoading = false, disabled = false }: AIInputBarProps) {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSubmit = () => {
        if (message.trim() && !isLoading && !disabled) {
            onSend(message.trim());
            setMessage('');
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex items-end gap-2 px-4 py-3',
                'border-t border-white/10',
                'bg-gradient-to-t from-black/20 to-transparent'
            )}
        >
            {/* Magic wand button */}
            {onSurprise && (
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onSurprise}
                    disabled={isLoading || disabled}
                    className={cn(
                        'flex-shrink-0 p-2.5 rounded-xl',
                        'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
                        'text-amber-400 border border-amber-500/30',
                        'hover:from-amber-500/30 hover:to-orange-500/30',
                        'transition-colors',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    title={t('aiChat.surprise', 'Surprise me!')}
                >
                    <Sparkles className="h-5 w-5" />
                </motion.button>
            )}

            {/* Input container */}
            <div className={cn(
                'flex-1 flex items-end gap-2 px-4 py-2 rounded-2xl',
                'bg-white/5 border border-white/10',
                'focus-within:border-primary/50 focus-within:bg-white/10',
                'transition-colors'
            )}>
                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('aiChat.placeholder', 'Ask me anything about travel...')}
                    disabled={isLoading || disabled}
                    rows={1}
                    className={cn(
                        'flex-1 bg-transparent resize-none',
                        'text-sm text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none',
                        'min-h-[24px] max-h-[120px]',
                        'disabled:opacity-50'
                    )}
                />

                {/* Send button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    disabled={!message.trim() || isLoading || disabled}
                    className={cn(
                        'flex-shrink-0 p-2 rounded-xl',
                        'transition-all duration-200',
                        message.trim() && !isLoading
                            ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                            : 'bg-white/10 text-muted-foreground',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </motion.button>
            </div>

            {/* Voice button - placeholder for future implementation */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={true} // Voice not yet implemented
                className={cn(
                    'flex-shrink-0 p-2.5 rounded-xl',
                    'bg-white/5 text-muted-foreground',
                    'border border-white/10',
                    'opacity-50 cursor-not-allowed'
                )}
                title={t('aiChat.voiceHint', 'Voice input coming soon')}
            >
                <Mic className="h-5 w-5" />
            </motion.button>
        </motion.div>
    );
}
