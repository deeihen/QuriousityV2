import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { checkRateLimit } from '../lib/security';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JoinQuizPage = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalCode = code.join('');
    if (finalCode.length === 6) {
      // Security: Prevent rapid-fire attempts (brute force protection)
      if (!checkRateLimit('join-quiz', 2000)) {
        setError('Too many attempts. Please wait a moment.');
        return;
      }

      setLoading(true);
      setError('');
      
      const { data: quizData, error: sbError } = await supabase
        .from('quizzes')
        .select('id, user_id, status')
        .eq('access_code', finalCode)
        .maybeSingle();

      if (sbError || !quizData) {
        setLoading(false);
        setError(t('joinQuiz.invalid_code'));
        return;
      }

      // Check if session is completed
      if (quizData.status === 'completed') {
        setLoading(false);
        setError(t('joinQuiz.quiz_completed'));
        return;
      }

      // Check if current user is the creator
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === quizData.user_id) {
        setLoading(false);
        // Redirect creator to lobby instead of blocking
        navigate(`/quiz/${finalCode}/lobby`);
        return;
      }

      setLoading(false);
      navigate(`/quiz/${finalCode}/setup`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body antialiased">
      <Navbar showBackButton backUrl="/" title={t('joinQuiz.title')} />

      <main className="flex-grow flex items-center justify-center pt-24 pb-20 px-margin-mobile md:px-margin-desktop">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[600px] bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant p-6 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-tertiary"></div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-tertiary/5 rounded-full blur-2xl pointer-events-none"></div>

          <h1 className="text-3xl md:text-5xl font-heading text-on-background mb-4 break-words px-2">{t('joinQuiz.ready_play')}</h1>
          <p className="text-base md:text-lg text-on-surface-variant mb-10 break-words">{t('joinQuiz.enter_code_desc')}</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 w-full max-w-[500px] mx-auto">
            <div className="w-full overflow-hidden">
              <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap py-4">
                {code.map((digit, idx) => (
                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    key={idx}
                    ref={(el) => { inputs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24 text-center text-2xl sm:text-3xl md:text-4xl font-heading bg-surface border-2 rounded-xl focus:ring-0 focus:outline-none transition-all shadow-sm shrink-0 ${
                      error ? 'border-error bg-error/5' : 'border-surface-variant focus:border-primary focus:bg-surface-container-lowest shadow-md'
                    }`}
                    placeholder="-"
                    disabled={loading}
                  />
                ))}
              </div>
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-error text-sm font-bold mt-4 animate-pulse break-words px-4">{error}</motion.p>}
            </div>

            <div className="w-full flex flex-col gap-4 mt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || code.some(d => !d)}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? <Loader2 className="animate-spin shrink-0" /> : t('joinQuiz.join_game')}
                {!loading && <ArrowRight size={20} className="shrink-0" />}
              </motion.button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-surface-variant"></div>
                <span className="flex-shrink-0 mx-4 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{t('common.or')}</span>
                <div className="flex-grow border-t border-surface-variant"></div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 124, 89, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full h-12 bg-transparent text-primary border-2 border-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2 px-4 whitespace-nowrap"
              >
                <LinkIcon size={18} className="shrink-0" />
                {t('joinQuiz.join_link')}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinQuizPage;
