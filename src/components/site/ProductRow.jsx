import { motion } from 'framer-motion'
import { brl, badgeStyle } from '../../lib/format'
import DrinkIcon from './DrinkIcon'

export default function ProductRow({ product, qty = 0, onOpen, onAdd, onDec }) {
  const [badgeBg, badgeColor] = badgeStyle(product.badge)
  const stop = (fn) => (e) => {
    e.stopPropagation()
    fn()
  }

  return (
    <motion.div
      layout
      onClick={() => onOpen(product)}
      className="flex gap-3.5 items-center py-3.5 border-b border-piri-dark/8 last:border-b-0 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <p className="m-0 text-[15px] font-black text-piri-dark leading-tight">
          {product.name}
          {product.badge && (
            <span
              className="ml-1.5 text-[9.5px] font-black tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: badgeBg, color: badgeColor }}
            >
              {product.badge}
            </span>
          )}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-piri-brown leading-snug">{product.description}</p>
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <span className="font-display text-[17px] text-piri-red">{brl(product.price)}</span>
          {qty > 0 ? (
            <div className="flex items-center gap-1 bg-piri-cream rounded-full p-0.5 flex-none">
              <button onClick={stop(onDec)} aria-label="Diminuir" className="w-8 h-8 rounded-full bg-white text-piri-red font-black text-base">
                −
              </button>
              <motion.span key={qty} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="min-w-5 text-center font-black text-sm">
                {qty}
              </motion.span>
              <button onClick={stop(onAdd)} aria-label="Aumentar" className="w-8 h-8 rounded-full bg-piri-red text-white font-black text-base">
                +
              </button>
            </div>
          ) : (
            <button
              onClick={stop(onAdd)}
              aria-label="Adicionar"
              className="w-9 h-9 rounded-full bg-piri-gold text-piri-dark font-black text-xl flex-none flex items-center justify-center"
            >
              +
            </button>
          )}
        </div>
      </div>
      <div className="relative flex-none w-21 h-21 rounded-2xl overflow-hidden bg-[#F4E4C8] flex items-center justify-center">
        {product.icon ? (
          <DrinkIcon kind={product.iconKind} color={product.iconColor} size={42} />
        ) : (
          <img src={product.img} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        )}
      </div>
    </motion.div>
  )
}
