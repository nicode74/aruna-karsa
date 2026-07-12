-- Migration for Update 1.4

-- Create staff_members table
CREATE TABLE IF NOT EXISTS public.staff_members (
    id         uuid default gen_random_uuid() primary key,
    email      text unique not null,
    name       text not null,
    role       text not null check (role in ('manager', 'staff')) default 'staff',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for staff_members
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Policies for staff_members (authenticated users only)
CREATE POLICY "Allow auth admin/staff access to staff_members"
    ON public.staff_members FOR ALL USING (auth.role() = 'authenticated');


-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id          uuid default gen_random_uuid() primary key,
    title       text not null,
    description text,
    assigned_to text references public.staff_members(email) on delete set null,
    status      text not null check (status in ('Pending', 'In Progress', 'Completed')) default 'Pending',
    start_date  date not null,
    due_date    date not null,
    priority    text not null check (priority in ('Low', 'Medium', 'High')) default 'Medium',
    created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies for tasks (authenticated users only)
CREATE POLICY "Allow auth admin/staff access to tasks"
    ON public.tasks FOR ALL USING (auth.role() = 'authenticated');
