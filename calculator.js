export const models = { fixed: 'Fija', roller: 'Enrollable', sliding: 'Corredera' };
export const finishes = { white: ['Blanco', 1], anthracite: ['Antracita', 1.15], wood: ['Efecto madera', 1.25] };
export function calculate({ type, finish, width, height, quantity, rate }) {
  if (!models[type] || !finishes[finish] || ![width, height, quantity, rate].every(Number.isFinite) || width < 20 || width > 300 || height < 20 || height > 300 || !Number.isInteger(quantity) || quantity < 1 || quantity > 100 || rate < 1 || rate > 10000) throw new Error('Revisa las medidas (20–300 cm), la cantidad (1–100) y las tarifas (1–10.000 €/m²).');
  const area = width * height / 10000;
  const unitCents = Math.round(Math.max(1, area) * rate * finishes[finish][1] * 100);
  return { type, finish, width, height, quantity, area, rate, unitCents, totalCents: unitCents * quantity };
}
export function totals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.totalCents, 0);
  const tax = Math.round(subtotal * .21);
  return { subtotal, tax, total: subtotal + tax };
}
