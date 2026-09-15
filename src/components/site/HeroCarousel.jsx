import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function HeroCarousel({ slides }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [slides.length])

  useEffect(() => {
    if (i >= slides.length) setI(0)
  }, [slides.length, i])

  const s = slides[i]
  if (!s) return null

  return (
    <div className="relative w-full h-full overflow-hidden bg-piri-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={s.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {s.type === 'video' ? (
            <video src={s.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : (
            <img src={s.url} alt="" className="w-full h-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: idx === i ? '#fff' : 'rgba(255,255,255,.45)' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
