export function computeStoreStatus(settings) {
  if (!settings) return { open: false, label: 'Carregando...', color: '#8a5a4a' }
  if (settings.force_closed) return { open: false, label: 'Fechado agora', color: '#C1121F' }

  const d = new Date()
  const day = d.getDay()
  const hour = d.getHours() + d.getMinutes() / 60
  const daysOpen = settings.days_open || []
  const [openH, openM] = (settings.open_time || '10:00').split(':').map(Number)
  const [closeH, closeM] = (settings.close_time || '22:00').split(':').map(Number)
  const openHour = openH + openM / 60
  const closeHour = closeH + closeM / 60

  const open = daysOpen.includes(day) && hour >= openHour && hour < closeHour
  return {
    open,
    label: open ? 'Aberto agora' : 'Fechado agora',
    color: open ? '#1f8a3b' : '#C1121F',
  }
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function formatTime(t) {
  const [h, m] = (t || '').split(':')
  if (!h) return ''
  return m && m !== '00' ? `${Number(h)}h${m}` : `${Number(h)}h`
}

// Week ordered Mon..Sun (not 0..6) so a range like "Ter a Dom" groups correctly
// instead of splitting at the Sat→Sun wraparound.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function hoursLabel(settings) {
  if (!settings) return ''
  const openDays = new Set(settings.days_open || [])
  const positions = WEEK_ORDER.filter((d) => openDays.has(d))
  if (positions.length === 0) return 'Fechado temporariamente'

  const ranges = []
  let start = positions[0]
  let prev = positions[0]
  for (let i = 1; i <= positions.length; i++) {
    const d = positions[i]
    if (d !== undefined && WEEK_ORDER.indexOf(d) === WEEK_ORDER.indexOf(prev) + 1) {
      prev = d
      continue
    }
    ranges.push([start, prev])
    start = d
    prev = d
  }

  const daysText = ranges.map(([a, b]) => (a === b ? DAY_NAMES[a] : `${DAY_NAMES[a]} a ${DAY_NAMES[b]}`)).join(' · ')
  const timeText = `${formatTime(settings.open_time)}-${formatTime(settings.close_time)}`
  return `${daysText} · ${timeText}`
}
