import { calculate, totals, models, finishes } from './calculator.js';
const $ = id => document.getElementById(id);
const money = cents => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
let items = [];
for (const type of Object.keys(models)) {
  const input = $(`rate-${type}`);
  try { const saved = Number(localStorage.getItem(`rate-${type}`)); if (saved >= 1 && saved <= 10000) input.value = saved; } catch {}
  input.addEventListener('change', () => { if (input.checkValidity()) { try { localStorage.setItem(`rate-${type}`, input.value); } catch {} } });
}
function render() {
  $('items').replaceChildren();
  if (!items.length) $('items').innerHTML = '<div class="empty"><span>▦</span>Tu proyecto empieza aquí.<br>Añade tu primera mosquitera.</div>';
  items.forEach((item, index) => {
    const node = document.createElement('div'); node.className = 'item';
    node.innerHTML = `<button class="remove" aria-label="Eliminar mosquitera ${index + 1}">Eliminar ×</button><strong>${models[item.type]} · ${item.quantity} ud.</strong><p>${item.width} × ${item.height} cm · ${finishes[item.finish][0]}</p><p>${money(item.unitCents)} / unidad · ${Math.max(1, item.area).toFixed(2)} m² facturados/ud.</p><span class="item-price">${money(item.totalCents)}</span>`;
    node.querySelector('button').addEventListener('click', () => { items.splice(index, 1); render(); });
    $('items').append(node);
  });
  const result = totals(items);
  for (const name of ['subtotal', 'tax', 'total']) $(name).textContent = money(result[name]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  $('count').textContent = `${count} ${count === 1 ? 'unidad' : 'unidades'}`;
  $('print').disabled = !items.length;
}
$('quote-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    const type = new FormData(event.currentTarget).get('type');
    items.push(calculate({ type, finish: $('finish').value, width: Number($('width').value), height: Number($('height').value), quantity: Number($('quantity').value), rate: Number($(`rate-${type}`).value) }));
    $('error').textContent = ''; render();
  } catch (error) { $('error').textContent = error.message; }
});
$('print').addEventListener('click', () => window.print());
render();
