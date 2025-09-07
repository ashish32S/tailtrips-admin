export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  const num = typeof amount === 'number' ? amount : Number(amount || 0);
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
  } catch (_) {
    return `$${num.toFixed(2)}`;
  }
}

export function formatDate(input) {
  try {
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  } catch (_) {
    return '';
  }
}

export function parseCsvList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toTitleCase(value) {
  if (!value) return '';
  return value.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function groupByMonth(items, getDate, getValue) {
  const map = new Map();
  for (const item of items) {
    const d = getDate(item);
    if (!d) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const prev = map.get(key) || 0;
    map.set(key, prev + (getValue ? getValue(item) : 1));
  }
  const keys = Array.from(map.keys()).sort();
  return { labels: keys, values: keys.map((k) => map.get(k) || 0) };
}

export function el(id) {
  return document.getElementById(id);
}

export function clearChildren(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function toDateMaybe(tsOrDate) {
  if (!tsOrDate) return null;
  if (tsOrDate instanceof Date) return tsOrDate;
  if (typeof tsOrDate.toDate === 'function') return tsOrDate.toDate();
  const d = new Date(tsOrDate);
  return Number.isNaN(d.getTime()) ? null : d;
}
