-- Enable PostGIS for geospatial queries (optional but recommended for lat/lng)
create extension if not exists postgis;

-- 1. Create reports table
create table public.reports (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    lat double precision not null,
    lng double precision not null,
    address text,
    district text,
    accused_name text,
    category text not null,
    description text not null,
    status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
    ip_hash text not null,
    true_votes integer default 0,
    false_votes integer default 0
);

-- 2. Create report_photos table
create table public.report_photos (
    id uuid default gen_random_uuid() primary key,
    report_id uuid references public.reports(id) on delete cascade not null,
    photo_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create votes table
create table public.votes (
    id uuid default gen_random_uuid() primary key,
    report_id uuid references public.reports(id) on delete cascade not null,
    vote_type text check (vote_type in ('yes', 'no')) not null,
    ip_hash text not null,
    voted_at date default current_date not null,
    unique(report_id, ip_hash, voted_at) -- Prevent multiple votes per day per IP
);

-- 4. RLS Policies
alter table public.reports enable row level security;
alter table public.report_photos enable row level security;
alter table public.votes enable row level security;

-- Allow public read access
create policy "Reports are viewable by everyone" on public.reports for select using (true);
create policy "Photos are viewable by everyone" on public.report_photos for select using (true);
create policy "Votes are viewable by everyone" on public.votes for select using (true);

-- Allow inserts (if using anon key from client, otherwise backend service key bypasses RLS)
create policy "Anyone can insert reports" on public.reports for insert with check (true);
create policy "Anyone can insert photos" on public.report_photos for insert with check (true);
create policy "Anyone can insert votes" on public.votes for insert with check (true);

-- 5. Function to increment votes safely
create or replace function increment_vote_count(report_id_to_update uuid, column_to_increment text)
returns void as $$
begin
  if column_to_increment = 'true_votes' then
    update public.reports set true_votes = true_votes + 1 where id = report_id_to_update;
  elsif column_to_increment = 'false_votes' then
    update public.reports set false_votes = false_votes + 1 where id = report_id_to_update;
  end if;
end;
$$ language plpgsql security definer;
