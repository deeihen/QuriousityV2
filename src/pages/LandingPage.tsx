import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Play, PlusCircle, QrCode, Timer, BarChart3, CheckCircle2, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [previewStep, setPreviewStep] = useState(0);

  // Mock quiz data for the live preview
  const previewQuestions = [
    {
      q: "What is the capital of Mars?",
      options: ["New York", "Olympus Mons", "Cydonia", "Elon City"],
      correct: 1
    },
    {
      q: "Which element has the symbol 'Au'?",
      options: ["Silver", "Gold", "Copper", "Aluminum"],
      correct: 1
    },
    {
      q: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correct: 2
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewStep((prev) => (prev + 1) % previewQuestions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [previewQuestions.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-20 md:pt-24 pb-20 md:pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-24">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl border border-surface-variant flex flex-col justify-center shadow-sm"
          >
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl text-on-background mb-6 leading-tight">
              Learn and Compete in <span className="text-primary font-bold">Real-Time</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
              Experience a flow state in learning. Join interactive quizzes instantly, test your knowledge against peers, or create engaging assessments tailored to your curriculum.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/join')}
                className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm active:scale-95"
              >
                Join a Quiz
                <Play size={18} fill="currentColor" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 124, 89, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/create')}
                className="bg-transparent text-primary border-2 border-primary px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Create a Quiz
                <PlusCircle size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
            className="md:col-span-5 relative min-h-[400px] md:min-h-full rounded-xl overflow-hidden shadow-md border border-surface-variant bg-surface-container/30 flex items-center justify-center p-6"
          >
            {/* Live Preview UI Mockup */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-variant overflow-hidden flex flex-col"
            >
              <div className="bg-primary/10 p-4 border-b border-surface-variant flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant bg-surface px-2 py-1 rounded border border-surface-variant">
                  Q: {previewStep + 1}/3
                </div>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-heading font-bold text-on-background mb-6 min-h-[56px]">
                      {previewQuestions[previewStep].q}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {previewQuestions[previewStep].options.map((opt, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border-2 text-sm font-bold flex items-center justify-between transition-all duration-500 ${
                            idx === previewQuestions[previewStep].correct
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-surface-variant text-on-surface-variant bg-surface'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                              idx === previewQuestions[previewStep].correct ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            {opt}
                          </div>
                          {idx === previewQuestions[previewStep].correct && (
                            <CheckCircle2 size={16} />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="p-4 bg-surface border-t border-surface-variant mt-auto">
                <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <motion.div 
                    key={previewStep}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-primary"
                  ></motion.div>
                </div>
              </div>
            </motion.div>

            {/* Decorative background shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5 -z-10 blur-3xl rounded-full"></div>
          </motion.div>
        </section>

        {/* Value Prop / Preview Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 py-16 px-8 rounded-3xl bg-surface-container/50 border border-surface-variant flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <ChevronRight size={14} /> The Quriousity Experience
          </div>
          <h2 className="text-3xl md:text-5xl font-heading text-on-background mb-6 max-w-3xl">
            Education that feels like a <span className="text-tertiary">Game</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mb-12">
            We've stripped away the complexity of traditional LMS platforms to give you a distraction-free environment optimized for focus and fun.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl">
            {[
              { label: "Signups for Students", value: "0", color: "text-primary" },
              { label: "Real-Time Sync", value: "100%", color: "text-tertiary" },
              { label: "One-Click Export", value: "CSV", color: "text-secondary" },
              { label: "Instant Access", value: "6-Digit", color: "text-on-background" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <span className="text-sm font-bold text-on-surface-variant uppercase tracking-tighter">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="mb-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-on-background mb-12 text-center font-heading"
          >
            Empowered Learning in Three Steps
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { 
                icon: <QrCode size={24} />, 
                title: "1. Enter Code", 
                desc: "No complicated sign-ups. Simply enter the unique 6-digit quiz code provided by your instructor to join the session instantly.",
                color: "bg-primary"
              },
              { 
                icon: <Timer size={24} />, 
                title: "2. Answer Real-Time", 
                desc: "Experience smooth, distraction-free interfaces as you answer questions. Watch the progress bar grow as you advance.",
                color: "bg-secondary"
              },
              { 
                icon: <BarChart3 size={24} />, 
                title: "3. Review Results", 
                desc: "Get immediate feedback. Review correct answers, understand mistakes, and track your overall performance metrics instantly.",
                color: "bg-tertiary"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className={`w-12 h-12 ${feature.color} text-on-primary rounded-lg flex items-center justify-center mb-6 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-on-background">{feature.title}</h3>
                <p className="text-on-surface-variant">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
