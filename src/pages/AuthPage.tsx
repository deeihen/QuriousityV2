import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        alert('Check your email for the confirmation link!');
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-20 px-margin-mobile">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-lg border border-surface-variant p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading text-on-background mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-on-surface-variant">
              {isLogin 
                ? 'Professors, login to manage your quizzes.' 
                : 'Join Quriousity to start creating interactive quizzes.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end -mt-2">
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && <p className="text-error text-sm font-bold bg-error/5 p-3 rounded-lg border border-error/20">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Sign Up')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-surface-variant text-center">
            <p className="text-on-surface-variant mb-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Register as a Professor' : 'Back to Login'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
