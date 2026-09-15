-- Piri Coxinha — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

create table if not exists products (
  id text primary key,
  cat text not null,
  name text not null,
  description text default '',
  long text default '',
  price numeric not null default 0,
  cost numeric not null default 0,
  stock integer not null default 0,
  badge text default '',
  img text default '',
  icon boolean default false,
  icon_kind text,
  icon_color text,
  featured boolean default false,
  active boolean not null default true
);

create table if not exists combos (
  id text primary key,
  name text not null,
  description text default '',
  price numeric not null default 0,
  img text default '',
  rules jsonb not null default '[]'
);

alter table combos add column if not exists rules jsonb not null default '[]';

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date_iso date not null default current_date,
  items jsonb not null default '[]',
  customer_name text default '',
  phone text default '',
  address text default '',
  total numeric not null default 0,
  cost numeric not null default 0,
  profit numeric not null default 0,
  payment text,
  change_for text,
  sauce_choice text,
  status text not null default 'pendente', -- pendente | preparo | entrega | finalizado
  source text not null default 'site' -- site | pdv
);

create table if not exists settings (
  id text primary key default 'store',
  open_time text not null default '10:00',
  close_time text not null default '22:00',
  days_open integer[] not null default '{0,2,3,4,5,6}',
  force_closed boolean not null default false
);

insert into settings (id) values ('store') on conflict (id) do nothing;

-- Row Level Security --------------------------------------------------------

alter table products enable row level security;
alter table combos enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;

-- Anyone (including anonymous site visitors) can read the menu and combos.
drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);
drop policy if exists "public read combos" on combos;
create policy "public read combos" on combos for select using (true);
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);

-- Only signed-in users (the owner, via Supabase Auth) can manage the catalog.
drop policy if exists "admin write products" on products;
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "admin write combos" on combos;
create policy "admin write combos" on combos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "admin write settings" on settings;
create policy "admin write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Site visitors can place an order (insert), but only the owner can read/manage
-- the order list (so a stranger can't browse other customers' orders/phones).
drop policy if exists "public create orders" on orders;
create policy "public create orders" on orders for insert with check (true);
drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders for select using (auth.role() = 'authenticated');
drop policy if exists "admin write orders" on orders;
create policy "admin write orders" on orders for update using (auth.role() = 'authenticated');
drop policy if exists "admin delete orders" on orders;
create policy "admin delete orders" on orders for delete using (auth.role() = 'authenticated');

-- Seed data -------------------------------------------------------------

insert into products (id, cat, name, description, long, price, cost, stock, badge, img, featured, active) values
  ('m-coxinha','minis','Coxinha de Frango','Frango desfiado bem temperado.','Massa leve e recheio generoso de frango desfiado, bem temperado. Feita na hora, sempre quentinha.',1,0.4,100,'MAIS VENDIDO','/products/p-coxinha.jpeg',true,true),
  ('m-carne','minis','Bolinho de Carne','Carne moída saborosa.','Bolinho crocante por fora com recheio de carne moída suculenta e temperada.',1,0.4,100,'','/products/p-carne.jpeg',false,true),
  ('m-queijo','minis','Bolinho de Queijo','Muito queijo e sabor.','Massa dourada com recheio cremoso de queijo que derrete na boca.',1,0.4,100,'QUERIDINHO','/products/p-queijo.jpeg',false,true),
  ('m-risoles','minis','Risoles','Presunto e queijo cremoso.','Risoles empanado e crocante com recheio cremoso de presunto e queijo.',1,0.4,100,'','/products/p-risoles.jpeg',false,true),
  ('m-enrolado','minis','Enroladinho de Salsicha','Salsicha envolvida na massa.','Salsicha suculenta envolvida em massa leve e frita na hora.',1,0.4,100,'','/products/p-enrolado.jpeg',false,true),
  ('g-esfiha-carne','forno','Esfiha de Carne','Recheio de carne moída bem temperada.','Esfiha assada no forno, recheio farto de carne moída bem temperada.',6,2,40,'','/products/forno-esfiha-carne.jpeg',false,true),
  ('g-esfiha-frango','forno','Esfiha de Frango c/ Requeijão','Frango desfiado com requeijão cremoso.','Esfiha assada no forno, recheio de frango desfiado com requeijão cremoso.',6,2,40,'','/products/forno-esfiha-frango.jpeg',false,true),
  ('g-esfiha-calabresa','forno','Esfiha de Calabresa c/ Requeijão','Calabresa moída com requeijão cremoso.','Esfiha assada no forno, recheio de calabresa moída com requeijão cremoso.',6,2,40,'','/products/forno-esfiha-calabresa.jpeg',false,true),
  ('g-bauru','forno','Baurú','Pão fofinho recheado, assado no forno.','Baurú assado no forno, pão fofinho e recheio generoso.',6,2,40,'','/products/forno-bauru.jpeg',false,true),
  ('g-hamburgao','forno','Hambúrgão c/ Cheddar','Pão recheado com cheddar derretido.','Hambúrgão assado no forno, recheado com cheddar derretido.',6,2,40,'','/products/forno-hamburgao-cheddar.jpeg',false,true),
  ('g-doguinho','forno','Doguinho c/ Requeijão','Pãozinho macio com salsicha e requeijão.','Doguinho assado no forno, pãozinho macio com salsicha e requeijão cremoso.',6,2,40,'','/products/forno-doguinho.jpeg',false,true)
on conflict (id) do nothing;

-- "Salgados Fritos Grande" (grandes) and the old fried "Pastelzinho de ..."
-- items are gone for good — they'll be added manually from the admin
-- Cardápio page instead of being auto-seeded. If you ever re-run an older
-- copy of this script, this cleans them back out (safe to run any time).
delete from products where id in
  ('g-coxinha','g-carne','g-queijo','g-risoles','g-enrolado','p-frango','p-carne','p-queijo','p-calabresa');

insert into products (id, cat, name, description, long, price, cost, stock, img, active) values
  ('beb-coca-lata','bebidas','Coca-Cola Lata 350ml','Bem geladinha.','Coca-Cola gelada, lata de 350ml.',6,3,48,'/products/beb-coca-lata.jpg',true),
  ('beb-guarana-lata','bebidas','Guaraná Antarctica Lata 350ml','Bem geladinha.','Guaraná Antarctica gelado, lata de 350ml.',6,3,48,'/products/beb-guarana-lata.jpg',true),
  ('beb-sukita-lata','bebidas','Sukita Laranja Lata 350ml','Bem geladinha.','Sukita sabor laranja, lata de 350ml.',6,3,48,'/products/beb-sukita-lata.jpg',true),
  ('beb-sprite-lata','bebidas','Sprite Lata 350ml','Bem geladinha.','Sprite gelado, lata de 350ml.',6,3,48,'/products/beb-sprite-lata.jpg',true),
  ('beb-coca-1l','bebidas','Coca-Cola 1 Litro','Garrafa de 1 litro.','Coca-Cola, garrafa de 1 litro.',8,4,24,'/products/beb-coca-1l.jpg',true),
  ('beb-guarana-1l','bebidas','Guaraná Antarctica 1 Litro','Garrafa de 1 litro.','Guaraná Antarctica, garrafa de 1 litro.',8,4,24,'/products/beb-guarana-1l.jpg',true),
  ('beb-sukita-1l','bebidas','Sukita Laranja 1 Litro','Garrafa de 1 litro.','Sukita sabor laranja, garrafa de 1 litro.',8,4,24,'/products/beb-sukita-1l.jpg',true),
  ('beb-soda-1l','bebidas','Sprite 1 Litro','Garrafa de 1 litro.','Sprite, garrafa de 1 litro.',8,4,24,'/products/beb-sprite-1l.jpg',true)
on conflict (id) do nothing;

-- Switch the drinks that already existed (inserted before we had real
-- photos) from the placeholder icon over to the real photo, and correct the
-- 1L flavor that turned out to be Sprite, not "Soda Limão".
update products set icon = false, img = '/products/beb-coca-lata.jpg' where id = 'beb-coca-lata';
update products set icon = false, img = '/products/beb-guarana-lata.jpg' where id = 'beb-guarana-lata';
update products set icon = false, img = '/products/beb-sukita-lata.jpg' where id = 'beb-sukita-lata';
update products set icon = false, img = '/products/beb-sprite-lata.jpg' where id = 'beb-sprite-lata';
update products set icon = false, img = '/products/beb-coca-1l.jpg' where id = 'beb-coca-1l';
update products set icon = false, img = '/products/beb-guarana-1l.jpg' where id = 'beb-guarana-1l';
update products set icon = false, img = '/products/beb-sukita-1l.jpg' where id = 'beb-sukita-1l';
update products set icon = false, img = '/products/beb-sprite-1l.jpg', name = 'Sprite 1 Litro', description = 'Garrafa de 1 litro.', long = 'Sprite, garrafa de 1 litro.' where id = 'beb-soda-1l';

insert into combos (id, name, description, price, img, rules) values
  ('combo-8','8 Salgados + Refrigerante 1L','Escolha 8 salgados fritos (coxinha, carne, queijo, risoles ou enrolado) + 1 refrigerante de 1 litro à sua escolha.',39,'/products/combo-8-salgados.jpeg',
    '[{"key":"fritos","label":"Escolha 8 salgados fritos","count":8,"productIds":["m-coxinha","m-carne","m-queijo","m-risoles","m-enrolado"]},{"key":"bebida","label":"Escolha 1 refrigerante de 1 litro","count":1,"productIds":["beb-coca-1l","beb-guarana-1l","beb-sukita-1l","beb-soda-1l"]}]'::jsonb),
  ('combo-33','Combo 3+3 + Refri 1L','3 salgados fritos + 3 salgados de forno (esfihas) + 1 refrigerante de 1 litro.',35,'/products/combo-3-mais-3.jpeg',
    '[{"key":"fritos","label":"Escolha 3 salgados fritos","count":3,"productIds":["m-coxinha","m-carne","m-queijo","m-risoles","m-enrolado"]},{"key":"forno","label":"Escolha 3 salgados de forno","count":3,"productIds":["g-esfiha-carne","g-esfiha-frango","g-esfiha-calabresa","g-bauru","g-hamburgao","g-doguinho"]},{"key":"bebida","label":"Escolha 1 refrigerante de 1 litro","count":1,"productIds":["beb-coca-1l","beb-guarana-1l","beb-sukita-1l","beb-soda-1l"]}]'::jsonb),
  ('combo-21','2 Fritos + 1 Forno + Refri Lata','2 salgados fritos + 1 salgado de forno + 1 refrigerante lata 350ml.',20,'/products/combo-2-mais-1.jpeg',
    '[{"key":"fritos","label":"Escolha 2 salgados fritos","count":2,"productIds":["m-coxinha","m-carne","m-queijo","m-risoles","m-enrolado"]},{"key":"forno","label":"Escolha 1 salgado de forno","count":1,"productIds":["g-esfiha-carne","g-esfiha-frango","g-esfiha-calabresa","g-bauru","g-hamburgao","g-doguinho"]},{"key":"bebida","label":"Escolha 1 refrigerante lata","count":1,"productIds":["beb-coca-lata","beb-guarana-lata","beb-sukita-lata","beb-sprite-lata"]}]'::jsonb)
on conflict (id) do nothing;

-- Backfill rules for combos that already existed before the "rules" column
-- was added (on conflict do nothing above skips them on re-run).
update combos set rules = '[{"key":"fritos","label":"Escolha 8 salgados fritos","count":8,"productIds":["m-coxinha","m-carne","m-queijo","m-risoles","m-enrolado"]},{"key":"bebida","label":"Escolha 1 refrigerante de 1 litro","count":1,"productIds":["beb-coca-1l","beb-guarana-1l","beb-sukita-1l","beb-soda-1l"]}]'::jsonb
  where id = 'combo-8' and (rules is null or rules = '[]'::jsonb);
update combos set rules = '[{"key":"fritos","label":"Escolha 3 salgados fritos","count":3,"productIds":["m-coxinha","m-carne","m-queijo","m-risoles","m-enrolado"]},{"key":"forno","label":"Escolha 3 salgados de forno","count":3,"productIds":["g-esfiha-carne","g-esfiha-frango","g-esfiha-calabresa","g-bauru","g-hamburgao","g-doguinho"]},{"key":"bebida","label":"Escolha 1 refrigerante de 1 litro","count":1,"productIds":["beb-coca-1l","beb-guarana-1l","beb-sukita-1l","beb-soda-1l"]}]'::jsonb
  where id = 'combo-33' and (rules is null or rules = '[]'::jsonb);
update combos set rules = '[{"key":"fritos","label":"Escolha 2 salgados fritos","count":2,"productIds":["m-coxinha","m-carne","m-queijo","m-risoles","m-enrolado"]},{"key":"forno","label":"Escolha 1 salgado de forno","count":1,"productIds":["g-esfiha-carne","g-esfiha-frango","g-esfiha-calabresa","g-bauru","g-hamburgao","g-doguinho"]},{"key":"bebida","label":"Escolha 1 refrigerante lata","count":1,"productIds":["beb-coca-lata","beb-guarana-lata","beb-sukita-lata","beb-sprite-lata"]}]'::jsonb
  where id = 'combo-21' and (rules is null or rules = '[]'::jsonb);

-- Fix names for rows already inserted by an earlier run of this script ---

update products set name = 'Coxinha de Frango' where id = 'm-coxinha';
update products set name = 'Bolinho de Carne' where id = 'm-carne';
update products set name = 'Bolinho de Queijo' where id = 'm-queijo';
update products set name = 'Risoles' where id = 'm-risoles';
update products set name = 'Enroladinho de Salsicha' where id = 'm-enrolado';

-- Move the forno items into their own category (was lumped into "grandes"
-- earlier). Doesn't touch price/cost/stock in case you already edited those
-- from the admin — only fixes the category.
update products set cat = 'forno' where id in
  ('g-esfiha-carne','g-esfiha-frango','g-esfiha-calabresa','g-bauru','g-hamburgao','g-doguinho');

-- Realtime -------------------------------------------------------------
-- Without this, changes made in the admin (or by another customer) only
-- show up for other open tabs/devices after a manual reload. Safe to run
-- more than once — it skips any table already in the publication.

do $$
declare
  t text;
begin
  foreach t in array array['products','combos','orders','settings'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
