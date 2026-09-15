import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCombos } from '../../hooks/useCombos'
import { useProducts } from '../../hooks/useProducts'
import { brl, CAT_LABELS } from '../../lib/format'
import { Card, Label, Field, Button } from '../../components/admin/ui'

function resizeImage(file, cb) {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxW = 500
      const scale = Math.min(1, maxW / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      cb(canvas.toDataURL('image/jpeg', 0.78))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

const emptyForm = () => ({ id: null, name: '', description: '', price: '20', img: '', rules: [] })
const emptyGroup = () => ({ key: `grupo-${Date.now().toString(36)}`, label: '', count: 1, productIds: [] })

export default function CombosAdmin() {
  const { combos, addCombo, updateCombo, deleteCombo } = useCombos()
  const { products } = useProducts()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())

  const activeProducts = products.filter((p) => p.active !== false)
  const byCategory = Object.keys(CAT_LABELS).map((cat) => ({ cat, label: CAT_LABELS[cat], items: activeProducts.filter((p) => p.cat === cat) }))

  const openNew = () => {
    setForm(emptyForm())
    setModalOpen(true)
  }
  const openEdit = (c) => {
    setForm({ id: c.id, name: c.name, description: c.description || '', price: String(c.price), img: c.img || '', rules: (c.rules || []).map((g) => ({ ...g })) })
    setModalOpen(true)
  }

  const addGroup = () => setForm((f) => ({ ...f, rules: [...f.rules, emptyGroup()] }))
  const removeGroup = (idx) => setForm((f) => ({ ...f, rules: f.rules.filter((_, i) => i !== idx) }))
  const updateGroup = (idx, patch) => setForm((f) => ({ ...f, rules: f.rules.map((g, i) => (i === idx ? { ...g, ...patch } : g)) }))
  const toggleProduct = (idx, productId) =>
    setForm((f) => ({
      ...f,
      rules: f.rules.map((g, i) => {
        if (i !== idx) return g
        const has = g.productIds.includes(productId)
        return { ...g, productIds: has ? g.productIds.filter((id) => id !== productId) : [...g.productIds, productId] }
      }),
    }))

  const save = async () => {
    if (!form.name.trim()) return
    const data = {
      name: form.name.trim(),
      description: form.description,
      price: Number(form.price) || 0,
      img: form.img || '',
      rules: form.rules.map((g) => ({ ...g, label: g.label || `Escolha ${g.count}`, count: Number(g.count) || 1 })),
    }
    if (form.id) await updateCombo(form.id, data)
    else await addCombo({ id: `combo-${Date.now().toString(36)}`, ...data })
    setModalOpen(false)
  }

  const remove = async (c) => {
    if (confirm(`Excluir o combo "${c.name}"?`)) await deleteCombo(c.id)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <h1 className="font-display text-[26px] m-0">Combos</h1>
        <Button onClick={openNew}>+ Novo combo</Button>
      </div>

      {combos.length === 0 && <p className="text-piri-brown font-bold">Nenhum combo cadastrado ainda.</p>}

      <div className="flex flex-col gap-2.5">
        {combos.map((c) => (
          <Card key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 px-3.5">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F4E4C8] flex-none">{c.img && <img src={c.img} className="w-full h-full object-cover" />}</div>
              <div className="flex-1 min-w-0">
                <p className="m-0 font-black text-sm">{c.name}</p>
                <p className="mt-0.5 text-[12.5px] text-piri-brown font-semibold line-clamp-2">{c.description}</p>
                <p className="mt-1 text-[11px] text-piri-brown font-bold">{(c.rules || []).length} grupo(s) de escolha</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-none">
              <p className="font-display m-0 text-[18px] text-piri-red">{brl(c.price)}</p>
              <Button variant="ghost" onClick={() => openEdit(c)}>
                Editar
              </Button>
              <Button variant="outline" onClick={() => remove(c)}>
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-[60] bg-black/50" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(94vw,560px)] max-h-[90vh] overflow-y-auto bg-white rounded-[22px] p-5.5 shadow-2xl"
            >
              <h2 className="font-display text-xl mb-3.5 m-0">{form.id ? 'Editar combo' : 'Novo combo'}</h2>

              <div className="flex flex-col gap-2.5">
                <div>
                  <Label>Foto do combo</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F4E4C8] flex-none flex items-center justify-center">
                      {form.img ? <img src={form.img} className="w-full h-full object-cover" /> : <span className="text-2xl">🎉</span>}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) resizeImage(file, (dataUrl) => setForm((f) => ({ ...f, img: dataUrl })))
                      }}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label>Nome do combo</Label>
                  <Field value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Descrição (aparece no card e na mensagem)</Label>
                  <Field value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div>
                  <Label>Preço do combo (R$)</Label>
                  <Field type="number" step="0.5" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-32" />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="m-0 font-black text-piri-dark">O que vai no combo</p>
                  <Button variant="ghost" onClick={addGroup}>
                    + Grupo de escolha
                  </Button>
                </div>
                <p className="text-[12px] text-piri-brown font-semibold mb-3">
                  Cada grupo é uma etapa que o cliente escolhe no cardápio (ex: "Escolha 8 salgados fritos"). Marque quais itens contam pra esse grupo.
                </p>

                <div className="flex flex-col gap-3.5">
                  {form.rules.map((g, idx) => (
                    <div key={g.key} className="border border-piri-dark/12 rounded-2xl p-3.5">
                      <div className="flex items-end gap-2 mb-2.5">
                        <div className="flex-1">
                          <Label>Texto do grupo</Label>
                          <Field value={g.label} onChange={(e) => updateGroup(idx, { label: e.target.value })} placeholder="Ex: Escolha 8 salgados fritos" />
                        </div>
                        <div className="w-20">
                          <Label>Qtd.</Label>
                          <Field type="number" min="1" value={g.count} onChange={(e) => updateGroup(idx, { count: e.target.value })} />
                        </div>
                        <Button variant="outline" onClick={() => removeGroup(idx)} className="flex-none">
                          Remover
                        </Button>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-wide text-piri-brown mb-1.5">Itens que contam pra esse grupo ({g.productIds.length} marcados)</p>
                      <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 bg-piri-cream rounded-xl p-2.5">
                        {byCategory
                          .filter((c) => c.items.length > 0)
                          .map((c) => (
                            <div key={c.cat}>
                              <p className="m-0 mb-1 text-[10.5px] font-black uppercase tracking-wide text-piri-brown">{c.label}</p>
                              <div className="flex flex-col gap-1">
                                {c.items.map((p) => (
                                  <label key={p.id} className="flex items-center gap-2 text-[13px] font-bold text-piri-dark bg-white rounded-lg px-2.5 py-1.5">
                                    <input type="checkbox" checked={g.productIds.includes(p.id)} onChange={() => toggleProduct(idx, p.id)} />
                                    {p.name}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                  {form.rules.length === 0 && (
                    <p className="text-piri-brown font-bold text-[13px]">
                      Nenhum grupo ainda — sem grupos, o combo vai direto pro WhatsApp sem montador (o cliente só vê o preço e a descrição).
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <Button variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={save}>
                  Salvar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
