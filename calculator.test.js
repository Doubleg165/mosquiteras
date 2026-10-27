import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, totals } from './calculator.js';
const base = { type: 'fixed', finish: 'white', width: 100, height: 120, quantity: 1, rate: 45 };
test('precio por superficie e IVA', () => { const line = calculate(base); assert.equal(line.totalCents, 5400); assert.deepEqual(totals([line]), { subtotal: 5400, tax: 1134, total: 6534 }); });
test('mínimo facturable, acabado y cantidad', () => { const line = calculate({ ...base, width: 50, height: 50, finish: 'wood', quantity: 3 }); assert.equal(line.unitCents, 5625); assert.equal(line.totalCents, 16875); });
test('rechaza medidas y cantidades inválidas', () => { for (const patch of [{ width: 0 }, { height: 301 }, { quantity: 1.5 }, { rate: NaN }, { quantity: 101 }]) assert.throws(() => calculate({ ...base, ...patch })); });
test('presupuesto vacío y suma de líneas', () => { assert.equal(totals([]).total, 0); assert.equal(totals([calculate(base), calculate(base)]).subtotal, 10800); });
