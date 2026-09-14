import { motion } from 'framer-motion'
import { brl } from '../../lib/format'
import { comboWhatsAppLink } from '../../lib/whatsapp'

export default function ComboSection({ combos }) {
  if (combos.length === 0) return null
  return (
    <section id="combos" className="mt-8.5 scroll-mt-4">
      <h2 className="text-base font-black tracking-wide text-piri-dark uppercase">🎉 Combos imperdíveis</h2>
      <p className="mt-1 mb-3.5 text-[12.5px] font-bold text-piri-brown">Fechados com a gente — peça pelo WhatsApp</p>
      <div className="flex flex-col gap-3">
        {combos.map((c, i) => (
          <motion.a
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.98 }}
            href={comboWhatsAppLink(c)}
            target="_blank"
            rel="noopener"
            className="block rounded-3xl overflow-hidden bg-piri-dark shadow-[0_10px_26px_rgba(120,60,20,.18)]"
          >
            <div className="relative h-[150px]">
              <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-piri-dark/95 via-piri-dark/15 to-transparent" />
              <span className="font-display absolute top-3 right-3.5 text-2xl text-piri-gold" style={{ textShadow: '0 2px 6px rgba(0,0,0,.5)' }}>
                {brl(c.price)}
              </span>
              <p className="absolute left-3.5 right-3.5 bottom-2.5 m-0 text-white font-black text-[15px] leading-tight">{c.name}</p>
            </div>
            <div className="px-4 pt-3.5 pb-4">
              <p className="m-0 text-piri-cream/80 text-[13px] font-semibold leading-relaxed">{c.desc}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 bg-piri-gold text-piri-dark font-black text-[13px] px-4 py-2.5 rounded-full">
                Pedir no WhatsApp ›
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
