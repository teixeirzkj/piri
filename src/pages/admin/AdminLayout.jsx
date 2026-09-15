import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/cardapio', label: 'Cardápio' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/nova-venda', label: 'Nova venda' },
  { to: '/admin/vendas', label: 'Vendas' },
  { to: '/admin/relatorio', label: 'Relatório' },
]

function SidebarContent({ user, onLogout, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-2.5 pb-4.5 border-b border-piri-cream/10 mb-3.5 px-1.5">
        <img src="/products/logo-piri.png" alt="" className="w-8.5 h-8.5 rounded-[10px] flex-none" />
        <div>
          <p className="font-display m-0 text-[15px] leading-none">Piri Coxinha</p>
          <p className="mt-0.5 text-[9.5px] font-extrabold tracking-wide text-piri-gold">PAINEL DO DONO</p>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-[10px] font-extrabold text-[13.5px] transition-colors ${
                isActive ? 'bg-piri-red text-white' : 'text-piri-cream hover:bg-white/5'
              }`
            }
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-col gap-1.5 pt-3.5 border-t border-piri-cream/10">
        <NavLink
          to="/admin/config"
          onClick={onNavigate}
          className={({ isActive }) =>
            `text-center rounded-[10px] px-2 py-2 text-xs font-extrabold ${isActive ? 'bg-piri-red text-white' : 'bg-white/10 text-piri-cream'}`
          }
        >
          ⚙️ Configurações
        </NavLink>
        <div className="mt-2 text-[11px] text-piri-cream/55 break-all">
          {user?.email}
          <br />
          <span className="text-piri-cream/35">ADMINISTRADOR</span>
        </div>
        <button onClick={onLogout} className="mt-1 rounded-[10px] border border-piri-cream/25 text-piri-cream text-xs font-extrabold py-1.5">
          Sair
        </button>
      </div>
    </>
  )
}

const NAV_TITLES = { '/admin': 'Painel', '/admin/cardapio': 'Cardápio', '/admin/pedidos': 'Pedidos', '/admin/nova-venda': 'Nova venda', '/admin/vendas': 'Vendas', '/admin/relatorio': 'Relatório', '/admin/config': 'Configurações' }

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1c0a08] text-piri-cream flex-none">
        <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="w-9 h-9 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className="font-display m-0 text-[15px]">{NAV_TITLES[location.pathname] || 'Painel do Dono'}</p>
        <img src="/products/logo-piri.png" alt="" className="w-8 h-8 rounded-lg" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] flex-none bg-[#1c0a08] text-piri-cream flex-col p-3.5">
        <SidebarContent user={user} onLogout={logout} />
      </aside>

      {/* Mobile off-canvas drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[240px] max-w-[80vw] bg-[#1c0a08] text-piri-cream flex flex-col p-3.5"
            >
              <SidebarContent user={user} onLogout={logout} onNavigate={() => setMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 w-full max-w-[1100px] p-4 md:p-6.5 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
