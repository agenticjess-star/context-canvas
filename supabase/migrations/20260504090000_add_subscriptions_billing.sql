create type public.subscription_plan as enum ('free', 'pro');
create type public.subscription_status as enum ('inactive', 'trialing', 'active', 'past_due', 'canceled');

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan public.subscription_plan not null default 'free',
  status public.subscription_status not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
on public.subscriptions
for select
using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
on public.subscriptions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create or replace function public.touch_subscriptions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger subscriptions_touch_updated_at
before update on public.subscriptions
for each row
execute procedure public.touch_subscriptions_updated_at();

create or replace function public.get_user_plan_limit(_user_id uuid)
returns integer
language sql
stable
as $$
  select case
    when exists (
      select 1 from public.subscriptions s
      where s.user_id = _user_id
      and s.plan = 'pro'
      and s.status in ('trialing', 'active', 'past_due')
    ) then 100
    else 3
  end;
$$;
