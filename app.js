import { defaultPrices } from './prices.js?v=aluplexa-contrast-20261027';
import { calculate, totals } from './calculator.js?v=aluplexa-contrast-20261027';
import { catalog, productById, bandKey } from './catalog.js?v=aluplexa-contrast-20261027';
const $ = id => document.getElementById(id);
const money = cents => cents === null ? 'Pendiente' : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', currencyDisplay: 'code' }).format(cents / 100);
let items = [], prices = { ...defaultPrices };
try { const saved = JSON.parse(localStorage.getItem('catalog-prices-v1')); if (saved && typeof saved === 'object' && !Array.isArray(saved)) prices = { ...defaultPrices, ...saved }; } catch {}
for (const family of new Set(catalog.map(p => p.family))) $('family').add(new Option(family, family));
function selectFamily() {
 $('model').replaceChildren();
 for (const p of catalog.filter(p => p.family === $('family').value)) $('model').add(new Option(p.name,p.id));
 selectModel();
}
function selectModel() {
 const product = productById($('model').value);
 const maxWidth = Math.max(...product.bands.map(b => b.width)), maxHeight = Math.max(...product.bands.map(b => b.height));
 $('width').max = maxWidth; $('height').max = maxHeight;
 $('limits').textContent = `Máximos del modelo: ${maxWidth} mm de ancho × ${maxHeight} mm de alto. La combinación debe estar cubierta por un tramo del catálogo.`;
 $('pricing-title').textContent = `${product.family} · ${product.name} — página ${product.page}`;
 $('price-rows').replaceChildren();
 for (const band of product.bands) {
  const key = `${product.id}:${bandKey(band)}`;
  const tr = document.createElement('tr');
  for (const value of [band.width, band.height]) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
  const td = document.createElement('td'), input = document.createElement('input');
  input.type = 'number'; input.min = '.01'; input.max = '1000000'; input.step = '.01'; input.placeholder = 'Pendiente';
  input.setAttribute('aria-label', `Precio USD hasta ${band.width} por ${band.height} mm`);
  if (typeof prices[key] === 'number' && prices[key] > 0) input.value = prices[key];
  input.addEventListener('change', () => {
   if (!input.checkValidity()) { input.reportValidity(); return; }
   if (!input.value) prices[key] = null; else prices[key] = Number(input.value);
   try { localStorage.setItem('catalog-prices-v1', JSON.stringify(prices)); } catch { $('error').textContent = 'No se pudieron guardar las tarifas en este navegador.'; }
  });
  td.append(input); tr.append(td); $('price-rows').append(tr);
 }
 $('error').textContent = '';
}
function render() {
 $('items').replaceChildren();
 if (!items.length) $('items').innerHTML = '<div class="empty"><span>▦</span>Tu proyecto empieza aquí.<br>Añade tu primera mosquitera.</div>';
 items.forEach((item,index) => {
  const product = productById(item.type), node = document.createElement('div'); node.className = 'item';
  const remove = document.createElement('button'); remove.className = 'remove'; remove.textContent = 'Eliminar ×'; remove.setAttribute('aria-label', `Eliminar mosquitera ${index + 1}`);
  remove.addEventListener('click', () => { items.splice(index,1); render(); }); node.append(remove);
  for (const [tag,text] of [['strong',`${product.family} · ${product.name} · ${item.quantity} ud.`],['p',`${item.width} × ${item.height} mm · Color: ${item.color || 'a consultar'}`],['p',`Tramo hasta ${item.band.width} × ${item.band.height} mm`],['p',item.unitCents === null ? 'Precio pendiente de cargar' : `${money(item.unitCents)} / unidad sin IVA`],['strong',money(item.totalCents)]]) {
   const element = document.createElement(tag); element.textContent = text; node.append(element);
  }
  $('items').append(node);
 });
 const result = totals(items,Number($('vat').value));
 for (const name of ['subtotal','tax','total']) $(name).textContent = money(result[name]);
 $('vat-label').textContent = $('vat').value;
 const count = items.reduce((sum,item) => sum + item.quantity,0); $('count').textContent = `${count} ${count === 1 ? 'unidad' : 'unidades'}`;
 $('print').disabled = !items.length;
}
$('family').addEventListener('change',selectFamily); $('model').addEventListener('change',selectModel);
$('vat').addEventListener('input', () => { if ($('vat').value && $('vat').checkValidity()) render(); });
$('quote-form').addEventListener('submit',event => {
 event.preventDefault();
 try {
  if (!$('vat').value || !$('vat').checkValidity()) throw new Error('Revisa el porcentaje de IVA.');
  items.push(calculate({ type: $('model').value, width: Number($('width').value), height: Number($('height').value), quantity: Number($('quantity').value), color: $('color').value.trim(), prices }));
  $('error').textContent = ''; render();
 } catch (error) { $('error').textContent = error.message; }
});
$('print').addEventListener('click', () => { if ($('vat').value && $('vat').checkValidity()) window.print(); else $('vat').reportValidity(); });
selectFamily(); render();
