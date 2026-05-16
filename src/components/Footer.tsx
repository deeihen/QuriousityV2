import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-12 px-6 md:px-margin-desktop bg-surface-container flex flex-col md:flex-row justify-between items-center gap-gutter border-t border-surface-variant/50 mt-auto">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <Link to="/" className="text-xl font-bold text-on-background font-heading whitespace-nowrap">Quriousity</Link>
        <span className="text-sm text-on-surface-variant hidden md:block break-words">© 2026 Quriousity. {t('footer.tagline')}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <Link to="/privacy" className="text-sm text-on-surface-variant hover:text-primary transition-all whitespace-nowrap">{t('legal.privacy_title')}</Link>
        <Link to="/terms" className="text-sm text-on-surface-variant hover:text-primary transition-all whitespace-nowrap">{t('legal.terms_title')}</Link>
        <Link to="/help" className="text-sm text-on-surface-variant hover:text-primary transition-all whitespace-nowrap">{t('helpCenter.title')}</Link>
        <Link to="/feedback" className="text-sm text-on-surface-variant hover:text-primary transition-all whitespace-nowrap">{t('feedback.title')}</Link>
      </div>
      <span className="text-xs text-on-surface-variant md:hidden mt-4 text-center break-words px-4">© 2026 Quriousity. {t('footer.tagline')}</span>
    </footer>
  );
};

export default Footer;
