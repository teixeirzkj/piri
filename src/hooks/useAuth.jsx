import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_SESSION_KEY = 'piri_demo_admin_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const saved = sessionStorage.getItem(DEMO_SESSION_KEY)
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      // Demo-only fallback so the admin screens can be previewed before
      // Supabase is connected. Once VITE_SUPABASE_URL/ANON_KEY are set,
      // this path disappears and real Supabase Auth takes over.
      if (!email || !password) return { error: 'Preencha e-mail e senha.' }
      const demoUser = { id: 'demo', email }
      sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      sessionStorage.removeItem(DEMO_SESSION_KEY)
      setUser(null)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, demoMode: !isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
