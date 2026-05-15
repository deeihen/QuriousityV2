import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, HelpCircle, MessageCircle, FileText } from 'lucide-react';

const HelpCenter = () => {
  const faqs = [
    { q: "How do students join a quiz?", a: "Students simply go to the 'Join Quiz' page and enter the 6-digit code provided by their professor." },
    { q: "Can I edit a quiz after creating it?", a: "Currently, quizzes are final once created. We are working on an edit feature for the near future." },
    { q: "How do I export results?", a: "Go to your Dashboard, select a quiz from your history, and click 'Export CSV'." },
    { q: "Is there a limit on participants?", a: "Quriousity is designed to handle hundreds of students simultaneously in real-time." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title="Help Center" />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[900px] mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-on-background mb-4">How can we help?</h1>
          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides..."
              className="w-full h-14 bg-surface-container-lowest border-2 border-surface-variant rounded-2xl pl-12 pr-4 focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
            <HelpCircle size={40} className="text-primary mx-auto mb-4" />
            <h3 className="font-bold text-on-background mb-2">Getting Started</h3>
            <p className="text-sm text-on-surface-variant">New to Quriousity? Start here for the basics.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
            <FileText size={40} className="text-tertiary mx-auto mb-4" />
            <h3 className="font-bold text-on-background mb-2">Guides</h3>
            <p className="text-sm text-on-surface-variant">Step-by-step instructions for all features.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-variant shadow-sm text-center">
            <MessageCircle size={40} className="text-secondary mx-auto mb-4" />
            <h3 className="font-bold text-on-background mb-2">Contact Support</h3>
            <p className="text-sm text-on-surface-variant">Can't find an answer? Talk to our team.</p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-heading text-on-background mb-8">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant">
                <h3 className="font-bold text-on-background mb-2 flex items-center gap-2">
                  <span className="text-primary">Q:</span> {faq.q}
                </h3>
                <p className="text-on-surface-variant pl-6">
                  <span className="font-bold text-tertiary">A:</span> {faq.a}
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
