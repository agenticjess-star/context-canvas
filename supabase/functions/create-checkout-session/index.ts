import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization")! } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-04-10" });
  const { data: existing } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).single();

  const customer = existing?.stripe_customer_id
    ? existing.stripe_customer_id
    : (await stripe.customers.create({ email: user.email!, metadata: { user_id: user.id } })).id;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price: Deno.env.get("STRIPE_PRO_PRICE_ID")!, quantity: 1 }],
    success_url: `${Deno.env.get("APP_URL")}/dashboard/profile?billing=success`,
    cancel_url: `${Deno.env.get("APP_URL")}/pricing?billing=canceled`,
  });

  return Response.json({ url: session.url }, { headers: corsHeaders });
  return Response.json({ url: session.url });
});
