import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/cardapio', label: 'Cardápio' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/nova-venda', label: 'Nova venda' },
  { to: '/admin/vendas', label: 'Vendas' },
  { to: '/admin/relatorio', label: 'Relatório' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const logout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] flex-none bg-[#1c0a08] text-piri-cream flex flex-col p-3.5">
        <div className="flex items-center gap-2.5 pb-4.5 border-b border-piri-cream/10 mb-3.5 px-1.5">
          <img src="/products/logo-piri.png" alt="" className="w-8.5 h-8.5 rounded-[10px]" />
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
          <button onClick={logout} className="mt-1 rounded-[10px] border border-piri-cream/25 text-piri-cream text-xs font-extrabold py-1.5">
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 max-w-[1100px] p-6.5">
        <Outlet />
      </main>
    </div>
  )
}
