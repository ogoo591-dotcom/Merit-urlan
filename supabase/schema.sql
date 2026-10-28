-- Merit урлан: Supabase SQL Editor дээр бүтнээр нь нэг удаа ажиллуулна.
-- Бүх хандалт сервер талаас service_role түлхүүрээр явдаг тул RLS асаалттай,
-- policy байхгүй (anon түлхүүрээр хэн ч шууд уншиж/бичиж чадахгүй).

create table if not exists public.products (
  slug          text primary key,
  name          text not null,
  category      text not null check (category in ('supplies', 'finished')),
  subcategory   text not null default '',
  price         integer not null check (price >= 0),
  stock         integer not null default 0 check (stock >= 0),
  brand         text not null default '-',
  image         text not null default '',
  description   text not null default '',
  badge         text,
  features      text[] not null default '{}',
  -- Нэг барааны өнгө/хэмжээний хувилбарууд ижил group_slug-тай байна.
  group_slug    text,
  option_label  text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category, sort_order);
create index if not exists products_group_idx on public.products (group_slug);

create table if not exists public.orders (
  id             bigint generated always as identity primary key,
  user_id        text not null,
  customer_name  text not null,
  phone          text not null,
  email          text,
  address        text not null,
  note           text,
  items          jsonb not null,
  total          integer not null,
  status         text not null default 'new'
                 check (status in ('new', 'confirmed', 'delivered', 'cancelled')),
  created_at     timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

create table if not exists public.course_enrollments (
  id            bigint generated always as identity primary key,
  user_id       text not null,
  course_title  text not null,
  customer_name text not null,
  phone         text not null,
  email         text,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'enrolled', 'cancelled')),
  created_at    timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.course_enrollments enable row level security;

-- Захиалга үүсгэх: үнийг сангаас авч, үлдэгдлийг шалгаж хасна. Бүгд нэг
-- транзакц дотор явагддаг тул хоёр хүн зэрэг сүүлийн ширхэгийг авч чадахгүй.
create or replace function public.place_order(
  p_user_id text,
  p_customer_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_note text,
  p_items jsonb
) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  line jsonb;
  product public.products%rowtype;
  qty integer;
  order_items jsonb := '[]'::jsonb;
  order_total integer := 0;
  new_id bigint;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  for line in select * from jsonb_array_elements(p_items) loop
    qty := (line->>'quantity')::integer;
    if qty is null or qty < 1 then
      raise exception 'BAD_QUANTITY';
    end if;

    select * into product from public.products
      where slug = line->>'slug' and is_active
      for update;

    if not found then
      raise exception 'NOT_FOUND:%', line->>'slug';
    end if;
    if product.stock < qty then
      raise exception 'OUT_OF_STOCK:%', product.name;
    end if;

    update public.products
      set stock = stock - qty, updated_at = now()
      where slug = product.slug;

    order_items := order_items || jsonb_build_object(
      'slug', product.slug,
      'name', product.name,
      'price', product.price,
      'quantity', qty
    );
    order_total := order_total + product.price * qty;
  end loop;

  insert into public.orders (user_id, customer_name, phone, email, address, note, items, total)
    values (p_user_id, p_customer_name, p_phone, p_email, p_address, p_note, order_items, order_total)
    returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.place_order from public, anon, authenticated;

-- Захиалгын төлөв солих. Цуцлахад үлдэгдлийг буцааж нэмнэ, цуцалснаа
-- сэргээхэд дахин хасна.
create or replace function public.set_order_status(p_order_id bigint, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order public.orders%rowtype;
  line jsonb;
  direction integer := 0;
begin
  select * into current_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;

  if current_order.status <> 'cancelled' and p_status = 'cancelled' then
    direction := 1;
  elsif current_order.status = 'cancelled' and p_status <> 'cancelled' then
    direction := -1;
  end if;

  if direction <> 0 then
    for line in select * from jsonb_array_elements(current_order.items) loop
      update public.products
        set stock = stock + direction * (line->>'quantity')::integer, updated_at = now()
        where slug = line->>'slug';
    end loop;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;

revoke all on function public.set_order_status from public, anon, authenticated;

-- Барааны зургийн хадгалах сан (олон нийтэд харагдана, зөвхөн сервер бичнэ).
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;
