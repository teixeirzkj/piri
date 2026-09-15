import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { brl, badgeStyle } from '../../lib/format'
import DrinkIcon from './DrinkIcon'

export default function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (product) setQty(1)
  }, [product])

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[62] bg-piri-dark/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            role="dialog"
            aria-label={product.name}
            className="fixed z-[63] bg-white overflow-y-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,520px)] max-h-[90vh] rounded-[28px] shadow-2xl"
          >
            <div className="relative w-full aspect-square flex-none bg-[#F4E4C8] flex items-center justify-center">
              {product.icon ? (
                <DrinkIcon kind={product.iconKind} color={product.iconColor} size={110} />
              ) : (
                <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
              )}
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 text-piri-dark font-black text-lg shadow-lg"
              >
                ✕
              </button>
              {product.badge &&
                (() => {
                  const [bg, color] = badgeStyle(product.badge)
                  return (
                    <span
                      className="absolute bottom-3 left-4 text-[11px] font-black tracking-wide px-3 py-1.5 rounded-full"
                      style={{ background: bg, color }}
                    >
                      {product.badge}
                    </span>
                  )
                })()}
            </div>
            <div className="p-5 flex flex-col gap-2.5">
              <h2 className="font-display text-[28px] text-piri-dark leading-tight m-0">{product.name}</h2>
              <p className="m-0 text-piri-brown font-semibold text-[15px] leading-relaxed">{product.long || product.description}</p>
              <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
                <span className="font-display text-3xl text-piri-red">{brl(product.price)}</span>
                <div className="flex items-center gap-1.5 bg-piri-cream rounded-full p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Diminuir"
                    className="w-11 h-11 rounded-full bg-white text-piri-red font-black text-xl shadow-sm"
                  >
                    −
                  </button>
                  <motion.span key={qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="min-w-8 text-center font-black text-xl">
                    {qty}
                  </motion.span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Aumentar"
                    className="w-11 h-11 rounded-full bg-piri-red text-white font-black text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onAdd(product.id, qty)
                  onClose()
                }}
                className="w-full mt-1.5 bg-piri-red text-white rounded-full py-4 font-black text-base flex justify-between items-center px-5 shadow-lg"
              >
                <span>Adicionar ao carrinho</span>
                <span className="font-display text-xl">{brl(product.price * qty)}</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
