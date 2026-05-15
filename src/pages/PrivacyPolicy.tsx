import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title="Privacy Policy" />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full">
        <h1 className="text-4xl font-heading text-on-background mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant flex flex-col gap-6">
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">1. Information We Collect</h2>
            <p>We collect minimal information required to provide our service. This includes professor email addresses for account management and nickname choices for students during quiz sessions.</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">2. How We Use Data</h2>
            <p>Emails are used for authentication and account recovery. Nicknames and scores are used solely for the duration of a quiz session and for professors to review classroom performance.</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">3. Data Retention</h2>
            <p>Quiz data and scores are stored until a professor chooses to delete them. We do not sell or share any user data with third parties.</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">4. Security</h2>
            <p>We use industry-standard security measures provided by Supabase to protect your data, including end-to-end encryption for authentication.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
