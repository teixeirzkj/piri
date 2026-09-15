import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCombos } from '../hooks/useCombos'
import { useSettings } from '../hooks/useSettings'
import { useOrders } from '../hooks/useOrders'
import { useCart } from '../hooks/useCart'
import { CATEGORIES } from '../lib/demoData'
import { norm } from '../lib/format'
import { computeStoreStatus } from '../lib/storeStatus'
import { orderWhatsAppLink } from '../lib/whatsapp'

import StoreHeader from '../components/site/StoreHeader'
import CartFab from '../components/site/CartFab'
import ComboCarousel from '../components/site/ComboCarousel'
import ComboModal from '../components/site/ComboModal'
import FeaturedScroller from '../components/site/FeaturedScroller'
import ProductRow from '../components/site/ProductRow'
import ProductModal from '../components/site/ProductModal'
import CartDrawer from '../components/site/CartDrawer'
import Toast from '../components/site/Toast'
import FloatingCartBar from '../components/site/FloatingCartBar'
import Footer from '../components/site/Footer'

export default function Cardapio() {
  const { products } = useProducts()
  const { combos } = useCombos()
  const { settings } = useSettings()
  const { addOrder } = useOrders()

  const activeProducts = useMemo(() => products.filter((p) => p.active !== false), [products])
  const cart = useCart(activeProducts)

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [openProduct, setOpenProduct] = useState(null)
  const [openCombo, setOpenCombo] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [, forceTick] = useState(0)

  // Re-check open/closed as real time passes, not just when settings data changes
  // (e.g. the store crosses its closing time while a customer has the page open).
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 30000)
    return () => clearInterval(t)
  }, [])

  const status = computeStoreStatus(settings)
  const q = norm(query.trim())
  const searchActive = q.length > 0

  const showToast = (msg) => {
    setToast(msg)
    clearTimeout(showToast._t)
    showToast._t = setTimeout(() => setToast(null), 1800)
  }

  const handleAdd = (id, qty = 1) => {
    cart.add(id, qty)
    const p = activeProducts.find((x) => x.id === id)
    if (p) showToast(`${p.name} adicionado ao carrinho`)
  }

  const featured = activeProducts.filter((p) => p.featured)

  const groups = CATEGORIES.map((c) => {
    const items = activeProducts.filter((p) => p.cat === c.id && (!searchActive || norm(p.name).includes(q)))
    return { ...c, items }
  })

  const drinkOptions = activeProducts.filter((p) => p.cat === 'bebidas' && p.id.endsWith('-lata'))

  const handleSubmitOrder = async (orderDraft) => {
    const cost = orderDraft.items.reduce((a, it) => {
      const p = activeProducts.find((x) => x.id === it.id)
      return a + it.qty * (p?.cost || 0)
    }, 0)
    await addOrder({ ...orderDraft, cost, profit: orderDraft.total - cost })
    return orderWhatsAppLink({
      items: orderDraft.items,
      total: orderDraft.total,
      customerName: orderDraft.customer_name,
      phone: orderDraft.phone,
      address: orderDraft.address,
      payment: orderDraft.payment,
      changeFor: orderDraft.change_for,
      sauceChoice: orderDraft.sauce_choice,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-piri-cream">
      <StoreHeader
        status={status}
        searchOpen={searchOpen}
        onToggleSearch={() => {
          setSearchOpen((s) => !s)
          setQuery('')
        }}
        query={query}
        onQueryChange={setQuery}
      />

      <CartFab count={cart.count} onOpen={() => setCartOpen(true)} />

      <main className="max-w-[640px] mx-auto px-4 pt-5.5 pb-10 w-full flex-1">
        {searchActive && <p className="mb-1 font-extrabold text-[13px] text-piri-brown">Resultados para "{query.trim()}"</p>}

        {!searchActive && (
          <>
            <ComboCarousel combos={combos} onSelect={setOpenCombo} />
            <a
              href="https://wa.me/557499829662"
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-1.5 text-piri-dark font-extrabold text-[13px] py-2.5 border-y border-piri-dark/8 mb-6"
            >
              Tirar dúvidas no WhatsApp <span className="text-piri-red">›</span>
            </a>
            <FeaturedScroller products={featured} onOpen={setOpenProduct} />
            <a
              href="https://wa.me/557499829662"
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-1.5 text-piri-dark font-extrabold text-[13px] py-2.5 border-y border-piri-dark/8 mt-6"
            >
              Tirar dúvidas no WhatsApp <span className="text-piri-red">›</span>
            </a>
          </>
        )}

        {groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section key={g.id} id={g.id} className="mt-8 scroll-mt-4">
              <div className="-mx-4 px-4 py-3 bg-piri-dark flex items-center justify-center gap-2.5">
                <span className="text-sm opacity-80">💛</span>
                <h2 className="font-display text-xl text-white tracking-wide text-center">{g.label}</h2>
                <span className="text-sm opacity-80">💛</span>
              </div>
              <p className="mt-2.5 mb-3.5 text-[12.5px] font-bold text-piri-brown text-center">{g.priceNote}</p>
              <div className="flex flex-col">
                {g.items.map((p) => (
                  <ProductRow key={p.id} product={p} qty={cart.cart[p.id] || 0} onOpen={setOpenProduct} onAdd={() => handleAdd(p.id)} onDec={() => cart.dec(p.id)} />
                ))}
              </div>
            </section>
          ))}
      </main>

      <Footer />

      <FloatingCartBar show={cart.count > 0 && !cartOpen && !openProduct} count={cart.count} total={cart.total} onOpen={() => setCartOpen(true)} />

      <Toast message={toast} bottomOffset={cart.count > 0 && !cartOpen ? 88 : 24} />

      <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} onAdd={handleAdd} />

      <ComboModal combo={openCombo} products={activeProducts} onClose={() => setOpenCombo(null)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        total={cart.total}
        count={cart.count}
        onInc={(id) => cart.add(id)}
        onDec={cart.dec}
        onClear={cart.clear}
        drinkOptions={drinkOptions}
        onAddDrink={(id) => {
          handleAdd(id)
        }}
        onSubmitOrder={handleSubmitOrder}
        onBrowse={() => setCartOpen(false)}
      />
    </div>
  )
}
