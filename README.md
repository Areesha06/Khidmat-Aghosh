This is our Khidmat Project for Al-Khidmat Aghosh Homes. The project consists of a working prototype of the Aghosh Home Orphanage Management System, including all major modules such as: 

- Orphan profiles management 
- Staff/volunteer management 
- Donation tracking system 
- Events & announcements 
- Attendance & daily activity records 
- Secure login & role-based access 

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

STATUS = IN PROGRESS

## Supabase + PostgreSQL Setup

This project now includes Supabase integration for:

- PostgreSQL schema based on the ERD
- Admin email/password authentication
- Forgot password by email link
- Super-admin OTP fallback through Brevo (Sendinblue)

### 1) Frontend Environment

Create a `.env` file from `.env.example` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2) Database Schema (ERD)

Apply migration:

- `supabase/migrations/20260404_initial_schema.sql`
- `supabase/migrations/20260405_seed_basic_admin.sql`

It creates:

- `schools`
- `mothers`
- `guardians`
- `donors`
- `donor_contacts`
- `children`
- `orphan_guardians`
- `orphan_donors`
- `admin_profiles`
- `admin_recovery_otps`
- `staff_members`
- `donation_records`
- `gallery_images`

### 2.1) Supabase Storage for Images

- Public storage bucket: `media`
- Supported app uploads:
- Child profile photos
- Staff profile photos
- Donation receipt images
- Gallery images

### 3) Edge Functions for OTP Recovery

Functions:

- `send-recovery-otp`: sends OTP to `hassaanuq@gmail.com` through Brevo
- `verify-recovery-otp`: verifies OTP, updates admin email/password in Supabase Auth

Deploy with Supabase CLI:

1. `supabase functions deploy send-recovery-otp`
2. `supabase functions deploy verify-recovery-otp`

Set function secrets:

1. `supabase secrets set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co`
2. `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY`
3. `supabase secrets set BREVO_API_KEY=YOUR_BREVO_API_KEY`
4. `supabase secrets set SUPER_ADMIN_EMAIL=hassaanuq@gmail.com`

### 4) Auth Flow Implemented

Default bootstrap admin (from seed migration):

- Email: `admin@khidmataghosh.com`
- Password: `Admin@12345`
- Action required: log in and change password immediately.

1. Admin logs in with email/password.
2. If password is forgotten:
	- Standard flow: reset link sent to admin email.
	- Fallback flow: admin clicks "I do not have access to this email".
3. OTP is sent to super admin email (`hassaanuq@gmail.com`).
4. Admin gets OTP from super admin.
5. Admin enters OTP, sets new email and password.
6. System updates the admin account to the new email.

### 5) Frontend Routes Added

- `/login`
- `/forgot-password`
- `/recovery-otp`
- `/reset-password`

Protected routes:

- `/orphans`
- `/staff`
- `/donations`
- `/events`
- `/gallery`
- `/announcements`
- `/reports`
- `/settings`