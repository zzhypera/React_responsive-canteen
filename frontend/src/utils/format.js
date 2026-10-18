export const peso = (amount) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(Number(amount || 0))

export const shortDate = (value) =>
  new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))

export const statusClass = (status) => String(status || 'pending').toLowerCase().replaceAll(' ', '-')
