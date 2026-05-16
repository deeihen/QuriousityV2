import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, ArrowLeft, Home, Play, LayoutGrid, BookOpen, LogOut, Sun, Moon, Languages } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import type { User } from '@supabase/supabase-js';

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
      {/* Top Navbar: Desktop Only */}
      <nav className={`fixed top-0 left-0 w-full z-50 h-16 border-b transition-all hidden md:block ${
        transparent ? 'bg-transparent border-transparent' : 'bg-surface/80 backdrop-blur-md border-surface-variant'
      }`}>
        <div className="max-w-container-max mx-auto px-margin-desktop h-full flex justify-between items-center w-full">
          {/* Left: Logo / Title */}
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button 
                onClick={handleBack} 
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-colors mr-2 cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div 
              className="text-2xl font-extrabold text-primary font-heading cursor-pointer flex items-center gap-2" 
              onClick={() => navigate('/')}
            >
              <span>Quriousity</span>
              {title && (
                <>
                  <span className="text-surface-variant font-light">/</span>
                  <span className="text-on-surface-variant text-lg font-bold">{title}</span>
                </>
              )}
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex gap-8 justify-center items-center h-full">
            <button 
              onClick={() => navigate('/')} 
              className={`transition-all text-sm h-full flex items-center px-1 border-b-2 ${
                isCurrent('/') ? 'text-primary font-bold border-primary' : 'text-on-surface-variant hover:text-primary border-transparent'
              }`}
            >
              {t('navbar.home')}
            </button>
            <button 
              onClick={() => navigate('/join')} 
              className={`transition-all text-sm h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                isCurrent('/join') ? 'text-primary font-bold border-primary' : 'text-on-surface-variant hover:text-primary border-transparent'
              }`}
            >
              {t('navbar.join')}
            </button>
            {user && (
              <button 
                onClick={() => navigate('/dashboard')} 
                className={`transition-all text-sm h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                  isCurrent('/dashboard') ? 'text-primary font-bold border-primary' : 'text-on-surface-variant hover:text-primary border-transparent'
                }`}
              >
                {t('navbar.dashboard')}
              </button>
            )}
            <button 
              onClick={() => navigate('/resources')} 
              className={`transition-all text-sm h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                isCurrent('/resources') ? 'text-primary font-bold border-primary' : 'text-on-surface-variant hover:text-primary border-transparent'
              }`}
            >
              {t('navbar.resources')}
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex justify-end items-center gap-2 lg:gap-4 shrink-0">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-on-surface-variant hover:text-primary rounded-full transition-colors"
                title="Change Language"
              >
                <Languages size={20} />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg overflow-hidden z-[60]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-surface-variant/20 transition-colors ${
                        i18n.language === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-on-surface-variant'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-on-surface-variant hover:text-primary rounded-full transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <button 
                  onClick={handleLogout}
                  className="text-on-surface-variant hover:text-error transition-colors p-2 flex items-center gap-2 text-sm font-bold whitespace-nowrap"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="hidden lg:inline">{t('navbar.logout')}</span>
                </button>
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold shrink-0">
                  {user.email?.substring(0, 1).toUpperCase()}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="bg-primary text-on-primary text-sm font-bold px-4 lg:px-6 py-2 rounded-full hover:opacity-90 transition-opacity hidden md:block shadow-sm whitespace-nowrap"
              >
                {t('navbar.login')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top App Bar */}
      <nav className={`fixed top-0 left-0 w-full z-50 h-14 border-b flex md:hidden items-center transition-all ${
        transparent ? 'bg-transparent border-transparent' : 'bg-surface/80 backdrop-blur-md border-surface-variant'
      }`}>
        <div className="w-full max-w-container-max mx-auto px-4 flex items-center h-full">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button 
                onClick={handleBack} 
                className="p-1.5 text-on-surface-variant hover:text-primary rounded-full"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div 
              className="text-lg font-extrabold text-primary font-heading cursor-pointer flex items-center gap-1.5"
              onClick={() => navigate('/')}
            >
              <span>Quriousity</span>
              {title && (
                <span className="text-on-surface-variant text-sm font-bold truncate max-w-[120px]">
                  <span className="text-surface-variant font-light mx-1">/</span>
                  {title}
                </span>
              )}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                title="Change Language"
              >
                <Languages size={22} />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-lg overflow-hidden z-[60]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-surface-variant/20 transition-colors ${
                        i18n.language === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-on-surface-variant'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleTheme} className="p-2 text-on-surface-variant hover:text-primary">
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            {user ? (
              <button onClick={handleLogout} className="p-2 text-on-surface-variant hover:text-error">
                <LogOut size={22} />
              </button>
            ) : (
              <button onClick={() => navigate('/auth')} className="p-2 text-on-surface-variant hover:text-primary">
                <UserIcon size={22} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-surface-variant z-50 md:hidden">
          <div className={`max-w-container-max mx-auto flex justify-around items-center h-16 px-2 ${user ? '' : 'px-8'}`}>
            <button 
              onClick={() => navigate('/')}
              className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
                isCurrent('/') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Home size={20} />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => navigate('/join')}
              className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
                isCurrent('/join') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Play size={20} />
              <span className="text-[10px] font-bold">Join</span>
            </button>
            {user && (
              <>
                <button 
                  onClick={() => navigate('/create')}
                  className={`flex-1 flex flex-col items-center gap-1 transition-colors relative ${
                    location.pathname === '/create' ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <div className="p-3 bg-primary rounded-full -mt-10 shadow-lg border-4 border-surface group active:scale-95 transition-transform flex items-center justify-center">
                    <Plus size={24} className="text-on-primary" />
                  </div>
                  <span className="text-[10px] font-bold mt-1">Create</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
                    isCurrent('/dashboard') ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <LayoutGrid size={20} />
                  <span className="text-[10px] font-bold">Dashboard</span>
                </button>
              </>
            )}
            <button 
              onClick={() => navigate('/resources')}
              className={`flex-1 flex flex-col items-center gap-1 transition-colors ${
                isCurrent('/resources') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <BookOpen size={20} />
              <span className="text-[10px] font-bold">Resources</span>
            </button>
          </div>
          {/* Safe Area Spacer for iOS */}
          <div className="h-[env(safe-area-inset-bottom)] bg-surface"></div>
        </nav>
      )}
    </>
  );
};

const Plus = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default Navbar;
