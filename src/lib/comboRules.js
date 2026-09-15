// Which real menu items count for each "slot" in a combo, and how many the
// customer must pick per slot. Ids match src/lib/demoData.js / the products
// table — a combo's rules stay valid whether the catalog comes from Supabase
// or the local demo data.

const FRITOS = ['m-coxinha', 'm-carne', 'm-queijo', 'm-risoles', 'm-enrolado']
const FORNO = ['g-esfiha-carne', 'g-esfiha-frango', 'g-esfiha-calabresa', 'g-bauru', 'g-hamburgao', 'g-doguinho']
const REFRI_1L = ['beb-coca-1l', 'beb-guarana-1l', 'beb-sukita-1l', 'beb-soda-1l']
const REFRI_LATA = ['beb-coca-lata', 'beb-guarana-lata', 'beb-sukita-lata', 'beb-sprite-lata']

export const COMBO_RULES = {
  'combo-8': [
    { key: 'fritos', label: 'Escolha 8 salgados fritos', count: 8, productIds: FRITOS },
    { key: 'bebida', label: 'Escolha 1 refrigerante de 1 litro', count: 1, productIds: REFRI_1L },
  ],
  'combo-33': [
    { key: 'fritos', label: 'Escolha 3 salgados fritos', count: 3, productIds: FRITOS },
    { key: 'forno', label: 'Escolha 3 salgados de forno', count: 3, productIds: FORNO },
    { key: 'bebida', label: 'Escolha 1 refrigerante de 1 litro', count: 1, productIds: REFRI_1L },
  ],
  'combo-21': [
    { key: 'fritos', label: 'Escolha 2 salgados fritos', count: 2, productIds: FRITOS },
    { key: 'forno', label: 'Escolha 1 salgado de forno', count: 1, productIds: FORNO },
    { key: 'bebida', label: 'Escolha 1 refrigerante lata', count: 1, productIds: REFRI_LATA },
  ],
}
