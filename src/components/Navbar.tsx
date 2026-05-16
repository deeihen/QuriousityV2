import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Play, LayoutGrid, BookOpen, LogOut, Sun, Moon, Languages, Plus } from 'lucide-react';
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
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'tl', label: 'Tagalog', flag: '🇵🇭' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'h-14 bg-surface/90 backdrop-blur-md border-b border-surface-variant' : 
        transparent ? 'h-16 bg-transparent' : 'h-16 bg-surface border-b border-surface-variant'
      }`}>
        <div className="max-w-container-max mx-auto px-4 md:px-10 h-full flex justify-between items-center">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button onClick={handleBack} className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors mr-1">
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
              <span className="text-2xl font-black tracking-tighter text-primary font-heading hover:opacity-80 transition-opacity">
                Quriousity
              </span>
            </div>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <DesktopNavLink onClick={() => navigate('/')} active={isCurrent('/')} label={t('navbar.home')} />
            <DesktopNavLink onClick={() => navigate('/join')} active={isCurrent('/join')} label={t('navbar.join')} />
            {user && <DesktopNavLink onClick={() => navigate('/dashboard')} active={isCurrent('/dashboard')} label={t('navbar.dashboard')} />}
            <DesktopNavLink onClick={() => navigate('/resources')} active={isCurrent('/resources')} label={t('navbar.resources')} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)} 
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <Languages size={20} />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <>
                    <div className="fixed inset-0 z-[55]" onClick={() => setShowLangMenu(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-2xl p-2 min-w-[160px] z-[60]"
                    >
                      {languages.map((l) => (
                        <button 
                          key={l.code} 
                          onClick={() => { i18n.changeLanguage(l.code); setShowLangMenu(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm rounded-xl flex items-center gap-3 transition-colors ${
                            i18n.language === l.code ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-surface-variant/30 text-on-surface-variant'
                          }`}
                        >
                          <span>{l.flag}</span>
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="w-px h-6 bg-surface-variant/50 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="hidden lg:flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-error transition-colors">
                  <LogOut size={16} />
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                {t('navbar.login')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modern Mobile Bottom Nav */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-surface-variant md:hidden z-50 pb-[env(safe-area-inset-bottom)]">
          <div className="flex justify-around items-center h-16">
            <MobileTab onClick={() => navigate('/')} active={isCurrent('/')} icon={<Home size={22} />} label="Home" />
            <MobileTab onClick={() => navigate('/join')} active={isCurrent('/join')} icon={<Play size={22} />} label="Join" />
            {user && (
              <div className="relative -mt-6">
                <button 
                  onClick={() => navigate('/create')}
                  className="w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center border-4 border-surface active:scale-90 transition-transform"
                >
                  <Plus size={28} />
                </button>
              </div>
            )}
            <MobileTab onClick={() => navigate('/dashboard')} active={isCurrent('/dashboard')} icon={<LayoutGrid size={22} />} label="Dashboard" />
            <MobileTab onClick={() => navigate('/resources')} active={isCurrent('/resources')} icon={<BookOpen size={22} />} label="Resources" />
          </div>
        </nav>
      )}
    </>
  );
};

const DesktopNavLink = ({ onClick, active, label }: { onClick: () => void, active: boolean, label: string }) => (
  <button 
    onClick={onClick}
    className={`relative py-1 text-sm font-bold transition-colors ${active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
  >
    {label}
    {active && (
      <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
    )}
  </button>
);

const MobileTab = ({ onClick, active, icon, label }: { onClick: () => void, active: boolean, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all ${active ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
  >
    {icon}
    <span className="text-[10px] font-bold tracking-tighter uppercase">{label}</span>
  </button>
);

export default Navbar;
