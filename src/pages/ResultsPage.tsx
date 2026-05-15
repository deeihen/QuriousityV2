import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, BarChart3, ArrowRight, Home, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface ScoreEntry {
  player_name: string;
  points: number;
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const location = useLocation();
  const { finalScore, playerName } = location.state || { finalScore: 0, playerName: 'You' };

  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('id')
        .eq('access_code', code)
        .maybeSingle();

      if (quizData) {
        const { data: scoresData } = await supabase
          .from('scores')
          .select('player_name, points')
          .eq('quiz_id', quizData.id)
          .order('points', { ascending: false })
          .limit(5);

        if (scoresData) {
          setLeaderboard(scoresData);
        }
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [code]);

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

  return (
    <div className="flex flex-col min-h-screen font-body bg-background text-on-background">
      <Navbar />

      <main className="flex-grow pt-20 md:pt-24 pb-20 md:pb-12 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full flex flex-col gap-8">
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-4 py-8 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm relative overflow-hidden"
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
            className="text-4xl md:text-5xl font-heading text-primary"
          >
            Congratulations!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-on-surface-variant"
          >
            {playerName}, you've completed the quiz!
          </motion.p>
          <div className="mt-6 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
              className="text-7xl font-extrabold leading-none tracking-tight text-primary"
            >
              {finalScore}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mt-2"
            >
              Total Points
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-heading font-bold text-on-background mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-primary" />
            Top Performances
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
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        item.player_name === playerName && item.points === finalScore 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-surface border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold w-4 text-center text-on-surface-variant">
                          {idx + 1}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          idx === 0 ? 'bg-tertiary text-on-tertiary' : 'bg-primary/20 text-primary'
                        }`}>
                          {getInitials(item.player_name)}
                        </div>
                        <span className={`text-base font-bold ${
                          item.player_name === playerName && item.points === finalScore ? 'text-primary' : 'text-on-background'
                        }`}>
                          {item.player_name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">
                        {item.points} pts
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-on-surface-variant py-4 italic">No scores yet. Be the first!</p>
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
            className="flex-1 h-14 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            Play Again
            <ArrowRight size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 124, 89, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex-1 h-14 bg-transparent text-primary border-2 border-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Home size={20} />
            Return to Home
          </motion.button>
        </motion.section>
      </main>
    </div>
  );
};

export default ResultsPage;
