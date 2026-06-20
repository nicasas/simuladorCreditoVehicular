/** Format as Colombian pesos: $ 1.500.000 */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a decimal rate as percentage with Colombian separators: 24,5000% */
export function formatPercent(rate: number, decimals = 4): string {
  const pct = rate * 100;
  return (
    pct.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + '%'
  );
}

/** Format a plain number with Colombian thousands separator */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Parse a string that may contain Colombian-style formatting (dots as thousands, comma as decimal).
 * Returns NaN if not a valid number.
 */
export function parseInputNumber(str: string): number {
  // Strip thousand separators (dots) then replace decimal comma with dot
  const clean = str.replace(/\./g, '').replace(',', '.');
  return parseFloat(clean);
}
