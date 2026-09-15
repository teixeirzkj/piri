import { DEFAULT_LOGO } from '../../lib/demoData'

export default function Footer({ logoUrl }) {
  return (
    <footer className="bg-piri-dark text-piri-cream pt-9 pb-6 px-4 mt-auto">
      <div className="max-w-[640px] mx-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src={logoUrl || DEFAULT_LOGO} alt="Piri Coxinha" className="w-11 h-11 rounded-2xl object-cover shadow-[0_0_0_2px_#FFC72C]" />
          <div>
            <p className="font-display m-0 text-[19px] leading-none">Piri Coxinha</p>
            <p className="mt-0.5 text-xs font-bold text-piri-cream/70">Pequenos no tamanho, gigantes no sabor!</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-[13px] font-bold text-piri-cream/85 leading-relaxed">
          <span>Rua 5, Nº 129 — Populares, Miguel Calmon, BA</span>
          <a href="https://wa.me/557499829662" target="_blank" rel="noopener" className="text-piri-gold">
            WhatsApp · (74) 9982-9662
          </a>
          <a href="https://instagram.com/piri.coxinha" target="_blank" rel="noopener" className="text-piri-gold">
            @piri.coxinha
          </a>
        </div>
        <p className="mt-2 pt-4 border-t border-piri-cream/15 text-[11.5px] text-piri-cream/50 font-semibold">
          © {new Date().getFullYear()} Piri Coxinha Salgaderia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
