import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AuthPage = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  // Get the redirect path from location state, default to /dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          }
        });
        if (signUpError) throw signUpError;
        toast.success('Check your email for the confirmation link!', { duration: 5000 });
      }
      navigate(from);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Ensure the redirect URL is absolute and correctly formatted
      const baseUrl = window.location.origin;
      const targetPath = from.startsWith('/') ? from : `/${from}`;
      const finalRedirectUrl = `${baseUrl}${targetPath}`;

      console.log('Redirecting to:', finalRedirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: finalRedirectUrl
        }
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-margin-mobile">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-lg border border-surface-variant p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-heading text-on-background mb-2 break-words">
              {isLogin ? t('auth.welcome_back') : t('auth.create_account')}
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base">
              {isLogin 
                ? t('auth.prof_login_desc') 
                : t('auth.join_desc')}
            </p>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-14 bg-surface-container-lowest border-2 border-surface-variant rounded-xl flex items-center justify-center gap-3 font-bold text-on-background hover:bg-surface transition-all mb-6 shadow-sm px-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="truncate">{isLogin ? t('auth.google_login_btn') : t('auth.google_register_btn')}</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-surface-variant"></div>
            <span className="absolute bg-surface-container-lowest px-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
              {t('auth.or_email')}
            </span>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1 truncate">
                {t('common.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1 truncate">
                {t('common.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all text-sm md:text-base"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end -mt-2">
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
                >
                  {t('auth.forgot_password')}
                </button>
              </div>
            )}

            {error && <p className="text-error text-sm font-bold bg-error/5 p-3 rounded-lg border border-error/20 break-words">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 mt-2 px-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? t('auth.login_btn') : t('auth.signup_btn'))}
              {!loading && <ArrowRight size={20} className="shrink-0" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-surface-variant text-center">
            <p className="text-on-surface-variant mb-4 text-sm">
              {isLogin ? t('auth.no_account') : t('auth.has_account')}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline text-sm break-words"
            >
              {isLogin ? t('auth.register_prof') : t('auth.back_to_login')}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
