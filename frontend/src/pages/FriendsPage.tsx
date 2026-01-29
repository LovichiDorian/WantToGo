import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Trash2, Loader2, MapPin, RefreshCw, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useAuth } from '@/features/auth/AuthContext';
import { useState } from 'react';

export function FriendsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { friends, addFriendByCode, deleteFriend, refreshFriends } = useFriends();
  const [isAdding, setIsAdding] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopyCode = async () => {
    if (!user?.shareCode) return;
    try {
      await navigator.clipboard.writeText(user.shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = user.shareCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!user?.shareCode) return;
    
    const shareText = `Ajoute-moi sur WannaGo avec mon code : ${user.shareCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon code WannaGo',
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyCode();
        }
      }
    } else {
      handleCopyCode();
    }
  };

  const handleAddFriend = async () => {
    if (!friendCode.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const friend = await addFriendByCode(friendCode.trim());
      setFriendCode('');
      setIsAdding(false);
      alert(t('friends.friendAdded', { name: friend.name, count: friend.places.length }));
    } catch (err) {
      console.error('Add friend failed:', err);
      setError(t('friends.codeNotFound'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFriends();
    setIsRefreshing(false);
  };

  const handleDeleteFriend = async (id: string, name: string) => {
    if (confirm(t('friends.deleteConfirmDescription', { name }))) {
      await deleteFriend(id);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight">{t('friends.title')}</h1>

      {/* My Share Code Card */}
      {user?.shareCode && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">{t('friends.myCode')}</p>
              <p className="text-sm text-muted-foreground">{t('friends.shareCodeDescription')}</p>
            </div>
          </div>
          
          <div className="bg-background/80 rounded-xl p-3 mb-4">
            <p className="font-mono text-center text-lg font-semibold tracking-wider select-all">
              {user.shareCode}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="flex-1 rounded-xl gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? t('friends.copied') : t('friends.copy')}
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 rounded-xl gap-2"
            >
              <Share2 className="h-4 w-4" />
              {t('friends.share')}
            </Button>
          </div>
        </div>
      )}

      {/* Add Friend Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-4">
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full rounded-xl gap-2 h-12"
          >
            <UserPlus className="h-5 w-5" />
            {t('friends.addFriend')}
          </Button>
        ) : (
          <div className="space-y-3">
            <div>
              <Input
                placeholder={t('friends.enterCode')}
                value={friendCode}
                onChange={(e) => {
                  setFriendCode(e.target.value);
                  setError(null);
                }}
                className="rounded-xl font-mono text-center text-lg h-12"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setFriendCode('');
                  setError(null);
                }}
                className="flex-1 rounded-xl"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleAddFriend}
                disabled={!friendCode.trim() || isLoading}
                className="flex-1 rounded-xl gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {t('friends.addFriend')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {t('friends.myFriends')} ({friends.length})
          </h2>
          {friends.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 text-muted-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('friends.refresh')}
            </Button>
          )}
        </div>

        {friends.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-2">{t('friends.noFriends')}</p>
            <p className="text-sm text-muted-foreground/70">{t('friends.noFriendsDescription')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                className="bg-card rounded-2xl border border-border/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${friend.color}30, ${friend.color}15)` }}
                  >
                    <MapPin className="h-6 w-6" style={{ color: friend.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.places.length} {t('friends.places')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFriend(friend.id, friend.name)}
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
