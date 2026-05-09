alter table public.subscriptions
  add constraint subscriptions_user_id_key unique (user_id);
