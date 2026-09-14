import { useState } from 'react'
import { useOrders } from '../../hooks/useOrders'
import { brl, monthKeyOf, todayISO } from '../../lib/format'

export default function Relatorio() {
  const { orders } = useOrders()
  const [month, setMonth] = useState(todayISO().slice(0, 7))

  const monthOrders = orders.filter((o) => o.status === 'finalizado' && monthKeyOf(o.date_iso) === month)
  const map = {}
  monthOrders.forEach((o) =>
    (o.items || []).forEach((it) => {
      map[it.name] = map[it.name] || { qty: 0, revenue: 0 }
      map[it.name].qty += it.qty
      map[it.name].revenue += it.qty * it.price
    }),
  )
  const rows = Object.entries(map).map(([name, v]) => ({ name, ...v }))
  const totalQty = rows.reduce((a, r) => a + r.qty, 0)
  const totalRevenue = rows.reduce((a, r) => a + r.revenue, 0)
  const totalProfit = monthOrders.reduce((a, o) => a + (o.profit || 0), 0)
  const profitByName = {}
  monthOrders.forEach((o) => {
    const orderCost = o.cost || 0
    const orderRevenue = o.total || 0
    ;(o.items || []).forEach((it) => {
      const share = orderRevenue > 0 ? (it.qty * it.price) / orderRevenue : 0
      profitByName[it.name] = (profitByName[it.name] || 0) + share * (orderRevenue - orderCost)
    })
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <h1 className="font-display text-[26px] m-0">Relatório por item</h1>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border border-piri-dark/16 rounded-[10px] px-3 py-2 text-sm font-bold" />
      </div>
      <div className="bg-white rounded-2xl border border-piri-dark/8 overflow-hidden">
        <div className="grid grid-cols-4 px-4 py-3 text-[11px] font-black tracking-wide text-piri-brown border-b border-piri-dark/8">
          <span>ITEM</span>
          <span>QTD</span>
          <span>FATURAMENTO</span>
          <span>LUCRO</span>
        </div>
        {rows.length === 0 && <p className="p-4 text-piri-brown font-bold">Sem vendas neste mês.</p>}
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-4 px-4 py-3 text-[13.5px] font-extrabold border-b border-piri-dark/6">
            <span>{r.name}</span>
            <span>{r.qty}</span>
            <span>{brl(r.revenue)}</span>
            <span className="text-piri-green">{brl(profitByName[r.name] || 0)}</span>
          </div>
        ))}
        {rows.length > 0 && (
          <div className="grid grid-cols-4 px-4 py-3 text-[13.5px] font-black bg-piri-cream">
            <span>TOTAL</span>
            <span>{totalQty}</span>
            <span>{brl(totalRevenue)}</span>
            <span className="text-piri-green">{brl(totalProfit)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
