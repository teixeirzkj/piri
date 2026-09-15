import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../../hooks/useProducts'
import { brl, CAT_LABELS } from '../../lib/format'
import { resizeImage } from '../../lib/resizeImage'
import { Card, Label, Field, Button } from '../../components/admin/ui'
import DrinkIcon from '../../components/site/DrinkIcon'

const emptyForm = () => ({ id: null, name: '', cat: 'minis', description: '', price: '1', cost: '0', stock: '0', badge: '', active: true, img: '' })

export default function CardapioAdmin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())

  const filtered = products.filter((p) => !query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase()))

  const openNew = () => {
    setForm(emptyForm())
    setModalOpen(true)
  }
  const openEdit = (p) => {
    setForm({ id: p.id, name: p.name, cat: p.cat, description: p.description || '', price: String(p.price), cost: String(p.cost || 0), stock: String(p.stock ?? 0), badge: p.badge || '', active: p.active !== false, img: p.img || '' })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return
    const data = {
      name: form.name.trim(),
      cat: form.cat,
      description: form.description,
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      stock: Number(form.stock) || 0,
      badge: form.badge,
      active: form.active,
      img: form.img || '',
    }
    if (form.id) await updateProduct(form.id, data)
    else await addProduct({ id: `p-${Date.now().toString(36)}`, ...data })
    setModalOpen(false)
  }

  const remove = async (p) => {
    if (confirm(`Excluir "${p.name}"?`)) await deleteProduct(p.id)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <h1 className="font-display text-[26px] m-0">Cardápio</h1>
        <div className="flex gap-2 flex-wrap">
          <Field placeholder="Buscar item..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-52" />
          <Button onClick={openNew}>+ Novo item</Button>
        </div>
      </div>

      {filtered.length === 0 && <p className="text-piri-brown font-bold">Nenhum item encontrado.</p>}

      <div className="flex flex-col gap-2.5">
        {filtered.map((p) => (
          <Card key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3.5 py-3 px-3.5">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#F4E4C8] flex-none flex items-center justify-center">
                {p.icon ? <DrinkIcon kind={p.iconKind} color={p.iconColor} size={30} /> : p.img ? <img src={p.img} className="w-full h-full object-cover" /> : <span className="text-xl">🍽️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="m-0 font-black text-sm">{p.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="font-extrabold text-[10px] text-piri-red bg-[#FBEAEA] px-1.5 py-0.5 rounded-full">{CAT_LABELS[p.cat] || p.cat}</span>
                  {p.active === false && <span className="font-extrabold text-[10px] text-piri-brown bg-piri-cream px-1.5 py-0.5 rounded-full">INATIVO</span>}
                </div>
                <p className="mt-1 text-[12.5px] text-piri-brown font-semibold">{p.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start flex-none sm:text-right gap-1">
              <p className="font-display m-0 text-[17px] text-piri-red">{brl(p.price)}</p>
              <p className="text-[11px] text-piri-brown font-bold">
                custo {brl(p.cost)} · estoque {p.stock ?? 0}
              </p>
            </div>
            <div className="flex gap-1.5 flex-none">
              <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => openEdit(p)}>
                Editar
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => remove(p)}>
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
              className="fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(94vw,480px)] max-h-[88vh] overflow-y-auto bg-white rounded-[22px] p-5.5 shadow-2xl"
            >
              <h2 className="font-display text-xl mb-3.5 m-0">{form.id ? 'Editar item' : 'Novo item'}</h2>
              <div className="flex flex-col gap-2.5 mt-3.5">
                <div>
                  <Label>Foto do produto</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F4E4C8] flex-none flex items-center justify-center">
                      {form.img ? <img src={form.img} className="w-full h-full object-cover" /> : <span className="text-2xl">🍽️</span>}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) resizeImage(file, (dataUrl) => setForm((f) => ({ ...f, img: dataUrl })), { maxWidth: 320, quality: 0.75 })
                      }}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label>Nome</Label>
                  <Field value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <select value={form.cat} onChange={(e) => setForm((f) => ({ ...f, cat: e.target.value }))} className="w-full border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold">
                    {Object.entries(CAT_LABELS).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Field value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <Label>Preço (R$)</Label>
                    <Field type="number" step="0.5" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Custo (R$)</Label>
                    <Field type="number" step="0.5" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Estoque</Label>
                    <Field type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label>Selo</Label>
                  <select value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className="w-full border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold">
                    <option value="">Nenhum</option>
                    <option value="MAIS VENDIDO">Mais vendido</option>
                    <option value="QUERIDINHO">Queridinho</option>
                    <option value="NOVO">Novo</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 font-extrabold text-[13px] mt-1">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} /> Item ativo no cardápio
                </label>
              </div>
              <div className="flex gap-2 mt-4.5">
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
