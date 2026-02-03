import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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
    createdAt: number;
}

interface ChatState {
    messages: ChatMessage[];
    isOpen: boolean;
    isTyping: boolean;

    // Actions
    openPanel: () => void;
    closePanel: () => void;
    togglePanel: () => void;
    addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => string;
    updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
    setTyping: (isTyping: boolean) => void;
    markPlaceAdded: (messageId: string) => void;
    clearHistory: () => void;
}

/**
 * Zustand store for AI chat state
 * Features:
 * - Message history with persistence
 * - Panel open/close state
 * - Typing indicator state
 * - Place added tracking
 */
export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            isOpen: false,
            isTyping: false,

            openPanel: () => set({ isOpen: true }),

            closePanel: () => set({ isOpen: false }),

            togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),

            addMessage: (message) => {
                const id = uuidv4();
                const newMessage: ChatMessage = {
                    ...message,
                    id,
                    createdAt: Date.now(),
                };

                set((state) => ({
                    messages: [...state.messages, newMessage],
                }));

                return id;
            },

            updateMessage: (id, updates) => {
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.id === id ? { ...msg, ...updates } : msg
                    ),
                }));
            },

            setTyping: (isTyping) => set({ isTyping }),

            markPlaceAdded: (messageId) => {
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.id === messageId ? { ...msg, placeAdded: true } : msg
                    ),
                }));
            },

            clearHistory: () => set({ messages: [] }),
        }),
        {
            name: 'wanttogo-chat-history',
            partialize: (state) => ({
                // Only persist messages, not UI state
                messages: state.messages.slice(-50), // Keep last 50 messages
            }),
        }
    )
);

// Selectors for optimized re-renders
export const selectIsOpen = (state: ChatState) => state.isOpen;
export const selectMessages = (state: ChatState) => state.messages;
export const selectIsTyping = (state: ChatState) => state.isTyping;
