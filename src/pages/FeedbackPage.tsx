import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Send, MessageSquare, Star, Loader2 } from 'lucide-react';

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title="Feedback" />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[700px] mx-auto w-full">
        {submitted ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={40} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-heading text-on-background mb-4">Thank You!</h1>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8">Your feedback helps us make Quriousity better for everyone. We've received your submission.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-primary font-bold hover:underline"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-heading text-on-background mb-4">We'd love to hear from you</h1>
              <p className="text-lg text-on-surface-variant">Have a suggestion, found a bug, or just want to say hi?</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-surface-variant shadow-sm flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">How satisfied are you?</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                        rating === s ? 'border-primary bg-primary text-on-primary shadow-md' : 'border-surface-variant text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Your Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-on-surface-variant" size={20} />
                  <textarea 
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
