import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Card, Label, Field, Button } from '../../components/admin/ui'

export default function Config() {
  const { demoMode } = useAuth()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!password) return
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else {
      setStatus({ ok: true, msg: 'Senha atualizada!' })
      setPassword('')
    }
  }

  return (
    <div>
      <h1 className="font-display text-[26px] m-0 mb-5">Configurações</h1>
      <Card className="max-w-[360px]">
        <Label>Nova senha de acesso</Label>
        {demoMode ? (
          <p className="text-piri-brown font-bold text-[13px]">Conecte o Supabase (veja .env.example) pra gerenciar a senha real de login.</p>
        ) : (
          <>
            <Field type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a nova senha" className="mb-2.5" />
            <Button onClick={save} disabled={!password || saving}>
              {saving ? 'Salvando...' : 'Salvar nova senha'}
            </Button>
            {status && <p className={`mt-2.5 font-extrabold text-[12.5px] ${status.ok ? 'text-piri-green' : 'text-piri-red'}`}>{status.msg}</p>}
          </>
        )}
      </Card>
    </div>
  )
}
