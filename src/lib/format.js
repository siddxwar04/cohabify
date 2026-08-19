export const inr = (n = 0) =>
  `₹${Math.abs(Math.round(Number(n) || 0)).toLocaleString('en-IN')}`

export const signedInr = (n = 0) => {
  const v = Math.round(Number(n) || 0)
  if (v === 0) return '₹0'
  return `${v > 0 ? '+' : '−'}${inr(v)}`
}

export const firstName = (name = '') => name.split(' ')[0]

export const initialsFrom = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (!parts.length) return '?'
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}
