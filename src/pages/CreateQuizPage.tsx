import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, CheckCircle2, Copy, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { generateQuizCode } from '../lib/utils';
import { checkRateLimit } from '../lib/security';
import Navbar from '../components/Navbar';

interface QuestionInput {
  question_text: string;
  options: string[];
  correct_index: number;
  question_type: 'multiple_choice' | 'true_false';
  image_url?: string;
}

const CreateQuizPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { question_text: '', options: ['', '', '', ''], correct_index: 0, question_type: 'multiple_choice' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_index: 0, question_type: 'multiple_choice' }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof QuestionInput, value: any) => {
    const newQuestions = [...questions];
    if (field === 'options' && typeof value === 'object' && 'optIdx' in value) {
      const { optIdx, text } = value;
      newQuestions[index].options[optIdx] = text;
    } else {
      (newQuestions[index] as any)[field] = value;
      
      // Reset options if switching to true_false
      if (field === 'question_type' && value === 'true_false') {
        newQuestions[index].options = ['True', 'False', '', ''];
        if (newQuestions[index].correct_index > 1) newQuestions[index].correct_index = 0;
      } else if (field === 'question_type' && value === 'multiple_choice') {
        if (newQuestions[index].options[2] === '') {
          newQuestions[index].options = ['Option A', 'Option B', 'Option C', 'Option D'];
        }
      }
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title || questions.some(q => !q.question_text || q.options.slice(0, q.question_type === 'multiple_choice' ? 4 : 2).some(opt => !opt))) {
      setError(t('createQuiz.fill_all_fields'));
      return;
    }

    // Security: Prevent spamming quiz creation (30 second cooldown)
    if (!checkRateLimit('create-quiz', 30000)) {
      setError('Please wait before creating another quiz.');
      return;
    }

    setLoading(true);
    const accessCode = generateQuizCode();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to create a quiz.');

      // 1. Create Quiz
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert([{ title, access_code: accessCode, user_id: user.id }])
        .select()
        .single();

      if (quizError) throw quizError;

      // 2. Create Questions
      const questionsToInsert = questions.map(q => ({
        quiz_id: quizData.id,
        question_text: q.question_text,
        options: q.question_type === 'true_false' ? q.options.slice(0, 2) : q.options,
        correct_index: q.correct_index,
        question_type: q.question_type,
        image_url: q.image_url || null,
        time_limit: 30
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      setCreatedCode(accessCode);
    } catch (err: unknown) {
      setError('Error creating quiz: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  if (createdCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-margin-mobile">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 md:p-8 text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={32} className="md:w-10 md:h-10" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-heading text-on-background mb-2 break-words">{t('createQuiz.created_title')}</h1>
          <p className="text-sm md:text-base text-on-surface-variant mb-8 break-words">{t('createQuiz.created_desc')}</p>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface p-4 md:p-6 rounded-xl border-2 border-dashed border-primary mb-8 group cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(createdCode);
              toast.success(t('createQuiz.copy_success'));
            }}
          >
            <div className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-widest mb-1">{t('createQuiz.access_code')}</div>
            <div className="text-4xl md:text-5xl font-heading font-extrabold text-on-background tracking-tighter flex items-center justify-center gap-2 break-all">
              {createdCode}
              <Copy size={18} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full h-12 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all shadow-md px-4 whitespace-nowrap"
          >
            {t('createQuiz.return_home')}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body pb-32">
      <Navbar showBackButton backUrl="/dashboard" title={t('createQuiz.title')} hideBottomNav />

      <main className="pt-20 md:pt-24 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold break-words"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Quiz Info */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-variant shadow-sm flex flex-col gap-6"
          >
            <div>
              <label className="block text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2 truncate">
                {t('createQuiz.topic_label')}
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('createQuiz.topic_placeholder')}
                className="w-full text-xl md:text-2xl font-heading bg-surface border-2 border-surface-variant rounded-xl p-3 md:p-4 focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </motion.section>

          {/* Questions List */}
          <div className="flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {questions.map((q, qIdx) => (
                <motion.section 
                  key={qIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-surface-variant shadow-sm relative group"
                >
                  <button 
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors p-2 md:opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {qIdx + 1}
                      </div>
                      <h3 className="text-xl font-heading font-bold text-on-background truncate">
                        {t('createQuiz.question_label')}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-surface-variant shrink-0 overflow-x-auto no-scrollbar">
                      <button 
                        type="button"
                        onClick={() => updateQuestion(qIdx, 'question_type', 'multiple_choice')}
                        className={`text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${q.question_type === 'multiple_choice' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                      >
                        {t('createQuiz.multiple_choice')}
                      </button>
                      <button 
                        type="button"
                        onClick={() => updateQuestion(qIdx, 'question_type', 'true_false')}
                        className={`text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${q.question_type === 'true_false' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                      >
                        {t('createQuiz.true_false')}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    <input 
                      type="text"
                      value={q.question_text}
                      onChange={(e) => updateQuestion(qIdx, 'question_text', e.target.value)}
                      placeholder={t('createQuiz.question_placeholder')}
                      className="w-full bg-surface border-2 border-surface-variant rounded-xl p-3 md:p-4 focus:border-primary focus:outline-none transition-all text-sm md:text-base"
                    />
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-surface p-2 md:p-3 rounded-xl border-2 border-surface-variant flex items-center gap-2 flex-grow overflow-hidden">
                        <ImageIcon size={18} className="text-on-surface-variant shrink-0" />
                        <input 
                          type="text"
                          value={q.image_url || ''}
                          onChange={(e) => updateQuestion(qIdx, 'image_url', e.target.value)}
                          placeholder={t('createQuiz.image_url')}
                          className="bg-transparent border-none focus:outline-none text-xs md:text-sm w-full truncate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.slice(0, q.question_type === 'multiple_choice' ? 4 : 2).map((opt, optIdx) => (
                      <div key={optIdx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1 gap-2">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest truncate">
                            {q.question_type === 'multiple_choice' ? `${t('createQuiz.option_label')} ${String.fromCharCode(65 + optIdx)}` : opt}
                          </label>
                          <button 
                            type="button"
                            onClick={() => updateQuestion(qIdx, 'correct_index', optIdx)}
                            className={`text-[10px] font-bold px-2 py-1 rounded transition-all whitespace-nowrap shrink-0 ${
                              q.correct_index === optIdx ? 'bg-primary text-on-primary' : 'text-primary hover:bg-primary/5'
                            }`}
                          >
                            {q.correct_index === optIdx ? t('createQuiz.correct_answer') : t('createQuiz.mark_correct')}
                          </button>
                        </div>
                        {q.question_type === 'multiple_choice' && (
                          <input 
                            type="text"
                            value={opt}
                            onChange={(e) => updateQuestion(qIdx, 'options', { optIdx, text: e.target.value })}
                            className={`w-full bg-surface border-2 rounded-xl p-3 focus:outline-none transition-all text-sm ${
                              q.correct_index === optIdx ? 'border-primary bg-primary/5' : 'border-surface-variant focus:border-primary'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all px-4 whitespace-nowrap"
          >
            <Plus size={20} className="shrink-0" />
            {t('createQuiz.add_question')}
          </motion.button>

          <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-variant p-4 z-50">
            <div className="max-w-[800px] mx-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 px-4 whitespace-nowrap"
              >
                {loading ? <Loader2 className="animate-spin shrink-0" /> : <Save size={20} className="shrink-0" />}
                {loading ? t('createQuiz.creating') : t('createQuiz.save_generate')}
              </motion.button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuizPage;
