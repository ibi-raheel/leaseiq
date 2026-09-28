export const formatUSD = (n) => {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export const formatUSDCompact = (n) => {
  if (n == null || isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) {
    return '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K'
  }
  return formatUSD(n)
}

export const categoryColor = (cat) => {
  const m = {
    CAM: { dot: 'bg-maroon-600', tag: 'bg-maroon-50 text-maroon-700 border-maroon-100' },
    TAX: { dot: 'bg-gold-600', tag: 'bg-gold-50 text-gold-700 border-gold-100' },
    INSURANCE: { dot: 'bg-sage-500', tag: 'bg-cream-100 text-ink-700 border-cream-200' },
    TENANT_PROTECTION: { dot: 'bg-maroon-400', tag: 'bg-maroon-50 text-maroon-700 border-maroon-100' },
    CALCULATION: { dot: 'bg-gold-500', tag: 'bg-gold-50 text-gold-700 border-gold-100' },
  }
  return m[cat] || { dot: 'bg-ink-400', tag: 'bg-cream-100 text-ink-700 border-cream-200' }
}

// Estimate processing time from file size — produces a number of seconds.
export const estimateProcessingSeconds = (file) => {
  if (!file) return 35
  const mb = file.size / (1024 * 1024)
  // Rough rule: 12s per MB plus a 14s base, capped between 22 and 95 seconds.
  const raw = 14 + mb * 12
  return Math.max(22, Math.min(95, Math.round(raw)))
}
