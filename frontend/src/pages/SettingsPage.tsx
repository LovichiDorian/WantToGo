import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  Loader2,
  Share2,
  Download,
  Upload,
  Check,
  User,
  LogOut
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/theme/ThemeProvider';
import { useSync } from '@/features/offline/hooks/useSync';
import { useOnlineStatus } from '@/features/offline/hooks/useOnlineStatus';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import { useAuth } from '@/features/auth/AuthContext';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Modern Settings page with grouped sections
 */
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { performSync, syncState, pendingCount } = useSync();
  const isOnline = useOnlineStatus();
  const { places, createPlace } = usePlaces();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  // Export places as JSON file
  const handleExport = async () => {
    if (places.length === 0) {
      alert(t('settings.noPlacesToExport'));
      return;
    }

    setIsExporting(true);
    try {
      // Prepare export data (without internal sync fields)
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        places: places.map(({ id, serverId, clientId, syncStatus, ...place }) => ({
          ...place,
          photos: place.photos?.map(({ id, placeId, syncStatus, ...photo }) => photo) || []
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wannago-places-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShareStatus('success');
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setShareStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  // Import places from JSON file
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.places || !Array.isArray(data.places)) {
        throw new Error('Invalid file format');
      }

      let importedCount = 0;
      for (const place of data.places) {
        await createPlace({
          name: place.name,
          notes: place.notes,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address,
          tripDate: place.tripDate,
        });
        importedCount++;
      }

      alert(t('settings.importSuccess', { count: importedCount }));
      setShareStatus('success');
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch (error) {
      console.error('Import failed:', error);
      alert(t('settings.importError'));
      setShareStatus('error');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Share via Web Share API (mobile)
  const handleShare = async () => {
    if (places.length === 0) {
      alert(t('settings.noPlacesToExport'));
      return;
    }

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      places: places.map(({ id, serverId, clientId, syncStatus, ...place }) => ({
        ...place,
        photos: []
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const file = new File([blob], `wannago-places.json`, { type: 'application/json' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Mes lieux WannaGo',
          text: `Je partage ${places.length} lieu(x) avec toi !`,
          files: [file]
        });
        setShareStatus('success');
        setTimeout(() => setShareStatus('idle'), 3000);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
          // Fallback to download
          handleExport();
        }
      }
    } else {
      // Fallback: download file
      handleExport();
    }
  };

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const currentLanguage = i18n.language === 'fr' ? 'Français' : 'English';

  const themeOptions = [
    { value: 'light', label: t('settings.light'), icon: Sun },
    { value: 'dark', label: t('settings.dark'), icon: Moon },
    { value: 'system', label: t('settings.system'), icon: Laptop },
  ] as const;

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>

      {/* Account Section */}
      {user && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            Compte
          </h2>
          
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
            {/* User Profile */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{user.name || user.email.split('@')[0]}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Share Code */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('friends.myCode')}</p>
                  <p className="font-mono text-sm font-medium">{user.shareCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(user.shareCode);
                    setShareStatus('success');
                    setTimeout(() => setShareStatus('idle'), 2000);
                  }}
                  className="rounded-xl gap-2"
                >
                  {shareStatus === 'success' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {shareStatus === 'success' ? t('friends.copied') : t('friends.copy')}
                </Button>
              </div>
            </div>

            {/* Logout */}
            <div className="p-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full rounded-xl gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        </section>
      )}

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

      {/* Share Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
          {t('settings.share')}
        </h2>
        
        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          {/* Share via native share */}
          {canShare && (
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('settings.sharePlaces')}</p>
                  <p className="text-sm text-muted-foreground">
                    {places.length} {places.length === 1 ? 'lieu' : 'lieux'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  disabled={places.length === 0}
                  className="rounded-xl gap-2"
                >
                  {shareStatus === 'success' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  {t('settings.shareVia')}
                </Button>
              </div>
            </div>
          )}

          {/* Export */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('settings.exportPlaces')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.exportDescription')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting || places.length === 0}
                className="rounded-xl gap-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : shareStatus === 'success' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export
              </Button>
            </div>
          </div>

          {/* Import */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 flex items-center justify-center">
                <Upload className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('settings.importPlaces')}</p>
                <p className="text-sm text-muted-foreground">{t('settings.importDescription')}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="rounded-xl gap-2"
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import
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
