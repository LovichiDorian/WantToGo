import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Eye, EyeOff, Mail, Lock, User, Sparkles, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name || undefined);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('exists')) {
        setError(t('auth.emailExists'));
      } else {
        setError(t('auth.registerError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Light gradient background */}
      <div className="absolute inset-0 gradient-light-bg dark:gradient-hero" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-400/20 dark:bg-purple-500/20 blur-3xl"
          style={{ top: '-15%', right: '-15%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-blue-400/20 dark:bg-cyan-500/20 blur-3xl"
          style={{ bottom: '-15%', left: '-15%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Floating pins */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <MapPin className="text-primary/30 dark:text-white/20" size={16 + Math.random() * 16} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Logo */}
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 3 }}
            animate={{
              boxShadow: [
                '0 0 25px rgba(139, 92, 246, 0.4)',
                '0 0 45px rgba(59, 130, 246, 0.5)',
                '0 0 25px rgba(139, 92, 246, 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <MapPin className="h-10 w-10 text-white" strokeWidth={2} />
          </motion.div>
          <h1 className="text-3xl font-black text-gradient tracking-tight">
            WantToGo
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('auth.createBucketList') || t('auth.registerSubtitle')}
          </p>
        </motion.div>

        {/* Welcome bonus badge */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200/50 dark:border-amber-500/30 shadow-lg">
            <Gift className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {t('onboarding.welcomeBonus')}
            </span>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-card-centered p-8">
            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-8 h-1.5 rounded-full bg-primary" />
              <div className="w-8 h-1.5 rounded-full bg-primary/30" />
              <div className="w-8 h-1.5 rounded-full bg-primary/30" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('auth.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-13 rounded-2xl pl-12 bg-white/50 dark:bg-background/50 border-gray-200/80 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-13 rounded-2xl pl-12 bg-white/50 dark:bg-background/50 border-gray-200/80 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  className="h-13 rounded-2xl pl-12 pr-12 bg-white/50 dark:bg-background/50 border-gray-200/80 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 px-2"
                >
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        passwordStrength === 'weak' && 'bg-red-500 w-1/3',
                        passwordStrength === 'medium' && 'bg-amber-500 w-2/3',
                        passwordStrength === 'strong' && 'bg-emerald-500 w-full'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }}
                    />
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    passwordStrength === 'weak' && 'text-red-500',
                    passwordStrength === 'medium' && 'text-amber-500',
                    passwordStrength === 'strong' && 'text-emerald-500'
                  )}>
                    {passwordStrength === 'weak' && 'Faible'}
                    {passwordStrength === 'medium' && 'Moyen'}
                    {passwordStrength === 'strong' && 'Fort'}
                  </span>
                </motion.div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-13 rounded-2xl pl-12 bg-white/50 dark:bg-background/50 border-gray-200/80 dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoComplete="new-password"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                )}
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
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
                      {t('auth.register')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                      <Sparkles className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Benefits list */}
            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-white/10">
              <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  100% Gratuit
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Hors-ligne
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Synchronisé
                </span>
              </div>
            </div>
          </div>

          {/* Login link */}
          <motion.p
            className="text-center text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('auth.hasAccount')}{' '}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {t('auth.login')}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
