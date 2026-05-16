import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, 
  BarChart, CheckCircle2, History, PlusCircle, Award, Star, ArrowRight, Loader2, Play
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// --- Sub-components (Defined here to ensure availability) ---

const AnalyticsCard = ({ title, value, icon, color }: any) => (
  <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant shadow-sm flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center ${color}`}>{icon}</div>
    <div className="overflow-hidden">
      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest truncate">{title}</div>
      <div className="text-xl font-black text-on-background">{value ?? 0}</div>
    </div>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm flex flex-col gap-6 h-full min-h-[300px]">
    <h3 className="font-bold text-on-surface-variant text-sm uppercase tracking-widest">{title}</h3>
    <div className="flex-grow w-full h-[200px]">{children}</div>
  </div>
);

const StatItem = ({ label, value, icon, color }: any) => (
  <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    <div className="overflow-hidden">
      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest truncate">{label}</div>
      <div className="text-2xl font-black text-on-background">{value ?? 0}</div>
    </div>
  </div>
);

// --- Main Page Component ---

interface ParticipantScore {
  player_name: string;
  points: number;
  created_at: string;
}

interface QuestionDetail {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
}

interface ResponseDetail {
  question_id: string;
  is_correct: boolean;
  time_taken: number;
}

interface Quiz {
  id: string;
  title: string;
  access_code: string;
  created_at: string;
  status: 'waiting' | 'live' | 'completed';
}

interface StudentScore {
  id: string;
  points: number;
  created_at: string;
  quizzes: {
    title: string;
    access_code: string;
  };
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // App State
  const [activeTab, setActiveTab] = useState<'quizzes' | 'activity' | 'discover'>('quizzes');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Quizzes State (Professor View)
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [officialQuizzes, setOfficialQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [scores, setScores] = useState<ParticipantScore[]>([]);
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [responses, setResponses] = useState<ResponseDetail[]>([]);

  // Activity State (Student View)
  const [studentScores, setStudentScores] = useState<StudentScore[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          navigate('/auth');
          return;
        }
        setUser(authUser);

        // Parallel fetch for speed
        const [profileRes, quizzesRes, takenRes, badgesRes, officialRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', authUser.id).maybeSingle(),
          supabase.from('quizzes').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }),
          supabase.from('scores').select('id, points, created_at, quizzes(title, access_code)').eq('user_id', authUser.id).order('created_at', { ascending: false }),
          supabase.from('user_badges').select('awarded_at, badges(*)').eq('user_id', authUser.id),
          supabase.from('quizzes').select('*').eq('is_official', true)
        ]);

        setProfile(profileRes.data);
        setQuizzes(quizzesRes.data || []);
        setStudentScores(takenRes.data as any || []);
        setUserBadges(badgesRes.data || []);
        setOfficialQuizzes(officialRes.data || []);
      } catch (err) {
        console.error('Init Error:', err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [navigate]);

  const fetchInsights = async (quiz: Quiz) => {
    if (!quiz?.id) return;
    setSelectedQuiz(quiz);
    setLoadingInsights(true);
    try {
      const [scoresRes, questionsRes, responsesRes] = await Promise.all([
        supabase.from('scores').select('player_name, points, created_at').eq('quiz_id', quiz.id).order('points', { ascending: false }),
        supabase.from('questions').select('id, question_text, options, correct_index').eq('quiz_id', quiz.id),
        supabase.from('responses').select('question_id, is_correct, time_taken').eq('quiz_id', quiz.id)
      ]);

      setScores(scoresRes.data || []);
      setQuestions(questionsRes.data || []);
      setResponses(responsesRes.data || []);
    } catch (err) {
      console.error('Insights Error:', err);
      toast.error('Failed to load quiz insights.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleEndSession = async (quizId: string) => {
    try {
      const { error } = await supabase.from('quizzes').update({ status: 'completed' }).eq('id', quizId);
      if (error) throw error;
      toast.success('Session ended');
      setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, status: 'completed' } : q));
      if (selectedQuiz?.id === quizId) {
        setSelectedQuiz(prev => prev ? { ...prev, status: 'completed' } : null);
      }
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

  const handleRestartSession = async (quiz: Quiz) => {
    try {
      const { error } = await supabase.from('quizzes').update({ status: 'waiting' }).eq('id', quiz.id);
      if (error) throw error;
      await supabase.from('lobby_participants').delete().eq('quiz_id', quiz.id);
      toast.success('Session restarted');
      navigate(`/quiz/${quiz.access_code}/lobby`);
    } catch (err) {
      toast.error('Failed to restart session');
    }
  };

  // Helper calculations
  const calculateLevel = (xp: number) => Math.floor((xp || 0) / 1000) + 1;
  const getXPProgress = (xp: number) => {
    const progress = (((xp || 0) % 1000) / 1000) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getScoreDistribution = () => {
    if (!scores || scores.length === 0) return [];
    const maxScore = (questions?.length || 1) * 120;
    const buckets = [
      { name: '0-20%', range: [0, maxScore * 0.2], count: 0 },
      { name: '21-40%', range: [maxScore * 0.2, maxScore * 0.4], count: 0 },
      { name: '41-60%', range: [maxScore * 0.4, maxScore * 0.6], count: 0 },
      { name: '61-80%', range: [maxScore * 0.6, maxScore * 0.8], count: 0 },
      { name: '81-100%', range: [maxScore * 0.8, Infinity], count: 0 },
    ];
    scores.forEach(s => {
      const points = s.points ?? 0;
      for (const bucket of buckets) {
        if (points >= bucket.range[0] && points < bucket.range[1]) {
          bucket.count++;
          break;
        }
      }
    });
    return buckets;
  };

  const getTimeData = () => {
    if (!questions || questions.length === 0) return [];
    return questions.map((q, idx) => {
      const qResponses = (responses || []).filter(r => r.question_id === q.id);
      const avgTime = qResponses.length > 0 ? qResponses.reduce((acc, r) => acc + (r.time_taken || 0), 0) / qResponses.length : 0;
      return { name: `Q${idx + 1}`, time: Math.round(avgTime * 10) / 10 };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="text-primary animate-spin" size={48} />
        <p className="text-primary font-bold">{t('common.loading')}</p>
      </div>
    );
  }

  const currentLevel = calculateLevel(profile?.xp || 0);
  const xpProgress = getXPProgress(profile?.xp || 0);
  const avgPerformance = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+(b.points ?? 0),0)/scores.length) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('dashboard.title')} />

      <main className="flex-grow pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col gap-10">
          
          {/* Header Stats */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-surface-variant shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col gap-1 overflow-hidden w-full md:w-auto">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{t('common.welcome')}</span>
              <h1 className="text-3xl md:text-4xl font-black text-on-background truncate">
                {user?.email?.split('@')?.[0] || 'User'}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-tertiary font-black">
                  <span>🔥 {profile?.streak_count || 0} Day Streak</span>
                </div>
                <div className="h-4 w-px bg-surface-variant"></div>
                <div className="text-on-surface-variant text-sm font-bold">
                  Lv. {currentLevel} • {(profile?.xp || 0).toLocaleString()} XP
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-64 flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                <span>Level {currentLevel} Progress</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden border border-surface-variant/50 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  className="h-full bg-primary rounded-full shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="flex border-b border-surface-variant gap-8 overflow-x-auto no-scrollbar scroll-smooth">
            <button 
              onClick={() => setActiveTab('quizzes')}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'quizzes' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {t('dashboard.quiz_history')}
              {activeTab === 'quizzes' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'activity' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {t('studentDashboard.title')}
              {activeTab === 'activity' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('discover')}
              className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'discover' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {t('dashboard.discover')}
              {activeTab === 'discover' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'quizzes' ? (
              <motion.div 
                key="quizzes" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Created Quizzes List */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm overflow-hidden flex flex-col h-auto md:max-h-[600px]">
                    <div className="p-5 border-b border-surface-variant bg-surface-container/30 flex justify-between items-center">
                      <h3 className="font-bold text-on-background flex items-center gap-2">
                        <History size={18} className="text-primary" />
                        Created Quizzes
                      </h3>
                      <button onClick={() => navigate('/create')} className="p-2 bg-primary text-on-primary rounded-full hover:scale-110 transition-transform">
                        <PlusCircle size={18} />
                      </button>
                    </div>
                    <div className="overflow-y-auto">
                      {quizzes.length === 0 ? (
                        <div className="p-10 text-center text-on-surface-variant italic">No quizzes created yet.</div>
                      ) : (
                        quizzes.map(quiz => (
                          <div 
                            key={quiz.id} 
                            onClick={() => fetchInsights(quiz)}
                            className={`p-5 border-b border-surface-variant last:border-0 hover:bg-primary/5 cursor-pointer transition-all ${selectedQuiz?.id === quiz.id ? 'bg-primary/5 border-l-4 border-l-primary pl-4' : ''}`}
                          >
                            <h4 className="font-bold text-on-background mb-1 truncate">{quiz.title || 'Untitled Quiz'}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container text-on-surface-variant rounded uppercase tracking-tighter">
                                {quiz.access_code}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${quiz.status === 'live' ? 'bg-error text-on-error animate-pulse' : 'bg-surface-variant text-on-surface-variant'}`}>
                                {quiz.status || 'waiting'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Quiz Insights Area */}
                <div className="lg:col-span-8">
                  {!selectedQuiz ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl border-2 border-dashed border-surface-variant text-on-surface-variant gap-4 p-10 text-center">
                      <BarChart size={48} className="opacity-20" />
                      <p className="font-medium">Select a quiz to view detailed performance insights.</p>
                    </div>
                  ) : loadingInsights ? (
                    <div className="h-full min-h-[400px] flex flex-col gap-6">
                      <div className="h-20 bg-surface-container rounded-2xl animate-pulse" />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-surface-container rounded-2xl animate-pulse" />
                        <div className="h-24 bg-surface-container rounded-2xl animate-pulse" />
                        <div className="h-24 bg-surface-container rounded-2xl animate-pulse" />
                      </div>
                      <div className="h-64 bg-surface-container rounded-2xl animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {/* Insights Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="overflow-hidden">
                          <h2 className="text-2xl font-black text-on-background break-words">{selectedQuiz.title || 'Untitled Quiz'}</h2>
                          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">
                            Session: <span className="text-primary">{selectedQuiz.access_code}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => navigate(`/quiz/${selectedQuiz.access_code}/lobby`)} 
                             className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold shadow-sm hover:bg-primary/20 transition-all flex items-center gap-2"
                           >
                             <Play size={14} />
                             {t('dashboard.enter_lobby') || 'Enter Lobby'}
                           </button>
                           {selectedQuiz.status === 'live' ? (
                             <button onClick={() => handleEndSession(selectedQuiz.id)} className="px-4 py-2 bg-error text-on-error rounded-xl text-xs font-bold shadow-sm">End Session</button>
                           ) : (
                             <button onClick={() => handleRestartSession(selectedQuiz)} className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm">Restart</button>
                           )}
                        </div>
                      </div>

                      {/* Charts Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AnalyticsCard title="Participants" value={scores.length} icon={<Users size={18} />} color="text-primary" />
                        <AnalyticsCard title="Avg Score" value={avgPerformance} icon={<Trophy size={18} />} color="text-tertiary" />
                        <AnalyticsCard title="Questions" value={questions.length} icon={<BarChart size={18} />} color="text-secondary" />
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ChartCard title="Score Distribution">
                          {getScoreDistribution().length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsBarChart data={getScoreDistribution()}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor'}} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}} 
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-on-surface-variant text-xs italic">No participants yet</div>
                          )}
                        </ChartCard>
                        <ChartCard title="Time Spent (sec)">
                          {getTimeData().length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={getTimeData()}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor'}} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}} 
                                />
                                <Line type="monotone" dataKey="time" stroke="var(--secondary)" strokeWidth={3} dot={{r: 4, fill: 'var(--secondary)'}} />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-on-surface-variant text-xs italic">No response data</div>
                          )}
                        </ChartCard>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : activeTab === 'activity' ? (
              <motion.div 
                key="activity" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-10"
              >
                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatItem label="Total XP Earned" value={(profile?.xp || 0).toLocaleString()} icon={<Star />} color="bg-primary/10 text-primary" />
                  <StatItem label="Quizzes Completed" value={studentScores.length} icon={<CheckCircle2 />} color="bg-tertiary/10 text-tertiary" />
                  <StatItem label="Active Badges" value={userBadges.length} icon={<Award />} color="bg-secondary/10 text-secondary" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Recent History */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-on-background flex items-center gap-2">
                      <History size={22} className="text-primary" />
                      Recent Activity
                    </h3>
                    {studentScores.length === 0 ? (
                      <div className="bg-surface-container-lowest border-2 border-dashed border-surface-variant rounded-3xl p-12 text-center text-on-surface-variant italic">
                        You haven't participated in any quizzes yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {studentScores.map(score => (
                          <div key={score.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-primary/50 transition-colors">
                            <div className="overflow-hidden text-center md:text-left">
                              <h4 className="font-bold text-lg text-on-background mb-1">{score.quizzes?.title || 'Unknown Quiz'}</h4>
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{score.created_at ? new Date(score.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Score</div>
                                <div className="text-2xl font-black text-primary">{score.points ?? 0} pts</div>
                              </div>
                              <button onClick={() => navigate(`/results/${score.quizzes?.access_code || ''}`)} className="p-3 bg-primary/5 text-primary rounded-full hover:bg-primary/10 transition-colors">
                                <ArrowRight size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Badges Column */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-on-background flex items-center gap-2">
                      <Award size={22} className="text-tertiary" />
                      Badges
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {userBadges.length === 0 ? (
                        <div className="col-span-full p-6 bg-surface-container/20 border-2 border-dashed border-surface-variant rounded-2xl text-center text-xs text-on-surface-variant italic">
                          Keep playing to earn badges!
                        </div>
                      ) : (
                        userBadges.map((ub, i) => (
                          <div key={i} className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant shadow-sm flex flex-col items-center text-center gap-2 group">
                            <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                              <Award size={24} />
                            </div>
                            <span className="font-bold text-[10px] text-on-background leading-tight truncate w-full">{ub.badges?.name || 'Badge'}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="discover" 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-black text-on-background">{t('dashboard.featured_quizzes')}</h3>
                  <p className="text-on-surface-variant text-sm">Ready-to-play sample quizzes provided by Quriousity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {officialQuizzes.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-on-surface-variant italic">No featured quizzes available right now.</div>
                  ) : (
                    officialQuizzes.map(quiz => (
                      <div key={quiz.id} className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full self-start">Official</span>
                          <h4 className="text-lg font-black text-on-background leading-tight">{quiz.title}</h4>
                        </div>

                        <div className="relative z-10 mt-auto flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Access Code</span>
                            <span className="font-black text-primary">{quiz.access_code}</span>
                          </div>
                          <button 
                            onClick={() => navigate(`/quiz/${quiz.access_code}/setup`)}
                            className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                          >
                            {t('dashboard.play_now')}
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
