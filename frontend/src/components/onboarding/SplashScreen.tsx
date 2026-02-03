import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MapPin, Plane, Compass, Globe } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center gradient-hero"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating pins */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + (i % 4) * 25}%`,
                  top: `${10 + Math.floor(i / 4) * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.4, 0.2],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              >
                <MapPin
                  className="text-white/20"
                  size={20 + Math.random() * 20}
                />
              </motion.div>
            ))}

            {/* Floating plane */}
            <motion.div
              className="absolute"
              initial={{ x: '-10%', y: '40%' }}
              animate={{ x: '110%', y: '30%' }}
              transition={{
                duration: 4,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              <Plane className="text-white/30 w-8 h-8 rotate-45" />
            </motion.div>

            {/* Gradient orbs */}
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
              style={{ left: '-10%', top: '20%' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
              style={{ right: '-10%', bottom: '10%' }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative flex flex-col items-center">
            {/* Logo animation */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              {/* Globe with glow */}
              <motion.div
                className="relative w-32 h-32"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 shadow-2xl" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/50 to-purple-500/50 backdrop-blur-sm" />
                <Globe className="absolute inset-4 w-24 h-24 text-white/90" strokeWidth={1} />
              </motion.div>

              {/* Orbiting pin */}
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  width: 160,
                  height: 160,
                  left: -14,
                  top: -14,
                }}
              >
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <MapPin className="w-6 h-6 text-cyan-400" fill="currentColor" />
                </motion.div>
              </motion.div>

              {/* Compass orbiting */}
              <motion.div
                className="absolute"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  width: 180,
                  height: 180,
                  left: -24,
                  top: -24,
                }}
              >
                <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <Compass className="w-5 h-5 text-purple-400" />
                </motion.div>
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/40 to-purple-500/40 blur-xl -z-10"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* App name */}
            <motion.h1
              className="mt-8 text-4xl font-black text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              WantToGo
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="mt-2 text-lg text-white/70 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Your travel adventure awaits ✨
            </motion.p>

            {/* Loading dots */}
            <motion.div
              className="mt-8 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/50"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
