import { useTranslation } from 'react-i18next';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
      <WifiOff className="h-4 w-4" />
      <span>{t('offline.youAreOffline')}</span>
    </div>
  );
}
