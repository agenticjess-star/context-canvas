import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using EasyContext ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

        <h2>2. Description of Service</h2>
        <p>EasyContext provides a platform for creating shareable, AI-optimized context pages. You can add links, notes, and files to create a single URL that AI tools can consume.</p>

        <h2>3. User Accounts</h2>
        <p>You are responsible for maintaining the security of your account and all activity that occurs under it. You must provide accurate information when creating an account.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to use the Service to: upload illegal, harmful, or infringing content; attempt to access other users' data; reverse-engineer the Service; or violate any applicable laws.</p>

        <h2>5. Content Ownership</h2>
        <p>You retain all rights to content you upload. By using the Service, you grant EasyContext a limited license to store, process, and display your content as necessary to provide the Service.</p>

        <h2>6. Subscriptions and Billing</h2>
        <p>Paid plans are billed monthly via Stripe. You may cancel at any time through the billing portal. Access continues until the end of the current billing period.</p>

        <h2>7. Limitation of Liability</h2>
        <p>The Service is provided "as is" without warranties of any kind. EasyContext is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>

        <h2>8. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>

        <h2>9. Contact</h2>
        <p>For questions about these terms, contact us at support@easycontext.me.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default Terms;
