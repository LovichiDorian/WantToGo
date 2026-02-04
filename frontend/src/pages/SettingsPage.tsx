import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Bell,
  BellRing,
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
  LogOut,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  Crown,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/theme/ThemeProvider';
import { useSync } from '@/features/offline/hooks/useSync';
import { useOnlineStatus } from '@/features/offline/hooks/useOnlineStatus';
import { usePlaces } from '@/features/places/hooks/usePlaces';
import { useAuth } from '@/features/auth/AuthContext';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { cn } from '@/lib/utils';

type TabType = 'appearance' | 'account' | 'privacy';

const tabs: { id: TabType; labelKey: string; icon: typeof Palette }[] = [
  { id: 'appearance', labelKey: 'settings.tabs.appearance', icon: Palette },
  { id: 'account', labelKey: 'settings.tabs.account', icon: User },
  { id: 'privacy', labelKey: 'settings.tabs.privacy', icon: Shield },
];

/**
 * Premium Settings page with 3 tabbed sections
 * Features glassmorphism, animations, and gamification touches
 */
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  useTheme(); // Theme is managed by ThemeToggle component
  const { performSync, syncState, pendingCount } = useSync();
  const isOnline = useOnlineStatus();
  const { places, createPlace } = usePlaces();
  const { user, logout } = useAuth();
  const {
    permission,
    isSupported,
    requestPermission,
    showNotification
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [isClearing, setIsClearing] = useState(false);
  const [notificationTestSent, setNotificationTestSent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends'>('friends');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      showNotification('Notifications activées', {
        body: 'Vous recevrez des notifications de WantToGo',
        tag: 'notifications-enabled',
      });
    }
  };

  const handleTestNotification = () => {
    showNotification('Test de notification', {
      body: 'Les notifications WantToGo fonctionnent parfaitement ! 🎉',
      tag: 'test-notification',
    });
    setNotificationTestSent(true);
    setTimeout(() => setNotificationTestSent(false), 3000);
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

  const handleExport = async () => {
    if (places.length === 0) {
      alert(t('settings.noPlacesToExport'));
      return;
    }

    setIsExporting(true);
    try {
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
      a.download = `wanttogo-places-${new Date().toISOString().split('T')[0]}.json`;
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const currentLanguage = i18n.language === 'fr' ? 'Français' : 'English';

  // Tab content animation variants
  const tabContentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <motion.div
            key="appearance"
            initial="enter"
            animate="center"
            exit="exit"
            variants={tabContentVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            {/* Avatar Studio Card */}
            <motion.div
              onClick={() => navigate('/settings/avatar-studio')}
              className="glass-card-centered p-5 cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg text-2xl">
                  ✨
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">Studio Avatar</p>
                  <p className="text-sm text-muted-foreground">Personnalise ton avatar</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    +100 XP
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </motion.div>

            {/* Theme Section */}
            <SettingsSection
              icon={Palette}
              iconColor="text-violet-500"
              iconBg="from-violet-500/15 to-violet-500/5"
              title={t('settings.theme')}
              description={t('settings.appearanceDescription')}
            >
              <ThemeToggle showPreview={true} showXpReward={true} />
            </SettingsSection>

            {/* Language Section */}
            <SettingsSection
              icon={Globe}
              iconColor="text-blue-500"
              iconBg="from-blue-500/15 to-blue-500/5"
              title={t('settings.language')}
              description={currentLanguage}
            >
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleLanguageChange('en')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                    i18n.language === 'en'
                      ? "gradient-primary text-white shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🇺🇸</span> English
                </motion.button>
                <motion.button
                  onClick={() => handleLanguageChange('fr')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                    i18n.language === 'fr'
                      ? "gradient-primary text-white shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🇫🇷</span> Français
                </motion.button>
              </div>
            </SettingsSection>

            {/* Notifications Section */}
            <SettingsSection
              icon={permission === 'granted' ? BellRing : Bell}
              iconColor={permission === 'granted' ? 'text-emerald-500' : 'text-amber-500'}
              iconBg={permission === 'granted' ? 'from-emerald-500/15 to-emerald-500/5' : 'from-amber-500/15 to-amber-500/5'}
              title={t('settings.enableNotifications')}
              description={
                !isSupported
                  ? t('settings.notificationsNotSupported')
                  : permission === 'granted'
                    ? t('settings.notificationsEnabled')
                    : permission === 'denied'
                      ? t('settings.notificationsDenied')
                      : t('settings.notificationsDescription')
              }
              action={
                isSupported && permission !== 'granted' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEnableNotifications}
                    disabled={permission === 'denied'}
                    className="rounded-xl gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    {t('settings.enable')}
                  </Button>
                ) : permission === 'granted' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestNotification}
                    className="rounded-xl gap-2"
                  >
                    {notificationTestSent ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <BellRing className="h-4 w-4" />
                    )}
                    {notificationTestSent ? t('settings.sent') : t('settings.test')}
                  </Button>
                ) : null
              }
            />

            {/* Notifications XP Bonus hint */}
            {permission === 'granted' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200/50 dark:border-amber-500/20"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  {t('settings.notificationsBonus') || 'Notifications activées → +20% XP quêtes !'}
                </span>
              </motion.div>
            )}
          </motion.div>
        );

      case 'account':
        return (
          <motion.div
            key="account"
            initial="enter"
            animate="center"
            exit="exit"
            variants={tabContentVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            {/* Profile Card */}
            {user && (
              <div className="glass-card-centered p-5">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <User className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg truncate">{user.name || user.email.split('@')[0]}</p>
                      {/* Premium badge placeholder */}
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-muted text-muted-foreground">
                        Free
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Premium Upsell */}
            <motion.div
              className="glass-card-centered p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200/50 dark:border-amber-500/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{t('premium.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('premium.subtitle')}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300">
                  {t('common.comingSoon')}
                </span>
              </div>
            </motion.div>

            {/* Share Code */}
            {user && (
              <SettingsSection
                icon={Share2}
                iconColor="text-purple-500"
                iconBg="from-purple-500/15 to-purple-500/5"
                title={t('friends.myCode')}
                description={user.shareCode}
                action={
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
                }
              />
            )}

            {/* Export Places */}
            <SettingsSection
              icon={Download}
              iconColor="text-blue-500"
              iconBg="from-blue-500/15 to-blue-500/5"
              title={t('settings.exportPlaces')}
              description={`${places.length} ${t('friends.places')}`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting || places.length === 0}
                  className="rounded-xl gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export
                </Button>
              }
            />

            {/* Logout */}
            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full rounded-2xl h-12 gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.logout')}
              </Button>
            </div>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div
            key="privacy"
            initial="enter"
            animate="center"
            exit="exit"
            variants={tabContentVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            {/* Profile Visibility */}
            <SettingsSection
              icon={Users}
              iconColor="text-indigo-500"
              iconBg="from-indigo-500/15 to-indigo-500/5"
              title={t('settings.profileVisibility') || 'Visibilité du profil'}
              description={profileVisibility === 'public' ? t('settings.public') || 'Public' : t('settings.friendsOnly') || 'Amis uniquement'}
            >
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setProfileVisibility('friends')}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                    profileVisibility === 'friends'
                      ? "gradient-primary text-white shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <EyeOff className="w-4 h-4" />
                  Amis
                </motion.button>
                <motion.button
                  onClick={() => setProfileVisibility('public')}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                    profileVisibility === 'public'
                      ? "gradient-primary text-white shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4" />
                  Public
                </motion.button>
              </div>
            </SettingsSection>

            {/* Sync Status */}
            <SettingsSection
              icon={isOnline ? Cloud : CloudOff}
              iconColor={isOnline ? 'text-emerald-500' : 'text-red-500'}
              iconBg={isOnline ? 'from-emerald-500/15 to-emerald-500/5' : 'from-red-500/15 to-red-500/5'}
              title={pendingCount > 0 ? t('settings.pendingChanges') : t('settings.allSynced')}
              description={
                pendingCount > 0
                  ? t('settings.pendingCount', { count: pendingCount })
                  : isOnline ? 'Connected' : t('settings.offlineWarning')
              }
              action={
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
              }
            />

            {/* Import Places */}
            <SettingsSection
              icon={Upload}
              iconColor="text-emerald-500"
              iconBg="from-emerald-500/15 to-emerald-500/5"
              title={t('settings.importPlaces')}
              description={t('settings.importDescription')}
              action={
                <>
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
                </>
              }
            />

            {/* Clear Cache */}
            <SettingsSection
              icon={Trash2}
              iconColor="text-red-500"
              iconBg="from-red-500/15 to-red-500/5"
              title={t('settings.clearCache')}
              description={t('settings.clearCacheDescription')}
              action={
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
              }
            />

            {/* App Info */}
            <div className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                WantToGo v2.0.0
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Made with ❤️ for travelers
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-full pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-light p-4 border-b border-gray-200/50 dark:border-white/5">
        <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-[73px] z-10 glass-light px-4 py-3 border-b border-gray-200/50 dark:border-white/5">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'gradient-primary text-white shadow-lg'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t(tab.labelKey) || tab.id}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Reusable Settings Section Component
interface SettingsSectionProps {
  icon: typeof Palette;
  iconColor: string;
  iconBg: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

function SettingsSection({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  action,
  children,
}: SettingsSectionProps) {
  return (
    <motion.div
      className="glass-card-centered p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
          iconBg
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
