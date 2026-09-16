import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { brl } from '../../lib/format'
import { MIN_ORDER, DEFAULT_LOGO } from '../../lib/demoData'
import { getSavedCustomer, saveCustomer } from '../../lib/savedCustomer'

export default function CartDrawer({ open, onClose, items, total, count, onInc, onDec, onClear, drinkOptions, onAddDrink, onSubmitOrder, onBrowse, logoUrl }) {
  const [sauceChoice, setSauceChoice] = useState(null)
  const [sauceWarning, setSauceWarning] = useState(false)
  const [step, setStep] = useState('cart') // cart | details | done
  const [name, setName] = useState(() => getSavedCustomer().name)
  const [phone, setPhone] = useState(() => getSavedCustomer().phone)
  const [street, setStreet] = useState(() => getSavedCustomer().street)
  const [number, setNumber] = useState(() => getSavedCustomer().number)
  const [neighborhood, setNeighborhood] = useState(() => getSavedCustomer().neighborhood)
  const [city, setCity] = useState(() => getSavedCustomer().city)
  const [payment, setPayment] = useState('pix')
  const [needsChange, setNeedsChange] = useState(null) // 'sim' | 'nao'
  const [changeFor, setChangeFor] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const belowMinimum = total < MIN_ORDER
  const missing = Math.max(0, MIN_ORDER - total)

  const goToDetails = () => {
    if (belowMinimum) return
    if (!sauceChoice) {
      setSauceWarning(true)
      return
    }
    setStep('details')
  }

  const addressLine = [street.trim() && number.trim() ? `${street.trim()}, Nº ${number.trim()}` : street.trim(), neighborhood.trim(), city.trim()]
    .filter(Boolean)
    .join(' — ')

  const canSubmit = name.trim() && street.trim() && number.trim() && neighborhood.trim() && (payment !== 'dinheiro' || needsChange === 'nao' || (needsChange === 'sim' && changeFor.trim()))

  const submit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    const order = {
      customer_name: name.trim(),
      phone: phone.trim(),
      address: addressLine,
      items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })),
      total,
      payment,
      sauce_choice: sauceChoice,
      change_for: payment === 'dinheiro' && needsChange === 'sim' ? changeFor.trim() : null,
    }
    saveCustomer({ name: name.trim(), phone: phone.trim(), street: street.trim(), number: number.trim(), neighborhood: neighborhood.trim(), city: city.trim() })
    const link = await onSubmitOrder(order)
    setSubmitting(false)
    setStep('done')
    window.open(link, '_blank')
  }

  const reset = () => {
    setStep('cart')
    setSauceChoice(null)
    setSauceWarning(false)
    setPayment('pix')
    setNeedsChange(null)
    setChangeFor('')
    onClear()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={step === 'done' ? reset : onClose} className="fixed inset-0 z-[60] bg-piri-dark/55 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label="Seu pedido"
            className="fixed z-[61] bg-piri-cream flex flex-col top-0 right-0 bottom-0 w-[min(440px,100vw)] shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 pt-4.5 pb-3 gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-[28px] m-0 text-piri-dark">Seu pedido</h2>
                {count > 0 && step === 'cart' && (
                  <span className="bg-piri-gold text-piri-dark rounded-full px-2.5 py-1 text-xs font-black">
                    {count} {count === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>
              <button onClick={onClose} aria-label="Fechar" className="w-11 h-11 rounded-full bg-white text-piri-dark text-xl font-black shadow-sm">
                ✕
              </button>
            </div>

            {count === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <img src={logoUrl || DEFAULT_LOGO} alt="" className="w-22 h-22 rounded-full opacity-90" />
                <p className="font-display text-2xl text-piri-dark m-0">Seu carrinho tá vazio</p>
                <p className="m-0 text-piri-brown font-bold text-sm">Bora resolver isso? Uma coxinha nunca vem sozinha.</p>
                <button onClick={onBrowse} className="mt-2 bg-piri-red text-white rounded-full px-6 py-3.5 font-black text-[15px]">
                  Ver cardápio
                </button>
              </div>
            )}

            {count > 0 && step === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto px-5 pb-3 flex flex-col gap-2.5">
                  {items.map((it) => (
                    <motion.div layout key={it.id} className="flex gap-3 items-center bg-white rounded-2xl p-2.5 shadow-sm">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F4E4C8] flex-none flex items-center justify-center">
                        {!it.icon && <img src={it.img} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="m-0 font-black text-[15px] text-piri-dark leading-tight">{it.name}</p>
                        <p className="mt-0.5 text-[13px] text-piri-brown font-bold">
                          {brl(it.price)} · <span className="text-piri-red">{brl(it.price * it.qty)}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-piri-cream rounded-full p-0.5 flex-none">
                        <button onClick={() => onDec(it.id)} aria-label="Diminuir" className="w-9 h-9 rounded-full bg-white text-piri-red font-black text-lg">
                          −
                        </button>
                        <span className="min-w-5.5 text-center font-black text-[15px]">{it.qty}</span>
                        <button onClick={() => onInc(it.id)} aria-label="Aumentar" className="w-9 h-9 rounded-full bg-piri-red text-white font-black text-lg">
                          +
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <button onClick={onClear} className="self-start text-piri-brown font-black text-[13px] underline py-2">
                    Limpar carrinho
                  </button>
                </div>

                <div className="px-5 pt-3.5 pb-5 bg-white rounded-t-[28px] shadow-[0_-10px_30px_rgba(120,60,20,.08)] flex flex-col gap-3 max-h-[56vh] overflow-y-auto">
                  {drinkOptions.length > 0 && (
                    <div>
                      <p className="m-0 mb-2 font-black text-[13px] text-piri-dark">🥤 Vai querer uma bebida geladinha?</p>
                      <div className="flex gap-2 overflow-x-auto pb-0.5">
                        {drinkOptions.map((d) => {
                          const inCart = items.find((it) => it.id === d.id)
                          return (
                            <button
                              key={d.id}
                              onClick={() => onAddDrink(d.id)}
                              className={`flex-none flex items-center gap-2 border rounded-full pl-1 pr-3 py-1 ${
                                inCart ? 'bg-[#FFF3C4] border-piri-gold' : 'bg-piri-cream border-piri-dark/10'
                              }`}
                            >
                              <span className="w-6.5 h-6.5 rounded-full overflow-hidden inline-block bg-white flex-none">
                                {d.img && <img src={d.img} alt="" className="w-full h-full object-cover" />}
                              </span>
                              <span className="text-xs font-extrabold text-piri-dark whitespace-nowrap">
                                {d.name.split(' ').slice(0, 2).join(' ')} · {brl(d.price)}
                              </span>
                              {inCart && <span className="text-[11px] font-black text-piri-red flex-none">×{inCart.qty}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="m-0 mb-2 font-black text-[13px] text-piri-dark">
                      Sachês de ketchup e maionese <span className="text-piri-red">*obrigatório</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSauceChoice('sim')
                          setSauceWarning(false)
                        }}
                        className="rounded-2xl py-3 font-black text-[13.5px] border-2"
                        style={{
                          borderColor: sauceChoice === 'sim' ? '#1f8a3b' : 'rgba(58,20,16,.12)',
                          background: sauceChoice === 'sim' ? '#F1F8F1' : '#fff',
                          color: sauceChoice === 'sim' ? '#1f8a3b' : '#3A1410',
                        }}
                      >
                        Sim, por favor
                      </button>
                      <button
                        onClick={() => {
                          setSauceChoice('nao')
                          setSauceWarning(false)
                        }}
                        className="rounded-2xl py-3 font-black text-[13.5px] border-2"
                        style={{
                          borderColor: sauceChoice === 'nao' ? '#C1121F' : 'rgba(58,20,16,.12)',
                          background: sauceChoice === 'nao' ? '#FBEAEA' : '#fff',
                          color: sauceChoice === 'nao' ? '#C1121F' : '#3A1410',
                        }}
                      >
                        Não, obrigado
                      </button>
                    </div>
                    {sauceWarning && <p className="mt-1.5 text-piri-red font-extrabold text-xs">Escolha uma opção para continuar.</p>}
                  </div>
                  <div className="flex justify-between font-bold text-piri-brown text-sm">
                    <span>Subtotal</span>
                    <span>{brl(total)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-piri-brown text-sm">
                    <span>Entrega</span>
                    <span className="text-piri-green font-black">Grátis</span>
                  </div>
                  {belowMinimum && (
                    <p className="m-0 bg-[#FFF3C4] text-piri-brown rounded-xl px-3 py-2 text-[13px] font-bold">
                      Faltam {brl(missing)} para o pedido mínimo de {brl(MIN_ORDER)}
                    </p>
                  )}
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="font-black text-base">Total</span>
                    <span className="font-display text-3xl text-piri-red">{brl(total)}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={goToDetails}
                    disabled={belowMinimum}
                    className="w-full text-white rounded-full py-4 font-black text-base shadow-lg"
                    style={{ background: belowMinimum || !sauceChoice ? '#C9A59A' : '#C1121F' }}
                  >
                    Finalizar pedido
                  </motion.button>
                </div>
              </>
            )}

            {step === 'details' && (
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                <button onClick={() => setStep('cart')} className="self-start text-piri-brown font-black text-sm">
                  ‹ Voltar
                </button>
                <div className="flex items-center justify-between gap-2">
                  <p className="m-0 font-black text-piri-dark text-lg">Seus dados pra entrega</p>
                  {(name || street) && (
                    <button
                      onClick={() => {
                        setName('')
                        setPhone('')
                        setStreet('')
                        setNumber('')
                        setNeighborhood('')
                      }}
                      className="text-piri-brown text-[11px] font-extrabold underline flex-none"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                {(name || street) && <p className="m-0 -mt-2 text-[11.5px] text-piri-brown font-bold">Preenchido com seus dados do último pedido — pode editar à vontade.</p>}

                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1">Nome</p>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1">WhatsApp</p>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(74) 9____-____" className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold" />
                </div>

                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1">Rua</p>
                    <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1">Número</p>
                    <input value={number} onChange={(e) => setNumber(e.target.value)} className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1">Bairro</p>
                  <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1">Cidade</p>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold" />
                </div>

                <div className="mt-1">
                  <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1.5">Forma de pagamento</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['pix', 'Pix'],
                      ['dinheiro', 'Dinheiro'],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => {
                          setPayment(id)
                          if (id !== 'dinheiro') {
                            setNeedsChange(null)
                            setChangeFor('')
                          }
                        }}
                        className="rounded-2xl py-2.5 font-black text-[13px]"
                        style={{ background: payment === id ? '#2B1210' : '#fff', color: payment === id ? '#fff' : '#2B1210', border: payment === id ? 'none' : '1px solid rgba(43,18,16,.16)' }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {payment === 'dinheiro' && (
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-piri-brown mb-1.5">Precisa de troco?</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => setNeedsChange('sim')}
                        className="rounded-2xl py-2.5 font-black text-[13px] border-2"
                        style={{
                          borderColor: needsChange === 'sim' ? '#1f8a3b' : 'rgba(58,20,16,.12)',
                          background: needsChange === 'sim' ? '#F1F8F1' : '#fff',
                          color: needsChange === 'sim' ? '#1f8a3b' : '#3A1410',
                        }}
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => {
                          setNeedsChange('nao')
                          setChangeFor('')
                        }}
                        className="rounded-2xl py-2.5 font-black text-[13px] border-2"
                        style={{
                          borderColor: needsChange === 'nao' ? '#C1121F' : 'rgba(58,20,16,.12)',
                          background: needsChange === 'nao' ? '#FBEAEA' : '#fff',
                          color: needsChange === 'nao' ? '#C1121F' : '#3A1410',
                        }}
                      >
                        Não
                      </button>
                    </div>
                    {needsChange === 'sim' && (
                      <input
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        placeholder="Troco para quanto? Ex: R$ 50,00"
                        className="w-full h-12 rounded-2xl border border-piri-dark/15 px-4 font-bold"
                      />
                    )}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={submit}
                  disabled={!canSubmit || submitting}
                  className="w-full text-white rounded-full py-4 font-black text-base shadow-lg mt-2"
                  style={{ background: !canSubmit || submitting ? '#C9A59A' : '#C1121F' }}
                >
                  {submitting ? 'Enviando...' : 'Confirmar e enviar no WhatsApp'}
                </motion.button>
              </div>
            )}

            {step === 'done' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-piri-gold flex items-center justify-center text-4xl">🎉</div>
                <p className="font-display text-2xl text-piri-dark m-0">Pedido enviado!</p>
                <p className="m-0 text-piri-brown font-bold text-sm">Abrimos o WhatsApp pra você confirmar com a gente. Se não abriu, chama no (74) 9982-9662.</p>
                <button onClick={reset} className="mt-2 bg-piri-red text-white rounded-full px-6 py-3.5 font-black text-[15px]">
                  Fechar
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
