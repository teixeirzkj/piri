export const brl = (v) => 'R$ ' + (Number(v) || 0).toFixed(2).replace('.', ',')

export const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const monthKeyOf = (iso) => (iso || '').slice(0, 7)

export const CAT_LABELS = {
  forno: 'Salgados de Forno',
  grandes: 'Salgados Fritos Grande',
  minis: 'Salgados de Festa',
  bebidas: 'Bebidas',
}

export const badgeStyle = (b) =>
  b === 'MAIS VENDIDO'
    ? ['#C1121F', '#fff']
    : b === 'NOVO'
      ? ['#3A1410', '#FFC72C']
      : ['#FFC72C', '#3A1410']
