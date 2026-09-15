import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'
import { resizeImage } from '../../lib/resizeImage'
import { DEFAULT_LOGO, DEFAULT_BANNER } from '../../lib/demoData'
import { Card, Label, Field, Button } from '../../components/admin/ui'

function ImagePicker({ label, hint, value, fallback, aspect, onChange, onReset }) {
  return (
    <div>
      <Label>{label}</Label>
      {hint && <p className="text-[12px] text-piri-brown font-semibold mb-2 -mt-1">{hint}</p>}
      <div className="flex items-center gap-3">
        <div className={`w-28 ${aspect} rounded-2xl overflow-hidden bg-[#F4E4C8] flex-none border border-piri-dark/10`}>
          <img src={value || fallback} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) resizeImage(file, onChange, { maxWidth: 700, quality: 0.78 })
            }}
            className="text-xs"
          />
          {value && (
            <button onClick={onReset} className="self-start text-piri-brown text-[11px] font-extrabold underline">
              Usar a foto padrão
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Config() {
  const { demoMode } = useAuth()
  const { settings, updateSettings } = useSettings()
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

      <Card className="max-w-[440px] mb-4 flex flex-col gap-5">
        <ImagePicker
          label="Foto de perfil (logo)"
          hint="Aparece no topo do cardápio, no rodapé e no ícone de carrinho vazio."
          value={settings?.logo_url}
          fallback={DEFAULT_LOGO}
          aspect="aspect-square"
          onChange={(dataUrl) => updateSettings({ logo_url: dataUrl })}
          onReset={() => updateSettings({ logo_url: '' })}
        />
        <ImagePicker
          label="Foto de fundo (banner)"
          hint="A imagem larga atrás do cartão da loja, no topo do cardápio."
          value={settings?.banner_url}
          fallback={DEFAULT_BANNER}
          aspect="aspect-video"
          onChange={(dataUrl) => updateSettings({ banner_url: dataUrl })}
          onReset={() => updateSettings({ banner_url: '' })}
        />
      </Card>

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
