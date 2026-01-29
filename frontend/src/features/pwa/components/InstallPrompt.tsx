import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export function InstallPrompt() {
  const { t } = useTranslation();
  const { isInstallable, promptInstall } = useInstallPrompt();

  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={promptInstall}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">{t('pwa.install')}</span>
    </Button>
  );
}
