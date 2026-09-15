const KEY = 'piri_customer_v1'

const DEFAULTS = { name: '', phone: '', street: '', number: '', neighborhood: '', city: 'Miguel Calmon' }

export function getSavedCustomer() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveCustomer(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // localStorage unavailable (private mode, etc.) — silently skip, it's just a convenience
  }
}
