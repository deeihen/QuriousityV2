import { useTranslation } from 'react-i18next';
import { BookOpen, Lightbulb, Users, ShieldCheck, Code } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResourcesPage = () => {
  const { t } = useTranslation();
  const resources = [
    {
      title: t('resources.for_professors'),
      icon: <Users className="text-primary" />,
      items: [
        { name: "How to Create a Quiz", desc: "A step-by-step guide to generating your first 6-digit access code." },
        { name: "Managing Results", desc: "Learn how to export student scores to CSV for your grading software." },
        { name: "Classroom Tips", desc: "Best practices for using real-time quizzes in large lecture halls." }
      ]
    },
    {
      title: t('resources.for_students'),
      icon: <Lightbulb className="text-tertiary" />,
      items: [
        { name: "Joining a Game", desc: "Everything you need to know about access codes and nicknames." },
        { name: "Scoring Explained", desc: "How speed and accuracy affect your final rank on the leaderboard." },
        { name: "Study Mode", desc: "Coming soon: Practice quizzes for solo learning." }
      ]
    },
    {
      title: t('resources.open_source'),
      icon: <ShieldCheck className="text-secondary" />,
      items: [
        { name: "GitHub Repository", desc: "Contribute to Quriousity or host your own version.", link: "#" },
        { name: "Data Privacy", desc: "How we protect student names and quiz content." },
        { name: "Supabase Setup", desc: "A guide for developers looking to set up their own backend." }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('resources.title')} />

      <main className="flex-grow pt-20 md:pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-[900px] mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-on-background mb-4 flex flex-wrap items-center justify-center gap-4 break-words">
            <BookOpen size={48} className="text-primary shrink-0" />
            {t('resources.learn_more')}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto break-words">{t('resources.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
          {resources.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-container rounded-lg shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-xl font-heading font-bold text-on-background break-words">{section.title}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="bg-surface-container-lowest p-5 rounded-xl border border-surface-variant shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <h3 className="font-bold text-on-background mb-1 group-hover:text-primary transition-colors break-words">{item.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed break-words">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <section className="mt-20 bg-primary text-on-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg mx-2">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-heading font-bold mb-2 break-words">{t('resources.build_with_us')}</h2>
            <p className="opacity-90 max-w-md break-words">{t('resources.build_desc')}</p>
          </div>
          <a 
            href="https://github.com/deeihen/QuriousityV2" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-on-primary text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all whitespace-nowrap shadow-md"
          >
            <Code size={20} />
            {t('resources.view_github')}
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
