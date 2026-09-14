export default function DrinkIcon({ kind, color, size = 40 }) {
  if (kind === 'garrafa') {
    return (
      <svg width={size * 0.7} height={size} viewBox="0 0 30 52" fill="none">
        <path
          d="M11 2h8v8l5 6v32a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V16l5-6z"
          fill={color}
        />
        <rect x="9" y="24" width="12" height="8" fill="rgba(255,255,255,.25)" />
      </svg>
    )
  }
  return (
    <svg width={size * 0.85} height={size} viewBox="0 0 40 48" fill="none">
      <rect x="4" y="4" width="32" height="40" rx="6" fill={color} />
      <rect x="4" y="18" width="32" height="10" fill="rgba(255,255,255,.22)" />
      <ellipse cx="20" cy="4" rx="16" ry="3" fill="rgba(255,255,255,.35)" />
    </svg>
  )
}
