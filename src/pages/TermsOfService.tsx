import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Navbar showBackButton backUrl="/" title="Terms of Service" />
      <main className="flex-grow pt-24 pb-16 px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto w-full">
        <h1 className="text-4xl font-heading text-on-background mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-on-surface-variant flex flex-col gap-6">
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">1. Acceptance of Terms</h2>
            <p>By using Quriousity, you agree to comply with and be bound by these terms. If you do not agree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">2. User Accounts</h2>
            <p>Professors are responsible for maintaining the confidentiality of their accounts. Any activity under your account is your responsibility.</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">3. Acceptable Use</h2>
            <p>Users may not use Quriousity for any illegal purposes or to distribute inappropriate content. We reserve the right to terminate accounts that violate these guidelines.</p>
          </section>
          <section>
            <h2 className="text-2xl font-heading text-on-background mb-3">4. Limitation of Liability</h2>
            <p>Quriousity is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use the service.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
