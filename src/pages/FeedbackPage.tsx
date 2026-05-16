import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Send, MessageSquare, Star, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { checkRateLimit } from '../lib/security';
import toast from 'react-hot-toast';

const FeedbackPage = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Security: Prevent spamming feedback (1 minute cooldown)
    if (!checkRateLimit('submit-feedback', 60000)) {
      toast.error('Please wait before sending more feedback.');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{ rating, message }]);

      if (error) throw error;
      
      setSubmitted(true);
      setMessage('');
      setRating(0);
    } catch (err: unknown) {
      console.error('Error submitting feedback:', err);
      toast.error('Failed to send feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title={t('feedback.title')} />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[700px] mx-auto w-full">
        {submitted ? (
          <div className="text-center py-12 md:py-20 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm px-6">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={40} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-heading text-on-background mb-4 break-words">{t('feedback.thank_you')}</h1>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8 break-words">{t('feedback.thanks_desc')}</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-primary font-bold hover:underline whitespace-nowrap"
            >
              {t('feedback.submit_another')}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-heading text-on-background mb-4 break-words">{t('feedback.love_hear')}</h1>
              <p className="text-lg text-on-surface-variant break-words">{t('feedback.desc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 md:p-10 rounded-2xl border border-surface-variant shadow-sm flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{t('feedback.satisfied_label')}</label>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
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
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">{t('feedback.message_label')}</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-on-surface-variant" size={20} />
                  <textarea 
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('feedback.message_placeholder')}
                    className="w-full bg-surface border-2 border-surface-variant rounded-xl pl-12 pr-4 py-4 focus:border-primary focus:outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap px-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? t('feedback.sending') : t('feedback.send_btn')}
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
