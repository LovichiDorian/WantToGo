import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { chatPanelVariants } from '@/components/Nav/navAnimations';
import { useChatStore } from '@/features/ai/useChatStore';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import * as assistantAPI from '@/lib/api/assistant';

import { AIHeader } from './AIHeader';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { AIInputBar } from './AIInputBar';

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * AIChatPanel - Main slide-up chat panel
 * Features:
 * - Glassmorphism slide-up panel (80vh)
 * - Scrollable message area
 * - Fixed header and input bar
 * - Confetti on successful place add
 * - Uses existing assistant API
 */
export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
    const { t, i18n } = useTranslation();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [addingPlaceId, setAddingPlaceId] = useState<string | null>(null);

    const {
        messages,
        isTyping,
        addMessage,
        setTyping,
        markPlaceAdded
    } = useChatStore();

    const { createPlace } = usePlaces();

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    // Fire confetti effect
    const fireConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0ea5e9', '#7c3aed', '#06b6d4', '#f59e0b'],
        });
    };

    // Handle sending a message
    const handleSend = async (content: string) => {
        // Add user message
        addMessage({
            role: 'user',
            content,
        });

        // Show typing indicator
        setTyping(true);

        try {
            // Build message history for API
            const messageHistory: assistantAPI.Message[] = [
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user' as const, content }
            ];

            // Call assistant API with current language
            const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';
            const response = await assistantAPI.sendMessage(messageHistory, lang);

            setTyping(false);

            // Parse place suggestion from response
            const placeSuggestion = assistantAPI.parsePlaceSuggestion(response.content);
            const cleanedContent = assistantAPI.cleanContent(response.content);

            // Add AI response
            addMessage({
                role: 'assistant',
                content: cleanedContent,
                placeSuggestion: placeSuggestion ? {
                    name: placeSuggestion.name,
                    address: `${placeSuggestion.city}, ${placeSuggestion.country}`,
                    lat: placeSuggestion.latitude,
                    lng: placeSuggestion.longitude,
                } : null,
                xpReward: placeSuggestion ? 150 : undefined,
            });
        } catch (error) {
            console.error('Assistant error:', error);
            setTyping(false);

            addMessage({
                role: 'assistant',
                content: t('errors.generic', 'An error occurred. Please try again.'),
            });
        }
    };

    // Handle "Surprise me!" button
    const handleSurprise = () => {
        const surprisePrompts = [
            t('aiChat.surprisePrompts.hidden', 'Find me a hidden gem nearby'),
            t('aiChat.surprisePrompts.romantic', 'Suggest a romantic dinner spot'),
            t('aiChat.surprisePrompts.adventure', 'What\'s an adventurous place to visit?'),
            t('aiChat.surprisePrompts.cultural', 'Recommend a cultural experience'),
        ];
        const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
        handleSend(randomPrompt);
    };

    // Handle adding place to map
    const handleAddPlace = async (messageId: string, suggestion: { name: string; address?: string; lat?: number; lng?: number }) => {
        setAddingPlaceId(messageId);

        try {
            await createPlace({
                name: suggestion.name,
                address: suggestion.address || '',
                latitude: suggestion.lat || 0,
                longitude: suggestion.lng || 0,
                notes: t('assistant.addedFromAssistant', 'Added via AI assistant'),
            });

            markPlaceAdded(messageId);
            fireConfetti();

            // Trigger haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate([50, 50, 50]);
            }
        } catch (error) {
            console.error('Failed to add place:', error);
        } finally {
            setAddingPlaceId(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Chat Panel */}
                    <motion.div
                        variants={chatPanelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                            'fixed inset-x-0 bottom-0 z-50',
                            'h-[80vh] max-h-[800px]',
                            'glass-chat-panel',
                            'flex flex-col'
                        )}
                    >
                        {/* Header */}
                        <AIHeader onClose={onClose} />

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mb-4"
                                    >
                                        <span className="text-3xl">🌍</span>
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {t('aiChat.welcome', 'Ready to explore?')}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('aiChat.welcomeDescription', 'Ask me about places, get recommendations, and add them to your map!')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <ChatBubble
                                            key={message.id}
                                            message={message}
                                            onAddPlace={message.placeSuggestion ?
                                                (suggestion) => handleAddPlace(message.id, suggestion) :
                                                undefined
                                            }
                                            isAddingPlace={addingPlaceId === message.id}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && <TypingIndicator />}
                            </AnimatePresence>

                            {/* Scroll anchor */}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Bar */}
                        <AIInputBar
                            onSend={handleSend}
                            onSurprise={handleSurprise}
                            isLoading={isTyping}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
