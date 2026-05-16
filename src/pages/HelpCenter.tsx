import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, HelpCircle, MessageCircle, FileText } from 'lucide-react';

const HelpCenter = () => {
  const { t } = useTranslation();
  const faqs = [
    { q: t('helpCenter.q1'), a: t('helpCenter.a1') },
    { q: t('helpCenter.q2'), a: t('helpCenter.a2') },
    { q: t('helpCenter.q3'), a: t('helpCenter.a3') },
    { q: t('helpCenter.q4'), a: t('helpCenter.a4') }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('helpCenter.title')} />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[900px] mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-on-background mb-4 break-words">{t('helpCenter.how_help')}</h1>
          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder={t('helpCenter.search_placeholder')}
              className="w-full h-14 bg-surface-container-lowest border-2 border-surface-variant rounded-2xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-2">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
            <HelpCircle size={40} className="text-primary mx-auto mb-4" />
            <h3 className="font-bold text-on-background mb-2 whitespace-nowrap">{t('helpCenter.getting_started')}</h3>
            <p className="text-sm text-on-surface-variant break-words">{t('helpCenter.getting_started_desc')}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
            <FileText size={40} className="text-tertiary mx-auto mb-4" />
            <h3 className="font-bold text-on-background mb-2 whitespace-nowrap">{t('helpCenter.guides')}</h3>
            <p className="text-sm text-on-surface-variant break-words">{t('helpCenter.guides_desc')}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
            <MessageCircle size={40} className="text-secondary mx-auto mb-4" />
            <h3 className="font-bold text-on-background mb-2 whitespace-nowrap">{t('helpCenter.contact')}</h3>
            <p className="text-sm text-on-surface-variant break-words">{t('helpCenter.contact_desc')}</p>
          </div>
        </div>

        <section className="px-2">
          <h2 className="text-2xl font-heading text-on-background mb-8 break-words">{t('helpCenter.faq')}</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant">
                <h3 className="font-bold text-on-background mb-2 flex items-start gap-2 break-words">
                  <span className="text-primary shrink-0">Q:</span> {faq.q}
                </h3>
                <p className="text-on-surface-variant pl-6 break-words">
                  <span className="font-bold text-tertiary shrink-0">A:</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
