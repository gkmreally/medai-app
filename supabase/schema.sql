create extension if not exists "pgcrypto";

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer,
  gender text,
  phone text,
  diagnosis text,
  chief_complaint text,
  risk_level text default '低',
  latest_vitals jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  visit_date date not null,
  visit_type text default '普通复诊',
  note text,
  created_at timestamptz not null default now()
);

alter table public.patients enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "allow anon read patients" on public.patients;
create policy "allow anon read patients"
on public.patients for select
to anon, authenticated
using (true);

drop policy if exists "allow anon insert patients" on public.patients;
create policy "allow anon insert patients"
on public.patients for insert
to anon, authenticated
with check (true);

drop policy if exists "allow anon delete patients" on public.patients;
create policy "allow anon delete patients"
on public.patients for delete
to anon, authenticated
using (true);

drop policy if exists "allow anon read appointments" on public.appointments;
create policy "allow anon read appointments"
on public.appointments for select
to anon, authenticated
using (true);

drop policy if exists "allow anon insert appointments" on public.appointments;
create policy "allow anon insert appointments"
on public.appointments for insert
to anon, authenticated
with check (true);

insert into public.appointments (patient_name, visit_date, visit_type, note)
values
('张三', current_date + 1, '血压复诊', '关注早晨血压'),
('李四', current_date + 3, '糖尿病复诊', '复查空腹血糖');
