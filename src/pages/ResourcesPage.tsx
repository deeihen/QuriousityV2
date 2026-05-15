import { BookOpen, Lightbulb, Users, ShieldCheck, Code } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResourcesPage = () => {
  const resources = [
    {
      title: "For Professors",
      icon: <Users className="text-primary" />,
      items: [
        { name: "How to Create a Quiz", desc: "A step-by-step guide to generating your first 6-digit access code." },
        { name: "Managing Results", desc: "Learn how to export student scores to CSV for your grading software." },
        { name: "Classroom Tips", desc: "Best practices for using real-time quizzes in large lecture halls." }
      ]
    },
    {
      title: "For Students",
      icon: <Lightbulb className="text-tertiary" />,
      items: [
        { name: "Joining a Game", desc: "Everything you need to know about access codes and nicknames." },
        { name: "Scoring Explained", desc: "How speed and accuracy affect your final rank on the leaderboard." },
        { name: "Study Mode", desc: "Coming soon: Practice quizzes for solo learning." }
      ]
    },
    {
      title: "Open Source & Security",
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
      <Navbar showBackButton backUrl="/" title="Resources" />

      <main className="flex-grow pt-20 md:pt-24 pb-20 px-margin-mobile md:px-margin-desktop max-w-[900px] mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-on-background mb-4 flex items-center justify-center gap-4">
            <BookOpen size={48} className="text-primary" />
            Learn More
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Explore guides, documentation, and tips to get the most out of your interactive learning experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-container rounded-lg">
                  {section.icon}
                </div>
                <h2 className="text-xl font-heading font-bold text-on-background">{section.title}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="bg-surface-container-lowest p-5 rounded-xl border border-surface-variant shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <h3 className="font-bold text-on-background mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <section className="mt-20 bg-primary text-on-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-heading font-bold mb-2">Build with Us</h2>
            <p className="opacity-90 max-w-md">Quriousity is an open-source project. Check out the code, report bugs, or add new features on GitHub.</p>
          </div>
          <a href="#" className="bg-on-primary text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
            <Code size={20} />
            View on GitHub
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
