import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { brl } from '../../lib/format'
import { COMBO_RULES } from '../../lib/comboRules'
import { comboOrderWhatsAppLink } from '../../lib/whatsapp'

export default function ComboModal({ combo, products, onClose }) {
  const [selections, setSelections] = useState({})

  useEffect(() => {
    if (combo) setSelections({})
  }, [combo])

  if (!combo) return null
  const rules = COMBO_RULES[combo.id] || []

  const productById = (id) => products.find((p) => p.id === id)
  const groupTotal = (group) => group.productIds.reduce((a, id) => a + (selections[id] || 0), 0)
  const allComplete = rules.every((g) => groupTotal(g) === g.count)

  const inc = (group, id) => {
    if (groupTotal(group) >= group.count) return
    setSelections((s) => ({ ...s, [id]: (s[id] || 0) + 1 }))
  }
  const dec = (id) => {
    setSelections((s) => ({ ...s, [id]: Math.max(0, (s[id] || 0) - 1) }))
  }
  const selectSingle = (group, id) => {
    setSelections((s) => {
      const next = { ...s }
      group.productIds.forEach((pid) => delete next[pid])
      next[id] = 1
      return next
    })
  }

  const send = () => {
    const chosen = rules.flatMap((g) =>
      g.productIds
        .filter((id) => (selections[id] || 0) > 0)
        .map((id) => ({ groupLabel: g.label, name: productById(id).name, qty: selections[id] })),
    )
    window.open(comboOrderWhatsAppLink(combo, chosen), '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {combo && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[62] bg-piri-dark/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            role="dialog"
            aria-label={combo.name}
            className="fixed z-[63] bg-white overflow-y-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,520px)] max-h-[90vh] rounded-[28px] shadow-2xl"
          >
            <div className="relative h-[150px] flex-none bg-[#F4E4C8]">
              <img src={combo.img} alt={combo.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-piri-dark/85 via-piri-dark/10 to-transparent" />
              <button onClick={onClose} aria-label="Fechar" className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 text-piri-dark font-black text-lg shadow-lg">
                ✕
              </button>
              <p className="absolute left-4 right-16 bottom-3 m-0 text-white font-black text-lg leading-tight">{combo.name}</p>
              <span className="font-display absolute top-3 left-4 text-base text-piri-dark bg-piri-gold px-2.5 py-1 rounded-full shadow-md">{brl(combo.price)}</span>
            </div>

            <div className="p-5 flex flex-col gap-5">
              <p className="m-0 -mt-2 text-piri-brown font-semibold text-sm leading-relaxed">{combo.description}</p>

              {rules.map((group) => {
                const total = groupTotal(group)
                const done = total === group.count
                return (
                  <div key={group.key}>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="m-0 font-black text-piri-dark text-[15px]">{group.label}</p>
                      <span className="text-xs font-black px-2 py-1 rounded-full" style={{ background: done ? '#F1F8F1' : '#FBF3E4', color: done ? '#1f8a3b' : '#8a5a4a' }}>
                        {total}/{group.count}
                      </span>
                    </div>

                    {group.count === 1 ? (
                      <div className="flex flex-wrap gap-2">
                        {group.productIds.map((id) => {
                          const p = productById(id)
                          if (!p) return null
                          const active = (selections[id] || 0) > 0
                          return (
                            <button
                              key={id}
                              onClick={() => selectSingle(group, id)}
                              className="rounded-full px-3.5 py-2 text-[13px] font-extrabold border-2"
                              style={{ borderColor: active ? '#C1121F' : 'rgba(58,20,16,.14)', background: active ? '#FBEAEA' : '#fff', color: active ? '#C1121F' : '#3A1410' }}
                            >
                              {p.name}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {group.productIds.map((id) => {
                          const p = productById(id)
                          if (!p) return null
                          const qty = selections[id] || 0
                          const atLimit = total >= group.count
                          return (
                            <div key={id} className="flex items-center justify-between gap-2 bg-piri-cream rounded-2xl px-3.5 py-2.5">
                              <span className="font-extrabold text-[13.5px] text-piri-dark">{p.name}</span>
                              <div className="flex items-center gap-1.5 flex-none">
                                <button onClick={() => dec(id)} disabled={qty === 0} aria-label="Diminuir" className="w-8 h-8 rounded-full bg-white text-piri-red font-black text-base disabled:opacity-40">
                                  −
                                </button>
                                <span className="min-w-5 text-center font-black text-sm">{qty}</span>
                                <button
                                  onClick={() => inc(group, id)}
                                  disabled={atLimit}
                                  aria-label="Aumentar"
                                  className="w-8 h-8 rounded-full bg-piri-red text-white font-black text-base disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={send}
                disabled={!allComplete}
                className="w-full text-white rounded-full py-4 font-black text-base shadow-lg"
                style={{ background: allComplete ? '#C1121F' : '#C9A59A' }}
              >
                {allComplete ? 'Enviar pedido no WhatsApp' : 'Complete as escolhas acima'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
