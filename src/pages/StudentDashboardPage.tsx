import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, History, ArrowRight, Star, Award, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface StudentScore {
  id: string;
  points: number;
  created_at: string;
  quizzes: {
    title: string;
    access_code: string;
  };
}

const StudentDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('scores')
        .select(`
          id,
          points,
          created_at,
          quizzes (
            title,
            access_code
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student scores:', error);
      } else {
        setScores(data as any || []);
      }
      setLoading(false);
    };

    fetchStudentData();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4 text-center">
        <Loader2 className="text-primary animate-spin" size={48} />
        <p className="text-primary font-bold break-words">{t('studentDashboard.loading_achievements')}</p>
      </div>
    );
  }

  const totalPoints = scores.reduce((acc, s) => acc + s.points, 0);
  const avgScore = scores.length > 0 ? Math.round(totalPoints / scores.length) : 0;

  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_badges')
        .select('awarded_at, badges(*)')
        .eq('user_id', user.id);
      
      setUserBadges(data || []);
      setLoadingBadges(false);
    };
    fetchBadges();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('studentDashboard.title')} />

      <main className="flex-grow pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-[1000px] mx-auto w-full">
        <div className="flex flex-col gap-10">
          
          {/* Welcome Header */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="overflow-hidden w-full md:w-auto">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-on-background mb-2 break-words">
                {t('studentDashboard.hey')}, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base break-words">{t('studentDashboard.track_progress')}</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/join')}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md flex items-center gap-2 w-full md:w-auto justify-center whitespace-nowrap"
            >
              {t('studentDashboard.join_new')}
              <ArrowRight size={18} className="shrink-0" />
            </motion.button>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: <Star size={24} />, label: t('studentDashboard.total_points'), value: totalPoints, color: "bg-primary/10 text-primary" },
              { icon: <Trophy size={24} />, label: t('studentDashboard.quizzes_taken'), value: scores.length, color: "bg-tertiary/10 text-tertiary" },
              { icon: <Award size={24} />, label: t('studentDashboard.avg_score'), value: avgScore, color: "bg-secondary/10 text-secondary" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider truncate">{stat.label}</div>
                  <div className="text-xl md:text-2xl font-bold text-on-background">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Badges Section */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-heading font-bold text-on-background flex items-center gap-2 break-words">
              <Award size={24} className="text-tertiary shrink-0" />
              Achievements & Badges
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {loadingBadges ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface-container animate-pulse rounded-2xl"></div>)
              ) : userBadges.length === 0 ? (
                <div className="col-span-full p-8 bg-surface-container/20 rounded-2xl border-2 border-dashed border-surface-variant text-center">
                  <p className="text-on-surface-variant italic">No badges yet. Keep playing to earn them!</p>
                </div>
              ) : (
                userBadges.map((ub, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant shadow-sm flex flex-col items-center text-center gap-2 group hover:border-tertiary/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Award size={24} />
                    </div>
                    <div className="font-bold text-sm text-on-background">{ub.badges.name}</div>
                    <div className="text-[10px] text-on-surface-variant leading-tight">{ub.badges.description}</div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Quiz History */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-heading font-bold text-on-background flex items-center gap-2 break-words">
              <History size={24} className="text-primary shrink-0" />
              {t('studentDashboard.your_history')}
            </h2>

            {scores.length === 0 ? (
              <div className="bg-surface-container-lowest border-2 border-dashed border-surface-variant rounded-2xl p-8 md:p-12 text-center">
                <p className="text-on-surface-variant italic mb-6 break-words">{t('studentDashboard.no_quizzes')}</p>
                <button 
                  onClick={() => navigate('/join')}
                  className="text-primary font-bold hover:underline break-words"
                >
                  {t('studentDashboard.enter_code_begin')}
                </button>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4"
              >
                {scores.map((score) => (
                  <motion.div 
                    key={score.id}
                    variants={itemVariants}
                    className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden"
                  >
                    <div className="overflow-hidden w-full md:w-auto">
                      <h3 className="font-bold text-xl text-on-background mb-1 break-words">{score.quizzes.title}</h3>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-[10px] md:text-xs font-bold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded whitespace-nowrap">
                          {t('createQuiz.access_code')}: {score.quizzes.access_code}
                        </span>
                        <span className="text-[10px] md:text-xs text-on-surface-variant italic whitespace-nowrap">
                          {new Date(score.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-tighter truncate">{t('common.points')}</span>
                        <span className="text-2xl font-bold text-primary">{score.points}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/results/${score.quizzes.access_code}`)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-colors shrink-0"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboardPage;
