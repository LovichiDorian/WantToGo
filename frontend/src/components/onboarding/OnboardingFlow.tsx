import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Trophy, 
  Users, 
  ChevronRight, 
  Sparkles,
  Flame,
  Target,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface OnboardingSlide {
  id: number;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  xpTeaser: string;
  gradient: string;
  accentColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: <MapPin className="w-16 h-16" strokeWidth={1.5} />,
    titleKey: 'onboarding.slide1.title',
    descriptionKey: 'onboarding.slide1.description',
    xpTeaser: '+100 XP',
    gradient: 'from-cyan-500 to-blue-600',
    accentColor: 'text-cyan-400',
  },
  {
    id: 2,
    icon: <Trophy className="w-16 h-16" strokeWidth={1.5} />,
    titleKey: 'onboarding.slide2.title',
    descriptionKey: 'onboarding.slide2.description',
    xpTeaser: '+500 XP',
    gradient: 'from-amber-500 to-orange-600',
    accentColor: 'text-amber-400',
  },
  {
    id: 3,
    icon: <Users className="w-16 h-16" strokeWidth={1.5} />,
    titleKey: 'onboarding.slide3.title',
    descriptionKey: 'onboarding.slide3.description',
    xpTeaser: '+1000 XP',
    gradient: 'from-purple-500 to-pink-600',
    accentColor: 'text-purple-400',
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {[<Globe />, <Target />, <Flame />, <Sparkles />][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Skip button */}
      <div className="relative pt-safe px-4 pt-4 flex justify-end">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {t('onboarding.skip')}
        </Button>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="w-full max-w-sm flex flex-col items-center text-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Icon container */}
            <motion.div
              className={cn(
                'relative w-32 h-32 rounded-3xl flex items-center justify-center',
                'bg-gradient-to-br shadow-2xl text-white',
                slide.gradient
              )}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              {slide.icon}

              {/* Glow */}
              <motion.div
                className={cn(
                  'absolute -inset-4 rounded-3xl bg-gradient-to-br opacity-40 blur-xl -z-10',
                  slide.gradient
                )}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              {/* XP badge */}
              <motion.div
                className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-white shadow-lg"
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.4 }}
              >
                <span className="text-sm font-bold text-gradient-xp">
                  {slide.xpTeaser}
                </span>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="mt-8 text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t(slide.titleKey)}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="mt-4 text-lg text-white/80 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t(slide.descriptionKey)}
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              className="mt-6 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentSlide === 0 && (
                <>
                  <FeatureChip icon="📍" label={t('onboarding.features.saveLocations')} />
                  <FeatureChip icon="📸" label={t('onboarding.features.addPhotos')} />
                  <FeatureChip icon="📝" label={t('onboarding.features.takeNotes')} />
                </>
              )}
              {currentSlide === 1 && (
                <>
                  <FeatureChip icon="⭐" label={t('onboarding.features.earnXP')} />
                  <FeatureChip icon="🏆" label={t('onboarding.features.unlockBadges')} />
                  <FeatureChip icon="🔥" label={t('onboarding.features.buildStreaks')} />
                </>
              )}
              {currentSlide === 2 && (
                <>
                  <FeatureChip icon="👥" label={t('onboarding.features.addFriends')} />
                  <FeatureChip icon="🗺️" label={t('onboarding.features.shareTrips')} />
                  <FeatureChip icon="📊" label={t('onboarding.features.compete')} />
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="relative pb-safe px-6 pb-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'bg-white/40 hover:bg-white/60'
              )}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleNext}
            className={cn(
              'w-full h-14 text-lg font-semibold rounded-2xl',
              'bg-white text-slate-900 hover:bg-white/90',
              'shadow-xl shadow-black/20'
            )}
          >
            {currentSlide === slides.length - 1 ? (
              <>
                {t('onboarding.getStarted')}
                <Sparkles className="ml-2 w-5 h-5" />
              </>
            ) : (
              <>
                {t('onboarding.continue')}
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* First time bonus */}
        {currentSlide === slides.length - 1 && (
          <motion.p
            className="mt-4 text-center text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            🎁 {t('onboarding.welcomeBonus')}
          </motion.p>
        )}
      </div>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white/90"
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.span>
  );
}

export default OnboardingFlow;
