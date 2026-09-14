import { motion } from 'framer-motion'

export default function PromoBanner({ onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="block w-full rounded-3xl overflow-hidden mb-5.5 shadow-[0_10px_26px_rgba(120,60,20,.16)] relative text-left"
    >
      <img src="/products/pasteis.png" alt="Pastelzinhos crocantes" className="w-full h-[170px] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-piri-dark/80 via-piri-dark/20 to-transparent" />
      <span className="absolute top-3.5 left-4 bg-piri-gold text-piri-dark text-[11px] font-black tracking-wide px-2.5 py-1.5 rounded-full">
        NOVIDADE
      </span>
      <div className="absolute left-4 right-4 bottom-3.5 flex items-end justify-between gap-3">
        <p className="font-display m-0 text-white text-[clamp(19px,4.4vw,25px)] leading-tight" style={{ textShadow: '0 3px 8px rgba(0,0,0,.45)' }}>
          Pastelzinhos crocantes
          <br />a partir de R$ 1,00
        </p>
        <span className="flex-none bg-piri-red text-white font-black text-[13px] px-4 py-2.5 rounded-full whitespace-nowrap shadow-lg">
          Peça agora
        </span>
      </div>
    </motion.button>
  )
}
