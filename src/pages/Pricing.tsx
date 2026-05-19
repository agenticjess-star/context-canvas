import { Check, ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { supabaseConfigured } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';

const Pricing = () => {
  const navigate = useNavigate();

  const startCheckout = async () => {
    if (!supabaseConfigured) {
      navigate('/auth');
      return;
    }
    const { data, error } = await supabase.functions.invoke('create-checkout-session');
    if (!error && data?.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 lg:px-10 py-5 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">EasyContext</span>
        </Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </nav>

      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Simple, transparent pricing</h1>
            <p className="text-lg text-muted-foreground">Pick the plan that matches your workflow. Upgrade anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-20">
            <div className="rounded-2xl border border-border p-8 bg-card">
              <p className="text-sm font-medium text-muted-foreground mb-1">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Up to 3 canvases</p>
              <Button variant="outline" className="w-full rounded-full h-11 mb-8" onClick={() => navigate('/auth')}>
                Get started free
              </Button>
              <ul className="space-y-3">
                {['3 context canvases', 'Public and @username links', 'Basic source import', 'Community support'].map((f) => (
                  <li key={f} className="text-sm flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-primary/30 p-8 bg-card relative">
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">Popular</span>
              <p className="text-sm font-medium text-primary mb-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Up to 100 canvases</p>
              <Button className="w-full rounded-full h-11 mb-8" onClick={startCheckout}>
                Upgrade to Pro
              </Button>
              <ul className="space-y-3">
                {['100 context canvases', 'Everything in Free', 'Priority processing', 'Billing portal access', 'Priority support'].map((f) => (
                  <li key={f} className="text-sm flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">Frequently asked questions</h3>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="q1" className="border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-medium">Can I cancel anytime?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Yes. Cancel in the billing portal and keep access until the end of your current billing period.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2" className="border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-medium">What happens to my canvases if I downgrade?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">Your existing canvases remain accessible. You just won't be able to create new ones beyond the Free plan limit.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3" className="border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-medium">Do you offer refunds?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">If you're not satisfied within the first 14 days, contact us for a full refund.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
