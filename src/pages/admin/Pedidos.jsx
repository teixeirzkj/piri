import { motion } from 'framer-motion'
import { useOrders } from '../../hooks/useOrders'
import { brl } from '../../lib/format'
import { Card } from '../../components/admin/ui'

const PAY_LABEL = { pix: 'Pix', cartao: 'Cartão', dinheiro: 'Dinheiro' }

const STAGES = [
  ['pendente', 'Pendente', '#C1121F', '#FBEAEA'],
  ['preparo', 'Em preparo', '#8a6a10', '#FFF7E0'],
  ['entrega', 'Saiu para entrega', '#1f8a3b', '#F1F8F1'],
  ['finalizado', 'Finalizado', '#3A1410', '#F7EFE2'],
]
const NEXT = { pendente: 'preparo', preparo: 'entrega', entrega: 'finalizado', finalizado: null }
const NEXT_LABEL = { pendente: 'Em preparo', preparo: 'Saiu p/ entrega', entrega: 'Finalizar' }

export default function Pedidos() {
  const { orders, updateOrder, deleteOrder } = useOrders()

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-[26px] m-0">Pedidos</h1>
        <p className="mt-1 text-piri-brown font-bold text-[13px]">Pedidos feitos pelo cardápio (e os que você lançar aqui), organizados por etapa</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {STAGES.map(([id, label, color, bg]) => {
          const colOrders = orders.filter((o) => (o.status || 'pendente') === id)
          return (
            <div key={id}>
              <p className="mb-2.5 font-black text-xs px-2.5 py-2 rounded-[10px]" style={{ color, background: bg }}>
                {label} ({colOrders.length})
              </p>
              <div className="flex flex-col gap-2">
                {colOrders.map((o) => (
                  <motion.div layout key={o.id}>
                    <Card className="py-2.5 px-3">
                      <p className="m-0 font-black text-[13px]">{o.customer_name || 'Cliente'}</p>
                      {o.phone && <p className="m-0 text-[11px] text-piri-brown font-bold">{o.phone}</p>}
                      {o.address && <p className="mt-1 text-[11px] text-piri-dark font-bold">📍 {o.address}</p>}
                      <p className="mt-1 text-[11.5px] text-piri-brown font-bold">{(o.items || []).map((it) => `${it.qty}x ${it.name}`).join(', ')}</p>
                      <p className="font-display mt-1 text-[15px] text-piri-red">{brl(o.total)}</p>
                      {o.payment && (
                        <p className="mt-0.5 text-[11px] font-extrabold text-piri-brown">
                          {PAY_LABEL[o.payment] || o.payment}
                          {o.payment === 'dinheiro' && (o.change_for ? ` · troco p/ R$ ${o.change_for}` : ' · sem troco')}
                        </p>
                      )}
                      <div className="flex gap-1.5 mt-2">
                        {NEXT[id] && (
                          <button onClick={() => updateOrder(o.id, { status: NEXT[id] })} className="bg-piri-cream rounded-[8px] text-[11px] font-extrabold px-2.5 py-1.5">
                            {NEXT_LABEL[id]} ›
                          </button>
                        )}
                        <button onClick={() => deleteOrder(o.id)} className="text-piri-red text-[11px] font-extrabold px-1.5">
                          Excluir
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {colOrders.length === 0 && <p className="text-[#b3958c] text-xs font-bold p-1">Nenhum pedido aqui.</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
