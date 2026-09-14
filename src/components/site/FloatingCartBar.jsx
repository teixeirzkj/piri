import { motion, AnimatePresence } from 'framer-motion'
import { brl } from '../../lib/format'

export default function FloatingCartBar({ show, count, total, onOpen }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          onClick={onOpen}
          className="fixed left-4 right-4 bottom-4 z-[35] bg-piri-red text-white rounded-full px-5 py-3.5 min-h-14 flex items-center justify-between font-black text-[15px] shadow-2xl max-w-[608px] mx-auto md:hidden"
        >
          <span className="flex items-center gap-2.5">
            <span className="bg-piri-gold text-piri-dark rounded-full min-w-6.5 h-6.5 flex items-center justify-center text-[13px]">{count}</span>
            Ver carrinho
          </span>
          <span className="font-display text-lg">{brl(total)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
