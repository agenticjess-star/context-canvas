import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly: email address, account credentials, and content you upload to the Service (text, links, files). We also collect usage data such as pages visited and features used.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to: provide and maintain the Service; process payments via Stripe; send important account notifications; and improve the Service.</p>

        <h2>3. Data Storage</h2>
        <p>Your data is stored securely using Supabase infrastructure. Content you upload is stored to enable the Service's core functionality of generating shareable context pages.</p>

        <h2>4. Third-Party Services</h2>
        <p>We use the following third-party services: Supabase (authentication and database), Stripe (payment processing), and Vercel (hosting). Each has their own privacy policies governing data they process.</p>

        <h2>5. Data Sharing</h2>
        <p>We do not sell your personal information. We share data only as necessary with service providers (Stripe, Supabase) to operate the Service, or when required by law.</p>

        <h2>6. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by contacting us. You can delete your account and associated data at any time through the Service.</p>

        <h2>7. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this policy from time to time. We will notify you of material changes via email or an in-app notice.</p>

        <h2>9. Contact</h2>
        <p>For privacy-related questions, contact us at privacy@easycontext.me.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Privacy;
