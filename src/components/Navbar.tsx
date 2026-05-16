import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, ArrowLeft, Home, Play, LayoutGrid, BookOpen, LogOut, Sun, Moon, Languages, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import type { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  transparent?: boolean;
  showBackButton?: boolean;
  title?: string;
  hideBottomNav?: boolean;
  backUrl?: string;
}

const Navbar = ({ 
  transparent = false, 
  showBackButton = false, 
  title, 
  hideBottomNav = false,
  backUrl 
}: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'tl', label: 'Tagalog', flag: '🇵🇭' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300 ${
        scrolled ? 'h-14 bg-surface/90 backdrop-blur-lg border-b border-surface-variant shadow-sm' : 
        transparent ? 'bg-transparent border-transparent' : 'bg-surface border-b border-surface-variant'
      }`}>
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-full flex justify-between items-center w-full">
          
          {/* Left: Logo & Back */}
          <div className="flex items-center gap-1 md:gap-3">
            <AnimatePresence mode="wait">
              {showBackButton && (
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={handleBack} 
                  className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all mr-1"
                >
                  <ArrowLeft size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <div 
              className="flex items-center gap-2 group cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-xl flex items-center justify-center text-on-primary font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                Q
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg md:text-xl font-black text-primary font-heading leading-tight">Quriousity</span>
                {title && (
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">
                    {title}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center bg-surface-container/30 p-1 rounded-2xl border border-surface-variant/50">
            <NavBtn onClick={() => navigate('/')} active={isCurrent('/')} label={t('navbar.home')} icon={<Home size={16} />} />
            <NavBtn onClick={() => navigate('/join')} active={isCurrent('/join')} label={t('navbar.join')} icon={<Play size={16} />} />
            {user && (
              <NavBtn onClick={() => navigate('/dashboard')} active={isCurrent('/dashboard')} label={t('navbar.dashboard')} icon={<LayoutGrid size={16} />} />
            )}
            <NavBtn onClick={() => navigate('/resources')} active={isCurrent('/resources')} label={t('navbar.resources')} icon={<BookOpen size={16} />} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                <Languages size={20} />
              </button>
              
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-xl overflow-hidden z-[60] p-1.5"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 rounded-xl transition-all ${
                          i18n.language === lang.code ? 'text-primary font-bold bg-primary/10' : 'text-on-surface-variant hover:bg-surface-variant/30'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="w-px h-6 bg-surface-variant mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <button 
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  {t('navbar.logout')}
                </button>
                <div 
                  className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-black shadow-sm"
                  title={user.email || ''}
                >
                  {user.email?.substring(0, 1).toUpperCase()}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap ml-2"
              >
                {t('navbar.login')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-surface-variant z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-container-max mx-auto flex justify-between items-center h-16 px-4">
            <BottomNavBtn onClick={() => navigate('/')} active={isCurrent('/')} label="Home" icon={<Home size={22} />} />
            <BottomNavBtn onClick={() => navigate('/join')} active={isCurrent('/join')} label="Join" icon={<Play size={22} />} />
            
            {user ? (
              <>
                <div className="relative -mt-10 px-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/create')}
                    className="w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center border-4 border-surface"
                  >
                    <Plus size={28} className="text-on-primary" />
                  </motion.button>
                </div>
                <BottomNavBtn onClick={() => navigate('/dashboard')} active={isCurrent('/dashboard')} label="Dashboard" icon={<LayoutGrid size={22} />} />
              </>
            ) : null}
            
            <BottomNavBtn onClick={() => navigate('/resources')} active={isCurrent('/resources')} label="Resources" icon={<BookOpen size={22} />} />
          </div>
        </nav>
      )}
    </>
  );
};

interface NavBtnProps {
  onClick: () => void;
  active: boolean;
  label: string;
  icon: React.ReactNode;
}

const NavBtn = ({ onClick, active, label, icon }: NavBtnProps) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
      active ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
    }`}
  >
    {icon}
    {label}
  </button>
);

const BottomNavBtn = ({ onClick, active, label, icon }: NavBtnProps) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all py-1 ${
      active ? 'text-primary' : 'text-on-surface-variant'
    }`}
  >
    <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/10' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default Navbar;
