import { useMemo, useState } from 'react'

export function useCart(products) {
  const [cart, setCart] = useState({})

  const add = (id, qty = 1) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }))
  const dec = (id) =>
    setCart((c) => {
      const next = { ...c }
      if (next[id] > 1) next[id] -= 1
      else delete next[id]
      return next
    })
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c }
      delete next[id]
      return next
    })
  const clear = () => setCart({})

  const productById = (id) => products.find((p) => p.id === id)

  const items = useMemo(
    () =>
      Object.entries(cart)
        .filter(([id]) => productById(id))
        .map(([id, qty]) => ({ ...productById(id), qty })),
    [cart, products],
  )

  const count = items.reduce((a, it) => a + it.qty, 0)
  const total = items.reduce((a, it) => a + it.qty * it.price, 0)

  return { cart, items, count, total, add, dec, remove, clear }
}
