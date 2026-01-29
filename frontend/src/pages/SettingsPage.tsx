import { useTranslation } from 'react-i18next';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Globe, 
  Bell, 
  Trash2, 
  RefreshCw,
  Cloud,
  CloudOff,
  Palette,
  Loader2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/theme/ThemeProvider';
import { useSync } from '@/features/offline/hooks/useSync';
import { useOnlineStatus } from '@/features/offline/hooks/useOnlineStatus';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Modern Settings page with grouped sections
 */
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { performSync, syncState, pendingCount } = useSync();
  const isOnline = useOnlineStatus();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const [isClearing, setIsClearing] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (enabled && typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        window.location.reload();
      }
    } finally {
      setIsClearing(false);
    }
  };

  const handleManualSync = () => {
    if (isOnline) {
      performSync();
    }
  };

  const currentLanguage = i18n.language === 'fr' ? 'Français' : 'English';

  const themeOptions = [
    { value: 'light', label: t('settings.light'), icon: Sun },
    { value: 'dark', label: t('settings.dark'), icon: Moon },
    { value: 'system', label: t('settings.system'), icon: Laptop },
  ] as const;

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>

      {/* Appearance Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
          {t('settings.appearance')}
        </h2>
        
        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          {/* Theme */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/15 to-violet-500/5 flex items-center justify-center">
                <Palette className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="font-medium">{t('settings.theme')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.appearanceDescription')}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all",
                    theme === value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('settings.language')}</p>
                <p className="text-sm text-muted-foreground">{currentLanguage}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleLanguageChange('en')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all",
                  i18n.language === 'en'
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all",
                  i18n.language === 'fr'
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                Français
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
          {t('settings.notifications')}
        </h2>
        
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 flex items-center justify-center">
              <Bell className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t('settings.enableNotifications')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.notificationsDescription')}</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>
        </div>
      </section>

      {/* Sync Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
          {t('settings.sync')}
        </h2>
        
        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          {/* Sync Status */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isOnline 
                  ? "bg-gradient-to-br from-green-500/15 to-green-500/5"
                  : "bg-gradient-to-br from-red-500/15 to-red-500/5"
              )}>
                {isOnline ? (
                  <Cloud className="h-5 w-5 text-green-500" />
                ) : (
                  <CloudOff className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {pendingCount > 0 
                    ? t('settings.pendingChanges')
                    : t('settings.allSynced')
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {pendingCount > 0 
                    ? t('settings.pendingCount', { count: pendingCount })
                    : isOnline ? 'Connected' : t('settings.offlineWarning')
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSync}
                disabled={!isOnline || syncState === 'syncing'}
                className="rounded-xl gap-2"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  syncState === 'syncing' && "animate-spin"
                )} />
                {t('settings.syncNow')}
              </Button>
            </div>
          </div>

          {/* Clear Cache */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/15 to-red-500/5 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('settings.clearCache')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.clearCacheDescription')}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearCache}
                disabled={isClearing}
                className="rounded-xl gap-2"
              >
                {isClearing && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('settings.clearCache')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* App Info */}
      <section className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          WantToGo v1.0.0
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Made with ❤️ for travelers
        </p>
      </section>
    </div>
  );
}
