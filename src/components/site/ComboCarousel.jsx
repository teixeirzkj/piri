import { motion } from 'framer-motion'
import { brl } from '../../lib/format'

export default function ComboCarousel({ combos, onSelect }) {
  if (combos.length === 0) return null
  return (
    <section className="mb-6">
      <h2 className="font-display text-xl mb-3 text-piri-dark">🎉 Combos imperdíveis</h2>
      <div className="flex gap-3 overflow-x-auto pb-1.5 -mx-4 px-4" style={{ scrollSnapType: 'x proximity' }}>
        {combos.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(c)}
            className="relative flex-none w-[210px] h-[150px] rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(120,60,20,.18)] text-left"
            style={{ scrollSnapAlign: 'start' }}
          >
            <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-piri-dark/90 via-piri-dark/5 to-transparent" />
            <span className="font-display absolute top-2.5 right-2.5 text-base text-piri-dark bg-piri-gold px-2.5 py-1 rounded-full shadow-md">
              {brl(c.price)}
            </span>
            <p className="absolute left-3 right-3 bottom-2 m-0 text-white font-black text-[12.5px] leading-tight line-clamp-2">{c.name}</p>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
