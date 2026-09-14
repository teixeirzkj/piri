import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useOrders } from '../../hooks/useOrders'
import { useSettings } from '../../hooks/useSettings'
import { brl, monthKeyOf, todayISO } from '../../lib/format'
import { Card, Button } from '../../components/admin/ui'

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_NAMES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

export default function Painel() {
  const { orders } = useOrders()
  const { settings, updateSettings } = useSettings()
  const [month, setMonth] = useState(todayISO().slice(0, 7))

  const finalized = useMemo(() => orders.filter((o) => o.status === 'finalizado' && monthKeyOf(o.date_iso) === month), [orders, month])

  const revenue = finalized.reduce((a, o) => a + (o.total || 0), 0)
  const cost = finalized.reduce((a, o) => a + (o.cost || 0), 0)
  const profit = revenue - cost
  const itemsSold = finalized.reduce((a, o) => a + (o.items || []).reduce((b, it) => b + it.qty, 0), 0)

  const [y, m] = month.split('-').map(Number)
  const daysInMonth = new Date(y, m, 0).getDate()
  const dailyTotals = Array.from({ length: daysInMonth }, (_, i) => {
    const day = `${month}-${String(i + 1).padStart(2, '0')}`
    return finalized.filter((o) => o.date_iso === day).reduce((a, o) => a + (o.total || 0), 0)
  })
  const maxDaily = Math.max(1, ...dailyTotals)

  const topMap = {}
  finalized.forEach((o) => (o.items || []).forEach((it) => {
    topMap[it.name] = topMap[it.name] || { qty: 0, total: 0 }
    topMap[it.name].qty += it.qty
    topMap[it.name].total += it.qty * it.price
  }))
  const top = Object.entries(topMap).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5)

  const daysOpen = settings?.days_open || []
  const toggleDay = (i) => {
    const next = daysOpen.includes(i) ? daysOpen.filter((x) => x !== i) : [...daysOpen, i]
    updateSettings({ days_open: next })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <h1 className="font-display text-[26px] m-0">Painel</h1>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border border-piri-dark/16 rounded-[10px] px-3 py-2 text-sm font-bold" />
      </div>

      <Card className="mb-4">
        <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-2.5">⏰ Horário de funcionamento</p>
        <div className="flex gap-4 flex-wrap items-end mb-3">
          <div>
            <p className="text-[11px] font-black text-piri-brown uppercase mb-1">Abre às</p>
            <input type="time" value={settings?.open_time || ''} onChange={(e) => updateSettings({ open_time: e.target.value })} className="border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold" />
          </div>
          <div>
            <p className="text-[11px] font-black text-piri-brown uppercase mb-1">Fecha às</p>
            <input type="time" value={settings?.close_time || ''} onChange={(e) => updateSettings({ close_time: e.target.value })} className="border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold" />
          </div>
          <Button
            variant={settings?.force_closed ? 'primary' : 'outline'}
            style={settings?.force_closed ? { background: '#1f8a3b' } : {}}
            onClick={() => updateSettings({ force_closed: !settings?.force_closed })}
          >
            {settings?.force_closed ? 'Reabrir loja' : 'Fechar loja agora'}
          </Button>
        </div>
        <p className="text-[11px] font-black text-piri-brown uppercase mb-1.5">Dias que a loja abre</p>
        <div className="flex gap-1.5 flex-wrap">
          {DAY_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => toggleDay(i)}
              className="rounded-[10px] px-3 py-1.5 text-xs font-black"
              style={{ background: daysOpen.includes(i) ? '#C1121F' : '#F7EFE2', color: daysOpen.includes(i) ? '#fff' : '#2B1210' }}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          ['Faturamento', brl(revenue), '#C1121F'],
          ['Lucro', brl(profit), '#1f8a3b'],
          ['Itens vendidos', itemsSold, '#C1121F'],
          ['Vendas', finalized.length, '#C1121F'],
        ].map(([label, value, color]) => (
          <Card key={label}>
            <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-1">{label}</p>
            <p className="font-display text-2xl m-0" style={{ color }}>
              {value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="mb-4">
        <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-3">
          Vendas por dia — {MONTH_NAMES[m - 1]} de {y}
        </p>
        <div className="flex items-end gap-0.5 h-28">
          {dailyTotals.map((v, i) => (
            <motion.div
              key={i}
              title={`dia ${i + 1}: ${brl(v)}`}
              initial={{ height: 0 }}
              animate={{ height: v > 0 ? `${Math.max(4, (v / maxDaily) * 100)}%` : 2 }}
              className="flex-1 rounded-t min-w-[2px]"
              style={{ background: v > 0 ? '#C1121F' : 'rgba(43,18,16,.1)' }}
            />
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-2.5">Mais vendidos no mês</p>
        {top.length === 0 && <p className="text-piri-brown font-bold text-[13px] m-0">Nenhuma venda registrada neste mês.</p>}
        <div className="flex flex-col gap-2.5">
          {top.map(([name, v]) => (
            <div key={name} className="flex items-center justify-between gap-2.5">
              <span className="font-extrabold text-[13.5px]">{name}</span>
              <span className="font-black text-[13.5px] text-piri-brown">
                {v.qty}x · {brl(v.total)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
