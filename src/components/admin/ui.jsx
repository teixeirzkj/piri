export function Card({ className = '', children }) {
  return <div className={`bg-white rounded-2xl border border-piri-dark/8 p-4.5 ${className}`}>{children}</div>
}

export function Label({ children }) {
  return <p className="text-[11px] font-black tracking-wide text-piri-brown uppercase mb-1.5">{children}</p>
}

export function Field(props) {
  return <input {...props} className={`w-full border border-piri-dark/16 rounded-[10px] px-3 py-2.5 text-[13.5px] font-bold text-piri-dark bg-white ${props.className || ''}`} />
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-piri-red text-white',
    ghost: 'bg-piri-cream text-piri-dark',
    outline: 'bg-white border border-piri-red text-piri-red',
  }
  return <button {...props} className={`rounded-[10px] px-4 py-2.5 font-black text-[13px] disabled:opacity-50 ${styles[variant]} ${className}`} />
}
