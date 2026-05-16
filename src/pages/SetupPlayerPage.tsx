import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, Shuffle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { checkRateLimit } from '../lib/security';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const SetupPlayerPage = () => {
  const { t } = useTranslation();
  const { code } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adjectives = ['Cool', 'Super', 'Mega', 'Swift', 'Bright', 'Golden', 'Epic'];
  const nouns = ['Panda', 'Eagle', 'Owl', 'Fox', 'Tiger', 'Lion', 'Star'];

  const generateRandomName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 99);
    setName(`${adj}${noun}${num}`);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && !isSubmitting) {
      // Security: Prevent spamming lobby joins (5 second cooldown)
      if (!checkRateLimit('setup-player', 5000)) {
        toast.error('Please wait a moment before trying again.');
        return;
      }

      setIsSubmitting(true);
      try {
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('id, user_id')
          .eq('access_code', code)
          .single();

        if (quizData) {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.id === quizData.user_id) {
            navigate(`/quiz/${code}/lobby`);
            return;
          }

          await supabase.from('lobby_participants').insert([{
            quiz_id: quizData.id,
            player_name: name.trim(),
            user_id: user?.id || null
          }]);

          localStorage.setItem('quriousity_player_name', name.trim());
          navigate(`/quiz/${code}/lobby`);
        } else {
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/join" title={t('joinQuiz.title')} />

      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-margin-mobile">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant p-6 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <User size={32} className="md:w-10 md:h-10" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-heading text-on-background mb-2 break-words"
          >
            {t('setupPlayer.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base text-on-surface-variant mb-8 break-words"
          >
            {t('setupPlayer.desc')}
          </motion.p>

          <form onSubmit={handleJoin} className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <input 
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder={t('setupPlayer.nickname_placeholder')}
                className="w-full h-14 bg-surface border-2 border-surface-variant rounded-xl px-4 pr-12 font-bold text-base md:text-lg focus:border-primary focus:outline-none transition-all truncate"
                maxLength={15}
                required
              />
              <motion.button 
                whileHover={{ rotate: 180 }}
                type="button"
                onClick={generateRandomName}
                className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all shrink-0"
                title={t('setupPlayer.random_name')}
              >
                <Shuffle size={18} />
              </motion.button>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!name.trim()}
              className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {t('setupPlayer.start_quiz')}
              <ArrowRight size={20} className="shrink-0" />
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default SetupPlayerPage;
