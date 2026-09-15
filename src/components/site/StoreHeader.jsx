import { AnimatePresence, motion } from 'framer-motion'
import { DEFAULT_LOGO, DEFAULT_BANNER } from '../../lib/demoData'
import HeroCarousel from './HeroCarousel'

export default function StoreHeader({ status, hoursLabel, searchOpen, onToggleSearch, query, onQueryChange, logoUrl, bannerUrl, heroSlides }) {
  return (
    <>
      <div className="relative h-[clamp(150px,26vw,230px)] overflow-hidden bg-piri-dark">
        {heroSlides && heroSlides.length > 0 ? (
          <HeroCarousel slides={heroSlides} />
        ) : (
          <img src={bannerUrl || DEFAULT_BANNER} alt="" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-piri-dark/10 to-piri-dark/80 pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[640px] mx-auto -mt-7 px-4 relative z-10 w-full"
      >
        <div className="bg-white rounded-3xl shadow-[0_12px_32px_rgba(120,60,20,.16)] px-4.5 pt-3.5 pb-1.5">
          <div className="flex items-start gap-3">
            <img src={logoUrl || DEFAULT_LOGO} alt="Piri Coxinha" className="w-11 h-11 rounded-2xl object-cover flex-none shadow-[0_0_0_2px_#FFC72C]" />
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-none" style={{ background: status.color }} />
                <span className="text-xs font-black" style={{ color: status.color }}>
                  {status.label}
                </span>
              </div>
              <p className="mt-0.5 text-piri-brown font-bold text-xs leading-snug">{hoursLabel}</p>
            </div>
            <button
              onClick={onToggleSearch}
              aria-label="Buscar no cardápio"
              className="flex-none w-9.5 h-9.5 rounded-full border border-piri-dark/10 flex items-center justify-center transition-colors"
              style={{ background: searchOpen ? '#FBF3E4' : 'transparent' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          <div className="mt-2">
            <h1 className="font-display text-[22px] text-piri-dark leading-none">Piri Coxinha</h1>
            <p className="mt-1 text-piri-brown font-bold text-[12px]">Miguel Calmon, BA · Salgaderia</p>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Buscar coxinha, bolinho, risoles..."
                  className="mt-3 w-full h-11 rounded-2xl border border-piri-dark/15 bg-piri-cream px-3.5 text-sm font-bold text-piri-dark"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-3 pt-2.5 border-t border-piri-dark/10 text-center">
            <span className="text-[10px] font-extrabold tracking-wide text-piri-brown">PEDIDO MÍNIMO</span>
            <span className="font-display text-[15px] text-piri-red ml-1.5">R$ 15,00</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-2.5 mb-2.5">
            <div className="flex items-center gap-2 bg-[#F1F8F1] border border-[#CFE8CF] rounded-2xl px-3 py-2.5">
              <span className="w-7 h-7 rounded-full bg-piri-green text-white flex items-center justify-center flex-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17h11V5H3z" />
                  <path d="M14 10h4l3 3v4h-7z" />
                  <circle cx="7.5" cy="18.5" r="1.5" />
                  <circle cx="17.5" cy="18.5" r="1.5" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-black text-[12.5px] text-piri-green leading-tight">Frete grátis</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#5c8a63]">Na região</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#FFF7E0] border border-[#F7E2A0] rounded-2xl px-3 py-2.5">
              <span className="w-7 h-7 rounded-full bg-piri-gold text-piri-dark flex items-center justify-center flex-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3.5 2" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-black text-[12.5px] text-[#8a6a10] leading-tight">Feito na hora</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#a68a3f] leading-tight">Preparo em 20 a 45 min</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
