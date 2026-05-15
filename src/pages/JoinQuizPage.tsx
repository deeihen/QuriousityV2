import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Link as LinkIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JoinQuizPage = () => {
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
      setLoading(true);
      setError('');
      
      const { data, error: sbError } = await supabase
        .from('quizzes')
        .select('id')
        .eq('access_code', finalCode)
        .maybeSingle();

      setLoading(false);

      if (sbError || !data) {
        setError('Invalid access code. Please try again.');
        return;
      }

      navigate(`/quiz/${finalCode}/setup`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body antialiased">
      <Navbar showBackButton backUrl="/" title="Join Quiz" />

      <main className="flex-grow flex items-center justify-center pt-20 md:pt-24 pb-20 md:pb-16 px-margin-mobile md:px-margin-desktop">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[600px] bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-tertiary"></div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-tertiary/5 rounded-full blur-2xl pointer-events-none"></div>

          <h1 className="text-4xl md:text-5xl font-heading text-on-background mb-4">Ready to Play?</h1>
          <p className="text-lg text-on-surface-variant mb-10">Enter the 6-digit access code provided by your instructor to join the quiz session.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 w-full max-w-[400px] mx-auto">
            <div className="w-full">
              <div className="flex justify-between gap-2 md:gap-4">
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
                    className={`w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-20 text-center text-2xl sm:text-3xl font-heading bg-surface border-2 rounded-xl focus:ring-0 focus:outline-none transition-all shadow-sm ${
                      error ? 'border-error bg-error/5' : 'border-surface-variant focus:border-primary focus:bg-surface-container-lowest'
                    }`}
                    placeholder="-"
                    disabled={loading}
                  />
                ))}
              </div>
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-error text-sm font-bold mt-4 animate-pulse">{error}</motion.p>}
            </div>

            <div className="w-full flex flex-col gap-4 mt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || code.some(d => !d)}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Join Game'}
                {!loading && <ArrowRight size={20} />}
              </motion.button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-surface-variant"></div>
                <span className="flex-shrink-0 mx-4 text-on-surface-variant text-xs font-bold uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-surface-variant"></div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 124, 89, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full h-12 bg-transparent text-primary border-2 border-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LinkIcon size={20} />
                Join via Link
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
