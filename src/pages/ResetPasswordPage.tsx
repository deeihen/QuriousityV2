import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      if (updateError) throw updateError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar title="Reset Password" />

      <main className="flex-grow flex items-center justify-center pt-20 px-margin-mobile">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-lg border border-surface-variant p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl font-heading text-on-background mb-4">Password Updated</h1>
              <p className="text-on-surface-variant mb-8">
                Your password has been reset successfully. You can now log in with your new credentials.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                Log In Now
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-heading text-on-background mb-2">New Password</h1>
                <p className="text-on-surface-variant">
                  Please enter your new password below.
                </p>
              </div>

              <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && <p className="text-error text-sm font-bold bg-error/5 p-3 rounded-lg border border-error/20">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
