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
 const pending=calculate({...base,prices:{}}); assert.equal(pending.unitCents,null); assert.equal(totals([pending]).total,null);
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

import { defaultPrices } from './prices.js';
test('las 310 tarifas del PDF cubren exactamente todos los tramos', () => {
 const keys = catalog.flatMap(p=>p.bands.map(b=>`${p.id}:${bandKey(b)}`));
 assert.deepEqual(Object.keys(defaultPrices).sort(),keys.sort());
 for (const price of Object.values(defaultPrices)) assert.ok(Number.isFinite(price) && price>0);
});
test('precios originales: plisadas, matrices enrollables y decimales', () => {
 const checks = [
 ['p22-single',1600,2150,462], ['p22-single',1600,2550,509],
 ['p22-bilateral',3000,2800,850], ['p22-central',3200,2550,1018],
 ['mt40-single',1600,3000,688], ['mt40-double',3200,3000,1376], ['mt40-triple',4800,3000,2064],
 ['roller-vertical',800,800,73], ['roller-vertical',2000,800,130], ['roller-vertical',800,2400,103], ['roller-vertical',2000,2400,167], ['roller-vertical',2000,2200,153],
 ['roller-single',900,2000,146.05], ['roller-single',1500,2200,166.75], ['roller-double',2700,2500,445]
 ];
 for (const [type,width,height,price] of checks) assert.equal(calculate({type,width,height,quantity:1}).unitCents,Math.round(price*100));
});
