import { WHATSAPP_NUMBER } from './demoData'

export function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function orderWhatsAppLink(order) {
  const lines = [
    'Olá! Acabei de fazer um pedido pelo cardápio digital:',
    '',
    ...order.items.map((it) => `• ${it.qty}x ${it.name}`),
    '',
    `Total: R$ ${Number(order.total).toFixed(2).replace('.', ',')}`,
  ]
  if (order.customerName) lines.push(`Nome: ${order.customerName}`)
  if (order.address) lines.push(`Endereço: ${order.address}`)
  lines.push(`Sachês de ketchup/maionese: ${order.sauceChoice === 'sim' ? 'Sim' : 'Não'}`)
  return waLink(lines.join('\n'))
}

export function comboWhatsAppLink(combo) {
  return waLink(`Olá! Quero pedir o combo: ${combo.name} (R$ ${Number(combo.price).toFixed(2).replace('.', ',')})`)
}
