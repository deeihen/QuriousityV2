import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop bg-surface-container flex flex-col md:flex-row justify-between items-center gap-gutter border-t border-surface-variant/50 mt-auto">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <Link to="/" className="text-xl font-bold text-on-background font-heading">Quriousity</Link>
        <span className="text-sm text-on-surface-variant hidden md:block">© 2026 Quriousity. Empowering learners everywhere.</span>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        <Link to="/privacy" className="text-sm text-on-surface-variant hover:text-primary transition-all">Privacy Policy</Link>
        <Link to="/terms" className="text-sm text-on-surface-variant hover:text-primary transition-all">Terms of Service</Link>
        <Link to="/help" className="text-sm text-on-surface-variant hover:text-primary transition-all">Help Center</Link>
        <Link to="/feedback" className="text-sm text-on-surface-variant hover:text-primary transition-all">Feedback</Link>
      </div>
      <span className="text-xs text-on-surface-variant md:hidden mt-4">© 2026 Quriousity. Empowering learners everywhere.</span>
    </footer>
  );
};

export default Footer;
