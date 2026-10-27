import { defaultPrices } from './prices.js';
import { productById, bandKey } from './catalog.js';
export function calculate({ type, width, height, quantity, prices = defaultPrices, color = '' }) {
 const product = productById(type);
 if (!product || ![width,height,quantity].every(Number.isFinite) || width <= 0 || height <= 0 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) throw new Error('Introduce medidas enteras positivas en mm y una cantidad entre 1 y 100.');
 const matching = product.bands.filter(b => width <= b.width && height <= b.height);
 if (!matching.length) throw new Error('La combinación de ancho y alto supera las medidas del catálogo para este modelo.');
 const band = matching.sort((a,b) => a.width * a.height - b.width * b.height || a.width - b.width)[0];
 const price = prices[`${type}:${bandKey(band)}`];
 const unitCents = typeof price === 'number' && Number.isFinite(price) && price > 0 && price <= 1000000 ? Math.round(price * 100) : null;
 return { type, width, height, quantity, color, band: { ...band }, unitCents, totalCents: unitCents === null ? null : unitCents * quantity };
}
export function totals(items, vat = 21) {
 if (!Number.isFinite(vat) || vat < 0 || vat > 100) throw new Error('El IVA debe estar entre 0 y 100%.');
 if (items.some(item => item.totalCents === null)) return { subtotal: null, tax: null, total: null };
 const subtotal = items.reduce((sum,item) => sum + item.totalCents, 0);
 const tax = Math.round(subtotal * vat / 100);
 return { subtotal, tax, total: subtotal + tax };
}
