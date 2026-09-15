import { motion, AnimatePresence } from 'framer-motion'

export default function CartFab({ count, onOpen }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onOpen}
      aria-label="Abrir carrinho"
      className="fixed top-4 right-4 z-50 flex-none w-11 h-11 rounded-full bg-piri-red text-white flex items-center justify-center shadow-xl"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-piri-gold text-piri-dark text-[11px] font-black flex items-center justify-center shadow-[0_0_0_2px_white]"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
