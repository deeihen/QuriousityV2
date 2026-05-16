import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Play, LayoutGrid, BookOpen, LogOut, Sun, Moon, Languages, Plus, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';
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
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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

  const handleBack = () => backUrl ? navigate(backUrl) : navigate(-1);

  const languages = [
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'tl', label: 'TL', flag: '🇵🇭' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
  ];

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled ? 'bg-surface/80 backdrop-blur-md border-b border-surface-variant' : 
        transparent ? 'bg-transparent' : 'bg-surface border-b border-surface-variant'
      }`}>
        <div className="max-w-container-max mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          
          {/* Left: Branding & Back */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button onClick={handleBack} className="p-2 hover:bg-surface-variant/50 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-on-surface" />
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-xl font-bold tracking-tight text-primary font-heading">Quriousity</span>
              {title && (
                <span className="hidden sm:block text-sm font-medium text-on-surface-variant">/ {title}</span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-1 mr-4">
              <NavLink onClick={() => navigate('/join')} active={isCurrent('/join')} label={t('navbar.join')} />
              {user && <NavLink onClick={() => navigate('/dashboard')} active={isCurrent('/dashboard')} label={t('navbar.dashboard')} />}
              <NavLink onClick={() => navigate('/resources')} active={isCurrent('/resources')} label={t('navbar.resources')} />
            </div>

            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 text-on-surface-variant hover:text-primary rounded-lg transition-colors text-xs font-bold"
            >
              {i18n.language.toUpperCase()}
            </button>

            <button onClick={toggleTheme} className="p-2 text-on-surface-variant hover:text-primary rounded-lg">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="p-2 text-on-surface-variant hover:text-error">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="ml-2 text-sm font-bold text-primary hover:underline"
              >
                {t('navbar.login')}
              </button>
            )}
          </div>
        </div>

        {/* Language Dropdown */}
        <AnimatePresence>
          {showLangMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-16 bg-surface border border-surface-variant rounded-xl shadow-lg p-1 min-w-[120px]"
            >
              {languages.map((l) => (
                <button 
                  key={l.code} onClick={() => { i18n.changeLanguage(l.code); setShowLangMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-primary/5 rounded-lg flex justify-between items-center"
                >
                  <span>{l.label}</span>
                  <span className="opacity-50">{l.flag}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Simplified Mobile Bottom Nav */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-surface-variant md:hidden z-50 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around items-center h-16">
            <MobileIconBtn onClick={() => navigate('/')} active={isCurrent('/')} icon={<Home size={20} />} />
            <MobileIconBtn onClick={() => navigate('/join')} active={isCurrent('/join')} icon={<Play size={20} />} />
            {user && (
              <button 
                onClick={() => navigate('/create')}
                className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <Plus size={24} />
              </button>
            )}
            <MobileIconBtn onClick={() => navigate('/dashboard')} active={isCurrent('/dashboard')} icon={<LayoutGrid size={20} />} />
            <MobileIconBtn onClick={() => navigate('/resources')} active={isCurrent('/resources')} icon={<BookOpen size={20} />} />
          </div>
        </nav>
      )}
    </>
  );
};

const NavLink = ({ onClick, active, label }: { onClick: () => void, active: boolean, label: string }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors ${active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
  >
    {label}
  </button>
);

const MobileIconBtn = ({ onClick, active, icon }: { onClick: () => void, active: boolean, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`p-3 transition-colors ${active ? 'text-primary' : 'text-on-surface-variant'}`}
  >
    {icon}
  </button>
);

export default Navbar;
