export const formatPercent = ({ value, decimals }) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    currencyDisplay: 'symbol',
  }).format(value)
}

export const formatCurrency = ({ value, decimals }) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    currencyDisplay: 'symbol',
  }).format(value)
}
