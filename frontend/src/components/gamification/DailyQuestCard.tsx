import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, ChevronRight, Sparkles, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { DailyQuest } from '@/lib/hooks/useDailyQuests';

interface DailyQuestCardProps {
  quest: DailyQuest;
  onClick?: () => void;
  className?: string;
}

export function DailyQuestCard({ quest, onClick, className }: DailyQuestCardProps) {
  const { t } = useTranslation();
  const progress = (quest.current / quest.target) * 100;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl p-4',
        'text-left transition-all duration-300',
        quest.completed
          ? 'quest-card-complete'
          : 'quest-card hover:shadow-xl',
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <motion.div
          className={cn(
            'relative flex-shrink-0 w-12 h-12 rounded-xl',
            'flex items-center justify-center text-2xl',
            quest.completed
              ? 'bg-green-500/20'
              : 'glass'
          )}
          animate={quest.completed ? { scale: [1, 1.1, 1] } : undefined}
          transition={{ duration: 0.5 }}
        >
          {quest.completed ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
            </motion.div>
          ) : (
            <span>{quest.icon}</span>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'font-semibold truncate',
                quest.completed ? 'text-green-600 dark:text-green-400' : 'text-foreground'
              )}
            >
              {t(quest.titleKey)}
            </h3>
            {!quest.completed && (
              <span className="flex-shrink-0 text-xs font-bold text-primary">
                +{quest.xpReward} XP
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground truncate">
            {t(quest.descriptionKey)}
          </p>

          {/* Progress bar */}
          {!quest.completed && (
            <div className="mt-2 flex items-center gap-2">
              <Progress value={progress} className="h-1.5 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">
                {quest.current}/{quest.target}
              </span>
            </div>
          )}
        </div>

        {/* Arrow or checkmark */}
        <div className="flex-shrink-0">
          {quest.completed ? (
            <motion.div
              className="flex items-center gap-1 text-green-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xs font-bold">+{quest.xpReward}</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Completed celebration effect */}
      {quest.completed && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-green-400"
              style={{
                left: `${20 + i * 15}%`,
                top: '50%',
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: 1,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}

// Bonus card for completing all quests
interface BonusCardProps {
  completed: number;
  total: number;
  bonusXP: number;
  canClaim: boolean;
  onClaim: () => void;
  className?: string;
}

export function DailyQuestBonusCard({
  completed,
  total,
  bonusXP,
  canClaim,
  onClaim,
  className,
}: BonusCardProps) {
  const { t } = useTranslation();
  const allCompleted = completed >= total;

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl p-4',
        allCompleted
          ? 'gradient-gold text-white'
          : 'glass-strong border-2 border-dashed border-muted-foreground/20',
        className
      )}
      animate={
        canClaim
          ? {
              boxShadow: [
                '0 0 0 0 rgba(251, 191, 36, 0)',
                '0 0 20px 5px rgba(251, 191, 36, 0.3)',
                '0 0 0 0 rgba(251, 191, 36, 0)',
              ],
            }
          : undefined
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Gift icon */}
        <motion.div
          className={cn(
            'flex-shrink-0 w-14 h-14 rounded-xl',
            'flex items-center justify-center',
            allCompleted ? 'bg-white/20' : 'bg-muted'
          )}
          animate={
            canClaim
              ? {
                  rotate: [-5, 5, -5],
                  scale: [1, 1.05, 1],
                }
              : undefined
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Gift
            className={cn(
              'w-7 h-7',
              allCompleted ? 'text-white' : 'text-muted-foreground'
            )}
          />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className={cn(
              'font-bold text-lg',
              allCompleted ? 'text-white' : 'text-foreground'
            )}
          >
            {t('dailyQuests.bonusTitle')}
          </h3>
          <p
            className={cn(
              'text-sm',
              allCompleted ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            {t('dailyQuests.bonusDescription', { completed, total })}
          </p>
        </div>

        {/* Claim button or status */}
        <div className="flex-shrink-0">
          {canClaim ? (
            <motion.button
              onClick={onClaim}
              className={cn(
                'px-4 py-2 rounded-xl font-bold',
                'bg-white text-amber-600',
                'hover:bg-white/90 transition-colors'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              +{bonusXP} XP
            </motion.button>
          ) : allCompleted ? (
            <div className="flex items-center gap-1 text-white">
              <Check className="w-5 h-5" />
              <span className="font-bold">{t('common.claimed')}</span>
            </div>
          ) : (
            <div className="text-right">
              <span
                className={cn(
                  'text-2xl font-bold',
                  allCompleted ? 'text-white' : 'text-muted-foreground/50'
                )}
              >
                {completed}/{total}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(total)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              i < completed
                ? allCompleted
                  ? 'bg-white'
                  : 'bg-green-500'
                : allCompleted
                ? 'bg-white/30'
                : 'bg-muted-foreground/20'
            )}
            initial={i < completed ? { scale: 0 } : undefined}
            animate={i < completed ? { scale: 1 } : undefined}
            transition={{ delay: i * 0.1, type: 'spring' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default DailyQuestCard;
