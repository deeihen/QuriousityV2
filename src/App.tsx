import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import LandingPage from './pages/LandingPage';
import JoinQuizPage from './pages/JoinQuizPage';
import LiveQuizPage from './pages/LiveQuizPage';
import ResultsPage from './pages/ResultsPage';
import CreateQuizPage from './pages/CreateQuizPage';
import SetupPlayerPage from './pages/SetupPlayerPage';
import DashboardPage from './pages/DashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ResourcesPage from './pages/ResourcesPage';
import AuthPage from './pages/AuthPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HelpCenter from './pages/HelpCenter';
import FeedbackPage from './pages/FeedbackPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import QuizLobbyPage from './pages/QuizLobbyPage';
import AnimatedPage from './components/AnimatedPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user === undefined) return null; // Loading state
  if (user === null) return <Navigate to="/auth" />;

  return <>{children}</>;
};

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
        <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><ForgotPasswordPage /></AnimatedPage>} />
        <Route path="/reset-password" element={<AnimatedPage><ResetPasswordPage /></AnimatedPage>} />
        <Route path="/join" element={<AnimatedPage><JoinQuizPage /></AnimatedPage>} />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <AnimatedPage><CreateQuizPage /></AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AnimatedPage><DashboardPage /></AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute>
              <AnimatedPage><StudentDashboardPage /></AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route path="/resources" element={<AnimatedPage><ResourcesPage /></AnimatedPage>} />
        <Route path="/privacy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
        <Route path="/terms" element={<AnimatedPage><TermsOfService /></AnimatedPage>} />
        <Route path="/help" element={<AnimatedPage><HelpCenter /></AnimatedPage>} />
        <Route path="/feedback" element={<AnimatedPage><FeedbackPage /></AnimatedPage>} />
        <Route path="/quiz/:code/setup" element={<AnimatedPage><SetupPlayerPage /></AnimatedPage>} />
        <Route path="/quiz/:code/lobby" element={<AnimatedPage><QuizLobbyPage /></AnimatedPage>} />
        <Route path="/quiz/:code/play" element={<AnimatedPage><LiveQuizPage /></AnimatedPage>} />
        <Route path="/results/:code" element={<AnimatedPage><ResultsPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppRoutes />
    </Router>
  );
}

export default App;
