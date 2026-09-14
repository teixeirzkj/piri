import { motion } from 'framer-motion'
import { brl, badgeStyle } from '../../lib/format'

export default function FeaturedScroller({ products, onOpen }) {
  if (products.length === 0) return null
  return (
    <section className="mb-1.5">
      <h2 className="font-display text-xl mb-3.5 text-piri-dark">Mais pedidos</h2>
      <div className="flex gap-3 overflow-x-auto pb-1.5" style={{ scrollSnapType: 'x proximity' }}>
        {products.map((p, i) => {
          const [badgeBg, badgeColor] = badgeStyle(p.badge)
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpen(p)}
              className="flex-none w-[118px] text-left"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative w-[118px] h-[118px] rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(120,60,20,.14)]">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                {p.badge && (
                  <span
                    className="absolute top-2 left-2 text-[9.5px] font-black tracking-wide px-2 py-1 rounded-full"
                    style={{ background: badgeBg, color: badgeColor }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[12.5px] font-black text-piri-dark leading-snug line-clamp-2">{p.name}</p>
              <p className="mt-0.5 text-[11px] font-bold text-piri-brown">
                A partir de <span className="text-piri-red font-black">{brl(p.price)}</span>
              </p>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
