import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const { signIn, demoMode } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
    else navigate('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'radial-gradient(ellipse at top, #3A1410, #1c0a08)' }}>
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-[min(92vw,360px)] bg-white rounded-[22px] p-8 flex flex-col gap-3.5 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-1.5 mb-1.5">
          <img src="/products/logo-piri.png" alt="" className="w-14 h-14 rounded-2xl shadow-[0_0_0_2px_#FFC72C]" />
          <p className="font-display mt-1.5 text-[22px] text-piri-dark">Piri Coxinha</p>
          <p className="m-0 text-[11px] font-black tracking-wide text-piri-brown">PAINEL DO DONO</p>
        </div>

        {demoMode && (
          <p className="m-0 bg-[#FFF3C4] text-piri-dark rounded-xl px-3 py-2.5 text-xs font-bold leading-relaxed">
            Supabase ainda não conectado — qualquer e-mail e senha entram em modo demonstração local. Configure o .env pra ativar o login real.
          </p>
        )}

        <div>
          <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-1.5">E-mail</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-sm font-bold"
            placeholder="seuemail@exemplo.com"
          />
        </div>
        <div>
          <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-1.5">Senha</p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-sm font-bold"
            placeholder="Digite a senha"
          />
        </div>

        {error && <p className="m-0 text-piri-red font-extrabold text-[12.5px]">{error}</p>}

        <button disabled={loading} type="submit" className="bg-piri-red text-white rounded-[10px] py-3.5 font-black text-sm mt-1 disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </motion.form>
    </div>
  )
}
