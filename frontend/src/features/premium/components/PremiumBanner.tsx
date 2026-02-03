import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Sparkles, Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import * as premiumAPI from '@/lib/api/premium';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PremiumBannerProps {
  featureKey?: string;
  title: string;
  description: string;
  compact?: boolean;
  className?: string;
}

export function PremiumBanner({
  featureKey: _featureKey,
  title,
  description,
  compact = false,
  className,
}: PremiumBannerProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEnglish = i18n.language === 'en';

  const handleNotifyMe = async () => {
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      await premiumAPI.registerInterest(email);
      toast({
        title: isEnglish ? 'You\'re on the list!' : 'Vous êtes inscrit !',
        description: t('premium.notifyMeDescription'),
      });
      setDialogOpen(false);
      setEmail('');
    } catch (err) {
      toast({
        title: t('errors.generic'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl',
          'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10',
          'border border-amber-500/20',
          className
        )}
      >
        <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{t('premium.comingSoon')}</p>
        </div>
        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-5',
          'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-purple-500/10',
          'border border-amber-500/20',
          className
        )}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              {t('premium.comingSoon')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="rounded-xl gap-2"
            >
              <Bell className="w-4 h-4" />
              {t('premium.notifyMe')}
            </Button>
          </div>
        </div>
      </div>

      {/* Notify Me Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {t('premium.title')}
            </DialogTitle>
            <DialogDescription>
              {t('premium.comingSoonDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              type="email"
              placeholder={t('auth.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              {t('premium.notifyMeDescription')}
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="flex-1 rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleNotifyMe}
              disabled={!email.trim() || isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('premium.notifyMe')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Simple Premium Gate for inline use
export function PremiumGate({ children: _children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  // In the future, this would check subscription status
  // For now, always show fallback (premium not available)
  return <>{fallback || null}</>;
}
