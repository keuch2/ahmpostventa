export function formatPYG(amount) {
  if (amount == null) return 'Gs 0';
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-PY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatNumber(num) {
  if (num == null) return '0';
  return new Intl.NumberFormat('es-PY').format(num);
}

export function truncateVIN(vin) {
  if (!vin || vin.length < 6) return vin || '';
  return '···' + vin.slice(-6);
}
