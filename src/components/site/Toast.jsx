import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ message, bottomOffset = 24 }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -6, x: '-50%' }}
          className="fixed left-1/2 z-[70] bg-piri-dark text-white px-4.5 py-3 rounded-full font-extrabold text-sm shadow-2xl flex items-center gap-2.5 whitespace-nowrap max-w-[calc(100vw-32px)]"
          style={{ bottom: bottomOffset }}
        >
          <span className="w-5.5 h-5.5 rounded-full bg-piri-gold text-piri-dark inline-flex items-center justify-center text-xs">✓</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
