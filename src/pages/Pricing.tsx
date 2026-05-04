import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';

const Pricing = () => {
  const startCheckout = async () => {
    const { data, error } = await supabase.functions.invoke('create-checkout-session');
    if (!error && data?.url) window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Pricing</h1>
        <p className="text-muted-foreground mb-10">Pick the plan that matches your workflow.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { name: 'Free', price: '$0', cap: '3 canvases', features: ['Public and @username links', 'Basic source import', 'Community support'] },
            { name: 'Pro', price: '$19/mo', cap: '100 canvases', features: ['Higher limits', 'Priority processing', 'Billing portal access'] },
          ].map((plan) => (
            <div key={plan.name} className="rounded-2xl border p-6 bg-card">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="text-3xl font-bold mt-2">{plan.price}</p>
              <p className="text-sm text-muted-foreground mt-1">Cap: {plan.cap}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => <li key={f} className="text-sm flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>)}
              </ul>
              {plan.name === 'Pro' && <Button onClick={startCheckout} className="mt-6 w-full rounded-full">Upgrade to Pro</Button>}
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold mb-4">FAQ</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1"><AccordionTrigger>Can I cancel anytime?</AccordionTrigger><AccordionContent>Yes. Cancel in the billing portal and keep access until period end.</AccordionContent></AccordionItem>
          <AccordionItem value="q2"><AccordionTrigger>What statuses are supported?</AccordionTrigger><AccordionContent>trialing, active, past_due, canceled, and inactive.</AccordionContent></AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Pricing;
