import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Trophy, Users, 
  FileSpreadsheet, BarChart, CheckCircle2, History, ChevronRight, PlusCircle, Timer, Play,
  RotateCcw, StopCircle
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [scores, setScores] = useState<ParticipantScore[]>([]);
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [responses, setResponses] = useState<ResponseDetail[]>([]);
  const [error, setError] = useState('');

  const fetchQuizHistory = async () => {
    setLoadingHistory(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setQuizzes(data as Quiz[] || []);
    } catch (err: unknown) {
      setError('Error fetching history: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleEndSession = async (quizId: string) => {
    const { error: updateError } = await supabase
      .from('quizzes')
      .update({ status: 'completed' })
      .eq('id', quizId);

    if (updateError) {
      toast.error('Failed to end session');
    } else {
      toast.success('Session ended successfully');
      fetchQuizHistory();
    }
  };

  const handleRestartSession = async (quiz: Quiz) => {
    // 1. Reset status
    const { error: updateError } = await supabase
      .from('quizzes')
      .update({ status: 'waiting' })
      .eq('id', quiz.id);

    if (updateError) {
      toast.error('Failed to restart session');
      return;
    }

    // 2. Clear lobby participants for this quiz
    await supabase
      .from('lobby_participants')
      .delete()
      .eq('quiz_id', quiz.id);

    toast.success('Session restarted! Redirecting to lobby...');
    navigate(`/quiz/${quiz.access_code}/lobby`);
  };

  useEffect(() => {
    const init = async () => {
      await fetchQuizHistory();
    };
    init();
  }, []);

  const fetchInsights = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setLoadingInsights(true);
    setError('');
    setScores([]);
    setQuestions([]);
    setResponses([]);

    try {
      // Fetch scores, questions, and responses in parallel
      const [scoresRes, questionsRes, responsesRes] = await Promise.all([
        supabase.from('scores').select('player_name, points, created_at').eq('quiz_id', quiz.id).order('points', { ascending: false }),
        supabase.from('questions').select('id, question_text, options, correct_index').eq('quiz_id', quiz.id),
        supabase.from('responses').select('question_id, is_correct, time_taken').eq('quiz_id', quiz.id)
      ]);

      if (scoresRes.error) throw scoresRes.error;
      if (questionsRes.error) throw questionsRes.error;
      if (responsesRes.error) throw responsesRes.error;

      setScores(scoresRes.data || []);
      setQuestions(questionsRes.data || []);
      setResponses(responsesRes.data || []);
    } catch (err: unknown) {
      setError('Error fetching data: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoadingInsights(false);
    }
  };

  const getScoreDistribution = () => {
    if (scores.length === 0) return [];
    
    // Create 5 buckets: 0-20%, 21-40%, etc.
    const maxScore = questions.length * 120; // Approx max possible
    const buckets = [
      { name: '0-20%', range: [0, maxScore * 0.2], count: 0 },
      { name: '21-40%', range: [maxScore * 0.2, maxScore * 0.4], count: 0 },
      { name: '41-60%', range: [maxScore * 0.4, maxScore * 0.6], count: 0 },
      { name: '61-80%', range: [maxScore * 0.6, maxScore * 0.8], count: 0 },
      { name: '81-100%', range: [maxScore * 0.8, Infinity], count: 0 },
    ];

    scores.forEach(s => {
      for (const bucket of buckets) {
        if (s.points >= bucket.range[0] && s.points < bucket.range[1]) {
          bucket.count++;
          break;
        }
      }
    });

    return buckets;
  };

  const getMissedData = () => {
    return questions.map((q, idx) => {
      const qResponses = responses.filter(r => r.question_id === q.id);
      const incorrectCount = qResponses.filter(r => !r.is_correct).length;
      return {
        name: `Q${idx + 1}`,
        missed: incorrectCount,
        total: qResponses.length
      };
    }).sort((a, b) => b.missed - a.missed).slice(0, 5);
  };

  const getTimeData = () => {
    return questions.map((q, idx) => {
      const qResponses = responses.filter(r => r.question_id === q.id);
      const avgTime = qResponses.length > 0 
        ? qResponses.reduce((acc, r) => acc + r.time_taken, 0) / qResponses.length 
        : 0;
      return {
        name: `Q${idx + 1}`,
        time: Math.round(avgTime * 10) / 10
      };
    });
  };

  const downloadClassReport = () => {
    if (!selectedQuiz || scores.length === 0) return;

    // Set quiz as completed when generating report (or could be a separate button)
    supabase.from('quizzes').update({ status: 'completed' }).eq('id', selectedQuiz.id);

    // Create a hidden iframe for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const missedData = getMissedData();
    const timeData = getTimeData();

    printWindow.document.write(`
      <html>
        <head>
          <title>Quriousity Report - ${selectedQuiz.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1a1c1a; }
            h1 { color: #4a7c59; border-bottom: 2px solid #4a7c59; padding-bottom: 10px; }
            .header-info { margin-bottom: 30px; display: flex; justify-between; }
            .stat-box { background: #f0ece4; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e1e3e0; }
            th { background: #4a7c59; color: white; }
            .analytics-section { margin-top: 40px; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #4a7c59; color: white; }
          </style>
        </head>
        <body>
          <h1>Quiz Performance Report</h1>
          <div className="header-info">
            <div>
              <strong>Quiz:</strong> ${selectedQuiz.title}<br>
              <strong>Session Code:</strong> ${selectedQuiz.access_code}<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString()}
            </div>
          </div>

          <div class="stat-box">
            <strong>Overview:</strong> ${scores.length} Participants | Avg. Score: ${Math.round(scores.reduce((acc, s) => acc + s.points, 0) / scores.length)} pts
          </div>

          <h2>Student Results</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player Name</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${scores.map((s, idx) => `
                <tr>
                  <td>#${idx + 1}</td>
                  <td>${s.player_name}</td>
                  <td>${s.points}</td>
                  <td><span class="badge">Completed</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="analytics-section">
            <h2>Critical Insights</h2>
            <p><strong>Most Challenging Question:</strong> ${missedData[0]?.name || 'N/A'} (${missedData[0]?.missed || 0} misses)</p>
            <p><strong>Average Time Spent:</strong> ${Math.round(timeData.reduce((acc, t) => acc + t.time, 0) / timeData.length)} seconds per question</p>
          </div>

          <footer style="margin-top: 50px; font-size: 12px; color: #747972; text-align: center; border-top: 1px solid #e1e3e0; padding-top: 20px;">
            Generated by Quriousity - Real-Time Learning Platform
          </footer>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const downloadCSV = () => {
    if (!scores.length || !selectedQuiz) return;
    const headers = ['Player Name', 'Score', 'Date Joined'];
    const csvContent = [
      headers.join(','),
      ...scores.map(s => `"${s.player_name}",${s.points},"${new Date(s.created_at).toLocaleString()}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedQuiz.title}_Results.csv`;
    link.click();
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('dashboard.title')} />

      <main className="flex-grow pt-20 md:pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Quiz History */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col h-auto md:h-[calc(100vh-250px)]">
              <div className="p-6 border-b border-surface-variant bg-surface-container/30 flex justify-between items-center">
                <h3 className="font-bold text-on-background flex items-center gap-2 truncate">
                  <History size={20} className="text-primary shrink-0" />
                  <span className="truncate">{t('dashboard.quiz_history')}</span>
                </h3>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  onClick={() => navigate('/create')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
                  title={t('dashboard.create_new')}
                >
                  <PlusCircle size={20} />
                </motion.button>
              </div>
              
              <div className="flex-grow overflow-y-auto max-h-[400px] md:max-h-full">
                {loadingHistory ? (
                  <div className="flex flex-col">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-6 border-b border-surface-variant flex flex-col gap-2 animate-pulse">
                        <div className="h-6 w-3/4 bg-surface-container rounded"></div>
                        <div className="h-4 w-1/2 bg-surface-container rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary/30"
                    >
                      <History size={32} className="md:w-10 md:h-10" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-on-background break-words">{t('dashboard.no_quizzes')}</h4>
                      <p className="text-on-surface-variant text-sm mt-1 break-words">{t('dashboard.no_quizzes_desc')}</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/create')}
                      className="mt-2 bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm shadow-sm whitespace-nowrap"
                    >
                      {t('dashboard.create_first')}
                    </motion.button>
                  </div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col"
                  >
                    {quizzes.map((quiz) => (
                      <motion.div
                        variants={itemVariants}
                        key={quiz.id}
                        onClick={() => fetchInsights(quiz)}
                        className={`w-full text-left p-6 border-b border-surface-variant last:border-0 hover:bg-surface-container/20 transition-all flex items-center justify-between group cursor-pointer ${
                          selectedQuiz?.id === quiz.id ? 'bg-primary/5 border-l-4 border-l-primary pl-5' : ''
                        }`}
                      >
                        <div className="overflow-hidden mr-2">
                          <div className={`font-bold text-lg mb-1 transition-colors truncate flex items-center gap-2 ${selectedQuiz?.id === quiz.id ? 'text-primary' : 'text-on-background'}`}>
                            {quiz.title}
                            {quiz.status === 'live' && (
                              <span className="flex h-2 w-2 rounded-full bg-error animate-pulse shrink-0" title="Live Now"></span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 overflow-hidden mb-2">
                            <span className="text-[10px] font-bold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                              {t('createQuiz.access_code')}: {quiz.access_code}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tight whitespace-nowrap ${
                              quiz.status === 'live' ? 'bg-error/10 text-error' :
                              quiz.status === 'completed' ? 'bg-on-surface-variant/10 text-on-surface-variant' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {quiz.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-1">
                            {/* Actions based on status */}
                            {quiz.status === 'live' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEndSession(quiz.id);
                                }}
                                className="text-[10px] font-bold text-error flex items-center gap-1 hover:underline whitespace-nowrap"
                              >
                                <StopCircle size={12} />
                                End Session
                              </button>
                            ) : quiz.status === 'completed' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestartSession(quiz);
                                }}
                                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap"
                              >
                                <RotateCcw size={12} />
                                Restart Session
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/quiz/${quiz.access_code}/lobby`);
                                }}
                                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap"
                              >
                                <Play size={12} fill="currentColor" />
                                Enter Lobby
                              </button>
                            )}

                            {quiz.status === 'live' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/quiz/${quiz.access_code}/lobby`);
                                }}
                                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap"
                              >
                                <Users size={12} />
                                View Lobby
                              </button>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={20} className={`shrink-0 transition-all ${selectedQuiz?.id === quiz.id ? 'text-primary translate-x-1' : 'text-on-surface-variant opacity-0 group-hover:opacity-100'}`} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </section>
          </motion.div>

          {/* Right Column: Insights */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!selectedQuiz ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container-lowest rounded-xl border-2 border-dashed border-surface-variant h-auto md:h-[calc(100vh-250px)] flex flex-col items-center justify-center p-8 md:p-12 text-center text-on-surface-variant gap-4 min-h-[300px]"
                >
                  <BarChart size={64} className="opacity-20 shrink-0" />
                  <div>
                    <h3 className="text-xl font-heading font-bold text-on-background mb-2 break-words">{t('dashboard.select_quiz')}</h3>
                    <p className="max-w-xs mx-auto break-words">{t('dashboard.select_quiz_desc')}</p>
                  </div>
                </motion.div>
              ) : loadingInsights ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-8 h-auto md:h-[calc(100vh-250px)]"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col gap-2 w-1/3">
                      <div className="h-8 bg-surface-container rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-surface-container rounded animate-pulse w-2/3"></div>
                    </div>
                    <div className="h-10 bg-surface-container rounded animate-pulse w-32"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-surface-container rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  {error && (
                    <div className="bg-error/10 border border-error/20 p-4 rounded-xl text-error text-sm font-bold break-words">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="overflow-hidden w-full">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-on-background break-words">{selectedQuiz.title}</h2>
                      <p className="text-on-surface-variant text-sm md:text-base break-words">
                        {t('dashboard.session_code')} <span className="font-bold text-primary">{selectedQuiz.access_code}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadClassReport} 
                        className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/20 transition-all shadow-sm whitespace-nowrap"
                      >
                        <FileSpreadsheet size={18} className="shrink-0" />
                        Class Report (PDF)
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadCSV} 
                        className="flex items-center gap-2 bg-surface-container-lowest border border-surface-variant px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-sm whitespace-nowrap"
                      >
                        <FileSpreadsheet size={18} className="shrink-0" />
                        {t('dashboard.export_csv')}
                      </motion.button>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {[
                      { icon: <Users size={24} />, label: t('dashboard.students_stat'), value: scores.length, color: "bg-primary/10 text-primary" },
                      { icon: <Trophy size={24} />, label: t('dashboard.avg_score_stat'), value: scores.length > 0 ? Math.round(scores.reduce((acc, s) => acc + s.points, 0) / scores.length) : 0, color: "bg-tertiary/10 text-tertiary" },
                      { icon: <BarChart size={24} />, label: t('dashboard.questions_stat'), value: questions.length, color: "bg-secondary/10 text-secondary" }
                    ].map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        variants={cardVariants}
                        className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-sm flex items-center gap-4"
                      >
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shrink-0`}>
                          {stat.icon}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider truncate">{stat.label}</div>
                          <div className="text-xl md:text-2xl font-bold text-on-background">{stat.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Analytics Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.section 
                      variants={cardVariants}
                      className="bg-surface-container-lowest p-4 md:p-6 rounded-xl border border-surface-variant shadow-sm flex flex-col"
                    >
                      <h3 className="font-bold text-on-background mb-6 flex items-center gap-2 break-words shrink-0">
                        <BarChart size={18} className="text-error shrink-0" />
                        {t('dashboard.most_missed')}
                      </h3>
                      <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={getMissedData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-variant)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10}} />
                            <Tooltip 
                              cursor={{fill: 'var(--surface-container)'}}
                              contentStyle={{backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--surface-variant)', borderRadius: '8px', fontSize: '12px'}}
                            />
                            <Bar dataKey="missed" fill="var(--error)" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.section>

                    <motion.section 
                      variants={cardVariants}
                      className="bg-surface-container-lowest p-4 md:p-6 rounded-xl border border-surface-variant shadow-sm flex flex-col"
                    >
                      <h3 className="font-bold text-on-background mb-6 flex items-center gap-2 break-words shrink-0">
                        <Trophy size={18} className="text-tertiary shrink-0" />
                        Score Range
                      </h3>
                      <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={getScoreDistribution()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-variant)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 9}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10}} />
                            <Tooltip 
                              cursor={{fill: 'var(--surface-container)'}}
                              contentStyle={{backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--surface-variant)', borderRadius: '8px', fontSize: '12px'}}
                            />
                            <Bar dataKey="count" fill="var(--tertiary)" radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.section>

                    <motion.section 
                      variants={cardVariants}
                      className="bg-surface-container-lowest p-4 md:p-6 rounded-xl border border-surface-variant shadow-sm flex flex-col"
                    >
                      <h3 className="font-bold text-on-background mb-6 flex items-center gap-2 break-words shrink-0">
                        <Timer size={18} className="text-secondary shrink-0" />
                        {t('dashboard.avg_time')}
                      </h3>
                      <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getTimeData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-variant)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 10}} />
                            <Tooltip 
                              contentStyle={{backgroundColor: 'var(--surface-container-lowest)', borderColor: 'var(--surface-variant)', borderRadius: '8px', fontSize: '12px'}}
                            />
                            <Line type="monotone" dataKey="time" stroke="var(--primary)" strokeWidth={3} dot={{r: 4, fill: 'var(--primary)'}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.section>
                  </div>

                  {/* Main Content Tabs (Two Columns) */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Student Leaderboard */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="xl:col-span-1 flex flex-col gap-6"
                    >
                      <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-surface-variant bg-surface-container/30">
                          <h3 className="font-bold text-on-background flex items-center gap-2 truncate">
                            <Trophy size={18} className="text-primary shrink-0" />
                            {t('dashboard.leaderboard')}
                          </h3>
                        </div>
                        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto">
                          {scores.length === 0 ? (
                            <p className="p-8 text-center text-sm text-on-surface-variant italic break-words">{t('dashboard.no_participants')}</p>
                          ) : (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                              {scores.map((s, idx) => (
                                <motion.div 
                                  key={idx} 
                                  variants={itemVariants}
                                  className="p-4 border-b border-surface-variant last:border-0 flex items-center justify-between hover:bg-surface-container/20 transition-colors"
                                >
                                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                                    <span className="text-[10px] md:text-xs font-bold text-on-surface-variant w-4 shrink-0">#{idx+1}</span>
                                    <span className="font-bold text-xs md:text-sm text-on-background truncate">{s.player_name}</span>
                                  </div>
                                  <span className="text-[10px] md:text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">{s.points} pts</span>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </section>
                    </motion.div>

                    {/* Right Column: Question Analysis */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="xl:col-span-2 flex flex-col gap-6"
                    >
                      <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-surface-variant bg-surface-container/30">
                          <h3 className="font-bold text-on-background flex items-center gap-2 truncate">
                            <BarChart size={18} className="text-secondary shrink-0" />
                            {t('dashboard.question_breakdown')}
                          </h3>
                        </div>
                        <div className="p-4 md:p-6 flex flex-col gap-8">
                          {questions.map((q, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              className="flex flex-col gap-4"
                            >
                              <div className="flex items-start gap-3">
                                <span className="bg-surface-container text-on-surface-variant w-6 h-6 rounded flex items-center justify-center text-[10px] md:text-xs font-bold flex-shrink-0 mt-1">
                                  {idx + 1}
                                </span>
                                <h4 className="font-heading font-bold text-on-background text-base md:text-lg leading-tight break-words">{q.question_text}</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                                {q.options.map((opt, optIdx) => (
                                  <div key={optIdx} className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                                    optIdx === q.correct_index 
                                      ? 'bg-primary/5 border-primary/30 text-primary' 
                                      : 'bg-surface border-surface-variant text-on-surface-variant'
                                  }`}>
                                    <span className="text-xs md:text-sm font-medium break-words">{opt}</span>
                                    {optIdx === q.correct_index && <CheckCircle2 size={16} className="shrink-0" />}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
