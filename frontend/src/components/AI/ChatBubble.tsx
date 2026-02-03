import { motion } from 'framer-motion';
import { MapPin, Plus, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { bubbleVariants } from '@/components/Nav/navAnimations';
import { Button } from '@/components/ui/button';

interface PlaceSuggestion {
    name: string;
    address?: string;
    lat?: number;
    lng?: number;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    placeSuggestion?: PlaceSuggestion | null;
    xpReward?: number;
    isLoading?: boolean;
    placeAdded?: boolean;
}

interface ChatBubbleProps {
    message: ChatMessage;
    onAddPlace?: (suggestion: PlaceSuggestion) => void;
    isAddingPlace?: boolean;
}

/**
 * ChatBubble - Message bubble component
 * Features:
 * - User messages: right-aligned, blue gradient
 * - AI messages: left-aligned, glassmorphism
 * - Place suggestion cards with "Add to map" button
 * - XP reward display with animation
 */
export function ChatBubble({ message, onAddPlace, isAddingPlace }: ChatBubbleProps) {
    const { t } = useTranslation();
    const isUser = message.role === 'user';

    return (
        <motion.div
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            className={cn(
                'flex w-full',
                isUser ? 'justify-end' : 'justify-start'
            )}
        >
            <div
                className={cn(
                    'max-w-[85%] px-4 py-3',
                    isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
                )}
            >
                {/* Message content */}
                <p className={cn(
                    'text-sm leading-relaxed',
                    isUser ? 'text-white' : 'text-foreground'
                )}>
                    {message.content}
                </p>

                {/* Place suggestion card */}
                {message.placeSuggestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                            'mt-3 p-3 rounded-xl',
                            'bg-white/10 border border-white/10'
                        )}
                    >
                        <div className="flex items-start gap-3">
                            {/* Map icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-white" />
                            </div>

                            {/* Place info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-foreground truncate">
                                    {message.placeSuggestion.name}
                                </h4>
                                {message.placeSuggestion.address && (
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {message.placeSuggestion.address}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Add to map button */}
                        {onAddPlace && !message.placeAdded && (
                            <Button
                                onClick={() => onAddPlace(message.placeSuggestion!)}
                                disabled={isAddingPlace}
                                size="sm"
                                className={cn(
                                    'w-full mt-3',
                                    'bg-gradient-to-r from-cyan-500 to-violet-600',
                                    'hover:from-cyan-400 hover:to-violet-500',
                                    'text-white font-medium'
                                )}
                            >
                                {isAddingPlace ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {t('common.loading')}
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('aiChat.addToMap', 'Add to map')}
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Place added confirmation */}
                        {message.placeAdded && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2 mt-3 text-green-400 success-burst"
                            >
                                <Check className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {t('assistant.addedToMap', 'Added to map')}
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* XP reward badge */}
                {message.xpReward && message.xpReward > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                        className={cn(
                            'inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full',
                            'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
                            'border border-amber-500/30',
                            'text-amber-400 text-xs font-bold'
                        )}
                    >
                        <span>+{message.xpReward} XP</span>
                        <span>🎉</span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
