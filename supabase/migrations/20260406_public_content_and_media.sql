create table if not exists public.staff_members (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donation_records (
  id bigint generated always as identity primary key,
  donor_name text not null,
  amount numeric(12,2) not null check (amount > 0),
  purpose text,
  donated_at date not null default current_date,
  receipt_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id bigint generated always as identity primary key,
  category text not null default 'General',
  caption text not null,
  image_url text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.children
  add column if not exists profile_image_url text;

create index if not exists idx_staff_members_created_at on public.staff_members(created_at desc);
create index if not exists idx_donation_records_donated_at on public.donation_records(donated_at desc);
create index if not exists idx_gallery_images_created_at on public.gallery_images(created_at desc);

alter table public.staff_members enable row level security;
alter table public.donation_records enable row level security;
alter table public.gallery_images enable row level security;

drop policy if exists "Public can view children" on public.children;
create policy "Public can view children"
  on public.children
  for select
  to anon
  using (true);

drop policy if exists "Public can view staff members" on public.staff_members;
create policy "Public can view staff members"
  on public.staff_members
  for select
  to public
  using (true);

drop policy if exists "Authenticated can manage staff members" on public.staff_members;
create policy "Authenticated can manage staff members"
  on public.staff_members
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public can view donation records" on public.donation_records;
create policy "Public can view donation records"
  on public.donation_records
  for select
  to public
  using (true);

drop policy if exists "Authenticated can manage donation records" on public.donation_records;
create policy "Authenticated can manage donation records"
  on public.donation_records
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Public can view gallery images" on public.gallery_images;
create policy "Public can view gallery images"
  on public.gallery_images
  for select
  to public
  using (true);

drop policy if exists "Authenticated can manage gallery images" on public.gallery_images;
create policy "Authenticated can manage gallery images"
  on public.gallery_images
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view media objects" on storage.objects;
create policy "Public can view media objects"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

drop policy if exists "Authenticated can upload media objects" on storage.objects;
create policy "Authenticated can upload media objects"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "Authenticated can update media objects" on storage.objects;
create policy "Authenticated can update media objects"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "Authenticated can delete media objects" on storage.objects;
create policy "Authenticated can delete media objects"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');
