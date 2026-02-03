import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Light gradient background */}
      <div className="absolute inset-0 gradient-light-bg dark:gradient-hero" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/20 dark:bg-cyan-500/20 blur-3xl"
          style={{ top: '-15%', left: '-15%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-400/20 dark:bg-purple-500/20 blur-3xl"
          style={{ bottom: '-15%', right: '-15%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Floating pins - more subtle in light mode */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <MapPin className="text-primary/30 dark:text-white/20" size={18 + Math.random() * 14} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Logo */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 3 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(59, 130, 246, 0.4)',
                '0 0 50px rgba(139, 92, 246, 0.5)',
                '0 0 30px rgba(59, 130, 246, 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <MapPin className="h-12 w-12 text-white" strokeWidth={2} />
          </motion.div>
          <h1 className="text-4xl font-black text-gradient tracking-tight">
            WantToGo
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {t('auth.adventureBegins') || 'Ton aventure commence ici'}
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-card-centered p-8">
            {/* XP Teaser Badge */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-8 -mt-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200/50 dark:border-amber-500/30">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  {t('onboarding.welcomeBonus')}
                </span>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-2xl pl-12 bg-white/50 dark:bg-background/50 border-gray-200/80 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-2xl pl-12 pr-12 bg-white/50 dark:bg-background/50 border-gray-200/80 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-500/10 rounded-xl p-3 border border-red-200 dark:border-red-500/20"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className={cn(
                    'w-full h-14 rounded-2xl text-base font-semibold',
                    'gradient-primary text-white',
                    'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-glow',
                    'transition-shadow duration-300'
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {t('auth.continueWithEmail') || t('auth.login')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider - Social login prep */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-card text-muted-foreground">
                  {t('common.comingSoon')}: Apple & Google
                </span>
              </div>
            </div>

            {/* Social buttons placeholder */}
            <div className="grid grid-cols-2 gap-3 opacity-50 pointer-events-none">
              <div className="h-12 rounded-xl bg-gray-100 dark:bg-muted/30 flex items-center justify-center gap-2">
                <span className="text-lg">🍎</span>
                <span className="text-sm font-medium text-muted-foreground">Apple</span>
              </div>
              <div className="h-12 rounded-xl bg-gray-100 dark:bg-muted/30 flex items-center justify-center gap-2">
                <span className="text-lg">🔵</span>
                <span className="text-sm font-medium text-muted-foreground">Google</span>
              </div>
            </div>
          </div>

          {/* Register link */}
          <motion.p
            className="text-center text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {t('auth.register')}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
