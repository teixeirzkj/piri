import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Cardapio from './pages/Cardapio'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Painel from './pages/admin/Painel'
import CardapioAdmin from './pages/admin/CardapioAdmin'
import Pedidos from './pages/admin/Pedidos'
import NovaVenda from './pages/admin/NovaVenda'
import Vendas from './pages/admin/Vendas'
import Relatorio from './pages/admin/Relatorio'
import Config from './pages/admin/Config'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Cardapio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Painel />} />
          <Route path="cardapio" element={<CardapioAdmin />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="nova-venda" element={<NovaVenda />} />
          <Route path="vendas" element={<Vendas />} />
          <Route path="relatorio" element={<Relatorio />} />
          <Route path="config" element={<Config />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
