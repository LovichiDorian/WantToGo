import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpdatePromptProps {
  isUpdateAvailable: boolean;
  onUpdate: () => void;
}

export function UpdatePrompt({ isUpdateAvailable, onUpdate }: UpdatePromptProps) {
  const { t } = useTranslation();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
      <span className="text-sm font-medium">{t('pwa.updateAvailable')}</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={onUpdate}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        {t('pwa.updateNow')}
      </Button>
    </div>
  );
}
