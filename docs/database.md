# Database Schema Documentation

This document provides the SQL schema and Row Level Security (RLS) policies required to initialize and configure Supabase for the Aruna Karsa website.

---

## 1. Table Definitions

Execute the following SQL script in the Supabase SQL Editor to set up the database structure.

### A. Site Configuration (`site_config`)

```sql
create table public.site_config (
    id bigint primary key generated always as identity,
    site_name text not null default 'Aruna Karsa',
    logo_url text,
    contact_email text,
    contact_phone text,
    contact_address text,
    social_links jsonb not null default '{"instagram": "", "facebook": "", "whatsapp": ""}'::jsonb,
    footer_text text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure only one row can exist
create unique index site_config_single_row_idx on public.site_config ((id = 1));
```

### B. Page Section Configurations (`pages`)

```sql
create table public.pages (
    id uuid default gen_random_uuid() primary key,
    page_name text not null unique,
    title text not null,
    description text,
    sections jsonb not null default '[]'::jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### C. Services (`services`)

```sql
create table public.services (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    icon_name text not null,
    features text[] not null default '{}'::text[],
    display_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### D. Portfolio Projects (`portfolio`)

```sql
create table public.portfolio (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text not null check (category in ('residential', 'commercial', 'interior')),
    category_label text not null,
    location text not null,
    year text not null,
    area text not null,
    status text not null check (status in ('Selesai', 'Pembangunan', 'Perencanaan')),
    image_url text,                                      -- legacy cover image (kept for compatibility)
    image_urls text[] not null default '{}'::text[],    -- primary: list of Discord CDN URLs
    description text not null,
    client text not null,
    materials text[] not null default '{}'::text[],
    tags text[] not null default '{}'::text[],
    price text,                                          -- optional, e.g. "Rp 2,5 Miliar"
    challenges text,
    solutions text,
    timeline text,                                       -- e.g. "8 bulan"
    design text,                                         -- design concept/style label
    team_members text[] not null default '{}'::text[],
    insights text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### E. Blog Posts (`blog_posts`)

```sql
create table public.blog_posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    excerpt text not null,
    content text not null,
    category text not null,
    author text not null,
    date text not null,
    read_time text not null,
    image_url text not null,
    is_published boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### F. Contact Form Submissions (`contact_submissions`)

```sql
create table public.contact_submissions (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    subject text,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### G. Reviews (`reviews`)

```sql
create table public.reviews (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    rating integer not null check (rating between 1 and 5),
    message text not null,
    is_published boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 2. Row Level Security (RLS) Policies

By default, PostgreSQL tables in Supabase have Row Level Security enabled. We allow public (anonymous) users to read all data, but only authenticated admin users can modify data.

```sql
-- Enable RLS on all tables
alter table public.site_config enable row level security;
alter table public.pages enable row level security;
alter table public.services enable row level security;
alter table public.portfolio enable row level security;
alter table public.blog_posts enable row level security;

---------------------------------------------------
-- site_config Policies
---------------------------------------------------
create policy "Allow public read access to site_config" 
on public.site_config for select using (true);

create policy "Allow admin write/update to site_config" 
on public.site_config for all using (auth.role() = 'authenticated');

---------------------------------------------------
-- pages Policies
---------------------------------------------------
create policy "Allow public read access to pages" 
on public.pages for select using (true);

create policy "Allow admin write/update to pages" 
on public.pages for all using (auth.role() = 'authenticated');

---------------------------------------------------
-- services Policies
---------------------------------------------------
create policy "Allow public read access to services" 
on public.services for select using (true);

create policy "Allow admin write/update to services" 
on public.services for all using (auth.role() = 'authenticated');

---------------------------------------------------
-- portfolio Policies
---------------------------------------------------
create policy "Allow public read access to portfolio" 
on public.portfolio for select using (true);

create policy "Allow admin write/update to portfolio" 
on public.portfolio for all using (auth.role() = 'authenticated');

---------------------------------------------------
-- blog_posts Policies
---------------------------------------------------
create policy "Allow public read access to blog_posts" 
on public.blog_posts for select using (true);

create policy "Allow admin write/update to blog_posts" 
on public.blog_posts for all using (auth.role() = 'authenticated');

---------------------------------------------------
-- contact_submissions Policies
---------------------------------------------------
create policy "Allow public insert to contact_submissions"
on public.contact_submissions for insert with check (true);

create policy "Allow admin read contact_submissions"
on public.contact_submissions for select using (auth.role() = 'authenticated');

---------------------------------------------------
-- reviews Policies
---------------------------------------------------
create policy "Allow public insert to reviews"
on public.reviews for insert with check (true);

create policy "Allow admin read/update reviews"
on public.reviews for all using (auth.role() = 'authenticated');

-- Enable RLS on new tables
alter table public.contact_submissions enable row level security;
alter table public.reviews enable row level security;
```

---

## 3. Storage Bucket & Policies

Create a public bucket named `aruna-assets`. Run the following storage policies under the storage schema:

```sql
-- Policies for public bucket 'aruna-assets'
-- Allow public select
create policy "Allow public read access to assets"
on storage.objects for select using (bucket_id = 'aruna-assets');

-- Allow authenticated upload
create policy "Allow admin upload to assets"
on storage.objects for insert with check (
    bucket_id = 'aruna-assets' 
    and auth.role() = 'authenticated'
);

-- Allow authenticated update/delete
create policy "Allow admin modify assets"
on storage.objects for all using (
    bucket_id = 'aruna-assets' 
    and auth.role() = 'authenticated'
);
```

---

## 4. Migration — Update 1.0 (for existing databases)

If your database was already initialized before Update 1.0, run the following in the **Supabase SQL Editor** to add the new columns and tables without losing existing data.

```sql
-- Portfolio: add new columns
ALTER TABLE public.portfolio
  ADD COLUMN IF NOT EXISTS image_urls  text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags        text[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS price       text,
  ADD COLUMN IF NOT EXISTS challenges  text,
  ADD COLUMN IF NOT EXISTS solutions   text,
  ADD COLUMN IF NOT EXISTS timeline    text,
  ADD COLUMN IF NOT EXISTS design      text,
  ADD COLUMN IF NOT EXISTS team_members text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS insights    text;

-- Make legacy image_url nullable (images now stored in image_urls[])
ALTER TABLE public.portfolio
  ALTER COLUMN image_url DROP NOT NULL;

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id         uuid default gen_random_uuid() primary key,
    name       text not null,
    email      text not null,
    phone      text,
    subject    text,
    message    text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id           uuid default gen_random_uuid() primary key,
    name         text not null,
    rating       integer not null check (rating between 1 and 5),
    message      text not null,
    is_published boolean not null default false,
    created_at   timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on new tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for contact_submissions
CREATE POLICY "Allow public insert to contact_submissions"
  ON public.contact_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read contact_submissions"
  ON public.contact_submissions FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for reviews
CREATE POLICY "Allow public insert to reviews"
  ON public.reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read/update reviews"
  ON public.reviews FOR ALL USING (auth.role() = 'authenticated');
```
