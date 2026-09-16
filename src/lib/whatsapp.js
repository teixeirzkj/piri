import { WHATSAPP_NUMBER } from './demoData'

export function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

const PAYMENT_LABEL = { pix: 'Pix', dinheiro: 'Dinheiro' }

export function orderWhatsAppLink(order) {
  const lines = [
    'Olá! Acabei de fazer um pedido pelo cardápio digital:',
    '',
    ...order.items.map((it) => `• ${it.qty}x ${it.name}`),
    '',
    `Total: R$ ${Number(order.total).toFixed(2).replace('.', ',')}`,
  ]
  if (order.customerName) lines.push(`Nome: ${order.customerName}`)
  if (order.phone) lines.push(`WhatsApp: ${order.phone}`)
  if (order.address) lines.push(`Endereço: ${order.address}`)
  if (order.payment) lines.push(`Pagamento: ${PAYMENT_LABEL[order.payment] || order.payment}`)
  if (order.payment === 'dinheiro') lines.push(order.changeFor ? `Troco para: R$ ${order.changeFor}` : 'Não precisa de troco')
  lines.push(`Sachês de ketchup/maionese: ${order.sauceChoice === 'sim' ? 'Sim' : 'Não'}`)
  return waLink(lines.join('\n'))
}

export function comboOrderWhatsAppLink(combo, chosenItems) {
  const lines = [`Olá! Quero pedir o combo: ${combo.name}`, `Total: R$ ${Number(combo.price).toFixed(2).replace('.', ',')}`]
  if (chosenItems.length > 0) {
    lines.push('', 'Minhas escolhas:', ...chosenItems.map((it) => `• ${it.qty}x ${it.name}`))
  }
  return waLink(lines.join('\n'))
}
