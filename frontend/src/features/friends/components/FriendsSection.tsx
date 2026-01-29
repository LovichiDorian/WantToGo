import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Trash2, Loader2, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFriends } from '../hooks/useFriends';
import { useState } from 'react';

export function FriendsSection() {
  const { t } = useTranslation();
  const { friends, addFriendByCode, deleteFriend, refreshFriends } = useFriends();
  const [isAdding, setIsAdding] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDeleteFriend = async (id: string, name: string) => {
    if (confirm(t('friends.deleteConfirmDescription', { name }))) {
      await deleteFriend(id);
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
        {t('friends.title')}
      </h2>
      
      <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
        {/* Add Friend */}
        <div className="p-4">
          {!isAdding ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('friends.addFriend')}</p>
                <p className="text-sm text-muted-foreground">
                  {friends.length > 0 
                    ? `${friends.length} ${t('friends.title').toLowerCase()}`
                    : t('friends.noFriendsDescription')
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="rounded-xl gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t('friends.addFriend')}
              </Button>
            </div>
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
                  className="rounded-xl font-mono text-sm"
                />
                {error && (
                  <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setFriendCode('');
                    setError(null);
                  }}
                  className="rounded-xl"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddFriend}
                  disabled={!friendCode.trim() || isLoading}
                  className="rounded-xl gap-2 flex-1"
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
        {friends.map((friend) => (
          <div key={friend.id} className="p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${friend.color}30, ${friend.color}15)` }}
              >
                <MapPin className="h-5 w-5" style={{ color: friend.color }} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-muted-foreground">
                  {friend.places.length} {t('friends.places')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFriend(friend.id, friend.name)}
                className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {friends.length === 0 && !isAdding && (
          <div className="p-6 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{t('friends.noFriends')}</p>
          </div>
        )}

        {/* Refresh button */}
        {friends.length > 0 && (
          <div className="p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshFriends}
              className="w-full rounded-xl gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('friends.refresh')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
