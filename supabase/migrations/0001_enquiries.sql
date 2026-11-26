-- Enquiries written by POST /api/enquiry via PostgREST with the service-role key (server only).
-- RLS is on with NO policies: anon/authenticated clients can neither read nor write. The service role bypasses RLS.

create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  type           text not null check (type in ('stay', 'service', 'callback', 'property-owner', 'general')),
  name           text not null check (char_length(name) between 2 and 100),
  phone          text not null check (phone ~ '^\+91[6-9][0-9]{9}$'),
  email          text check (char_length(email) <= 200),
  message        text check (char_length(message) <= 2000),
  stay_slug      text,
  service_slug   text,
  check_in       date,
  check_out      date,
  move_in_month  date,
  adults         smallint check (adults >= 1),
  children       smallint check (children >= 0),
  rooms          smallint check (rooms >= 1),
  budget         text,
  source         text not null,
  utm            jsonb not null default '{}'::jsonb,
  ip             text,
  user_agent     text,
  status         text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed', 'spam')),
  constraint enquiries_dates_order check (check_out is null or check_in is null or check_out > check_in)
);

alter table public.enquiries enable row level security;
revoke all on table public.enquiries from anon, authenticated;

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_created_idx on public.enquiries (status, created_at desc);
create index if not exists enquiries_phone_idx on public.enquiries (phone);
create index if not exists enquiries_type_created_idx on public.enquiries (type, created_at desc);
