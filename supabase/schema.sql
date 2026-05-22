-- Execute no SQL Editor do Supabase

-- Tabela de vídeos + transcrições
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  file_url text,
  transcript text,
  status text not null default 'processing',
  settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;

create policy "Allow public read videos"
  on public.videos for select
  using (true);

create policy "Allow public insert videos"
  on public.videos for insert
  with check (true);

create policy "Allow public update videos"
  on public.videos for update
  using (true);

-- Bucket de storage (crie também no painel: Storage > New bucket > "videos" > public)
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

create policy "Public read videos bucket"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Public upload videos bucket"
  on storage.objects for insert
  with check (bucket_id = 'videos');
