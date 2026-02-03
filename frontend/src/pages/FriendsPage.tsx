import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Trash2, Loader2, MapPin, RefreshCw, Copy, Check, Share2, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useAuth } from '@/features/auth/AuthContext';
import { useState } from 'react';
import type { Friend } from '@/lib/types';

// Success Toast Component
function SuccessToast({ 
  friend, 
  onClose 
}: { 
  friend: Friend; 
  onClose: () => void;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div 
        className="pointer-events-auto w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300 bg-card rounded-2xl border border-border/50 shadow-xl p-4"
        style={{ borderLeftColor: friend.color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${friend.color}30, ${friend.color}15)` }}
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">
              {t('friends.friendAdded', { name: friend.name, count: friend.places.length })}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('friends.friendAddedDescription')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  friend,
  onConfirm,
  onCancel,
  isDeleting
}: {
  friend: Friend;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-200 bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${friend.color}30, ${friend.color}15)` }}
            >
              <MapPin className="h-6 w-6" style={{ color: friend.color }} />
            </div>
            <div>
              <p className="font-semibold text-lg">{friend.name}</p>
              <p className="text-sm text-muted-foreground">
                {friend.places.length} {t('friends.places')}
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {t('friends.deleteConfirmDescription', { name: friend.name })}
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-xl gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {t('friends.deleteFriend')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  
  // Toast state
  const [addedFriend, setAddedFriend] = useState<Friend | null>(null);
  
  // Delete modal state
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      
      // Show success toast
      setAddedFriend(friend);
      setTimeout(() => setAddedFriend(null), 5000);
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

  const handleDeleteFriend = (friend: Friend) => {
    setFriendToDelete(friend);
  };

  const confirmDelete = async () => {
    if (!friendToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteFriend(friendToDelete.id);
      setFriendToDelete(null);
    } catch (err) {
      console.error('Delete friend failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight">{t('friends.title')}</h1>

      {/* My Share Code Card */}
      {user?.shareCode && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-base sm:text-lg">{t('friends.myCode')}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{t('friends.shareCodeDescription')}</p>
            </div>
          </div>
          
          <div className="bg-background/80 rounded-xl p-4 mb-4">
            <p className="font-mono text-center text-2xl sm:text-3xl font-bold tracking-[0.2em] select-all text-primary">
              {user.shareCode}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="flex-1 rounded-xl gap-2 h-11 touch-scale"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="hidden xs:inline">{copied ? t('friends.copied') : t('friends.copy')}</span>
              <span className="xs:hidden">{copied ? '✓' : ''}</span>
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 rounded-xl gap-2 h-11 touch-scale"
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
            className="w-full rounded-xl gap-2 h-12 touch-scale"
          >
            <UserPlus className="h-5 w-5" />
            {t('friends.addFriend')}
          </Button>
        ) : (
          <div className="space-y-3">
            <div>
              <Input
                placeholder="ABC123"
                value={friendCode}
                onChange={(e) => {
                  // Convertir automatiquement en majuscules
                  setFriendCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                className="rounded-xl font-mono text-center text-xl sm:text-2xl h-14 tracking-[0.15em] uppercase"
                autoFocus
                maxLength={8}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {t('friends.enterCode')}
              </p>
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
                className="flex-1 rounded-xl h-11 touch-scale"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleAddFriend}
                disabled={!friendCode.trim() || isLoading}
                className="flex-1 rounded-xl gap-2 h-11 touch-scale"
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
          <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 text-center">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-2">{t('friends.noFriends')}</p>
            <p className="text-xs sm:text-sm text-muted-foreground/70">{t('friends.noFriendsDescription')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div 
                key={friend.id} 
                className="bg-card rounded-2xl border border-border/50 p-3 sm:p-4 touch-scale"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${friend.color}30, ${friend.color}15)` }}
                  >
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: friend.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{friend.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {friend.places.length} {t('friends.places')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFriend(friend)}
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 flex-shrink-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Toast */}
      {addedFriend && (
        <SuccessToast 
          friend={addedFriend} 
          onClose={() => setAddedFriend(null)} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {friendToDelete && (
        <DeleteConfirmModal
          friend={friendToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setFriendToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
