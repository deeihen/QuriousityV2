import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Trophy, Users, 
  Loader2, FileSpreadsheet, BarChart, CheckCircle2, History, ChevronRight, PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ParticipantScore {
  player_name: string;
  points: number;
  created_at: string;
}

interface QuestionDetail {
  question_text: string;
  options: string[];
  correct_index: number;
}

interface Quiz {
  id: string;
  title: string;
  access_code: string;
  created_at: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [scores, setScores] = useState<ParticipantScore[]>([]);
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [error, setError] = useState('');

  const fetchQuizHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (err: unknown) {
      console.error('Error fetching history:', err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingHistory(false);
    }
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

    try {
      // Fetch scores and questions in parallel
      const [scoresRes, questionsRes] = await Promise.all([
        supabase.from('scores').select('player_name, points, created_at').eq('quiz_id', quiz.id).order('points', { ascending: false }),
        supabase.from('questions').select('question_text, options, correct_index').eq('quiz_id', quiz.id)
      ]);

      if (scoresRes.error) throw scoresRes.error;
      if (questionsRes.error) throw questionsRes.error;

      setScores(scoresRes.data || []);
      setQuestions(questionsRes.data || []);
    } catch (err: unknown) {
      setError('Error fetching data: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoadingInsights(false);
    }
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as any } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title="Professor Dashboard" />

      <main className="flex-grow pt-20 md:pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Quiz History */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
              <div className="p-6 border-b border-surface-variant bg-surface-container/30 flex justify-between items-center">
                <h3 className="font-bold text-on-background flex items-center gap-2">
                  <History size={20} className="text-primary" />
                  Quiz History
                </h3>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  onClick={() => navigate('/create')}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                  title="Create New Quiz"
                >
                  <PlusCircle size={20} />
                </motion.button>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-on-surface-variant">
                    <Loader2 className="animate-spin" />
                    <span className="text-sm">Loading history...</span>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
                    <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant">
                      <History size={32} />
                    </div>
                    <p className="text-on-surface-variant text-sm">You haven't created any quizzes yet.</p>
                    <button 
                      onClick={() => navigate('/create')}
                      className="text-primary font-bold text-sm hover:underline"
                    >
                      Create your first quiz
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col"
                  >
                    {quizzes.map((quiz) => (
                      <motion.button
                        variants={itemVariants}
                        key={quiz.id}
                        onClick={() => fetchInsights(quiz)}
                        className={`w-full text-left p-6 border-b border-surface-variant last:border-0 hover:bg-surface-container/20 transition-all flex items-center justify-between group ${
                          selectedQuiz?.id === quiz.id ? 'bg-primary/5 border-l-4 border-l-primary pl-5' : ''
                        }`}
                      >
                        <div>
                          <div className={`font-bold text-lg mb-1 transition-colors ${selectedQuiz?.id === quiz.id ? 'text-primary' : 'text-on-background'}`}>
                            {quiz.title}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase tracking-wider">
                              Code: {quiz.access_code}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              {new Date(quiz.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={20} className={`transition-all ${selectedQuiz?.id === quiz.id ? 'text-primary translate-x-1' : 'text-on-surface-variant opacity-0 group-hover:opacity-100'}`} />
                      </motion.button>
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
                  className="bg-surface-container-lowest rounded-xl border-2 border-dashed border-surface-variant h-[calc(100vh-250px)] flex flex-col items-center justify-center p-12 text-center text-on-surface-variant gap-4"
                >
                  <BarChart size={64} className="opacity-20" />
                  <div>
                    <h3 className="text-xl font-heading font-bold text-on-background mb-2">Select a Quiz</h3>
                    <p className="max-w-xs">Click on a quiz from your history to view detailed performance insights and student scores.</p>
                  </div>
                </motion.div>
              ) : loadingInsights ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface-container-lowest rounded-xl border border-surface-variant h-[calc(100vh-250px)] flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="animate-spin text-primary" size={40} />
                  <p className="text-primary font-bold">Analyzing data...</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  {error && (
                    <div className="bg-error/10 border border-error/20 p-4 rounded-xl text-error text-sm font-bold">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-3xl font-heading font-bold text-on-background">{selectedQuiz.title}</h2>
                      <p className="text-on-surface-variant">Insights for session code: <span className="font-bold text-primary">{selectedQuiz.access_code}</span></p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadCSV} 
                      className="flex items-center gap-2 bg-surface-container-lowest border border-surface-variant px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:text-primary hover:border-primary transition-all shadow-sm"
                    >
                      <FileSpreadsheet size={18} />
                      Export CSV
                    </motion.button>
                  </div>

                  {/* Summary Cards */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {[
                      { icon: <Users size={24} />, label: "Students", value: scores.length, color: "bg-primary/10 text-primary" },
                      { icon: <Trophy size={24} />, label: "Avg Score", value: scores.length > 0 ? Math.round(scores.reduce((acc, s) => acc + s.points, 0) / scores.length) : 0, color: "bg-tertiary/10 text-tertiary" },
                      { icon: <BarChart size={24} />, label: "Questions", value: questions.length, color: "bg-secondary/10 text-secondary" }
                    ].map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        variants={cardVariants}
                        className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-sm flex items-center gap-4"
                      >
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
                          <div className="text-2xl font-bold text-on-background">{stat.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

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
                          <h3 className="font-bold text-on-background flex items-center gap-2">
                            <Trophy size={18} className="text-primary" />
                            Leaderboard
                          </h3>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                          {scores.length === 0 ? (
                            <p className="p-8 text-center text-sm text-on-surface-variant italic">No participants yet.</p>
                          ) : (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                              {scores.map((s, idx) => (
                                <motion.div 
                                  key={idx} 
                                  variants={itemVariants}
                                  className="p-4 border-b border-surface-variant last:border-0 flex items-center justify-between hover:bg-surface-container/20 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-on-surface-variant w-4">#{idx+1}</span>
                                    <span className="font-bold text-sm text-on-background truncate max-w-[120px]">{s.player_name}</span>
                                  </div>
                                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">{s.points} pts</span>
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
                          <h3 className="font-bold text-on-background flex items-center gap-2">
                            <BarChart size={18} className="text-secondary" />
                            Question Breakdown
                          </h3>
                        </div>
                        <div className="p-6 flex flex-col gap-8">
                          {questions.map((q, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              className="flex flex-col gap-4"
                            >
                              <div className="flex items-start gap-3">
                                <span className="bg-surface-container text-on-surface-variant w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                                  {idx + 1}
                                </span>
                                <h4 className="font-heading font-bold text-on-background text-lg leading-tight">{q.question_text}</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                                {q.options.map((opt, optIdx) => (
                                  <div key={optIdx} className={`p-3 rounded-lg border flex items-center justify-between ${
                                    optIdx === q.correct_index 
                                      ? 'bg-primary/5 border-primary/30 text-primary' 
                                      : 'bg-surface border-surface-variant text-on-surface-variant'
                                  }`}>
                                    <span className="text-sm font-medium">{opt}</span>
                                    {optIdx === q.correct_index && <CheckCircle2 size={16} />}
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
