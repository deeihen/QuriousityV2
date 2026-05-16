import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, BarChart3, ArrowRight, Home, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

interface ScoreEntry {
  player_name: string;
  points: number;
}

const ResultsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { code } = useParams();
  const location = useLocation();
  const { finalScore, playerName } = location.state || { finalScore: 0, playerName: 'You' };

  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizId = async () => {
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('id')
        .eq('access_code', code)
        .maybeSingle();

      if (quizData) {
        setQuizId(quizData.id);
        fetchLeaderboard(quizData.id);
      } else {
        setLoading(false);
      }
    };

    fetchQuizId();
  }, [code]);

  const fetchLeaderboard = async (id: string) => {
    const { data: scoresData } = await supabase
      .from('scores')
      .select('player_name, points')
      .eq('quiz_id', id)
      .order('points', { ascending: false })
      .limit(5);

    if (scoresData) {
      setLeaderboard(scoresData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!quizId) return;

    const channel = supabase
      .channel(`quiz-scores-${quizId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scores',
          filter: `quiz_id=eq.${quizId}`,
        },
        () => {
          fetchLeaderboard(quizId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [quizId]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    const awardBadges = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch user's current badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);
      
      const existingBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

      // 2. Fetch all available badges
      const { data: allBadges } = await supabase.from('badges').select('*');
      if (!allBadges) return;

      // 3. Fetch user stats
      const { data: userScores } = await supabase
        .from('scores')
        .select('points')
        .eq('user_id', user.id);

      const totalQuizzes = userScores?.length || 0;
      const totalPoints = userScores?.reduce((acc, s) => acc + s.points, 0) || 0;
      const maxScore = Math.max(...(userScores?.map(s => s.points) || [0]));

      // 4. Evaluate criteria
      const newBadgeInserts = [];
      for (const badge of allBadges) {
        if (existingBadgeIds.has(badge.id)) continue;

        let qualified = false;
        if (badge.criteria_type === 'quizzes_completed' && totalQuizzes >= badge.criteria_value) qualified = true;
        if (badge.criteria_type === 'total_points' && totalPoints >= badge.criteria_value) qualified = true;
        if (badge.criteria_type === 'perfect_score' && maxScore >= badge.criteria_value) qualified = true;

        if (qualified) {
          newBadgeInserts.push({ user_id: user.id, badge_id: badge.id });
          toast.success(`New Badge Earned: ${badge.name}!`, { icon: '🏅', duration: 4000 });
        }
      }

      if (newBadgeInserts.length > 0) {
        await supabase.from('user_badges').insert(newBadgeInserts);
      }
    };

    awardBadges();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-body bg-background text-on-background">
      <Navbar showBackButton backUrl="/" title={t('common.score')} />

      <main className="flex-grow pt-20 md:pt-24 pb-20 md:pb-12 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full flex flex-col gap-8">
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-4 py-8 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm relative overflow-hidden px-4"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary to-primary"></div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Trophy size={64} className="text-tertiary mb-2" fill="currentColor" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading text-primary break-words max-w-full"
          >
            {t('results.congratulations')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg text-on-surface-variant break-words max-w-full"
          >
            {t('results.completed_desc', { name: playerName })}
          </motion.p>
          <div className="mt-6 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight text-primary"
            >
              {finalScore}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-widest mt-2"
            >
              {t('results.total_points')}
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4 md:p-6 shadow-sm"
        >
          <h2 className="text-lg md:text-xl font-heading font-bold text-on-background mb-6 flex items-center gap-2 break-words">
            <BarChart3 size={24} className="text-primary shrink-0" />
            {t('results.top_performances')}
          </h2>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-8"
              >
                <Loader2 className="animate-spin text-primary" />
              </motion.div>
            ) : (
              <motion.div 
                key="leaderboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className={`flex items-center justify-between p-3 md:p-4 rounded-lg border transition-all gap-4 ${
                        item.player_name === playerName && item.points === finalScore 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-surface border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                        <span className="text-xs font-bold w-4 text-center text-on-surface-variant shrink-0">
                          {idx + 1}
                        </span>
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shrink-0 ${
                          idx === 0 ? 'bg-tertiary text-on-tertiary' : 'bg-primary/20 text-primary'
                        }`}>
                          {getInitials(item.player_name)}
                        </div>
                        <span className={`text-sm md:text-base font-bold truncate ${
                          item.player_name === playerName && item.points === finalScore ? 'text-primary' : 'text-on-background'
                        }`}>
                          {item.player_name}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm font-bold text-on-surface-variant shrink-0">
                        {item.points} {t('common.points')}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-on-surface-variant py-4 italic text-sm">No scores yet. Be the first!</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex-1 h-14 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md px-4 text-center whitespace-nowrap"
          >
            Play Again
            <ArrowRight size={20} className="shrink-0" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 124, 89, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex-1 h-14 bg-transparent text-primary border-2 border-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all px-4 text-center whitespace-nowrap"
          >
            <Home size={20} className="shrink-0" />
            {t('navbar.home')}
          </motion.button>
        </motion.section>
      </main>
    </div>
  );
};

export default ResultsPage;
