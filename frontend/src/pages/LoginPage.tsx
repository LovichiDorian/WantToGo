import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
          style={{ top: '-10%', left: '-20%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
          style={{ bottom: '-10%', right: '-20%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
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
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <MapPin className="text-white/20" size={16 + Math.random() * 16} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Logo */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-2xl glow"
            whileHover={{ scale: 1.05, rotate: 5 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(14, 165, 233, 0.4)',
                '0 0 40px rgba(14, 165, 233, 0.6)',
                '0 0 20px rgba(14, 165, 233, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MapPin className="h-10 w-10 text-white" strokeWidth={2} />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight">WantToGo</h1>
          <p className="text-white/70 mt-2">{t('auth.loginSubtitle')}</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass-strong rounded-3xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-2xl pl-12 bg-background/50 border-white/10 focus:border-primary"
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
                  className="h-14 rounded-2xl pl-12 pr-12 bg-background/50 border-white/10 focus:border-primary"
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
                  className="text-sm text-red-400 text-center bg-red-500/10 rounded-xl p-3"
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
                    'gradient-primary text-white shadow-lg shadow-primary/30',
                    'hover:shadow-xl hover:shadow-primary/40 transition-shadow'
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {t('auth.login')}
                      <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Register link */}
          <motion.p
            className="text-center text-white/70 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('auth.noAccount')}{' '}
            <Link 
              to="/register" 
              className="text-white font-semibold hover:text-primary transition-colors"
            >
              {t('auth.register')}
            </Link>
          </motion.p>
        </motion.div>

        {/* XP teaser */}
        <motion.div
          className="mt-8 flex items-center gap-2 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('onboarding.welcomeBonus')}</span>
        </motion.div>
      </div>
    </div>
  );
}
