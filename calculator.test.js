import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, bandKey } from './catalog.js';
import { calculate, totals } from './calculator.js';
const base = { type: 'p22-single', width: 1600, height: 2150, quantity: 1 };
test('catálogo completo: nueve modelos y 310 tramos', () => { assert.equal(catalog.length,9); assert.equal(catalog.reduce((n,p) => n+p.bands.length,0),310); });
test('todos los tramos admiten su límite exacto; máximos no se exceden', () => {
 for (const product of catalog) {
  for (const band of product.bands) assert.doesNotThrow(() => calculate({ ...base,type:product.id,...band }));
  assert.throws(() => calculate({ ...base,type:product.id,width:Math.max(...product.bands.map(b=>b.width))+1,height:1 }));
  assert.throws(() => calculate({ ...base,type:product.id,width:1,height:Math.max(...product.bands.map(b=>b.height))+1 }));
 }
});
test('bilateral: límites conjuntos, no rectángulo máximo inventado', () => {
 assert.equal(bandKey(calculate({ ...base,type:'p22-bilateral',width:2400,height:2351 }).band),'2400x2550');
 assert.equal(bandKey(calculate({ ...base,type:'p22-bilateral',width:2401,height:2150 }).band),'3000x2550');
 assert.equal(bandKey(calculate({ ...base,type:'p22-bilateral',width:3000,height:2800 }).band),'3000x2800');
 assert.throws(() => calculate({ ...base,type:'p22-central',width:3200,height:2551 }));
});
test('enrollables: orientación y redondeo al siguiente tramo', () => {
 assert.equal(bandKey(calculate({ ...base,type:'roller-vertical',width:801,height:901 }).band),'900x1000');
 assert.equal(bandKey(calculate({ ...base,type:'roller-single',width:1000,height:2050 }).band),'1100x2100');
 assert.throws(() => calculate({ ...base,type:'roller-single',width:2000,height:900 }));
 assert.equal(bandKey(calculate({ ...base,type:'roller-double',width:2700,height:2500 }).band),'2700x2500');
});
test('precios pendientes no se convierten en cero ni producen totales parciales', () => {
 const pending=calculate(base); assert.equal(pending.unitCents,null); assert.equal(totals([pending]).total,null);
 const priced=calculate({...base,prices:{'p22-single:1600x2150':100}}); assert.equal(totals([pending,priced]).total,null);
});
test('precio por tramo, cantidad, IVA configurable y redondeo monetario', () => {
 const line=calculate({...base,quantity:3,prices:{'p22-single:1600x2150':123.45}});
 assert.equal(line.totalCents,37035); assert.deepEqual(totals([line],21),{subtotal:37035,tax:7777,total:44812}); assert.equal(totals([line],0).total,37035);
});
test('validación de entradas y tarifas', () => {
 for (const patch of [{width:0},{height:NaN},{width:1.5},{quantity:1.2},{quantity:101},{type:'fixed'}]) assert.throws(()=>calculate({...base,...patch}));
 for (const price of [-1,0,Infinity,'100']) assert.equal(calculate({...base,prices:{'p22-single:1600x2150':price}}).unitCents,null);
 assert.throws(()=>totals([],101));
});
