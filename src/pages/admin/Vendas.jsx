import { useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { brl, monthKeyOf, todayISO } from '../../lib/format'
import { Card, Button } from '../../components/admin/ui'

const PAY_LABEL = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }
const FILTERS = [
  ['all', 'Todas'],
  ['pix', 'Pix'],
  ['cartao', 'Cartão'],
  ['dinheiro', 'Dinheiro'],
]

export default function Vendas() {
  const { orders, deleteOrder } = useOrders()
  const [month, setMonth] = useState(todayISO().slice(0, 7))
  const [payment, setPayment] = useState('all')

  const filtered = orders.filter((o) => o.status === 'finalizado' && monthKeyOf(o.date_iso) === month && (payment === 'all' || o.payment === payment))
  const sorted = [...filtered].sort((a, b) => (b.date_iso || '').localeCompare(a.date_iso || ''))
  const total = filtered.reduce((a, o) => a + (o.total || 0), 0)

  const deleteAll = () => {
    if (confirm('Excluir todas as vendas deste filtro?')) filtered.forEach((o) => deleteOrder(o.id))
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3.5">
        <h1 className="font-display text-[26px] m-0">Vendas</h1>
        <div className="flex gap-2 flex-wrap items-center">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border border-piri-dark/16 rounded-[10px] px-3 py-2 text-sm font-bold" />
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setPayment(id)}
              className="rounded-[10px] px-3 py-2 text-xs font-black"
              style={{ background: payment === id ? '#2B1210' : '#fff', color: payment === id ? '#fff' : '#2B1210', border: payment === id ? 'none' : '1px solid rgba(43,18,16,.16)' }}
            >
              {label}
            </button>
          ))}
          <Button variant="outline" onClick={deleteAll}>
            Excluir tudo
          </Button>
        </div>
      </div>
      <p className="mb-3.5 text-piri-brown font-black text-[13px]">
        {sorted.length} venda(s) · Total {brl(total)}
      </p>
      {sorted.length === 0 && <p className="text-piri-brown font-bold">Nenhuma venda neste filtro.</p>}
      <div className="flex flex-col gap-2.5">
        {sorted.map((o) => (
          <Card key={o.id}>
            <div className="flex items-center justify-between gap-2.5 flex-wrap">
              <div>
                <p className="m-0 font-black text-[13.5px]">
                  {o.date_iso} · {(o.items || []).length} item(s)
                </p>
                <p className="mt-0.5 text-xs text-piri-brown font-bold">{(o.items || []).map((it) => `${it.qty}x ${it.name}`).join(', ')}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="bg-piri-cream text-piri-dark text-[11px] font-black px-2.5 py-1 rounded-full">{PAY_LABEL[o.payment] || o.payment}</span>
                <span className="font-display text-lg text-piri-red">{brl(o.total)}</span>
                <button onClick={() => deleteOrder(o.id)} className="text-piri-red text-xs font-extrabold">
                  Excluir
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
