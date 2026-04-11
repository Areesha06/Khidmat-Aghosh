create extension if not exists pgcrypto;

create table if not exists public.schools (
  id bigint generated always as identity primary key,
  name text not null unique
);

create table if not exists public.mothers (
  cnic text primary key,
  name text not null,
  marital_status text,
  occupation text,
  created_at timestamptz not null default now()
);

create table if not exists public.guardians (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.donors (
  id bigint generated always as identity primary key,
  name text not null,
  care_of text,
  created_at timestamptz not null default now()
);

create table if not exists public.donor_contacts (
  donor_id bigint not null references public.donors(id) on delete cascade,
  contact_number text not null,
  created_at timestamptz not null default now(),
  primary key (donor_id, contact_number)
);

create table if not exists public.children (
  id bigint generated always as identity primary key,
  name text not null,
  siblings_count integer not null default 0,
  floor text,
  room text,
  dob date not null,
  admission_date date,
  school_id bigint references public.schools(id),
  class text,
  father_name text,
  father_dod date,
  mother_cnic text references public.mothers(cnic),
  primary_guardian_id bigint references public.guardians(id),
  created_at timestamptz not null default now()
);

create table if not exists public.orphan_guardians (
  guardian_id bigint not null references public.guardians(id) on delete cascade,
  child_id bigint not null references public.children(id) on delete cascade,
  relationship text not null,
  created_at timestamptz not null default now(),
  primary key (guardian_id, child_id)
);

create table if not exists public.orphan_donors (
  child_id bigint not null references public.children(id) on delete cascade,
  donor_id bigint not null references public.donors(id) on delete cascade,
  frequency text not null,
  sponsorship_start_date date,
  sponsorship_end_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (child_id, donor_id),
  constraint orphan_donors_frequency_check check (
    frequency in ('monthly', 'quarterly', 'yearly', 'one-time')
  ),
  constraint orphan_donors_status_check check (
    status in ('active', 'paused', 'ended')
  )
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_profiles_role_check check (role in ('admin', 'super_admin'))
);

create table if not exists public.admin_recovery_otps (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,
  recipient_email text not null default 'hassaanuq@gmail.com',
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_children_school_id on public.children(school_id);
create index if not exists idx_orphan_donors_donor_id on public.orphan_donors(donor_id);
create index if not exists idx_admin_recovery_otps_admin_email on public.admin_recovery_otps(admin_email);
create index if not exists idx_admin_recovery_otps_expires_at on public.admin_recovery_otps(expires_at);

alter table public.schools enable row level security;
alter table public.mothers enable row level security;
alter table public.guardians enable row level security;
alter table public.donors enable row level security;
alter table public.donor_contacts enable row level security;
alter table public.children enable row level security;
alter table public.orphan_guardians enable row level security;
alter table public.orphan_donors enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.admin_recovery_otps enable row level security;

create policy "Authenticated can access schools"
  on public.schools
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access mothers"
  on public.mothers
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access guardians"
  on public.guardians
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access donors"
  on public.donors
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access donor contacts"
  on public.donor_contacts
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access children"
  on public.children
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access orphan guardians"
  on public.orphan_guardians
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can access orphan donors"
  on public.orphan_donors
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin reads own profile"
  on public.admin_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_profiles (user_id, email, role)
  values (new.id, coalesce(new.email, ''), 'admin')
  on conflict (user_id) do update
  set email = excluded.email,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.sync_admin_email_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.admin_profiles
    set email = coalesce(new.email, ''), updated_at = now()
    where user_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.sync_admin_email_from_auth();
