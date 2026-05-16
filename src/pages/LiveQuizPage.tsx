import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ArrowRight, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { calculateScore } from '../lib/utils';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  time_limit: number;
  question_type: 'multiple_choice' | 'true_false';
  image_url: string | null;
}

const LiveQuizPage = () => {
  const { t } = useTranslation();
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishQuiz = useCallback(async (currentScore: number, currentOption: number | null, currentTimeLeft: number) => {
    // Security: Prevent duplicate or rapid-fire submissions
    if (!checkRateLimit('finish-quiz', 10000) || saving) return;
    
    setSaving(true);
    const playerName = localStorage.getItem('quriousity_player_name') || 'Anonymous';
    
    let finalScore = currentScore;
    const isCorrect = currentOption === questions[currentIndex]?.correct_index;
    finalScore += calculateScore(isCorrect, currentTimeLeft);

    try {
      const { error } = await supabase
        .from('scores')
        .insert([{
          quiz_id: quizId,
          player_name: playerName,
          points: finalScore,
          user_id: userId,
          is_guest: !userId
        }]);

      if (error) throw error;

      // Award XP to registered students
      if (userId) {
        await supabase.rpc('award_xp', { points_to_add: finalScore });
      }

      navigate(`/results/${code}`, { state: { finalScore, playerName } });
    } catch (err: unknown) {
      console.error('Error saving score:', err instanceof Error ? err.message : String(err));
      navigate(`/results/${code}`, { state: { finalScore, playerName } });
    }
  }, [code, currentIndex, navigate, questions, quizId, userId, saving]);

  const handleNext = useCallback(async () => {
    if (isSubmitting || saving) return;
    setIsSubmitting(true);

    let newScore = score;
    const isCorrect = selectedOption === questions[currentIndex]?.correct_index;
    const timeTaken = (questions[currentIndex].time_limit || 30) - timeLeft;
    
    newScore = score + calculateScore(isCorrect, timeLeft);
    setScore(newScore);

    // Record response for analytics
    try {
      const playerName = localStorage.getItem('quriousity_player_name') || 'Anonymous';
      await supabase.from('responses').insert([{
        quiz_id: quizId,
        question_id: questions[currentIndex].id,
        player_name: playerName,
        is_correct: isCorrect,
        time_taken: timeTaken
      }]);
    } catch (err) {
      console.error('Error recording response:', err);
    }

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setTimeLeft(questions[nextIdx].time_limit || 30);
      setIsSubmitting(false);
    } else {
      await finishQuiz(newScore, selectedOption, timeLeft);
      // Let it remain submitting as we navigate away
    }
  }, [currentIndex, finishQuiz, questions, score, selectedOption, timeLeft, quizId, isSubmitting, saving]);

  useEffect(() => {
    const fetchQuiz = async () => {
      // Get current user if any
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // If current user is the owner, prevent them from playing
        if (user.id === quizData.user_id) {
          toast.error('Creators cannot participate in their own quizzes.');
          navigate('/dashboard');
          return;
        }
      }

      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('id')
        .eq('access_code', code)
        .maybeSingle();

      if (quizError || !quizData) {
        navigate('/join');
        return;
      }

      setQuizId(quizData.id);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizData.id);

      if (questionsError || !questionsData || questionsData.length === 0) {
        toast.error('No questions found for this quiz.');
        navigate('/');
        return;
      }

      setQuestions(questionsData);
      setTimeLeft(questionsData[0].time_limit || 30);
      setLoading(false);
    };

    fetchQuiz();
  }, [code, navigate]);

  useEffect(() => {
    if (loading || saving) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const autoNext = async () => {
        await handleNext();
      };
      autoNext();
    }
  }, [timeLeft, loading, saving, handleNext]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || saving) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-primary" size={48} />
        </motion.div>
        <p className="text-primary font-bold break-words">{saving ? t('common.loading') : t('common.loading')}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-variant h-14 md:h-16">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-full flex justify-between items-center w-full">
          <div className="flex items-center gap-gutter">
            <div className="text-xl md:text-2xl font-extrabold text-primary font-heading cursor-pointer whitespace-nowrap" onClick={() => navigate('/')}>Quriousity</div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <motion.div 
              key={score}
              initial={{ scale: 1.2, color: "#4a7c59" }}
              animate={{ scale: 1, color: "inherit" }}
              className="flex items-center gap-2 bg-primary/10 px-2 md:px-4 py-1 rounded-full whitespace-nowrap"
            >
              <span className="text-[10px] md:text-xs font-bold text-primary uppercase">{t('common.score')}: {score}</span>
            </motion.div>
            <button className="text-on-surface hover:text-primary transition-colors p-2">
              <User size={22} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-[80px] md:pt-[100px] pb-12 px-margin-mobile md:px-margin-desktop flex justify-center items-start">
        <div className="w-full max-w-[800px] flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider break-words">
                {t('liveQuiz.question_of', { current: currentIndex + 1, total: questions.length })}
              </span>
              <motion.div 
                animate={timeLeft < 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center gap-2 bg-surface-container-high px-3 md:px-4 py-2 rounded-full border border-surface-variant shrink-0"
              >
                <Timer size={20} className={timeLeft < 10 ? 'text-error' : 'text-primary'} />
                <span className={`text-lg md:text-xl font-bold tracking-tight ${timeLeft < 10 ? 'text-error' : 'text-on-background'}`}>
                  {formatTime(timeLeft)}
                </span>
              </motion.div>
            </div>
            <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden border border-surface-variant">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-tertiary"
                initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6 md:p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px] gap-6">
                {currentQ.image_url && (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={currentQ.image_url} 
                    alt="Question visual" 
                    className="max-h-[200px] rounded-lg object-contain shadow-sm"
                  />
                )}
                <h1 className="text-2xl md:text-4xl font-heading text-on-background leading-tight break-words">
                  {currentQ.question_text}
                </h1>
              </div>

              <div className={`grid gap-4 ${currentQ.question_type === 'true_false' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                {currentQ.options.slice(0, currentQ.question_type === 'multiple_choice' ? 4 : 2).map((option, idx) => (
                  <motion.button 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left rounded-xl p-4 md:p-6 transition-all duration-200 flex items-center justify-between shadow-sm border-2 min-h-[80px] ${
                      selectedOption === idx 
                        ? 'bg-primary/5 border-primary shadow-md' 
                        : 'bg-surface-container-lowest border-surface-variant hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <motion.div 
                        animate={selectedOption === idx ? { backgroundColor: "#4a7c59", color: "#ffffff" } : { backgroundColor: "#f0ece4", color: "#4a4e4a" }}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg font-bold shrink-0"
                      >
                        {currentQ.question_type === 'multiple_choice' ? String.fromCharCode(65 + idx) : (idx === 0 ? 'T' : 'F')}
                      </motion.div>
                      <span className={`text-lg md:text-xl font-bold transition-colors break-words flex-grow ${
                        selectedOption === idx ? 'text-primary' : 'text-on-background'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-4">
            <button 
              onClick={handleNext}
              className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors break-words text-center"
            >
              {t('common.skip')}
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-primary text-on-primary px-8 md:px-10 py-3 rounded-lg font-bold hover:opacity-90 transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center whitespace-nowrap"
            >
              {currentIndex === questions.length - 1 ? t('common.finish') : t('common.next')}
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveQuizPage;
