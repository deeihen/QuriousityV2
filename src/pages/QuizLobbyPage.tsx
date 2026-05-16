import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, ArrowLeft, Loader2, User as UserIcon, Trophy, Timer, StopCircle, Clock, Settings2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

interface Participant {
  id: string;
  player_name: string;
  joined_at: string;
}

interface LeaderboardEntry {
  player_name: string;
  points: number;
}

const QuizLobbyPage = () => {
  const { t } = useTranslation();
  const { code } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfessor, setIsProfessor] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizStatus, setQuizStatus] = useState<'waiting' | 'live' | 'completed'>('waiting');
  
  // Duration States
  const [duration, setSessionDuration] = useState('0.5'); 
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState('1');
  const [customMins, setCustomMins] = useState('0');
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const channelRef = useRef<any>(null);

  const fetchLeaderboard = useCallback(async (id: string) => {
    const { data } = await supabase
      .from('scores')
      .select('player_name, points')
      .eq('quiz_id', id)
      .order('points', { ascending: false });
    
    if (data) setLeaderboard(data);
  }, []);

  const manualRefresh = async () => {
    if (!quizId) return;
    setIsRefreshing(true);
    
    const { data: pData } = await supabase
      .from('lobby_participants')
      .select('*')
      .eq('quiz_id', quizId);
    if (pData) setParticipants(pData);

    if (quizStatus === 'live') {
      await fetchLeaderboard(quizId);
    }

    toast.success('Lobby data updated');
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    let mounted = true;
    let localIsProfessor = false;

    const initLobby = async () => {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('id, title, user_id, status, expires_at')
        .eq('access_code', code)
        .maybeSingle();

      if (!mounted) return;

      if (quizError || !quizData) {
        toast.error('Quiz not found');
        navigate('/join');
        return;
      }

      setQuizId(quizData.id);
      setQuizTitle(quizData.title);
      setQuizStatus(quizData.status as any);

      const { data: { user } } = await supabase.auth.getUser();
      localIsProfessor = user?.id === quizData.user_id;
      
      if (!mounted) return;
      setIsProfessor(localIsProfessor);

      if (quizData.status === 'live' && !localIsProfessor) {
        navigate(`/quiz/${code}/play`);
        return;
      }

      const { data: participantsData } = await supabase
        .from('lobby_participants')
        .select('*')
        .eq('quiz_id', quizData.id);
      
      if (!mounted) return;
      setParticipants(participantsData || []);
      if (quizData.status === 'live') fetchLeaderboard(quizData.id);
      setLoading(false);

      // Setup Realtime
      const uniqueChannelName = `lobby-${quizData.id}-${Math.random().toString(36).substring(7)}`;
      const channel = supabase.channel(uniqueChannelName, {
        config: {
          broadcast: { self: true },
          presence: { key: user?.id || 'guest' }
        }
      });
      channelRef.current = channel;

      channel
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'lobby_participants', filter: `quiz_id=eq.${quizData.id}` },
          (payload: any) => {
            setParticipants(prev => {
              if (prev.find(p => p.id === payload.new.id)) return prev;
              return [...prev, payload.new as Participant];
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'lobby_participants', filter: `quiz_id=eq.${quizData.id}` },
          (payload: any) => {
            setParticipants(prev => prev.filter(p => p.id !== payload.old.id));
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'quizzes', filter: `id=eq.${quizData.id}` },
          (payload: any) => {
            if (!mounted) return;
            setQuizStatus(payload.new.status);
            if (payload.new.status === 'live' && !localIsProfessor) {
              navigate(`/quiz/${code}/play`);
            } else if (payload.new.status === 'live' && localIsProfessor) {
              fetchLeaderboard(quizData.id);
            }
          }
        )
        // High-speed Broadcast fallback for START_QUIZ
        .on(
          'broadcast',
          { event: 'START_QUIZ' },
          () => {
            if (!localIsProfessor) {
              navigate(`/quiz/${code}/play`);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'scores', filter: `quiz_id=eq.${quizData.id}` },
          () => {
            if (localIsProfessor) fetchLeaderboard(quizData.id);
          }
        )
        .subscribe();
    };

    initLobby();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [code, navigate, fetchLeaderboard]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (quizStatus === 'live' && isProfessor && quizId) {
      interval = setInterval(async () => {
        const { data } = await supabase.from('quizzes').select('expires_at').eq('id', quizId).single();
        if (data?.expires_at) {
          const remaining = Math.max(0, Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000));
          setTimeLeft(remaining);
          if (remaining === 0) handleEndSession();
        } else {
          setTimeLeft(null);
        }
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [quizStatus, isProfessor, quizId]);

  const startQuiz = async () => {
    if (!quizId || isStarting) return;
    setIsStarting(true);
    
    let expiresAt = null;
    if (duration !== 'none') {
      let finalDurationHours = isCustomDuration 
        ? (parseFloat(customHours) || 0) + (parseFloat(customMins) || 0) / 60 
        : parseFloat(duration);
      
      if (finalDurationHours > 0) {
        expiresAt = new Date(Date.now() + finalDurationHours * 3600000).toISOString();
      }
    }

    const { error } = await supabase
      .from('quizzes')
      .update({ 
        status: 'live', 
        started_at: new Date().toISOString(),
        expires_at: expiresAt
      })
      .eq('id', quizId);

    if (error) {
      toast.error('Failed to start quiz');
      setIsStarting(false);
    } else {
      // Send Broadcast signal for instant start
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'START_QUIZ',
          payload: { startedAt: new Date().toISOString() }
        });
      }
      toast.success('Quiz started! Students are being redirected.');
      setQuizStatus('live');
    }
  };

  const handleEndSession = async () => {
    if (!quizId) return;
    await supabase.from('quizzes').update({ status: 'completed' }).eq('id', quizId);
    toast.success('Session ended');
    navigate('/dashboard');
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return 'No Limit';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (val: string) => {
    if (val === 'custom') {
      setIsCustomDuration(true);
    } else {
      setIsCustomDuration(false);
      setSessionDuration(val);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={quizTitle} />

      <main className="flex-grow pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <section className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{t('lobby.room_code')}</h2>
              <div className="text-6xl font-heading font-extrabold text-on-background tracking-tighter mb-6">
                {code}
              </div>
              
              {isProfessor && (
                <div className="flex flex-col gap-4 mb-8">
                  {quizStatus === 'waiting' ? (
                    <>
                      <div className="flex flex-col gap-3 text-left">
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-xs font-bold text-on-surface-variant uppercase">Session Duration</label>
                          <Settings2 size={14} className="text-on-surface-variant opacity-50" />
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <select 
                            value={isCustomDuration ? 'custom' : duration} 
                            onChange={(e) => handleDurationChange(e.target.value)}
                            className="w-full h-12 bg-surface border-2 border-surface-variant rounded-xl px-4 focus:border-primary focus:outline-none font-bold text-sm"
                          >
                            <option value="none">No Time Limit</option>
                            <option value="0.25">15 Minutes</option>
                            <option value="0.5">30 Minutes</option>
                            <option value="1">1 Hour</option>
                            <option value="2">2 Hours</option>
                            <option value="24">24 Hours</option>
                            <option value="custom">Set Custom Time...</option>
                          </select>

                          {isCustomDuration && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="grid grid-cols-2 gap-2"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-on-surface-variant ml-1">Hours</span>
                                <input 
                                  type="number" 
                                  min="0"
                                  max="99"
                                  value={customHours}
                                  onChange={(e) => setCustomHours(e.target.value)}
                                  className="h-10 bg-surface border-2 border-surface-variant rounded-lg px-3 focus:border-primary focus:outline-none font-bold text-center"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-on-surface-variant ml-1">Minutes</span>
                                <input 
                                  type="number" 
                                  min="0"
                                  max="59"
                                  value={customMins}
                                  onChange={(e) => setCustomMins(e.target.value)}
                                  className="h-10 bg-surface border-2 border-surface-variant rounded-lg px-3 focus:border-primary focus:outline-none font-bold text-center"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startQuiz}
                        disabled={participants.length === 0 || isStarting}
                        className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
                      >
                        {isStarting ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
                        {isStarting ? 'Starting...' : 'Start Quiz'}
                      </motion.button>
                    </>
                  ) : quizStatus === 'live' ? (
                    <>
                      <div className="p-4 bg-error/5 rounded-xl border border-error/20 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-error font-bold">
                          <Clock size={18} />
                          {timeLeft === null ? 'Session: Ongoing (No Limit)' : `Time Remaining: ${formatTime(timeLeft)}`}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEndSession}
                        className="w-full py-4 bg-error text-on-error rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <StopCircle size={20} />
                        End Session
                      </motion.button>
                    </>
                  ) : (
                    <div className="p-4 bg-surface-container rounded-xl font-bold text-on-surface-variant">
                      Quiz Completed
                    </div>
                  )}
                </div>
              )}

              {!isProfessor && (
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-center gap-3 text-primary font-bold animate-pulse">
                  <Loader2 size={18} className="animate-spin" />
                  {t('lobby.waiting_prof')}
                </div>
              )}
            </section>

            <section className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-background">{participants.length}</div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('lobby.players_joined')}</div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-8">
            <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm h-full flex flex-col min-h-[400px] overflow-hidden">
              <div className="p-6 border-b border-surface-variant bg-surface-container/30 flex justify-between items-center">
                <h3 className="font-bold text-on-background flex items-center gap-2">
                  {isProfessor && quizStatus === 'live' ? (
                    <><Trophy size={20} className="text-tertiary" /> Live Leaderboard</>
                  ) : (
                    <><UserIcon size={20} className="text-primary" /> {t('lobby.waiting_room')}</>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    onClick={manualRefresh}
                    disabled={isRefreshing}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors shrink-0"
                    title="Refresh Data"
                  >
                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                  </motion.button>
                  {isProfessor && quizStatus === 'live' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Live
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-grow p-6">
                <AnimatePresence mode="popLayout">
                  {isProfessor && quizStatus === 'live' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                      {leaderboard.length === 0 ? (
                        <p className="text-center italic text-on-surface-variant py-12">No scores recorded yet...</p>
                      ) : (
                        leaderboard.map((entry, idx) => (
                          <motion.div
                            key={idx}
                            layout
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-surface border border-surface-variant p-4 rounded-xl flex items-center justify-between shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <span className="w-6 text-xs font-bold text-on-surface-variant">#{idx + 1}</span>
                              <span className="font-bold text-on-background">{entry.player_name}</span>
                            </div>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{entry.points} pts</span>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  ) : (
                    participants.length === 0 ? (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center gap-4 text-on-surface-variant"
                      >
                        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center opacity-20">
                          <Users size={40} />
                        </div>
                        <p className="italic">{t('lobby.nobody_here')}</p>
                      </motion.div>
                    ) : (
                      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {participants.map((p) => (
                          <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-surface-variant p-4 rounded-xl flex items-center gap-3 shadow-sm hover:border-primary/50 transition-colors"
                          >
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                              {p.player_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm text-on-background truncate">{p.player_name}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizLobbyPage;
