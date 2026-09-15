// Local fallback data — used automatically whenever Supabase isn't configured
// yet (see src/lib/supabase.js), so the app is fully clickable in development.
// This is also exactly what supabase/schema.sql seeds into the real database,
// so behavior matches once Supabase is connected.

export const CATEGORIES = [
  { id: 'forno', label: 'Salgados de Forno' },
  { id: 'grandes', label: 'Salgados Fritos Grande' },
  { id: 'minis', label: 'Salgados de Festa' },
  { id: 'bebidas', label: 'Bebidas' },
]

export const DEMO_PRODUCTS = [
  { id: 'm-coxinha', cat: 'minis', name: 'Coxinha de Frango', description: 'Frango desfiado bem temperado.', long: 'Massa leve e recheio generoso de frango desfiado, bem temperado. Feita na hora, sempre quentinha.', price: 1, cost: 0.4, stock: 100, img: '/products/p-coxinha.jpeg', badge: 'MAIS VENDIDO', featured: true, active: true },
  { id: 'm-carne', cat: 'minis', name: 'Bolinho de Carne', description: 'Carne moída saborosa.', long: 'Bolinho crocante por fora com recheio de carne moída suculenta e temperada.', price: 1, cost: 0.4, stock: 100, img: '/products/p-carne.jpeg', active: true },
  { id: 'm-queijo', cat: 'minis', name: 'Bolinho de Queijo', description: 'Muito queijo e sabor.', long: 'Massa dourada com recheio cremoso de queijo que derrete na boca.', price: 1, cost: 0.4, stock: 100, img: '/products/p-queijo.jpeg', badge: 'QUERIDINHO', active: true },
  { id: 'm-risoles', cat: 'minis', name: 'Risoles', description: 'Presunto e queijo cremoso.', long: 'Risoles empanado e crocante com recheio cremoso de presunto e queijo.', price: 1, cost: 0.4, stock: 100, img: '/products/p-risoles.jpeg', active: true },
  { id: 'm-enrolado', cat: 'minis', name: 'Enroladinho de Salsicha', description: 'Salsicha envolvida na massa.', long: 'Salsicha suculenta envolvida em massa leve e frita na hora.', price: 1, cost: 0.4, stock: 100, img: '/products/p-enrolado.jpeg', active: true },
  { id: 'g-esfiha-carne', cat: 'forno', name: 'Esfiha de Carne', description: 'Recheio de carne moída bem temperada.', long: 'Esfiha assada no forno, recheio farto de carne moída bem temperada.', price: 6, cost: 2, stock: 40, img: '/products/forno-esfiha-carne.jpeg', active: true },
  { id: 'g-esfiha-frango', cat: 'forno', name: 'Esfiha de Frango c/ Requeijão', description: 'Frango desfiado com requeijão cremoso.', long: 'Esfiha assada no forno, recheio de frango desfiado com requeijão cremoso.', price: 6, cost: 2, stock: 40, img: '/products/forno-esfiha-frango.jpeg', active: true },
  { id: 'g-esfiha-calabresa', cat: 'forno', name: 'Esfiha de Calabresa c/ Requeijão', description: 'Calabresa moída com requeijão cremoso.', long: 'Esfiha assada no forno, recheio de calabresa moída com requeijão cremoso.', price: 6, cost: 2, stock: 40, img: '/products/forno-esfiha-calabresa.jpeg', active: true },
  { id: 'g-bauru', cat: 'forno', name: 'Baurú', description: 'Pão fofinho recheado, assado no forno.', long: 'Baurú assado no forno, pão fofinho e recheio generoso.', price: 6, cost: 2, stock: 40, img: '/products/forno-bauru.jpeg', active: true },
  { id: 'g-hamburgao', cat: 'forno', name: 'Hambúrgão c/ Cheddar', description: 'Pão recheado com cheddar derretido.', long: 'Hambúrgão assado no forno, recheado com cheddar derretido.', price: 6, cost: 2, stock: 40, img: '/products/forno-hamburgao-cheddar.jpeg', active: true },
  { id: 'g-doguinho', cat: 'forno', name: 'Doguinho c/ Requeijão', description: 'Pãozinho macio com salsicha e requeijão.', long: 'Doguinho assado no forno, pãozinho macio com salsicha e requeijão cremoso.', price: 6, cost: 2, stock: 40, img: '/products/forno-doguinho.jpeg', active: true },
  { id: 'beb-coca-lata', cat: 'bebidas', name: 'Coca-Cola Lata 350ml', description: 'Bem geladinha.', long: 'Coca-Cola gelada, lata de 350ml.', price: 6, cost: 3, stock: 48, img: '/products/beb-coca-lata.jpg', active: true },
  { id: 'beb-guarana-lata', cat: 'bebidas', name: 'Guaraná Antarctica Lata 350ml', description: 'Bem geladinha.', long: 'Guaraná Antarctica gelado, lata de 350ml.', price: 6, cost: 3, stock: 48, img: '/products/beb-guarana-lata.jpg', active: true },
  { id: 'beb-sukita-lata', cat: 'bebidas', name: 'Sukita Laranja Lata 350ml', description: 'Bem geladinha.', long: 'Sukita sabor laranja, lata de 350ml.', price: 6, cost: 3, stock: 48, img: '/products/beb-sukita-lata.jpg', active: true },
  { id: 'beb-sprite-lata', cat: 'bebidas', name: 'Sprite Lata 350ml', description: 'Bem geladinha.', long: 'Sprite gelado, lata de 350ml.', price: 6, cost: 3, stock: 48, img: '/products/beb-sprite-lata.jpg', active: true },
  { id: 'beb-coca-1l', cat: 'bebidas', name: 'Coca-Cola 1 Litro', description: 'Garrafa de 1 litro.', long: 'Coca-Cola, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, img: '/products/beb-coca-1l.jpg', active: true },
  { id: 'beb-guarana-1l', cat: 'bebidas', name: 'Guaraná Antarctica 1 Litro', description: 'Garrafa de 1 litro.', long: 'Guaraná Antarctica, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, img: '/products/beb-guarana-1l.jpg', active: true },
  { id: 'beb-sukita-1l', cat: 'bebidas', name: 'Sukita Laranja 1 Litro', description: 'Garrafa de 1 litro.', long: 'Sukita sabor laranja, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, img: '/products/beb-sukita-1l.jpg', active: true },
  { id: 'beb-soda-1l', cat: 'bebidas', name: 'Sprite 1 Litro', description: 'Garrafa de 1 litro.', long: 'Sprite, garrafa de 1 litro.', price: 8, cost: 4, stock: 24, img: '/products/beb-sprite-1l.jpg', active: true },
]

const FRITOS = ['m-coxinha', 'm-carne', 'm-queijo', 'm-risoles', 'm-enrolado']
const FORNO = ['g-esfiha-carne', 'g-esfiha-frango', 'g-esfiha-calabresa', 'g-bauru', 'g-hamburgao', 'g-doguinho']
const REFRI_1L = ['beb-coca-1l', 'beb-guarana-1l', 'beb-sukita-1l', 'beb-soda-1l']
const REFRI_LATA = ['beb-coca-lata', 'beb-guarana-lata', 'beb-sukita-lata', 'beb-sprite-lata']

export const DEMO_COMBOS = [
  {
    id: 'combo-8',
    name: '8 Salgados + Refrigerante 1L',
    price: 39,
    img: '/products/combo-8-salgados.jpeg',
    description: 'Escolha 8 salgados fritos (coxinha, carne, queijo, risoles ou enrolado) + 1 refrigerante de 1 litro à sua escolha.',
    rules: [
      { key: 'fritos', label: 'Escolha 8 salgados fritos', count: 8, productIds: FRITOS },
      { key: 'bebida', label: 'Escolha 1 refrigerante de 1 litro', count: 1, productIds: REFRI_1L },
    ],
  },
  {
    id: 'combo-33',
    name: 'Combo 3+3 + Refri 1L',
    price: 35,
    img: '/products/combo-3-mais-3.jpeg',
    description: '3 salgados fritos + 3 salgados de forno (esfihas) + 1 refrigerante de 1 litro.',
    rules: [
      { key: 'fritos', label: 'Escolha 3 salgados fritos', count: 3, productIds: FRITOS },
      { key: 'forno', label: 'Escolha 3 salgados de forno', count: 3, productIds: FORNO },
      { key: 'bebida', label: 'Escolha 1 refrigerante de 1 litro', count: 1, productIds: REFRI_1L },
    ],
  },
  {
    id: 'combo-21',
    name: '2 Fritos + 1 Forno + Refri Lata',
    price: 20,
    img: '/products/combo-2-mais-1.jpeg',
    description: '2 salgados fritos + 1 salgado de forno + 1 refrigerante lata 350ml.',
    rules: [
      { key: 'fritos', label: 'Escolha 2 salgados fritos', count: 2, productIds: FRITOS },
      { key: 'forno', label: 'Escolha 1 salgado de forno', count: 1, productIds: FORNO },
      { key: 'bebida', label: 'Escolha 1 refrigerante lata', count: 1, productIds: REFRI_LATA },
    ],
  },
]

export const DEFAULT_LOGO = '/products/logo-piri.png'
export const DEFAULT_BANNER = '/products/hero-tray.png'

export const DEMO_SETTINGS = {
  id: 'store',
  open_time: '10:00',
  close_time: '22:00',
  days_open: [0, 2, 3, 4, 5, 6],
  force_closed: false,
  logo_url: '',
  banner_url: '',
  hero_slides: [],
}

export const WHATSAPP_NUMBER = '557499829662'
export const MIN_ORDER = 15
