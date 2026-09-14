// Local fallback data — used automatically whenever Supabase isn't configured
// yet (see src/lib/supabase.js), so the app is fully clickable in development.
// This is also exactly what supabase/schema.sql seeds into the real database,
// so behavior matches once Supabase is connected.

export const CATEGORIES = [
  { id: 'minis', label: 'Minis', icon: '🧁', priceNote: 'R$ 1,00 a unidade' },
  { id: 'grandes', label: 'Salgados grandes', icon: '🍗', priceNote: 'R$ 5,00 cada unidade' },
  { id: 'pasteis', label: 'Pastelzinhos crocantes', icon: '🥟', priceNote: 'R$ 1,00 a unidade' },
  { id: 'bebidas', label: 'Bebidas geladas', icon: '🥤', priceNote: 'Latas R$ 6,00 · 1 Litro R$ 8,00' },
]

export const DEMO_PRODUCTS = [
  { id: 'm-coxinha', cat: 'minis', name: 'Mini Coxinha de Frango', desc: 'Frango desfiado bem temperado.', long: 'Massa leve e recheio generoso de frango desfiado, bem temperado. Feita na hora, sempre quentinha.', price: 1, cost: 0.4, stock: 100, img: '/products/p-coxinha.jpeg', badge: 'MAIS VENDIDO', featured: true, active: true },
  { id: 'm-carne', cat: 'minis', name: 'Mini Bolinho de Carne', desc: 'Carne moída saborosa.', long: 'Bolinho crocante por fora com recheio de carne moída suculenta e temperada.', price: 1, cost: 0.4, stock: 100, img: '/products/p-carne.jpeg', active: true },
  { id: 'm-queijo', cat: 'minis', name: 'Mini Bolinho de Queijo', desc: 'Muito queijo e sabor.', long: 'Massa dourada com recheio cremoso de queijo que derrete na boca.', price: 1, cost: 0.4, stock: 100, img: '/products/p-queijo.jpeg', badge: 'QUERIDINHO', active: true },
  { id: 'm-risoles', cat: 'minis', name: 'Mini Risoles', desc: 'Presunto e queijo cremoso.', long: 'Risoles empanado e crocante com recheio cremoso de presunto e queijo.', price: 1, cost: 0.4, stock: 100, img: '/products/p-risoles.jpeg', active: true },
  { id: 'm-enrolado', cat: 'minis', name: 'Mini Enroladinho de Salsicha', desc: 'Salsicha envolvida na massa.', long: 'Salsicha suculenta envolvida em massa leve e frita na hora.', price: 1, cost: 0.4, stock: 100, img: '/products/p-enrolado.jpeg', active: true },
  { id: 'g-coxinha', cat: 'grandes', name: 'Coxinha', desc: 'Frango desfiado bem temperado.', long: 'A clássica da Piri: massa macia, recheio farto de frango desfiado e crocância na medida certa.', price: 5, cost: 1.8, stock: 60, img: '/products/p-coxinha.jpeg', badge: 'MAIS VENDIDO', featured: true, active: true },
  { id: 'g-carne', cat: 'grandes', name: 'Bolinho de Carne', desc: 'Carne moída saborosa.', long: 'Tamanho generoso, recheio de carne moída bem temperada e massa dourada.', price: 5, cost: 1.8, stock: 60, img: '/products/p-carne.jpeg', active: true },
  { id: 'g-queijo', cat: 'grandes', name: 'Bolinho de Queijo', desc: 'Muito queijo e sabor.', long: 'Puxa-puxa de verdade. Recheio farto de queijo em massa leve e crocante.', price: 5, cost: 1.8, stock: 60, img: '/products/p-queijo.jpeg', badge: 'QUERIDINHO', featured: true, active: true },
  { id: 'g-risoles', cat: 'grandes', name: 'Risoles', desc: 'Presunto e queijo cremoso.', long: 'Risoles grande, empanado e crocante, com recheio cremoso de presunto e queijo.', price: 5, cost: 1.8, stock: 60, img: '/products/p-risoles.jpeg', active: true },
  { id: 'g-enrolado', cat: 'grandes', name: 'Enrolado de Salsicha', desc: 'Salsicha suculenta envolvida na massa.', long: 'Salsicha inteira envolvida em massa macia e dourada.', price: 5, cost: 1.8, stock: 60, img: '/products/p-enrolado.jpeg', active: true },
  { id: 'p-frango', cat: 'pasteis', name: 'Pastelzinho de Frango', desc: 'Crocante e recheado.', long: 'Pastelzinho crocante com recheio de frango temperado. Perfeito pra beliscar.', price: 1, cost: 0.4, stock: 100, img: '/products/pasteis.png', badge: 'NOVO', featured: true, active: true },
  { id: 'p-carne', cat: 'pasteis', name: 'Pastelzinho de Carne', desc: 'Carne moída bem temperada.', long: 'Massa fininha e crocante com recheio de carne moída.', price: 1, cost: 0.4, stock: 100, img: '/products/pasteis.png', active: true },
  { id: 'p-queijo', cat: 'pasteis', name: 'Pastelzinho de Queijo', desc: 'Queijo derretido.', long: 'Pastelzinho crocante recheado com queijo derretido.', price: 1, cost: 0.4, stock: 100, img: '/products/pasteis.png', active: true },
  { id: 'p-calabresa', cat: 'pasteis', name: 'Pastelzinho de Calabresa', desc: 'Calabresa com cebola.', long: 'Recheio de calabresa moída com cebola, em massa crocante.', price: 1, cost: 0.4, stock: 100, img: '/products/pasteis.png', active: true },
  { id: 'beb-coca-lata', cat: 'bebidas', name: 'Coca-Cola Lata 350ml', desc: 'Bem geladinha.', long: 'Coca-Cola gelada, lata de 350ml.', price: 6, cost: 3, stock: 48, icon: true, iconKind: 'lata', iconColor: '#C1121F', active: true },
  { id: 'beb-guarana-lata', cat: 'bebidas', name: 'Guaraná Antarctica Lata 350ml', desc: 'Bem geladinha.', long: 'Guaraná Antarctica gelado, lata de 350ml.', price: 6, cost: 3, stock: 48, icon: true, iconKind: 'lata', iconColor: '#1f8a3b', active: true },
  { id: 'beb-sukita-lata', cat: 'bebidas', name: 'Sukita Laranja Lata 350ml', desc: 'Bem geladinha.', long: 'Sukita sabor laranja, lata de 350ml.', price: 6, cost: 3, stock: 48, icon: true, iconKind: 'lata', iconColor: '#FF8A00', active: true },
  { id: 'beb-sprite-lata', cat: 'bebidas', name: 'Sprite Lata 350ml', desc: 'Bem geladinha.', long: 'Sprite gelado, lata de 350ml.', price: 6, cost: 3, stock: 48, icon: true, iconKind: 'lata', iconColor: '#2E9E4F', active: true },
  { id: 'beb-coca-1l', cat: 'bebidas', name: 'Coca-Cola 1 Litro', desc: 'Garrafa de 1 litro.', long: 'Coca-Cola, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, icon: true, iconKind: 'garrafa', iconColor: '#C1121F', active: true },
  { id: 'beb-guarana-1l', cat: 'bebidas', name: 'Guaraná Antarctica 1 Litro', desc: 'Garrafa de 1 litro.', long: 'Guaraná Antarctica, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, icon: true, iconKind: 'garrafa', iconColor: '#1f8a3b', active: true },
  { id: 'beb-sukita-1l', cat: 'bebidas', name: 'Sukita Laranja 1 Litro', desc: 'Garrafa de 1 litro.', long: 'Sukita sabor laranja, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, icon: true, iconKind: 'garrafa', iconColor: '#FF8A00', active: true },
  { id: 'beb-soda-1l', cat: 'bebidas', name: 'Soda Limão 1 Litro', desc: 'Garrafa de 1 litro.', long: 'Soda Limonada, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, icon: true, iconKind: 'garrafa', iconColor: '#9ACD32', active: true },
]

export const DEMO_COMBOS = [
  { id: 'combo-8', name: '8 Salgados + Refrigerante 1L', price: 39, img: '/products/combo-8-salgados.jpeg', desc: 'Escolha 8 salgados fritos (coxinha, carne, queijo, risoles ou enrolado) + 1 refrigerante de 1 litro à sua escolha.' },
  { id: 'combo-33', name: 'Combo 3+3 + Refri 1L', price: 35, img: '/products/combo-3-mais-3.jpeg', desc: '3 salgados fritos + 3 salgados de forno (esfihas) + 1 refrigerante de 1 litro (Guaraná ou Pepsi).' },
  { id: 'combo-21', name: '2 Fritos + 1 Forno + Refri Lata', price: 20, img: '/products/combo-2-mais-1.jpeg', desc: '2 salgados fritos + 1 salgado de forno + 1 refrigerante lata 350ml.' },
]

export const DEMO_SETTINGS = {
  id: 'store',
  open_time: '10:00',
  close_time: '22:00',
  days_open: [0, 2, 3, 4, 5, 6],
  force_closed: false,
}

export const WHATSAPP_NUMBER = '557499829662'
export const MIN_ORDER = 15
