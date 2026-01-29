import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  MapPin, 
  Plus,
  Plane,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as assistantAPI from '@/lib/api/assistant';
import { usePlaces } from '@/features/places/hooks/usePlaces';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  placeSuggestion?: assistantAPI.PlaceSuggestion | null;
  isLoading?: boolean;
}

export function AssistantPage() {
  const { t, i18n } = useTranslation();
  const { createPlace } = usePlaces();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = i18n.language === 'fr' 
        ? "Bonjour ! 👋 Je suis votre assistant de voyage. Je vais vous aider à trouver la destination idéale en fonction de votre budget, vos dates et vos envies.\n\nCommençons ! D'où partiriez-vous (ville ou aéroport) ?"
        : "Hello! 👋 I'm your travel assistant. I'll help you find the perfect destination based on your budget, dates, and preferences.\n\nLet's start! Where would you be departing from (city or airport)?";
      
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
      }]);
    }
  }, [i18n.language, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // Add user message and loading placeholder
    setMessages(prev => [...prev, userMessage, {
      id: 'loading',
      role: 'assistant',
      content: '',
      isLoading: true,
    }]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude welcome and loading)
      const apiMessages = [...messages, userMessage]
        .filter(m => m.id !== 'welcome' && m.id !== 'loading')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await assistantAPI.sendMessage(
        apiMessages,
        i18n.language === 'fr' ? 'fr' : 'en'
      );

      // Parse place suggestion
      const placeSuggestion = assistantAPI.parsePlaceSuggestion(response.content);
      const cleanedContent = assistantAPI.cleanContent(response.content);

      // Replace loading with actual response
      setMessages(prev => prev.map(m => 
        m.id === 'loading' 
          ? {
              id: Date.now().toString(),
              role: 'assistant',
              content: cleanedContent,
              placeSuggestion,
            }
          : m
      ));
    } catch (error) {
      console.error('Chat error:', error);
      // Replace loading with error message
      setMessages(prev => prev.map(m => 
        m.id === 'loading' 
          ? {
              id: Date.now().toString(),
              role: 'assistant',
              content: i18n.language === 'fr' 
                ? "Désolé, une erreur s'est produite. Veuillez réessayer."
                : "Sorry, an error occurred. Please try again.",
            }
          : m
      ));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleAddPlace = async (suggestion: assistantAPI.PlaceSuggestion) => {
    try {
      await createPlace({
        name: suggestion.name,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        address: `${suggestion.city}, ${suggestion.country}`,
        notes: t('assistant.addedFromAssistant'),
      });

      // Add confirmation message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: i18n.language === 'fr'
          ? `✅ **${suggestion.name}** a été ajouté à votre carte ! Vous pouvez le retrouver dans vos lieux.`
          : `✅ **${suggestion.name}** has been added to your map! You can find it in your places.`,
      }]);
    } catch (error) {
      console.error('Failed to add place:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <Plane className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold">{t('assistant.title')}</h1>
          <p className="text-xs text-muted-foreground">{t('assistant.subtitle')}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-primary/20' 
                  : 'bg-gradient-to-br from-violet-500/20 to-purple-500/20'
              }`}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-primary" />
              ) : (
                <Bot className="h-4 w-4 text-violet-500" />
              )}
            </div>

            {/* Message bubble */}
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border/50 rounded-bl-md'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {t('assistant.thinking')}
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Place suggestion card */}
                  {message.placeSuggestion && (
                    <div className="mt-3 p-3 bg-background/50 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">
                          {message.placeSuggestion.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {message.placeSuggestion.city}, {message.placeSuggestion.country}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleAddPlace(message.placeSuggestion!)}
                        className="w-full rounded-lg gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {t('assistant.addToMap')}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('assistant.placeholder')}
            disabled={isLoading}
            className="flex-1 rounded-xl h-12"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3" />
          {t('assistant.poweredBy')}
        </p>
      </div>
    </div>
  );
}
