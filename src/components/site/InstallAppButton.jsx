import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent)
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [iosHelpOpen, setIosHelpOpen] = useState(false)

  useEffect(() => {
    setInstalled(isStandalone())

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const onInstalled = () => setInstalled(true)

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null
  if (!deferredPrompt && !isIOS()) return null

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setInstalled(true)
      setDeferredPrompt(null)
    } else {
      setIosHelpOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 bg-piri-gold text-piri-dark rounded-full px-4 py-2.5 font-black text-[13px] self-start"
      >
        📲 Adicionar à tela inicial
      </button>

      <AnimatePresence>
        {iosHelpOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIosHelpOpen(false)}
              className="fixed inset-0 z-[70] bg-piri-dark/55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed z-[71] left-1/2 bottom-0 -translate-x-1/2 w-[min(440px,100vw)] bg-white rounded-t-[28px] p-6 shadow-2xl text-center"
            >
              <p className="font-display text-xl text-piri-dark m-0 mb-3">Adicionar à tela inicial</p>
              <p className="m-0 text-piri-brown font-bold text-[14px] leading-relaxed">
                No Safari, toque no ícone de compartilhar <span className="font-black">⬆️</span> na barra do navegador e depois em <span className="font-black">"Adicionar à Tela de Início"</span>.
              </p>
              <button onClick={() => setIosHelpOpen(false)} className="mt-5 bg-piri-red text-white rounded-full px-6 py-3 font-black text-[14px]">
                Entendi
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
