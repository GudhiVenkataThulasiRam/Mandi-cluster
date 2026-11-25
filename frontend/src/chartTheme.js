
export const COLORS = {
  forest: '#0b3b29',
  green: '#15803d',
  fresh: '#16a34a',
  light: '#bbf7d0',
  amber: '#d97706',
  grid: '#e2e8f0',
  axis: '#64748b',
}

export const CLUSTER_COLORS = [
  '#059669',
  '#d97706',
  '#2563eb',
  '#7c3aed',
  '#e11d48',
]

export function clusterColor(cluster) {
  const index = Number(cluster)
  return CLUSTER_COLORS[
    Number.isFinite(index)
      ? Math.abs(index) % CLUSTER_COLORS.length
      : 0
  ]
}

export function shortName(name, maxLength = 20) {
  if (!name) return ''
  const value = String(name)
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1)}…`
    : value
}

export const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '10px',
  color: '#0F172A',
  padding: '10px 14px',
  boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
  fontSize: '13px',
}
