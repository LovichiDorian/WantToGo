import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Download, 
  X, 
  Smartphone, 
  Zap, 
  Bell, 
  WifiOff,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function EnhancedInstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('wanttogo_pwa_dismissed');
    const dismissedAt = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    
    // Show again after 7 days
    if (dismissedAt && daysSinceDismissed < 7) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 2 user actions (already checked in parent)
      const actionCount = parseInt(localStorage.getItem('wanttogo_action_count') || '0');
      if (actionCount >= 2) {
        setTimeout(() => setShowPrompt(true), 1000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('wanttogo_pwa_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (isInstalled) return null;

  const features = [
    { icon: Zap, text: t('pwa.features.fast'), color: 'text-yellow-500' },
    { icon: WifiOff, text: t('pwa.features.offline'), color: 'text-blue-500' },
    { icon: Bell, text: t('pwa.features.notifications'), color: 'text-purple-500' },
  ];

  return (
    <>
      {/* Main install prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 left-4 right-4 z-50"
          >
            <div className="glass-strong rounded-3xl p-5 shadow-2xl border border-white/20">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="flex gap-4">
                {/* Icon */}
                <motion.div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Smartphone className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg">
                    {t('pwa.install')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('pwa.installDescription')}
                  </p>

                  {/* Features */}
                  <div className="flex gap-3 mt-3">
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        <feature.icon className={cn('w-3.5 h-3.5', feature.color)} />
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="flex-1"
                >
                  {t('common.later')}
                </Button>
                <Button
                  onClick={handleInstall}
                  className="flex-1 gradient-primary text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('pwa.addToHomeScreen')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <div className="glass-strong rounded-2xl p-4 shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{t('pwa.installed')}</p>
                <p className="text-sm text-muted-foreground">{t('pwa.installedDescription')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Smaller inline install button for header/settings
export function InstallButton() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isInstalled || !deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
  };

  return (
    <motion.button
      onClick={handleInstall}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl',
        'glass text-sm font-medium text-primary',
        'hover:bg-primary/10 transition-colors'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Download className="w-4 h-4" />
      {t('pwa.install')}
    </motion.button>
  );
}

export default EnhancedInstallPrompt;
