export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}
