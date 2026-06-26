-- Migration for Update 1.2

-- Create active_projects table
CREATE TABLE IF NOT EXISTS public.active_projects (
    id                  uuid default gen_random_uuid() primary key,
    name                text not null,
    client_name         text not null,
    status              text not null check (status in ('Perencanaan', 'Konstruksi', 'Finishing', 'Selesai')),
    progress_percentage integer not null default 0 check (progress_percentage between 0 and 100),
    start_date          text,
    target_date         text,
    description         text,
    created_at          timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for active_projects
ALTER TABLE public.active_projects ENABLE ROW LEVEL SECURITY;

-- Policies for active_projects
CREATE POLICY "Allow public read access to active_projects"
    ON public.active_projects FOR SELECT USING (true);

CREATE POLICY "Allow admin write/update to active_projects"
    ON public.active_projects FOR ALL USING (auth.role() = 'authenticated');


-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id               uuid default gen_random_uuid() primary key,
    invoice_number   text not null unique,
    client_name      text not null,
    client_email     text not null,
    project_name     text not null,
    amount           numeric not null,
    status           text not null check (status in ('Draft', 'Sent', 'Paid', 'Overdue')),
    issue_date       date not null default current_date,
    due_date         date not null,
    invoice_file_url text,
    payment_history  jsonb not null default '[]'::jsonb,
    reminders_sent   integer not null default 0,
    created_at       timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for invoices (Admin only)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Policies for invoices
CREATE POLICY "Allow admin read/write/update/delete to invoices"
    ON public.invoices FOR ALL USING (auth.role() = 'authenticated');
