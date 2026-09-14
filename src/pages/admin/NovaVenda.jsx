import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { useOrders } from '../../hooks/useOrders'
import { brl, todayISO } from '../../lib/format'
import { Card, Label, Field, Button } from '../../components/admin/ui'

const PAYMENTS = [
  ['pix', 'Pix'],
  ['cartao', 'Cartão'],
  ['dinheiro', 'Dinheiro'],
]

export default function NovaVenda() {
  const { products } = useProducts()
  const { addOrder } = useOrders()
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})
  const [payment, setPayment] = useState('pix')
  const [date, setDate] = useState(todayISO())
  const [saving, setSaving] = useState(false)

  const productById = (id) => products.find((p) => p.id === id)
  const filtered = products.filter((p) => p.active !== false && (!query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase())))
  const entries = Object.entries(cart).filter(([id]) => productById(id))
  const total = entries.reduce((a, [id, q]) => a + q * productById(id).price, 0)

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c }
      delete next[id]
      return next
    })

  const registerSale = async () => {
    if (entries.length === 0) return
    setSaving(true)
    const items = entries.map(([id, qty]) => {
      const p = productById(id)
      return { id, name: p.name, price: p.price, qty }
    })
    const cost = items.reduce((a, it) => a + it.qty * (productById(it.id)?.cost || 0), 0)
    await addOrder({
      items,
      total,
      cost,
      profit: total - cost,
      payment,
      date_iso: date,
      status: 'finalizado',
      source: 'pdv',
      customer_name: 'Venda balcão',
    })
    setCart({})
    setSaving(false)
  }

  return (
    <div>
      <h1 className="font-display text-[26px] m-0 mb-5">Nova venda</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 items-start">
        <Card>
          <Label>1 · Adicione os itens</Label>
          <Field placeholder="Buscar salgado, bebida..." value={query} onChange={(e) => setQuery(e.target.value)} className="mb-2.5" />
          <div className="max-h-[420px] overflow-y-auto flex flex-col gap-1.5">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => add(p.id)} className="flex items-center justify-between px-2.5 py-2.5 rounded-[10px] bg-piri-cream text-left">
                <span>
                  <span className="block font-extrabold text-[13.5px]">{p.name}</span>
                </span>
                <span className="font-black text-piri-red">{brl(p.price)}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <Label>Resumo do pedido</Label>
          {entries.length === 0 && <p className="text-piri-brown font-bold text-[13px]">Nenhum item adicionado ainda.</p>}
          <div className="flex flex-col gap-2 mb-3.5">
            {entries.map(([id, qty]) => {
              const p = productById(id)
              return (
                <div key={id} className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-extrabold flex-1 min-w-0">
                    {qty}x {p.name}
                  </span>
                  <span className="font-black text-[13px]">{brl(p.price * qty)}</span>
                  <button onClick={() => remove(id)} className="text-piri-red font-black px-1">
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <Label>Forma de pagamento</Label>
          <div className="flex gap-1.5 mb-3.5">
            {PAYMENTS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setPayment(id)}
                className="flex-1 rounded-[10px] py-2.5 text-[12.5px] font-black"
                style={{ background: payment === id ? '#2B1210' : '#F7EFE2', color: payment === id ? '#fff' : '#2B1210' }}
              >
                {label}
              </button>
            ))}
          </div>
          <Label>Data</Label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold mb-3.5" />
          <div className="flex justify-between items-baseline mb-3 pt-2.5 border-t border-piri-dark/8">
            <span className="font-black">Total</span>
            <span className="font-display text-[22px] text-piri-red">{brl(total)}</span>
          </div>
          <Button className="w-full py-3.5 text-sm" onClick={registerSale} disabled={entries.length === 0 || saving}>
            {saving ? 'Registrando...' : 'Registrar venda'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
