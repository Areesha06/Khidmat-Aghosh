-- Seeds a default admin account for first-time access.
-- Change this password immediately after first login.

do $$
declare
  admin_user_id uuid;
  default_admin_email text := 'admin@khidmataghosh.com';
  default_admin_password text := 'Admin@12345';
begin
  select id
  into admin_user_id
  from auth.users
  where email = default_admin_email
  limit 1;

  if admin_user_id is null then
    admin_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      default_admin_email,
      crypt(default_admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );
  end if;

  insert into public.admin_profiles (user_id, email, role, full_name)
  values (admin_user_id, default_admin_email, 'admin', 'Basic Admin')
  on conflict (user_id) do update
    set email = excluded.email,
        role = 'admin',
        full_name = coalesce(public.admin_profiles.full_name, excluded.full_name),
        updated_at = now();
end $$;
