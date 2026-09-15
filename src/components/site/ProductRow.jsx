import { motion } from 'framer-motion'
import { brl, badgeStyle } from '../../lib/format'
import DrinkIcon from './DrinkIcon'

export default function ProductRow({ product, onOpen }) {
  const [badgeBg, badgeColor] = badgeStyle(product.badge)
  return (
    <motion.button
      layout
      onClick={() => onOpen(product)}
      whileTap={{ scale: 0.98 }}
      className="flex gap-3.5 items-center py-3.5 border-b border-piri-dark/8 text-left w-full last:border-b-0"
    >
      <div className="flex-1 min-w-0">
        <p className="m-0 text-[15px] font-black text-piri-dark leading-tight">
          {product.name}
          {product.badge && (
            <span
              className="ml-1.5 text-[9.5px] font-black tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: badgeBg, color: badgeColor }}
            >
              {product.badge}
            </span>
          )}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-piri-brown leading-snug">{product.description}</p>
        <p className="font-display mt-1.5 text-[17px] text-piri-red">{brl(product.price)}</p>
      </div>
      <div className="relative flex-none w-21 h-21 rounded-2xl overflow-hidden bg-[#F4E4C8] flex items-center justify-center">
        {product.icon ? (
          <DrinkIcon kind={product.iconKind} color={product.iconColor} size={42} />
        ) : (
          <img src={product.img} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        )}
      </div>
    </motion.button>
  )
}
