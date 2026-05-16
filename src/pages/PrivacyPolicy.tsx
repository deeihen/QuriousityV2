import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('legal.privacy_title')} />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full">
        <h1 className="text-4xl font-heading text-on-background mb-8 break-words">{t('legal.privacy_title')}</h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant flex flex-col gap-8 px-2">
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3 break-words">{t('legal.p_1_collect')}</h2>
            <p className="break-words leading-relaxed">{t('legal.p_1_desc')}</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3 break-words">{t('legal.p_2_use')}</h2>
            <p className="break-words leading-relaxed">{t('legal.p_2_desc')}</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3 break-words">{t('legal.p_3_retention')}</h2>
            <p className="break-words leading-relaxed">{t('legal.p_3_desc')}</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3 break-words">{t('legal.p_4_security')}</h2>
            <p className="break-words leading-relaxed">{t('legal.p_4_desc')}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
