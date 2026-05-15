import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface QuestionInput {
  question_text: string;
  options: string[];
  correct_index: number;
}

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { question_text: '', options: ['', '', '', ''], correct_index: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_index: 0 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof QuestionInput, value: string | { optIdx: number, text: string }) => {
    const newQuestions = [...questions];
    if (field === 'options' && typeof value === 'object' && 'optIdx' in value) {
      const { optIdx, text } = value;
      newQuestions[index].options[optIdx] = text;
    } else if (field !== 'options' && typeof value !== 'object') {
      if (field === 'question_text') {
        newQuestions[index].question_text = value;
      } else if (field === 'correct_index') {
        newQuestions[index].correct_index = Number(value);
      }
    }
    setQuestions(newQuestions);
  };

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || questions.some(q => !q.question_text || q.options.some(opt => !opt))) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const accessCode = generateCode();

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
        options: q.options,
        correct_index: q.correct_index,
        time_limit: 30
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      setCreatedCode(accessCode);
    } catch (err: unknown) {
      alert('Error creating quiz: ' + (err instanceof Error ? err.message : String(err)));
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
          className="w-full max-w-md bg-surface-container-lowest border border-surface-variant rounded-2xl p-8 text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} />
          </motion.div>
          <h1 className="text-3xl font-heading text-on-background mb-2">Quiz Created!</h1>
          <p className="text-on-surface-variant mb-8">Share this code with your students to start the session.</p>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-surface p-6 rounded-xl border-2 border-dashed border-primary mb-8 group cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(createdCode);
              alert('Code copied to clipboard!');
            }}
          >
            <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Access Code</div>
            <div className="text-5xl font-heading font-extrabold text-on-background tracking-tighter flex items-center justify-center gap-2">
              {createdCode}
              <Copy size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full h-12 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all shadow-md"
          >
            Return to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body pb-32">
      <Navbar hideBottomNav />

      <main className="pt-20 md:pt-24 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Quiz Info */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant shadow-sm"
          >
            <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Quiz Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Intro to Physics, Pop Culture Trivia"
              className="w-full text-2xl font-heading bg-surface border-2 border-surface-variant rounded-xl p-4 focus:border-primary focus:outline-none transition-all"
            />
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
                  className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant shadow-sm relative group"
                >
                  <button 
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors p-2 md:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                      {qIdx + 1}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-on-background">Question</h3>
                  </div>

                  <input 
                    type="text"
                    value={q.question_text}
                    onChange={(e) => updateQuestion(qIdx, 'question_text', e.target.value)}
                    placeholder="Enter your question here..."
                    className="w-full bg-surface border-2 border-surface-variant rounded-xl p-4 mb-6 focus:border-primary focus:outline-none transition-all"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Option {String.fromCharCode(65 + optIdx)}</label>
                          <button 
                            type="button"
                            onClick={() => updateQuestion(qIdx, 'correct_index', String(optIdx))}
                            className={`text-xs font-bold px-2 py-1 rounded transition-all ${
                              q.correct_index === optIdx ? 'bg-primary text-on-primary' : 'text-primary hover:bg-primary/5'
                            }`}
                          >
                            {q.correct_index === optIdx ? 'Correct Answer' : 'Mark as Correct'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          value={opt}
                          onChange={(e) => updateQuestion(qIdx, 'options', { optIdx, text: e.target.value })}
                          className={`w-full bg-surface border-2 rounded-xl p-3 focus:outline-none transition-all ${
                            q.correct_index === optIdx ? 'border-primary bg-primary/5' : 'border-surface-variant focus:border-primary'
                          }`}
                        />
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
            className="w-full py-4 border-2 border-dashed border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
          >
            <Plus size={20} />
            Add Another Question
          </motion.button>

          <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-variant p-4 z-50">
            <div className="max-w-[800px] mx-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Creating Quiz...' : 'Save and Generate Code'}
              </motion.button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuizPage;
