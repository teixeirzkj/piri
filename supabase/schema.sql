-- Piri Coxinha — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

create table if not exists products (
  id text primary key,
  cat text not null,
  name text not null,
  desc text default '',
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
  desc text default '',
  price numeric not null default 0,
  img text default ''
);

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
create policy "public read products" on products for select using (true);
create policy "public read combos" on combos for select using (true);
create policy "public read settings" on settings for select using (true);

-- Only signed-in users (the owner, via Supabase Auth) can manage the catalog.
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write combos" on combos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Site visitors can place an order (insert), but only the owner can read/manage
-- the order list (so a stranger can't browse other customers' orders/phones).
create policy "public create orders" on orders for insert with check (true);
create policy "admin read orders" on orders for select using (auth.role() = 'authenticated');
create policy "admin write orders" on orders for update using (auth.role() = 'authenticated');
create policy "admin delete orders" on orders for delete using (auth.role() = 'authenticated');

-- Seed data -------------------------------------------------------------

insert into products (id, cat, name, desc, long, price, cost, stock, badge, img, featured, active) values
  ('m-coxinha','minis','Mini Coxinha de Frango','Frango desfiado bem temperado.','Massa leve e recheio generoso de frango desfiado, bem temperado. Feita na hora, sempre quentinha.',1,0.4,100,'MAIS VENDIDO','/products/p-coxinha.jpeg',true,true),
  ('m-carne','minis','Mini Bolinho de Carne','Carne moída saborosa.','Bolinho crocante por fora com recheio de carne moída suculenta e temperada.',1,0.4,100,'','/products/p-carne.jpeg',false,true),
  ('m-queijo','minis','Mini Bolinho de Queijo','Muito queijo e sabor.','Massa dourada com recheio cremoso de queijo que derrete na boca.',1,0.4,100,'QUERIDINHO','/products/p-queijo.jpeg',false,true),
  ('m-risoles','minis','Mini Risoles','Presunto e queijo cremoso.','Risoles empanado e crocante com recheio cremoso de presunto e queijo.',1,0.4,100,'','/products/p-risoles.jpeg',false,true),
  ('m-enrolado','minis','Mini Enroladinho de Salsicha','Salsicha envolvida na massa.','Salsicha suculenta envolvida em massa leve e frita na hora.',1,0.4,100,'','/products/p-enrolado.jpeg',false,true),
  ('g-coxinha','grandes','Coxinha','Frango desfiado bem temperado.','A clássica da Piri: massa macia, recheio farto de frango desfiado e crocância na medida certa.',5,1.8,60,'MAIS VENDIDO','/products/p-coxinha.jpeg',true,true),
  ('g-carne','grandes','Bolinho de Carne','Carne moída saborosa.','Tamanho generoso, recheio de carne moída bem temperada e massa dourada.',5,1.8,60,'','/products/p-carne.jpeg',false,true),
  ('g-queijo','grandes','Bolinho de Queijo','Muito queijo e sabor.','Puxa-puxa de verdade. Recheio farto de queijo em massa leve e crocante.',5,1.8,60,'QUERIDINHO','/products/p-queijo.jpeg',true,true),
  ('g-risoles','grandes','Risoles','Presunto e queijo cremoso.','Risoles grande, empanado e crocante, com recheio cremoso de presunto e queijo.',5,1.8,60,'','/products/p-risoles.jpeg',false,true),
  ('g-enrolado','grandes','Enrolado de Salsicha','Salsicha suculenta envolvida na massa.','Salsicha inteira envolvida em massa macia e dourada.',5,1.8,60,'','/products/p-enrolado.jpeg',false,true),
  ('g-esfiha-carne','grandes','Esfiha de Carne','Recheio de carne moída bem temperada.','Esfiha assada no forno, recheio farto de carne moída bem temperada.',1,0.4,40,'','/products/forno-esfiha-carne.jpeg',false,true),
  ('g-esfiha-frango','grandes','Esfiha de Frango c/ Requeijão','Frango desfiado com requeijão cremoso.','Esfiha assada no forno, recheio de frango desfiado com requeijão cremoso.',1,0.4,40,'','/products/forno-esfiha-frango.jpeg',false,true),
  ('g-esfiha-calabresa','grandes','Esfiha de Calabresa c/ Requeijão','Calabresa moída com requeijão cremoso.','Esfiha assada no forno, recheio de calabresa moída com requeijão cremoso.',1,0.4,40,'','/products/forno-esfiha-calabresa.jpeg',false,true),
  ('g-bauru','grandes','Baurú','Pão fofinho recheado, assado no forno.','Baurú assado no forno, pão fofinho e recheio generoso.',1,0.4,40,'','/products/forno-bauru.jpeg',false,true),
  ('g-hamburgao','grandes','Hambúrgão c/ Cheddar','Pão recheado com cheddar derretido.','Hambúrgão assado no forno, recheado com cheddar derretido.',1,0.4,40,'','/products/forno-hamburgao-cheddar.jpeg',false,true),
  ('g-doguinho','grandes','Doguinho c/ Requeijão','Pãozinho macio com salsicha e requeijão.','Doguinho assado no forno, pãozinho macio com salsicha e requeijão cremoso.',1,0.4,40,'','/products/forno-doguinho.jpeg',false,true),
  ('p-frango','pasteis','Pastelzinho de Frango','Crocante e recheado.','Pastelzinho crocante com recheio de frango temperado. Perfeito pra beliscar.',1,0.4,100,'NOVO','/products/pasteis.png',true,true),
  ('p-carne','pasteis','Pastelzinho de Carne','Carne moída bem temperada.','Massa fininha e crocante com recheio de carne moída.',1,0.4,100,'','/products/pasteis.png',false,true),
  ('p-queijo','pasteis','Pastelzinho de Queijo','Queijo derretido.','Pastelzinho crocante recheado com queijo derretido.',1,0.4,100,'','/products/pasteis.png',false,true),
  ('p-calabresa','pasteis','Pastelzinho de Calabresa','Calabresa com cebola.','Recheio de calabresa moída com cebola, em massa crocante.',1,0.4,100,'','/products/pasteis.png',false,true)
on conflict (id) do nothing;

insert into products (id, cat, name, desc, long, price, cost, stock, icon, icon_kind, icon_color, active) values
  ('beb-coca-lata','bebidas','Coca-Cola Lata 350ml','Bem geladinha.','Coca-Cola gelada, lata de 350ml.',6,3,48,true,'lata','#C1121F',true),
  ('beb-guarana-lata','bebidas','Guaraná Antarctica Lata 350ml','Bem geladinha.','Guaraná Antarctica gelado, lata de 350ml.',6,3,48,true,'lata','#1f8a3b',true),
  ('beb-sukita-lata','bebidas','Sukita Laranja Lata 350ml','Bem geladinha.','Sukita sabor laranja, lata de 350ml.',6,3,48,true,'lata','#FF8A00',true),
  ('beb-sprite-lata','bebidas','Sprite Lata 350ml','Bem geladinha.','Sprite gelado, lata de 350ml.',6,3,48,true,'lata','#2E9E4F',true),
  ('beb-coca-1l','bebidas','Coca-Cola 1 Litro','Garrafa de 1 litro.','Coca-Cola, garrafa de 1 litro.',8,4,24,true,'garrafa','#C1121F',true),
  ('beb-guarana-1l','bebidas','Guaraná Antarctica 1 Litro','Garrafa de 1 litro.','Guaraná Antarctica, garrafa de 1 litro.',8,4,24,true,'garrafa','#1f8a3b',true),
  ('beb-sukita-1l','bebidas','Sukita Laranja 1 Litro','Garrafa de 1 litro.','Sukita sabor laranja, garrafa de 1 litro.',8,4,24,true,'garrafa','#FF8A00',true),
  ('beb-soda-1l','bebidas','Soda Limão 1 Litro','Garrafa de 1 litro.','Soda Limonada, garrafa de 1 litro.',8,4,24,true,'garrafa','#9ACD32',true)
on conflict (id) do nothing;

insert into combos (id, name, desc, price, img) values
  ('combo-8','8 Salgados + Refrigerante 1L','Escolha 8 salgados fritos (coxinha, carne, queijo, risoles ou enrolado) + 1 refrigerante de 1 litro à sua escolha.',39,'/products/combo-8-salgados.jpeg'),
  ('combo-33','Combo 3+3 + Refri 1L','3 salgados fritos + 3 salgados de forno (esfihas) + 1 refrigerante de 1 litro (Guaraná ou Pepsi).',35,'/products/combo-3-mais-3.jpeg'),
  ('combo-21','2 Fritos + 1 Forno + Refri Lata','2 salgados fritos + 1 salgado de forno + 1 refrigerante lata 350ml.',20,'/products/combo-2-mais-1.jpeg')
on conflict (id) do nothing;
