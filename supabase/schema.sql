-- =====================================================================
-- Trip Memory · Supabase schema + RLS
-- 把这整个文件粘到 Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- trips: 一次旅行（含所有地点 / 小回忆点 / 草稿数据）以 JSONB 整存
-- 用 JSONB 是因为 MVP 阶段不需要在数据库里查"所有美食类地点"这种维度
-- 后续要做服务端聚合再拆成 locations / photos 等子表也很容易
-- ---------------------------------------------------------------------
create table if not exists public.trips (
  id          text primary key,                                 -- 前端生成的 uid
  owner       uuid references auth.users(id) on delete cascade not null,
  data        jsonb not null,                                   -- 完整 trip 对象
  trip_title  text generated always as (data->>'tripTitle') stored,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create index if not exists trips_owner_idx on public.trips (owner);
create index if not exists trips_updated_idx on public.trips (updated_at desc);

alter table public.trips enable row level security;

drop policy if exists "owner can read"   on public.trips;
drop policy if exists "owner can insert" on public.trips;
drop policy if exists "owner can update" on public.trips;
drop policy if exists "owner can delete" on public.trips;

create policy "owner can read"
  on public.trips for select using (auth.uid() = owner);

create policy "owner can insert"
  on public.trips for insert with check (auth.uid() = owner);

create policy "owner can update"
  on public.trips for update using (auth.uid() = owner);

create policy "owner can delete"
  on public.trips for delete using (auth.uid() = owner);

-- ---------------------------------------------------------------------
-- shared_trips: 公开分享链接（任何人凭 token 只读访问）
-- ---------------------------------------------------------------------
create table if not exists public.shared_trips (
  token       text primary key,                                 -- 前端生成的随机 token
  trip_id     text references public.trips(id) on delete cascade not null,
  data        jsonb not null,                                   -- 分享时刻的快照
  created_by  uuid references auth.users(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  expires_at  timestamptz
);

create index if not exists shared_trips_trip_idx on public.shared_trips (trip_id);

alter table public.shared_trips enable row level security;

drop policy if exists "anyone can read share" on public.shared_trips;
drop policy if exists "owner can create share" on public.shared_trips;
drop policy if exists "owner can delete share" on public.shared_trips;

create policy "anyone can read share"
  on public.shared_trips for select using (true);

create policy "owner can create share"
  on public.shared_trips for insert with check (auth.uid() = created_by);

create policy "owner can delete share"
  on public.shared_trips for delete using (auth.uid() = created_by);

-- ---------------------------------------------------------------------
-- updated_at 自动维护
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trips_updated_at on public.trips;
create trigger trips_updated_at
  before update on public.trips
  for each row execute procedure public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Storage：photos bucket
-- 文件命名约定：{owner_uuid}/{trip_id}/{photo_id}.jpg
-- bucket 本身需要在 Dashboard → Storage → New bucket 创建，名字: photos, public ✓
-- 然后回到 SQL Editor 跑下面的 RLS（storage.objects 有独立 RLS）
-- ---------------------------------------------------------------------
drop policy if exists "users upload own photos"  on storage.objects;
drop policy if exists "anyone read photos"       on storage.objects;
drop policy if exists "users delete own photos"  on storage.objects;
drop policy if exists "users update own photos"  on storage.objects;

create policy "users upload own photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "anyone read photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "users delete own photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users update own photos"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
