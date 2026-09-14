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

export function hoursLabel(settings) {
  if (!settings) return ''
  return `Aberto das ${settings.open_time} às ${settings.close_time}, nos dias marcados`
}
