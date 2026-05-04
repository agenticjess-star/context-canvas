import { supabase } from '@/integrations/supabase/client';

export type Plan = 'free' | 'pro';
export type SubscriptionStatus = 'inactive' | 'trialing' | 'active' | 'past_due' | 'canceled';

export interface SubscriptionState {
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  limit: number;
}

export const FREE_CANVAS_LIMIT = 3;
export const PRO_CANVAS_LIMIT = 100;

export async function getSubscriptionState(): Promise<SubscriptionState> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { plan: 'free', status: 'inactive', currentPeriodEnd: null, limit: FREE_CANVAS_LIMIT };

  const { data } = await supabase
    .from('subscriptions')
    .select('plan,status,current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  const plan = data?.plan === 'pro' ? 'pro' : 'free';
  return {
    plan,
    status: (data?.status as SubscriptionStatus) || 'inactive',
    currentPeriodEnd: data?.current_period_end || null,
    limit: plan === 'pro' ? PRO_CANVAS_LIMIT : FREE_CANVAS_LIMIT,
  };
}
